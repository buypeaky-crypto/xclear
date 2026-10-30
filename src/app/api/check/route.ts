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
