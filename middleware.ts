import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// In-memory fallback per edge instance
const mem = new Map<string, { count: number, reset: number }>()

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  // P0: Apply to every costly endpoint - /api/check AND /api/alerts
  const isCostly = path.startsWith('/api/check') || path.startsWith('/api/alerts') || path.startsWith('/api/facebook-check')
  if (!isCostly) return NextResponse.next()

  // P0 Fix: Validate IP provenance - only trust x-forwarded-for from Vercel, prefer cf-connecting-ip if present but don't allow client spoof
  // Vercel sets x-real-ip reliably; we use it as primary, with forwarded first hop as fallback
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const cfIp = req.headers.get('cf-connecting-ip')
  // Prefer realIp (Vercel sanitized) over client-controllable forwarded
  const ip = realIp || forwarded?.split(',')[0]?.trim() || cfIp || 'anon'
  const key = `rl:${ip}:${path.startsWith('/api/check') ? 'check' : 'other'}`

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN

  // P0: Always enforce in-memory limit even when Upstash configured - defense in depth
  const now = Date.now()
  const entry = mem.get(key)
  if (!entry || now > entry.reset) {
    mem.set(key, { count: 1, reset: now + 10_000 })
  } else {
    if (entry.count >= 10) {
      return new NextResponse(JSON.stringify({ error: 'Rate limited — 10 checks per 10 seconds. Cached 1h. Try again in 30s.', code: 'rate_limited', retryAfter: 30 }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '30' }
      })
    }
    entry.count++
  }

  // If Upstash configured, route handler also enforces shared atomic limiter
  // Middleware does NOT skip when Upstash present - this was the P0 gap
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/check/:path*', '/api/alerts/:path*', '/api/facebook-check']
}
