
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  getLocaleUrl1,
  localeNames,
  locales,
  type Locale,
} from "@/lib/i18n/config";
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
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

// Safe locale label helper.
// Some platform locale lists contain languages that are not
// present in the shared localeNames configuration.
function getLocaleLabel(code: string): string {
  const match = Object.entries(localeNames).find(
    ([locale]) => locale === code
  );

  return match?.[1] ?? code.toUpperCase();
}

// Global metadata defaults.
// Individual pages should override their own titles,
// descriptions, Open Graph metadata and canonical URLs.
export const metadata: Metadata = {
  metadataBase: new URL("https://shadowban.online"),

  title: {
    default: "Free Social Media Visibility Checker Tools | Shadowban.online",
    template: "%s | Shadowban.online",
  },

  description:
    "Investigate public X profile, search and suggestion signals, or review submitted content patterns for Instagram, TikTok, YouTube, Facebook and Reddit. Free tools, no social media password required. Results are diagnostic, not official platform decisions.",

  applicationName: "Shadowban.online",

  openGraph: {
    title: "Social Media Visibility Checker Tools | Shadowban.online",
    description:
      "Investigate public X visibility signals and review social media content patterns. Free tools with transparent methodology and no social media password required.",
    siteName: "Shadowban.online",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Shadowban.online social media visibility checker",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Social Media Visibility Tools | Shadowban.online",
    description:
      "Investigate public X visibility signals and review content patterns across social media platforms. No social media password required.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  verification: {
    google: [
      "DRtfSf9yGJLU9W5mRINhothV-pO9npwwtIzmK2J5ziY",
      "VeO9Qolz-C_gaivC8zVhRT-b_ORLKIk9nahiW9UJNtk",
    ],
  },
};

