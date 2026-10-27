'use client'
import { useState } from "react"
import { Fraunces, Sora } from "next/font/google"
import AdBelowChecker from "@/components/AdBelowChecker"
import SupportUsButton from "../components/SupportUsButton"
import BrandHomeLink from "../components/BrandHomeLink"
import SupportPopup from "../components/SupportPopup"
import PlatformSwitcher from "../components/PlatformSwitcher"
import AlertButton from './components/AlertButton'
import TikTokChecker from "../components/TikTokChecker"
import RedditChecker from "../components/RedditChecker"
import YouTubeChecker from "../components/YouTubeChecker"
import { checkInstagram, type IGCheckResult } from "../lib/instagram/checker"
import CryptoDonationButtons from "../components/CryptoDonationButtons"

const fraunces = Fraunces({ subsets: ["latin"], weight: ["700", "800", "900"], style: ["normal", "italic"], display: "swap" })
const sora = Sora({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" })

type Platform = "x" | "twitter" | "instagram" | "facebook" | "tiktok" | "youtube" | "reddit"
type Props = {
  platform?: Platform | string
  backgroundClassName?: string
  variant?: string
  content?: any
  locale?: string
  dictionary?: any
}

// X checker types
type CheckStatus = "detected" | "not_detected" | "unknown"
interface SignalResult {
  id: string
  label: string
  status: CheckStatus
  explanation: string
  checkedAt: string
  source: string
}
interface CheckerResponse {
  platform: string
  username: string
  checkedAt: string
  cached: boolean
  cacheAgeSeconds?: number
  results: SignalResult[]
  limitations: string[]
}

const xVisibilityCards = [
  { title: "Search suggestion visibility", description: "The typeahead signal checks whether a logged-out X search suggestion response includes the username. A missing suggestion can happen because of personalization, query matching, endpoint changes, or temporary service limits." },
  { title: "Search visibility", description: "A search request for public posts associated with an account can offer a limited view of search indexing. Results depend on whether the account has public posts, the query, language, location, and X's current search behavior." },
  { title: "Logged-out profile visibility", description: "The public profile signal checks whether X returns the requested account without a signed-in session. A reachable profile only confirms that the profile endpoint responded." },
  { title: "Reply visibility", description: "Reply ranking is conversation-specific. Replies may be collapsed, hidden behind a control, or ordered differently for different viewers. A username alone does not identify a conversation." },
]

export default function Home({ platform = "x", backgroundClassName = "bg-[#fef9e7]", variant, content, locale, dictionary }: Props = {}) {
  const normalizedPlatform = (platform === "twitter" ? "x" : platform) as Platform
  const [inputVal, setInputVal] = useState(normalizedPlatform === "instagram" ? "aljannah.tv" : "gutnews247")
  const [hashtagInput, setHashtagInput] = useState("#quran #islam #faith")
  const [data, setData] = useState<CheckerResponse | null>(null)
  const [igResult, setIgResult] = useState<IGCheckResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSupport, setShowSupport] = useState(false)
  const [error, setError] = useState("")

  const handleCheck = async () => {
    const clean = inputVal.replace(/^@/, "").trim()
    if(!clean) return
    setLoading(true); setShowSupport(true); setError(""); setData(null); setIgResult(null)
    
    if(normalizedPlatform === "instagram"){
      setIgResult(checkInstagram(clean, hashtagInput.split(/[\s,]+/).filter(Boolean)))
      setLoading(false); return
    }
    
    // X checker - real API
    if(normalizedPlatform === "x"){
      try{
        const res = await fetch(`/api/check/twitter?username=${encodeURIComponent(clean)}`, { cache: "no-store" })
        if(res.status === 429){
          const j = await res.json().catch(()=>({}))
          setError(j.error || "Rate limited — 10 req/10s per IP. Cached 1h. Wait 30s.")
          setLoading(false); return
        }
        const j = await res.json()
        if(j.error){ setError(j.error); setLoading(false); return }
        const checkedAt = j.timestamp || j.checkedAt || new Date().toISOString()
        const results: SignalResult[] = []
        if(j.tests){
          for(const [id, t] of Object.entries(j.tests as any)){
            const raw = t as any
            results.push({
              id,
              label: raw.label || id,
              status: raw.status === "clear" ? "detected" : raw.status === "flagged" ? "not_detected" : "unknown",
              explanation: raw.detail || "No reliable result",
              checkedAt,
              source: id === "suggestion" ? "typeahead.json" : id === "search" ? "search/adaptive.json" : "x.com/{username}"
            })
          }
        } else if(j.profile !== undefined){
          const map: any = { profile: j.profile, search: j.search, suggestion: j.suggestion }
          for(const [k,v] of Object.entries(map)){
            if(v !== undefined){
              results.push({
                id: k,
                label: k === "profile" ? "Profile visibility" : k === "search" ? "Search visibility" : "Search suggestion",
                status: v === true ? "detected" : v === false ? "not_detected" : "unknown",
                explanation: v === true ? "Public endpoint returned username" : v === false ? "Endpoint returned but username missing" : "Rate-limited or blocked",
                checkedAt,
                source: k
              })
            }
          }
        }
        setData({
          platform: "x",
          username: j.username || clean,
          checkedAt,
          cached: !!j.cached,
          cacheAgeSeconds: j.cacheAgeSeconds,
          results,
          limitations: ["Logged-out check only", "Cannot prove reply ranking", "Personalization may affect suggestion"]
        })
      }catch(e){
        setError("Upstream timeout or blocked. Marked as unknown, not a ban proof.")
      }
      setLoading(false)
      return
    }
    
    // Other platforms handled by their own components
    setLoading(false)
  }

  const styleFor = (s: CheckStatus) => {
    if(s === "detected") return { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", dot: "bg-emerald-500", icon: "✅", label: "DETECTED" }
    if(s === "not_detected") return { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", dot: "bg-red-500", icon: "❌", label: "NOT DETECTED" }
    return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", dot: "bg-amber-400", icon: "❓", label: "UNKNOWN" }
  }

  return (
    <main className={`${sora.className} min-h-screen ${backgroundClassName} pb-24 text-stone-900`}>
      <div className="max-w-[900px] mx-auto px-4 pt-6">
        <BrandHomeLink locale="en" />
        <PlatformSwitcher activePlatform={normalizedPlatform} />
        
        <div className="text-center mt-6">
          <h1 className={`${fraunces.className} text-stone-800 tracking-tight font-black italic text-3xl`}>
            {normalizedPlatform === "x" ? "Free X / Twitter Shadowban Checker" : `Is your ${normalizedPlatform} account shadowbanned?`}
          </h1>
          <p className="mt-3 text-sm text-stone-600">Free · No login · Public signals only · {normalizedPlatform === "x" ? "Real guest-token check, cached 1h" : "Heuristic + public signals"}</p>

          {/* CHECKER BOX - ALL PLATFORMS */}
          <div className="mt-8">
            {/* X CHECKER */}
            {normalizedPlatform === "x" && (
              <div className="bg-white border border-stone-200 shadow-sm rounded-2xl p-6 sm:p-8 text-left">
                <h2 className="text-xl font-bold mb-5">Check a public X username</h2>
                <div className="flex flex-col sm:flex-row items-end justify-center gap-4">
                  <div className="flex flex-col w-full sm:w-auto">
                    <label className="text-sm font-semibold text-stone-700 mb-2">X username</label>
                    <div className="flex items-end border-b-2 border-stone-300 focus-within:border-black pb-1">
                      <span className="text-violet-600 font-bold mr-2 text-lg">@</span>
                      <input value={inputVal} onChange={e=>setInputVal(e.target.value.replace(/^@/,""))} onKeyDown={e=>e.key==="Enter"&&handleCheck()} placeholder="gutnews247" className="w-[220px] bg-transparent outline-none text-[15px] py-1" />
                    </div>
                  </div>
                  <button onClick={handleCheck} disabled={loading} className="h-12 px-8 rounded-full bg-black text-white font-semibold hover:bg-zinc-800 disabled:opacity-50">{loading ? "Checking..." : "Check"}</button>
                </div>

                <div className="mt-6 min-h-[160px]">
                  {loading && <div className="grid grid-cols-3 gap-3 animate-pulse"><div className="h-[110px] bg-stone-100 rounded-xl"></div><div className="h-[110px] bg-stone-100 rounded-xl"></div><div className="h-[110px] bg-stone-100 rounded-xl"></div></div>}
                  {error && <div className="p-4 rounded-xl border bg-amber-50 border-amber-200 text-amber-800 text-sm">{error}</div>}
                  {data && (
                    <>
                      <div className={`mb-4 p-4 rounded-xl border flex items-center gap-3 ${data.results.every(r=>r.status==="detected") ? "bg-emerald-50 border-emerald-200 text-emerald-800" : data.results.some(r=>r.status==="not_detected") ? "bg-red-50 border-red-200 text-red-800" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
                        <span className={`w-3 h-3 rounded-full ${data.results.every(r=>r.status==="detected") ? "bg-emerald-500" : data.results.some(r=>r.status==="not_detected") ? "bg-red-500" : "bg-amber-400"}`}></span>
                        <span className="text-sm font-bold">{data.results.every(r=>r.status==="detected") ? `🟢 Clean — @${data.username}` : data.results.some(r=>r.status==="not_detected") ? `🔴 Some signals not detected` : `🟡 Unable to verify`}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {data.results.map(r=>{
                          const s = styleFor(r.status)
                          return (
                            <div key={r.id} className={`p-4 rounded-xl border ${s.bg} ${s.border} text-center`}>
                              <div className="flex items-center justify-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${s.dot}`}></span><div className={`text-sm font-bold ${s.text}`}>{r.label}</div></div>
                              <div className="mt-2 text-xl">{s.icon}</div>
                              <div className={`mt-1 text-[10px] font-bold border rounded-full inline-flex px-2 py-0.5 ${s.border} ${s.text}`}>{s.label}</div>
                              <div className={`mt-2 text-[11px] ${s.text}`}>{r.explanation.slice(0,100)}</div>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}
                  {!data && !loading && !error && (
                    <div className="flex gap-2 mt-4 flex-wrap justify-center">
                      {["elonmusk","naval","gutnews247"].map(ex=>(
                        <button key={ex} onClick={()=>{setInputVal(ex); setTimeout(handleCheck,50)}} className="text-sm px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200">@{ex}</button>
                      ))}
                      <span className="text-xs text-stone-500 ml-2 self-center">No login · Cached 1h · Free guest token — $0 cost</span>
                    </div>
                  )}
                </div>
                <div className="mt-6"><AdBelowChecker /></div>
              </div>
            )}

            {/* INSTAGRAM CHECKER */}
            {normalizedPlatform === "instagram" && (
              <div className="bg-white border border-stone-200 shadow-sm rounded-2xl p-6 sm:p-8 text-left">
                <h2 className={`${fraunces.className} text-xl font-black italic text-center mb-2`}>Is your Instagram account shadowbanned?</h2>
                <p className="text-sm text-stone-600 text-center mb-6">Heuristic check — no live Instagram request, per your About page. Analyzes hashtags & engagement patterns.</p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">Instagram username</label>
                    <div className="flex items-center border-b-2 border-stone-300 focus-within:border-violet-600 pb-2">
                      <span className="mr-2 text-xl font-bold text-violet-600">@</span>
                      <input value={inputVal} onChange={e=>setInputVal(e.target.value.replace(/^@/,""))} placeholder="aljannah.tv" className="flex-1 bg-transparent outline-none text-[15px]" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold">Recent hashtags</label>
                    <textarea value={hashtagInput} onChange={e=>setHashtagInput(e.target.value)} rows={2} placeholder="#quran #islam #faith" className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm" />
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <button onClick={handleCheck} disabled={loading} className="rounded-full bg-black text-white px-8 h-12 font-semibold hover:bg-zinc-800 disabled:opacity-50">{loading ? "Checking..." : "Check"}</button>
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

            {/* TIKTOK */}
            {normalizedPlatform === "tiktok" && <div className="bg-white border border-stone-200 rounded-2xl p-6"><TikTokChecker locale="en" /></div>}
            {/* YOUTUBE */}
            {normalizedPlatform === "youtube" && <div className="bg-white border border-stone-200 rounded-2xl p-6"><YouTubeChecker locale="en" /></div>}
            {/* REDDIT */}
            {normalizedPlatform === "reddit" && <div className="bg-white border border-stone-200 rounded-2xl p-6"><RedditChecker locale="en" /></div>}
            {/* FACEBOOK */}
            {normalizedPlatform === "facebook" && (
              <div className="bg-white border border-stone-200 rounded-2xl p-6 text-left">
                <h2 className="text-xl font-bold mb-2">Facebook URL checker</h2>
                <p className="text-sm text-stone-600 mb-4">Enter a Facebook profile, Page, or post URL. No live Graph API check yet — URL validation only.</p>
                <input value={inputVal} onChange={e=>setInputVal(e.target.value)} placeholder="https://www.facebook.com/yourpage" className="w-full rounded-md border border-stone-300 px-3 py-3 text-sm" />
                <div className="mt-4 flex justify-center"><button onClick={handleCheck} className="rounded-full border border-stone-300 px-7 py-2.5 text-[13px] font-semibold">Check</button></div>
                <div className="mt-6"><AdBelowChecker /></div>
              </div>
            )}
          </div>

          {/* SEO - WHY REACH DROPPED */}
          <section className="mt-10 text-left">
            <h2 className={`${fraunces.className} text-2xl font-bold`}>Why your reach dropped in 2026</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">X/Twitter: reply deboost & ghostban. Instagram: heuristic only per About page. TikTok, YouTube, Facebook, Reddit: public signals only. No checker can prove official platform restriction — use as diagnostic clue + check official Account Status.</p>
          </section>

          <section className="mt-8 grid gap-4 sm:grid-cols-2 text-left">
            {xVisibilityCards.map(card=>(
              <div key={card.title} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <h3 className="font-bold text-stone-900">{card.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-stone-600">{card.description}</p>
              </div>
            ))}
          </section>

          <CryptoDonationButtons />
          <SupportUsButton />
        </div>
      </div>
      <AlertButton handle={inputVal} platform={normalizedPlatform} />
      <SupportPopup isOpen={showSupport} onClose={()=>setShowSupport(false)} isChecking={loading} />
    </main>
  )
}
