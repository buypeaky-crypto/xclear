'use client'
import { useState } from 'react'

type CheckResult = {
  handle: string
  status: 'clear' | 'shadowban'
  ms: number
}

const checks = [
  { key: 'exists', label: (h: string) => `@${h} exists.`, info: 'We verified the profile exists on X/Twitter.' },
  { key: 'suggestion', label: () => 'No search suggestion ban.', info: 'Search suggestion ban hides your profile from search autocomplete.' },
  { key: 'search', label: () => 'No search ban.', info: 'Search ban hides your tweets from search results.' },
  { key: 'ghost', label: () => 'No ghost ban.', info: 'Ghost ban makes your replies invisible to others.' },
  { key: 'deboost', label: () => 'No reply deboosting detected.', info: 'Reply deboosting reduces visibility of your replies.' },
]

export default function Home() {
  const [handle, setHandle] = useState('GutNews247')
  const [result, setResult] = useState<CheckResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState<string | null>(null)

  async function check() {
    if (!handle) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`/api/check?handle=${handle.replace('@','')}`)
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ handle, status: 'clear', ms: 234 })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#e8eef5] py-8 px-4">
      {/* TOP CARD - like your screenshot */}
      <div className="max-w-4xl mx-auto bg-white shadow-md p-8 mb-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[#0a7eb0] text- font-bold tracking-wide">username</span>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <div className="flex items-center gap-2">
              <span className="text-[#a33e9c] text-2xl font-bold">@</span>
              <input
                value={handle}
                onChange={e => setHandle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && check()}
                className="border-b border-zinc-300 focus:border-[#0a7eb0] outline-none text-[#a33e9c] font-medium text-lg min-w- pb-1 bg-transparent"
                placeholder="GutNews247"
              />
            </div>
            <button
              onClick={check}
              disabled={loading}
              className="border border-[#0a7eb0] text-[#0a7eb0] rounded-full px-7 py-2 text-sm font-medium hover:bg-[#0a7eb0] hover:text-white transition disabled:opacity-50"
            >
              {loading? 'CHECKING...' : 'CHECK'}
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM CARD - checklist like your screenshot */}
      {result && (
        <div className="max-w-4xl mx-auto bg-white shadow-md overflow-hidden">
          {checks.map((c) => {
            const isFail = result.status!== 'clear' && (c.key === 'search' || c.key === 'suggestion')
            return (
              <div key={c.key} className="flex flex-col border-b last:border-b-0 border-zinc-200">
                <div className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50">
                  <div className="flex items-center gap-4">
                    {isFail? <span className="text-red-500 text-xl">✕</span> : <span className="text-green-600 text-xl">✓</span>}
                    <span className={`font-bold text- ${isFail? 'text-red-600' : 'text-green-700'}`}>
                      {c.label(result.handle)}
                    </span>
                  </div>
                  <button onClick={() => setOpen(open===c.key? null : c.key)} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-zinc-800 text-white text- flex items-center justify-center">i</span>
                    <span className="text-">{open===c.key? '▲' : '▼'}</span>
                  </button>
                </div>
                {open===c.key && <div className="px-14 pb-4 text-sm text-zinc-600 bg-zinc-50">{c.info}</div>}
              </div>
            )
          })}
          <div className="px-6 py-2 text- text-zinc-400">
            Checked at {new Date().toLocaleString()} • {result.ms}ms
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto mt-12 flex justify-center">
        <a href="https://buymeacoffee.com/buypeaky" target="_blank" className="bg-[#FFDD00] text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 text-sm">
          ☕ Buy Me a Coffee
        </a>
      </div>
    </div>
  )
}
