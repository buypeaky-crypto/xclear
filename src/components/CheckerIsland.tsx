'use client'

import { useState, useCallback } from 'react'

const USER_RE = /^[A-Za-z0-9_]{1,15}$/
const EXAMPLES = ['elonmusk', 'naval', 'garyvee']

type Status = 'idle' | 'checking' | 'clean' | 'banned' | 'unknown' | 'private' | 'suspended' | 'not_found' | 'invalid'

function sanitize(input: string): string {
  return input
    .trim()
    .replace(/^@+/, '')
    .replace(/^https?:\/\/(www\.)?(x|twitter|tiktok|instagram|youtube)\.com\//i, '')
    .split('/')[0]
    .split('?')[0]
    .split('#')[0]
    .trim()
}

export default function CheckerIsland() {
  const [raw, setRaw] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const check = useCallback(async (override?: string) => {
    const input = sanitize(override ?? raw)
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
      if (res.status === 429) {
        setStatus('unknown')
        setError('Rate limited. Free: 10 checks/10s. Cached 1h. Try in 30s.')
        return
      }
      const data = await res.json()
      setResult(data)
      // map backend to UI status
      if (data.not_found) setStatus('not_found')
      else if (data.suspended) setStatus('suspended')
      else if (data.private) setStatus('private')
      else if (data.search_ban) setStatus('banned')
      else if (data.unknown) setStatus('unknown')
      else setStatus('clean')
    } catch {
      setStatus('unknown')
      setError('X endpoints rate-limited. Try again in 1 min. Result cached 1h.')
    }
  }, [raw])

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Traffic light result */}
      {status !== 'idle' && (
        <div className="mb-4 p-4 rounded-xl border" aria-live="polite">
          {status === 'checking' && <p className="animate-pulse">🔍 Checking public signals for @{sanitize(raw)}...</p>}
          {status === 'clean' && <p className="text-green-600 font-semibold">🟢 Clean — Search, Suggestion, Profile reachable (logged-out)</p>}
          {status === 'banned' && <p className="text-red-600 font-semibold">🔴 Search/Suggestion Ban detected — public signals missing</p>}
          {status === 'unknown' && <p className="text-amber-600 font-semibold">🟡 Unknown — X rate-limited or inconclusive. Check again in 1h.</p>}
          {status === 'private' && <p>🔒 Private/Protected — cannot check public signals</p>}
          {status === 'suspended' && <p>⛔ Suspended/Deleted — profile not reachable</p>}
          {status === 'not_found' && <p>❓ Not found — check spelling</p>}
          {status === 'invalid' && <p className="text-red-600">{error}</p>}
        </div>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
          <input
            value={raw}
            onChange={e => setRaw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && check()}
            placeholder="elonmusk or x.com/elonmusk"
            aria-label="X username"
            className="w-full pl-8 pr-4 h-14 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none text-base"
            autoComplete="off"
            autoCapitalize="off"
          />
        </div>
        <button
          onClick={() => check()}
          disabled={status === 'checking'}
          className="h-14 px-8 rounded-xl bg-black text-white font-semibold disabled:opacity-50 hover:bg-gray-900 transition"
        >
          {status === 'checking' ? '...' : 'Check'}
        </button>
      </div>

      <div className="flex gap-2 mt-3 flex-wrap">
        {EXAMPLES.map(ex => (
          <button key={ex} onClick={() => { setRaw(ex); check(ex) }} className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">
            @{ex}
          </button>
        ))}
        <span className="text-xs text-gray-500 ml-auto">No login • Public only • Cached 1h</span>
      </div>

      {error && status !== 'invalid' && <p className="mt-3 text-sm text-amber-700">{error}</p>}

      {result && (
        <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-gray-50"><b>Search</b><br/>{result.search ? '✅' : result.search === false ? '❌' : '❓'}</div>
          <div className="p-3 rounded-lg bg-gray-50"><b>Suggestion</b><br/>{result.suggestion ? '✅' : result.suggestion === false ? '❌' : '❓'}</div>
          <div className="p-3 rounded-lg bg-gray-50"><b>Profile</b><br/>{result.profile ? '✅' : result.profile === false ? '❌' : '❓'}</div>
        </div>
      )}
    </div>
  )
}
