import { Metadata } from "next";

export const dynamicParams = true;
const PLATFORMS = [
  "instagram","tiktok","x","youtube","facebook",
  "reddit","linkedin","pinterest","snapchat","threads",
  "twitch","discord","telegram","whatsapp","quora",
  "medium","tumblr","bsky","mastodon","kick",
  "rumble","onlyfans","linkedin-company"
] as const;

type Platform = typeof PLATFORMS[number];

const CONFIG: Record<Platform, {
  title: string;
  description: string;
  h1: string;
  benchmark: string;
  signals: string[];
  fixes: string[];
  faq: { q: string; a: string }[];
}> = {
  instagram: {
    title: "Instagram Shadowban Checker 2026 - Search & Hashtag Test",
    description: "Check Instagram shadowban 2026: Search ban, hashtag Recent suppression, non-follower reach split. Healthy 2.2% feed / Reels suppressed below 1.1%. Public signals only.",
    h1: "Instagram Shadowban Checker – Search, Hashtag & Non-Follower Reach Test (2026)",
    benchmark: "2026: 3.20% organic reach (-14% YoY), 0.45-0.48% engagement. Non-follower feed 2.2% healthy, Reels <1.1% = suppressed.",
    signals: ["Search invisible in Recent", "Hashtag not in Recent tab", "Non-follower Reels reach <1.1%"],
    fixes: ["Remove flagged hashtags (max 3-5 niche)", "Delete pod / engagement-group comments, wait 48h", "Check Account Status > Recommendation and appeal"],
    faq: [
      { q: "Do shadowban checkers use official APIs?", a: "No. Instagram, TikTok, X, YouTube don't offer a shadowban API. We check public signals only: search visibility, hashtag Recent, non-follower split." },
      { q: "What is Instagram search + hashtag suppression test?", a: "Post with a unique small hashtag, then search logged-out in Recent. If missing, you're suppressed from non-follower discovery." },
    ]
  },
  tiktok: {
    title: "TikTok Shadowban Checker – For You Page % Test 2026",
    description: "TikTok shadowban test 2026: For You Page traffic healthy at 50-80% vs <5% shadowban. 4.20% engagement by views, 72.7% from FYP. No login required.",
    h1: "TikTok Shadowban Checker – For You Page Collapse Test (2026)",
    benchmark: "2026: 4.20% engagement by views (+9% YoY), 72.7% views from For You Page. Healthy FYP 50-80%, shadowban <5%.",
    signals: ["FYP % collapses to <5%", "Hashtag view drops to 0", "Video stuck in Under Review"],
    fixes: ["Delete last violating video, clear cache", "Stop mass follow/unfollow and spam hashtags for 72h", "Post 1 native video/day with no links"],
    faq: [
      { q: "What is healthy For You Page %?", a: "Per Orange Trail 2026 guide, healthy is 50-80% of views from For You Page. Under 5% for 3+ videos = distribution throttling." },
      { q: "Do checkers use TikTok API?", a: "No. There is no shadowban field in TikTok API. We use public FYP % and hashtag tests." },
    ]
  },
  x: {
    title: "X Shadowban Checker – Ghostban & Reply Deboost Test",
    description: "X (Twitter) shadowban checker 2026: Ghostban, search suggestion shadow, reply deboost behind Show more replies. Verified via logged-out search.",
    h1: "X Shadowban Checker – Ghostban & Reply Deboost Test (2026)",
    benchmark: "X uses ghostban + reply deboost (hides behind Show more replies) + search ban. Rate limits after mass mentions.",
    signals: ["Ghostban: tweet invisible logged-out", "Reply deboost: hidden behind Show more replies", "Search suggestion shadow: @handle not suggested"],
    fixes: ["Delete violating reply with mass mentions", "Wait 24-48h rate limit, no mass DMs", "Verify via logged-out search in incognito"],
    faq: [
      { q: "How to verify ghostban on X?", a: "Copy tweet URL, open in incognito logged-out. If not found, it's ghostbanned. Reply deboost is verified by checking if reply is behind Show more replies barrier." },
    ]
  },
  youtube: {
    title: "YouTube Shadowban Checker – Comment & Shorts Shelf Test",
    description: "YouTube shadowban checker: Comment suppression, Shorts shelf removal, Shorts feed distribution drop. No official tool exists. Public signals only.",
    h1: "YouTube Shadowban Checker – Comment & Shorts Shelf Test (2026)",
    benchmark: "2026: Long-form 1.30% engagement (-45% YoY). Shorts shelf removal = Shorts not in feed.",
    signals: ["Comments auto-hidden / held for review on all channels", "Shorts not in Shorts shelf", "Impressions from Shorts feed 0%"],
    fixes: ["Remove flagged keywords from description, check Community Guidelines strike", "Stop external sub4sub traffic", "Appeal via Studio > Settings > Channel > Feature eligibility"],
    faq: [{ q: "Is there a YouTube shadowban?", a: "YouTube denies term but does comment suppression + Shorts distribution throttling. No official API." }]
  },
  facebook: {
    title: "Facebook Shadowban Checker – Distribution Throttling Test",
    description: "Facebook shadowban checker 2026: Distribution throttling, recommendation removal, friend test failure. Reach rate 1.25% organic. Public signals.",
    h1: "Facebook Shadowban Checker – How To Tell If You're Shadow Banned (2026)",
    benchmark: "2026: 1.25% organic reach. Signals: friend can't find post via search, recommendation removed, distribution reduced.",
    signals: ["Friend search invisibility", "Page not recommended", "Reach drops >80% vs avg"],
    fixes: ["Check Page Quality, remove flagged post", "Stop engagement bait (Like & Share)", "Request review in Page Quality tab"],
    faq: [{ q: "How to fix Facebook distribution throttling?", a: "Check Page Quality for violations, delete flagged post, avoid engagement bait, request review." }]
  },
  reddit: { title: "Reddit Shadowban Checker – Comment Removal Test", description: "Reddit shadowban test: Comment auto-removed, profile not visible logged-out. Check r/ShadowBan.", h1: "Reddit Shadowban Checker – Are You Shadowbanned?", benchmark: "Signal: Comments visible to you but removed for others, no upvotes.", signals: ["Comment removed instantly", "Profile 404 logged-out"], fixes: ["Appeal at reddit.com/appeal", "Avoid mass cross-post"], faq: [{ q: "Do I need login?", a: "No. Public mod log check only." }] },
  linkedin: { title: "LinkedIn Shadowban Checker – Reach Deboost Test 2026", description: "LinkedIn shadowban checker: Post not in hashtag feed, dwell time drop, connection-only reach.", h1: "LinkedIn Shadowban Checker – Hashtag Feed Test", benchmark: "Signal: Post not in hashtag Recent, <5% non-connection reach.", signals: ["Not in hashtag feed", "Reach <5% non-1st"], fixes: ["Remove external link from first 2 lines", "Avoid pod engagement"], faq: [{ q: "Does LinkedIn shadowban?", a: "LinkedIn calls it reduced distribution, triggered by external links and pods." }] },
  pinterest: { title: "Pinterest Shadowban Checker – Idea Pin Distribution Test", description: "Pinterest shadowban: Idea Pin not in search, impressions 0.", h1: "Pinterest Shadowban Checker", benchmark: "Healthy: 10%+ non-follower impressions.", signals: ["Pin not in search", "Idea Pin 0 impressions"], fixes: ["Delete keyword stuffed Pin"], faq: [{ q: "How to test?", a: "Search logged-out with unique keyword from Pin." }] },
  snapchat: { title: "Snapchat Shadowban Checker – Spotlight Distribution Test", description: "Snapchat Spotlight shadowban: Views <50, not in Spotlight feed.", h1: "Snapchat Shadowban Checker", benchmark: "Healthy Spotlight >500 views in 24h.", signals: ["Spotlight 0 views", "Not searchable"], fixes: ["Avoid reused content"], faq: [{ q: "Is there shadowban?", a: "Spotlight throttling exists." }] },
  threads: { title: "Threads Shadowban Checker – Search Ban Test", description: "Threads shadowban: Search ban, reply deboost.", h1: "Threads Shadowban Checker", benchmark: "Signal: Profile not in search suggestion.", signals: ["Search ban", "Reply hidden"], fixes: ["Remove flagged words"], faq: [{ q: "Does Threads have shadowban?", a: "Meta calls it reduced distribution." }] },
  twitch: { title: "Twitch Shadowban Checker – Chat Shadowban Test", description: "Twitch chat shadowban: Messages visible to you only.", h1: "Twitch Shadowban Checker", benchmark: "Signal: Chat not visible logged-out.", signals: ["Chat shadowban", "VOD not recommended"], fixes: ["Appeal via Twitch Support"], faq: [{ q: "How to test Twitch?", a: "Send message and check in incognito." }] },
  discord: { title: "Discord Shadowban Checker – Server Mute Test", description: "Discord shadowmute: Messages ghosted.", h1: "Discord Shadowban Checker", benchmark: "Signal: Messages deleted instantly.", signals: ["Auto-mod ghost"], fixes: ["Check server auto-mod logs"], faq: [{ q: "Is there shadowban on Discord?", a: "Servers use auto-mod shadowmute." }] },
  telegram: { title: "Telegram Shadowban Checker – Channel Reach Test", description: "Telegram channel shadowban: Not in global search.", h1: "Telegram Shadowban Checker", benchmark: "Signal: Channel not in search.", signals: ["Not searchable", "Views drop"], fixes: ["Remove flagged content"], faq: [{ q: "How to check?", a: "Search channel @handle logged-out." }] },
  whatsapp: { title: "WhatsApp Channel Shadowban Checker", description: "WhatsApp Channels: Not in directory search.", h1: "WhatsApp Channel Shadowban Checker", benchmark: "Signal: Channel not in search directory.", signals: ["Directory invisible"], fixes: ["Appeal via WhatsApp Support"], faq: [{ q: "Is there shadowban?", a: "Directory removal = throttling." }] },
  quora: { title: "Quora Shadowban Checker – Answer Collapse Test", description: "Quora answer collapsed, not in feed.", h1: "Quora Shadowban Checker", benchmark: "Signal: Answer collapsed.", signals: ["Collapsed", "0 views"], fixes: ["Edit to remove promotional link"], faq: [{ q: "How to fix?", a: "Remove links, appeal." }] },
  medium: { title: "Medium Shadowban Checker – Distribution Removal Test", description: "Medium: Story not in topic feed, not curated.", h1: "Medium Shadowban Checker", benchmark: "Signal: Not in topic feed.", signals: ["Distribution removed"], fixes: ["Remove paywall bypass mention"], faq: [{ q: "Does Medium shadowban?", a: "Distribution removal exists." }] },
  tumblr: { title: "Tumblr Shadowban Checker – Tag Search Test", description: "Tumblr shadowban: Not in tag search.", h1: "Tumblr Shadowban Checker", benchmark: "Signal: Post not in tag Recent.", signals: ["Tag search invisible"], fixes: ["Remove NSFW tags"], faq: [{ q: "How to test Tumblr?", a: "Search tag logged-out." }] },
  bsky: { title: "Bluesky Shadowban Checker – Feed Deboost Test", description: "Bluesky: Labeler deboost, not in Discover.", h1: "Bluesky Shadowban Checker", benchmark: "Signal: Not in Discover.", signals: ["Labeler applied", "Discover missing"], fixes: ["Check labeler settings"], faq: [{ q: "Is there shadowban on Bluesky?", a: "Labelers cause deboost." }] },
  mastodon: { title: "Mastodon Shadowban Checker – Instance Silence Test", description: "Mastodon: Silence / instance block.", h1: "Mastodon Shadowban Checker", benchmark: "Signal: Toots not federated.", signals: ["Silenced", "Not federated"], fixes: ["Appeal to admin"], faq: [{ q: "How to check?", a: "Check from other instance." }] },
  kick: { title: "Kick Shadowban Checker – Chat & Recommendation Test", description: "Kick: Chat shadowban, not in Browse.", h1: "Kick Shadowban Checker", benchmark: "Signal: Chat ghosted.", signals: ["Chat ghost"], fixes: ["Appeal via Kick Support"], faq: [{ q: "Does Kick shadowban?", a: "Chat auto-mod ghost exists." }] },
  rumble: { title: "Rumble Shadowban Checker – Search Ban Test", description: "Rumble: Video not in search.", h1: "Rumble Shadowban Checker", benchmark: "Signal: Not searchable.", signals: ["Search invisible"], fixes: ["Check Community Guidelines"], faq: [{ q: "How to test Rumble?", a: "Search title logged-out." }] },
  onlyfans: { title: "OnlyFans Shadowban Checker – Search & Suggestion Test", description: "OnlyFans: Not in search, suggestion removal.", h1: "OnlyFans Shadowban Checker", benchmark: "Signal: Not in search suggestion.", signals: ["Search ban"], fixes: ["Remove flagged promo"], faq: [{ q: "Is there shadowban?", a: "Search suppression exists." }] },
  "linkedin-company": { title: "LinkedIn Page Shadowban Checker – Company Page Test", description: "LinkedIn Company Page: Not in search, follower-only reach.", h1: "LinkedIn Company Page Shadowban Checker", benchmark: "Signal: Page not searchable.", signals: ["Page not in search"], fixes: ["Remove link spam"], faq: [{ q: "Does LinkedIn shadowban pages?", a: "Yes, reduced distribution for link-heavy pages." }] },
};

