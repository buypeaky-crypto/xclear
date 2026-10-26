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
  {
    question: "Does X have an official shadowban status?",
    answer: "X does not provide a single public status that confirms every kind of reduced visibility. Review account notices and X's own visibility controls for authoritative information.",
  },
  {
    question: "What does this X shadowban check test?",
    answer: "It checks whether logged-out X endpoints return typeahead, search, and public-profile signals. Reply ranking cannot be confirmed from a username alone, and an unavailable endpoint is marked unknown.",
  },
  {
    question: "Can a clean result prove my posts are not downranked?",
    answer: "No. Public endpoints cannot reveal all personalized search, recommendation, moderation, or reply-ranking decisions. Treat each result as a limited signal, not a guarantee.",
  },
  {
    question: "Do I need to connect my X account?",
    answer: "No. Enter a public username only. Never provide a password, verification code, or access token to a third-party checker.",
  },
]

const xVisibilityCards = [
  {
    title: "Search suggestion visibility",
    description: "The typeahead signal checks whether a logged-out X search suggestion response includes the username. A missing suggestion can happen because of personalization, query matching, endpoint changes, or temporary service limits. It is not, by itself, proof that X has restricted an account. Try the exact handle in a private browser window and compare more than once before treating an absence as meaningful. Make sure the spelling and punctuation match the public handle, and remember that suggestions can be affected by the query and the viewer's location or recent activity. A successful response confirms only that this endpoint returned a suggestion at that moment. It does not measure impressions, recommendations, or what every user sees. If the endpoint is unavailable or rate-limited, the result stays unknown instead of treating a failed request as a ban.",
  },
  {
    title: "Search visibility",
    description: "A search request for public posts associated with an account can offer a limited view of search indexing. Results depend on whether the account has public posts, the query, language, location, and X's current search behavior. This checker cannot see personalized results or private account notices. An empty or incomplete response is marked inconclusive unless the endpoint provides evidence that can be interpreted reliably. A new or quiet account may have no matching posts; protected, deleted, or age-restricted material also will not behave like ordinary public posts. Search may take time to index new content and may rank identical queries differently. Compare a specific public post from a signed-out session rather than relying on a single broad query. Even repeated absence is a reason to inspect X's own account notices, not a definitive diagnosis from a third party.",
  },
  {
    title: "Logged-out profile visibility",
    description: "The public profile signal checks whether X returns the requested account without a signed-in session. A reachable profile only confirms that the profile endpoint responded; it does not prove that every post is visible in search or recommendations. A profile may be unavailable for reasons unrelated to a visibility restriction, including a changed handle, suspension, deletion, age or region controls, and temporary errors. Check that the entered username is current and does not include a URL or extra punctuation. If the profile loads in one browser but not another, sign-in state, region, age settings, or an intermittent platform response may explain the difference. This test does not inspect private analytics, follower-only posts, or account status messages. Treat a positive profile response as one narrow observation and use the platform's own notices to understand any account-specific action.",
  },
  {
    title: "Reply visibility",
    description: "Reply ranking is conversation-specific. Replies may be collapsed, hidden behind a control, or ordered differently for different viewers. A username alone does not identify a conversation or let a third-party tool inspect the views of multiple logged-out readers. This signal therefore remains unknown here. Ask a trusted person to compare the same public conversation while logged out, and check any account notices in X before drawing a conclusion. Compare the same reply URL and conversation rather than searching only for the author's handle. Replies can be deleted, filtered by the author, hidden by a viewer's settings, or ranked below a platform control for ordinary quality and safety reasons. A difference between accounts is not enough to establish a penalty. X alone can explain whether it applied a specific visibility action, and a supported appeal should refer to the notice or content involved.",
  },
]

