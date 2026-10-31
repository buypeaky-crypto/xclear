
'use client'

import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'

const USER_RE = /^[A-Za-z0-9_]{1,15}$/
const EXAMPLES = ['elonmusk', 'naval', 'garyvee']

type SignalStatus = 'observed' | 'not_observed' | 'unknown'

type OverallStatus =
  | 'clean'
  | 'unknown'
  | 'not_found'
  | 'flagged'
  | 'suspended'

type UiStatus =
  | 'idle'
  | 'checking'
  | 'complete'
  | 'unknown'
  | 'not_found'
  | 'invalid'

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
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  )
}

function isValidDateString(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    Number.isFinite(Date.parse(value))
  )
}

/** Accept an X username or a URL for a single X profile only. */
function normalizeXUsername(
  input: string,
): { username: string | null; error: string | null } {
  const value = input.trim()

  if (!value) {
    return {
      username: null,
      error: 'Enter an X username or profile URL.',
    }
  }

  let candidate = value

  const looksLikeUrl =
    /^https?:\/\//i.test(value) ||
    /^(www\.)?(x|twitter)\.com\//i.test(value)

  if (looksLikeUrl) {
    let parsed: URL

    try {
      parsed = new URL(
        /^https?:\/\//i.test(value) ? value : `https://${value}`,
      )
    } catch {
      return {
        username: null,
        error: 'Enter a valid X profile URL.',
      }
    }

    const allowedHosts = new Set([
      'x.com',
      'www.x.com',
      'twitter.com',
      'www.twitter.com',
    ])

    if (!allowedHosts.has(parsed.hostname.toLowerCase())) {
      return {
        username: null,
        error: 'Only x.com or twitter.com profile URLs are supported.',
      }
    }

    if (parsed.username || parsed.password) {
      return {
        username: null,
        error: 'Profile URLs must not contain login credentials.',
      }
    }

    let segments: string[]

    try {
      segments = parsed.pathname
        .split('/')
        .filter(Boolean)
        .map((part) => decodeURIComponent(part))
    } catch {
      return {
        username: null,
        error: 'The profile URL contains invalid encoding.',
      }
    }

    if (segments.length !== 1) {
      return {
        username: null,
        error:
          'Enter a profile URL in the format https://x.com/username.',
      }
    }

    candidate = segments[0]
  } else {
    candidate = value.startsWith('@') ? value.slice(1) : value
  }

  candidate = candidate.trim()

  if (!USER_RE.test(candidate)) {
    return {
      username: null,
      error:
        'Usernames must contain 1–15 letters, numbers, or underscores.',
    }
  }

  return {
    username: candidate.toLowerCase(),
    error: null,
  }
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

  const allowedOverall: OverallStatus[] = [
    'clean',
    'unknown',
    'not_found',
    'flagged',
    'suspended',
  ]

  if (
    typeof value.overall !== 'string' ||
    !allowedOverall.includes(value.overall as OverallStatus)
  ) {
    return null
  }

  const results: SignalResult[] = []

  for (const item of value.results) {
    if (!isRecord(item)) return null

    if (
      typeof item.id !== 'string' ||
      !['observed', 'not_observed', 'unknown'].includes(
        String(item.status),
      ) ||
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

  if (
    value.cached !== undefined &&
    typeof value.cached !== 'boolean'
  ) {
    return null
  }

  if (
    value.cacheAgeSeconds !== undefined &&
    (
      typeof value.cacheAgeSeconds !== 'number' ||
      !Number.isFinite(value.cacheAgeSeconds) ||
      value.cacheAgeSeconds < 0
    )
  ) {
    return null
  }

  return {
    username: value.username.toLowerCase(),
    timestamp: value.timestamp,
    checkedAt: value.checkedAt,
    results,
    overall: value.overall as OverallStatus,
    ...(typeof value.cached === 'boolean'
      ? { cached: value.cached }
      : {}),
    ...(typeof value.cacheAgeSeconds === 'number'
      ? { cacheAgeSeconds: value.cacheAgeSeconds }
      : {}),
  }
}

function formatTime(value: string): string {
  const date = new Date(value)

  if (!Number.isFinite(date.getTime())) {
    return 'Time unavailable'
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function formatCacheAge(seconds?: number): string {
  if (
    typeof seconds !== 'number' ||
    !Number.isFinite(seconds) ||
    seconds < 0
  ) {
    return 'Cached result'
  }

  if (seconds < 60) {
    return `Cached ${Math.floor(seconds)} seconds ago`
  }

  if (seconds < 3600) {
    return `Cached ${Math.floor(seconds / 60)} minutes ago`
  }

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
      const response = await fetch(
        `/api/check?u=${encodeURIComponent(username)}`,
        {
          method: 'GET',
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        },
      )

      if (requestId !== requestSequence.current) return

      if (!response.ok) {
        const body: unknown = await response.json().catch(() => null)

        const message =
          isRecord(body) && typeof body.error === 'string'
            ? body.error
            : `The check could not be completed (HTTP ${response.status}).`

        setStatus('unknown')
        setError(
          response.status === 429
            ? `${message} Please wait before trying again.`
            : message,
        )
        return
      }

      const body: unknown = await response.json().catch(() => null)
      const data = parseApiResponse(body)

      if (!data) {
        setStatus('unknown')
        setError(
          'The checker returned an incomplete or unexpected response. No conclusion can be made.',
        )
        return
      }

      if (data.username.toLowerCase() !== username.toLowerCase()) {
        setStatus('unknown')
        setError(
          'The response did not match the requested username. Please try again.',
        )
        return
      }

      if (requestId !== requestSequence.current) return

      setResult(data)
      setError('')

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
      setError(
        'The X visibility sources could not be reached. This is not evidence of an account restriction.',
      )
    }
  }, [raw])

  const observedCount =
    result?.results.filter((signal) => signal.status === 'observed')
      .length ?? 0

  const notObservedCount =
    result?.results.filter(
      (signal) => signal.status === 'not_observed',
    ).length ?? 0

  const unknownCount =
    result?.results.filter((signal) => signal.status === 'unknown')
      .length ?? 0

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      <section
        aria-labelledby="x-visibility-console-title"
        className="overflow-hidden rounded-2xl border border-[#2f3336] bg-[#0f1419] text-white shadow-[0_16px_45px_rgba(15,20,25,0.16)]"
      >
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="grid h-11 w-11 place-items-center rounded-xl bg-white text-2xl font-black text-black"
            >
              𝕏
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b98a5]">
                X Visibility Console
              </p>
              <h2
                id="x-visibility-console-title"
                className="mt-1 text-lg font-bold tracking-tight text-white"
              >
                Check an X profile
              </h2>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#c5d0d9]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1d9bf0]" />
            Public signals only
          </span>
        </header>

        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <p className="max-w-xl text-sm leading-6 text-[#c5d0d9]">
            Review selected public profile, search and suggestion
            signals. No X password, login or private account access
            is required.
          </p>

          <form
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault()
              void check()
            }}
            className="mt-5 space-y-3"
            noValidate
          >
            <label
              htmlFor="x-checker-username"
              className="block text-xs font-semibold text-[#c5d0d9]"
            >
              X username or profile URL
            </label>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#657786]"
                >
                  @
                </span>

                <input
                  id="x-checker-username"
                  name="username"
                  value={raw}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setRaw(event.target.value)
                  }
                  placeholder="username or x.com/username"
                  aria-describedby="x-checker-help"
                  aria-invalid={status === 'invalid'}
                  className="h-14 w-full rounded-xl border border-[#536471] bg-[#19232d] pl-9 pr-4 text-base text-white outline-none transition placeholder:text-[#8899a6] focus:border-[#1d9bf0] focus:ring-2 focus:ring-[#1d9bf0]/30"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  disabled={status === 'checking'}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'checking'}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-[#1d9bf0] px-6 text-sm font-bold text-white transition hover:bg-[#1689d4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1419] disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-44"
              >
                {status === 'checking' ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    />
                    Checking…
                  </>
                ) : (
                  'Check visibility'
                )}
              </button>
            </div>

            <p
              id="x-checker-help"
              className="text-xs leading-5 text-[#8899a6]"
            >
              Enter an X username or a single profile URL. Usernames
              can contain letters, numbers and underscores.
            </p>
          </form>

          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8899a6]">
              Try an example
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
                  className="rounded-full border border-[#536471] bg-[#19232d] px-3 py-1.5 text-xs font-medium text-[#d7e0e8] transition hover:border-[#1d9bf0] hover:bg-[#223344] disabled:opacity-50"
                  aria-label={`Run an example check for @${example}`}
                >
                  @{example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div
        aria-live="polite"
        aria-atomic="true"
        aria-busy={status === 'checking'}
      >
        {status === 'checking' && (
          <div
            className="rounded-2xl border border-[#1d9bf0]/30 bg-[#eaf5fd] p-4 text-[#123d5a]"
            role="status"
          >
            <p className="font-semibold">
              Checking public X signals for @{currentUsername}…
            </p>
            <p className="mt-1 text-sm leading-6">
              Reviewing limited public sources. This check cannot
              confirm every type of visibility restriction.
            </p>
          </div>
        )}

        {status === 'complete' && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800"
              >
                ✓
              </span>
              <div>
                <p className="font-bold">
                  All {result?.results.length ?? 0} tested public signals
                  were observed.
                </p>
                <p className="mt-1 text-sm leading-6">
                  This is a limited public-signal result, not proof
                  that the account has normal reach or recommendation
                  eligibility.
                </p>
              </div>
            </div>
            <p className="mt-3 border-t border-emerald-200 pt-3 text-xs text-emerald-800">
              {result?.cached
                ? formatCacheAge(result.cacheAgeSeconds)
                : 'Fresh check'}
              {' · '}
              Observed {result ? formatTime(result.checkedAt) : ''}
            </p>
          </div>
        )}

        {status === 'unknown' && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amber-100 text-sm font-bold text-amber-800"
              >
                !
              </span>
              <div>
                <p className="font-bold">
                  Unable to establish a reliable conclusion.
                </p>
                <p className="mt-1 text-sm leading-6">
                  {error ||
                    'One or more public signals were missing or inconclusive. This does not prove an account restriction.'}
                </p>
              </div>
            </div>
            {result && (
              <p className="mt-3 border-t border-amber-200 pt-3 text-xs text-amber-800">
                {result.cached
                  ? formatCacheAge(result.cacheAgeSeconds)
                  : 'Fresh check'}
                {' · '}
                Checked {formatTime(result.checkedAt)}
              </p>
            )}
          </div>
        )}

        {status === 'not_found' && (
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5 text-stone-800">
            <p className="font-bold">
              The X profile endpoint returned 404.
            </p>
            <p className="mt-1 text-sm leading-6">
              The profile may be unavailable or inaccessible. This
              response does not establish whether the account is
              suspended.
            </p>
            {result && (
              <p className="mt-3 text-xs text-stone-500">
                Checked {formatTime(result.checkedAt)}
              </p>
            )}
          </div>
        )}

        {status === 'invalid' && (
          <p
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>

      {result?.results && (
        <section
          className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
          aria-labelledby="x-checker-results-heading"
        >
          <header className="border-b border-stone-200 px-5 py-5 sm:px-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1d9bf0]">
              Evidence summary
            </p>

            <h2
              id="x-checker-results-heading"
              className="mt-1 text-lg font-bold tracking-tight text-stone-900"
            >
              Public signal details for @{result.username}
            </h2>

            <p className="mt-1 text-xs text-stone-500">
              Checked {formatTime(result.checkedAt)}
            </p>
          </header>

          <div className="grid grid-cols-3 divide-x divide-stone-200 border-b border-stone-200">
            <div className="px-3 py-4 text-center">
              <p className="text-2xl font-black tabular-nums text-emerald-700">
                {observedCount}
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-stone-500 sm:text-xs">
                Observed
              </p>
            </div>

            <div className="px-3 py-4 text-center">
              <p className="text-2xl font-black tabular-nums text-stone-700">
                {notObservedCount}
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-stone-500 sm:text-xs">
                Not observed
              </p>
            </div>

            <div className="px-3 py-4 text-center">
              <p className="text-2xl font-black tabular-nums text-amber-700">
                {unknownCount}
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-stone-500 sm:text-xs">
                Unable to verify
              </p>
            </div>
          </div>

          <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
            {result.results.map((signal) => {
              const isObserved = signal.status === 'observed'
              const isUnknown = signal.status === 'unknown'

              const cardClass = isObserved
                ? 'border-emerald-200 bg-emerald-50/70'
                : isUnknown
                  ? 'border-amber-200 bg-amber-50/70'
                  : 'border-stone-200 bg-stone-50'

              const dotClass = isObserved
                ? 'bg-emerald-600'
                : isUnknown
                  ? 'bg-amber-500'
                  : 'bg-stone-500'

              const statusLabel = isObserved
                ? 'Observed'
                : isUnknown
                  ? 'Unable to verify'
                  : 'Not observed'

              return (
                <article
                  key={signal.id}
                  className={`rounded-xl border p-4 ${cardClass}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClass}`}
                      />
                      <h3 className="truncate text-sm font-bold capitalize text-stone-900">
                        {signal.id.replace(/[_-]/g, ' ')}
                      </h3>
                    </div>

                    <span className="shrink-0 rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold text-stone-700">
                      {statusLabel}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-6 text-stone-700">
                    {signal.explanation}
                  </p>

                  <div className="mt-3 space-y-1 border-t border-stone-200/80 pt-3">
                    <p className="break-words text-[10px] leading-5 text-stone-600">
                      <span className="font-semibold">Source:</span>{' '}
                      {signal.source}
                    </p>
                    <p className="text-[10px] text-stone-500">
                      Checked: {formatTime(signal.checkedAt)}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="border-t border-stone-200 bg-stone-50 px-5 py-4">
            <h3 className="text-xs font-bold text-stone-800">
              How to read this summary
            </h3>
            <p className="mt-1 text-xs leading-6 text-stone-600">
              Observed means the expected public signal was returned.
              Not observed means the expected signal was not returned
              in that test. Unable to verify means the source did not
              provide enough reliable information. None of these
              labels alone proves a shadowban.
            </p>
          </div>
        </section>
      )}

      <aside className="rounded-xl border border-stone-200 bg-white/80 px-4 py-3">
        <p className="text-xs leading-6 text-stone-600">
          <strong className="text-stone-800">Important:</strong>{' '}
          A missing search or suggestion result is not proof of a
          shadowban. X controls its own search and recommendation
          systems. This independent checker cannot inspect every
          internal ranking or enforcement signal.
        </p>
      </aside>
    </div>
  )
}
