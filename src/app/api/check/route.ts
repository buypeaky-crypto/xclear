import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Validation inline to avoid import issues
const USER_RE = /^[A-Za-z0-9_]{1,15}$/
function sanitize(input: string): string {
  return input.trim().replace(/^@+/, '').replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//i, '').split('/')[0].split('?')[0].trim().toLowerCase()
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl
  // Accept ?u=, ?username=, ?handle=, ?q=
  const raw = url.searchParams.get('u') || url.searchParams.get('username') || url.searchParams.get('handle') || url.searchParams.get('q') || ''
  
  if (!raw) {
    return NextResponse.json({ error: 'Username required', example: '/api/check?u=elonmusk' }, { status: 400 })
  }

  const username = sanitize(raw)
  if (!USER_RE.test(username)) {
    return NextResponse.json({ error: 'Invalid username. Use 1-15 chars: letters, numbers, underscore', sanitized: username }, { status: 400 })
  }

  // --- REAL SHARED CACHE (Upstash Redis if configured, else in-memory with s-maxage header) ---
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN

  const cacheKey = `check:${username}`

  // Try Upstash
  if (upstashUrl && upstashToken) {
    try {
      const res = await fetch(`${upstashUrl}/get/${cacheKey}`, {
        headers: { Authorization: `Bearer ${upstashToken}` },
        next: { revalidate: 0 }
      })
      const data = await res.json()
      if (data.result) {
        const parsed = JSON.parse(data.result)
        return NextResponse.json(parsed, {
          headers: {
            'X-Cache': 'HIT',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600'
          }
        })
      }
    } catch {}
  }

  // --- YOUR EXISTING CHECK LOGIC HERE ---
  // Keep your existing X scraping calls, but wrap result:
  // For now, return mock structure that your frontend expects
  // REPLACE this block with your actual typeahead/search/profile fetches
  
  let result: any = {}
  try {
    // Example: fetch X public endpoints (you have this logic already)
    // const [suggestion, search, profile] = await Promise.all([...])
    // For demo, mark as unknown until real fetches re-added
    
    // TODO: PASTE YOUR EXISTING FETCH LOGIC HERE
    // If you paste old code, keep this structure:
    result = {
      username,
      timestamp: new Date().toISOString(),
      // These booleans drive the traffic light
      suggestion: null, // true = found, false = missing, null = unknown/rate-limited
      search: null,
      profile: true,
      search_ban: false,
      unknown: true, // set true if X rate-limited
      cached: false
    }
    
    // After you add real checks, override search_ban logic:
    // result.search_ban = (result.suggestion === false || result.search === false)
    
  } catch (e: any) {
    result = { username, error: 'Upstream X rate-limited', unknown: true }
  }

  // Save to Upstash
  if (upstashUrl && upstashToken) {
    try {
      await fetch(`${upstashUrl}/set/${cacheKey}/${encodeURIComponent(JSON.stringify(result))}/ex/3600`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${upstashToken}` }
      })
    } catch {}
  }

  return NextResponse.json(result, {
    headers: {
      'X-Cache': 'MISS',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600'
    }
  })
}
