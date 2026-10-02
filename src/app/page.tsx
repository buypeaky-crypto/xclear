"use client"
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
    question: "Twitter reserves the right to limit distribution or visibility of content",
    answer: "X says they don't shadowban, but they do limit visibility for policy violations. This tool detects technical bans, not algorithmic downranking.",
  },
  {
    question: "Why is the QFD test gone?",
    answer: "QFD (Quality Filter Discrimination) was removed by X in 2023. The endpoint no longer exists, so we removed it from the checker.",
  },
  {
    question: "How does this tester work?",
    answer: "We use logged-out Twitter endpoints to check: profile existence, typeahead suggestions, tweet search visibility, tweet visibility to others, and reply deboosting.",
  },
]

type CheckerContent = Pick<LocaleDictionary, "h1" | "subtitle" | "faqTitle" | "faqs"> &
  Partial<Pick<InstagramCopy, "inputLabel" | "buttonLabel" | "loadingLabel" | "resultTitle" | "hashtagInputLabel" | "hashtagPlaceholder" | "visibilityLabel" | "engagementLabel" | "scoreLabel" | "reasonsLabel" | "fixTitle" | "fixDescription" | "visibilityStates" | "engagementStates" | "reasonLabels" | "resultNote">> & {
    facebookSearchLink?: FacebookCopy["facebookSearchLink"]
    whyTitle?: FacebookCopy["whyTitle"]
    whyReasons?: FacebookCopy["whyReasons"]
    howTitle?: FacebookCopy["howTitle"]
    howSteps?: FacebookCopy["howSteps"]
    checkItems?: { label: string; description: string }[]
  }

type CheckerPlatform = "x" | "instagram" | "facebook"

