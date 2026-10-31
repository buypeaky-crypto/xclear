
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Fraunces, Sora } from "next/font/google";

import BrandHomeLink from "./BrandHomeLink";
import PlatformSwitcher from "./PlatformSwitcher";
import SupportUsButton from "./SupportUsButton";
import SupportPopup from "./SupportPopup";
import AdBelowChecker from "./AdBelowChecker";
import AlertButton from "../app/components/AlertButton";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

type YouTubeReview = {
  itemCount: number;
  hashtagCount: number;
  findings: string[];
};

function reviewYouTubeText(text: string): YouTubeReview {
  const items = text
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  const normalizedText = text.toLowerCase();
  const hashtagCount = (text.match(/#/g) ?? []).length;
  const findings: string[] = [];

  if (items.length > 15) {
    findings.push(
      `More than 15 separate tags or keywords were entered (${items.length}). Review whether each item is relevant.`,
    );
  }

  if (
    normalizedText.includes("sub4sub") ||
    normalizedText.includes("subscribe for subscribe") ||
    normalizedText.includes("follow for follow") ||
    normalizedText.includes("f4f")
  ) {
    findings.push(
      "A selected follow-or-subscription exchange phrase was found in the submitted text.",
    );
  }

  if (hashtagCount > 5) {
    findings.push(
      `More than five hashtag markers were found (${hashtagCount}). Review whether all hashtags are relevant to the video.`,
    );
  }

  return {
    itemCount: items.length,
    hashtagCount,
    findings,
  };
}

export default function YouTubeLanding({
  locale = "en",
}: {
  locale?: string;
}) {
  const [channelHandle, setChannelHandle] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [result, setResult] = useState<YouTubeReview | null>(null);
  const [error, setError] = useState("");
  const [showSupport, setShowSupport] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanText = tagsText.trim();

    if (!cleanText) {
      setError("Paste some YouTube tags or keywords before starting the review.");
      setResult(null);
      return;
    }

    setError("");
    setResult(reviewYouTubeText(cleanText));
    setShowSupport(true);
  }

  const hasFindings = result !== null && result.findings.length > 0;

  return (
    <main className={`${sora.className} min-h-screen bg-[#f7f7f8] pb-20 text-[#181818]`}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="flex min-h-[76px] items-center justify-between gap-4 border-b border-[#e5e5e5]">
          <BrandHomeLink />

          <span className="hidden items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-3 py-1.5 text-xs font-semibold text-[#606060] sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-[#ff0033]" />
            Free local text review
          </span>
        </header>

        {/* YouTube-specific hero */}
        <section className="mx-auto grid max-w-5xl items-center gap-8 pt-10 lg:grid-cols-[1.08fr_0.92fr] sm:pt-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#f0cbd2] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#c9002b]">
              <span className="grid h-5 w-6 place-items-center rounded-md bg-[#ff0033] text-[10px] font-black text-white">
                ▶
              </span>
              YOUTUBE CONTENT REVIEW
            </p>

            <h1 className={`${fraunces.className} mt-6 max-w-2xl text-4xl font-black leading-[1.05] tracking-tight text-[#181818] sm:text-5xl lg:text-6xl`}>
              YouTube Tag and Keyword Checker
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#606060] sm:text-base">
              Review video tags and keywords for selected text patterns
              before publishing. See which local rules match your submitted
              text, with no need to connect a YouTube account.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#e5e5e5] bg-white px-3 py-2 text-xs font-semibold text-[#505050]">
                No YouTube login
              </span>

              <span className="rounded-full border border-[#e5e5e5] bg-white px-3 py-2 text-xs font-semibold text-[#505050]">
                No password required
              </span>

              <span className="rounded-full border border-[#e5e5e5] bg-white px-3 py-2 text-xs font-semibold text-[#505050]">
                Local text analysis
              </span>
            </div>

            <a
              href="#youtube-review"
              className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#ff0033] px-6 py-3 text-sm font-bold text-white shadow-[0_7px_18px_rgba(255,0,51,0.18)] transition hover:bg-[#d9002b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff0033] focus-visible:ring-offset-2"
            >
              Review YouTube tags
              <span aria-hidden="true" className="ml-2">↓</span>
            </a>
          </div>

          <aside className="relative overflow-hidden rounded-[26px] border border-[#e5e5e5] bg-white p-5 shadow-[0_20px_55px_rgba(0,0,0,0.06)] sm:p-6">
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-[#ff0033]/10 blur-3xl"
            />

            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#d9002b]">
                    METADATA TEXT REVIEW
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-[#181818]">
                    What gets reviewed?
                  </h2>
                </div>

                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#ff0033] text-lg font-black text-white shadow-sm">
                  ▶
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex gap-3 border-b border-[#eeeeee] pb-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#fff0f2] text-xs font-black text-[#e0002d]">
                    01
                  </span>

                  <div>
                    <h3 className="text-sm font-semibold text-[#181818]">
                      Tag and keyword volume
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#606060]">
                      Counts the separate items in your submitted text and
                      flags lists containing more than 15 items.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 border-b border-[#eeeeee] pb-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#fff0f2] text-xs font-black text-[#e0002d]">
                    02
                  </span>

                  <div>
                    <h3 className="text-sm font-semibold text-[#181818]">
                      Hashtag markers
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#606060]">
                      Counts hashtag symbols and flags submissions containing
                      more than five.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#fff0f2] text-xs font-black text-[#e0002d]">
                    03
                  </span>

                  <div>
                    <h3 className="text-sm font-semibold text-[#181818]">
                      Selected exchange phrases
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#606060]">
                      Looks for configured phrases such as sub4sub and
                      follow for follow.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-5 border-t border-[#eeeeee] pt-4 text-xs leading-5 text-[#777777]">
                This checker does not connect to YouTube or inspect channel
                status, search rankings, watch time, or video recommendations.
              </p>
            </div>
          </aside>
        </section>

        <div className="mt-8 flex justify-center">
          <PlatformSwitcher activePlatform="youtube" locale={locale} />
        </div>

        {/* YouTube text checker */}
        <section
          id="youtube-review"
          className="mx-auto mt-8 max-w-4xl scroll-mt-8"
          aria-labelledby="youtube-review-title"
        >
          <div className="overflow-hidden rounded-[28px] border border-[#e5e5e5] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.07)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eeeeee] bg-[#fafafa] p-5 sm:p-7">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#d9002b]">
                  LOCAL CONTENT REVIEW
                </p>

                <h2
                  id="youtube-review-title"
                  className="mt-1 text-xl font-bold tracking-tight text-[#181818]"
                >
                  Review your YouTube tags and keywords
                </h2>

                <p className="mt-1 text-xs text-[#777777]">
                  Add an optional channel handle and paste your text below.
                </p>
              </div>

              <span className="rounded-full bg-[#fff0f2] px-3 py-1.5 text-xs font-bold text-[#c9002b]">
                Free · No login
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-7">
              <div>
                <label
                  htmlFor="youtube-channel-handle"
                  className="mb-2 block text-sm font-semibold text-[#303030]"
                >
                  YouTube channel handle
                  <span className="ml-1 font-normal text-[#888888]">
                    (optional)
                  </span>
                </label>

                <input
                  id="youtube-channel-handle"
                  type="text"
                  value={channelHandle}
                  onChange={(event) => setChannelHandle(event.target.value)}
                  maxLength={100}
                  placeholder="@yourchannel"
                  autoComplete="off"
                  className="h-12 w-full rounded-xl border border-[#dddddd] bg-white px-3 text-sm text-[#181818] outline-none transition placeholder:text-[#999999] focus:border-[#ff0033] focus:ring-2 focus:ring-[#ff0033]/15"
                />

                <p className="mt-2 text-xs leading-5 text-[#888888]">
                  Optional context only. This tool does not look up the
                  channel or retrieve its videos.
                </p>
              </div>

              <div>
                <label
                  htmlFor="youtube-tags-text"
                  className="mb-2 block text-sm font-semibold text-[#303030]"
                >
                  Video tags, hashtags, or keywords
                  <span className="ml-1 text-[#d9002b]">*</span>
                </label>

                <textarea
                  id="youtube-tags-text"
                  value={tagsText}
                  onChange={(event) => setTagsText(event.target.value)}
                  required
                  maxLength={6000}
                  rows={7}
                  placeholder="Example: video topic, tutorial, #YouTube, #creator"
                  className="min-h-[170px] w-full resize-y rounded-xl border border-[#dddddd] bg-white px-3 py-3 text-sm leading-6 text-[#181818] outline-none transition placeholder:text-[#999999] focus:border-[#ff0033] focus:ring-2 focus:ring-[#ff0033]/15"
                />

                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#888888]">
                  <span>Up to 6,000 characters</span>
                  <span>{tagsText.length} / 6,000</span>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#ff0033] px-6 py-3 text-sm font-bold text-white shadow-[0_7px_18px_rgba(255,0,51,0.16)] transition hover:bg-[#d9002b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff0033] focus-visible:ring-offset-2 sm:w-auto sm:min-w-52"
              >
                Review YouTube text
              </button>

              <p className="text-xs leading-5 text-[#888888]">
                Your submitted text is reviewed with local rules in this
                page. It is not sent to YouTube for channel or video analysis.
              </p>
            </form>
          </div>

          {result && (
            <section
              aria-live="polite"
              aria-label="YouTube text review results"
              className="mt-5 overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white shadow-sm"
            >
              <div className="flex flex-col gap-3 border-b border-[#eeeeee] bg-[#fafafa] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#d9002b]">
                    LOCAL REVIEW COMPLETE
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-[#181818]">
                    {hasFindings
                      ? "Some text patterns need review"
                      : "No configured patterns found"}
                  </h3>

                  {channelHandle.trim() && (
                    <p className="mt-1 text-xs text-[#777777]">
                      Channel context: {channelHandle.trim()}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex w-fit rounded-full bg-[#f1f1f1] px-3 py-1.5 text-xs font-bold text-[#505050]">
                    {result.itemCount} items
                  </span>

                  <span className="inline-flex w-fit rounded-full bg-[#fff0f2] px-3 py-1.5 text-xs font-bold text-[#c9002b]">
                    {result.hashtagCount} hashtags
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h4 className="text-sm font-bold text-[#303030]">
                  Review findings
                </h4>

                {hasFindings ? (
                  <ul className="mt-3 space-y-3 text-sm leading-6 text-[#505050]">
                    {result.findings.map((finding, index) => (
                      <li key={`${index}-${finding}`} className="flex gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ff0033]"
                        />
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-[#505050]">
                    None of the configured text patterns were found in
                    this submission. This does not mean that YouTube has
                    reviewed or approved the content.
                  </p>
                )}

                <p className="mt-5 rounded-xl border border-[#eeeeee] bg-[#fafafa] p-4 text-xs leading-5 text-[#666666]">
                  This is a local text-pattern result, not a YouTube
                  channel-health, search-ranking, recommendation, or
                  shadowban score. A pattern match does not prove that
                  YouTube has restricted your channel or video.
                </p>
              </div>
            </section>
          )}

          <div className="mt-4 rounded-2xl border border-[#e5e5e5] bg-white px-4 py-3">
            <p className="text-xs leading-5 text-[#666666]">
              Important: this checker does not connect to YouTube, retrieve
              YouTube Studio analytics, inspect video visibility, or measure
              search and recommendation distribution.
            </p>
          </div>

          <div className="mt-5">
            <AdBelowChecker />
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto mt-16 max-w-5xl">
          <div className="mb-6 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d9002b]">
              Simple review process
            </p>

            <h2 className={`${fraunces.className} mt-2 text-2xl font-bold text-[#181818] sm:text-3xl`}>
              How the YouTube tag checker works
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Enter your tags",
                body: "Paste video tags, hashtags, or keywords. Your channel handle is optional.",
              },
              {
                number: "02",
                title: "Run local rules",
                body: "The checker counts submitted items and hashtag markers and looks for selected exchange phrases.",
              },
              {
                number: "03",
                title: "Read the findings",
                body: "See which configured patterns matched. Use the findings as a text review, not a channel-status diagnosis.",
              },
            ].map((item) => (
              <article
                key={item.number}
                className="rounded-2xl border border-[#e5e5e5] bg-white p-5 shadow-sm"
              >
                <span className="text-xs font-black text-[#ff0033]">
                  {item.number}
                </span>

                <h3 className="mt-3 font-bold text-[#181818]">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#666666]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Methodology and limitations */}
        <section className="mx-auto mt-16 max-w-5xl">
          <div className="mb-6 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d9002b]">
              Methodology and limitations
            </p>

            <h2 className={`${fraunces.className} mt-2 text-2xl font-bold text-[#181818] sm:text-3xl`}>
              What this YouTube checker actually checks
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#606060]">
              This is a local text-pattern review. It examines only the
              tags and keywords you paste into the form and applies a
              small set of configured rules. It does not access YouTube
              or inspect account-specific information.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-[#e5e5e5] bg-white p-5">
              <h3 className="font-bold text-[#181818]">
                What the tool checks
              </h3>

              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[#666666]">
                <li>Number of separated tags or keywords.</li>
                <li>Whether the text contains more than five hashtag markers.</li>
                <li>Selected follow-or-subscription exchange phrases.</li>
              </ul>
            </article>

            <article className="rounded-2xl border border-[#e5e5e5] bg-white p-5">
              <h3 className="font-bold text-[#181818]">
                What the tool cannot check
              </h3>

              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[#666666]">
                <li>YouTube channel strikes or account restrictions.</li>
                <li>YouTube Studio analytics, impressions, or click-through rate.</li>
                <li>Video search positions or Shorts feed distribution.</li>
                <li>Recommendation eligibility or an official shadowban.</li>
              </ul>
            </article>
          </div>

          <article className="mt-4 rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
            <h3 className="font-bold text-[#181818]">
              What to do if your YouTube views have dropped
            </h3>

            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-[#666666]">
              <li>
                Review channel and video notifications in YouTube Studio.
              </li>
              <li>
                Check whether the affected video is public and available
                to viewers.
              </li>
              <li>
                Compare impressions, click-through rate, and audience
                retention across several videos.
              </li>
              <li>
                When investigating search visibility, search for the
                specific video using its video ID.
              </li>
              <li>
                Review YouTube's official help resources if a policy
                notice or restriction appears.
              </li>
            </ol>
          </article>
        </section>

        {/* FAQs */}
        <section className="mx-auto mt-16 max-w-5xl">
          <div className="mb-6 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d9002b]">
              Questions and answers
            </p>

            <h2 className={`${fraunces.className} mt-2 text-2xl font-bold text-[#181818] sm:text-3xl`}>
              YouTube visibility checker FAQs
            </h2>
          </div>

          <div className="space-y-3">
            <details className="group rounded-xl border border-[#e5e5e5] bg-white p-4">
              <summary className="cursor-pointer list-none font-semibold text-[#181818]">
                Can this checker confirm that my YouTube channel is shadowbanned?
              </summary>

              <p className="mt-3 text-sm leading-7 text-[#666666]">
                No. It reviews only the tags and keywords you submit using
                local rules. It does not connect to YouTube, inspect channel
                status, or measure search and recommendation distribution.
              </p>
            </details>

            <details className="group rounded-xl border border-[#e5e5e5] bg-white p-4">
              <summary className="cursor-pointer list-none font-semibold text-[#181818]">
                Does this tool check my YouTube channel or videos?
              </summary>

              <p className="mt-3 text-sm leading-7 text-[#666666]">
                No. The optional channel handle is context only. The checker
                does not retrieve channel details, video information, or
                YouTube Studio analytics.
              </p>
            </details>

            <details className="group rounded-xl border border-[#e5e5e5] bg-white p-4">
              <summary className="cursor-pointer list-none font-semibold text-[#181818]">
                Can too many tags cause a YouTube restriction?
              </summary>

              <p className="mt-3 text-sm leading-7 text-[#666666]">
                This tool only flags text that exceeds its own configured
                item-count rule. That local finding is not a YouTube policy
                decision. Review YouTube's current metadata policies for
                authoritative guidance.
              </p>
            </details>

            <details className="group rounded-xl border border-[#e5e5e5] bg-white p-4">
              <summary className="cursor-pointer list-none font-semibold text-[#181818]">
                Why might a new YouTube video not appear in search?
              </summary>

              <p className="mt-3 text-sm leading-7 text-[#666666]">
                YouTube explains that newly created channels, videos, or
                changed handles can take time to appear in search. Search
                results also depend on relevance and other ranking factors.
              </p>
            </details>

            <details className="group rounded-xl border border-[#e5e5e5] bg-white p-4">
              <summary className="cursor-pointer list-none font-semibold text-[#181818]">
                Where can I check YouTube channel restrictions?
              </summary>

              <p className="mt-3 text-sm leading-7 text-[#666666]">
                Start with YouTube Studio and the official notifications
                shown for your channel or videos. Use YouTube's own appeal
                options when a specific policy decision appears incorrect.
              </p>
            </details>

            <details className="group rounded-xl border border-[#e5e5e5] bg-white p-4">
              <summary className="cursor-pointer list-none font-semibold text-[#181818]">
                Do I need to provide my YouTube password?
              </summary>

              <p className="mt-3 text-sm leading-7 text-[#666666]">
                No. This independent text review does not ask for your
                YouTube password, login code, session cookie, or account access.
              </p>
            </details>
          </div>
        </section>

        {/* Official resources */}
        <section className="mx-auto mt-12 max-w-5xl rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-[#181818]">
            Official YouTube resources
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#666666]">
            Use YouTube's own documentation and Studio tools for
            authoritative information about metadata, search visibility,
            channel status, and video performance.
          </p>

          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href="https://support.google.com/youtube/answer/146402?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#d9002b] underline decoration-[#f0aab7] underline-offset-4 hover:text-[#a90022]"
              >
                YouTube Help: Add tags to your videos ↗
              </a>
            </li>

            <li>
              <a
                href="https://support.google.com/youtube/answer/58097?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#d9002b] underline decoration-[#f0aab7] underline-offset-4 hover:text-[#a90022]"
              >
                YouTube Help: Video not appearing in search results ↗
              </a>
            </li>

            <li>
              <a
                href="https://support.google.com/youtube/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#d9002b] underline decoration-[#f0aab7] underline-offset-4 hover:text-[#a90022]"
              >
                YouTube Help Center ↗
              </a>
            </li>

            <li>
              <Link
                href="/about"
                className="font-semibold text-[#d9002b] underline decoration-[#f0aab7] underline-offset-4 hover:text-[#a90022]"
              >
                How Shadowban.online works
              </Link>
            </li>

            <li>
              <Link
                href="/privacy"
                className="font-semibold text-[#d9002b] underline decoration-[#f0aab7] underline-offset-4 hover:text-[#a90022]"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </section>

        <section className="mx-auto mt-8 max-w-5xl rounded-2xl border border-[#e5e5e5] bg-white p-5 text-center sm:p-6">
          <h2 className="font-bold text-[#181818]">
            Independent tool, not an official YouTube service
          </h2>

          <p className="mx-auto mt-2 max-w-3xl text-sm leading-6 text-[#666666]">
            Shadowban.online is independent and is not affiliated with,
            endorsed by, or operated by YouTube or Google. YouTube names
            and trademarks are used only to identify the service being
            discussed.
          </p>
        </section>

        <div className="mt-9 flex justify-center">
          <SupportUsButton />
        </div>

        {channelHandle.trim() && (
          <AlertButton handle={channelHandle.trim()} platform="youtube" />
        )}
      </div>

      <SupportPopup
        isOpen={showSupport}
        onClose={() => setShowSupport(false)}
        isChecking={false}
      />
    </main>
  );
}