const platforms = [
  { href: "/", label: "X (Twitter)", short: "X" },
  { href: "/instagram", label: "Instagram", short: "IG" },
  { href: "/tiktok", label: "TikTok", short: "TT" },
  {
    href: "/facebook-shadowban-checker",
    label: "Facebook",
    short: "FB",
  },
  { href: "/youtube", label: "YouTube", short: "YT" },
  { href: "/reddit", label: "Reddit", short: "RD" },
];

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-F1E42SVH2T"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-F1E42SVH2T');
          `}
        </Script>

        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6171869463418529"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>

      <body className="min-h-full flex flex-col bg-[#FFFBF0] text-stone-900">
        <FacebookPixel />

        {/* Primary navigation */}
        <header className="sticky top-0 z-40 border-b border-stone-200/60 bg-[#FFFBF0]/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link
              href="/"
              aria-label="Shadowban.online homepage"
              className={`${fraunces.className} whitespace-nowrap text-sm font-black tracking-wide text-violet-700 transition hover:text-violet-900`}
            >
              SHADOWBAN.ONLINE
            </Link>

            <nav
              aria-label="Social media platforms"
              className="hidden items-center gap-1 sm:flex"
            >
              {platforms.map((platform) => (
                <Link
                  key={platform.href}
                  href={platform.href}
                  className="rounded-full px-3 py-2 text-[13px] font-semibold text-stone-700 transition hover:bg-white hover:text-stone-950"
                >
                  {platform.label}
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/checker/twitter"
                className="hidden rounded-full bg-stone-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-black sm:block"
              >
                All Checkers
              </Link>

              <Link
                href="https://x.com/gutnews247"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit the Shadowban.online X profile"
                className="rounded-full border border-stone-300 bg-white px-3 py-2 text-xs font-semibold transition hover:bg-stone-50"
              >
                @gutnews247
              </Link>
            </div>
          </div>

          {/* Mobile platform navigation */}
          <nav
            aria-label="Mobile social media platforms"
            className="flex gap-2 overflow-x-auto px-4 pb-3 sm:hidden"
          >
            {platforms.map((platform) => (
              <Link
                key={platform.href}
                href={platform.href}
                className="whitespace-nowrap rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-100"
              >
                {platform.label}
              </Link>
            ))}
          </nav>
        </header>

        {/* Main page content */}
        <main id="main-content" className="flex-1">
          {children}
        </main>

        {/* Global footer */}
        <footer className="mt-16 border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
              {/* Brand */}
              <div>
                <Link
                  href="/"
                  className={`${fraunces.className} text-sm font-bold text-violet-800`}
                >
                  SHADOWBAN.ONLINE
                </Link>

                <p className="mt-3 text-sm leading-6 text-stone-600">
                  Independent social media diagnostic tools.
                  Check selected public X visibility signals
                  and review submitted content patterns on
                  other platforms. No social media password
                  required. Results explain their limitations.
                </p>

                <div className="mt-4 flex gap-2">
                  <a
                    href="https://github.com/buypeaky-crypto/xclear"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold transition hover:bg-stone-50"
                  >
                    GitHub
                  </a>
                </div>
              </div>

              {/* Checker links */}
              <nav aria-label="Checker tools">
                <h2 className="text-sm font-bold text-stone-900">
                  Checker tools
                </h2>

                <ul className="mt-3 space-y-2 text-sm text-stone-600">
                  <li>
                    <Link href="/" className="transition hover:text-violet-700">
                      X Visibility Checker
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/instagram"
                      className="transition hover:text-violet-700"
                    >
                      Instagram Hashtag Review
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/tiktok"
                      className="transition hover:text-violet-700"
                    >
                      TikTok Content Review
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/facebook-shadowban-checker"
                      className="transition hover:text-violet-700"
                    >
                      Facebook Content Review
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/youtube"
                      className="transition hover:text-violet-700"
                    >
                      YouTube Content Review
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/reddit"
                      className="transition hover:text-violet-700"
                    >
                      Reddit Content Review
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Company links */}
              <nav aria-label="Company information">
                <h2 className="text-sm font-bold text-stone-900">
                  Company
                </h2>

                <ul className="mt-3 space-y-2 text-sm text-stone-600">
                  <li>
                    <Link href="/about" className="transition hover:text-violet-700">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="transition hover:text-violet-700">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/imprint" className="transition hover:text-violet-700">
                      Imprint
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="transition hover:text-violet-700">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="transition hover:text-violet-700">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookies" className="transition hover:text-violet-700">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Languages */}
              <nav aria-label="Available languages">
                <h2 className="text-sm font-bold text-stone-900">
                  Languages
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {locales.slice(0, 12).map((locale: Locale) => (
                    <Link
                      key={locale}
                      href={getLocaleUrl1(locale)}
                      hrefLang={locale}
                      lang={locale}
                      className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-[11px] font-medium transition hover:bg-white hover:text-violet-700"
                    >
                      {getLocaleLabel(locale)}
                    </Link>
                  ))}
                </div>

                <Link
                  href="/about"
                  className="mt-3 inline-block text-xs font-semibold text-violet-700 transition hover:underline"
                >
                  Explore available languages →
                </Link>
              </nav>
            </div>

            {/* Platform-specific language links */}
            <details className="mt-10 rounded-xl border border-stone-200 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-stone-800">
                Explore platform tools by language
              </summary>

              <div className="mt-5 grid gap-6 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-stone-800">
                    Instagram
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
                    {instagramLocales.map((locale) => (
                      <Link
                        key={locale}
                        href={getInstagramUrl(locale)}
                        hrefLang={locale}
                        className="text-xs text-stone-600 transition hover:text-violet-700"
                      >
                        IG {getLocaleLabel(locale)}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-stone-800">
                    YouTube
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
                    {youtubeLocales.map((locale) => (
                      <Link
                        key={locale}
                        href={getYouTubeUrl(locale)}
                        hrefLang={locale}
                        className="text-xs text-stone-600 transition hover:text-violet-700"
                      >
                        YT {getLocaleLabel(locale)}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-stone-800">
                    TikTok
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
                    {tiktokLocales.map((locale) => (
                      <Link
                        key={locale}
                        href={getTikTokUrl(locale)}
                        hrefLang={locale}
                        className="text-xs text-stone-600 transition hover:text-violet-700"
                      >
                        TT {getLocaleLabel(locale)}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-stone-800">
                    Facebook
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
                    {facebookLocales.map((locale) => (
                      <Link
                        key={locale}
                        href={getFacebookUrl(locale)}
                        hrefLang={locale}
                        className="text-xs text-stone-600 transition hover:text-violet-700"
                      >
                        FB {getLocaleLabel(locale)}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </details>

            {/* Copyright */}
            <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-stone-200 pt-6 text-xs text-stone-500 sm:flex-row">
              <p>
                © {new Date().getFullYear()} Shadowban.online.
                Independent diagnostic tools.
              </p>

              <p>
                Built by{" "}
                <a
                  href="https://x.com/gutnews247"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-stone-700 transition hover:text-violet-700"
                >
                  @gutnews247
                </a>
              </p>
            </div>
          </div>
        </footer>

        <Analytics />
      </body>
    </html>
  );
}
