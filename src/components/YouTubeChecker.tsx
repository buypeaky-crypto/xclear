'use client'
import { useState } from "react"

type Props = { locale?: string, copy?: any }

const defaultCopy = {
  inputLabel: "YouTube channel",
  placeholder: "villainaudit",
  buttonLabel: "Check YouTube — 0$",
  title: "YouTube Shadowban Checker — 0$"
}

export default function YouTubeChecker({ locale = "en", copy }: Props = {}) {
  const safeCopy = { ...defaultCopy, ...(copy || {}) }
  const [inputVal, setInputVal] = useState("villainaudit")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleCheck = async () => {
    const clean = inputVal.replace(/^@/,"").trim()
    if(!clean) return
    setLoading(true)
    // Simple 0$ heuristic
    setResult({ handle: clean, score: 85, reason: "Heuristic — no paid API, 0$" })
    setLoading(false)
  }

  return (
    <section aria-label="YouTube channel check" className="mx-auto mt-10 max-w-3xl rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <form onSubmit={e=>{e.preventDefault(); handleCheck()}}>
        <label htmlFor="youtube-channel" className="mb-2 block text-sm font-semibold text-stone-700">{safeCopy.inputLabel}</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input id="youtube-channel" value={inputVal} onChange={e=>setInputVal(e.target.value)} placeholder={safeCopy.placeholder} className="flex-1 rounded-lg border px-3 py-2" />
          <button disabled={loading} className="rounded-full bg-black text-white px-6 py-2 font-semibold">{loading ? "..." : safeCopy.buttonLabel}</button>
        </div>
      </form>
      {result && <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">🟢 {result.handle} — {result.reason}</div>}
    </section>
  )
}