const xFixSteps = [
  "Pause repetitive behavior while you investigate. Avoid repeatedly posting identical replies, hashtags, links, or unsolicited direct messages; normal posting frequency varies by account and there is no universal safe quota. Check recent activity for automation, duplicate posts, or behavior that may have triggered a platform warning. Do not try to evade a restriction with alternate accounts or rapid retries. A short pause is a practical troubleshooting step, not a guaranteed fix or an admission that a rule was broken.",
  "Review the posts and replies that changed visibility. Remove or edit content only when it violates X's current rules or you no longer want it public. Keep a copy of relevant account notices and avoid mass-deleting content based only on an inconclusive third-party result. Check the date, affected post, and wording of any notice; distinguish content removal from reduced search or recommendation eligibility. If an item is accurate and allowed, use the review path attached to that specific decision rather than repeatedly reposting it.",
  "Give temporary limits time to clear, then compare the same public searches from a signed-out browser. Recheck after a reasonable interval rather than submitting many rapid checks; this service rate-limits requests and caches results for up to one hour. Compare several posts with similar topics and ages, and record the query, time, and whether the viewer was logged in. Audience changes, seasonality, competition, and ranking experiments can change reach without any account restriction. One post's views are not a reliable account-wide measurement.",
  "Use X's in-product account status, safety, and content visibility controls, and follow the appeal or review link shown on the specific notice. Menu names and available controls can change. Only X can confirm an account-level decision or restore distribution. Review the current rules and any explanation tied to a particular post before appealing, and include relevant URLs if the official form requests them. Do not give a third-party checker your password, verification code, or access token. If there is no account notice, continue to treat public endpoint results as clues rather than a confirmed penalty.",
]



const xTestKeys = [
  ["searchSuggestion", "Search Suggestion"],
  ["searchBan", "Search Ban"],
  ["ghostBan", "Ghost Ban"],
  ["replyDeboost", "Reply Deboost"],
] as const

type CheckerContent = Pick<LocaleDictionary, "h1" | "subtitle" | "faqTitle" | "faqs"> &
  Partial<Pick<InstagramCopy, "inputLabel" | "buttonLabel" | "loadingLabel" | "resultTitle" | "hashtagInputLabel" | "hashtagPlaceholder" | "visibilityLabel" | "engagementLabel" | "scoreLabel" | "reasonsLabel" | "fixTitle" | "fixDescription" | "visibilityStates" | "engagementStates" | "reasonLabels" | "resultNote">> & {
    facebookSearchLink?: FacebookCopy["facebookSearchLink"]
    whyTitle?: FacebookCopy["whyTitle"]
    whyReasons?: FacebookCopy["whyReasons"]
    howTitle?: FacebookCopy["howTitle"]
    howSteps?: FacebookCopy["howSteps"]
    checkItems?: { label: string; description: string }[]
  }

type CheckerPlatform = "x" | "twitter" | "instagram" | "facebook" | "tiktok" | "youtube" | "reddit"

type CheckerResult = {
  username: string
  exists?: boolean
  tests: Record<string, { label: string; status: "clear" | "flagged" | "unknown"; detail: string }>
}

type FacebookEvidence = {
  profile: "unknown" | "public" | "unavailable"
  spam: "unknown" | "clear" | "flagged"
  groupPosting: "unknown" | "yes" | "no"
  recommendation: "unknown" | "recommendable" | "not-recommendable"
  distribution: "unknown" | "normal" | "reduced"
  comments: "unknown" | "visible" | "filtered"
  externalLink: string
}

type FacebookCheck = {
  id: string
  label: string
  status: "pass" | "warning" | "fail"
  message: string
  why: string
  how: string
}

type FacebookReport = {
  url: string
  checks: FacebookCheck[]
  lookupMessage: string
  externalLinks: string[]
}

type FacebookLookup = {
  status: "public" | "not-found" | "unavailable" | "unknown"
  externalLinks: string[]
  message: string
}

const facebookGuidanceIndexes = [
  { why: 0, how: 1 },
  { why: 3, how: 3 },
  { why: 2, how: 0 },
  { why: 1, how: 4 },
  { why: 4, how: 2 },
]

function isFacebookHost(hostname: string): boolean {
  const host = hostname.toLowerCase()
  return host === "facebook.com" || host.endsWith(".facebook.com") || host === "fb.watch"
}

