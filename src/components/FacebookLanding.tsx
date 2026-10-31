
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

type FacebookReview = {
  pageName: string;
  termCount: number;
  reasons: string[];
  score: number;
};

function reviewFacebookText(text: string, pageName: string): FacebookReview {
  const terms = text
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  const normalizedText = terms.join(" ").toLowerCase();
  const reasons: string[] = [];
  let score = 100;

  if (terms.length > 15) {
    score -= 20;
    reasons.push(
      `More than 15 terms were entered (${terms.length}). Review whether every term is necessary.`,
    );
  }

  if (
    normalizedText.includes("sub4sub") ||
    normalizedText.includes("follow for follow") ||
    normalizedText.includes("f4f")
  ) {
    score -= 40;
    reasons.push(
      "A follow-exchange phrase was found in the submitted text.",
    );
  }

  if (terms.length === 0) {
    reasons.push("Enter some post text or keywords to review.");
  } else {
    reasons.push(
      `${terms.length} submitted term(s) were reviewed using local rules.`,
    );
  }

  if (score > 70) {
    reasons.push(
      "No additional configured text patterns were identified.",
    );
  } else {
    reasons.push(
      "Review the patterns above before publishing this content.",
    );
  }

  return {
    pageName,
    termCount: terms.length,
    reasons,
    score: Math.max(0, score),
  };
}

