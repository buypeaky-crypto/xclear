import TikTokChecker from '@/components/TikTokChecker';
import YouTubeChecker from '@/components/YouTubeChecker';
import RedditChecker from '@/components/RedditChecker';
import InstagramLanding from '@/components/InstagramLanding';
import FacebookLanding from '@/components/FacebookLanding';
import Home from '../../page';
import { Metadata } from "next";
import { platforms, type Platform, platformTestLabels } from "@/lib/platforms";

export const dynamicParams = true;

type SeoCfg = {
  title: string;
  description: string;
  h1: string;
  benchmark: string;
  fixes: string[];
};

const SEO_BASE: Record<string, SeoCfg> = {
  twitter: {
    title: "X Shadowban Checker - Ghostban & Reply Deboost Test 2026",
    description:
      "X (Twitter) shadowban checker 2026: Ghostban, search suggestion, search ban, reply deboost behind Show more replies. Public signals only, no login.",
    h1: "X Shadowban Checker – Ghostban & Reply Deboost Test (2026)",
    benchmark:
      "X uses ghostban + reply deboost (hides behind Show more replies) + search suggestion shadow. Rate limits after mass mentions trigger temporary filters.",
    fixes: [
      "Delete violating reply with mass mentions",
      "Wait 24-48h rate limit, no mass DMs or follows",
      "Verify via logged-out incognito search: pbs.twimg.com search",
    ],
  },
  instagram: {
    title: "Instagram Shadowban Checker 2026 - Search & Hashtag Test",
    description:
      "Instagram shadowban 2026: Search suggestion, hashtag ban, feed visibility, comment deboost. Healthy 2.2% feed / Reels <1.1% non-follower = suppressed. Public signals.",
    h1: "Instagram Shadowban Checker – Search, Hashtag & Non-Follower Reach Test",
    benchmark:
      "2026: 3.20% organic reach (-14% YoY), 0.45-0.48% engagement. Non-follower feed 2.2% healthy, Reels <1.1% = suppressed. Hashtag ban = post not in Recent for that tag.",
    fixes: [
      "Remove flagged hashtags (max 3-5 niche, no banned tags)",
      "Delete pod / engagement-group comments, wait 48h",
      "Check Account Status > Recommendation and appeal if Not recommendable",
    ],
  },
  tiktok: {
    title: "TikTok Shadowban Checker - For You Page % Test 2026",
    description:
      "TikTok shadowban 2026: FYP 50-80% healthy vs <5% shadowban, hashtag visibility, profile & comment visibility. 4.20% engagement, 72.7% from For You Page.",
    h1: "TikTok Shadowban Checker – For You Page Collapse Test (2026)",
    benchmark:
      "2026: 4.20% engagement by views (+9% YoY), 72.7% views from FYP. Healthy FYP 50-80%, shadowban <5% FYP + video not under hashtag Recent.",
    fixes: [
      "Delete last violating video, clear cache, check Community Guidelines strike",
      "Stop mass follow/unfollow and spam hashtags for 72h",
      "Post 1 native video/day with no links, no watermark",
    ],
  },
  facebook: {
    title: "Facebook Shadowban Checker - Distribution Throttling 2026",
    description:
      "Facebook shadowban checker 2026: Search suggestion, search visibility, profile visibility, comment visibility. Reach 1.25% organic. Distribution throttling.",
    h1: "Facebook Shadowban Checker – How To Tell If You're Shadow Banned (2026)",
    benchmark:
      "2026: 1.25% organic reach. Signals: friend can't find post via search, recommendation removed, distribution reduced >80% in Insights.",
    fixes: [
      "Check Page Quality, remove flagged post violating Community Standards",
      "Stop engagement bait (Like & Share) and clickbait links",
      "Request review in Page Quality tab, wait 48h",
    ],
  },
  youtube: {
    title: "YouTube Shadowban Checker - Comment & Shorts Shelf Test",
    description:
      "YouTube shadowban checker 2026: Comment suppression, Shorts shelf removal, Shorts feed 0%. No official tool exists. Long-form 1.30% engagement.",
    h1: "YouTube Shadowban Checker – Comment & Shorts Shelf Test (2026)",
    benchmark:
      "2026: Long-form 1.30% engagement (-45% YoY). Shorts shelf removal = Shorts not in Shorts feed. Comment shadow = comment visible to you, not to logged-out.",
    fixes: [
      "Remove flagged keywords from description, check Community Guidelines strike in Studio",
      "Stop external sub4sub and spam traffic, keep 90% YouTube-sourced views",
      "Appeal via Studio > Channel > Feature eligibility > Appeal",
    ],
  },
  reddit: {
    title: "Reddit Shadowban Checker - Comment Removal Test 2026",
    description:
      "Reddit shadowban test: Comment auto-removed, profile 404 logged-out. Search suggestion, search visibility, profile & comment visibility. Use r/ShadowBan bot.",
    h1: "Reddit Shadowban Checker – Are You Shadowbanned?",
    benchmark:
      "Signal: Comments visible to you but removed for others, no upvotes, profile 404 logged-out. Check via logged-out + mod log.",
    fixes: [
      "Check r/ShadowBan with mod bot to confirm sitewide vs subreddit ban",
      "Appeal at reddit.com/appeal if sitewide, message mods if subreddit",
      "Avoid mass cross-post and new-account spam patterns",
    ],
  },
};

