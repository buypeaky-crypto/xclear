
// Shared homepage and platform landing layout.
// X and Instagram have dedicated visual identities.
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
    eyebrow: 'INSTAGRAM HASHTAG CHECKER',
    title: 'Instagram Hashtag Checker',
    description: 'Review hashtags from a recent Instagram post for repeated tags and selected patterns in a local reference list. No Instagram login or password required.',
    method: 'Local hashtag pattern review · No Instagram connection',
    toolTitle: 'Review your Instagram hashtags',
    handleLabel: 'Instagram username (optional)',
    handlePlaceholder: 'yourusername',
    keywordsLabel: 'Hashtags from your post',
    keywordsPlaceholder: '#yourtopic #community #yourbrand',
    buttonLabel: 'Review hashtags',
    limitation: 'This is a local hashtag-pattern review. It does not query Instagram, inspect account status, or confirm that a post or account has been restricted.',
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
    handleLabel: 'YouTube channel handle (optional)',
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

  if (
    text.includes('sub4sub') ||
    text.includes('follow for follow') ||
    text.includes('f4f')
  ) {
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
  const isXPlatform = normalizedPlatform === 'x'
  const isInstagramPlatform = normalizedPlatform === 'instagram'
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
      const tags = kwInput
        .split(/[\s,]+/)
        .map((tag) => tag.trim())
        .filter(Boolean)

      setIgResult(checkInstagram(clean, tags))
    } else {
      const keywords = kwInput
        .split(/[\s,]+/)
        .map((item) => item.trim())
        .filter(Boolean)

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
          <label
            htmlFor="platform-handle"
            className="mb-2 block text-sm font-semibold text-stone-800"
          >
            {copy.handleLabel}
          </label>

          <div className="flex h-13 items-center rounded-xl border border-stone-300 bg-white px-3 transition focus-within:border-stone-900 focus-within:ring-2 focus-within:ring-stone-900/10">
            <span
              aria-hidden="true"
              className="mr-2 font-semibold text-stone-400"
            >
              @
            </span>

            <input
              id="platform-handle"
              value={inputVal}
              onChange={(event) =>
                setInputVal(event.target.value.replace(/^@/, ''))
              }
              placeholder={copy.handlePlaceholder}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-stone-400"
              autoComplete="off"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="platform-keywords"
            className="mb-2 block text-sm font-semibold text-stone-800"
          >
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
        <section
          className="rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:p-5"
          aria-live="polite"
        >
          <h3 className="font-semibold text-stone-900">
            Content-pattern review completed
          </h3>

          {genericResult.handle && (
            <p className="mt-1 text-xs text-stone-500">
              Context: @{genericResult.handle}
            </p>
          )}

          <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
            {genericResult.reasons.map((reason, index) => (
              <li
                key={`${index}-${reason}`}
                className="flex gap-2"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-500"
                />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </form>
  )

  return (
    <main
      lang={locale}
      className={`${sora.className} min-h-screen ${
        isXPlatform
          ? 'bg-[#eaf3f9]'
          : isInstagramPlatform
            ? 'bg-[#fff5f7]'
            : backgroundClassName
      } pb-20 text-stone-900`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <header
          className={`flex min-h-[76px] items-center justify-between gap-4 ${
            isXPlatform
              ? 'border-b border-[#c9dce9]'
              : isInstagramPlatform
                ? 'border-b border-[#f1d5df]'
                : 'border-b border-stone-900/10'
          }`}
        >
          <BrandHomeLink />

          <div
            className={`hidden items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium sm:flex ${
              isXPlatform
                ? 'border border-[#c4dcec] bg-white text-[#34495a]'
                : isInstagramPlatform
                  ? 'border border-[#f0cbd8] bg-white text-[#8d385d]'
                  : 'border border-stone-300/80 bg-white/70 text-stone-600'
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full ${
                isInstagramPlatform
                  ? 'bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af]'
                  : 'bg-emerald-500'
              }`}
            />
            Free tool · No social password
          </div>
        </header>

        {/* Platform-specific hero */}
        <section
          className={`mx-auto pt-10 sm:pt-14 ${
            isXPlatform
              ? 'grid max-w-5xl items-center gap-8 text-left lg:grid-cols-[1.1fr_0.9fr]'
              : isInstagramPlatform
                ? 'grid max-w-5xl items-center gap-8 text-left lg:grid-cols-[1.08fr_0.92fr]'
                : 'max-w-4xl text-center'
          }`}
        >
          {isXPlatform ? (
            <>
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-[#b8d8ef] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1769a6]">
                  <span className="h-2 w-2 rounded-full bg-[#1d9bf0]" />
                  X PROFILE &amp; SEARCH VISIBILITY
                </p>

                <h1
                  className={`${fraunces.className} mt-6 max-w-2xl text-4xl font-black leading-[1.05] tracking-tight text-[#0f1419] sm:text-5xl lg:text-6xl`}
                >
                  Check your X profile visibility
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-7 text-[#536471] sm:text-base">
                  Investigate selected public X profile, search and
                  username suggestion signals. Get an evidence-based
                  report explaining what was observed and what could
                  not be verified.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#cbdce8] bg-white px-3 py-2 text-xs font-semibold text-[#34495a]">
                    No X password required
                  </span>

                  <span className="rounded-full border border-[#cbdce8] bg-white px-3 py-2 text-xs font-semibold text-[#34495a]">
                    Logged-out public checks
                  </span>

                  <span className="rounded-full border border-[#cbdce8] bg-white px-3 py-2 text-xs font-semibold text-[#34495a]">
                    Evidence and timestamps
                  </span>
                </div>
              </div>

              <aside className="rounded-[26px] border border-[#263746] bg-[#0f1419] p-5 text-white shadow-[0_18px_50px_rgba(15,20,25,0.18)] sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-bold">
                    What gets checked?
                  </h2>

                  <span className="rounded-full bg-[#1d9bf0]/15 px-3 py-1 text-[10px] font-semibold text-[#72c5ff]">
                    3 public signals
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="flex gap-3 border-b border-white/10 pb-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 text-xs font-bold text-[#72c5ff]">
                      01
                    </span>

                    <div>
                      <h3 className="text-sm font-semibold">
                        Profile reachability
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-[#aab8c4]">
                        Checks whether the public profile endpoint responds.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 border-b border-white/10 pb-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 text-xs font-bold text-[#72c5ff]">
                      02
                    </span>

                    <div>
                      <h3 className="text-sm font-semibold">
                        Limited recent search
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-[#aab8c4]">
                        Checks whether a recent post appears in a limited
                        logged-out search response.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 text-xs font-bold text-[#72c5ff]">
                      03
                    </span>

                    <div>
                      <h3 className="text-sm font-semibold">
                        Username suggestions
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-[#aab8c4]">
                        Checks whether the exact username appears in returned
                        typeahead suggestions.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-[#aab8c4]">
                  These are limited public observations. They cannot reveal
                  every X search, ranking or recommendation decision.
                </p>
              </aside>
            </>
          ) : isInstagramPlatform ? (
            <>
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-[#f1cada] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#a33c6c]">
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-[12px] font-bold text-white">
                    ◎
                  </span>
                  INSTAGRAM HASHTAG REVIEW
                </p>

                <h1
                  className={`${fraunces.className} mt-6 max-w-2xl text-4xl font-black leading-[1.05] tracking-tight text-[#392235] sm:text-5xl lg:text-6xl`}
                >
                  Instagram Hashtag Checker
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-7 text-[#745d6c] sm:text-base">
                  Check a hashtag list for duplicate tags and selected
                  patterns using a local reference list. Review the
                  findings before publishing your next Instagram post.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#efd0dc] bg-white px-3 py-2 text-xs font-semibold text-[#79425d]">
                    No Instagram login
                  </span>

                  <span className="rounded-full border border-[#efd0dc] bg-white px-3 py-2 text-xs font-semibold text-[#79425d]">
                    Duplicate-tag review
                  </span>

                  <span className="rounded-full border border-[#efd0dc] bg-white px-3 py-2 text-xs font-semibold text-[#79425d]">
                    Local pattern checks
                  </span>
                </div>
              </div>

              <aside className="relative overflow-hidden rounded-[28px] border border-[#f1cbd9] bg-white p-5 shadow-[0_20px_55px_rgba(165,70,115,0.10)] sm:p-6">
                <div
                  aria-hidden="true"
                  className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-gradient-to-br from-[#f58529]/20 via-[#dd2a7b]/15 to-[#8134af]/20 blur-2xl"
                />

                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b15a80]">
                        HASHTAG REVIEW BOARD
                      </p>

                      <h2 className="mt-1 text-lg font-bold text-[#392235]">
                        What gets reviewed?
                      </h2>
                    </div>

                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-2xl font-semibold text-white shadow-sm">
                      #
                    </span>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#fff0e5] px-3 py-2 text-xs font-semibold text-[#a85a22]">
                      #yourtopic
                    </span>

                    <span className="rounded-full bg-[#fceaf1] px-3 py-2 text-xs font-semibold text-[#a33c6c]">
                      #community
                    </span>

                    <span className="rounded-full bg-[#f1eafb] px-3 py-2 text-xs font-semibold text-[#70459c]">
                      #yourbrand
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-start gap-3 border-b border-[#f5e5eb] pb-4">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#fff0e5] text-sm font-bold text-[#c16a2b]">
                        01
                      </span>

                      <div>
                        <h3 className="text-sm font-semibold text-[#392235]">
                          Reference-list matches
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-[#806b78]">
                          Identifies tags that match entries in the tool's
                          configured local list.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-b border-[#f5e5eb] pb-4">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#fceaf1] text-sm font-bold text-[#b44278]">
                        02
                      </span>

                      <div>
                        <h3 className="text-sm font-semibold text-[#392235]">
                          Repeated hashtags
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-[#806b78]">
                          Checks whether the same hashtag appears more than
                          once in the submitted list.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#f1eafb] text-sm font-bold text-[#70459c]">
                        03
                      </span>

                      <div>
                        <h3 className="text-sm font-semibold text-[#392235]">
                          Hashtag count
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-[#806b78]">
                          Flags a submitted list that contains more than
                          30 hashtags.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 border-t border-[#f5e5eb] pt-4 text-xs leading-5 text-[#806b78]">
                    This is a local text review, not a live Instagram search
                    or account-status test.
                  </p>
                </div>
              </aside>
            </>
          ) : (
            <>
              <p className="inline-flex items-center rounded-full border border-stone-300/80 bg-white/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-600">
                {copy.eyebrow}
              </p>

              <h1
                className={`${fraunces.className} mx-auto mt-5 max-w-4xl text-4xl font-black leading-[1.04] tracking-tight text-stone-900 sm:text-5xl lg:text-6xl`}
              >
                {copy.title}
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
                {copy.description}
              </p>
            </>
          )}
        </section>

        <div className="mt-8 flex justify-center">
          <PlatformSwitcher
            activePlatform={normalizedPlatform}
            locale={locale}
          />
        </div>

        {/* Checker panel */}
        <section
          className={`mx-auto mt-7 w-full ${
            isXPlatform || isInstagramPlatform ? 'max-w-4xl' : 'max-w-3xl'
          }`}
          aria-labelledby="checker-card-title"
        >
          <div
            className={
              isXPlatform
                ? 'rounded-[30px] border border-[#cbd9e4] bg-[#e5f0f7] p-3 shadow-[0_20px_60px_rgba(29,70,100,0.10)] sm:p-5'
                : isInstagramPlatform
                  ? 'rounded-[30px] border border-[#f0cad8] bg-white p-4 shadow-[0_20px_60px_rgba(165,70,115,0.10)] sm:p-7'
                  : 'rounded-[26px] border border-stone-200/90 bg-white p-4 shadow-[0_18px_55px_rgba(55,45,25,0.08)] sm:p-7'
            }
          >
            {!isXPlatform && (
              <div
                className={`mb-6 flex flex-wrap items-center justify-between gap-3 border-b pb-4 ${
                  isInstagramPlatform ? 'border-[#f5e5eb]' : 'border-stone-100'
                }`}
              >
                <div className="text-left">
                  <h2
                    id="checker-card-title"
                    className={`text-lg font-bold tracking-tight sm:text-xl ${
                      isInstagramPlatform ? 'text-[#392235]' : 'text-stone-900'
                    }`}
                  >
                    {copy.toolTitle}
                  </h2>

                  <p
                    className={`mt-1 text-xs ${
                      isInstagramPlatform ? 'text-[#9a7185]' : 'text-stone-500'
                    }`}
                  >
                    {copy.method}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isInstagramPlatform
                      ? 'bg-gradient-to-r from-[#fff0e5] via-[#fceaf1] to-[#f1eafb] text-[#94446d]'
                      : 'bg-emerald-50 text-emerald-800'
                  }`}
                >
                  Free · No login
                </span>
              </div>
            )}

            {normalizedPlatform === 'x' && (
              <h2 id="checker-card-title" className="sr-only">
                X visibility checker
              </h2>
            )}

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
                    <label
                      htmlFor="instagram-handle"
                      className="mb-2 block text-sm font-semibold text-[#543448]"
                    >
                      Instagram username
                      <span className="ml-1 text-xs font-normal text-[#a88798]">
                        (optional)
                      </span>
                    </label>

                    <div className="flex h-13 items-center rounded-xl border border-[#edcfdb] bg-[#fffafd] px-3 transition focus-within:border-[#d84c91] focus-within:ring-2 focus-within:ring-[#d84c91]/15">
                      <span
                        aria-hidden="true"
                        className="mr-2 font-semibold text-[#c17a9a]"
                      >
                        @
                      </span>

                      <input
                        id="instagram-handle"
                        value={inputVal}
                        onChange={(event) =>
                          setInputVal(event.target.value.replace(/^@/, ''))
                        }
                        placeholder="yourusername"
                        className="min-w-0 flex-1 bg-transparent text-sm text-[#392235] outline-none placeholder:text-[#c2a9b6]"
                        autoComplete="off"
                      />
                    </div>

                    <p className="mt-2 text-xs leading-5 text-[#9a7185]">
                      Used only as optional context. The local review does not
                      look up this account.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="instagram-hashtags"
                      className="mb-2 block text-sm font-semibold text-[#543448]"
                    >
                      Hashtags from your post
                    </label>

                    <textarea
                      id="instagram-hashtags"
                      value={kwInput}
                      onChange={(event) => setKwInput(event.target.value)}
                      rows={4}
                      placeholder="#yourtopic #community #yourbrand"
                      className="min-h-[112px] w-full resize-y rounded-xl border border-[#edcfdb] bg-[#fffafd] px-3 py-3 text-sm text-[#392235] outline-none transition placeholder:text-[#c2a9b6] focus:border-[#d84c91] focus:ring-2 focus:ring-[#d84c91]/15"
                    />

                    <p className="mt-2 text-xs leading-5 text-[#9a7185]">
                      Separate hashtags with spaces or commas.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-13 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(213,57,130,0.20)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c33e87] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-52"
                >
                  {loading ? 'Reviewing hashtags…' : copy.buttonLabel}
                </button>

                {igResult && (
                  <section
                    className="overflow-hidden rounded-2xl border border-[#f0d3df] bg-[#fff9fc]"
                    aria-live="polite"
                    aria-label="Instagram hashtag review results"
                  >
                    <div className="flex flex-col gap-4 border-b border-[#f3e0e8] p-4 sm:flex-row sm:items-center sm:p-5">
                      <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-sm">
                        <div className="text-center">
                          <div className="text-2xl font-black leading-none">
                            {igResult.score}
                          </div>
                          <div className="mt-1 text-[9px] font-bold uppercase tracking-wide">
                            / 100
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ad5a80]">
                          LOCAL PATTERN SCORE
                        </p>

                        <h3 className="mt-1 text-lg font-bold text-[#392235]">
                          {igResult.hashtagVisibility === 'ok'
                            ? 'No configured matches found'
                            : igResult.hashtagVisibility === 'limited'
                              ? 'Some patterns need review'
                              : 'Multiple patterns need attention'}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-[#806b78]">
                          This score comes from the tool's local rules. It is
                          not an Instagram ranking, reach, or account-status
                          score.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5">
                      <h4 className="text-sm font-bold text-[#543448]">
                        Review findings
                      </h4>

                      <ul className="mt-3 space-y-2 text-sm leading-6 text-[#745d6c]">
                        {igResult.reasons?.map((reason, index) => (
                          <li
                            key={`${index}-${reason}`}
                            className="flex gap-2"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-[#f58529] to-[#dd2a7b]"
                            />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>

                      <p className="mt-4 rounded-xl border border-[#f1dce5] bg-white px-3 py-2.5 text-xs leading-5 text-[#896e7d]">
                        Important: a match in this reference list does not
                        prove that Instagram has banned a hashtag or restricted
                        your post. Check Instagram's own notices and guidance
                        before drawing conclusions.
                      </p>
                    </div>
                  </section>
                )}
              </form>
            )}

            {normalizedPlatform !== 'x' &&
              normalizedPlatform !== 'instagram' &&
              renderGeneric()}
          </div>

          <div
            className={`mt-4 rounded-2xl px-4 py-3 text-left ${
              isXPlatform
                ? 'border border-[#cbdce8] bg-white'
                : isInstagramPlatform
                  ? 'border border-[#f0d3df] bg-white'
                  : 'border border-stone-300/70 bg-white/60'
            }`}
          >
            <p className="text-xs leading-5 text-stone-600">
              {copy.limitation}
            </p>
          </div>

          <div className="mt-6">
            <AdBelowChecker />
          </div>
        </section>

        {/* How the checker works */}
        <section
          className="mx-auto mt-14 max-w-5xl"
          aria-labelledby="how-it-works-title"
        >
          <div className="mb-5 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">
              A clearer way to investigate
            </p>

            <h2
              id="how-it-works-title"
              className={`${fraunces.className} mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl`}
            >
              {isXPlatform
                ? 'How the X visibility check works'
                : isInstagramPlatform
                  ? 'How the Instagram hashtag checker works'
                  : 'Understand what the checker can tell you'}
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <article
              className={`rounded-2xl border p-5 ${
                isXPlatform
                  ? 'border-[#cbdce8] bg-white'
                  : isInstagramPlatform
                    ? 'border-[#f0d3df] bg-white'
                    : 'border-stone-200/90 bg-white/80'
              }`}
            >
              <span className="text-xs font-bold text-stone-400">
                01
              </span>

              <h3 className="mt-2 font-semibold text-stone-900">
                {isXPlatform
                  ? 'Check profile reachability'
                  : isInstagramPlatform
                    ? 'Paste your hashtag list'
                    : 'Choose a platform'}
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                {isXPlatform
                  ? 'The checker requests a public X profile endpoint without logging in. A response confirms endpoint availability, not normal account reach.'
                  : isInstagramPlatform
                    ? 'Copy the hashtags from a recent Instagram post and paste them into the review field. Your username is optional.'
                    : 'Select the network you want to review. Each tool explains whether it uses public signals or a local heuristic.'}
              </p>
            </article>

            <article
              className={`rounded-2xl border p-5 ${
                isXPlatform
                  ? 'border-[#cbdce8] bg-white'
                  : isInstagramPlatform
                    ? 'border-[#f0d3df] bg-white'
                    : 'border-stone-200/90 bg-white/80'
              }`}
            >
              <span className="text-xs font-bold text-stone-400">
                02
              </span>

              <h3 className="mt-2 font-semibold text-stone-900">
                {isXPlatform
                  ? 'Review limited recent search'
                  : isInstagramPlatform
                    ? 'Compare against local rules'
                    : 'Run the available check'}
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                {isXPlatform
                  ? 'A limited logged-out search checks whether a recent post from the username appears in returned results. It is not an exhaustive search.'
                  : isInstagramPlatform
                    ? 'The tool checks for configured reference-list matches, repeated hashtags, and lists containing more than 30 hashtags.'
                    : 'Enter the requested information. Never provide a social media password or login code.'}
              </p>
            </article>

            <article
              className={`rounded-2xl border p-5 ${
                isXPlatform
                  ? 'border-[#cbdce8] bg-white'
                  : isInstagramPlatform
                    ? 'border-[#f0d3df] bg-white'
                    : 'border-stone-200/90 bg-white/80'
              }`}
            >
              <span className="text-xs font-bold text-stone-400">
                03
              </span>

              <h3 className="mt-2 font-semibold text-stone-900">
                {isXPlatform
                  ? 'Inspect username suggestions'
                  : isInstagramPlatform
                    ? 'Read the pattern findings'
                    : 'Read the evidence'}
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                {isXPlatform
                  ? 'The checker reviews returned typeahead suggestions for the exact username. Missing suggestions alone do not establish an account restriction.'
                  : isInstagramPlatform
                    ? 'Review the local score and the reasons listed. Treat them as prompts for a closer look, not as an official Instagram verdict.'
                    : 'Review the signals, explanations, and limitations. An inconclusive result is not proof of a restriction.'}
              </p>
            </article>
          </div>
        </section>

        {/* Methodology and limitations */}
        <section
          className="mx-auto mt-14 max-w-5xl"
          aria-labelledby="methodology-title"
        >
          <div className="mb-6 max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">
              Methodology and limitations
            </p>

            <h2
              id="methodology-title"
              className={`${fraunces.className} mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl`}
            >
              What this{' '}
              {normalizedPlatform === 'x'
                ? 'X visibility check'
                : isInstagramPlatform
                  ? 'Instagram hashtag checker'
                  : `${normalizedPlatform} review`}{' '}
              can tell you
            </h2>

            <p className="mt-3 text-sm leading-7 text-stone-600 sm:text-base">
              {isInstagramPlatform
                ? 'This Instagram tool reviews only the hashtag text you submit. It applies a local reference list and simple pattern rules; it does not connect to Instagram or inspect account and post visibility.'
                : 'A visibility check is a limited diagnostic, not an official account-status decision. A missing search result, lower engagement, or an unavailable public endpoint does not by itself prove that a platform has restricted an account or post.'}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article
              className={`rounded-2xl border p-5 ${
                isXPlatform || isInstagramPlatform
                  ? isInstagramPlatform
                    ? 'border-[#f0d3df] bg-white'
                    : 'border-[#cbdce8] bg-white'
                  : 'border-stone-200 bg-white'
              }`}
            >
              <h3 className="text-base font-semibold text-stone-900">
                {normalizedPlatform === 'x'
                  ? 'What the X checker tests'
                  : isInstagramPlatform
                    ? 'What the Instagram review tests'
                    : `What the ${normalizedPlatform} review tests`}
              </h3>

              {normalizedPlatform === 'x' ? (
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  The X checker makes logged-out public requests to examine
                  profile endpoint reachability, whether a limited recent-search
                  query returns a post from the username, and whether the exact
                  username appears in the returned typeahead suggestions. These
                  are narrow observations from public endpoints. They do not
                  reveal every search, ranking, recommendation, or enforcement
                  decision made by X.
                </p>
              ) : isInstagramPlatform ? (
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  The Instagram review compares submitted hashtags with a
                  configured local reference list. It also checks whether
                  hashtags are repeated and whether more than 30 hashtags
                  were entered. It does not sign in to Instagram, query live
                  hashtag search results, inspect your account, or verify
                  whether a post is eligible for recommendations.
                </p>
              ) : (
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  This tool reviews only the text, tags, or keywords you
                  submit using local pattern rules. It does not connect to
                  {` ${normalizedPlatform}`}, inspect account analytics,
                  retrieve posts, or measure search and recommendation
                  distribution.
                </p>
              )}
            </article>

            <article
              className={`rounded-2xl border p-5 ${
                isInstagramPlatform
                  ? 'border-[#f0d3df] bg-white'
                  : isXPlatform
                    ? 'border-[#cbdce8] bg-white'
                    : 'border-stone-200 bg-white'
              }`}
            >
              <h3 className="text-base font-semibold text-stone-900">
                What the result cannot establish
              </h3>

              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-stone-600">
                <li>
                  It cannot prove that an account has been officially shadowbanned.
                </li>
                <li>
                  It cannot determine every ranking or recommendation decision.
                </li>
                <li>
                  It cannot explain a drop in views or engagement by itself.
                </li>
                <li>
                  An unavailable or malformed source must be treated as inconclusive.
                </li>
              </ul>
            </article>
          </div>

          <article
            className={`mt-4 rounded-2xl border p-5 sm:p-6 ${
              isInstagramPlatform
                ? 'border-[#f0d3df] bg-white'
                : isXPlatform
                  ? 'border-[#cbdce8] bg-white'
                  : 'border-stone-200 bg-white'
            }`}
          >
            <h3 className="text-base font-semibold text-stone-900">
              How to investigate a visibility problem
            </h3>

            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-stone-600">
              <li>
                Check the platform's own account-status notices, policy messages,
                and privacy settings.
              </li>
              <li>
                Compare more than one public post and, where appropriate,
                repeat the check later.
              </li>
              <li>
                Consider ordinary causes such as protected content, search
                relevance, deleted posts, indexing delays, or temporary
                service errors.
              </li>
              <li>
                Use the platform's official support or appeal process if it
                displays an account or content notice.
              </li>
            </ol>
          </article>
        </section>

        {/* Frequently asked questions */}
        <section
          className="mx-auto mt-14 max-w-5xl"
          aria-labelledby="faq-title"
        >
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
            <details
              className={`group rounded-xl border p-4 ${
                isInstagramPlatform
                  ? 'border-[#f0d3df] bg-white'
                  : isXPlatform
                    ? 'border-[#cbdce8] bg-white'
                    : 'border-stone-200 bg-white'
              }`}
            >
              <summary className="cursor-pointer list-none font-semibold text-stone-900">
                {isInstagramPlatform
                  ? 'Can this Instagram hashtag checker confirm that my account is shadowbanned?'
                  : 'Can this checker confirm that my account is shadowbanned?'}
              </summary>

              <p className="mt-3 text-sm leading-7 text-stone-600">
                {isInstagramPlatform
                  ? 'No. This tool checks the hashtag text you submit against local rules. It does not connect to Instagram, inspect your account, or test whether your posts appear in Instagram search or recommendations.'
                  : 'No. An independent public checker cannot confirm every platform restriction. It can report only the specific public signals or text patterns described in its methodology. Treat the result as a diagnostic clue, not an official platform verdict.'}
              </p>
            </details>

            <details
              className={`group rounded-xl border p-4 ${
                isInstagramPlatform
                  ? 'border-[#f0d3df] bg-white'
                  : isXPlatform
                    ? 'border-[#cbdce8] bg-white'
                    : 'border-stone-200 bg-white'
              }`}
            >
              <summary className="cursor-pointer list-none font-semibold text-stone-900">
                {isInstagramPlatform
                  ? 'Does a hashtag match prove that Instagram restricted my post?'
                  : 'Does low reach or low engagement prove a visibility restriction?'}
              </summary>

              <p className="mt-3 text-sm leading-7 text-stone-600">
                {isInstagramPlatform
                  ? 'No. A match means that a hashtag appears in this tool’s configured reference list. The list is not a live Instagram database or an official list of restricted hashtags. Review the context and Instagram’s own notices before drawing conclusions.'
                  : 'No. Reach and engagement can change for many reasons, including audience interest, posting frequency, content topic, competition, privacy settings, and recommendation systems. A metric by itself does not establish that an account has been restricted.'}
              </p>
            </details>

            <details
              className={`group rounded-xl border p-4 ${
                isInstagramPlatform
                  ? 'border-[#f0d3df] bg-white'
                  : isXPlatform
                    ? 'border-[#cbdce8] bg-white'
                    : 'border-stone-200 bg-white'
              }`}
            >
              <summary className="cursor-pointer list-none font-semibold text-stone-900">
                {isInstagramPlatform
                  ? 'What does a hashtag pattern match mean?'
                  : 'What does “signal not observed” mean?'}
              </summary>

              <p className="mt-3 text-sm leading-7 text-stone-600">
                {isInstagramPlatform
                  ? 'It means that one or more submitted hashtags matched entries in the local reference list, or that a configured list rule was triggered. It does not establish that Instagram has banned the hashtag or limited your content.'
                  : 'It means that a specific completed test did not return the expected public signal in that request. It does not explain why the signal was absent and does not, by itself, prove a restriction. If the source fails or returns an unexpected response, the result should be shown as unable to verify.'}
              </p>
            </details>

            <details
              className={`group rounded-xl border p-4 ${
                isInstagramPlatform
                  ? 'border-[#f0d3df] bg-white'
                  : isXPlatform
                    ? 'border-[#cbdce8] bg-white'
                    : 'border-stone-200 bg-white'
              }`}
            >
              <summary className="cursor-pointer list-none font-semibold text-stone-900">
                {isInstagramPlatform
                  ? 'Does this tool connect to my Instagram account?'
                  : 'Do I need to provide my social media password?'}
              </summary>

              <p className="mt-3 text-sm leading-7 text-stone-600">
                {isInstagramPlatform
                  ? 'No. The Instagram hashtag review runs against the text entered on this page and a local reference list. It does not request your Instagram password, login code, session cookie, or account access.'
                  : 'No. This checker does not ask for a social media password, login code, or session cookie. For X, the username is sent to the site’s checker endpoint for limited public lookups. The other pattern-review tools analyze the text you enter in this page. Review the Privacy Policy for details about server requests, logs, and retention.'}
              </p>
            </details>

            <details
              className={`group rounded-xl border p-4 ${
                isInstagramPlatform
                  ? 'border-[#f0d3df] bg-white'
                  : isXPlatform
                    ? 'border-[#cbdce8] bg-white'
                    : 'border-stone-200 bg-white'
              }`}
            >
              <summary className="cursor-pointer list-none font-semibold text-stone-900">
                {isInstagramPlatform
                  ? 'What should I do if my Instagram hashtags are not getting reach?'
                  : 'What should I do if the result is inconclusive?'}
              </summary>

              <p className="mt-3 text-sm leading-7 text-stone-600">
                {isInstagramPlatform
                  ? 'Review Instagram’s account-status information and current recommendation guidance. Check that your post and account are public where applicable, review the content itself, and compare results over time. Do not treat this local hashtag score as proof of a restriction.'
                  : 'Do not treat an inconclusive result as a restriction. Check the platform’s own account-status messages and help resources, review whether the content is public, and try again later if a temporary service problem prevented the check.'}
              </p>
            </details>
          </div>
        </section>

        {/* Official resources */}
        <section
          className={`mx-auto mt-10 max-w-5xl rounded-2xl border p-5 sm:p-6 ${
            isInstagramPlatform
              ? 'border-[#f0d3df] bg-white'
              : isXPlatform
                ? 'border-[#cbdce8] bg-white'
                : 'border-stone-200 bg-white/80'
          }`}
          aria-labelledby="official-resources-title"
        >
          <h2
            id="official-resources-title"
            className="text-base font-semibold text-stone-900"
          >
            Official resources
          </h2>

          <p className="mt-2 text-sm leading-6 text-stone-600">
            Use the platform's own help resources to verify account
            notices and understand search or content visibility.
          </p>

          <ul className="mt-3 space-y-2 text-sm">
            {normalizedPlatform === 'x' && (
              <>
                <li>
                  <a
                    className="font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 hover:text-violet-700"
                    href="https://help.x.com/en/using-x/x-search-not-working"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    X Help: Posts or hashtags not appearing in search
                  </a>
                </li>

                <li>
                  <a
                    className="font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 hover:text-violet-700"
                    href="https://help.x.com/en/rules-and-policies/x-search-policies"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    X Help: Search rules and restrictions
                  </a>
                </li>

                <li>
                  <a
                    className="font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 hover:text-violet-700"
                    href="https://help.x.com/en/safety-and-security/public-and-protected-posts"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    X Help: Public and protected posts
                  </a>
                </li>
              </>
            )}

            {normalizedPlatform === 'instagram' && (
              <li>
                <a
                  className="font-medium text-[#a33c6c] underline decoration-[#e9b7cb] underline-offset-4 hover:text-[#8134af]"
                  href="https://help.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram Help Center
                </a>
              </li>
            )}

            {normalizedPlatform === 'tiktok' && (
              <li>
                <a
                  className="font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 hover:text-violet-700"
                  href="https://support.tiktok.com/en/safety-hc/account-and-user-safety"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TikTok Help: Account and user safety
                </a>
              </li>
            )}

            {normalizedPlatform === 'reddit' && (
              <li>
                <a
                  className="font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 hover:text-violet-700"
                  href="https://support.reddithelp.com/hc/en-us/articles/360045734591-Account-status-overview"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Reddit Help: Account status overview
                </a>
              </li>
            )}

            <li>
              <Link
                className={`font-medium underline underline-offset-4 ${
                  isInstagramPlatform
                    ? 'text-[#a33c6c] decoration-[#e9b7cb] hover:text-[#8134af]'
                    : 'text-stone-800 decoration-stone-300 hover:text-violet-700'
                }`}
                href="/about"
              >
                Read how Shadowban.online works
              </Link>
            </li>

            <li>
              <Link
                className={`font-medium underline underline-offset-4 ${
                  isInstagramPlatform
                    ? 'text-[#a33c6c] decoration-[#e9b7cb] hover:text-[#8134af]'
                    : 'text-stone-800 decoration-stone-300 hover:text-violet-700'
                }`}
                href="/privacy"
              >
                Read the Privacy Policy
              </Link>
            </li>
          </ul>
        </section>

        {/* Independent service notice */}
        <section
          className={`mx-auto mt-8 max-w-5xl rounded-2xl border p-5 text-center sm:p-6 ${
            isInstagramPlatform
              ? 'border-[#f0d3df] bg-white'
              : isXPlatform
                ? 'border-[#cbdce8] bg-white'
                : 'border-stone-300/70 bg-white/60'
          }`}
        >
          <h2 className="font-semibold text-stone-900">
            Independent tool, not an official platform service
          </h2>

          <p className="mx-auto mt-2 max-w-3xl text-sm leading-6 text-stone-600">
            Shadowban.online is independent and is not affiliated with
            X, Instagram, TikTok, YouTube, Facebook, or Reddit.
            Platform names are used only to identify the services
            being discussed.
          </p>
        </section>

        <div className="mt-9 flex justify-center">
          <SupportUsButton />
        </div>

        <div className="mx-auto mt-8 max-w-3xl">
          <AlertButton
            handle={inputVal}
            platform={normalizedPlatform}
          />
        </div>
      </div>

      <SupportPopup
        isOpen={showSupport}
        onClose={() => setShowSupport(false)}
        isChecking={loading}
      />
    </main>
  )
}