function parseFacebookUrl(value: string): URL | null {
  try {
    const url = new URL(value)
    return isFacebookHost(url.hostname) ? url : null
  } catch {
    return null
  }
}

function facebookUrlContainsExternalLink(url: URL, suppliedLink: string): boolean {
  const candidate = suppliedLink.trim() || url.searchParams.get("u") || ""
  if (!candidate) return false
  try {
    return !isFacebookHost(new URL(candidate).hostname)
  } catch {
    return false
  }
}

function createFacebookChecks(
  evidence: FacebookEvidence,
  lookup: FacebookLookup,
  hasExternalLink: boolean,
  content: FacebookCopy,
): FacebookCheck[] {
  const profileUnavailable = lookup.status === "not-found" || (lookup.status === "unknown" && evidence.profile === "unavailable")
  const profilePublic = lookup.status === "public" || (lookup.status === "unknown" && evidence.profile === "public")
  const spamRisk = hasExternalLink && evidence.groupPosting === "yes"
  const definitions: Omit<FacebookCheck, "why" | "how">[] = [
    {
      id: "profile",
      label: lookup.status === "not-found" ? "Profile not found" : "Profile/Page exists and is public",
      status: lookup.status === "not-found" || (lookup.status === "unknown" && evidence.profile === "unavailable")
        ? "fail"
        : lookup.status === "public" || (lookup.status === "unknown" && evidence.profile === "public")
          ? "pass"
          : "warning",
      message: lookup.status === "not-found"
        ? "Facebook returned 404 for this URL."
        : lookup.status === "unavailable"
          ? lookup.message
          : profilePublic
            ? lookup.status === "public" ? lookup.message : "Marked public based on your logged-out check."
            : profileUnavailable
              ? "Marked unavailable or private based on your check."
              : lookup.message,
    },
    {
      id: "spam",
      label: evidence.spam === "flagged" || lookup.status === "unavailable" ? "In Facebook Spam Filter" : "Spam filter check",
      status: evidence.spam === "flagged" ? "fail" : evidence.spam === "clear" && !spamRisk && lookup.status !== "unavailable" ? "pass" : "warning",
      message: lookup.status === "unavailable"
        ? "Facebook returned “This content isn't available.” It may be in Spam, private, removed, or unavailable to logged-out visitors."
        : evidence.spam === "flagged"
        ? "Post reported in Facebook Spam."
        : spamRisk
          ? `Spam filter risk: an external link${lookup.externalLinks.length ? ` (${lookup.externalLinks.join(", ")})` : ""} plus repeated posting to many groups.`
          : evidence.spam === "clear"
          ? "No spam-folder warning reported."
          : hasExternalLink
            ? "An external destination was found. Repeatedly posting the same link to many groups can trigger spam controls."
            : "Spam-folder status is not public; check Support Inbox or Spam in Facebook.",
    },
    {
      id: "recommendation",
      label: evidence.recommendation === "not-recommendable" ? "Page Not Recommendable" : "Is Page Recommendable?",
      status: evidence.recommendation === "not-recommendable" ? "fail" : evidence.recommendation === "recommendable" ? "pass" : "warning",
      message: evidence.recommendation === "not-recommendable"
        ? "Not recommendable (reported in Page Quality)."
        : evidence.recommendation === "recommendable"
          ? "Recommendable (reported in Page Quality)."
          : "Page Quality is private; select the status shown in Facebook to report it here.",
    },
    {
      id: "distribution",
      label: evidence.distribution === "reduced" ? "Reduced Distribution" : "Reduced distribution",
      status: evidence.distribution === "reduced" ? "fail" : evidence.distribution === "normal" ? "pass" : "warning",
      message: evidence.distribution === "reduced"
        ? "Reduced distribution reported for engagement bait or misinformation."
        : evidence.distribution === "normal"
          ? "No reduced-distribution notice reported."
          : "A URL cannot reveal downranking or misinformation decisions; review Facebook's post/account notices.",
    },
    {
      id: "comments",
      label: evidence.comments === "filtered" ? "Comment Hidden" : "Comment visibility",
      status: evidence.comments === "filtered" ? "warning" : evidence.comments === "visible" ? "pass" : "warning",
      message: evidence.comments === "filtered"
        ? "Comment reported hidden under Most Relevant but visible under All comments."
        : evidence.comments === "visible"
          ? "Comment reported visible in both comment views."
          : "Comment ranking cannot be checked from a URL; compare Most Relevant with All comments.",
    },
  ]
  return definitions.map((check, index) => ({
    ...check,
    why: content.whyReasons[facebookGuidanceIndexes[index].why],
    how: content.howSteps[facebookGuidanceIndexes[index].how],
  }))
}

