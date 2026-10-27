import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'edge'

const USER_RE = /^[A-Za-z0-9_]{1,15}$/
const BEARER = 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cH5LTvJu4LA33AG9E9B0rHQs'

type SignalStatus = "observed" | "not_observed" | "unknown"
type SignalResult = {
  id: string
  status: SignalStatus
  explanation: string
  checkedAt: string
  source: string
}

function sanitize(input: string): string {
  return input.trim().replace(/^@+/, '').replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//i, '').split('/')[0].split('?')[0].trim().toLowerCase()
}

// In-memory guest token cache - 1h as documented
let cachedGuest: { token: string, expires: number } | null = null

async function getGuestToken(): Promise<{ token: string | null, fromCache: boolean }> {
  const now = Date.now()
  if (cachedGuest && now < cachedGuest.expires) {
    return { token: cachedGuest.token, fromCache: true }
  }
  try {
    const res = await fetch('https://api.twitter.com/1.1/guest/activate.json', {
      method: 'POST',
      headers: { Authorization: `Bearer ${BEARER}` }
    })
    if (!res.ok) return { token: null, fromCache: false }
    const data: any = await res.json()
    const token = data.guest_token || null
    if (token) {
      cachedGuest = { token, expires: now + 55 * 60 * 1000 } // 55m cache
    }
    return { token, fromCache: false }
  } catch { return { token: null, fromCache: false } }
}

function parseTypeahead(data: any, username: string): SignalStatus {
  try {
    const lower = username.toLowerCase()
    // Parse actual structure: { users: [{ screen_name }] } or { num_results, users }
    const users = data?.users || data?.result?.users || []
    if (Array.isArray(users) && users.length > 0) {
      const exact = users.some((u: any) => {
        const sn = (u.screen_name || u.screenName || u.username || '').toLowerCase()
        return sn === lower
      })
      return exact ? "observed" : "not_observed"
    }
    // Fallback: if response valid but no exact match
    if (data && typeof data === 'object') {
      return "not_observed"
    }
    return "unknown"
  } catch {
    return "unknown"
  }
}

function parseSearch(data: any, username: string): SignalStatus {
  try {
    const lower = username.toLowerCase()
    // adaptive.json returns tweets keyed by id, plus globalObjects.users
    const tweets = data?.globalObjects?.tweets || data?.tweets || {}
    const users = data?.globalObjects?.users || {}
    // Check if any tweet author matches username
    for (const t of Object.values(tweets as any)) {
      const userId = (t as any)?.user_id_str || (t as any)?.user_id
      if (userId && users[userId]) {
        const sn = (users[userId].screen_name || '').toLowerCase()
        if (sn === lower) return "observed"
      }
    }
    // No tweets found but response valid
    if (data && typeof data === 'object') {
      return "not_observed"
    }
    return "unknown"
  } catch {
    return "unknown"
  }
}

async function rateLimitCheck(req: NextRequest): Promise<{ allowed: boolean, retryAfter?: number }> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN
  const forwarded = req.headers.get('x-forwarded-for')
  const cfIp = req.headers.get('cf-connecting-ip')
  const realIp = req.headers.get('x-real-ip')
  const ip = cfIp || forwarded?.split(',')[0]?.trim() || realIp || 'anon'
  const key = `rl:${ip}`
  const windowSec = 10
  const limit = 10

  if (upstashUrl && upstashToken) {
    try {
      // Atomic INCR + EXPIRE via pipeline
      const pipeRes = await fetch(`${upstashUrl}/pipeline`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${upstashToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify([["INCR", key], ["TTL", key]]),
        cache: 'no-store'
      })
      if (pipeRes.ok) {
        const arr: any = await pipeRes.json()
        const count = arr?.[0]?.result ?? 1
        const ttl = arr?.[1]?.result ?? -1
        if (count === 1 || ttl === -1) {
          await fetch(`${upstashUrl}/expire/${key}/${windowSec}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${upstashToken}` },
            cache: 'no-store'
          })
        }
        if (count > limit) {
          return { allowed: false, retryAfter: 30 }
        }
      }
    } catch {
      // Fall through to allow but log - don't fail open to abuse
    }
  }
  return { allowed: true }
}

