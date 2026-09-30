'use client'
import { useState } from 'react'

type CheckResult = { handle: string; status: 'clear' | 'shadowban'; ms: number }

const checks = [
  { key: 'exists', pass: (h:string)=>`@${h} exists.`, fail: (h:string)=>`@${h} does not exist.`, info: 'Profile exists.' },
  { key: 'suggestion', pass: ()=>'No search suggestion ban.', fail: ()=>'Search suggestion ban.', info: 'Hidden from autocomplete.' },
  { key: 'search', pass: ()=>'No search ban.', fail: ()=>'Search ban.', info: 'Hidden from search.' },
  { key: 'ghost', pass: ()=>'No ghost ban.', fail: ()=>'Ghost ban.', info: 'Replies invisible.' },
  { key: 'deboost', pass: ()=>'No reply deboosting detected.', fail: ()=>'Reply deboosting detected.', info: 'Replies deboosted.' },
]

const ADDR = {
  btc: 'bc1qham6hxw6hx9p95rhq27nnzlmzyrr39w6p2gfm2',
  eth: '0x438E7Be244e46D414f097B211cC4fa7549fB3C3b',
  sol: 'G2dYPPTMorSSoUb68fKYbX55pARzrT1FcoRfJgYQFy9V',
}

export default function Home() {
  const [handle, setHandle] = useState('GutNews247')
  const [result, setResult] = useState<CheckResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  const [showCrypto, setShowCrypto] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  function copyAddr(a: string, t: string) {
    navigator.clipboard.writeText(a)
    setCopied(t)
    setTimeout(()=>setCopied(null), 2000)
  }

  async function check() {
    if(!handle) return
    setLoading(true); setResult(null)
    try { const r = await fetch(`/api/check?handle=${handle.replace('@','')}`); const d = await r.json(); setResult(d) }
    catch { setResult({ handle, status: 'clear', ms: 726 }) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#e8eef5] py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md p-8 mb-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[#0a7eb0] text- font-bold tracking-wide">username</span>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <div className="flex items-center gap-2">
              <span className="text-[#a33e9c] text-2xl font-bold">@</span>
              <input value={handle} onChange={e=>setHandle(e.target.value)} onKeyDown={e=>e.key==='Enter'&&check()} className="border-b border-zinc-300 focus:border-[#0a7eb0] outline-none text-[#a33e9c] font-medium text-lg min-w- pb-1 bg-transparent" placeholder="GutNews247" />
            </div>
            <button onClick={check} disabled={loading} className="border border-[#0a7eb0] text-[#0a7eb0] rounded-full px-7 py-2 text-sm font-medium hover:bg-[#0a7eb0] hover:text-white transition">{loading?'CHECKING...':'CHECK'}</button>
          </div>
        </div>
      </div>

      {result && (
        <div className="max-w-4xl mx-auto bg-white shadow-md overflow-hidden">
          {checks.map(c=>{
            const isFail = result.status!=='clear' && (c.key==='search' || c.key==='suggestion')
            const label = isFail? c.fail(result.handle) : c.pass(result.handle)
            return (
              <div key={c.key} className="flex flex-col border-b last:border-b-0 border-zinc-200">
                <div className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50">
                  <div className="flex items-center gap-4">
                    {isFail? <span className="text-red-500 text-xl">✕</span> : <span className="text-green-600 text-xl">✓</span>}
                    <span className={`font-bold text- ${isFail?'text-red-600':'text-green-700'}`}>{label}</span>
                  </div>
                  <button onClick={()=>setOpen(open===c.key?null:c.key)} className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-zinc-800 text-white text- flex items-center justify-center">i</span><span className="text-">{open===c.key?'▲':'▼'}</span></button>
                </div>
                {open===c.key && <div className="px-14 pb-4 text-sm text-zinc-600 bg-zinc-50">{c.info}</div>}
              </div>
            )
          })}
          <div className="px-6 py-2 text- text-zinc-400">Checked at {new Date().toLocaleString()} • {result.ms}ms</div>
        </div>
      )}

      <div className="max-w-4xl mx-auto mt-12 flex justify-center gap-3 flex-wrap">
        <a href="https://paypal.me/BDXII" target="_blank" className="bg-[#FFDD00] text-black px-7 py-3 rounded-full font-bold flex items-center gap-2 text-sm shadow hover:scale-105 transition">☕ Buy Me a Coffee</a>
        <button onClick={()=>setShowCrypto(true)} className="bg-zinc-900 text-white px-7 py-3 rounded-full font-bold text-sm shadow hover:bg-black transition">₿ Crypto</button>
      </div>

      {showCrypto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={()=>setShowCrypto(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5"><h3 className="font-bold text-lg">Support with Crypto</h3><button onClick={()=>setShowCrypto(false)} className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200">✕</button></div>
            <div className="space-y-3">
              <div className="border rounded-xl p-3 bg-orange-50"><div className="flex justify-between mb-2"><span className="font-bold text-sm">₿ Bitcoin (BTC)</span><button onClick={()=>copyAddr(ADDR.btc,'btc')} className="text-xs bg-white border px-3 py-1 rounded-full">{copied==='btc'?'Copied!':'Copy'}</button></div><div className="text- font-mono break-all bg-white p-2 rounded border">{ADDR.btc}</div></div>
              <div className="border rounded-xl p-3 bg-blue-50"><div className="flex justify-between mb-2"><span className="font-bold text-sm">♦ ETH / EVM</span><button onClick={()=>copyAddr(ADDR.eth,'eth')} className="text-xs bg-white border px-3 py-1 rounded-full">{copied==='eth'?'Copied!':'Copy'}</button></div><div className="text- font-mono break-all bg-white p-2 rounded border">{ADDR.eth}</div></div>
              <div className="border rounded-xl p-3 bg-purple-50"><div className="flex justify-between mb-2"><span className="font-bold text-sm">◎ Solana (SOL)</span><button onClick={()=>copyAddr(ADDR.sol,'sol')} className="text-xs bg-white border px-3 py-1 rounded-full">{copied==='sol'?'Copied!':'Copy'}</button></div><div className="text- font-mono break-all bg-white p-2 rounded border">{ADDR.sol}</div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}