import type { Metadata } from "next";
import Link from "next/link";
import { baseUrl, getLocaleUrl1, localeNames, locales, type Locale } from "@/lib/i18n/config"
import { getInstagramUrl, instagramLocales } from "../lib/i18n/instagram";
import { getYouTubeUrl, youtubeLocales } from "../lib/i18n/youtube";
import { getFacebookUrl, facebookLocales } from "../lib/i18n/facebook";
import { getTikTokUrl, tiktokLocales } from "../lib/i18n/tiktok";
import { Geist, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import FacebookPixel from "./components/FacebookPixel";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["700","800","900"],
  style: ["normal","italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://shadowban.online'),
  title: { default: 'Free Social Media Shadowban Checker & Reach Recovery Tool', template: '%s | shadowban.online' },
  description: "Free shadowban checker for X/Twitter, Instagram, TikTok, YouTube, Reddit, Facebook. Tests search ban, ghost ban, hashtag suppression with logged-out signals. No login required.",
  keywords: [
    "twitter shadowban checker",
    "Instagram shadowban checker",
    "TikTok shadowban checker",
    "Reddit shadowban checker",
    "YouTube shadowban checker",
    "Facebook shadowban checker",
    "shadowban checker",
    "twitter shadowban test",
    "X shadowban checker",
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Free Social Media Shadowban Checker & Reach Recovery Tool',
    description: 'Test search ban, ghost ban, hashtag suppression with logged-out signals.',
    url: 'https://shadowban.online',
    siteName: 'shadowban.online',
    type: 'website',
    locale: 'en_US',
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Shadowban Checker for Twitter, Instagram, TikTok, Reddit" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Twitter Shadowban Test - Free X Search, Ghost & Reply Check (No Login)",
    description: "Free shadowban checker for X/Twitter using limited logged-out visibility signals. No login required.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  verification: {
    google: ["DRtfSf9yGJLU9W5mRINhothV-pO9npwwtIzmK2J5ziY", "VeO9Qolz-C_gaivC8zVhRT-b_ORLKIk9nahiW9UJNtk"],
  },
};

const platforms = [
  { href: "/", label: "X (Twitter)", short: "X" },
  { href: "/instagram", label: "Instagram", short: "IG" },
  { href: "/tiktok", label: "TikTok", short: "TT" },
  { href: "/facebook-shadowban-checker", label: "Facebook", short: "FB" },
  { href: "/youtube", label: "YouTube", short: "YT" },
  { href: "/reddit", label: "Reddit", short: "RD" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}>
            <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-F1E42SVH2T" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-F1E42SVH2T');`}
        </Script>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6171869463418529"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FFFBF0] text-stone-900">
        <FacebookPixel />
        
        {/* TOP NAV - sticky, reduces bounce, same mechanism across all pages */}
        <header className="sticky top-0 z-40 border-b border-stone-200/60 bg-[#FFFBF0]/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link href="/" className={`${fraunces.className} text-[13px] font-black tracking-wide text-violet-700 hover:text-violet-800`}>
              SHADOWBANNCHECKER
            </Link>
            <nav aria-label="Platforms" className="hidden items-center gap-1 sm:flex">
              {platforms.map((p)=>(
                <Link key={p.href} href={p.href} className="rounded-full px-3 py-1.5 text-[13px] font-semibold text-stone-700 hover:bg-white hover:text-stone-900">
                  {p.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/checker/twitter" className="hidden rounded-full bg-stone-900 px-4 py-1.5 text-[12px] font-bold text-white hover:bg-black sm:block">
                All Checkers
              </Link>
              <Link href="https://x.com/gutnews247" target="_blank" className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-[12px] font-semibold hover:bg-stone-50">
                @gutnews247
              </Link>
            </div>
          </div>
          {/* Mobile platforms scroll */}
          <div className="flex gap-1 overflow-x-auto px-4 pb-2 sm:hidden">
            {platforms.map((p)=>(
              <Link key={p.href} href={p.href} className="whitespace-nowrap rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-stone-700 border border-stone-200">
                {p.label}
              </Link>
            ))}
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        {/* FOOTER - organized, not wall of links */}
        <footer className="mt-16 border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <h3 className={`${fraunces.className} text-sm font-bold`}>SHADOWBANNCHECKER</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  Free, logged-out visibility checks. No login. No API keys. We test public signals only — search suggestion, search, profile, hashtag, comment, recommendation.
                </p>
                <div className="mt-4 flex gap-2">
                  <a href="https://github.com/buypeaky-crypto/xclear" target="_blank" rel="noreferrer" className="rounded-full border px-3 py-1 text-xs font-semibold hover:bg-stone-50">GitHub</a>
                  <span className="text-xs text-stone-500 py-1">Updated Oct 3, 2026</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-stone-900">Checkers</h4>
                <ul className="mt-3 space-y-2 text-sm text-stone-600">
                  <li><Link href="/" className="hover:text-violet-700">X (Twitter) Checker</Link></li>
                  <li><Link href="/instagram" className="hover:text-violet-700">Instagram Checker</Link></li>
                  <li><Link href="/tiktok" className="hover:text-violet-700">TikTok Checker</Link></li>
                  <li><Link href="/facebook-shadowban-checker" className="hover:text-violet-700">Facebook Checker</Link></li>
                  <li><Link href="/youtube" className="hover:text-violet-700">YouTube Checker</Link></li>
                  <li><Link href="/reddit" className="hover:text-violet-700">Reddit Checker</Link></li>
                  <li className="pt-2"><Link href="/checker/twitter" className="font-semibold hover:text-violet-700">All /checker/* tools →</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-stone-900">Company</h4>
                <ul className="mt-3 space-y-2 text-sm text-stone-600">
                  <li><Link href="/about" className="hover:text-violet-700">About</Link></li>
                  <li><Link href="/contact" className="hover:text-violet-700">Contact</Link></li>
                  <li><Link href="/imprint" className="hover:text-violet-700">Imprint</Link></li>
                  <li><Link href="/privacy" className="hover:text-violet-700">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-violet-700">Terms</Link></li>
                  <li><Link href="/cookies" className="hover:text-violet-700">Cookies</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-stone-900">Languages</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {locales.slice(0,12).map((locale: Locale)=>(
                    <Link key={locale} href={getLocaleUrl1(locale)} hrefLang={locale} className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-medium hover:bg-white hover:text-violet-700">
                      {localeNames[locale]}
                    </Link>
                  ))}
                </div>
                <Link href="/about" className="mt-3 inline-block text-xs font-semibold text-violet-700 hover:underline">See all {locales.length} languages →</Link>
              </div>
            </div>

            {/* Collapsible locale groups - reduces footer wall */}
            <details className="mt-10 rounded-lg border border-stone-200 p-4">
              <summary className="cursor-pointer text-sm font-semibold">Instagram & YouTube & TikTok & Facebook by language</summary>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wide">Instagram</h5>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {instagramLocales.map((l)=>(
                      <Link key={l} href={getInstagramUrl(l)} hrefLang={l} className="text-xs text-stone-600 hover:text-violet-700">IG {localeNames[l]}</Link>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wide">YouTube</h5>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {youtubeLocales.map((l)=>(
                      <Link key={l} href={getYouTubeUrl(l)} hrefLang={l} className="text-xs text-stone-600 hover:text-violet-700">YT {l}</Link>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wide">TikTok</h5>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {tiktokLocales.map((l)=>(
                      <Link key={l} href={getTikTokUrl(l)} hrefLang={l} className="text-xs text-stone-600 hover:text-violet-700">TT {l}</Link>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wide">Facebook</h5>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {facebookLocales.map((l)=>(
                      <Link key={l} href={getFacebookUrl(l)} hrefLang={l} className="text-xs text-stone-600 hover:text-violet-700">FB {l}</Link>
                    ))}
                  </div>
                </div>
              </div>
            </details>

            <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-stone-200 pt-6 text-xs text-stone-500 sm:flex-row">
              <p>© {new Date().getFullYear()} shadowban.online — No login, public signals only.</p>
              <p>Built by <a href="https://x.com/gutnews247" target="_blank" rel="noreferrer" className="font-semibold text-stone-700 hover:text-violet-700">@gutnews247</a></p>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