function FacebookResultRow({ check, isOpen, onToggle }: { check: FacebookCheck; isOpen: boolean; onToggle: () => void }) {
  const style = {
    pass: { icon: "✓", color: "text-emerald-700", background: "bg-emerald-100" },
    warning: { icon: "⚠", color: "text-amber-800", background: "bg-amber-100" },
    fail: { icon: "✕", color: "text-red-700", background: "bg-red-100" },
  }[check.status]
  return (
    <li className="border-b border-stone-200 py-4 last:border-0">
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className={`grid h-7 w-7 shrink-0 place-items-center rounded-full font-bold ${style.background} ${style.color}`}>
          {style.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-stone-900">{check.label}</h3>
          <p className={`mt-1 text-sm leading-6 ${style.color}`}>{check.message}</p>
          <button type="button" aria-expanded={isOpen} onClick={onToggle} className="mt-2 text-sm font-semibold text-stone-700 underline decoration-stone-400 underline-offset-2 hover:text-stone-900">
            ℹ Why and how to fix
          </button>
          {isOpen && (
            <div className="mt-2 grid gap-2 rounded-md bg-stone-50 p-3 text-sm leading-6 text-stone-700 sm:grid-cols-2">
              <p><strong>Why:</strong> {check.why}</p>
              <p><strong>How to fix:</strong> {check.how}</p>
            </div>
          )}
        </div>
      </div>
    </li>
  )
}

function localizeReason(reason: string, labels: InstagramCopy["reasonLabels"]): string {
  if (reason.startsWith("Uses banned/broken hashtags: ")) {
    return `${labels.banned}: ${reason.slice("Uses banned/broken hashtags: ".length)}`
  }
  if (reason.startsWith("Uses ")) {
    const count = reason.match(/\d+/)?.[0] ?? ""
    return labels.tooMany.replace("{count}", count)
  }
  if (reason === "Repeating same hashtags in this list") return labels.duplicate
  return labels.clean
}

export default function Home({
  content,
  locale,
  platform = "x",
  backgroundClassName = platform === "instagram" || platform === "facebook" ? "bg-platform-instagram" : "bg-platform-home",
  variant = "full",
}: {
  content?: CheckerContent
  locale?: string
  platform?: CheckerPlatform
  backgroundClassName?: string
  variant?: "full" | "checker"
} = {}) {
  const faqItems = content?.faqs ?? defaultFaqs
  const platformToHandle: Record<string, string> = {
    x: "gutnews247",
    twitter: "gutnews247",
    instagram: "aljannah.tv",
    tiktok: "hownwhen",
    facebook: "functionSmarterAI",
    youtube: "villainaudit",
    reddit: "gutnews247",
    threads: "gutnews247",
    th: "gutnews247",
    pt: "gutnews247",
  }
  const initialUsername = platformToHandle[platform] || ""
  const [username, setUsername] = useState(initialUsername)
  const [inputVal, setInputVal] = useState(initialUsername)
  const [hashtagInput, setHashtagInput] = useState("#quran #islam #faith #community #dailyreminder")
  const [result, setResult] = useState<CheckerResult | null>(null)
  const [facebookEvidence, setFacebookEvidence] = useState<FacebookEvidence>({
    profile: "unknown",
    spam: "unknown",
    groupPosting: "unknown",
    recommendation: "unknown",
    distribution: "unknown",
    comments: "unknown",
    externalLink: "",
  })
  const [facebookReport, setFacebookReport] = useState<FacebookReport | null>(null)
  const [facebookError, setFacebookError] = useState("")
  const [instagramResult, setInstagramResult] = useState<IGCheckResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkerError, setCheckerError] = useState("")
  const [shareMessage, setShareMessage] = useState("")
  const [showSupportPopup, setShowSupportPopup] = useState(false)
  const [openInfo, setOpenInfo] = useState<string | null>(null)

  const handleCheck = async () => {
    const clean = platform === "facebook" ? inputVal.trim() : inputVal.replace(/^@/, "").trim()
    if (!clean) {
      if (platform === "facebook") setFacebookError("Enter a Facebook profile, Page, or post URL.")
      return
    }
    const facebookUrl = platform === "facebook" ? parseFacebookUrl(clean) : null
    if (platform === "facebook" && !facebookUrl) {
      setFacebookError("Enter a full Facebook profile, Page, or post URL, such as https://www.facebook.com/yourpage")
      setFacebookReport(null)
      return
    }
    setFacebookError("")
    setCheckerError("")
    setUsername(clean)
    setLoading(true)
    setShowSupportPopup(true)
    setFacebookReport(null)
    if (platform === "instagram") {
      setInstagramResult(checkInstagram(clean, hashtagInput.split(/[\s,]+/).filter(Boolean)))
      setLoading(false)
      return
    }
    if (platform === "facebook" && facebookUrl) {
      let lookup: FacebookLookup = {
        status: "unknown",
        externalLinks: [],
        message: "The public Facebook page could not be checked; this is not evidence of a restriction.",
      }
      try {
        const response = await fetch("/api/facebook-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: facebookUrl.href }),
        })
        const data = await response.json() as Partial<FacebookLookup>
        if (!response.ok) throw new Error("Facebook URL check failed")
        if (["public", "not-found", "unavailable", "unknown"].includes(data.status ?? "")) {
          lookup = {
            status: data.status as FacebookLookup["status"],
            externalLinks: Array.isArray(data.externalLinks) ? data.externalLinks.filter((item): item is string => typeof item === "string") : [],
            message: typeof data.message === "string" ? data.message : lookup.message,
          }
        }
      } catch {}
      const hasExternalLink = facebookUrlContainsExternalLink(facebookUrl, facebookEvidence.externalLink) || lookup.externalLinks.length > 0
      setFacebookReport({
        url: facebookUrl.href,
        lookupMessage: lookup.message,
        externalLinks: lookup.externalLinks,
        checks: createFacebookChecks(facebookEvidence, lookup, hasExternalLink, content as FacebookCopy),
      })
      setLoading(false)
      return
    }
    try {
      const response = await fetch(`/api/check/twitter?username=${encodeURIComponent(clean)}`)
      const data = await response.json() as Partial<CheckerResult> & { error?: string }
      if (!response.ok || !data.tests) throw new Error(data.error || "The check could not be completed.")
      setResult({ username: data.username || clean, tests: data.tests })
    } catch (error) {
      setCheckerError(error instanceof Error ? error.message : "The check could not be completed. Please try again shortly.")
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    const shareText = `I checked @${username} with ShadowbannChecker. The public visibility checks are limited and cannot prove a shadowban: https://shadowbannchecker.vercel.app/`;
    if (navigator.share) {
      await navigator.share({ title: "X visibility check", text: shareText }).catch(() => undefined)
      return
    }
    await navigator.clipboard?.writeText(shareText)
    setShareMessage("Share text copied.")
  }

  if (variant === "checker") {
    return (
      <main className={`${sora.className} ${backgroundClassName} p-4 text-stone-900`}>
        <CheckerIsland />
        <AdBelowChecker />
        {platform === "instagram" && (
          <div className="mt-6 rounded-md border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">Instagram username <span className="text-red-600">*</span></label>
                <div className="flex items-center border-b border-stone-300 pb-2">
                  <span className="mr-2 text-xl font-bold text-violet-600">@</span>
                  <input value={inputVal} onChange={(e)=>setInputVal(e.target.value.replace(/^@/, ""))} placeholder="aljannah.tv" className="flex-1 bg-transparent outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Recent hashtags (optional)</label>
                <textarea value={hashtagInput} onChange={(e)=>setHashtagInput(e.target.value)} rows={2} placeholder="#quran #islam" className="w-full rounded-md border px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <button onClick={handleCheck} disabled={loading} className="rounded-full bg-violet-700 px-6 py-3 text-sm font-bold text-white">{loading?"Checking...":"Check Instagram Shadowban"}</button>
            </div>
            {instagramResult && <div className="mt-4 text-sm">Score {instagramResult.score}/100</div>}
          </div>
        )}
        {platform === "facebook" && (
          <div className="mt-6 rounded-md border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <label className="mb-2 block text-sm font-semibold">Facebook URL <span className="text-red-600">*</span></label>
            <input type="url" value={inputVal} onChange={(e)=>{setInputVal(e.target.value); setFacebookError(""); setFacebookReport(null);}} placeholder="https://www.facebook.com/yourpage" className="w-full rounded-md border px-3 py-2.5 text-sm" />
            <div className="mt-6 flex justify-center">
              <button onClick={handleCheck} disabled={loading} className="rounded-full bg-violet-700 px-6 py-3 text-sm font-bold text-white">{loading?"Checking...":"Check Facebook Shadowban"}</button>
            </div>
          </div>
        )}
        {platform === "tiktok" && <TikTokChecker />}
        {platform === "youtube" && <YouTubeChecker locale="en" />}
        {platform === "reddit" && <RedditChecker variant="checker" />}
        <SupportPopup isOpen={showSupportPopup} onClose={()=>setShowSupportPopup(false)} isChecking={loading} />
      </main>
    )
  }

  return (
    <main lang={locale} className={`${sora.className} min-h-screen ${backgroundClassName} pb-24 text-stone-900`}>
      <div className="max-w-[900px] mx-auto px-4 pt-8">
        <div className="text-center">
          {content && <BrandHomeLink />}
          <h1 className={`${fraunces.className} text- tracking-tight leading-[0.95] font-black italic`}>
            {content ? (
              <span className="text-stone-800">{content.h1}</span>
            ) : (
              <span className="text-stone-800">Free Social Media Shadowban Checker & Reach Recovery Tool</span>
            )}
          </h1>
          {!content && (
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-600">
              Wondering, &quot;Is my Twitter shadowbanned?&quot; X does not describe its visibility limits as shadowbans, but reach can still be restricted. This free checker tests public, logged-out signals for search suggestions, search, and profile visibility. No login is required.
            </p>
          )}
          {content && <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-600">{content.subtitle}</p>}
          
          {/* NEW $0 CHECKER - REPLACES OLD X CHECKER */}
          <div className="mt-8">
            <CheckerIsland />
            <AdBelowChecker />
          </div>
          
          <SupportUsButton />

          {/* OTHER PLATFORMS KEEP THEIR CHECKERS */}
          {platform === "instagram" && (
            <div className="mt-6 rounded-md border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">Instagram username <span className="text-red-600">*</span></label>
                  <div className="flex items-center border-b border-stone-300 pb-2">
                    <span className="mr-2 text-xl font-bold text-violet-600">@</span>
                    <input value={inputVal} onChange={(e)=>setInputVal(e.target.value.replace(/^@/, ""))} placeholder="aljannah.tv" className="flex-1 bg-transparent outline-none" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Recent hashtags (optional)</label>
                  <textarea value={hashtagInput} onChange={(e)=>setHashtagInput(e.target.value)} rows={2} placeholder="#quran #islam #faith" className="w-full rounded-md border px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <button onClick={handleCheck} disabled={loading} className="rounded-full bg-violet-700 px-6 py-3 text-sm font-bold text-white hover:bg-violet-800">{loading?"Checking...":"Check Instagram Shadowban"}</button>
              </div>
            </div>
          )}
          {platform === "facebook" && (
            <div className="mt-6 rounded-md border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
              <label className="mb-2 block text-sm font-semibold">Facebook URL <span className="text-red-600">*</span></label>
              <input type="url" value={inputVal} onChange={(e)=>{setInputVal(e.target.value); setFacebookError(""); setFacebookReport(null);}} placeholder="https://www.facebook.com/yourpage" className="w-full rounded-md border px-3 py-2.5 text-sm" />
              <div className="mt-6 flex justify-center">
                <button onClick={handleCheck} disabled={loading} className="rounded-full bg-violet-700 px-6 py-3 text-sm font-bold text-white hover:bg-violet-800">{loading?"Checking...":"Check Facebook Shadowban"}</button>
              </div>
            </div>
          )}
          {platform === "tiktok" && <div className="mt-6"><TikTokChecker /></div>}
          {platform === "reddit" && <div className="mt-6"><RedditChecker variant="checker" /></div>}
          {platform === "youtube" && <div className="mt-6"><YouTubeChecker locale="en" /></div>}

          <div className="mx-auto mt-16 max-w-3xl space-y-10 text-left">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">What we actually check: visibility filtering, not a myth</h2>
              <p className="mt-3 text-stone-600">
                Platforms deny "shadowban". We measure public signals Google associates with it: 
                <strong> search ban, ghostban, hashtag suppression, non-follower reach split, downranking, and API rate limits.</strong> 
                No login, public data only.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Why your reach dropped in 2026</h2>
              <p className="mt-3 text-stone-600">
                Instagram 2026 average: 2.2% engagement, Reels suppressed below 1.1% non-follower reach. 
                TikTok 2026: 6%+ For You reach for accounts under 10k. 
                X/Twitter: reply deboost & ghostban. YouTube: comment suppression & Shorts shelf removal.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">3 fixes before you re-check</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-stone-600">
                <li>Remove 3rd-party auto-DM / mass-unfollow apps and check Account Status</li>
                <li>Delete last 2 hashtags or sounds that triggered spam filter, wait 48h</li>
                <li>Post 1 original post without hashtags/links to reset non-follower split, then test again</li>
              </ol>
            </div>
          </div>
          {platform === "facebook" && <CryptoDonationButtons />}
        </div>

        {platform === "facebook" && content ? (
          <>
            {locale === "en" && (
              <section className="mx-auto mt-9 max-w-3xl border-y border-stone-300 py-6 text-sm leading-7 text-stone-700">
                <h2 className={`${fraunces.className} mb-4 text-2xl font-bold text-stone-900`}>
                  How To Tell If You&apos;re &quot;Shadow Banned&quot; On Facebook
                </h2>
                <p>People often search for a facebook shadowban when a profile, Page, or post suddenly reaches fewer people. Facebook does not use "shadowban" as a public account status.</p>
              </section>
            )}
          <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <label htmlFor="facebook-url" className="mb-2 block text-sm font-semibold text-stone-700">Facebook profile, Page, or post URL</label>
            <input id="facebook-url" type="url" required value={inputVal} onChange={(event) => {setInputVal(event.target.value); setFacebookError(""); setFacebookReport(null);}} onKeyDown={(event) => event.key === "Enter" && handleCheck()} placeholder="https://www.facebook.com/yourpage" className="w-full rounded-md border border-stone-300 px-3 py-3 text-sm" />
            {facebookError && <p role="alert" className="mt-3 text-sm text-red-700">{facebookError}</p>}
            <div className="mt-6 flex justify-center">
              <button type="button" onClick={handleCheck} disabled={loading} className="rounded-full border border-stone-300 px-7 py-2.5 text-[13px] font-semibold text-stone-900">
                {loading ? content.loadingLabel : content.buttonLabel}
              </button>
            </div>
          </div>
          </>
        ) : platform === "instagram" && content ? (
          <>
          <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[11px] text-stone-500">Instagram username</label>
                <div className="flex items-end border-b border-stone-300 pb-1">
                  <span className="mr-2 text-[26px] font-bold text-violet-600">@</span>
                  <input id="instagram-username" value={inputVal} onChange={(event) => setInputVal(event.target.value.replace(/^@/, ""))} onKeyDown={(event) => event.key === "Enter" && handleCheck()} className="min-w-0 flex-1 bg-transparent text-[17px] text-violet-600 outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[11px] text-stone-500">Paste your last 5 hashtags</label>
                <textarea id="instagram-hashtags" value={hashtagInput} onChange={(event) => setHashtagInput(event.target.value)} placeholder={content.hashtagPlaceholder} rows={3} className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <button onClick={handleCheck} disabled={loading} className="rounded-full border border-stone-300 px-7 py-2.5 text-[13px] text-stone-900">
                {loading ? content.loadingLabel ?? "CHECKING..." : content.buttonLabel ?? "CHECK NOW"}
              </button>
            </div>
          </div>
          </>
        ) : null}

        {result && platform !== "instagram" && platform !== "facebook" && (
          <section aria-live="polite" className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <div className={`mb-4 p-4 rounded-xl border flex items-center gap-3 ${Object.values(result.tests).every((t:any)=>t.status==="clear") ? "bg-emerald-50 border-emerald-200 text-emerald-800" : Object.values(result.tests).some((t:any)=>t.status==="flagged") ? "bg-red-50 border-red-200 text-red-800" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
              <span className={`w-3 h-3 rounded-full ${Object.values(result.tests).every((t:any)=>t.status==="clear") ? "bg-emerald-500" : Object.values(result.tests).some((t:any)=>t.status==="flagged") ? "bg-red-500" : "bg-amber-400"}`}></span>
              <span className="text-sm font-bold">{Object.values(result.tests).every((t:any)=>t.status==="clear") ? "🟢 Clean — Search, Suggestion, Profile reachable (logged-out)" : Object.values(result.tests).some((t:any)=>t.status==="flagged") ? "🔴 Ban detected — some signals missing" : "🟡 Unknown — rate-limited or inconclusive"}</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900">Visibility signals for @{result.username}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {xTestKeys.map(([key, fallbackLabel]) => {
                const test = result.tests[key]
                const status = test?.status ?? "unknown"
                const style = status === "clear" ? { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", dot: "bg-emerald-500" } : status === "flagged" ? { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", dot: "bg-red-500" } : { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", dot: "bg-amber-400" }
                const statusLabel = status === "clear"? "CLEAR" : status === "flagged"? "FLAGGED" : "UNKNOWN"
                return (
                  <article key={key} className={`rounded-xl border p-4 ${style.bg} ${style.border} text-center hover:shadow-sm transition`}>
                    <div className="flex items-center justify-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`}></span>
                      <h3 className={`text-sm font-bold ${style.text}`}>{test?.label ?? fallbackLabel}</h3>
                    </div>
                    <div className="mt-2 text-xl">{status === "clear" ? "✅" : status === "flagged" ? "❌" : "❓"}</div>
                    <div className={`mt-2 inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${style.border} ${style.text} ${style.bg}`}>{statusLabel}</div>
                    <p className={`mt-2 text-[11px] leading-tight ${style.text} opacity-80`}>{test?.detail ?? "No reliable public result was returned."}</p>
                  </article>
                )
              })}
            </div>
          </section>
        )}

        <CryptoDonationButtons />

        <section id="how-it-works" className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <h2 className="border-b border-stone-200 px-6 py-4 text-lg font-bold text-stone-900">
            {content?.faqTitle ?? "Frequently asked questions"}
          </h2>
          <div className="divide-y divide-stone-200 px-6">
            {faqItems.map((faq) => (
              <article key={faq.question} className="py-4">
                <h3 className="text-sm font-semibold text-stone-900">{faq.question}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-stone-600">{faq.answer}</p>
              </article>
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
      <AlertButton handle={inputVal} platform={platform} />
      <SupportPopup isOpen={showSupportPopup} onClose={() => setShowSupportPopup(false)} isChecking={loading} />
    </main>
  )
}
