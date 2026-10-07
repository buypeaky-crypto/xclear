import type { Metadata } from "next";
import Link from "next/link";

const pageUrl = "https://xclear.pro/blog/what-is-shadowban";

export const metadata: Metadata = {
  title: "What Is a Shadowban? How to Tell on X, Instagram, TikTok, Facebook & YouTube",
  description: "Shadowban means reduced visibility without notice. Learn how to tell if you're shadowbanned on X, Instagram, TikTok, Facebook and YouTube and how to fix it.",
  alternates: { canonical: pageUrl },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${pageUrl}#article`,
      headline: "What Is a Shadowban? How to Tell on X, Instagram, TikTok, Facebook & YouTube",
      description: "Shadowban means reduced visibility without notice. Learn how to tell on X, Instagram, TikTok, Facebook and YouTube.",
      url: pageUrl,
      datePublished: "2026-10-06",
      dateModified: "2026-10-06",
      author: { "@type": "Person", name: "@shadowban_eu" },
      publisher: { "@type": "Organization", name: "XClear", logo: { "@type": "ImageObject", url: "https://xclear.pro/logo.png" } }
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: [
        { "@type": "Question", name: "What is a shadowban?", acceptedAnswer: { "@type": "Answer", text: "A shadowban is a hidden reduction in reach. Your account still exists and you can post, but your content is not shown in For You, Explore, hashtag search or recommendations." } },
        { "@type": "Question", name: "How long does a shadowban last?", acceptedAnswer: { "@type": "Answer", text: "Usually 48 hours to 14 days. If you stop spam behavior and remove banned hashtags, reach returns automatically without contacting support." } },
        { "@type": "Question", name: "How do I know if I'm shadowbanned?", acceptedAnswer: { "@type": "Answer", text: "Check from incognito: hashtag Latest doesn't show you, replies are hidden under Show more, analytics show 0% non-follower reach, and your exact video title doesn't appear in search." } },
        { "@type": "Question", name: "How do I fix a shadowban?", acceptedAnswer: { "@type": "Answer", text: "Delete banned hashtags, stop follow/unfollow and mass actions for 72h, delete last spammy posts, then post normal content and test with XClear checker." } }
      ]
    }
  ]
};

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto p-8 py-20">
      <h1 className="text-4xl font-bold mb-4">What Is a Shadowban? How to Tell on X, Instagram, TikTok, Facebook & YouTube</h1>
      <p className="text-sm text-gray-500 mb-8">Published Oct 6, 2026 • XClear</p>

      <div className="prose max-w-none space-y-6 leading-relaxed">
        <p>A shadowban is not a ban. Your account still exists, you can still post, like, and comment — but the platform quietly reduces your visibility without telling you. Your posts stop appearing in For You, Explore, hashtag search, or replies. Followers may still see you, but non-followers don't. That's why reach drops 80-90% and it feels confusing compared to a real suspension where you get an email notice and can't log in.</p>
        <p>Why do platforms do it? To fight spam and engagement bait, to limit borderline content that is not illegal but shouldn't go viral, and to enforce unspoken rules like banned hashtags or suspicious growth. It's mostly automated via ranking and recommendation systems, not a human reviewer, which is why you can be hit by mistake after one viral post or using the same hashtags repeatedly.</p>
        <p>A shadowban can feel deeply confusing — you post consistently but analytics show few views, likes are only from followers, and your content quietly stops traveling. The good news: visibility restrictions are often temporary, lasting hours to weeks, and recovery is possible with patience. This guide explains how to tell on each platform.</p>
      </div>

      <section className="mt-12 space-y-8">
        <h2 className="text-2xl font-bold">How to Tell if You're Shadowbanned on X, Instagram, TikTok, Facebook & YouTube</h2>

        <div>
          <h3 className="text-xl font-semibold">X (Twitter)</h3>
          <p className="mt-2">On X, a shadowban is called reduced distribution. Your tweets don't show in search Latest, your replies are collapsed, and your profile doesn't auto-suggest.</p>
          <ul className="list-disc ml-6 mt-2"><li>Incognito search for your hashtag — your tweet missing in Latest</li><li>Replies hidden under Show more replies</li><li>Analytics: 0 views from non-followers</li></ul>
          <Link href="/" className="text-blue-600 underline mt-2 inline-block">Check X account →</Link>
        </div>

        <div>
          <h3 className="text-xl font-semibold">Instagram</h3>
          <p className="mt-2">Instagram calls it not eligible for recommendation. Your Reels stop getting Explore reach and your posts vanish from hashtag Recent pages.</p>
          <ul className="list-disc ml-6 mt-2"><li>Post with small hashtag, check Recent from another account — not there</li><li>Insights: 0 non-follower reach on Explore</li><li>Story views drop 90%</li></ul>
          <Link href="/check" className="text-blue-600 underline mt-2 inline-block">Check Instagram →</Link>
        </div>

        <div>
          <h3 className="text-xl font-semibold">TikTok</h3>
          <p className="mt-2">TikTok limits For You distribution. Your videos get only Follower views and get stuck at 200 views even with good watch time.</p>
          <ul className="list-disc ml-6 mt-2"><li>For You 0%, only Following/Followers watching</li><li>Videos stuck at 0-200 views for hours</li><li>Exact username not found in search</li></ul>
          <Link href="/tiktok-check" className="text-blue-600 underline mt-2 inline-block">Check TikTok →</Link>
        </div>

        <div>
          <h3 className="text-xl font-semibold">Facebook</h3>
          <p className="mt-2">Facebook reduces Feed distribution. Your posts are visible on your profile but not in friends Feed, and group posts stay pending.</p>
          <ul className="list-disc ml-6 mt-2"><li>Friends don't see post in Feed, only when visiting profile</li><li>Group posts pending forever or removed</li><li>Page reach 0 despite active followers</li></ul>
          <Link href="/facebook-shadowban-checker" className="text-blue-600 underline mt-2 inline-block">Check Facebook →</Link>
        </div>

        <div>
          <h3 className="text-xl font-semibold">YouTube</h3>
          <p className="mt-2">YouTube limits search and suggested. Your exact video title doesn't rank even with quotes and your impressions are only from direct link.</p>
          <ul className="list-disc ml-6 mt-2"><li>Search exact title in quotes — video not in top 50</li><li>Analytics: Browsing features and Suggested 0%</li><li>Comments shadow-hidden, only you see them</li></ul>
          <Link href="/youtube-check" className="text-blue-600 underline mt-2 inline-block">Check YouTube →</Link>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">FAQ</h2>
        <div className="mt-6 space-y-6">
          <div><h3 className="font-semibold">What is a shadowban?</h3><p className="mt-1">A hidden limit on reach without notice.</p></div>
          <div><h3 className="font-semibold">How long does it last?</h3><p className="mt-1">48 hours to 14 days typically. Wait and avoid spam actions.</p></div>
          <div><h3 className="font-semibold">How do I fix it?</h3><p className="mt-1">Remove banned hashtags, pause posting 2-3 days, then post normal content and re-check with XClear.</p></div>
        </div>
      </section>

      <a href="/" className="mt-10 inline-block bg-black text-white px-6 py-3 rounded-lg">Check your account now →</a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    </main>
  );
}