// Alias: /checker/x and /checker/twitter same page
const SEO: Record<string, SeoCfg> = {
  ...SEO_BASE,
  x: SEO_BASE.twitter,
};

export function generateStaticParams() {
  const base = platforms.map((p) => ({ platform: p }));
  return [...base, { platform: "x" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ platform: string }>;
}): Promise<Metadata> {
  const { platform: raw } = await params;
  const key = raw === "x" ? "twitter" : raw;
  const cfg = SEO[key];
  if (!cfg) return {};
  return {
    title: cfg.title.slice(0, 60),
    description: cfg.description.slice(0, 160),
    alternates: { canonical: `https://shadowban.online/checker/${raw}` },
    openGraph: {
      title: cfg.title,
      description: cfg.description,
      url: `https://shadowban.online/checker/${raw}`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ platform: string }>;
}) {
  const { platform: raw } = await params;
  const normalized = (raw === "x" ? "twitter" : raw) as Platform;
  const cfg = SEO[normalized] ?? SEO[raw];
  const labels = platformTestLabels[normalized as Platform];

  if (!cfg) {
    return <main className="p-10">Platform not found: {raw}</main>;
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Do ${raw} shadowban checkers use official APIs?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `No. ${raw} does not offer a shadowban API. We check public signals only: ${labels?.join(", ")}.`,
        },
      },
      {
        "@type": "Question",
        name: `What does ${raw} check for in 2026?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${cfg.benchmark} Tests: ${labels?.join(", ")}.`,
        },
      },
    ],
  };
  if (normalized === 'twitter') {
    return (
      <div className="bg-platform-twitter">
        <Home backgroundClassName="bg-transparent" />
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">{cfg.h1}</h1>
      <p className="mt-4 text-stone-700">{cfg.benchmark}</p>
      <p className="mt-2 text-sm text-stone-600">No login. Public signals: {labels?.join(" → ")}.</p>

      <div className="mt-8">
        {normalized === 'tiktok' && <TikTokChecker />}
        {normalized === 'youtube' && <YouTubeChecker locale="en" />}
        {normalized === 'reddit' && <RedditChecker variant="checker" />}
        {normalized === 'instagram' && <Home platform="instagram" variant="checker" backgroundClassName="bg-white border rounded-lg p-6 shadow-sm" />}
        {normalized === 'facebook' && <Home platform="facebook" variant="checker" backgroundClassName="bg-white border rounded-lg p-6 shadow-sm" />}
        {(normalized as string) === 'twitter' && <Home platform="x" variant="checker" backgroundClassName="bg-white border rounded-lg p-6 shadow-sm" />}
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">
          What we actually check: visibility filtering, not a myth
        </h2>
        <p className="mt-3">
          Platforms deny shadowban but acknowledge distribution reduction. For {raw} we measure:{" "}
          {labels?.join(", ")} via logged-out public tests.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Why your reach dropped in 2026</h2>
        <ul className="list-disc ml-6 mt-3">
          {labels?.map((l: string) => (
            <li key={l}>{l} failure / throttling</li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">3 fixes before you re-check</h2>
        <ol className="list-decimal ml-6 mt-3">
          {cfg.fixes.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">FAQ</h2>
        <p className="mt-2 font-semibold">Do shadowban checkers use official APIs?</p>
        <p className="text-stone-600">
          No. Instagram, TikTok, X, YouTube do not offer a shadowban API. We use public signals only.
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </main>
  );
}
