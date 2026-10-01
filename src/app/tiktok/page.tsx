import type { Metadata } from "next";
import Link from "next/link";
import { baseUrl, getEnglishLanguageAlternates } from "../../lib/i18n/config";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "TikTok Shadowban Checker - Coming Soon | ShadowbannChecker",
  description:
    "TikTok shadowban checks are coming soon, so use the available X/Twitter and Instagram checkers in the meantime.",
  alternates: {
    canonical: `${baseUrl}/tiktok`,
    languages: getEnglishLanguageAlternates("/tiktok"),
  },
};

export default function TikTokPage() {
  return (
    <main className="min-h-screen bg-[#FFFBEB] px-4 py-16 text-stone-900">
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase text-violet-700">ShadowbannChecker</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight">TikTok Shadowban Checker - Coming Soon</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-stone-600">
          TikTok checks are not available yet. Try the X/Twitter or Instagram checker.
        </p>
        <nav aria-label="Available checkers" className="mt-8 flex justify-center gap-3">
          <Link className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white" href="/">
            X / Twitter
          </Link>
          <Link className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold" href="/instagram">
            Instagram
          </Link>
        </nav>
      </section>
    </main>
  );
}