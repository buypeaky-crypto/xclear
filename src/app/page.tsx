// Shared homepage and platform landing layout.
// Keeps the existing platform routes and checker components intact.
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Fraunces, Sora } from 'next/font/google'
import CheckerIsland from '@/components/CheckerIsland'
import AdBelowChecker from '@/components/AdBelowChecker'
import BrandHomeLink from '../components/BrandHomeLink'
import PlatformSwitcher from '../components/PlatformSwitcher'
import SupportUsButton from '../components/SupportUsButton'
import SupportPopup from '../components/SupportPopup'
import { checkInstagram, type IGCheckResult } from '../lib/instagram/checker'
import AlertButton from './components/AlertButton'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

type Platform = 'x' | 'instagram' | 'facebook' | 'tiktok' | 'reddit' | 'youtube'

type Props = {
  platform?: string
  backgroundClassName?: string
  locale?: string
  variant?: string
  content?: any
  dictionary?: any
  [key: string]: any
}

type GenericResult = {
  handle: string
  reasons: string[]
}

const PLATFORM_COPY: Record<Platform, {
  eyebrow: string
  title: string
  description: string
  method: string
  toolTitle: string
  handleLabel: string
  handlePlaceholder: string
  keywordsLabel: string
  keywordsPlaceholder: string
  buttonLabel: string
  limitation: string
}> = {
  x: {
    eyebrow: 'PUBLIC VISIBILITY CHECKER',
    title: 'Check your X visibility',
    description: 'Review public profile, search, and suggestion signals for an X username. No X password or login required.',
    method: 'Public X signals · Logged-out checks',
    toolTitle: 'Check an X profile',
    handleLabel: 'X username or profile URL',
    handlePlaceholder: '@username or x.com/username',
    keywordsLabel: '',
    keywordsPlaceholder: '',
    buttonLabel: 'Check visibility',
    limitation: 'These public checks cannot reveal every ranking, recommendation, or enforcement decision made by X.',
  },
  instagram: {
    eyebrow: 'INSTAGRAM HASHTAG REVIEW',
    title: 'Review Instagram hashtag patterns',
    description: 'Check a set of hashtags against a local reference list. This tool does not access your Instagram account or confirm account restrictions.',
    method: 'Local hashtag heuristic · No Instagram login',
    toolTitle: 'Review hashtags',
    handleLabel: 'Instagram username (optional context)',
    handlePlaceholder: 'yourusername',
    keywordsLabel: 'Recent hashtags',
    keywordsPlaceholder: '#example #yourtopic #community',
    buttonLabel: 'Review hashtags',
    limitation: 'A hashtag pattern match is not proof that Instagram has restricted a post or account. Context and platform decisions matter.',
  },
  tiktok: {
    eyebrow: 'TIKTOK CONTENT REVIEW',
    title: 'Review TikTok content patterns',
    description: 'Review submitted keywords for selected content patterns. This local tool does not inspect TikTok account reach or recommendation status.',
    method: 'Local content heuristic · No TikTok login',
    toolTitle: 'Review content patterns',
    handleLabel: 'TikTok username (optional context)',
    handlePlaceholder: 'yourusername',
    keywordsLabel: 'Recent tags or keywords',
    keywordsPlaceholder: '#yourtopic #community',
    buttonLabel: 'Review patterns',
    limitation: 'This review analyzes only the text you enter. It does not connect to TikTok or measure video distribution.',
  },
  youtube: {
    eyebrow: 'YOUTUBE CONTENT REVIEW',
    title: 'Review YouTube content patterns',
    description: 'Review submitted keywords and tags for selected patterns. This tool does not inspect your channel status or video recommendations.',
    method: 'Local content heuristic · No YouTube login',
    toolTitle: 'Review content patterns',
    handleLabel: 'YouTube channel handle (optional context)',
    handlePlaceholder: '@yourchannel',
    keywordsLabel: 'Recent tags or keywords',
    keywordsPlaceholder: 'your topic, channel, video',
    buttonLabel: 'Review patterns',
    limitation: 'This review analyzes only the text you enter. It does not connect to YouTube or measure channel visibility.',
  },
  reddit: {
    eyebrow: 'REDDIT CONTENT REVIEW',
    title: 'Review Reddit content patterns',
    description: 'Review submitted text for selected patterns. This tool does not inspect Reddit account status, post removals, or subreddit moderation.',
    method: 'Local content heuristic · No Reddit login',
    toolTitle: 'Review content patterns',
    handleLabel: 'Reddit username (optional context)',
    handlePlaceholder: 'yourusername',
    keywordsLabel: 'Recent text or keywords',
    keywordsPlaceholder: 'Enter words or phrases to review',
    buttonLabel: 'Review patterns',
    limitation: 'This review analyzes only the text you enter. It does not connect to Reddit or determine whether moderators have filtered a post.',
  },
  facebook: {
    eyebrow: 'FACEBOOK CONTENT REVIEW',
    title: 'Review Facebook content patterns',
    description: 'Review submitted text for selected patterns. This tool does not access your Facebook Page or account distribution data.',
    method: 'Local content heuristic · No Facebook login',
    toolTitle: 'Review content patterns',
    handleLabel: 'Facebook Page or profile name (optional)',
    handlePlaceholder: 'yourpage',
    keywordsLabel: 'Recent text or keywords',
    keywordsPlaceholder: 'Enter words or phrases to review',
    buttonLabel: 'Review patterns',
    limitation: 'This review analyzes only the text you enter. It does not connect to Facebook or confirm visibility restrictions.',
  },
}

