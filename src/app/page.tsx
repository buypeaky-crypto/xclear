'use client'
import { useState } from "react"
import { Fraunces, Sora } from "next/font/google"
import AdBelowChecker from "@/components/AdBelowChecker"
import SupportUsButton from "../components/SupportUsButton"
import BrandHomeLink from "../components/BrandHomeLink"
import SupportPopup from "../components/SupportPopup"
import AlertButton from './components/AlertButton'
import { checkInstagram, type IGCheckResult } from "../lib/instagram/checker"

const fraunces = Fraunces({ subsets: ["latin"], weight: ["700", "800", "900"], style: ["normal", "italic"], display: "swap" })
const sora = Sora({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" })

type Platform = "x" | "twitter" | "instagram" | "facebook" | "tiktok" | "youtube" | "reddit"
type CheckerResult = { username: string; tests: Record<string, { label: string; status: "clear" | "flagged" | "unknown"; detail: string }> }

export default function Home({ platform = "x", backgroundClassName = "bg-platform-home" }: { platform?: Platform; backgroundClassName?: string } = {}) {
  const [inputVal, setInputVal] = useState(platform === "instagram" ? "aljannah.tv" : "gutnews247")
  const [hashtagInput, setHashtagInput] = useState("#quran #islam #faith")
  const [result, setResult] = useState<CheckerResult | null>(null)
  const [igResult, setIgResult] = useState<IGCheckResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSupport, setShowSupport] = useState(false)

  const handleCheck = async () => {
    const clean = inputVal.replace(/^@/, "").trim()
    if(!clean) return
    setLoading(true); setShowSupport(true)
    if(platform === "instagram"){
      setIgResult(checkInstagram(clean, hashtagInput.split(/[\s,]+/).filter(Boolean)))
      setLoading(false); return
    }
    try{
      const res = await fetch(`/api/check/twitter?username=${encodeURIComponent(clean)}`)
      const data = await res.json()
      setResult({ username: data.username || clean, tests: data.tests })
    }catch{}
    setLoading(false)
  }

  const getStatusStyle = (status: string) => {
    if(status === "clear") return { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", dot: "bg-emerald-500" }
    if(status === "flagged") return { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", dot: "bg-red-500" }
    return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", dot: "bg-amber-400" }
  }

  return (
    <main className={`${sora.className} min-h-screen ${backgroundClassName} pb-24 text-stone-900`}>
      <div className="max-w-[900px] mx-auto px-4 pt-8">
        <div className="text-center">
          <h1 className={`${fraunces.className} text-stone-800 tracking-tight font-black italic text-3xl`}>
            {platform === "x" ? "Free Social Media Shadowban Checker & Reach Recovery Tool" : `Is your ${platform} account shadowbanned?`}
          </h1>

          <div className="mt-8">
            {platform === "x" && (
              <div className="bg-white border border-stone-200 shadow-sm rounded-2xl p-6 sm:p-8 text-left">
                <h2 className="text-xl font-bold mb-5">Check a public X username</h2>
                <div className="flex flex-col sm:flex-row items-end justify-center gap-4">
                  <div className="flex flex-col w-full sm:w-auto">
                    <label className="text-sm font-semibold text-stone-700 mb-2">X username</label>
                    <div className="flex items-end border-b-2 border-stone-300 focus-within:border-black pb-1 transition-colors">
                      <span className="text-violet-600 font-bold mr-2 text-lg">@</span>
                      <input value={inputVal} onChange={e=>setInputVal(e.target.value.replace(/^@/,""))} onKeyDown={e=> e.key==="Enter" && handleCheck()} placeholder="gutnews247" className="w-[220px] bg-transparent outline-none text-[15px] py-1" />
                    </div>
                  </div>
                  <button onClick={handleCheck} disabled={loading} className="h-12 px-8 rounded-full bg-black text-white font-semibold hover:bg-zinc-800 active:bg-zinc-900 focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 transition">
                    {loading ? "Checking..." : "Check"}
                  </button>
                </div>

                <div className="mt-6 min-h-[120px]">
                  {loading && (
                    <div className="grid grid-cols-3 gap-3 animate-pulse">
                      <div className="h-[96px] rounded-xl bg-stone-100"></div>
                      <div className="h-[96px] rounded-xl bg-stone-100"></div>
                      <div className="h-[96px] rounded-xl bg-stone-100"></div>
                    </div>
                  )}
                  {!loading && result && (
                    <>
                      <div className={`mb-4 p-4 rounded-xl border flex items-center gap-3 ${Object.values(result.tests).every((t:any)=>t.status==="clear") ? "bg-emerald-50 border-emerald-200 text-emerald-800" : Object.values(result.tests).some((t:any)=>t.status==="flagged") ? "bg-red-50 border-red-200 text-red-800" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
                        <span className={`w-3 h-3 rounded-full ${Object.values(result.tests).every((t:any)=>t.status==="clear") ? "bg-emerald-500" : Object.values(result.tests).some((t:any)=>t.status==="flagged") ? "bg-red-500" : "bg-amber-400"}`}></span>
                        <span className="text-sm font-bold">
                          {Object.values(result.tests).every((t:any)=>t.status==="clear") ? "🟢 Clean — Search, Suggestion, Profile reachable (logged-out)" : Object.values(result.tests).some((t:any)=>t.status==="flagged") ? "🔴 Ban detected — some signals missing" : "🟡 Unknown — rate-limited or inconclusive"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {Object.entries(result.tests).map(([key, t]: any)=>{
                          const style = getStatusStyle(t.status)
                          return (
                            <div key={key} className={`p-4 rounded-xl border ${style.bg} ${style.border} hover:shadow-sm transition text-center`}>
                              <div className="flex items-center justify-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`}></span>
                                <div className={`text-sm font-bold ${style.text}`}>{t.label}</div>
                              </div>
                              <div className="mt-2 text-xl">{t.status === "clear" ? "✅" : t.status === "flagged" ? "❌" : "❓"}</div>
                              <div className={`mt-1 text-[11px] ${style.text} leading-tight opacity-80`}>{t.detail?.slice(0,90)}</div>
                              <div className={`mt-2 inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${style.bg} ${style.text} border ${style.border}`}>{t.status.toUpperCase()}</div>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}
                  {!loading && !result && (
                    <div className="flex gap-2 mt-4 flex-wrap justify-center">
                      {["elonmusk","naval","garyvee"].map(ex=>(
                        <button key={ex} onClick={()=>{setInputVal(ex); setTimeout(handleCheck,0)}} className="text-sm px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 focus:ring-2 focus:ring-black transition">@{ex}</button>
                      ))}
                      <span className="text-xs text-stone-500 ml-2 self-center">No login • Public only • Cached 1h</span>
                    </div>
                  )}
                </div>
                <div className="mt-6"><AdBelowChecker /></div>
              </div>
            )}
            {platform === "instagram" && (
              <div className="bg-white border border-stone-200 shadow-sm rounded-2xl p-6 sm:p-8 text-left">
                <h2 className={`${fraunces.className} text-xl font-black italic text-center mb-2`}>Is your Instagram account shadowbanned?</h2>
                <p className="text-sm text-stone-600 text-center mb-6">Enter an Instagram username to assess hashtag visibility, Explore potential, and engagement patterns from public signals.</p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">Instagram username <span className="text-red-600">*</span></label>
                    <div className="flex items-center border-b-2 border-stone-300 focus-within:border-violet-600 pb-2 transition-colors">
                      <span className="mr-2 text-xl font-bold text-violet-600">@</span>
                      <input value={inputVal} onChange={e=>setInputVal(e.target.value.replace(/^@/,""))} placeholder="aljannah.tv" className="flex-1 bg-transparent outline-none text-[15px]" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold">Recent hashtags (optional)</label>
                    <textarea value={hashtagInput} onChange={e=>setHashtagInput(e.target.value)} rows={2} placeholder="#quran #islam #faith" className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none transition" />
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <button onClick={handleCheck} disabled={loading} className="rounded-full bg-black text-white px-8 h-12 font-semibold hover:bg-zinc-800 focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 transition">
                    {loading ? "Checking..." : "Check"}
                  </button>
                </div>
                {igResult && (
                  <div className={`mt-6 p-4 rounded-xl border ${igResult.score > 70 ? "bg-emerald-50 border-emerald-200 text-emerald-800" : igResult.score > 40 ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-red-50 border-red-200 text-red-800"}`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${igResult.score > 70 ? "bg-emerald-500" : igResult.score > 40 ? "bg-amber-400" : "bg-red-500"}`}></span>
                      <span className="font-bold">Score {igResult.score}/100 — {igResult.score > 70 ? "🟢 Clean" : igResult.score > 40 ? "🟡 Risk" : "🔴 Flagged"}</span>
                    </div>
                    <div className="mt-2 text-sm opacity-90">{igResult.reasons?.join(", ")}</div>
                  </div>
                )}
                <div className="mt-6"><AdBelowChecker /></div>
              </div>
            )}
          </div>
          <SupportUsButton />
        </div>
      </div>
      <AlertButton handle={inputVal} platform={platform} />
      <SupportPopup isOpen={showSupport} onClose={()=>setShowSupport(false)} isChecking={loading} />
    </main>
  )
}
