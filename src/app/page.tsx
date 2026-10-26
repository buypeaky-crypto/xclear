'use client'
import CheckerIsland from "@/components/CheckerIsland"
import AdBelowChecker from "@/components/AdBelowChecker"
import Link from "next/link"
import {{ useState }} from "react"
import {{ Fraunces, Sora }} from "next/font/google"
import type {{ LocaleDictionary }} from "../lib/i18n/dictionaries"
import type {{ InstagramCopy }} from "../lib/i18n/instagram"
import type {{ FacebookCopy }} from "../lib/i18n/facebook"
import {{ checkInstagram, type IGCheckResult }} from "../lib/instagram/checker"
import CryptoDonationButtons from "../components/CryptoDonationButtons"
import SupportUsButton from "../components/SupportUsButton"
import BrandHomeLink from "../components/BrandHomeLink"
import SupportPopup from "../components/SupportPopup"
import PlatformSwitcher from "../components/PlatformSwitcher"
import {{ localeNames }} from "../lib/i18n/config"
import {{ facebookLocales, getFacebookUrl }} from "../lib/i18n/facebook"
import {{ getInstagramUrl, instagramLocales }} from "../lib/i18n/instagram"
import {{ getTikTokUrl, tiktokLocales }} from "../lib/i18n/tiktok"
import AlertButton from './components/AlertButton'
import TikTokChecker from "../components/TikTokChecker"
import RedditChecker from "../components/RedditChecker"
import YouTubeChecker from "../components/YouTubeChecker"