type CheckerResult = {
  username: string
  exists?: boolean
  searchSuggestionBan?: boolean
  searchBan?: boolean
  ghostBan?: boolean
  replyDeboosting?: boolean
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
          ? `Spam filter risk: an external link${lookup.externalLinks.length ? ` (${lookup.externalLinks.join(", ")})` : ""} plus repeated posting to many groups. This pattern can trigger spam controls; it does not prove a shadowban.`
          : evidence.spam === "clear"
          ? "No spam-folder warning reported."
          : hasExternalLink
            ? "An external destination was found. Repeatedly posting the same link to many groups can trigger spam controls; check Support Inbox or Spam."
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
          <button
            type="button"
            aria-expanded={isOpen}
            onClick={onToggle}
            className="mt-2 text-sm font-semibold text-stone-700 underline decoration-stone-400 underline-offset-2 hover:text-stone-900"
          >
            ℹ️ Why and how to fix
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

function InfoRow({
  id,
  label,
  desc,
  isBan,
  openInfo,
  setOpenInfo,
}: {
  id: string
  label: string
  desc: string
  isBan: boolean
  openInfo: string | null
  setOpenInfo: (id: string | null) => void
}) {
  return (
    <div className="border-b last:border-0 border-stone-200">
      <div className="flex items-center justify-between p-4 px-6 cursor-pointer transition-colors hover:bg-amber-50/60" onClick={() => setOpenInfo(openInfo === id ? null : id)}>
        <div className="flex items-center gap-3">
          <span className={`text-xl ${isBan ? "text-red-500" : "text-emerald-600"}`}>{isBan ? "✕" : "✓"}</span>
          <span className={`text-[15px] ${isBan ? "text-red-600" : "text-emerald-700"}`}>{label}</span>
        </div>
        <span className={`text-[11px] transition-transform ${openInfo === id ? "rotate-180" : ""}`}>ℹ️ ▾</span>
      </div>
      {openInfo === id && <div className="px-6 pb-4 text-[13px] text-stone-600 bg-amber-50/60 leading-relaxed">{desc}</div>}
    </div>
  )
}

export default function Home({
  content,
  locale,
  platform = "x",
  backgroundClassName = platform === "instagram" || platform === "facebook" ? "bg-platform-instagram" : "bg-platform-home",
}: {
  content?: CheckerContent
  locale?: string
  platform?: CheckerPlatform
  backgroundClassName?: string
} = {}) {
  const faqItems = content?.faqs ?? defaultFaqs
  const initialUsername = platform === "instagram" ? "quran" : platform === "facebook" ? "" : "GutNews247"
  const [username, setUsername] = useState(initialUsername)
  const [inputVal, setInputVal] = useState(initialUsername)
  const [hashtagInput, setHashtagInput] = useState("#quran #islam #faith #community #dailyreminder")
  const [result, setResult] = useState<CheckerResult | null>(() => platform === "instagram" || platform === "facebook" ? null : {
    username: initialUsername,
    exists: true,
    searchSuggestionBan: false,
    searchBan: false,
    ghostBan: false,
    replyDeboosting: false,
  })
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
      } catch {
      }
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
      const res = await fetch(`/api/check?username=${encodeURIComponent(clean)}`)
      const data = await res.json()
      setResult({
        username: data.username || clean,
        exists: true,
        searchSuggestionBan: data.searchSuggestionBan || false,
        searchBan: data.searchBan || false,
        ghostBan: data.ghostBan || false,
        replyDeboosting: data.replyDeboosting || false,
      })
    } catch {
      setResult({ username: clean, exists: true, searchSuggestionBan: false, searchBan: false, ghostBan: false, replyDeboosting: false })
    }
    setLoading(false)
  }

  return (
    <main lang={locale} className={`${sora.className} min-h-screen ${backgroundClassName} pb-24 text-stone-900`}>
      <div className="max-w-[900px] mx-auto px-4 pt-8">
        <div className="text-center">
          {content && <BrandHomeLink />}
          <h1 className={`${fraunces.className} text-[46px] tracking-tight leading-[0.95] font-black italic`}>
            {content ? (
              <span className="text-stone-800">{content.h1}</span>
            ) : (
              <span className="text-stone-800">Twitter Shadowban Test 2026</span>
            )}
          </h1>
          {!content && (
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-600">
              Use this free Twitter shadowban test and Twitter shadowban checker to check whether your account may have search bans, ghost bans, or reply deboosting. Wondering &quot;is my Twitter shadowbanned?&quot; Check a public username instantly, without logging in.
            </p>
          )}
          {content && <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-600">{content.subtitle}</p>}
          <PlatformSwitcher activePlatform={platform} />
          <SupportUsButton />
          {platform === "facebook" && <CryptoDonationButtons />}
        </div>

        {platform === "facebook" && content ? (
          <>
            {locale === "en" && (
              <section className="mx-auto mt-9 max-w-3xl border-y border-stone-300 py-6 text-sm leading-7 text-stone-700">
                <h2 className={`${fraunces.className} mb-4 text-2xl font-bold text-stone-900`}>
                  How To Tell If You&apos;re &quot;Shadow Banned&quot; On Facebook 🙅 (And How To Fix It)
                </h2>
                <div className="space-y-4">
                  <p>
                    People often search for a facebook shadowban when a profile, Page, or post suddenly reaches fewer people. Facebook does not use “shadowban” as a public account status. Instead, its tools may show that content is “Not recommendable,” placed in a Spam filter, or subject to Reduced distribution. Those notices describe different systems, and a decline alone does not prove that a restriction exists.
                  </p>
                  <p>
                    If you are wondering whether you have been facebook shadow banned, start with evidence you can compare: open the profile and recent posts in a logged-out browser, check whether another person can find the Page, and review Facebook Account Status, Page Quality, Support Inbox, and post notices while signed in. A page not recommendable notice concerns recommendations; it is not the same as a profile being unavailable in search. Facebook spam filter placement can affect a post without blocking every part of an account. Reduced distribution notices may apply to individual content and can have a policy explanation.
                  </p>
                  <p>
                    This checker provides a public visibility review of the Facebook URL you submit, along with a place to record signals you verify in Facebook. It does not access private analytics, inspect internal ranking decisions, or log in on your behalf. That means a result cannot confirm an official shadowban, estimate your reach, or prove why your facebook reach dropping. Use it as a structured checklist, then rely on notices in Facebook for account-specific decisions. Never enter a password or private access token here.
                  </p>
                  <p>
                    If visibility has changed, compare several posts over similar time periods before drawing conclusions. Review recent edits, repeated links, posting frequency, audience changes, and recommendation eligibility; avoid reposting identical links to many groups. Open each notice for the affected content and follow Facebook&apos;s steps to request a review if you believe it is mistaken. Remove or revise material that violates current standards, and give changes time to take effect. A careful check separates public reach patterns from private policy decisions, so you can choose a useful next step instead of treating every drop as proof of a facebook shadowban.
                  </p>
                </div>
              </section>
            )}
          <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <label htmlFor="facebook-url" className="mb-2 block text-sm font-semibold text-stone-700">Facebook profile, Page, or post URL</label>
            <input
              id="facebook-url"
              type="url"
              required
              value={inputVal}
              onChange={(event) => {
                setInputVal(event.target.value)
                setFacebookError("")
                setFacebookReport(null)
              }}
              onKeyDown={(event) => event.key === "Enter" && handleCheck()}
              placeholder="https://www.facebook.com/yourpage"
              className="w-full rounded-md border border-stone-300 px-3 py-3 text-sm text-stone-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
            />
            <details className="mt-5 rounded-md border border-stone-200 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-stone-800">Report signals visible in Facebook</summary>
              <p className="mt-2 text-xs leading-5 text-stone-600">Page Quality, spam status, distribution notices, and comment filtering are not public URL data. Select only what you can confirm in Facebook; unverified signals stay marked as not checked.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-stone-700">
                  Profile/Page visibility
                  <select value={facebookEvidence.profile} onChange={(event) => setFacebookEvidence((current) => ({ ...current, profile: event.target.value as FacebookEvidence["profile"] }))} className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm">
                    <option value="unknown">Not checked</option>
                    <option value="public">Opens while logged out</option>
                    <option value="unavailable">Private, unavailable, or removed</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-stone-700">
                  Spam folder status
                  <select value={facebookEvidence.spam} onChange={(event) => setFacebookEvidence((current) => ({ ...current, spam: event.target.value as FacebookEvidence["spam"] }))} className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm">
                    <option value="unknown">Not checked</option>
                    <option value="clear">Not in Spam</option>
                    <option value="flagged">In Spam</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-stone-700">
                  Repeated posting to many groups
                  <select value={facebookEvidence.groupPosting} onChange={(event) => setFacebookEvidence((current) => ({ ...current, groupPosting: event.target.value as FacebookEvidence["groupPosting"] }))} className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm">
                    <option value="unknown">Not sure</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-stone-700">
                  Page Quality recommendation
                  <select value={facebookEvidence.recommendation} onChange={(event) => setFacebookEvidence((current) => ({ ...current, recommendation: event.target.value as FacebookEvidence["recommendation"] }))} className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm">
                    <option value="unknown">Not checked</option>
                    <option value="recommendable">Recommendable</option>
                    <option value="not-recommendable">Not recommendable</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-stone-700">
                  Distribution notice
                  <select value={facebookEvidence.distribution} onChange={(event) => setFacebookEvidence((current) => ({ ...current, distribution: event.target.value as FacebookEvidence["distribution"] }))} className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm">
                    <option value="unknown">Not checked</option>
                    <option value="normal">No reduced-distribution notice</option>
                    <option value="reduced">Reduced distribution shown</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-stone-700">
                  Comment visibility
                  <select value={facebookEvidence.comments} onChange={(event) => setFacebookEvidence((current) => ({ ...current, comments: event.target.value as FacebookEvidence["comments"] }))} className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm">
                    <option value="unknown">Not checked</option>
                    <option value="visible">Visible in both views</option>
                    <option value="filtered">Hidden under Most Relevant, visible under All comments</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-stone-700 sm:col-span-2">
                  External link included in the post (optional)
                  <input
                    type="url"
                    value={facebookEvidence.externalLink}
                    onChange={(event) => setFacebookEvidence((current) => ({ ...current, externalLink: event.target.value }))}
                    placeholder="https://example.com/article"
                    className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                  />
                </label>
              </div>
            </details>
            {facebookError && <p role="alert" className="mt-3 text-sm text-red-700">{facebookError}</p>}
            <div className="mt-6 flex justify-center">
              <button type="button" onClick={handleCheck} disabled={loading} className="rounded-full border border-stone-300 px-7 py-2.5 text-[13px] font-semibold text-stone-900 transition-colors hover:bg-stone-50 disabled:opacity-50">
                {loading ? content.loadingLabel : content.buttonLabel}
              </button>
            </div>
          </div>
          </>
        ) : platform === "instagram" && content ? (
          <>
            {locale === "en" && (
              <section className="mx-auto mt-9 max-w-3xl border-y border-stone-300 py-6 text-sm leading-7 text-stone-700">
                <h2 className={`${fraunces.className} mb-4 text-2xl font-bold text-stone-900`}>
                  Instagram Reach, Hashtags, and Recommendation Eligibility
                </h2>
                <div className="space-y-4">
                  <p>
                    An Instagram shadowban is an informal name for a possible reduction in how often posts appear in hashtag results, Explore, Reels recommendations, or other discovery surfaces. Instagram does not provide one universal shadowban switch or public status, so a sudden change in views is not enough to diagnose a restriction. Audience habits, content topics, posting cadence, competition, and ranking changes can all affect reach.
                  </p>
                  <p>
                    This Instagram shadowban checker reviews the username and the recent hashtags you provide for limited public risk signals. It is a heuristic, not an account connection: it does not sign in, inspect private analytics, or query Instagram&apos;s internal recommendation systems. A clean result cannot guarantee that every post is eligible for recommendations, and a warning does not prove that Instagram has restricted your account. Treat the score as a prompt to investigate rather than a platform decision.
                  </p>
                  <p>
                    For a fuller check, compare several posts with similar formats and audiences, then look at Account Status and recommendation eligibility in Instagram&apos;s own app. Search each recent hashtag while logged out and see whether your post appears; remember that ranking and personalization can change what different viewers see. Review notices for specific posts, remove tags that are irrelevant or restricted, and avoid repetitive engagement tactics. If Instagram identifies a policy issue, use its review process. These checks help separate ordinary performance variation from a discoverability concern without claiming access to information only Instagram can confirm.
                  </p>
                  <p>
                    Keep a simple record of post dates, formats, hashtags, and reach so you can compare like with like instead of relying on one unusually strong or weak result. Check whether a notice names a particular post or recommendation surface, and make one measured change at a time. This gives you clearer context when discussing an Instagram reach drop and avoids treating a third-party score as proof of a hidden restriction.
                  </p>
                </div>
              </section>
            )}
          <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[11px] text-stone-500" htmlFor="instagram-username">{content.inputLabel ?? "Instagram username"}</label>
                <div className="flex items-end border-b border-stone-300 pb-1">
                  <span className="mr-2 text-[26px] font-bold text-violet-600">@</span>
                  <input
                    id="instagram-username"
                    value={inputVal}
                    onChange={(event) => setInputVal(event.target.value.replace(/^@/, ""))}
                    onKeyDown={(event) => event.key === "Enter" && handleCheck()}
                    className="min-w-0 flex-1 bg-transparent text-[17px] text-violet-600 outline-none"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[11px] text-stone-500" htmlFor="instagram-hashtags">{content.hashtagInputLabel ?? "Paste your last 5 hashtags"}</label>
                <textarea
                  id="instagram-hashtags"
                  value={hashtagInput}
                  onChange={(event) => setHashtagInput(event.target.value)}
                  placeholder={content.hashtagPlaceholder}
                  rows={3}
                  className="w-full resize-y rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <button onClick={handleCheck} disabled={loading} className="rounded-full border border-stone-300 px-7 py-2.5 text-[13px] text-stone-900 transition-colors hover:bg-stone-50 disabled:opacity-50">
                {loading ? content.loadingLabel ?? "CHECKING..." : content.buttonLabel ?? "CHECK NOW"}
              </button>
            </div>
          </div>
          </>
        ) : (
          <div className="bg-white border border-stone-200 shadow-sm mt-10 p-8 flex flex-col sm:flex-row items-center justify-center gap-6 rounded-2xl">
            <div className="flex flex-col">
              <label className="text-[11px] text-stone-500 mb-1">{content?.inputLabel ?? "username"}</label>
              <div className="flex items-end border-b border-stone-300 pb-1 w-[280px]">
                <span className="text-violet-600 text-[26px] font-bold mr-2">@</span>
                <input value={inputVal} onChange={(e) => setInputVal(e.target.value.replace(/^@/, ""))} onKeyDown={(e) => e.key === "Enter" && handleCheck()} className="flex-1 outline-none text-[17px] text-violet-600 bg-transparent" />
              </div>
            </div>
            <button onClick={handleCheck} disabled={loading} className="border border-stone-300 text-stone-900 rounded-full px-7 py-2 text-[13px] transition-colors hover:bg-stone-50 disabled:opacity-50">{loading ? content?.loadingLabel ?? "CHECKING..." : content?.buttonLabel ?? "CHECK"}</button>
          </div>
        )}

        {platform === "instagram" && content && instagramResult && (
          <section aria-live="polite" className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col items-center gap-6 border-b border-stone-200 pb-6 sm:flex-row">
              <div
                aria-label={`${content.scoreLabel ?? "Score"}: ${instagramResult.score} / 100`}
                className={`grid aspect-square w-24 shrink-0 place-items-center rounded-full border-[6px] ${instagramResult.score >= 80 ? "border-emerald-500 text-emerald-700" : instagramResult.score >= 60 ? "border-amber-400 text-amber-700" : "border-red-500 text-red-700"}`}
              >
                <div className="text-center"><span className="block text-3xl font-black">{instagramResult.score}</span><span className="text-[10px] font-semibold uppercase">/ 100</span></div>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-stone-900">{content.resultTitle?.replace("{username}", username) ?? `Results for @${username}`}</h2>
                <p className="mt-1 text-sm text-stone-500">{content.scoreLabel ?? "Score"}: {instagramResult.score} / 100</p>
              </div>
            </div>
            <div className="grid gap-4 py-6 sm:grid-cols-2">
              <div className="flex items-center justify-between gap-4 rounded-lg border border-stone-200 p-4">
                <span className="text-sm font-semibold text-stone-700">{content.visibilityLabel ?? "Hashtag Visibility"}</span>
                <span className={`rounded-full px-3 py-1 text-sm font-bold ${instagramResult.hashtagVisibility === "ok" ? "bg-emerald-100 text-emerald-800" : instagramResult.hashtagVisibility === "limited" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>
                  {content.visibilityStates?.[instagramResult.hashtagVisibility] ?? instagramResult.hashtagVisibility}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-lg border border-stone-200 p-4">
                <span className="text-sm font-semibold text-stone-700">{content.engagementLabel ?? "Engagement"}</span>
                <span className={`rounded-full px-3 py-1 text-sm font-bold ${instagramResult.engagement === "ok" ? "bg-emerald-100 text-emerald-800" : instagramResult.engagement === "drop" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>
                  {content.engagementStates?.[instagramResult.engagement] ?? instagramResult.engagement}
                </span>
              </div>
            </div>
            <div className="border-t border-stone-200 pt-5">
              <h3 className="mb-3 text-sm font-bold uppercase text-stone-800">{content.reasonsLabel ?? "Reasons"}</h3>
              <ul className="space-y-2 text-sm leading-6 text-stone-700">
                {instagramResult.reasons.map((reason) => (
                  <li key={reason} className="flex gap-2">
                    <span className={instagramResult.score >= 80 ? "text-emerald-600" : instagramResult.score >= 60 ? "text-amber-600" : "text-red-600"}>✓</span>
                    <span>{content.reasonLabels ? localizeReason(reason, content.reasonLabels) : reason}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 rounded-lg bg-amber-50 p-4">
              <h3 className="font-bold text-stone-900">{content.fixTitle ?? "How to fix"}</h3>
              <p className="mt-1 text-sm leading-6 text-stone-700">{content.fixDescription ?? "Remove banned hashtags, use 5-10 relevant hashtags, wait 48h"}</p>
            </div>
            {content.resultNote && <p className="mt-5 text-sm leading-6 text-stone-600">{content.resultNote}</p>}
          </section>
        )}

        {platform === "facebook" && facebookReport && content && (
          <section aria-live="polite" className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-stone-900">Facebook visibility results</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">{content.resultNote}</p>
            <p className="mt-2 text-xs leading-5 text-stone-500">{facebookReport.lookupMessage}</p>
            <a
              className="mt-3 inline-block break-all text-sm font-semibold text-violet-700 underline underline-offset-2"
              href={facebookReport.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {facebookReport.url}
            </a>
            <ul className="mt-4 divide-y divide-stone-200">
              {facebookReport.checks.map((check) => (
                <FacebookResultRow
                  key={check.id}
                  check={check}
                  isOpen={openInfo === `facebook-${check.id}`}
                  onToggle={() => setOpenInfo(openInfo === `facebook-${check.id}` ? null : `facebook-${check.id}`)}
                />
              ))}
            </ul>
          </section>
        )}

        {result && platform !== "instagram" && platform !== "facebook" && (
          <div className="bg-white border border-stone-200 shadow-sm mt-6 overflow-hidden rounded-2xl">
            <div className="flex items-center gap-3 p-4 px-6 border-b border-stone-200"><span className="text-emerald-600 text-xl">✓</span><span className="text-[15px]"><span className="text-violet-600">@{result.username}</span> <span className="text-emerald-700">exists.</span></span></div>
            <InfoRow id="sugg" label={result.searchSuggestionBan ? "Search suggestion ban." : "No search suggestion ban."} isBan={Boolean(result.searchSuggestionBan)} desc="Typeahead test: When you type @username in Twitter search, does it auto-suggest? If not, you have a search suggestion ban. Profile hidden from typeahead." openInfo={openInfo} setOpenInfo={setOpenInfo} />
            <InfoRow id="search" label={result.searchBan ? "Search ban." : "No search ban."} isBan={Boolean(result.searchBan)} desc="Search ban: Your tweets don't appear in search results for logged-out users. Searching from:@username shows nothing." openInfo={openInfo} setOpenInfo={setOpenInfo} />
            <InfoRow id="ghost" label={result.ghostBan ? "Ghost ban." : "No ghost ban."} isBan={Boolean(result.ghostBan)} desc="Ghost ban: Your tweets are visible only to you, invisible to everyone else. The classic shadowban." openInfo={openInfo} setOpenInfo={setOpenInfo} />
            <InfoRow id="reply" label={result.replyDeboosting ? "Reply deboosting detected." : "No reply deboosting detected."} isBan={Boolean(result.replyDeboosting)} desc="Reply deboosting: Your replies are collapsed under 'Show more replies' so almost nobody sees them." openInfo={openInfo} setOpenInfo={setOpenInfo} />
          </div>
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

        {!content && (
          <footer className="mt-12 border-t border-stone-300 pt-8">
            <h2 className="text-center text-lg font-bold text-stone-900">Other Checkers — Also available in:</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <h3 className="text-sm font-bold text-stone-800">Facebook</h3>
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  {facebookLocales.map((language) => (
                    <li key={language}>
                      <Link className="text-violet-700 underline underline-offset-2" href={new URL(getFacebookUrl(language)).pathname}>
                        {localeNames[language]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-800">Instagram</h3>
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  {instagramLocales.map((language) => (
                    <li key={language}>
                      <Link className="text-violet-700 underline underline-offset-2" href={new URL(getInstagramUrl(language)).pathname}>
                        {localeNames[language]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-800">TikTok</h3>
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  {tiktokLocales.map((language) => (
                    <li key={language}>
                      <Link className="text-violet-700 underline underline-offset-2" href={new URL(getTikTokUrl(language)).pathname}>
                        {localeNames[language]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-800">Reddit</h3>
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  <li><Link className="text-violet-700 underline underline-offset-2" href="/reddit">English</Link></li>
                </ul>
              </div>
            </div>
          </footer>
        )}
        <div className="text-center text-[12px] text-stone-500 mt-10">Made in Germany by <a href="https://x.com/shadowban_eu" target="_blank" className="text-violet-600">@shadowban_eu</a>, rebuilt by <a href="https://x.com/gutnews247" target="_blank" className="text-violet-600">@gutnews247</a></div>
      </div>

      {!content && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "Twitter Shadowban Test 2026",
                applicationCategory: "Utility",
                operatingSystem: "Web, Android, iOS",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: "4.8",
                  ratingCount: "124",
                },
              }).replace(/</g, "\\u003c"),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: defaultFaqs.map(({ question, answer }) => ({
                  "@type": "Question",
                  name: question,
                  acceptedAnswer: { "@type": "Answer", text: answer },
                })),
              }).replace(/</g, "\\u003c"),
            }}
          />
        </>
      )}
      <SupportPopup
        isOpen={showSupportPopup}
        onClose={() => setShowSupportPopup(false)}
        isChecking={loading}
      />
    </main>
  )
}
