'use client'
import { useState } from 'react'

type CheckResult = {
  exists?: boolean
  searchBan?: boolean
  searchSuggestionBan?: boolean
  ghostBan?: boolean
  replyDeboosting?: boolean
  banned?: boolean
  isBanned?: boolean
  shadowbanned?: boolean
  [key: string]: any
}

export default function Home() {
  const [username, setUsername] = useState('GutNews247')
  const [result, setResult] = useState<CheckResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [showCrypto, setShowCrypto] = useState(false)

  const check = async () => {
    if (!username) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`/api/check?username=${encodeURIComponent(username.replace('@',''))}`)
      const data = await res.json()
      setResult(data)
    } catch(e){ console.error(e) }
    finally { setLoading(false) }
  }

  const hasBan = result && (
    (result as any).searchBan ||
    (result as any).searchSuggestionBan ||
    (result as any).ghostBan ||
    (result as any).replyDeboosting ||
    (result as any).banned ||
    (result as any).isBanned
  )

  return (
    <main className="min-h-screen bg-[#eef6fb] py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6 flex flex-col items-center gap-4">
        <div className="text-sm font-semibold text-[#0a7abf]">username</div>
        <div className="flex gap-3 w-full justify-center">
          <div className="flex items-center border-b">
            <span className="text-2xl text-purple-700">@</span>
            <input value={username} onChange={e=>setUsername(e.target.value)} className="ml-2 outline-none text-purple-900" />
          </div>
          <button onClick={check} disabled={loading} className="border border-[#0a7abf] text-[#0a7abf] px-6 py-2 rounded-full">{loading ? '...' : 'CHECK'}</button>
        </div>
      </div>

      {result && (
        <div className="max-w-4xl mx-auto mt-8 bg-white rounded-xl shadow divide-y">
          <div className="p-4"><span className={result.exists ? 'text-green-700' : 'text-red-600'}>{result.exists ? '✓' : '✕'} @{username} {result.exists ? 'exists.' : 'not found.'}</span></div>
          <div className="p-4"><span className={(result as any).searchSuggestionBan ? 'text-red-600' : 'text-green-700'}>{(result as any).searchSuggestionBan ? '✕ Search suggestion ban.' : '✓ No search suggestion ban.'}</span></div>
          <div className="p-4"><span className={(result as any).searchBan ? 'text-red-600' : 'text-green-700'}>{(result as any).searchBan ? '✕ Search ban.' : '✓ No search ban.'}</span></div>
          <div className="p-4"><span className={(result as any).ghostBan ? 'text-red-600' : 'text-green-700'}>{(result as any).ghostBan ? '✕ Ghost ban.' : '✓ No ghost ban.'}</span></div>
          <div className="p-4"><span className={(result as any).replyDeboosting ? 'text-red-600' : 'text-green-700'}>{(result as any).replyDeboosting ? '✕ Reply deboosting.' : '✓ No reply deboosting detected.'}</span></div>
        </div>
      )}

      {hasBan && (
        <div className="max-w-4xl mx-auto mt-10 rounded-2xl border border-zinc-200 bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-black">🛠️ Recovery Plan — Free</h2>
          <p className="mt-2 text-sm text-zinc-600">Postory hides this behind paywall. Your account is flagged — here's exactly what to do:</p>
          <div className="mt-6 grid gap-4">
            <div className="rounded-xl bg-zinc-50 p-4 border"><h3 className="font-semibold">1. Stop — Don't make it worse</h3><ul className="mt-2 list-disc pl-5 text-sm text-zinc-700 space-y-1"><li>Don't create new account — X links it & bans harder</li><li>Stop mass likes / follows / replies / DMs for 24h</li><li>Delete last 3 days of repetitive / link-heavy replies</li></ul></div>
            <div className="rounded-xl bg-amber-50 p-4 border border-amber-200"><h3 className="font-semibold text-amber-900">2. Fix the trigger</h3><ul className="mt-2 list-disc pl-5 text-sm text-amber-900/80 space-y-1"><li>Remove hashtags + external links from last 5 tweets</li><li>No duplicate text — X flags as spam</li><li>Wait 48-72h, then re-test here</li></ul></div>
            <div className="rounded-xl bg-zinc-50 p-4 border"><h3 className="font-semibold">3. Appeal after 48h</h3><code className="block mt-2 p-3 bg-white rounded-lg border text-xs text-zinc-600">"I think my account visibility was limited by mistake. I cleaned up spam-like activity and will follow rules."</code></div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto mt-12 flex justify-center gap-3 flex-wrap">
        <a href="https://paypal.me/BDXII" target="_blank" className="bg-[#FFDD00] text-black px-7 py-3 rounded-full font-bold text-sm shadow">☕ Buy Me a Coffee</a>
        <button onClick={()=>setShowCrypto(true)} className="bg-zinc-900 text-white px-7 py-3 rounded-full font-bold text-sm shadow">₿ Crypto</button>
      </div>

      {showCrypto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={()=>setShowCrypto(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5"><h3 className="font-bold">Crypto</h3><button onClick={()=>setShowCrypto(false)}>✕</button></div>
            <div className="space-y-3">
              <div className="border rounded-xl p-3 bg-orange-50">BTC — bc1q...</div>
              <div className="border rounded-xl p-3 bg-blue-50">ETH — 0x...</div>
              <div className="border rounded-xl p-3 bg-purple-50">SOL — ...</div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
} 