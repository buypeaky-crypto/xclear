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
  if (!USER_RE.test(username)) return NextResponse.json({ error: 'Invalid username' }, { status: 400 })

  let profile: boolean | null = null
  let search: boolean | null = null
  let suggestion: boolean | null = null
  let not_found = false
  let suspended = false

  // 1. Profile - works without guest token
  try {
    const res = await fetch(`https://x.com/${username}`, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-US' },
      redirect: 'manual'
    })
    if (res.status === 404) { not_found = true; profile = false }
    else if (res.status === 200) {
      const t = await res.text()
      if (t.toLowerCase().includes('account suspended')) { suspended = true; profile = false }
      else profile = true
    }
  } catch { profile = null }

  // 2. Try guest token path (may 429 on Vercel IP)
  const guest = await getGuestToken()
  if (guest) {
    try {
      const res = await fetch(`https://api.twitter.com/2/search/adaptive.json?q=from%3A${username}&result_type=recent&count=10`, {
        headers: { Authorization: `Bearer ${BEARER}`, 'x-guest-token': guest }
      })
      if (res.ok) {
        const data: any = await res.json()
        search = JSON.stringify(data).toLowerCase().includes(username.toLowerCase())
      } else if (res.status === 429) search = null
      else search = false
    } catch { search = null }

    try {
      const res = await fetch(`https://twitter.com/i/search/typeahead.json?result_type=users&q=${username}&src=search_box`, {
        headers: { Authorization: `Bearer ${BEARER}`, 'x-guest-token': guest, 'User-Agent': 'Mozilla/5.0' }
      })
      if (res.ok) {
        const data: any = await res.json()
        suggestion = JSON.stringify(data).toLowerCase().includes(username.toLowerCase())
      } else if (res.status === 429) suggestion = null
      else suggestion = false
    } catch { suggestion = null }
  }

  // 3. FALLBACK - no guest token? Scrape search HTML (free, no token needed)
  if (search === null) {
    try {
      const res = await fetch(`https://x.com/search?q=from%3A${username}&f=live`, {
        headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-US' }
      })
      if (res.ok) {
        const html = await res.text()
        if (html.includes('No results') || html.toLowerCase().includes('no results for')) search = false
        else if (html.toLowerCase().includes(username.toLowerCase())) search = true
        // else stay null
      }
    } catch {}
  }

  const isUnknown = suggestion === null && search === null && !not_found && !suspended
  const result = {
    username,
    timestamp: new Date().toISOString(),
    profile,
    search,
    suggestion,
    search_ban: not_found || suspended ? false : (suggestion === false || search === false),
    unknown: isUnknown,
    not_found,
    suspended,
    cost: '$0 - edge + public X',
    note: isUnknown ? 'X rate-limited Vercel IP, retry in 60s - cached 60s only' : 'cached 1h'
  }

  // Cache unknown only 60s, good results 1h - saves you from burning X quota
  const cacheAge = isUnknown ? 60 : 3600

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': `public, s-maxage=${cacheAge}, stale-while-revalidate=60`,
      'X-Cache-Age': String(cacheAge)
    }
  })
}
