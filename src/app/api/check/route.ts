import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'edge'

const USER_RE = /^[A-Za-z0-9_]{1,15}$/
const BEARER = 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cH5LTvJu4LA33AG9E9BO39HQs'

function sanitize(input: string): string {
  return input.trim().replace(/^@+/, '').replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//i, '').split('/')[0].split('?')[0].trim().toLowerCase()
}

async function getGuestToken(): Promise<string | null> {
  try {
    const res = await fetch('https://api.twitter.com/1.1/guest/activate.json', {
      method: 'POST',
      headers: { Authorization: `Bearer ${BEARER}` }
    })
    if (!res.ok) return null
    const data: any = await res.json()
    return data.guest_token || null
  } catch { return null }
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl
  const raw = url.searchParams.get('u') || url.searchParams.get('username') || url.searchParams.get('handle') || url.searchParams.get('q') || ''
  if (!raw) return NextResponse.json({ error: 'Username required' }, { status: 400 })
  const username = sanitize(raw)
  if (!USER_RE.test(username)) return NextResponse.json({ error: 'Invalid username', sanitized: username }, { status: 400 })

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN
  const cacheKey = `check:${username}`

  if (upstashUrl && upstashToken) {
    try {
      const r = await fetch(`${upstashUrl}/get/${cacheKey}`, { headers: { Authorization: `Bearer ${upstashToken}` }, cache: 'no-store' })
      const j: any = await r.json()
      if (j.result) return NextResponse.json(JSON.parse(j.result), { headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, s-maxage=3600' } })
    } catch {}
  }

  let profile: boolean | null = null
  let search: boolean | null = null
  let suggestion: boolean | null = null
  let not_found = false
  let suspended = false

  // 1. Profile check - logged out fetch to x.com/{username}
  try {
    const res = await fetch(`https://x.com/${username}`, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-US' },
      redirect: 'manual'
    })
    if (res.status === 404) { not_found = true; profile = false }
    else if (res.status === 200) {
      const text = await res.text()
      if (text.includes('Account suspended') || text.includes('suspended')) { suspended = true; profile = false }
      else profile = true
    } else profile = null
  } catch { profile = null }

  // 2. Search + Suggestion need guest token
  const guest = await getGuestToken()
  if (guest) {
    // Search visibility
    try {
      const res = await fetch(`https://api.twitter.com/2/search/adaptive.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&include_ext_has_nft_avatar=1&include_ext_is_blue_verified=1&include_ext_verified_type=1&q=from%3A${username}&query_source=typed_query&result_type=recent&count=10`, {
        headers: { Authorization: `Bearer ${BEARER}`, 'x-guest-token': guest }
      })
      if (res.ok) {
        const data: any = await res.json()
        const jsonStr = JSON.stringify(data).toLowerCase()
        search = jsonStr.includes(username.toLowerCase())
      } else if (res.status === 429) search = null
      else search = false
    } catch { search = null }

    // Suggestion / typeahead
    try {
      const res = await fetch(`https://twitter.com/i/search/typeahead.json?filters=true&result_type=users&q=${username}&src=search_box`, {
        headers: { Authorization: `Bearer ${BEARER}`, 'x-guest-token': guest, 'User-Agent': 'Mozilla/5.0' }
      })
      if (res.ok) {
        const data: any = await res.json()
        const users = data.users || data.users || []
        const lower = username.toLowerCase()
        const found = JSON.stringify(data).toLowerCase().includes(lower)
        // More precise: check screen_names
        const hasExact = users.some((u: any) => (u.screen_name || u.screenName || '').toLowerCase() === lower) || found
        suggestion = hasExact
      } else if (res.status === 429) suggestion = null
      else suggestion = false
    } catch { suggestion = null }
  }

  const search_ban = suggestion === false || search === false
  const unknown = suggestion === null || search === null

  const result = {
    username,
    timestamp: new Date().toISOString(),
    profile,
    search,
    suggestion,
    search_ban: not_found || suspended ? false : search_ban,
    unknown: not_found || suspended ? false : unknown,
    not_found,
    suspended,
    private: false,
    cached: false
  }

  if (upstashUrl && upstashToken) {
    try {
      await fetch(`${upstashUrl}/set/${cacheKey}/${encodeURIComponent(JSON.stringify(result))}/ex/3600`, {
        method: 'POST', headers: { Authorization: `Bearer ${upstashToken}` }
      })
    } catch {}
  }

  return NextResponse.json(result, {
    headers: { 'X-Cache': 'MISS', 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600' }
  })
}
