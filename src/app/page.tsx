"use client"
import { useState } from "react"
import Link from "next/link"
import { Fraunces, Sora } from "next/font/google"
import type { LocaleDictionary } from "../lib/i18n/dictionaries"
import { baseUrl } from "../lib/i18n/config"
import type { InstagramCopy } from "../lib/i18n/instagram"
import { checkInstagram, type IGCheckResult } from "../lib/instagram/checker"
import DonationButtons from "../components/DonationButtons"
import SupportUsButton from "../components/SupportUsButton"

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
    checkItems?: { label: string; description: string }[]
  }

type CheckerPlatform = "x" | "instagram"

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
}: {
  content?: CheckerContent
  locale?: string
  platform?: CheckerPlatform
} = {}) {
  const faqItems = content?.faqs ?? defaultFaqs
  const initialUsername = platform === "instagram" ? "quran" : "GutNews247"
  const [username, setUsername] = useState(initialUsername)
  const [inputVal, setInputVal] = useState(initialUsername)
  const [hashtagInput, setHashtagInput] = useState("#quran #islam #faith #community #dailyreminder")
  const [result, setResult] = useState<any>(platform === "instagram" ? null : {
    username: initialUsername,
    exists: true,
    searchSuggestionBan: false,
    searchBan: false,
    ghostBan: false,
    replyDeboosting: false,
  })
  const [instagramResult, setInstagramResult] = useState<IGCheckResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [openInfo, setOpenInfo] = useState<string | null>(null)

  const handleCheck = async () => {
    const clean = inputVal.replace(/^@/, "").trim()
    if (!clean) return
    setUsername(clean)
    setLoading(true)
    if (platform === "instagram") {
      setInstagramResult(checkInstagram(clean, hashtagInput.split(/[\s,]+/).filter(Boolean)))
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

  const InfoRow = ({ id, label, desc, isBan }: { id: string; label: string; desc: string; isBan: boolean }) => (
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

  return (
    <main lang={locale} className={`${sora.className} min-h-screen bg-[#FFFBEB] pb-24 text-stone-900`}>
      <div className="max-w-[900px] mx-auto px-4 pt-8">
        <div className="text-center">
          <h1 className={`${fraunces.className} text-[46px] tracking-tight leading-[0.95] font-black italic`}>
            {content ? (
              <span className="text-stone-800">{content.h1}</span>
            ) : (
              <>
                <span className="text-stone-800">Is </span>
                <span className="text-violet-600">@{username}</span>
                <br />
                <span className="text-stone-800">shadowbanned on Twitter?</span>
              </>
            )}
          </h1>
          {content && <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-600">{content.subtitle}</p>}
          <nav aria-label="Choose checker" className="mt-7 inline-flex flex-wrap justify-center gap-1 rounded-full border border-stone-300 bg-white p-1">
            {[
              { label: "X / Twitter", href: "/", selected: platform === "x" },
              { label: "Instagram", href: "/instagram", selected: platform === "instagram" },
              { label: "TikTok", href: "/tiktok", selected: false },
            ].map((item) => (
              <Link
                key={item.label}
                aria-current={item.selected ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${item.selected ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-amber-50 hover:text-stone-900"}`}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <SupportUsButton />
        </div>

        {platform === "instagram" && content ? (
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

        {result && platform !== "instagram" && (
          <div className="bg-white border border-stone-200 shadow-sm mt-6 overflow-hidden rounded-2xl">
            <div className="flex items-center gap-3 p-4 px-6 border-b border-stone-200"><span className="text-emerald-600 text-xl">✓</span><span className="text-[15px]"><span className="text-violet-600">@{result.username}</span> <span className="text-emerald-700">exists.</span></span></div>
            <InfoRow id="sugg" label={result.searchSuggestionBan ? "Search suggestion ban." : "No search suggestion ban."} isBan={result.searchSuggestionBan} desc="Typeahead test: When you type @username in Twitter search, does it auto-suggest? If not, you have a search suggestion ban. Profile hidden from typeahead." />
            <InfoRow id="search" label={result.searchBan ? "Search ban." : "No search ban."} isBan={result.searchBan} desc="Search ban: Your tweets don't appear in search results for logged-out users. Searching from:@username shows nothing." />
            <InfoRow id="ghost" label={result.ghostBan ? "Ghost ban." : "No ghost ban."} isBan={result.ghostBan} desc="Ghost ban: Your tweets are visible only to you, invisible to everyone else. The classic shadowban." />
            <InfoRow id="reply" label={result.replyDeboosting ? "Reply deboosting detected." : "No reply deboosting detected."} isBan={result.replyDeboosting} desc="Reply deboosting: Your replies are collapsed under 'Show more replies' so almost nobody sees them." />
          </div>
        )}

        <DonationButtons />

        <section id="how-it-works" className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <h2 className="border-b border-stone-200 px-6 py-4 text-lg font-bold text-stone-900">
            {content?.faqTitle ?? "Frequently asked questions"}
          </h2>
          <div className="divide-y divide-stone-200">
            {faqItems.map((faq, index) => {
              const id = `faq-${index}`
              const isOpen = openInfo === id
              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenInfo(isOpen ? null : id)}
                    className="flex w-full items-center justify-between p-4 px-6 text-left transition-colors hover:bg-amber-50/60"
                  >
                    <span className="text-[14px] text-stone-800">{faq.question}</span>
                    <span className={`ml-4 shrink-0 text-xs text-stone-500 transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
                  </button>
                  {isOpen && <div className="px-6 pb-4 text-[13px] leading-relaxed text-stone-600">{faq.answer}</div>}
                </div>
              )
            })}
          </div>
        </section>

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
                name: "Twitter Shadowban Checker",
                url: `${baseUrl}/`,
                description: "A free tool to check public X/Twitter profile information.",
                applicationCategory: "UtilitiesApplication",
                operatingSystem: "Any",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              }),
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
              }),
            }}
          />
        </>
      )}
    </main>
  )
}
