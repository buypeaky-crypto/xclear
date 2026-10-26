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
  if (!raw) return NextResponse.json({ error: 'Username required', example: '/api/check?u=elonmusk' }, { status: 400 })
  const username = sanitize(raw)
  if (!USER_RE.test(username)) return NextResponse.json({ error: 'Invalid username', sanitized: username }, { status: 400 })

  let profile: boolean | null = null
  let search: boolean | null = null
  let suggestion: boolean | null = null
  let not_found = false
  let suspended = false

  try {
    const res = await fetch(`https://x.com/${username}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Accept-Language': 'en-US' },
      redirect: 'manual'
    })
    if (res.status === 404) { not_found = true; profile = false }
    else if (res.status === 200) {
      const text = await res.text()
      if (text.toLowerCase().includes('account suspended')) { suspended = true; profile = false }
      else profile = true
    } else profile = null
  } catch { profile = null }

  const guest = await getGuestToken()
  if (guest) {
    try {
      const res = await fetch(`https://api.twitter.com/2/search/adaptive.json?include_profile_interstitial_type=1&q=from%3A${username}&query_source=typed_query&result_type=recent&count=10`, {
        headers: { Authorization: `Bearer ${BEARER}`, 'x-guest-token': guest }
      })
      if (res.ok) {
        const data: any = await res.json()
        search = JSON.stringify(data).toLowerCase().includes(username.toLowerCase())
      } else if (res.status !== 429) search = false
    } catch { search = null }

    try {
      const res = await fetch(`https://twitter.com/i/search/typeahead.json?filters=true&result_type=users&q=${username}&src=search_box`, {
        headers: { Authorization: `Bearer ${BEARER}`, 'x-guest-token': guest, 'User-Agent': 'Mozilla/5.0' }
      })
      if (res.ok) {
        const data: any = await res.json()
        suggestion = JSON.stringify(data).toLowerCase().includes(username.toLowerCase())
      } else if (res.status !== 429) suggestion = false
    } catch { suggestion = null }
  }

  const result = {
    username,
    timestamp: new Date().toISOString(),
    profile,
    search,
    suggestion,
    search_ban: not_found || suspended ? false : (suggestion === false || search === false),
    unknown: not_found || suspended ? false : (suggestion === null || search === null),
    not_found,
    suspended,
    cached: false,
    cost: '$0 - edge + public X endpoints only'
  }

  // FREE CDN CACHE - 1h shared on Vercel edge, no Upstash, no billing
  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      'X-Cache': 'MISS-EDGE-CACHED'
    }
  })
}
