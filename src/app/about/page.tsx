import type { Metadata } from "next";
import Link from "next/link";
import { baseUrl, getEnglishLanguageAlternates } from "../../lib/i18n/config";

export const metadata: Metadata = {
  title: "About ShadowbannChecker | Our Authors and Method",
  description:
    "Meet the authors and learn how ShadowbannChecker researches visibility signals to help creators investigate possible reach restrictions.",
  keywords: [
    "about shadowban checker",
    "instagram shadowban checker",
    "what is shadowban",
    "am i shadowbanned",
  ],
  alternates: {
    canonical: `${baseUrl}/about`,
    languages: getEnglishLanguageAlternates("/about"),
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${baseUrl}/about#author-shadowban-eu`,
      name: "@shadowban_eu",
      url: "https://x.com/shadowban_eu",
      sameAs: "https://x.com/shadowban_eu",
    },
    {
      "@type": "Person",
      "@id": `${baseUrl}/about#author-gutnews247`,
      name: "@gutnews247",
      url: "https://x.com/gutnews247",
      sameAs: "https://x.com/gutnews247",
    },
    {
      "@type": "HowTo",
      name: "How this tester works",
      description:
        "A heuristic review informed by logged-out hashtag research that helps creators investigate possible visibility issues without treating results as an official platform decision.",
      dateModified: "2026-10-01",
      author: [
        { "@id": `${baseUrl}/about#author-shadowban-eu` },
        { "@id": `${baseUrl}/about#author-gutnews247` },
      ],
      step: [
        {
          "@type": "HowToStep",
          name: "Research public hashtag signals",
          text: "The authors tested more than 1,200 hashtags using logged-out endpoints to investigate public visibility signals.",
        },
        {
          "@type": "HowToStep",
          name: "Review submitted hashtags",
          text: "The current Instagram checker locally checks submitted hashtags for matches in its signal list, duplicates, and the platform hashtag limit; it does not make a live Instagram request.",
        },
        {
          "@type": "HowToStep",
          name: "Interpret the result cautiously",
          text: "Treat the score as a heuristic clue, not confirmation of a restriction, and check the platform's own account-status information.",
        },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FFFBEB] px-4 py-12 text-stone-900 sm:py-16">
      <article className="mx-auto max-w-4xl">
        <header className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase text-violet-700">Built for creators</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            About ShadowbannChecker
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-7 text-stone-600">
            Last updated October 1, 2026
          </p>
        </header>

        <div className="space-y-8 text-[15px] leading-7 text-stone-700">
          <section>
            <h2 className="mb-3 text-2xl font-bold text-stone-900">Who we are</h2>
            <p>
              ShadowbannChecker is built by{" "}
              <a className="font-semibold text-violet-700 underline" href="https://x.com/shadowban_eu">@shadowban_eu</a>
              {" "}and{" "}
              <a className="font-semibold text-violet-700 underline" href="https://x.com/gutnews247">@gutnews247</a>.
              We make public visibility signals easier for creators to investigate without asking
              for account passwords or promising certainty that an independent tool cannot provide.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-stone-900">What is a Shadowban?</h2>
            <p>
              “Shadowban” is a commonly used name for a situation where a social platform limits
              how widely an account or its posts are shown without making that restriction obvious
              to the account owner. The phrase is not a single, standardized status shared by
              Instagram, TikTok, X/Twitter, or YouTube. Each platform has its own ranking,
              recommendation, search, and moderation systems, and those systems can change
              without notice. A drop in reach is not, by itself, proof of a shadowban. Audience
              activity, post format, changing interests, competition, recommendation eligibility,
              and ordinary ranking variation can all affect impressions.
            </p>
            <p className="mt-4">
              Creators often ask, “Am I shadowbanned?” because a post that once reached many people
              suddenly receives fewer views, or because a profile or post is difficult to find.
              Useful clues can include whether public content appears in search, whether a post is
              discoverable from a relevant hashtag, and whether a platform has sent an account
              status or policy notice. Those are clues to investigate, not a universal diagnostic
              test; results can differ between users, locations, and app sessions.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-stone-900">How this tester works</h2>
            <p>
              During our research, we tested more than 1,200 hashtags using logged-out endpoints
              to investigate public hashtag visibility. The current Instagram checker evaluates
              the hashtags you submit locally against its signal list, checks for duplicates and
              the platform hashtag limit, and returns a heuristic score. It does not make a live
              Instagram request, and a score cannot reveal Instagram’s internal ranking decisions.
            </p>
            <p className="mt-4">
              The X/Twitter checker looks up public profile information. Neither checker can
              confirm an official shadowban status; results are clues to investigate alongside
              platform account-status notices and changes across multiple posts.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-stone-900">Why we built it</h2>
            <p>
              We want to help creators spot possible visibility issues and decide what to check
              next. Reach can change for many reasons, so the tool is designed to provide a useful
              starting point rather than a verdict. Review the platform’s own guidance before
              making decisions about your account.
            </p>
            <p className="mt-4">
              Start with the <Link className="font-semibold text-violet-700 underline" href="/">free shadowban checker</Link>,
              and see our <Link className="font-semibold text-violet-700 underline" href="/privacy">Privacy Policy</Link>
              {" "}for details about submitted information.
            </p>
          </section>

        </div>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}