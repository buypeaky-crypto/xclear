// src/app/checker/[platform]/page.tsx
import { Metadata } from "next";
import { platforms, type Platform, platformTestLabels } from "@/lib/platforms";

export const dynamicParams = true;

const SEO_BASE: Record<string, any> = {
  twitter: {
    title: "X Shadowban Checker - Ghostban & Reply Deboost Test 2026",
    description: "X (Twitter) shadowban checker 2026: Ghostban, search suggestion, search ban, reply deboost. Public signals only.",
    h1: "X Shadowban Checker – Ghostban & Reply Deboost Test (2026)",
    benchmark: "X uses ghostban + reply deboost + search suggestion shadow.",
    fixes: ["Delete violating reply", "Wait 24-48h rate limit", "Verify logged-out"]
  },
  instagram: {
    title: "Instagram Shadowban Checker 2026 - Search & Hashtag Test",
    description: "Instagram shadowban 2026: Search suggestion, hashtag ban, feed visibility, comment deboost. 2.2% feed / <1.1% Reels = suppressed.",
    h1: "Instagram Shadowban Checker – Search, Hashtag & Non-Follower Reach Test",
    benchmark: "2026: 3.20% reach, 2.2% feed healthy, Reels <1.1% = suppressed.",
    fixes: ["Remove flagged hashtags", "Delete pod comments 48h", "Check Account Status"]
  },
  tiktok: {
    title: "TikTok Shadowban Checker - For You Page % Test 2026",
    description: "TikTok shadowban 2026: FYP 50-80% healthy vs <5% shadowban. 4.20% engagement.",
    h1: "TikTok Shadowban Checker – For You Page Collapse Test",
    benchmark: "2026: 4.20% engagement, 72.7% from FYP. <5% = throttled.",
    fixes: ["Delete last violating video", "Stop mass follow 72h", "Post 1 native video/day"]
  },
  facebook: { title: "Facebook Shadowban Checker", description: "Facebook distribution throttling 1.25% reach.", h1: "Facebook Shadowban Checker", benchmark: "1.25% organic reach", fixes: ["Check Page Quality"] },
  youtube: { title: "YouTube Shadowban Checker", description: "YouTube comment & Shorts shelf test.", h1: "YouTube Shadowban Checker", benchmark: "1.30% engagement long-form", fixes: ["Remove flagged keywords"] },
  reddit: { title: "Reddit Shadowban Checker", description: "Reddit comment removal test.", h1: "Reddit Shadowban Checker", benchmark: "Comments visible to you only", fixes: ["Check r/ShadowBan"] },
};

// alias x -> twitter
const SEO = { ...SEO_BASE, x: SEO_BASE.twitter };

export function generateStaticParams() {
  return [...platforms.map(p => ({ platform: p })), { platform: "x" }];
}

export async function generateMetadata({ params }: { params: Promise<{ platform: string }> }): Promise<Metadata> {
  const { platform } = await params;
  const p = platform === "x" ? "twitter" : platform;
  const cfg = SEO[p];
  if (!cfg) return {};
  return {
    title: cfg.title.slice(0,60),
    description: cfg.description.slice(0,160),
    alternates: { canonical: `https://shadowban.online/checker/${platform}` }
  };
}

export default async function Page({ params }: { params: Promise<{ platform: string }> }) {
  const { platform: raw } = await params;
  const platform = raw === "x" ? "twitter" : raw as Platform;
  const cfg = SEO[platform];
  const labels = platformTestLabels[platform as Platform];
  if (!cfg) return <div>Platform not found: {raw}</div>;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">{cfg.h1}</h1>
      <p className="mt-4">{cfg.benchmark}</p>
      <div className="mt-6 bg-white border rounded-lg p-6">
        <h2 className="text-xl font-bold">Check a public {raw} username</h2>
        <p className="text-sm">No login. Signals: {labels?.join(", ")}</p>
      </div>
    </main>
  );
}
