'use client'

import { useCallback, useRef, useState, type ChangeEvent, type FormEvent } from 'react'

const USER_RE = /^[A-Za-z0-9_]{1,15}$/
const EXAMPLES = ['elonmusk', 'naval', 'garyvee']

type SignalStatus = 'observed' | 'not_observed' | 'unknown'

type OverallStatus = 'clean' | 'unknown' | 'not_found' | 'flagged' | 'suspended'
type UiStatus = 'idle' | 'checking' | 'complete' | 'unknown' | 'not_found' | 'invalid'

type SignalResult = {
  id: string
  status: SignalStatus
  explanation: string
  checkedAt: string
  source: string
}

type ApiResponse = {
  username: string
  timestamp: string
  checkedAt: string
  cached?: boolean
  cacheAgeSeconds?: number
  results: SignalResult[]
  overall: OverallStatus
}

type JsonRecord = Record<string, unknown>

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isValidDateString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && Number.isFinite(Date.parse(value))
}

/** Accept an X username or a URL for a single X profile only. */
function normalizeXUsername(input: string): { username: string | null; error: string | null } {
  const value = input.trim()

  if (!value) {
    return { username: null, error: 'Enter an X username or profile URL.' }
  }

  let candidate = value

  const looksLikeUrl = /^https?:\/\//i.test(value) || /^(www\.)?(x|twitter)\.com\//i.test(value)

  if (looksLikeUrl) {
    let parsed: URL

    try {
      parsed = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`)
    } catch {
      return { username: null, error: 'Enter a valid X profile URL.' }
    }

    const allowedHosts = new Set(['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'])
    if (!allowedHosts.has(parsed.hostname.toLowerCase())) {
      return { username: null, error: 'Only x.com or twitter.com profile URLs are supported.' }
    }

    if (parsed.username || parsed.password) {
      return { username: null, error: 'Profile URLs must not contain login credentials.' }
    }

    let segments: string[]
    try {
      segments = parsed.pathname.split('/').filter(Boolean).map((part) => decodeURIComponent(part))
    } catch {
      return { username: null, error: 'The profile URL contains invalid encoding.' }
    }

    // Accept /username only. Do not accidentally treat /i/status/... or
    // /username/status/123 as a username.
    if (segments.length !== 1) {
      return { username: null, error: 'Enter a profile URL in the format https://x.com/username.' }
    }

    candidate = segments[0]
  } else {
    candidate = value.startsWith('@') ? value.slice(1) : value
  }

  candidate = candidate.trim()

  if (!USER_RE.test(candidate)) {
    return {
      username: null,
      error: 'Usernames must contain 1–15 letters, numbers, or underscores.',
    }
  }

  return { username: candidate.toLowerCase(), error: null }
}

/** Validate untrusted JSON before it is used in the UI. */
function parseApiResponse(value: unknown): ApiResponse | null {
  if (!isRecord(value)) return null

  if (
    typeof value.username !== 'string' ||
    !USER_RE.test(value.username) ||
    !isValidDateString(value.timestamp) ||
    !isValidDateString(value.checkedAt) ||
    !Array.isArray(value.results)
  ) {
    return null
  }

  const allowedOverall: OverallStatus[] = ['clean', 'unknown', 'not_found', 'flagged', 'suspended']
  if (typeof value.overall !== 'string' || !allowedOverall.includes(value.overall as OverallStatus)) {
    return null
  }

  const results: SignalResult[] = []

  for (const item of value.results) {
    if (!isRecord(item)) return null

    if (
      typeof item.id !== 'string' ||
      !['observed', 'not_observed', 'unknown'].includes(String(item.status)) ||
      typeof item.explanation !== 'string' ||
      !isValidDateString(item.checkedAt) ||
      typeof item.source !== 'string'
    ) {
      return null
    }

    results.push({
      id: item.id,
      status: item.status as SignalStatus,
      explanation: item.explanation,
      checkedAt: item.checkedAt,
      source: item.source,
    })
  }

  if (results.length === 0) return null

  if (value.cached !== undefined && typeof value.cached !== 'boolean') return null
  if (
    value.cacheAgeSeconds !== undefined &&
    (typeof value.cacheAgeSeconds !== 'number' || !Number.isFinite(value.cacheAgeSeconds) || value.cacheAgeSeconds < 0)
  ) {
    return null
  }

  return {
    username: value.username.toLowerCase(),
    timestamp: value.timestamp,
    checkedAt: value.checkedAt,
    results,
    overall: value.overall as OverallStatus,
    ...(typeof value.cached === 'boolean' ? { cached: value.cached } : {}),
    ...(typeof value.cacheAgeSeconds === 'number' ? { cacheAgeSeconds: value.cacheAgeSeconds } : {}),
  }
}

function formatTime(value: string): string {
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return 'Time unavailable'

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function formatCacheAge(seconds?: number): string {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds < 0) {
    return 'Cached result'
  }
  if (seconds < 60) return `Cached ${Math.floor(seconds)} seconds ago`
  if (seconds < 3600) return `Cached ${Math.floor(seconds / 60)} minutes ago`
  return `Cached ${Math.floor(seconds / 3600)} hours ago`
}

export default function CheckerIsland() {
  const [raw, setRaw] = useState('')
  const [status, setStatus] = useState<UiStatus>('idle')
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [error, setError] = useState('')
  const [currentUsername, setCurrentUsername] = useState('')
  const requestSequence = useRef(0)

  const check = useCallback(async (override?: string) => {
    const parsed = normalizeXUsername(override ?? raw)

    // A newer request invalidates any older response still in flight.
    const requestId = ++requestSequence.current

    setResult(null)
    setError('')
    setCurrentUsername(parsed.username ?? '')

    if (!parsed.username) {
      setStatus('invalid')
      setError(parsed.error ?? 'Enter a valid X username.')
      return
    }

    const username = parsed.username
    setStatus('checking')

    try {
      const response = await fetch(`/api/check?u=${encodeURIComponent(username)}`, {
        method: 'GET',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      })

      if (requestId !== requestSequence.current) return

      if (!response.ok) {
        const body: unknown = await response.json().catch(() => null)
        const message = isRecord(body) && typeof body.error === 'string'
          ? body.error
          : `The check could not be completed (HTTP ${response.status}).`

        setStatus('unknown')
        setError(response.status === 429
          ? `${message} Please wait before trying again.`
          : message)
        return
      }

      const body: unknown = await response.json().catch(() => null)
      const data = parseApiResponse(body)

      if (!data) {
        setStatus('unknown')
        setError('The checker returned an incomplete or unexpected response. No conclusion can be made.')
        return
      }

      // Verify identity BEFORE storing/rendering the response.
      if (data.username.toLowerCase() !== username.toLowerCase()) {
        setStatus('unknown')
        setError('The response did not match the requested username. Please try again.')
        return
      }

      if (requestId !== requestSequence.current) return

      setResult(data)
      setError('')

      // The current API no longer produces a reliable "flagged" or
      // "suspended" verdict. Treat legacy cached values as inconclusive.
      if (data.overall === 'not_found') {
        setStatus('not_found')
      } else if (data.overall === 'clean') {
        setStatus('complete')
      } else {
        setStatus('unknown')
      }
    } catch {
      if (requestId !== requestSequence.current) return
      setStatus('unknown')
      setError('The X visibility sources could not be reached. This is not evidence of an account restriction.')
    }
  }, [raw])


  return (
    <div className="mx-auto w-full max-w-2xl">
      <div
        className="mb-4 min-h-[60px]"
        aria-live="polite"
        aria-atomic="true"
        aria-busy={status === 'checking'}
      >
        {status === 'checking' && (
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4" role="status">
            <p className="font-semibold">Checking public X signals for @{currentUsername}…</p>
            <p className="mt-1 text-sm text-stone-600">This checks limited public sources and cannot confirm every type of visibility restriction.</p>
          </div>
        )}

        {status === 'complete' && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
            <p className="font-semibold">All {result?.results.length ?? 0} tested public signals were observed.</p>
            <p className="mt-1 text-sm">
              This is a limited public-signal result, not proof that the account has normal reach or recommendation eligibility.
            </p>
            <p className="mt-2 text-xs opacity-80">
              {result?.cached ? formatCacheAge(result.cacheAgeSeconds) : 'Fresh check'} · Observed {result ? formatTime(result.checkedAt) : ''}
            </p>
          </div>
        )}

        {status === 'unknown' && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
            <p className="font-semibold">Unable to establish a reliable conclusion.</p>
            <p className="mt-1 text-sm">
              {error || 'One or more public signals were missing or inconclusive. This does not prove an account restriction.'}
            </p>
            {result && (
              <p className="mt-2 text-xs opacity-80">
                {result.cached ? formatCacheAge(result.cacheAgeSeconds) : 'Fresh check'} · Checked {formatTime(result.checkedAt)}
              </p>
            )}
          </div>
        )}

        {status === 'not_found' && (
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-stone-800">
            <p className="font-semibold">The X profile endpoint returned 404.</p>
            <p className="mt-1 text-sm">The profile may be unavailable or inaccessible. This response does not establish whether the account is suspended.</p>
            {result && <p className="mt-2 text-xs text-stone-500">Checked {formatTime(result.checkedAt)}</p>}
          </div>
        )}

        {status === 'invalid' && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
            {error}
          </p>
        )}
      </div>

      <form
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          void check()
        }}
        className="flex flex-col gap-2 sm:flex-row"
        noValidate
      >
        <div className="relative min-w-0 flex-1">
          <label htmlFor="x-checker-username" className="sr-only">X username or profile URL</label>
          <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">@</span>
          <input
            id="x-checker-username"
            name="username"
            value={raw}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setRaw(event.target.value)}
            placeholder="username or x.com/username"
            aria-describedby="x-checker-help"
            aria-invalid={status === 'invalid'}
            className="h-14 w-full rounded-xl border border-gray-300 bg-white pl-8 pr-4 text-base outline-none focus:border-black focus:ring-2 focus:ring-black"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            disabled={status === 'checking'}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'checking'}
          className="h-14 rounded-xl bg-black px-8 font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'checking' ? 'Checking…' : 'Check visibility'}
        </button>
      </form>

      <p id="x-checker-help" className="mt-2 text-xs text-gray-500">
        Enter an X username or a single profile URL. No X password or login is requested.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => {
              setRaw(example)
              void check(example)
            }}
            disabled={status === 'checking'}
            className="rounded-full bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200 disabled:opacity-50"
          >
            @{example}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-500">Public sources only · Results may be inconclusive</span>
      </div>

      {result?.results && (
        <section className="mt-6" aria-labelledby="x-checker-results-heading">
          <h2 id="x-checker-results-heading" className="mb-3 text-base font-semibold">
            Public signal details for @{result.username}
          </h2>
          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            {result.results.map((signal) => {
              const isObserved = signal.status === 'observed'
              const isUnknown = signal.status === 'unknown'

              const cardClass = isObserved
                ? 'border-emerald-200 bg-emerald-50'
                : isUnknown
                  ? 'border-amber-200 bg-amber-50'
                  : 'border-stone-200 bg-stone-50'

              const dotClass = isObserved
                ? 'bg-emerald-600'
                : isUnknown
                  ? 'bg-amber-500'
                  : 'bg-stone-500'

              return (
                <article key={signal.id} className={`rounded-xl border p-4 text-left ${cardClass}`}>
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
                    <h3 className="font-semibold capitalize">{signal.id.replace(/[_-]/g, ' ')}</h3>
                  </div>
                  <p className="mt-2 text-xs font-semibold">
                    {isObserved ? 'Observed' : isUnknown ? 'Unable to verify' : 'Not observed'}
                  </p>
                  <p className="mt-2 break-words text-xs leading-relaxed">{signal.explanation}</p>
                  <p className="mt-2 break-words text-[10px] text-gray-600">Source: {signal.source}</p>
                  <p className="mt-1 text-[10px] text-gray-600">Checked: {formatTime(signal.checkedAt)}</p>
                </article>
              )
            })}
          </div>
        </section>
      )}

      <p className="mt-4 text-xs leading-relaxed text-gray-500">
        A missing search or suggestion result is not proof of a shadowban. X controls its own search and recommendation systems; this independent checker cannot inspect every internal ranking or enforcement signal.
      </p>
    </div>
  )
}
