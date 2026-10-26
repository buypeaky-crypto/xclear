'use client'
import CheckerIsland from "@/components/CheckerIsland"
import AdBelowChecker from "@/components/AdBelowChecker"
import Link from "next/link"
import { useState } from "react"
import { Fraunces, Sora } from "next/font/google"
import type { LocaleDictionary } from "../lib/i18n/dictionaries"
import type { InstagramCopy } from "../lib/i18n/instagram"
import type { FacebookCopy } from "../lib/i18n/facebook"
import { checkInstagram, type IGCheckResult } from "../lib/instagram/checker"
import CryptoDonationButtons from "../components/CryptoDonationButtons"
import SupportUsButton from "../components/SupportUsButton"
import BrandHomeLink from "../components/BrandHomeLink"
import SupportPopup from "../components/SupportPopup"
import PlatformSwitcher from "../components/PlatformSwitcher"
import { localeNames } from "../lib/i18n/config"
import { facebookLocales, getFacebookUrl } from "../lib/i18n/facebook"
import { getInstagramUrl, instagramLocales } from "../lib/i18n/instagram"
import { getTikTokUrl, tiktokLocales } from "../lib/i18n/tiktok"
import AlertButton from './components/AlertButton'
import TikTokChecker from "../components/TikTokChecker"
import RedditChecker from "../components/RedditChecker"
import YouTubeChecker from "../components/YouTubeChecker"

const DEFAULT_HANDLES: Record<string, string> = {
  "X (Twitter)": "gutnews247",
  "Instagram": "aljannah.tv",
  "TikTok": "hownwhen",
  "Facebook": "functionSmarterAI",
  "YouTube": "villainaudit",
  "Reddit": "gutnews247",
}
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
})
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const defaultFaqs = [
  { question: "Does X have an official shadowban status?", answer: "X does not provide a single public status that confirms every kind of reduced visibility. Review account notices and X's own visibility controls for authoritative information." },
  { question: "What does this X shadowban check test?", answer: "It checks whether logged-out X endpoints return typeahead, search, and public-profile signals. Reply ranking cannot be confirmed from a username alone, and an unavailable endpoint is marked unknown." },
  { question: "Can a clean result prove my posts are not downranked?", answer: "No. Public endpoints cannot reveal all personalized search, recommendation, moderation, or reply-ranking decisions. Treat each result as a limited signal, not a guarantee." },
  { question: "Do I need to connect my X account?", answer: "No. Enter a public username only. Never provide a password, verification code, or access token to a third-party checker." },
]

const xVisibilityCards = [
  { title: "Search suggestion visibility", description: "The typeahead signal checks whether a logged-out X search suggestion response includes the username. A missing suggestion can happen because of personalization, query matching, endpoint changes, or temporary service limits. It is not, by itself, proof that X has restricted an account. Try the exact handle in a private browser window and compare more than once before treating an absence as meaningful." },
  { title: "Search visibility", description: "A search request for public posts associated with an account can offer a limited view of search indexing. Results depend on whether the account has public posts, the query, language, location, and X's current search behavior. This checker cannot see personalized results or private account notices. An empty or incomplete response is marked inconclusive unless the endpoint provides evidence that can be interpreted reliably." },
  { title: "Logged-out profile visibility", description: "The public profile signal checks whether X returns the requested account without a signed-in session. A reachable profile only confirms that the profile endpoint responded; it does not prove that every post is visible in search or recommendations. A profile may be unavailable for reasons unrelated to a visibility restriction, including a changed handle, suspension, deletion, age or region controls, and temporary errors." },
  { title: "Reply visibility", description: "Reply ranking is conversation-specific. Replies may be collapsed, hidden behind a control, or ordered differently for different viewers. A username alone does not identify a conversation or let a third-party tool inspect the views of multiple logged-out readers. This signal therefore remains unknown here. Ask a trusted person to compare the same public conversation while logged out." },
]

export default function Home({ platform = "x", backgroundClassName = "bg-platform-home", content, locale = "en" }: { platform?: string; backgroundClassName?: string; content?: any; locale?: string } = {}) {
  const [inputVal, setInputVal] = useState(platform === "instagram" ? "aljannah.tv" : "gutnews247")
  const [hashtagInput, setHashtagInput] = useState("#quran #islam #faith")
  const [result, setResult] = useState<any>(null)
  const [igResult, setIgResult] = useState<IGCheckResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSupportPopup, setShowSupportPopup] = useState(false)

  const handleCheck = async () => {
    const clean = inputVal.replace(/^@/, "").trim()
    if(!clean) return
    setLoading(true); setShowSupportPopup(true)
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
    if(status === "clear") return { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", dot: "bg-emerald-500", icon: "🟢" }
    if(status === "flagged") return { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", dot: "bg-red-500", icon: "🔴" }
    return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", dot: "bg-amber-400", icon: "🟡" }
  }

  const xTestKeys = [["suggestion","Search Suggestion"], ["search","Search"], ["profile","Profile"]] as const
  const faqItems = content?.faqs ?? defaultFaqs

  return (
    <main className={`${sora.className} min-h-screen ${backgroundClassName} pb-24 text-stone-900`}>
      <div className="max-w-[900px] mx-auto px-4 pt-8">
        <div className="text-center">
          <h1 className={`${fraunces.className} text-stone-800 tracking-tight leading-[0.95] font-black italic text-3xl`}>
            Free Social Media Shadowban Checker & Reach Recovery Tool
          </h1>
          <p className="mt-3 text-sm text-stone-600">Wondering, "Is my Twitter shadowbanned?" X does not describe its visibility limits as shadowbans, but reach can still be restricted. This free checker tests public, logged-out signals. No login required.</p>

          {/* CHECKER BOXES - TRAFFIC LIGHT - ONLY UPDATED PART */}
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
                      <div className={`mb-4 p-4 rounded-xl border flex items-center gap-3 ${result && Object.values(result.tests).every((t:any)=>t.status==="clear") ? "bg-emerald-50 border-emerald-200 text-emerald-800" : Object.values(result.tests).some((t:any)=>t.status==="flagged") ? "bg-red-50 border-red-200 text-red-800" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
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
                <p className="text-sm text-stone-600 text-center mb-6">Enter an Instagram username to assess hashtag visibility, Explore potential, and engagement patterns from public signals. Results are heuristic and not supplied directly by Instagram.</p>
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

          {/* LONG SEO - KEPT FROM YOUR 900+ FILE */}
          <section className="mt-10 text-left">
            <h2 className={`${fraunces.className} text-2xl font-bold`}>Why your reach dropped in 2026</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">Instagram 2026 average: 2.2% engagement, Reels suppressed below 1.1% non-follower reach. TikTok 2026: 6%+ For You reach for accounts under 10k. X/Twitter: reply deboost & ghostban. YouTube: comment suppression & Shorts shelf removal. If you're below those benchmarks, you're filtered.</p>
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
            <ol className="mt-4 list-decimal pl-5 text-sm leading-relaxed text-stone-700 space-y-2">
              <li>Remove 3rd-party auto-DM / mass-unfollow apps and check Account Status</li>
              <li>Delete last 2 hashtags or sounds that triggered spam filter, wait 48h</li>
              <li>Post 1 original post without hashtags/links to reset non-follower split, then test again</li>
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
        </div>
      </div>
      <AlertButton handle={inputVal} platform={platform} />
      <SupportPopup isOpen={showSupportPopup} onClose={() => setShowSupportPopup(false)} isChecking={loading} />
    </main>
  )
}
