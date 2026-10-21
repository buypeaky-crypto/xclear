import { Metadata } from "next";
import { platforms, type Platform, platformTestLabels } from "@/lib/platforms";

export const dynamicParams = false;

const SEO: Record<Platform, { title: string; description: string; h1: string; benchmark: string; fixes: string[] }> = {
  twitter: {
    title: "X Shadowban Checker - Ghostban & Reply Deboost Test 2026",
    description: "X (Twitter) shadowban checker 2026: Ghostban, search suggestion, search ban, reply deboost behind Show more replies. Public signals only, no login.",
    h1: "X Shadowban Checker – Ghostban & Reply Deboost Test (2026)",
    benchmark: "X uses ghostban + reply deboost (hides behind Show more replies) + search suggestion shadow. Rate limits after mass mentions.",
    fixes: ["Delete violating reply with mass mentions", "Wait 24-48h rate limit, no mass DMs", "Verify via logged-out incognito search"]
  },
  instagram: {
    title: "Instagram Shadowban Checker 2026 - Search & Hashtag Test",
    description: "Instagram shadowban 2026: Search suggestion, hashtag ban, feed visibility, comment deboost. Healthy 2.2% feed / Reels <1.1% non-follower = suppressed. Public signals.",
    h1: "Instagram Shadowban Checker – Search, Hashtag & Non-Follower Reach Test",
    benchmark: "2026: 3.20% organic reach (-14% YoY), 0.45-0.48% engagement. Non-follower feed 2.2% healthy, Reels <1.1% = suppressed.",
    fixes: ["Remove flagged hashtags (max 3-5 niche)", "Delete pod / engagement-group comments, wait 48h", "Check Account Status > Recommendation and appeal"]
  },
  tiktok: {
    title: "TikTok Shadowban Checker - For You Page % Test 2026",
    description: "TikTok shadowban 2026: FYP 50-80% healthy vs <5% shadowban, hashtag visibility, profile & comment visibility. 4.20% engagement, 72.7% from For You Page.",
    h1: "TikTok Shadowban Checker – For You Page Collapse Test (2026)",
    benchmark: "2026: 4.20% engagement by views (+9% YoY), 72.7% views from FYP. Healthy FYP 50-80%, shadowban <5%.",
    fixes: ["Delete last violating video, clear cache", "Stop mass follow/unfollow and spam hashtags for 72h", "Post 1 native video/day with no links"]
  },
  facebook: {
    title: "Facebook Shadowban Checker - Distribution Throttling 2026",
    description: "Facebook shadowban checker 2026: Search suggestion, search visibility, profile visibility, comment visibility. Reach 1.25% organic. Distribution throttling.",
    h1: "Facebook Shadowban Checker – How To Tell If You're Shadow Banned (2026)",
    benchmark: "2026: 1.25% organic reach. Signals: friend can't find post via search, recommendation removed, distribution reduced >80%.",
    fixes: ["Check Page Quality, remove flagged post", "Stop engagement bait (Like & Share)", "Request review in Page Quality tab"]
  },
  youtube: {
    title: "YouTube Shadowban Checker - Comment & Shorts Shelf Test",
    description: "YouTube shadowban checker 2026: Comment suppression, Shorts shelf removal, Shorts feed 0%. No official tool exists. Long-form 1.30% engagement.",
    h1: "YouTube Shadowban Checker – Comment & Shorts Shelf Test (2026)",
    benchmark: "2026: Long-form 1.30% engagement (-45% YoY). Shorts shelf removal = Shorts not in Shorts feed.",
    fixes: ["Remove flagged keywords from description, check Community Guidelines strike", "Stop external sub4sub traffic", "Appeal via Studio > Channel > Feature eligibility"]
  },
  reddit: {
    title: "Reddit Shadowban Checker - Comment Removal Test 2026",
    description: "Reddit shadowban test: Comment auto-removed, profile 404 logged-out. Search suggestion, search visibility, profile & comment visibility.",
    h1: "Reddit Shadowban Checker – Are You Shadowbanned?",
    benchmark: "Signal: Comments visible to you but removed for others, no upvotes, profile 404 logged-out.",
    fixes: ["Check r/ShadowBan with mod bot", "Appeal at reddit.com/appeal", "Avoid mass cross-post"]
  }
};

export function generateStaticParams() {
  return platforms.map((platform) => ({ platform }));
}

export async function generateMetadata({ params }: { params: Promise<{ platform: string }> }): Promise<Metadata> {
  const { platform } = await params as { platform: Platform };
  const cfg = SEO[platform];
  if (!cfg) return {};
  return {
    title: cfg.title.slice(0, 60),
    description: cfg.description.slice(0, 160),
    alternates: { canonical: `https://shadowban.online/checker/${platform}` },
    openGraph: {
      title: cfg.title,
      description: cfg.description,
      url: `https://shadowban.online/checker/${platform}`,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params as { platform: Platform };
  const cfg = SEO[platform];
  const labels = platformTestLabels[platform];
  if (!cfg || !labels) return <div>Platform not found</div>;

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Do ${platform} shadowban checkers use official APIs?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `No. ${platform} doesn't offer a shadowban API. We check public signals only: ${labels.join(", ")}.`
        }
      },
      {
        "@type": "Question",
        name: `What does ${platform} check for in 2026?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `We check ${labels.join(", ")} via logged-out public tests. ${cfg.benchmark}`
        }
      }
    ]
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">{cfg.h1}</h1>
      <p className="mt-4 text-stone-700">{cfg.benchmark}</p>

      <div className="mt-6 bg-white border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold">Check a public {platform} username</h2>
        <p className="text-sm text-stone-600 mt-2">No login. Public signals: {labels.join(" → ")}.</p>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">What we actually check: visibility filtering, not a myth</h2>
        <p className="mt-3">Platforms deny 'shadowban' but acknowledge distribution reduction. For {platform} we measure: {labels.join(", ")}.</p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Why your reach dropped in 2026</h2>
        <ul className="list-disc ml-6 mt-3">
          {labels.map(l => <li key={l}>{l} failure / throttling</li>)}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">3 fixes before you re-check</h2>
        <ol className="list-decimal ml-6 mt-3">
          {cfg.fixes.map(f => <li key={f}>{f}</li>)}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">FAQ</h2>
        <p className="mt-2 font-semibold">Do shadowban checkers use official APIs?</p>
        <p className="text-stone-600">No. Instagram, TikTok, X, YouTube don't offer a shadowban API. We use public signals only.</p>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </main>
  );
}