export async function GET(req: NextRequest) {
  // P0: Rate limit BEFORE expensive upstream calls
  const rl = await rateLimitCheck(req)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Rate limited — 10 checks per 10 seconds. Cached 1h. Try again in 30s.', retryAfter: rl.retryAfter }, { status: 429, headers: { 'Retry-After': '30' } })
  }

  const url = req.nextUrl
  const raw = url.searchParams.get('u') || url.searchParams.get('username') || ''
  if (!raw) return NextResponse.json({ error: 'Username required', code: 'missing_username' }, { status: 400 })
  const username = sanitize(raw)
  if (!USER_RE.test(username)) return NextResponse.json({ error: 'Invalid username — 1-15 chars, letters, numbers, underscore only', sanitized: username, code: 'invalid_username' }, { status: 400 })

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN
  const cacheKey = `check:${username}`
  const nowIso = new Date().toISOString()

  // Check cache
  if (upstashUrl && upstashToken) {
    try {
      const r = await fetch(`${upstashUrl}/get/${cacheKey}`, { headers: { Authorization: `Bearer ${upstashToken}` }, cache: 'no-store' })
      const j: any = await r.json()
      if (j.result) {
        const cached = JSON.parse(j.result)
        // Return accurate cache indicator per audit Finding 2.5
        return NextResponse.json({ 
          ...cached, 
          cached: true, 
          cacheAgeSeconds: Math.floor((Date.now() - new Date(cached.timestamp).getTime())/1000),
          timestamp: cached.timestamp // original observation time preserved
        }, { headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600' } })
      }
    } catch {}
  }

  let profileStatus: SignalStatus = "unknown"
  let profileExplanation = "Profile check could not be completed"
  let searchStatus: SignalStatus = "unknown"
  let searchExplanation = "Search check unavailable"
  let suggestionStatus: SignalStatus = "unknown"
  let suggestionExplanation = "Typeahead check unavailable"
  let not_found = false
  let suspended = false
  let guestFromCache = false

  // 1. Profile check - logged out fetch to x.com/{username}
  try {
    const res = await fetch(`https://x.com/${username}`, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-US' },
      redirect: 'manual'
    })
    if (res.status === 404) { 
      not_found = true
      profileStatus = "not_observed"
      profileExplanation = "Profile not found (404)"
    } else if (res.status === 200) {
      const text = await res.text()
      if (text.includes('Account suspended') || text.includes('suspended')) { 
        suspended = true
        profileStatus = "not_observed"
        profileExplanation = "Account suspended"
      } else {
        profileStatus = "observed"
        profileExplanation = "Public profile reachable (logged-out)"
      }
    } else if (res.status >= 400 && res.status < 600) {
      // HTTP error is NOT evidence of ban per audit Finding 2.1
      profileStatus = "unknown"
      profileExplanation = `Profile endpoint returned HTTP ${res.status} — treated as unknown, not a ban`
    }
  } catch (e) {
    profileStatus = "unknown"
    profileExplanation = "Profile endpoint failed — unknown, not a ban proof"
  }

  // 2. Search + Suggestion need guest token
  const { token: guest, fromCache } = await getGuestToken()
  guestFromCache = fromCache

  if (!guest) {
    searchExplanation = "Guest token unavailable — X rate-limited, marked unknown"
    suggestionExplanation = "Guest token unavailable — X rate-limited, marked unknown"
  } else if (!not_found && !suspended) {
    // Search visibility - only if profile exists
    try {
      const res = await fetch(`https://api.twitter.com/2/search/adaptive.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&include_ext_has_nft_avatar=1&include_ext_is_blue_verified=1&include_ext_verified_type=1&q=from%3A${username}&query_source=typed_query&result_type=recent&count=10`, {
        headers: { Authorization: `Bearer ${BEARER}`, 'x-guest-token': guest }
      })
      if (!res.ok) {
        if (res.status === 429) {
          searchStatus = "unknown"
          searchExplanation = "Search rate-limited (429) — unknown"
        } else {
          // P0 fix: HTTP error -> unknown, NOT false/flagged
          searchStatus = "unknown"
          searchExplanation = `Search endpoint HTTP ${res.status} — unknown, not evidence of restriction`
        }
      } else {
        const data: any = await res.json()
        const parsed = parseSearch(data, username)
        searchStatus = parsed
        searchExplanation = parsed === "observed" ? "Found recent public post from account in logged-out search" : parsed === "not_observed" ? "No recent public posts found for this handle in this limited search window (may be new, quiet, or not indexed)" : "Search response could not be parsed — unknown"
      }
    } catch {
      searchStatus = "unknown"
      searchExplanation = "Search request failed — unknown"
    }

    // Suggestion / typeahead - exact match required per audit Finding 2.2
    try {
      const res = await fetch(`https://twitter.com/i/search/typeahead.json?filters=true&result_type=users&q=${username}&src=search_box`, {
        headers: { Authorization: `Bearer ${BEARER}`, 'x-guest-token': guest, 'User-Agent': 'Mozilla/5.0' }
      })
      if (!res.ok) {
        if (res.status === 429) {
          suggestionStatus = "unknown"
          suggestionExplanation = "Typeahead rate-limited (429) — unknown"
        } else {
          suggestionStatus = "unknown"
          suggestionExplanation = `Typeahead endpoint HTTP ${res.status} — unknown, not a ban`
        }
      } else {
        const data: any = await res.json()
        const parsed = parseTypeahead(data, username)
        suggestionStatus = parsed
        suggestionExplanation = parsed === "observed" ? "Exact username found in typeahead suggestions (logged-out)" : parsed === "not_observed" ? "Username not in top typeahead suggestions — can happen due to personalization, query matching, or popularity" : "Typeahead response could not be parsed — unknown"
      }
    } catch {
      suggestionStatus = "unknown"
      suggestionExplanation = "Typeahead request failed — unknown"
    }
  }

  const checkedAt = nowIso
  const results: SignalResult[] = [
    { id: "profile", status: profileStatus === "observed" ? "observed" : profileStatus === "not_observed" ? "not_observed" : "unknown", explanation: profileExplanation, checkedAt, source: "https://x.com/{username} logged-out" },
    { id: "search", status: searchStatus, explanation: searchExplanation, checkedAt, source: "api.twitter.com/2/search/adaptive.json from:{username}" },
    { id: "suggestion", status: suggestionStatus, explanation: suggestionExplanation, checkedAt, source: "twitter.com/i/search/typeahead.json" },
  ]

  // P0 fix: Never convert unknown into ban. Only observed/not_observed count
  const hasNegativeSignal = results.some(r => r.status === "not_observed")
  const hasUnknown = results.some(r => r.status === "unknown")
  const allObserved = results.every(r => r.status === "observed")

  let overall: "clean" | "flagged" | "unknown" | "not_found" | "suspended" = "unknown"
  if (not_found) overall = "not_found"
  else if (suspended) overall = "suspended"
  else if (allObserved) overall = "clean"
  else if (hasNegativeSignal) overall = "flagged"
  else overall = "unknown"

  const result = {
    username,
    timestamp: checkedAt,
    checkedAt,
    cached: false,
    cacheAgeSeconds: 0,
    guestTokenFromCache: guestFromCache,
    results,
    // Legacy fields for backward compat but now accurate
    profile: profileStatus === "observed" ? true : profileStatus === "not_observed" ? false : null,
    search: searchStatus === "observed" ? true : searchStatus === "not_observed" ? false : null,
    suggestion: suggestionStatus === "observed" ? true : suggestionStatus === "not_observed" ? false : null,
    search_ban: overall === "flagged",
    unknown: overall === "unknown" || hasUnknown,
    not_found,
    suspended,
    private: false,
    overall
  }

  if (upstashUrl && upstashToken) {
    try {
      await fetch(`${upstashUrl}/set/${cacheKey}/${encodeURIComponent(JSON.stringify(result))}/ex/3600`, {
        method: 'POST', headers: { Authorization: `Bearer ${upstashToken}` }
      })
    } catch {}
  }

  return NextResponse.json(result, {
    headers: { 'X-Cache': 'MISS', 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600', 'X-Guest-Cache': guestFromCache ? 'HIT' : 'MISS' }
  })
}