export default function FacebookLanding() {
  const [pageName, setPageName] = useState("");
  const [postText, setPostText] = useState("");
  const [result, setResult] = useState<FacebookReview | null>(null);
  const [error, setError] = useState("");
  const [showSupport, setShowSupport] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanText = postText.trim();
    const cleanPageName = pageName.trim();

    if (!cleanText) {
      setError("Paste some Facebook post text or keywords first.");
      setResult(null);
      return;
    }

    setError("");
    setResult(reviewFacebookText(cleanText, cleanPageName));
    setShowSupport(true);
  }

  const isCleanReview = result !== null && result.score > 70;

  return (
    <main className={`${sora.className} min-h-screen bg-[#edf4ff] pb-20 text-[#172b4d]`}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="flex min-h-[76px] items-center justify-between gap-4 border-b border-[#d2e1f6]">
          <BrandHomeLink />

          <span className="hidden items-center gap-2 rounded-full border border-[#cbdcf3] bg-white px-3 py-1.5 text-xs font-semibold text-[#38577d] sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-[#1877f2]" />
            Free local text review
          </span>
        </header>

        {/* Facebook-specific hero */}
        <section className="mx-auto grid max-w-5xl items-center gap-8 pt-10 lg:grid-cols-[1.08fr_0.92fr] sm:pt-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#c7daf5] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1765c1]">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1877f2] text-sm font-black text-white">
                f
              </span>
              FACEBOOK CONTENT REVIEW
            </p>

            <h1 className={`${fraunces.className} mt-6 max-w-2xl text-4xl font-black leading-[1.05] tracking-tight text-[#102a4c] sm:text-5xl lg:text-6xl`}>
              Facebook Content Pattern Checker
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#536b8c] sm:text-base">
              Review Facebook post captions, Page text, and keywords for
              selected engagement-bait and follow-exchange patterns. Get
              a clear explanation of the local text checks.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#cbdcf3] bg-white px-3 py-2 text-xs font-semibold text-[#38577d]">
                No Facebook login
              </span>

              <span className="rounded-full border border-[#cbdcf3] bg-white px-3 py-2 text-xs font-semibold text-[#38577d]">
                No password required
              </span>

              <span className="rounded-full border border-[#cbdcf3] bg-white px-3 py-2 text-xs font-semibold text-[#38577d]">
                Local text analysis
              </span>
            </div>

            <a
              href="#facebook-review"
              className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#1877f2] px-6 py-3 text-sm font-bold text-white shadow-[0_7px_18px_rgba(24,119,242,0.20)] transition hover:bg-[#1266d6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877f2] focus-visible:ring-offset-2"
            >
              Review Facebook text
              <span aria-hidden="true" className="ml-2">↓</span>
            </a>
          </div>

          <aside className="relative overflow-hidden rounded-[26px] border border-[#cbdcf3] bg-white p-5 shadow-[0_20px_55px_rgba(35,83,145,0.10)] sm:p-6">
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-[#1877f2]/10 blur-3xl"
            />

            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#4285d4]">
                    PAGE &amp; POST REVIEW
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-[#172b4d]">
                    What gets reviewed?
                  </h2>
                </div>

                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1877f2] text-2xl font-black text-white shadow-sm">
                  f
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex gap-3 border-b border-[#e8eff9] pb-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#e9f2ff] text-xs font-black text-[#1877f2]">
                    01
                  </span>

                  <div>
                    <h3 className="text-sm font-semibold text-[#172b4d]">
                      Follow-exchange phrases
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#627b9c]">
                      Checks for selected phrases such as follow for follow
                      and sub4sub.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 border-b border-[#e8eff9] pb-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#e9f2ff] text-xs font-black text-[#1877f2]">
                    02
                  </span>

                  <div>
                    <h3 className="text-sm font-semibold text-[#172b4d]">
                      Text volume
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#627b9c]">
                      Flags submitted text containing more than 15
                      separated terms.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#e9f2ff] text-xs font-black text-[#1877f2]">
                    03
                  </span>

                  <div>
                    <h3 className="text-sm font-semibold text-[#172b4d]">
                      Local rule findings
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#627b9c]">
                      Explains which configured text patterns were found
                      in your submission.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-5 border-t border-[#e8eff9] pt-4 text-xs leading-5 text-[#7186a2]">
                This tool does not connect to Facebook or inspect account
                status, Page Insights, reach, or recommendation distribution.
              </p>
            </div>
          </aside>
        </section>

        <div className="mt-8 flex justify-center">
          <PlatformSwitcher activePlatform="facebook" locale="en" />
        </div>

        {/* Facebook text checker */}
        <section
          id="facebook-review"
          className="mx-auto mt-8 max-w-4xl scroll-mt-8"
          aria-labelledby="facebook-review-title"
        >
          <div className="overflow-hidden rounded-[28px] border border-[#cbdcf3] bg-white shadow-[0_20px_60px_rgba(35,83,145,0.10)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e4edf9] bg-[#f8fbff] p-5 sm:p-7">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#4285d4]">
                  LOCAL CONTENT REVIEW
                </p>

                <h2
                  id="facebook-review-title"
                  className="mt-1 text-xl font-bold tracking-tight text-[#172b4d]"
                >
                  Review your Facebook post text
                </h2>

                <p className="mt-1 text-xs text-[#7186a2]">
                  Paste a caption or keyword list below.
                </p>
              </div>

              <span className="rounded-full bg-[#e9f2ff] px-3 py-1.5 text-xs font-bold text-[#1765c1]">
                Free · No login
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-7">
              <div>
                <label
                  htmlFor="facebook-page-name"
                  className="mb-2 block text-sm font-semibold text-[#29466e]"
                >
                  Facebook Page or profile name
                  <span className="ml-1 font-normal text-[#8498b3]">
                    (optional)
                  </span>
                </label>

                <input
                  id="facebook-page-name"
                  type="text"
                  value={pageName}
                  onChange={(event) => setPageName(event.target.value)}
                  maxLength={80}
                  placeholder="Your Page or profile name"
                  autoComplete="off"
                  className="h-12 w-full rounded-xl border border-[#cbdcf3] bg-[#fbfdff] px-3 text-sm text-[#172b4d] outline-none transition placeholder:text-[#9aabc1] focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/15"
                />

                <p className="mt-2 text-xs leading-5 text-[#8498b3]">
                  This is optional context only. The tool does not look up
                  this Page or profile.
                </p>
              </div>

              <div>
                <label
                  htmlFor="facebook-post-text"
                  className="mb-2 block text-sm font-semibold text-[#29466e]"
                >
                  Recent post text, caption, or keywords
                  <span className="ml-1 text-[#d33b45]">*</span>
                </label>

                <textarea
                  id="facebook-post-text"
                  value={postText}
                  onChange={(event) => setPostText(event.target.value)}
                  required
                  maxLength={6000}
                  rows={7}
                  placeholder="Paste your Facebook post caption or keywords here..."
                  className="min-h-[170px] w-full resize-y rounded-xl border border-[#cbdcf3] bg-[#fbfdff] px-3 py-3 text-sm leading-6 text-[#172b4d] outline-none transition placeholder:text-[#9aabc1] focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/15"
                />

                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#8498b3]">
                  <span>Up to 6,000 characters</span>
                  <span>{postText.length} / 6,000</span>
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
                className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#1877f2] px-6 py-3 text-sm font-bold text-white shadow-[0_7px_18px_rgba(24,119,242,0.18)] transition hover:bg-[#1266d6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877f2] focus-visible:ring-offset-2 sm:w-auto sm:min-w-52"
              >
                Review Facebook text
              </button>

              <p className="text-xs leading-5 text-[#8498b3]">
                Your submitted text is reviewed with local rules in this
                page. It is not sent to Facebook for account or reach analysis.
              </p>
            </form>
          </div>

          {result && (
            <section
              aria-live="polite"
              aria-label="Facebook text review results"
              className="mt-5 overflow-hidden rounded-2xl border border-[#cbdcf3] bg-white shadow-sm"
            >
              <div className="flex flex-col gap-3 border-b border-[#e4edf9] bg-[#f8fbff] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#4285d4]">
                    LOCAL REVIEW COMPLETE
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-[#172b4d]">
                    {isCleanReview
                      ? "No configured patterns found"
                      : "Some patterns need review"}
                  </h3>

                  {result.pageName && (
                    <p className="mt-1 text-xs text-[#7186a2]">
                      Context: {result.pageName}
                    </p>
                  )}
                </div>

                <span className="inline-flex w-fit rounded-full bg-[#e9f2ff] px-3 py-1.5 text-xs font-bold text-[#1765c1]">
                  {result.termCount} terms reviewed
                </span>
              </div>

              <div className="p-5">
                <h4 className="text-sm font-bold text-[#29466e]">
                  Review findings
                </h4>

                <ul className="mt-3 space-y-3 text-sm leading-6 text-[#536b8c]">
                  {result.reasons.map((reason, index) => (
                    <li key={`${index}-${reason}`} className="flex gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#1877f2]"
                      />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-5 rounded-xl border border-[#d9e7fa] bg-[#f5f9ff] p-4 text-xs leading-5 text-[#627b9c]">
                  This is a local text-pattern result, not a Facebook
                  account-status, Page-health, reach, or shadowban score.
                  A pattern match does not prove that Facebook has restricted
                  your content.
                </p>
              </div>
            </section>
          )}

          <div className="mt-4 rounded-2xl border border-[#cbdcf3] bg-white px-4 py-3">
            <p className="text-xs leading-5 text-[#627b9c]">
              Important: this tool does not connect to Facebook, retrieve
              Page Insights, inspect comments, or measure distribution.
              Use Facebook's own account and support tools for account-specific
              information.
            </p>
          </div>

          <div className="mt-5">
            <AdBelowChecker />
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto mt-16 max-w-5xl">
          <div className="mb-6 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4285d4]">
              Simple review process
            </p>

            <h2 className={`${fraunces.className} mt-2 text-2xl font-bold text-[#172b4d] sm:text-3xl`}>
              How the Facebook text checker works
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Enter your post text",
                body: "Paste a Facebook caption, post text, or keyword list. The Page or profile name is optional.",
              },
              {
                number: "02",
                title: "Review local patterns",
                body: "The tool checks selected follow-exchange phrases and whether more than 15 terms were submitted.",
              },
              {
                number: "03",
                title: "Read the findings",
                body: "Review the reasons shown and decide whether the content needs a closer look before publishing.",
              },
            ].map((item) => (
              <article
                key={item.number}
                className="rounded-2xl border border-[#cbdcf3] bg-white p-5 shadow-sm"
              >
                <span className="text-xs font-black text-[#1877f2]">
                  {item.number}
                </span>

                <h3 className="mt-3 font-bold text-[#172b4d]">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#627b9c]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section className="mx-auto mt-16 max-w-5xl">
          <div className="mb-6 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4285d4]">
              Methodology and limitations
            </p>

            <h2 className={`${fraunces.className} mt-2 text-2xl font-bold text-[#172b4d] sm:text-3xl`}>
              What this Facebook checker actually checks
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#536b8c]">
              This is a local text-pattern review. It examines only the
              text you paste into the form and applies a small set of
              configured rules. It does not access Facebook or inspect
              account-specific information.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-[#cbdcf3] bg-white p-5">
              <h3 className="font-bold text-[#172b4d]">
                What the tool checks
              </h3>

              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[#627b9c]">
                <li>Selected follow-exchange phrases.</li>
                <li>Submissions containing more than 15 separated terms.</li>
                <li>The number of terms included in the review.</li>
              </ul>
            </article>

            <article className="rounded-2xl border border-[#cbdcf3] bg-white p-5">
              <h3 className="font-bold text-[#172b4d]">
                What the tool cannot check
              </h3>

              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[#627b9c]">
                <li>Facebook account restrictions or Account Status.</li>
                <li>Page Insights, impressions, reach, or engagement analytics.</li>
                <li>Comment visibility or post distribution.</li>
                <li>Recommendation eligibility or an official shadowban.</li>
              </ul>
            </article>
          </div>

          <article className="mt-4 rounded-2xl border border-[#cbdcf3] bg-white p-5 sm:p-6">
            <h3 className="font-bold text-[#172b4d]">
              What to do if your Facebook reach has dropped
            </h3>

            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-[#627b9c]">
              <li>
                Review Account Status and Support Inbox in Facebook.
              </li>
              <li>
                Look for any policy, content, or recommendation notices
                shown for your profile or Page.
              </li>
              <li>
                Compare multiple posts and review the audience information
                available in your own Page tools.
              </li>
              <li>
                Check whether the affected content is public and available
                to the intended audience.
              </li>
              <li>
                Use Facebook's official review or appeal options if a
                specific decision appears incorrect.
              </li>
            </ol>
          </article>
        </section>

        {/* Frequently asked questions */}
        <section className="mx-auto mt-16 max-w-5xl">
          <div className="mb-6 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4285d4]">
              Questions and answers
            </p>

            <h2 className={`${fraunces.className} mt-2 text-2xl font-bold text-[#172b4d] sm:text-3xl`}>
              Facebook visibility checker FAQs
            </h2>
          </div>

          <div className="space-y-3">
            <details className="group rounded-xl border border-[#cbdcf3] bg-white p-4">
              <summary className="cursor-pointer list-none font-semibold text-[#172b4d]">
                Can this Facebook checker confirm that my Page is shadowbanned?
              </summary>

              <p className="mt-3 text-sm leading-7 text-[#627b9c]">
                No. This tool reviews only the text you submit using local
                rules. It does not connect to Facebook, inspect Page status,
                or measure reach and distribution.
              </p>
            </details>

            <details className="group rounded-xl border border-[#cbdcf3] bg-white p-4">
              <summary className="cursor-pointer list-none font-semibold text-[#172b4d]">
                Does this checker access Facebook Page Insights?
              </summary>

              <p className="mt-3 text-sm leading-7 text-[#627b9c]">
                No. It does not request Facebook login details or access
                Page Insights, account analytics, comments, or private
                distribution information.
              </p>
            </details>

            <details className="group rounded-xl border border-[#cbdcf3] bg-white p-4">
              <summary className="cursor-pointer list-none font-semibold text-[#172b4d]">
                Does a drop in Facebook reach prove a shadowban?
              </summary>

              <p className="mt-3 text-sm leading-7 text-[#627b9c]">
                No. Reach can change for many reasons, including audience
                activity, content format, posting frequency, and recommendation
                systems. A change in metrics by itself does not establish
                an account restriction.
              </p>
            </details>

            <details className="group rounded-xl border border-[#cbdcf3] bg-white p-4">
              <summary className="cursor-pointer list-none font-semibold text-[#172b4d]">
                What does a follow-exchange phrase match mean?
              </summary>

              <p className="mt-3 text-sm leading-7 text-[#627b9c]">
                It means that the text you entered contains one of the
                selected phrases configured in this tool, such as
                follow for follow or sub4sub. It is a text-pattern finding,
                not an official Facebook moderation decision.
              </p>
            </details>

            <details className="group rounded-xl border border-[#cbdcf3] bg-white p-4">
              <summary className="cursor-pointer list-none font-semibold text-[#172b4d]">
                Where should I check Facebook account or Page restrictions?
              </summary>

              <p className="mt-3 text-sm leading-7 text-[#627b9c]">
                Start with Facebook's own Account Status, Support Inbox,
                Page tools, and any policy or recommendation notices
                shown for the affected profile or Page.
              </p>
            </details>

            <details className="group rounded-xl border border-[#cbdcf3] bg-white p-4">
              <summary className="cursor-pointer list-none font-semibold text-[#172b4d]">
                Do I need to provide my Facebook password?
              </summary>

              <p className="mt-3 text-sm leading-7 text-[#627b9c]">
                No. This independent text review does not ask for your
                Facebook password, login code, session cookie, or account
                access.
              </p>
            </details>
          </div>
        </section>

        {/* Official resources */}
        <section className="mx-auto mt-12 max-w-5xl rounded-2xl border border-[#cbdcf3] bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-[#172b4d]">
            Official Facebook resources
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#627b9c]">
            Use Facebook and Meta's own resources for account-specific
            notices, Page information, and content recommendation guidance.
          </p>

          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href="https://www.facebook.com/help/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#1765c1] underline decoration-[#9dc2f3] underline-offset-4 hover:text-[#0e4e9c]"
              >
                Facebook Help Center ↗
              </a>
            </li>

            <li>
              <a
                href="https://about.fb.com/news/2020/08/recommendation-guidelines/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#1765c1] underline decoration-[#9dc2f3] underline-offset-4 hover:text-[#0e4e9c]"
              >
                Meta recommendation guidelines ↗
              </a>
            </li>

            <li>
              <Link
                href="/about"
                className="font-semibold text-[#1765c1] underline decoration-[#9dc2f3] underline-offset-4 hover:text-[#0e4e9c]"
              >
                How Shadowban.online works
              </Link>
            </li>

            <li>
              <Link
                href="/privacy"
                className="font-semibold text-[#1765c1] underline decoration-[#9dc2f3] underline-offset-4 hover:text-[#0e4e9c]"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </section>

        <section className="mx-auto mt-8 max-w-5xl rounded-2xl border border-[#cbdcf3] bg-white p-5 text-center sm:p-6">
          <h2 className="font-bold text-[#172b4d]">
            Independent tool, not an official Facebook service
          </h2>

          <p className="mx-auto mt-2 max-w-3xl text-sm leading-6 text-[#627b9c]">
            Shadowban.online is independent and is not affiliated with,
            endorsed by, or operated by Facebook or Meta. Facebook names
            and trademarks are used only to identify the service being
            discussed.
          </p>
        </section>

        <div className="mt-9 flex justify-center">
          <SupportUsButton />
        </div>

        {pageName.trim() && (
          <AlertButton handle={pageName} platform="facebook" />
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
