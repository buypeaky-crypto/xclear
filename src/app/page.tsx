// @ts-nocheck - accepts variant, content, dictionary from checker/[platform] routes
'use client'
import { useState } from "react"
import { Fraunces, Sora } from "next/font/google"
import CheckerIsland from "@/components/CheckerIsland"
import AdBelowChecker from "@/components/AdBelowChecker"
import BrandHomeLink from "../components/BrandHomeLink"
import PlatformSwitcher from "../components/PlatformSwitcher"
import SupportUsButton from "../components/SupportUsButton"
import SupportPopup from "../components/SupportPopup"
import { checkInstagram, type IGCheckResult } from "../lib/instagram/checker"
import AlertButton from './components/AlertButton'

const fraunces = Fraunces({ subsets: ["latin"], weight: ["700", "800", "900"], style: ["normal", "italic"], display: "swap" })
const sora = Sora({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" })

type Platform = "x" | "instagram" | "facebook" | "tiktok" | "reddit" | "youtube"

type Props = {
  platform?: string
  backgroundClassName?: string
  locale?: string
  variant?: string
  content?: any
  dictionary?: any
  [key: string]: any
}

function localCheck(platform: Platform, handle: string, keywords: string[]) {
  let score = 100
  const reasons: string[] = []
  const text = keywords.join(" ").toLowerCase()
  if (keywords.length > 15) { score -= 20; reasons.push(`Too many tags (${keywords.length} >15)`) }
  if (text.includes("sub4sub") || text.includes("follow for follow") || text.includes("f4f")) { score -= 40; reasons.push("Sub4Sub / Follow4Follow detected") }
  if (platform === "youtube" && text.split("#").length > 6) { score -= 15; reasons.push("Too many hashtags") }
  if (keywords.length === 0) reasons.push("Add 3-5 relevant keywords/tags")
  else reasons.push(`${keywords.length} tags analyzed — local heuristic 0$`)
  if (score > 70) reasons.push("🟢 Clean — no spam patterns")
  else if (score > 40) reasons.push("🟡 Risk — review tags")
  else reasons.push("🔴 Flagged — likely spam filter")
  return { score: Math.max(0, score), reasons }
}

export default function Home({ platform = "x", backgroundClassName = "bg-[#fef9e7]", locale = "en", variant, content, dictionary, ...rest }: Props = {}) {
  const normalizedPlatform = (platform === "twitter" ? "x" : platform) as Platform
  const [inputVal, setInputVal] = useState(normalizedPlatform === "instagram" ? "aljannah.tv" : normalizedPlatform === "youtube" ? "villainaudit" : normalizedPlatform === "tiktok" ? "hownwhen" : "gutnews247")
  const [kwInput, setKwInput] = useState(normalizedPlatform === "youtube" ? "shadowban, check, audit" : normalizedPlatform === "tiktok" ? "#shadowban #check" : "#quran #islam #faith #muslim #islamic")
  const [igResult, setIgResult] = useState<IGCheckResult | null>(null)
  const [genericResult, setGenericResult] = useState<{ score: number, reasons: string[], handle: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSupport, setShowSupport] = useState(false)

  const handleCheck = async () => {
    const clean = inputVal.replace(/^@/, "").trim().toLowerCase()
    if(!clean) return
    setLoading(true); setShowSupport(true); setGenericResult(null); setIgResult(null)
    if (normalizedPlatform === "instagram") {
      const tags = kwInput.split(/[\s,]+/).map(t=>t.trim()).filter(Boolean)
      setIgResult(checkInstagram(clean, tags))
    } else {
      const kws = kwInput.split(/[\s,]+/).map(k=>k.trim()).filter(Boolean)
      const { score, reasons } = localCheck(normalizedPlatform, clean, kws)
      setGenericResult({ score, reasons, handle: clean })
    }
    setLoading(false)
  }

  const renderGeneric = (title: string, placeholder: string) => (
    <div className="mt-8 bg-white border border-stone-200 shadow-sm rounded-2xl p-6 sm:p-8 text-left">
      <h2 className="text-xl font-bold mb-1">{title}</h2>
      <p className="text-xs text-stone-500 mb-5">Heuristic only · No paid API · Cached 1h · 0$</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold">{normalizedPlatform} handle</label>
          <div className="flex items-center border-b-2 border-stone-300 focus-within:border-black pb-2">
            <span className="mr-2 text-xl font-bold text-stone-700">@</span>
            <input value={inputVal} onChange={e=>setInputVal(e.target.value.replace(/^@/,""))} placeholder={placeholder} className="flex-1 bg-transparent outline-none text-[15px]" />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold">Recent tags / keywords</label>
          <textarea value={kwInput} onChange={e=>setKwInput(e.target.value)} rows={3} placeholder={placeholder} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm" />
        </div>
      </div>
      <div className="mt-6 flex justify-center"><button onClick={handleCheck} disabled={loading} className="rounded-full bg-black text-white px-8 h-12 font-semibold">{loading ? "Checking..." : `Check — 0$`}</button></div>
      {genericResult && (
        <div className="mt-6">
          <div className={`p-4 rounded-xl border flex items-center gap-3 ${genericResult.score > 70 ? "bg-emerald-50 border-emerald-200 text-emerald-800" : genericResult.score > 40 ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-red-50 border-red-200 text-red-800"}`}>
            <span className={`w-3 h-3 rounded-full ${genericResult.score > 70 ? "bg-emerald-500" : genericResult.score > 40 ? "bg-amber-400" : "bg-red-500"}`}></span>
            <span className="text-sm font-bold">{genericResult.score > 70 ? `🟢 Clean — ${genericResult.score}/100` : genericResult.score > 40 ? `🟡 Risk — ${genericResult.score}/100` : `🔴 Flagged — ${genericResult.score}/100`} · @{genericResult.handle}</span>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">{genericResult.reasons.map((r,i)=><div key={i} className="p-3 rounded-xl border bg-stone-50 text-sm">{r}</div>)}</div>
        </div>
      )}
      <div className="mt-6"><AdBelowChecker /></div>
    </div>
  )

  return (
    <main lang={locale} className={`${sora.className} min-h-screen ${backgroundClassName} pb-24 text-stone-900`}>
      <div className="max-w-[900px] mx-auto px-4 pt-8">
        <div className="text-center">
          <BrandHomeLink />
          <PlatformSwitcher activePlatform={normalizedPlatform} />
          <h1 className={`${fraunces.className} text-stone-800 tracking-tight leading-[0.95] font-black italic text-3xl sm:text-4xl mt-6`}>Free Social Media Shadowban Checker & Reach Recovery Tool</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-600">No login required. Real guest-token for X — $0, cached 1h. Other platforms: heuristic only.</p>
          {normalizedPlatform === "x" && <div className="mt-8"><CheckerIsland /><AdBelowChecker /></div>}
          {normalizedPlatform === "instagram" && (
            <div className="mt-8 bg-white border border-stone-200 shadow-sm rounded-2xl p-6 sm:p-8 text-left">
              <h2 className="text-xl font-bold mb-2">Is your Instagram account shadowbanned?</h2>
              <p className="text-xs text-stone-500 mb-5">Heuristic per About page — no live IG API</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label className="mb-2 block text-sm font-semibold">Instagram username</label><div className="flex items-center border-b-2 border-stone-300 focus-within:border-violet-600 pb-2"><span className="mr-2 text-xl font-bold text-violet-600">@</span><input value={inputVal} onChange={e=>setInputVal(e.target.value.replace(/^@/,""))} placeholder="aljannah.tv" className="flex-1 bg-transparent outline-none" /></div></div>
                <div><label className="mb-2 block text-sm font-semibold">Recent hashtags</label><textarea value={kwInput} onChange={e=>setKwInput(e.target.value)} rows={3} placeholder="#quran #islam #faith" className="w-full rounded-xl border px-3 py-2.5 text-sm" /></div>
              </div>
              <div className="mt-6 flex justify-center"><button onClick={handleCheck} disabled={loading} className="rounded-full bg-black text-white px-8 h-12 font-semibold">{loading ? "Checking..." : "Check Instagram — 0$"}</button></div>
              {igResult && <div className={`mt-6 p-4 rounded-xl border ${igResult.score > 70 ? "bg-emerald-50 border-emerald-200 text-emerald-800" : igResult.score > 40 ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-red-50 border-red-200 text-red-800"}`}><div className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${igResult.score > 70 ? "bg-emerald-500" : igResult.score > 40 ? "bg-amber-400" : "bg-red-500"}`}></span><span className="font-bold">Score {igResult.score}/100 — {igResult.score > 70 ? "🟢 Clean" : igResult.score > 40 ? "🟡 Risk" : "🔴 Flagged"}</span></div><div className="mt-2 text-sm opacity-80">{igResult.reasons?.join(", ")}</div></div>}
              <div className="mt-6"><AdBelowChecker /></div>
            </div>
          )}
          {normalizedPlatform === "tiktok" && renderGeneric("TikTok Shadowban Checker — 0$", "hownwhen")}
          {normalizedPlatform === "youtube" && renderGeneric("YouTube Shadowban Checker — 0$", "villainaudit")}
          {normalizedPlatform === "reddit" && renderGeneric("Reddit Shadowban Checker — 0$", "gutnews247")}
          {normalizedPlatform === "facebook" && renderGeneric("Facebook visibility checker — 0$", "yourpage")}
          <SupportUsButton />
        </div>
      </div>
      <AlertButton handle={inputVal} platform={normalizedPlatform} />
      <SupportPopup isOpen={showSupport} onClose={()=>setShowSupport(false)} isChecking={loading} />
    </main>
  )
}
