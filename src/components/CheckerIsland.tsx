'use client'
import { useState, useCallback } from 'react'

const USER_RE = /^[A-Za-z0-9_]{1,15}$/
const EXAMPLES = ['elonmusk', 'naval', 'garyvee']

type Status = 'idle' | 'checking' | 'clean' | 'flagged' | 'unknown' | 'private' | 'suspended' | 'not_found' | 'invalid'

type SignalStatus = "observed" | "not_observed" | "unknown"
type SignalResult = { id: string, status: SignalStatus, explanation: string, checkedAt: string, source: string }

type ApiResponse = {
  username: string
  timestamp: string
  cached?: boolean
  cacheAgeSeconds?: number
  results?: SignalResult[]
  overall?: "clean" | "flagged" | "unknown" | "not_found" | "suspended"
  error?: string
  code?: string
}

function sanitize(input: string): string {
  return input.trim().replace(/^@+/, '').replace(/^https?:\/\/(www\.)?(x|twitter|tiktok|instagram|youtube)\.com\//i, '').split('/')[0].split('?')[0].split('#')[0].trim()
}

export default function CheckerIsland() {
  const [raw, setRaw] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [error, setError] = useState('')
  const [currentUsername, setCurrentUsername] = useState('')

  const check = useCallback(async (override?: string) => {
    const input = sanitize(override ?? raw)
    setCurrentUsername(input)
    setResult(null) // P0 fix: clear old result before every new check
    if (!input) { setError('Enter a username'); return }
    if (!USER_RE.test(input)) {
      setStatus('invalid')
      setError('Usernames: 1-15 chars, letters, numbers, underscore only. Max 15.')
      return
    }
    setError('')
    setStatus('checking')
    try {
      const res = await fetch(`/api/check?u=${encodeURIComponent(input)}`, { cache: 'no-store' })
      // P0 Fix Finding 2.3: Reject non-2xx BEFORE mapping to result
      if (!res.ok) {
        const data: any = await res.json().catch(()=>({}))
        if (res.status === 429) {
          setStatus('unknown')
          setError(data.error || 'Rate limited — 10 checks/10s. Cached 1h. Try in 30s.')
          return
        }
        // Any other error -> unknown, never clean
        setStatus('unknown')
        setError(data.error || `Check failed (HTTP ${res.status}) — marked as unknown, not a ban proof.`)
        return
      }
      const data: ApiResponse = await res.json()
      // Validate response schema
      if (!data.username || !data.results) {
        setStatus('unknown')
        setError('Invalid response format — unknown.')
        return
      }
      setResult(data)
      // Ensure result belongs to current username (prevent race)
      if (data.username.toLowerCase() !== input.toLowerCase()) {
        // Race condition - ignore
        return
      }
      if (data.overall === 'not_found') setStatus('not_found')
      else if (data.overall === 'suspended') setStatus('suspended')
      else if (data.overall === 'flagged') setStatus('flagged')
      else if (data.overall === 'unknown') setStatus('unknown')
      else setStatus('clean')
    } catch {
      setStatus('unknown')
      setError('X endpoints rate-limited or unavailable. Result marked as unknown, not a ban proof. Try again in 1 min. Cached 1h.')
    }
  }, [raw])

  const getSignal = (id: string) => result?.results?.find(r => r.id === id)

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4 min-h-[60px]" aria-live="polite">
        {status === 'checking' && <p className="animate-pulse p-4 rounded-xl border bg-stone-50 border-stone-200">🔍 Checking public signals for @{currentUsername}...</p>}
        {status === 'clean' && (
          <div className="p-4 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-800">
            <p className="font-semibold">🟢 Clean — all 3 public signals observed (logged-out)</p>
            <p className="text-xs mt-1 opacity-80">Profile reachable, typeahead found, search found. {result?.cached ? `Cached ${result.cacheAgeSeconds}s ago` : 'Live check'} — not a guarantee of full reach.</p>
          </div>
        )}
        {status === 'flagged' && (
          <div className="p-4 rounded-xl border bg-amber-50 border-amber-200 text-amber-800">
            <p className="font-semibold">🟡 Some signals not observed — see details below</p>
            <p className="text-xs mt-1 opacity-80">This can happen due to new account, no public posts, personalization, or temporary limits. Check official X Account Status. {result?.cached ? `Cached ${result.cacheAgeSeconds}s ago` : 'Live'}.</p>
          </div>
        )}
        {status === 'unknown' && (
          <div className="p-4 rounded-xl border bg-amber-50 border-amber-200 text-amber-800">
            <p className="font-semibold">🟡 Unknown — could not get reliable signals</p>
            <p className="text-xs mt-1 opacity-80">{error || 'X rate-limited or endpoint changed. Try again in 1h. Cached result shown if available.'}</p>
          </div>
        )}
        {status === 'private' && <p className="p-4 rounded-xl border bg-stone-50">🔒 Private/Protected — cannot check public signals</p>}
        {status === 'suspended' && <p className="p-4 rounded-xl border bg-red-50 border-red-200 text-red-800">⛔ Suspended/Deleted — profile not reachable</p>}
        {status === 'not_found' && <p className="p-4 rounded-xl border bg-stone-50">❓ Not found — check spelling</p>}
        {status === 'invalid' && <p className="p-4 rounded-xl border bg-red-50 border-red-200 text-red-800">{error}</p>}
      </div>

      <form onSubmit={e => { e.preventDefault(); check() }} className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
          <input
            value={raw}
            onChange={e => setRaw(e.target.value)}
            placeholder="elonmusk or x.com/elonmusk"
            aria-label="X username"
            className="w-full pl-8 pr-4 h-14 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none text-base bg-white"
            autoComplete="off"
            autoCapitalize="off"
            disabled={status === 'checking'}
          />
        </div>
        <button type="submit" disabled={status === 'checking'} className="h-14 px-8 rounded-xl bg-black text-white font-semibold disabled:opacity-50 hover:bg-gray-900 transition">
          {status === 'checking' ? '...' : 'Check — $0'}
        </button>
      </form>

      <div className="flex gap-2 mt-3 flex-wrap items-center">
        {EXAMPLES.map(ex => (
          <button key={ex} onClick={() => { setRaw(ex); check(ex) }} disabled={status === 'checking'} className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50">@{ex}</button>
        ))}
        <span className="text-xs text-gray-500 ml-auto">No login • Public only • Cached 1h • Real guest-token $0</span>
      </div>

      {error && status !== 'invalid' && status !== 'unknown' && <p className="mt-3 text-sm text-amber-700" role="alert">{error}</p>}

      {result?.results && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          {result.results.map(r => {
            const isObserved = r.status === "observed"
            const isUnknown = r.status === "unknown"
            return (
              <div key={r.id} className={`p-4 rounded-xl border text-left ${isObserved ? "bg-emerald-50 border-emerald-200" : isUnknown ? "bg-amber-50 border-amber-200" : "bg-amber-50 border-amber-200"}`}>
                <div className="flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${isObserved ? "bg-emerald-500" : isUnknown ? "bg-amber-400" : "bg-amber-500"}`}></span><b className="capitalize">{r.id}</b></div>
                <div className="mt-1 text-xs font-semibold">{r.status === "observed" ? "Observed" : r.status === "not_observed" ? "Not observed" : "Unknown"}</div>
                <div className="mt-2 text-[11px] leading-tight opacity-80">{r.explanation}</div>
                <div className="mt-2 text-[10px] text-gray-500">Checked: {new Date(r.checkedAt).toLocaleTimeString()}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
