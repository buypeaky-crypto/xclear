'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [username, setUsername] = useState('elonmusk')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const check = async (u = username) => {
    const clean = u.trim().replace(/^@/, '')
    if (!clean) return
    setLoading(true)
    setResult(null)
    try {
      const r = await fetch(`/api/check?username=${encodeURIComponent(clean)}`)
      const j = await r.json()
      if (!r.ok && (j.notFound || r.status === 404)) {
        setResult({ notFound: true, username: clean })
      } else {
        setResult(j)
      }
    } catch {
      setResult({ error: true })
    }
    setLoading(false)
  }

  useEffect(() => { check('elonmusk') }, [])

  const isNotFound = result?.notFound
  const hasBan = result && !isNotFound && (
    result.searchBan || result.searchSuggestionBan || result.ghostBan || result.replyDeboosting || result.banned || result.isBanned
  )

  return (
    <main className="min-h-screen bg-[#eef6fb] py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6 flex flex-col items-center gap-4">
        <div className="text-sm font-semibold text-[#0a7abf]">username</div>
        <div className="flex gap-3 w-full justify-center">
          <div className="flex items-center border-b">
            <span className="text-purple-700 text-2xl">@</span>
            <input value={username} onChange={e=>setUsername(e.target.value)} onKeyDown={e=>e.key==='Enter' && check()} className="px-2 py-1 outline-none" />
          </div>
          <button onClick={()=>check()} disabled={loading} className="border border-[#0a7abf] text-[#0a7abf] rounded-full px-6 py-2">{loading ? '...' : 'CHECK'}</button>
        </div>
      </div>

      {result && (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow mt-6 divide-y">
          {isNotFound ? (
            <div className="p-4 text-red-600">X @{result.username} not found.</div>
          ) : (
            <>
              <div className="p-4 text-green-700">{result.searchSuggestionBan ? 'X Search suggestion ban.' : '✓ No search suggestion ban.'}</div>
              <div className="p-4 text-green-700">{result.searchBan ? 'X Search ban.' : '✓ No search ban.'}</div>
              <div className="p-4 text-green-700">{result.ghostBan ? 'X Ghost ban.' : '✓ No ghost ban.'}</div>
              <div className="p-4 text-green-700">{result.replyDeboosting ? 'X Reply deboosting.' : '✓ No reply deboosting detected.'}</div>
            </>
          )}
        </div>
      )}

      <div className="flex justify-center gap-3 mt-6">
        <a className="bg-yellow-400 rounded-full px-6 py-2 font-semibold">☕ Buy Me a Coffee</a>
        <a className="bg-black text-white rounded-full px-6 py-2">₿ Crypto</a>
      </div>
    </main>
  )
}
