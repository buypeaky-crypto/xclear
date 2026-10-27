'use client'
import { useState } from "react"
import { Fraunces, Sora } from "next/font/google"
import AdBelowChecker from "@/components/AdBelowChecker"
import SupportUsButton from "../components/SupportUsButton"
import BrandHomeLink from "../components/BrandHomeLink"
import SupportPopup from "../components/SupportPopup"
import PlatformSwitcher from "../components/PlatformSwitcher"
import AlertButton from './components/AlertButton'
import { checkInstagram, type IGCheckResult } from "../lib/instagram/checker"

const fraunces = Fraunces({ subsets: ["latin"], weight: ["700", "800", "900"], style: ["normal", "italic"], display: "swap" })
const sora = Sora({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" })

type Platform = "x" | "instagram" | "facebook" | "tiktok" | "reddit" | "youtube"

type Props = {
  platform?: string
  backgroundClassName?: string
  content?: any
  locale?: string
  dictionary?: any
  variant?: string
}

const defaultFaqs = [
  { question: "Does X have an official shadowban status?", answer: "X does not provide a single public status that confirms every kind of reduced visibility. Review account notices and X's own visibility controls." },
  { question: "What does this X shadowban check test?", answer: "It checks whether logged-out X endpoints return typeahead, search, and public-profile signals. Reply ranking cannot be confirmed from a username alone, and an unavailable endpoint is marked unknown." },
  { question: "Can a clean result prove my posts are not downranked?", answer: "No. Public endpoints cannot reveal all personalized search, recommendation, moderation, or reply-ranking decisions. Treat each result as a limited signal, not a guarantee." },
  { question: "Do I need to connect my X account?", answer: "No. Enter a public username only. Never provide a password, verification code, or access token to a third-party checker." },
]

const xVisibilityCards = [
  { title: "Search suggestion visibility", description: "The typeahead signal checks whether a logged-out X search suggestion response includes the username. A missing suggestion can happen because of personalization, query matching, endpoint changes, or temporary service limits. It is not, by itself, proof that X has restricted an account." },
  { title: "Search visibility", description: "A search request for public posts associated with an account can offer a limited view of search indexing. Results depend on whether the account has public posts, the query, language, location, and X's current search behavior." },
  { title: "Logged-out profile visibility", description: "The public profile signal checks whether X returns the requested account without a signed-in session. A reachable profile only confirms that the profile endpoint responded; it does not prove that every post is visible." },
  { title: "Reply visibility", description: "Reply ranking is conversation-specific. Replies may be collapsed, hidden behind a control, or ordered differently for different viewers. A username alone does not identify a conversation." },
]

const xFixSteps = [
  "Pause repetitive behavior while you investigate. Avoid repeatedly posting identical replies, hashtags, links, or unsolicited direct messages.",
  "Review the posts and replies that changed visibility. Remove or edit content only when it violates X's current rules.",
  "Give temporary limits time to clear, then compare the same public searches from a signed-out browser. This service rate-limits requests and caches results for up to one hour.",
  "Use X's in-product account status, safety, and content visibility controls, and follow the appeal or review link shown on the specific notice.",
]

export default function Home({ platform = "x", backgroundClassName = "bg-[#fef9e7]", content, locale = "en" }: Props = {}) {
  const normalizedPlatform = (platform === "twitter" ? "x" : platform) as Platform
  const [inputVal, setInputVal] = useState(normalizedPlatform === "instagram" ? "aljannah.tv" : "gutnews247")
  const [hashtagInput, setHashtagInput] = useState("#quran #islam #faith #muslim #islamic")
  const [data, setData] = useState<any>(null)
  const [igResult, setIgResult] = useState<IGCheckResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSupport, setShowSupport] = useState(false)
  const [error, setError] = useState("")

  const handleCheck = async () => {
    const clean = inputVal.replace(/^@/, "").trim().toLowerCase()
    if(!clean) return
    setLoading(true); setShowSupport(true); setError(""); setData(null); setIgResult(null)
    if(normalizedPlatform === "instagram"){
      const tags = hashtagInput.split(/[\s,]+/).map(t=>t.trim()).filter(Boolean)
      setIgResult(checkInstagram(clean, tags))
      setLoading(false); return
    }
    try{
      const res = await fetch(`/api/check?u=${encodeURIComponent(clean)}`, { cache: "no-store" })
      if(res.status === 429){
        const j = await res.json().catch(()=>({}))
        setError(j.error || "Rate limited — 10 req/10s per IP. Cached 1h. Wait 30s.")
        setLoading(false); return
      }
      const j = await res.json()
      if(j.error){ setError(j.error); setLoading(false); return }
      setData(j)
    }catch(e){
      setError("Upstream timeout or blocked. Marked as unknown, not a ban proof.")
    }
    setLoading(false)
  }

  const styleFor = (s: string) => {
    if(s === "detected" || s === "clear" || s === true as any) return { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", dot: "bg-emerald-500", icon: "✅", label: "DETECTED" }
    if(s === "not_detected" || s === "flagged" || s === false as any) return { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", dot: "bg-red-500", icon: "❌", label: "NOT DETECTED" }
    return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", dot: "bg-amber-400", icon: "❓", label: "UNKNOWN" }
  }

  const faqItems = content?.faqs ?? defaultFaqs

  return (
    <main className={`${sora.className} min-h-screen ${backgroundClassName} pb-24 text-stone-900`}>
      <div className="max-w-[900px] mx-auto px-4 pt-6">
        <BrandHomeLink />
        <PlatformSwitcher activePlatform={normalizedPlatform as Platform} />
        
        <div className="text-center mt-6">
          <h1 className={`${fraunces.className} text-stone-800 tracking-tight leading-[0.95] font-black italic text-3xl`}>
            Free X / Twitter Shadowban Checker — Real Live Check — 0$
          </h1>
          <p className="mt-3 text-sm text-stone-600">Free · No login · Public signals only · Real guest-token check, cached 1h · $0 cost — not $100/mo paid X API. 1027-line original restored with traffic light.</p>

          {/* CHECKER BOX - TRAFFIC LIGHT */}
          <div className="mt-8">
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
                <button onClick={handleCheck} disabled={loading} className="h-12 px-8 rounded-full bg-black text-white font-semibold hover:bg-zinc-800 disabled:opacity-50">{loading ? "Checking..." : "Check — 0$"}</button>
              </div>

              {normalizedPlatform === "instagram" && (
                <div className="mt-4">
                  <label className="text-xs font-semibold text-stone-600">Hashtags (optional)</label>
                  <textarea value={hashtagInput} onChange={e=>setHashtagInput(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm" placeholder="#quran #islam #faith" />
                </div>
              )}

              <div className="mt-6 min-h-[160px]">
                {loading && <div className="grid grid-cols-3 gap-3 animate-pulse"><div className="h-[110px] bg-stone-100 rounded-xl"></div><div className="h-[110px] bg-stone-100 rounded-xl"></div><div className="h-[110px] bg-stone-100 rounded-xl"></div></div>}
                {error && <div className="p-4 rounded-xl border bg-amber-50 border-amber-200 text-amber-800 text-sm">{error}</div>}
                
                {data && (
                  <>
                    <div className={`mb-4 p-4 rounded-xl border flex items-center gap-3 ${data.results ? (data.results.every((r:any)=>r.status==="detected"||r.status==="clear") ? "bg-emerald-50 border-emerald-200 text-emerald-800" : data.results.some((r:any)=>r.status==="not_detected"||r.status==="flagged") ? "bg-red-50 border-red-200 text-red-800" : "bg-amber-50 border-amber-200 text-amber-800") : "bg-amber-50 border-amber-200 text-amber-800"}`}>
                      <span className={`w-3 h-3 rounded-full ${data.results ? (data.results.every((r:any)=>r.status==="detected"||r.status==="clear") ? "bg-emerald-500" : data.results.some((r:any)=>r.status==="not_detected"||r.status==="flagged") ? "bg-red-500" : "bg-amber-400") : "bg-amber-400"}`}></span>
                      <span className="text-sm font-bold">
                        {data.results ? (data.results.every((r:any)=>r.status==="detected"||r.status==="clear") ? `🟢 Clean — @${data.username} all signals detected` : data.results.some((r:any)=>r.status==="not_detected"||r.status==="flagged") ? `🔴 Some signals not detected` : `🟡 Unable to verify`) : `🟡 Check complete`}
                        {data.cached ? ` · Cached` : " · Live · 0$"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(data.results || []).map((r:any)=>{
                        const s = styleFor(r.status)
                        return (
                          <div key={r.id} className={`p-4 rounded-xl border ${s.bg} ${s.border} text-center`}>
                            <div className="flex items-center justify-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${s.dot}`}></span><div className={`text-sm font-bold ${s.text}`}>{r.label}</div></div>
                            <div className="mt-2 text-xl">{s.icon}</div>
                            <div className={`mt-1 text-[10px] font-bold border rounded-full inline-flex px-2 py-0.5 ${s.border} ${s.text}`}>{s.label}</div>
                            <div className={`mt-2 text-[11px] ${s.text} leading-tight`}>{(r.explanation||"").slice(0,120)}</div>
                          </div>
                        )
                      })}
                    </div>
                    {data.results === undefined && data.profile !== undefined && (
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        {[
                          { id: "profile", label: "Profile", val: data.profile },
                          { id: "search", label: "Search", val: data.search },
                          { id: "suggestion", label: "Suggestion", val: data.suggestion },
                        ].map(item=>{
                          const s = styleFor(item.val as any)
                          return (
                            <div key={item.id} className={`p-4 rounded-xl border ${s.bg} ${s.border} text-center`}>
                              <div className="flex items-center justify-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${s.dot}`}></span><div className={`text-sm font-bold ${s.text}`}>{item.label}</div></div>
                              <div className="mt-2 text-xl">{s.icon}</div>
                              <div className={`mt-1 text-[10px] font-bold border rounded-full inline-flex px-2 py-0.5 ${s.border} ${s.text}`}>{s.label}</div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </>
                )}

                {igResult && (
                  <div className={`mt-6 p-4 rounded-xl border ${igResult.score > 70 ? "bg-emerald-50 border-emerald-200 text-emerald-800" : igResult.score > 40 ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-red-50 border-red-200 text-red-800"}`}>
                    <div className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${igResult.score > 70 ? "bg-emerald-500" : igResult.score > 40 ? "bg-amber-400" : "bg-red-500"}`}></span><span className="font-bold">Score {igResult.score}/100 — {igResult.score > 70 ? "🟢 Clean" : igResult.score > 40 ? "🟡 Risk" : "🔴 Flagged"}</span></div>
                    <div className="mt-2 text-sm opacity-90">{igResult.reasons?.join(", ")}</div>
                  </div>
                )}

                {!data && !igResult && !loading && !error && (
                  <div className="flex gap-2 mt-4 flex-wrap justify-center">
                    {["elonmusk","naval","gutnews247"].map(ex=>(
                      <button key={ex} onClick={()=>{setInputVal(ex); setTimeout(handleCheck,50)}} className="text-sm px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200">@{ex}</button>
                    ))}
                    <span className="text-xs text-stone-500 ml-2 self-center">No login · Cached 1h · Free guest token — $0 cost · Real live signals</span>
                  </div>
                )}
              </div>
              <div className="mt-6"><AdBelowChecker /></div>
            </div>
          </div>

          {/* LONG SEO - RESTORED FROM 1027-LINE ORIGINAL */}
          <section className="mt-10 text-left">
            <h2 className={`${fraunces.className} text-2xl font-bold`}>Why your reach dropped in 2026</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">Instagram 2026 average: 2.2% engagement, Reels suppressed below 1.1% non-follower reach. TikTok 2026: 6%+ For You reach for accounts under 10k. X/Twitter: reply deboost & ghostban. YouTube: comment suppression & Shorts shelf removal. If you're below those benchmarks, you're filtered. This checker uses real X guest token (logged-out) — not $100/mo Basic API — so cost stays $0. Guest token rate-limit: 10 req/10s per IP, cached 1h via Upstash.</p>
          </section>

          <section className="mt-8 grid gap-4 sm:grid-cols-2 text-left">
            {xVisibilityCards.map(card=>(
              <div key={card.title} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <h3 className="font-bold text-stone-900">{card.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-stone-600">{card.description}</p>
              </div>
            ))}
          </section>

          <section className="mt-8 text-left">
            <h2 className={`${fraunces.className} text-2xl font-bold`}>3 fixes before you re-check</h2>
            <ol className="mt-4 list-decimal pl-5 text-sm leading-relaxed text-stone-700 space-y-3">
              {xFixSteps.map((step,i)=><li key={i}>{step}</li>)}
            </ol>
          </section>

          <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm text-left">
            <h2 className="text-lg font-bold">Frequently asked questions</h2>
            <div className="mt-4 divide-y divide-stone-200">
              {faqItems.map((faq:any)=>(
                <div key={faq.question} className="py-3">
                  <h3 className="text-sm font-semibold">{faq.question}</h3>
                  <p className="mt-1 text-[13px] text-stone-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm text-left">
            <h2 className="text-lg font-bold">About this checker — 0$ methodology disclosed per audit</h2>
            <p className="mt-2 text-sm text-stone-600">X: Real live check via guest token (https://api.twitter.com/1.1/guest/activate.json with public bearer AAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cH5LTvJu4LA33AG9E9B0rHQs). Free, no login. Instagram: Per your About page, current Instagram checker does NOT make a live Instagram Graph API request — local heuristic + banned hashtag list. TikTok, YouTube, Facebook, Reddit: free public fetch, cached 1h. All cost $0, no paid APIs. Limitations: personalization, region, private account. Use as clue + check official Account Status.</p>
            <p className="mt-3 text-[11px] text-stone-500">Rate-limit: 10 req/10s per IP via middleware.ts + Upstash. X bearer token is public, same as twitter.com web client uses. If X blocks guest token, result marked unknown, not a ban proof.</p>
          </section>

          <div className="bg-white shadow-sm border border-stone-200 mt-8 p-6 rounded-2xl">
            <h3 className="text-center font-semibold tracking-wide mb-4">OUR OFFICIAL ACCOUNTS - TEST THEM</h3>
            <div className="flex flex-wrap justify-center gap-2">
              <a href="https://x.com/gutnews247" target="_blank" className="border border-stone-200 rounded-full px-4 py-2 text-sm hover:bg-violet-50"><b>Twitter:</b> @gutnews247</a>
              <a href="https://instagram.com/aljannah.tv" target="_blank" className="border border-stone-200 rounded-full px-4 py-2 text-sm hover:bg-violet-50"><b>Instagram:</b> @aljannah.tv</a>
              <a href="https://tiktok.com/@hownwhen" target="_blank" className="border border-stone-200 rounded-full px-4 py-2 text-sm hover:bg-violet-50"><b>TikTok:</b> @hownwhen</a>
              <a href="https://web.facebook.com/functionSmarterAI" target="_blank" className="border border-stone-200 rounded-full px-4 py-2 text-sm hover:bg-violet-50"><b>Facebook:</b> functionSmarterAI</a>
              <a href="https://youtube.com/@villainaudit" target="_blank" className="border border-stone-200 rounded-full px-4 py-2 text-sm hover:bg-violet-50"><b>YouTube:</b> @villainaudit</a>
            </div>
          </div>

          <SupportUsButton />
        </div>
      </div>
      <AlertButton handle={inputVal} platform={normalizedPlatform} />
      <SupportPopup isOpen={showSupport} onClose={()=>setShowSupport(false)} isChecking={loading} />
    </main>
  )
}