export function generateStaticParams() {
  return PLATFORMS.map(p => ({ platform: p }));
}

export async function generateMetadata({ params }: { params: Promise<{ platform: string }> }): Promise<Metadata> {
  const { platform } = await params;
  const cfg = CONFIG[platform as Platform];
  if (!cfg) return {};
  return {
    title: cfg.title.slice(0, 60),
    description: cfg.description.slice(0, 160),
    alternates: {
      canonical: `https://shadowban.online/checker/${platform}`,
    },
    openGraph: {
      title: cfg.title,
      description: cfg.description,
      url: `https://shadowban.online/checker/${platform}`,
    }
  };
}

export default async function Page({ params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  const cfg = CONFIG[platform as Platform];
  if (!cfg) return <div>Platform not found</div>;

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cfg.faq.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">{cfg.h1}</h1>
      <p className="mt-4 text-stone-700">{cfg.benchmark}</p>
      
      <div className="mt-6 bg-white border rounded-lg p-6">
        <h2 className="text-xl font-bold">Check a public {platform} username</h2>
        <p className="text-sm text-stone-600 mt-2">No login. Public signals only.</p>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">What we actually check: visibility filtering, not a myth</h2>
        <p className="mt-3">Platforms deny 'shadowban' but acknowledge distribution reduction. We measure: {cfg.signals.join(", ")}.</p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Why your reach dropped in 2026</h2>
        <ul className="list-disc ml-6 mt-3">
          {cfg.signals.map(s => <li key={s}>{s}</li>)}
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
        {cfg.faq.map(f => (
          <div key={f.q} className="mt-4">
            <h3 className="font-semibold">{f.q}</h3>
            <p className="text-stone-600">{f.a}</p>
          </div>
        ))}
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </main>
  );
}