function localCheck(platform: Platform, keywords: string[]) {
  let score = 100
  const reasons: string[] = []
  const text = keywords.join(' ').toLowerCase()

  if (keywords.length > 15) {
    score -= 20
    reasons.push(`More than 15 tags or keywords were entered (${keywords.length}).`)
  }

  if (text.includes('sub4sub') || text.includes('follow for follow') || text.includes('f4f')) {
    score -= 40
    reasons.push('A follow-exchange phrase was found in the submitted text.')
  }

  if (platform === 'youtube' && text.split('#').length > 6) {
    score -= 15
    reasons.push('The submitted text contains more than five hashtag markers.')
  }

  if (keywords.length === 0) {
    reasons.push('Enter some tags or keywords to review.')
  } else {
    reasons.push(`${keywords.length} submitted item(s) were reviewed using local rules.`)
  }

  if (score > 70) {
    reasons.push('No additional configured text patterns were identified.')
  } else {
    reasons.push('Review the patterns above before using this content.')
  }

  return { score: Math.max(0, score), reasons }
}

export default function Home({
  platform = 'x',
  backgroundClassName = 'bg-[#fdf6e3]',
  locale = 'en',
  variant,
  content,
  dictionary,
  ...rest
}: Props = {}) {
  const normalizedPlatform = (platform === 'twitter' ? 'x' : platform) as Platform
  const copy = PLATFORM_COPY[normalizedPlatform] ?? PLATFORM_COPY.x

  const [inputVal, setInputVal] = useState(
    normalizedPlatform === 'instagram'
      ? 'aljannah.tv'
      : normalizedPlatform === 'youtube'
        ? 'villainaudit'
        : normalizedPlatform === 'tiktok'
          ? 'hownwhen'
          : 'gutnews247',
  )
  const [kwInput, setKwInput] = useState(
    normalizedPlatform === 'youtube'
      ? 'shadowban, check, audit'
      : normalizedPlatform === 'tiktok'
        ? '#shadowban #check'
        : '#quran #islam #faith #muslim #islamic',
  )
  const [igResult, setIgResult] = useState<IGCheckResult | null>(null)
  const [genericResult, setGenericResult] = useState<GenericResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSupport, setShowSupport] = useState(false)

  const handleCheck = async () => {
    const clean = inputVal.replace(/^@/, '').trim().toLowerCase()
    if (!clean && normalizedPlatform !== 'instagram') return

    setLoading(true)
    setShowSupport(true)
    setGenericResult(null)
    setIgResult(null)

    if (normalizedPlatform === 'instagram') {
      const tags = kwInput.split(/[\s,]+/).map((tag) => tag.trim()).filter(Boolean)
      setIgResult(checkInstagram(clean, tags))
    } else {
      const keywords = kwInput.split(/[\s,]+/).map((item) => item.trim()).filter(Boolean)
      const { reasons } = localCheck(normalizedPlatform, keywords)
      setGenericResult({ handle: clean, reasons })
    }

    setLoading(false)
  }

  const renderGeneric = () => (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void handleCheck()
      }}
      className="space-y-5 text-left"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="platform-handle" className="mb-2 block text-sm font-semibold text-stone-800">
            {copy.handleLabel}
          </label>
          <div className="flex h-13 items-center rounded-xl border border-stone-300 bg-white px-3 transition focus-within:border-stone-900 focus-within:ring-2 focus-within:ring-stone-900/10">
            <span aria-hidden="true" className="mr-2 font-semibold text-stone-400">@</span>
            <input
              id="platform-handle"
              value={inputVal}
              onChange={(event) => setInputVal(event.target.value.replace(/^@/, ''))}
              placeholder={copy.handlePlaceholder}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-stone-400"
              autoComplete="off"
            />
          </div>
        </div>
        <div>
          <label htmlFor="platform-keywords" className="mb-2 block text-sm font-semibold text-stone-800">
            {copy.keywordsLabel}
          </label>
          <textarea
            id="platform-keywords"
            value={kwInput}
            onChange={(event) => setKwInput(event.target.value)}
            rows={3}
            placeholder={copy.keywordsPlaceholder}
            className="min-h-[52px] w-full resize-y rounded-xl border border-stone-300 bg-white px-3 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex h-13 w-full items-center justify-center rounded-xl bg-stone-950 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-48"
      >
        {loading ? 'Reviewing…' : copy.buttonLabel}
      </button>

      {genericResult && (
        <section className="rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:p-5" aria-live="polite">
          <h3 className="font-semibold text-stone-900">Content-pattern review completed</h3>
          {genericResult.handle && <p className="mt-1 text-xs text-stone-500">Context: @{genericResult.handle}</p>}
          <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
            {genericResult.reasons.map((reason, index) => (
              <li key={`${index}-${reason}`} className="flex gap-2">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-500" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </form>
  )

  return (
    <main lang={locale} className={`${sora.className} min-h-screen ${backgroundClassName} pb-20 text-stone-900`}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="flex min-h-[76px] items-center justify-between gap-4 border-b border-stone-900/10">
          <BrandHomeLink />
          <div className="hidden items-center gap-2 rounded-full border border-stone-300/80 bg-white/70 px-3 py-1.5 text-xs font-medium text-stone-600 sm:flex">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-500" />
            Free tool · No social password
          </div>
        </header>

        <section className="mx-auto max-w-4xl pt-10 text-center sm:pt-14">
          <p className="inline-flex items-center rounded-full border border-stone-300/80 bg-white/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-600">
            {copy.eyebrow}
          </p>
          <h1 className={`${fraunces.className} mx-auto mt-5 max-w-4xl text-4xl font-black leading-[1.04] tracking-tight text-stone-900 sm:text-5xl lg:text-6xl`}>
            {copy.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            {copy.description}
          </p>
        </section>

        <div className="mt-8 flex justify-center">
          <PlatformSwitcher activePlatform={normalizedPlatform} />
        </div>

        <section className="mx-auto mt-7 w-full max-w-3xl" aria-labelledby="checker-card-title">
          <div className="rounded-[26px] border border-stone-200/90 bg-white p-4 shadow-[0_18px_55px_rgba(55,45,25,0.08)] sm:p-7">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div className="text-left">
                <h2 id="checker-card-title" className="text-lg font-bold tracking-tight text-stone-900 sm:text-xl">
                  {copy.toolTitle}
                </h2>
                <p className="mt-1 text-xs text-stone-500">{copy.method}</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                Free · No login
              </span>
            </div>

            {normalizedPlatform === 'x' && <CheckerIsland />}
            {normalizedPlatform === 'instagram' && (
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  void handleCheck()
                }}
                className="space-y-5 text-left"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="instagram-handle" className="mb-2 block text-sm font-semibold text-stone-800">Instagram username</label>
                    <div className="flex h-13 items-center rounded-xl border border-stone-300 bg-white px-3 focus-within:border-stone-900 focus-within:ring-2 focus-within:ring-stone-900/10">
                      <span aria-hidden="true" className="mr-2 font-semibold text-stone-400">@</span>
                      <input
                        id="instagram-handle"
                        value={inputVal}
                        onChange={(event) => setInputVal(event.target.value.replace(/^@/, ''))}
                        placeholder="yourusername"
                        className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="instagram-hashtags" className="mb-2 block text-sm font-semibold text-stone-800">Recent hashtags</label>
                    <textarea
                      id="instagram-hashtags"
                      value={kwInput}
                      onChange={(event) => setKwInput(event.target.value)}
                      rows={3}
                      placeholder="#yourtopic #community"
                      className="w-full rounded-xl border border-stone-300 bg-white px-3 py-3 text-sm outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="h-13 w-full rounded-xl bg-stone-950 px-6 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-60 sm:w-auto sm:min-w-48">
                  {loading ? 'Reviewing…' : copy.buttonLabel}
                </button>
                {igResult && (
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:p-5" aria-live="polite">
                    <h3 className="font-semibold text-stone-900">Hashtag pattern review completed</h3>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
                      {igResult.reasons?.map((reason, index) => (
                        <li key={`${index}-${reason}`} className="flex gap-2">
                          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-500" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs leading-5 text-stone-500">This is a local heuristic, not an Instagram account-status or reach test.</p>
                  </div>
                )}
              </form>
            )}
            {normalizedPlatform !== 'x' && normalizedPlatform !== 'instagram' && renderGeneric()}
          </div>

          <div className="mt-4 rounded-2xl border border-stone-300/70 bg-white/60 px-4 py-3 text-left">
            <p className="text-xs leading-5 text-stone-600">{copy.limitation}</p>
          </div>
          <div className="mt-6">
            <AdBelowChecker />
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-5xl" aria-labelledby="how-it-works-title">
          <div className="mb-5 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">A clearer way to investigate</p>
            <h2 id="how-it-works-title" className={`${fraunces.className} mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl`}>
              Understand what the checker can tell you
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <article className="rounded-2xl border border-stone-200/90 bg-white/80 p-5">
              <span className="text-xs font-bold text-stone-400">01</span>
              <h3 className="mt-2 font-semibold text-stone-900">Choose a platform</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">Select the network you want to review. Each tool explains whether it uses public signals or a local heuristic.</p>
            </article>
            <article className="rounded-2xl border border-stone-200/90 bg-white/80 p-5">
              <span className="text-xs font-bold text-stone-400">02</span>
              <h3 className="mt-2 font-semibold text-stone-900">Run the available check</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">Enter the requested information. Never provide a social media password or login code.</p>
            </article>
            <article className="rounded-2xl border border-stone-200/90 bg-white/80 p-5">
              <span className="text-xs font-bold text-stone-400">03</span>
              <h3 className="mt-2 font-semibold text-stone-900">Read the evidence</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">Review the signals, explanations, and limitations. An inconclusive result is not proof of a restriction.</p>
            </article>
          </div>
        </section>
{/* Add import near the top: import Link from 'next/link'
    Insert this section after "Understand what the checker can tell you"
    and before the "Independent tool" section. This is visible content, not metadata. */}
<section className="mx-auto mt-14 max-w-5xl" aria-labelledby="methodology-title">
  <div className="mb-6 max-w-3xl">
    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">
      Methodology and limitations
    </p>
    <h2
      id="methodology-title"
      className={`${fraunces.className} mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl`}
    >
      What this {normalizedPlatform === 'x' ? 'X visibility check' : `${normalizedPlatform} review`} can tell you
    </h2>
    <p className="mt-3 text-sm leading-7 text-stone-600 sm:text-base">
      A visibility check is a limited diagnostic, not an official account-status decision.
      A missing search result, lower engagement, or an unavailable public endpoint does not
      by itself prove that a platform has restricted an account or post.
    </p>
  </div>

  <div className="grid gap-4 md:grid-cols-2">
    <article className="rounded-2xl border border-stone-200 bg-white p-5">
      <h3 className="text-base font-semibold text-stone-900">
        {normalizedPlatform === 'x'
          ? 'What the X checker tests'
          : normalizedPlatform === 'instagram'
            ? 'What the Instagram review tests'
            : `What the ${normalizedPlatform} review tests`}
      </h3>

      {normalizedPlatform === 'x' ? (
        <p className="mt-3 text-sm leading-7 text-stone-600">
          The X checker makes logged-out public requests to examine profile endpoint
          reachability, whether a limited recent-search query returns a post from the
          username, and whether the exact username appears in the returned typeahead
          suggestions. These are narrow observations from public endpoints. They do not
          reveal every search, ranking, recommendation, or enforcement decision made by X.
        </p>
      ) : normalizedPlatform === 'instagram' ? (
        <p className="mt-3 text-sm leading-7 text-stone-600">
          This tool compares the hashtags you enter with a local reference list. It does
          not sign in to Instagram, inspect your account, query live hashtag search results,
          or confirm that Instagram has restricted a post or account.
        </p>
      ) : (
        <p className="mt-3 text-sm leading-7 text-stone-600">
          This tool reviews only the text, tags, or keywords you submit using local pattern
          rules. It does not connect to {normalizedPlatform}, inspect account analytics,
          retrieve posts, or measure search and recommendation distribution.
        </p>
      )}
    </article>

    <article className="rounded-2xl border border-stone-200 bg-white p-5">
      <h3 className="text-base font-semibold text-stone-900">
        What the result cannot establish
      </h3>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-stone-600">
        <li>It cannot prove that an account has been officially shadowbanned.</li>
        <li>It cannot determine every ranking or recommendation decision.</li>
        <li>It cannot explain a drop in views or engagement by itself.</li>
        <li>An unavailable or malformed source must be treated as inconclusive.</li>
      </ul>
    </article>
  </div>

  <article className="mt-4 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
    <h3 className="text-base font-semibold text-stone-900">
      How to investigate a visibility problem
    </h3>
    <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-stone-600">
      <li>Check the platform's own account-status notices, policy messages, and privacy settings.</li>
      <li>Compare more than one public post and, where appropriate, repeat the check later.</li>
      <li>Consider ordinary causes such as protected content, search relevance, deleted posts, indexing delays, or temporary service errors.</li>
      <li>Use the platform's official support or appeal process if it displays an account or content notice.</li>
    </ol>
  </article>
</section>

<section className="mx-auto mt-14 max-w-5xl" aria-labelledby="faq-title">
  <div className="mb-5 max-w-3xl">
    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">
      Common questions
    </p>
    <h2
      id="faq-title"
      className={`${fraunces.className} mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl`}
    >
      Frequently asked questions
    </h2>
  </div>

  <div className="space-y-3">
    <details className="group rounded-xl border border-stone-200 bg-white p-4">
      <summary className="cursor-pointer list-none font-semibold text-stone-900">
        Can this checker confirm that my account is shadowbanned?
      </summary>
      <p className="mt-3 text-sm leading-7 text-stone-600">
        No. An independent public checker cannot confirm every platform restriction.
        It can report only the specific public signals or text patterns described in its
        methodology. Treat the result as a diagnostic clue, not an official platform verdict.
      </p>
    </details>

    <details className="group rounded-xl border border-stone-200 bg-white p-4">
      <summary className="cursor-pointer list-none font-semibold text-stone-900">
        Does low reach or low engagement prove a visibility restriction?
      </summary>
      <p className="mt-3 text-sm leading-7 text-stone-600">
        No. Reach and engagement can change for many reasons, including audience interest,
        posting frequency, content topic, competition, privacy settings, and recommendation
        systems. A metric by itself does not establish that an account has been restricted.
      </p>
    </details>

    <details className="group rounded-xl border border-stone-200 bg-white p-4">
      <summary className="cursor-pointer list-none font-semibold text-stone-900">
        What does “signal not observed” mean?
      </summary>
      <p className="mt-3 text-sm leading-7 text-stone-600">
        It means that a specific completed test did not return the expected public signal
        in that request. It does not explain why the signal was absent and does not, by
        itself, prove a restriction. If the source fails or returns an unexpected response,
        the result should be shown as unable to verify.
      </p>
    </details>

    <details className="group rounded-xl border border-stone-200 bg-white p-4">
      <summary className="cursor-pointer list-none font-semibold text-stone-900">
        Do I need to provide my social media password?
      </summary>
      <p className="mt-3 text-sm leading-7 text-stone-600">
        No. This checker does not ask for a social media password, login code, or session
        cookie. For X, the username is sent to the site's checker endpoint for limited
        public lookups. The other pattern-review tools analyze the text you enter in this page.
        Review the Privacy Policy for details about server requests, logs, and retention.
      </p>
    </details>

    <details className="group rounded-xl border border-stone-200 bg-white p-4">
      <summary className="cursor-pointer list-none font-semibold text-stone-900">
        What should I do if the result is inconclusive?
      </summary>
      <p className="mt-3 text-sm leading-7 text-stone-600">
        Do not treat an inconclusive result as a restriction. Check the platform's own
        account-status messages and help resources, review whether the content is public,
        and try again later if a temporary service problem prevented the check.
      </p>
    </details>
  </div>
</section>

<section className="mx-auto mt-10 max-w-5xl rounded-2xl border border-stone-200 bg-white/80 p-5 sm:p-6" aria-labelledby="official-resources-title">
  <h2 id="official-resources-title" className="text-base font-semibold text-stone-900">
    Official resources
  </h2>
  <p className="mt-2 text-sm leading-6 text-stone-600">
    Use the platform's own help resources to verify account notices and understand search or content visibility.
  </p>
  <ul className="mt-3 space-y-2 text-sm">
    {normalizedPlatform === 'x' && (
      <>
        <li>
          <a className="font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 hover:text-violet-700" href="https://help.x.com/en/using-x/x-search-not-working" target="_blank" rel="noopener noreferrer">
            X Help: Posts or hashtags not appearing in search
          </a>
        </li>
        <li>
          <a className="font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 hover:text-violet-700" href="https://help.x.com/en/rules-and-policies/x-search-policies" target="_blank" rel="noopener noreferrer">
            X Help: Search rules and restrictions
          </a>
        </li>
        <li>
          <a className="font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 hover:text-violet-700" href="https://help.x.com/en/safety-and-security/public-and-protected-posts" target="_blank" rel="noopener noreferrer">
            X Help: Public and protected posts
          </a>
        </li>
      </>
    )}
    {normalizedPlatform === 'tiktok' && (
      <li>
        <a className="font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 hover:text-violet-700" href="https://support.tiktok.com/en/safety-hc/account-and-user-safety" target="_blank" rel="noopener noreferrer">
          TikTok Help: Account and user safety
        </a>
      </li>
    )}
    {normalizedPlatform === 'reddit' && (
      <li>
        <a className="font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 hover:text-violet-700" href="https://support.reddithelp.com/hc/en-us/articles/360045734591-Account-status-overview" target="_blank" rel="noopener noreferrer">
          Reddit Help: Account status overview
        </a>
      </li>
    )}
    <li>
      <Link className="font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 hover:text-violet-700" href="/about">
        Read how Shadowban.online works
      </Link>
    </li>
    <li>
      <Link className="font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 hover:text-violet-700" href="/privacy">
        Read the Privacy Policy
      </Link>
    </li>
  </ul>
</section>
        <section className="mx-auto mt-8 max-w-5xl rounded-2xl border border-stone-300/70 bg-white/60 p-5 text-center sm:p-6">
          <h2 className="font-semibold text-stone-900">Independent tool, not an official platform service</h2>
          <p className="mx-auto mt-2 max-w-3xl text-sm leading-6 text-stone-600">
            Shadowban.online is independent and is not affiliated with X, Instagram, TikTok, YouTube, Facebook, or Reddit. Platform names are used only to identify the services being discussed.
          </p>
        </section>

        <div className="mt-9 flex justify-center">
          <SupportUsButton />
        </div>

        <div className="mx-auto mt-8 max-w-3xl">
          <AlertButton handle={inputVal} platform={normalizedPlatform} />
        </div>
      </div>

      <SupportPopup isOpen={showSupport} onClose={() => setShowSupport(false)} isChecking={loading} />
    </main>
  )
}
