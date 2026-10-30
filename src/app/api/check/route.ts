import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const USER_RE = /^[A-Za-z0-9_]{1,15}$/

// Prefer the server-side environment variable. The fallback is the existing
// public X web-client bearer value used by this integration, not a user token.
const BEARER = process.env.X_BEARER_TOKEN || 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cH5LTvJu4LA33AG9E9B0rHQs'

type SignalStatus = 'observed' | 'not_observed' | 'unknown'

type SignalResult = {
  id: string
  status: SignalStatus
  explanation: string
  checkedAt: string
  source: string
}

type RateLimitResult =
  | { allowed: true }
  | { allowed: false; reason: 'limited' | 'unavailable'; retryAfter: number }

type JsonRecord = Record<string, unknown>

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function sanitize(input: string): string {
  const value = input.trim()
  let candidate = value

  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value)
      const host = parsed.hostname.toLowerCase()
      if (!['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'].includes(host)) {
        return ''
      }
      candidate = parsed.pathname.split('/').filter(Boolean)[0] || ''
    } catch {
      return ''
    }
  } else {
    candidate = value.replace(/^@+/, '').split(/[/?#]/)[0]
  }

  return candidate.trim().toLowerCase()
}

// In-memory guest-token cache. In Edge/serverless environments this cache is
// per runtime instance, not a globally shared Redis cache.
let cachedGuest: { token: string; expires: number } | null = null

async function getGuestToken(): Promise<{ token: string | null; fromCache: boolean }> {
  const now = Date.now()

  if (cachedGuest && now < cachedGuest.expires) {
    return { token: cachedGuest.token, fromCache: true }
  }

  try {
    const res = await fetch('https://api.twitter.com/1.1/guest/activate.json', {
      method: 'POST',
      headers: { Authorization: `Bearer ${BEARER}` },
      cache: 'no-store',
    })

    if (!res.ok) {
      return { token: null, fromCache: false }
    }

    const data: unknown = await res.json()
    if (!isRecord(data) || typeof data.guest_token !== 'string' || !data.guest_token) {
      return { token: null, fromCache: false }
    }

    const token = data.guest_token
    cachedGuest = { token, expires: now + 55 * 60 * 1000 }
    return { token, fromCache: false }
  } catch {
    return { token: null, fromCache: false }
  }
}

/**
 * Typeahead is valid only when the expected users array is present.
 * An empty, correctly-shaped array means the target was not returned by this
 * limited suggestion query; it does NOT prove an account restriction.
 * An unexpected structure is unknown.
 */
function parseTypeahead(data: unknown, username: string): SignalStatus {
  if (!isRecord(data)) {
    return 'unknown'
  }

  let users: unknown[] | null = null

  if (Array.isArray(data.users)) {
    users = data.users
  } else if (isRecord(data.result) && Array.isArray(data.result.users)) {
    users = data.result.users
  }

  if (users === null) {
    return 'unknown'
  }

  if (users.length === 0) {
    return 'not_observed'
  }

  const target = username.toLowerCase()
  let malformedEntry = false

  for (const item of users) {
    if (!isRecord(item)) {
      malformedEntry = true
      continue
    }

    const possibleNames = [item.screen_name, item.screenName, item.username]
    const names = possibleNames.filter((value): value is string => typeof value === 'string')

    if (names.length === 0) {
      malformedEntry = true
      continue
    }

    if (names.some((name) => name.toLowerCase() === target)) {
      return 'observed'
    }
  }

  return malformedEntry ? 'unknown' : 'not_observed'
}

/**
 * Search is valid only when both tweet and user collections have the expected
 * object shape. If tweet authors cannot be resolved, the result is unknown.
 */
function parseSearch(data: unknown, username: string): SignalStatus {
  if (!isRecord(data)) {
    return 'unknown'
  }

  let tweets: JsonRecord | null = null
  let users: JsonRecord | null = null

  if (isRecord(data.globalObjects)) {
    const globalObjects = data.globalObjects
    if (isRecord(globalObjects.tweets) && isRecord(globalObjects.users)) {
      tweets = globalObjects.tweets
      users = globalObjects.users
    }
  }

  if (tweets === null && users === null && isRecord(data.tweets) && isRecord(data.users)) {
    tweets = data.tweets
    users = data.users
  }

  if (tweets === null || users === null) {
    return 'unknown'
  }

  const target = username.toLowerCase()
  let unresolvedAuthor = false

  for (const tweetValue of Object.values(tweets)) {
    if (!isRecord(tweetValue)) {
      unresolvedAuthor = true
      continue
    }

    const rawUserId = tweetValue.user_id_str ?? tweetValue.user_id
    if (typeof rawUserId !== 'string' && typeof rawUserId !== 'number') {
      unresolvedAuthor = true
      continue
    }

    const author = users[String(rawUserId)]
    if (!isRecord(author) || typeof author.screen_name !== 'string') {
      unresolvedAuthor = true
      continue
    }

    if (author.screen_name.toLowerCase() === target) {
      return 'observed'
    }
  }

  if (unresolvedAuthor) {
    return 'unknown'
  }

  return 'not_observed'
}

async function hashRateLimitIdentifier(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(value)
  )

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

async function rateLimitCheck(req: NextRequest): Promise<RateLimitResult> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN

  // If Redis is not configured, leave the existing middleware limiter in
  // place as the fallback. Configure Upstash in production for shared limits.
  if (!upstashUrl || !upstashToken) {
    return { allowed: true }
  }

  const cfIp = req.headers.get('cf-connecting-ip')
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const clientIp = cfIp || forwarded?.split(',')[0]?.trim() || realIp || 'anonymous'

  let identifier: string
  try {
    identifier = await hashRateLimitIdentifier(clientIp)
  } catch {
    return { allowed: false, reason: 'unavailable', retryAfter: 30 }
  }

  const key = `rl:${identifier}`
  const windowSec = 10
  const limit = 10

  try {
    const pipeRes = await fetch(`${upstashUrl.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${upstashToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['TTL', key],
      ]),
      cache: 'no-store',
    })

    if (!pipeRes.ok) {
      return { allowed: false, reason: 'unavailable', retryAfter: 30 }
    }

    const pipelineData: unknown = await pipeRes.json()
    if (!Array.isArray(pipelineData) || pipelineData.length < 2) {
      return { allowed: false, reason: 'unavailable', retryAfter: 30 }
    }

    const countResult = pipelineData[0]
    const ttlResult = pipelineData[1]
    if (!isRecord(countResult) || !isRecord(ttlResult) || countResult.error || ttlResult.error) {
      return { allowed: false, reason: 'unavailable', retryAfter: 30 }
    }

    const count = Number(countResult.result)
    const ttl = Number(ttlResult.result)
    if (!Number.isFinite(count) || count < 1 || !Number.isFinite(ttl)) {
      return { allowed: false, reason: 'unavailable', retryAfter: 30 }
    }

    // Ensure a newly-created key gets an expiry. If EXPIRE itself fails, do
    // not silently permit traffic with a potentially permanent counter key.
    if (count === 1 || ttl < 0) {
      const expireRes = await fetch(
        `${upstashUrl.replace(/\/$/, '')}/expire/${encodeURIComponent(key)}/${windowSec}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${upstashToken}` },
          cache: 'no-store',
        }
      )

      if (!expireRes.ok) {
        return { allowed: false, reason: 'unavailable', retryAfter: 30 }
      }

      const expireData: unknown = await expireRes.json()
      if (isRecord(expireData) && expireData.error) {
        return { allowed: false, reason: 'unavailable', retryAfter: 30 }
      }
    }

    if (count > limit) {
      return { allowed: false, reason: 'limited', retryAfter: Math.max(1, ttl) }
    }

    return { allowed: true }
  } catch {
    return { allowed: false, reason: 'unavailable', retryAfter: 30 }
  }
}

function apiError(message: string, code: string, status: number, retryAfter?: number) {
  const headers: Record<string, string> = { 'Cache-Control': 'no-store' }
  if (retryAfter !== undefined) {
    headers['Retry-After'] = String(retryAfter)
  }

  return NextResponse.json(
    { error: message, code, ...(retryAfter !== undefined ? { retryAfter } : {}) },
    { status, headers }
  )
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl
  const raw = url.searchParams.get('u') || url.searchParams.get('username') || ''

  if (!raw) {
    return apiError('Username required', 'missing_username', 400)
  }

  const username = sanitize(raw)
  if (!USER_RE.test(username)) {
    return apiError(
      'Invalid username — use 1-15 letters, numbers, or underscores.',
      'invalid_username',
      400
    )
  }

  // Rate-limit before cache access and before expensive upstream requests.
  const rl = await rateLimitCheck(req)
  if (!rl.allowed) {
    if (rl.reason === 'limited') {
      return apiError(
        'Too many checks. Please wait before trying again.',
        'rate_limited',
        429,
        rl.retryAfter
      )
    }

    return apiError(
      'The checker is temporarily unavailable. Please try again later.',
      'rate_limiter_unavailable',
      503,
      rl.retryAfter
    )
  }

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN
  const cacheKey = `check:${username}`

  // Check the server-side cache. A cache failure is not evidence about the
  // account; continue to a fresh check if rate limiting is still available.
  if (upstashUrl && upstashToken) {
    try {
      const cacheRes = await fetch(
        `${upstashUrl.replace(/\/$/, '')}/get/${encodeURIComponent(cacheKey)}`,
        {
          headers: { Authorization: `Bearer ${upstashToken}` },
          cache: 'no-store',
        }
      )

      if (cacheRes.ok) {
        const cacheData: unknown = await cacheRes.json()
        if (isRecord(cacheData) && typeof cacheData.result === 'string') {
          try {
            const cached: unknown = JSON.parse(cacheData.result)
            if (
              isRecord(cached) &&
              cached.username === username &&
              typeof cached.timestamp === 'string' &&
              Array.isArray(cached.results)
            ) {
              const originalTime = new Date(cached.timestamp).getTime()
              if (Number.isFinite(originalTime)) {
                return NextResponse.json(
                  {
                    ...cached,
                    cached: true,
                    cacheAgeSeconds: Math.max(0, Math.floor((Date.now() - originalTime) / 1000)),
                    timestamp: cached.timestamp,
                    checkedAt: typeof cached.checkedAt === 'string' ? cached.checkedAt : cached.timestamp,
                  },
                  { headers: { 'X-Cache': 'HIT', 'Cache-Control': 'private, no-store' } }
                )
              }
            }
          } catch {
            // Ignore malformed cache data and perform a fresh check.
          }
        }
      }
    } catch {
      // Cache failure is non-fatal; perform a fresh check.
    }
  }

  let profileStatus: SignalStatus = 'unknown'
  let profileExplanation = 'Profile check could not be completed.'
  let searchStatus: SignalStatus = 'unknown'
  let searchExplanation = 'Search check unavailable.'
  let suggestionStatus: SignalStatus = 'unknown'
  let suggestionExplanation = 'Typeahead check unavailable.'
  let notFound = false
  let guestFromCache = false

  // 1. Public profile endpoint. HTTP 200 means only that the endpoint
  // responded; it does not establish ranking or recommendation eligibility.
  try {
    const res = await fetch(`https://x.com/${encodeURIComponent(username)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept-Language': 'en-US',
      },
      redirect: 'manual',
      cache: 'no-store',
    })

    if (res.status === 404) {
      notFound = true
      profileStatus = 'not_observed'
      profileExplanation = 'X returned HTTP 404. The profile may be unavailable or inaccessible; this does not establish why.'
    } else if (res.status === 200) {
      const contentType = res.headers.get('content-type') || ''
      if (contentType.toLowerCase().includes('text/html')) {
        profileStatus = 'observed'
        profileExplanation = 'The public X profile endpoint returned an HTML response (reachability only; not proof of recommendation eligibility).'
      } else {
        profileStatus = 'unknown'
        profileExplanation = 'X returned HTTP 200 but not the expected HTML response; profile status could not be verified.'
      }
    } else {
      profileStatus = 'unknown'
      profileExplanation = `X profile endpoint returned HTTP ${res.status}; this is not evidence of a restriction.`
    }
  } catch {
    profileStatus = 'unknown'
    profileExplanation = 'The X profile request failed; profile status could not be verified.'
  }

  // 2. Search and typeahead checks. A guest-token failure is inconclusive.
  if (!notFound) {
    const { token: guest, fromCache } = await getGuestToken()
    guestFromCache = fromCache

    if (!guest) {
      searchExplanation = 'X guest token unavailable; search could not be checked.'
      suggestionExplanation = 'X guest token unavailable; typeahead could not be checked.'
    } else {
      // Search visibility
      try {
        const searchUrl = new URL('https://api.twitter.com/2/search/adaptive.json')
        searchUrl.search = new URLSearchParams({
          include_profile_interstitial_type: '1',
          include_blocking: '1',
          include_blocked_by: '1',
          include_followed_by: '1',
          include_want_retweets: '1',
          include_mute_edge: '1',
          include_can_dm: '1',
          include_can_media_tag: '1',
          include_ext_has_nft_avatar: '1',
          include_ext_is_blue_verified: '1',
          include_ext_verified_type: '1',
          q: `from:${username}`,
          query_source: 'typed_query',
          result_type: 'recent',
          count: '10',
        }).toString()

        const res = await fetch(searchUrl.toString(), {
          headers: { Authorization: `Bearer ${BEARER}`, 'x-guest-token': guest },
          cache: 'no-store',
        })

        if (!res.ok) {
          searchStatus = 'unknown'
          searchExplanation = `Search endpoint returned HTTP ${res.status}; no restriction can be inferred.`
        } else {
          const data: unknown = await res.json()
          searchStatus = parseSearch(data, username)
          searchExplanation = searchStatus === 'observed'
            ? 'A recent public post from this account was returned by the limited logged-out search query.'
            : searchStatus === 'not_observed'
              ? 'No matching post was returned by this limited search query. This can happen for several reasons and does not prove a restriction.'
              : 'The search response did not contain enough valid data to reach a conclusion.'
        }
      } catch {
        searchStatus = 'unknown'
        searchExplanation = 'The search request failed or returned invalid data.'
      }

      // Typeahead / suggestion visibility
      try {
        const typeaheadUrl = new URL('https://twitter.com/i/search/typeahead.json')
        typeaheadUrl.search = new URLSearchParams({
          filters: 'true',
          result_type: 'users',
          q: username,
          src: 'search_box',
        }).toString()

        const res = await fetch(typeaheadUrl.toString(), {
          headers: {
            Authorization: `Bearer ${BEARER}`,
            'x-guest-token': guest,
            'User-Agent': 'Mozilla/5.0',
          },
          cache: 'no-store',
        })

        if (!res.ok) {
          suggestionStatus = 'unknown'
          suggestionExplanation = `Typeahead endpoint returned HTTP ${res.status}; no restriction can be inferred.`
        } else {
          const data: unknown = await res.json()
          suggestionStatus = parseTypeahead(data, username)
          suggestionExplanation = suggestionStatus === 'observed'
            ? 'The exact username appeared in the returned logged-out typeahead suggestions.'
            : suggestionStatus === 'not_observed'
              ? 'The username was not returned in this limited typeahead response. Suggestions can be affected by relevance and other factors.'
              : 'The typeahead response did not contain enough valid data to reach a conclusion.'
        }
      } catch {
        suggestionStatus = 'unknown'
        suggestionExplanation = 'The typeahead request failed or returned invalid data.'
      }
    }
  } else {
    searchExplanation = 'Search was not run because the profile endpoint returned HTTP 404.'
    suggestionExplanation = 'Typeahead was not run because the profile endpoint returned HTTP 404.'
  }

  const checkedAt = new Date().toISOString()
  const results: SignalResult[] = [
    {
      id: 'profile',
      status: profileStatus,
      explanation: profileExplanation,
      checkedAt,
      source: 'https://x.com/{username} (logged-out profile endpoint)',
    },
    {
      id: 'search',
      status: searchStatus,
      explanation: searchExplanation,
      checkedAt,
      source: 'X logged-out adaptive search query from:{username}',
    },
    {
      id: 'suggestion',
      status: suggestionStatus,
      explanation: suggestionExplanation,
      checkedAt,
      source: 'X logged-out typeahead suggestions',
    },
  ]

  const hasUnknown = results.some((result) => result.status === 'unknown')
  const allObserved = results.length > 0 && results.every((result) => result.status === 'observed')

  // A missing result is not a confirmed shadowban. Only use "clean" when all
  // defined checks returned their expected positive signal; otherwise be
  // conservative and report unknown. No check here can confirm suspension.
  let overall: 'clean' | 'flagged' | 'unknown' | 'not_found' | 'suspended' = 'unknown'
  if (notFound) {
    overall = 'not_found'
  } else if (allObserved) {
    overall = 'clean'
  }

  const result = {
    username,
    timestamp: checkedAt,
    checkedAt,
    cached: false,
    cacheAgeSeconds: 0,
    guestTokenFromCache: guestFromCache,
    results,
    // Legacy fields: null means the corresponding condition was not
    // authoritatively established. The frontend must render null as unknown.
    profile: profileStatus === 'observed' ? true : profileStatus === 'not_observed' ? false : null,
    search: searchStatus === 'observed' ? true : searchStatus === 'not_observed' ? false : null,
    suggestion: suggestionStatus === 'observed' ? true : suggestionStatus === 'not_observed' ? false : null,
    search_ban: null,
    unknown: overall === 'unknown' || hasUnknown,
    not_found: notFound,
    suspended: null,
    private: null,
    overall,
  }

  // Store server-side cache only when Redis is configured. Cache write failure
  // does not invalidate a result already obtained from the upstream sources.
  if (upstashUrl && upstashToken) {
    try {
      const payload = encodeURIComponent(JSON.stringify(result))
      await fetch(
        `${upstashUrl.replace(/\/$/, '')}/set/${encodeURIComponent(cacheKey)}/${payload}/ex/3600`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${upstashToken}` },
          cache: 'no-store',
        }
      )
    } catch {
      // Best-effort cache write.
    }
  }

  return NextResponse.json(result, {
    headers: {
      'X-Cache': 'MISS',
      'Cache-Control': 'private, no-store',
      'X-Guest-Cache': guestFromCache ? 'HIT' : 'MISS',
    },
  })
}
