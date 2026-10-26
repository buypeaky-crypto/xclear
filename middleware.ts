import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple edge rate limit: 10 req / 10s per IP without Upstash, falls back to Upstash if env present
const mem = new Map<string, { count: number, reset: number }>()

export async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/api/check')) return NextResponse.next()

  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const cfIp = req.headers.get('cf-connecting-ip')
  const ip = cfIp || forwarded?.split(',')[0]?.trim() || realIp || 'anon'
  const key = `rl:${ip}`

  // Try Upstash if configured
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN

  if (upstashUrl && upstashToken) {
    // Upstash handled in route handler for precise sliding window, skip here
    return NextResponse.next()
  }

  // Fallback in-memory (per edge instance, better than nothing)
  const now = Date.now()
  const entry = mem.get(key)
  if (!entry || now > entry.reset) {
    mem.set(key, { count: 1, reset: now + 10_000 })
    return NextResponse.next()
  }
  if (entry.count >= 10) {
    return new NextResponse(JSON.stringify({ error: 'Rate limited', retryAfter: 30 }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': '30' }
    })
  }
  entry.count++
  return NextResponse.next()
}

export const config = {
  matcher: '/api/check/:path*'
}