const fraunces = Fraunces({{ subsets: ["latin"], weight: ["700", "800", "900"], style: ["normal", "italic"], display: "swap" }})
const sora = Sora({{ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" }})

const defaultFaqs = [
  {{ question: "Does X have an official shadowban status?", answer: "X does not provide a single public status that confirms every kind of reduced visibility." }},
  {{ question: "What does this X shadowban check test?", answer: "It checks whether logged-out X endpoints return typeahead, search, and public-profile signals." }},
  {{ question: "Can a clean result prove my posts are not downranked?", answer: "No. Public endpoints cannot reveal all personalized search, recommendation, moderation, or reply-ranking decisions." }},
  {{ question: "Do I need to connect my X account?", answer: "No. Enter a public username only. Never provide a password, verification code, or access token." }},
]

const xVisibilityCards = [
  {{ title: "Search suggestion visibility", description: "The typeahead signal checks whether a logged-out X search suggestion response includes the username. A missing suggestion can happen because of personalization, query matching, endpoint changes, or temporary service limits." }},
  {{ title: "Search visibility", description: "A search request for public posts associated with an account can offer a limited view of search indexing. Results depend on whether the account has public posts, the query, language, location, and X's current search behavior." }},
  {{ title: "Logged-out profile visibility", description: "The public profile signal checks whether X returns the requested account without a signed-in session. A reachable profile only confirms that the profile endpoint responded." }},
  {{ title: "Reply visibility", description: "Reply ranking is conversation-specific. Replies may be collapsed, hidden behind a control, or ordered differently for different viewers." }},
]

export default function Home({{ platform = "x", backgroundClassName = "bg-platform-home" }}: {{ platform?: string; backgroundClassName?: string }} = {{}}) {{
  const [inputVal, setInputVal] = useState(platform === "instagram" ? "aljannah.tv" : "gutnews247")
  const [hashtagInput, setHashtagInput] = useState("#quran #islam #faith")
  const [result, setResult] = useState<any>(null)
  const [igResult, setIgResult] = useState<IGCheckResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSupportPopup, setShowSupportPopup] = useState(false)

  const handleCheck = async () => {{
    const clean = inputVal.replace(/^@/, "").trim()
    if(!clean) return
    setLoading(true); setShowSupportPopup(true)
    if(platform === "instagram"){{ setIgResult(checkInstagram(clean, hashtagInput.split(/[\s,]+/).filter(Boolean))); setLoading(false); return }}
    try{{ const res = await fetch(`/api/check/twitter?username=${{encodeURIComponent(clean)}}`); const data = await res.json(); setResult({{ username: data.username || clean, tests: data.tests }}) }}catch{{}}
    setLoading(false)
  }}

  const getStatusStyle = (status: string) => {{
    if(status === "clear") return {{ bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", dot: "bg-emerald-500" }}
    if(status === "flagged") return {{ bg: "bg-red-50", border: "border-red-200", text: "text-red-800", dot: "bg-red-500" }}
    return {{ bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", dot: "bg-amber-400" }}
  }}

  return (
    <main className={`${{sora.className}} min-h-screen ${{backgroundClassName}} pb-24 text-stone-900`}>
      <div className="max-w-[900px] mx-auto px-4 pt-8">
        <BrandHomeLink />
        <PlatformSwitcher current={platform} />
        <div className="text-center">
          <h1 className={`${{fraunces.className}} text-stone-800 tracking-tight leading-[0.95] font-black italic text-3xl`}>Free Social Media Shadowban Checker & Reach Recovery Tool</h1>

          {/* CHECKER BOXES - TRAFFIC LIGHT - UPDATED ONLY THIS PART */}
          <div className="mt-8">
            <div className="bg-white border border-stone-200 shadow-sm rounded-2xl p-6 sm:p-8 text-left">
              <h2 className="text-xl font-bold mb-5">Check a public {platform} username</h2>
              <div className="flex flex-col sm:flex-row items-end justify-center gap-4">
                <div className="flex flex-col w-full sm:w-auto">
                  <label className="text-sm font-semibold text-stone-700 mb-2">{platform} username</label>
                  <div className="flex items-end border-b-2 border-stone-300 focus-within:border-black pb-1 transition-colors">
                    <span className="text-violet-600 font-bold mr-2 text-lg">@</span>
                    <input value={{inputVal}} onChange={{e=>setInputVal(e.target.value.replace(/^@/,""))}} placeholder={{platform === "instagram" ? "aljannah.tv" : "gutnews247"}} className="w-[220px] bg-transparent outline-none text-[15px] py-1" />
                  </div>
                </div>
                <button onClick={{handleCheck}} disabled={{loading}} className="h-12 px-8 rounded-full bg-black text-white font-semibold hover:bg-zinc-800 transition">{{loading ? "Checking..." : "Check"}}</button>
              </div>

              <div className="mt-6 min-h-[120px]">
                {{loading && <div className="grid grid-cols-3 gap-3 animate-pulse"><div className="h-[96px] rounded-xl bg-stone-100"></div><div className="h-[96px] rounded-xl bg-stone-100"></div><div className="h-[96px] rounded-xl bg-stone-100"></div></div>}}
                {{!loading && result && (
                  <>
                    <div className={{`mb-4 p-4 rounded-xl border flex items-center gap-3 ${{result && Object.values(result.tests).every((t:any)=>t.status==="clear") ? "bg-emerald-50 border-emerald-200 text-emerald-800" : Object.values(result.tests).some((t:any)=>t.status==="flagged") ? "bg-red-50 border-red-200 text-red-800" : "bg-amber-50 border-amber-200 text-amber-800"}}`}}>
                      <span className={{`w-3 h-3 rounded-full ${{Object.values(result.tests).every((t:any)=>t.status==="clear") ? "bg-emerald-500" : Object.values(result.tests).some((t:any)=>t.status==="flagged") ? "bg-red-500" : "bg-amber-400"}}`}}></span>
                      <span className="text-sm font-bold">{{Object.values(result.tests).every((t:any)=>t.status==="clear") ? "🟢 Clean — Search, Suggestion, Profile reachable (logged-out)" : Object.values(result.tests).some((t:any)=>t.status==="flagged") ? "🔴 Ban detected — some signals missing" : "🟡 Unknown — rate-limited"}}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {{Object.entries(result.tests).map(([key, t]: any) => {{ const style = getStatusStyle(t.status); return <div key={{key}} className={{`p-4 rounded-xl border ${{style.bg}} ${{style.border}} text-center`}}><div className="flex items-center justify-center gap-2"><span className={{`w-2.5 h-2.5 rounded-full ${{style.dot}}`}}></span><div className={{`text-sm font-bold ${{style.text}}`}}>{{t.label}}</div></div><div className="mt-2 text-xl">{{t.status === "clear" ? "✅" : t.status === "flagged" ? "❌" : "❓"}}</div><div className={{`mt-1 text-[11px] ${{style.text}}`}}>{{t.detail?.slice(0,90)}}</div><div className={{`mt-2 inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${{style.border}} ${{style.text}}`}}>{{t.status.toUpperCase()}}</div></div> }})}}
                    </div>
                  </>
                )}}
                {{!loading && !result && <div className="flex gap-2 mt-4 flex-wrap justify-center">{{["elonmusk","naval","garyvee"].map(ex=>(<button key={{ex}} onClick={{()=>{{setInputVal(ex); setTimeout(handleCheck,0)}}}} className="text-sm px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200">@{ex}</button>))}}<span className="text-xs text-stone-500 ml-2 self-center">No login • Public only • Cached 1h</span></div>}}
              </div>

              <div className="mt-6"><AdBelowChecker /></div>
            </div>
          </div>

          <section className="mt-10 text-left">
            <h2 className={{`${{fraunces.className}} text-2xl font-bold`}}>Why your reach dropped in 2026</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">Instagram 2026 average: 2.2% engagement, Reels suppressed below 1.1% non-follower reach. TikTok 2026: 6%+ For You reach for accounts under 10k. X/Twitter: reply deboost & ghostban. YouTube: comment suppression & Shorts shelf removal.</p>
          </section>

          <section className="mt-8 grid gap-4 sm:grid-cols-2 text-left">
            {{xVisibilityCards.map(card=>(
              <div key={{card.title}} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <h3 className="font-bold text-stone-900">{{card.title}}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-stone-600">{{card.description}}</p>
              </div>
            ))}}
          </section>

          <section className="mt-8 text-left">
            <h2 className={{`${{fraunces.className}} text-2xl font-bold`}}>3 fixes before you re-check</h2>
            <ol className="mt-4 list-decimal pl-5 text-sm leading-relaxed text-stone-700 space-y-2">
              <li>Remove 3rd-party auto-DM / mass-unfollow apps and check Account Status</li>
              <li>Delete last 2 hashtags or sounds that triggered spam filter, wait 48h</li>
              <li>Post 1 original post without hashtags/links to reset non-follower split, then test again</li>
            </ol>
          </section>

          <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm text-left">
            <h2 className="text-lg font-bold">Frequently asked questions</h2>
            <div className="mt-4 divide-y divide-stone-200">
              {{defaultFaqs.map((faq:any)=>(
                <div key={{faq.question}} className="py-3">
                  <h3 className="text-sm font-semibold">{{faq.question}}</h3>
                  <p className="mt-1 text-[13px] text-stone-600">{{faq.answer}}</p>
                </div>
              ))}}
            </div>
          </section>

          <CryptoDonationButtons />
          <SupportUsButton />
        </div>
      </div>
      <AlertButton handle={{inputVal}} platform={{platform}} />
      <SupportPopup isOpen={{showSupportPopup}} onClose={{() => setShowSupportPopup(false)}} isChecking={{loading}} />
    </main>
  )
}}
