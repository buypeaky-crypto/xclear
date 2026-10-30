import type { Metadata } from "next";
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
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

/**
 * Global metadata defaults.
 *
 * Important SEO rule: do not set a root canonical URL here. A canonical of "/"
 * in the root layout can be inherited by child platform pages. Each indexable
 * page should declare its own canonical URL in its server page metadata.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://shadowban.online"),
  applicationName: "Shadowban.online",
  title: {
    default: "Free X Visibility Checker | Shadowban.online",
    template: "%s | Shadowban.online",
  },
  description:
    "Check selected public X profile, search and suggestion signals without your password. Explore separate hashtag and content-pattern tools for other platforms.",
  category: "technology",
  openGraph: {
    title: "Shadowban.online | Social Media Visibility Tools",
    description:
      "Explore platform-specific public visibility diagnostics and local hashtag or content-pattern review tools. Methods and limitations vary by platform.",
    siteName: "Shadowban.online",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Shadowban.online public visibility checker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shadowban.online | Social Media Visibility Tools",
    description:
      "Explore platform-specific public visibility diagnostics and local content-review tools. Methods and limitations vary by platform.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    // Preserve both existing Google Search Console verification values.
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
  { href: "/facebook-shadowban-checker", label: "Facebook", short: "FB" },
  { href: "/youtube", label: "YouTube", short: "YT" },
  { href: "/reddit", label: "Reddit", short: "RD" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FFFBF0] text-stone-900">
        {/*
          Analytics scripts are retained from the existing site setup.
          Verify that Google Analytics and Meta Pixel are consent-gated where
          required by the privacy laws applicable to your visitors.
        */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-F1E42SVH2T"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-F1E42SVH2T');`}
        </Script>
        <Script
          id="google-adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6171869463418529"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        <FacebookPixel />

        <header className="sticky top-0 z-40 border-b border-stone-200/60 bg-[#FFFBF0]/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link
              href="/"
              aria-label="Shadowban.online homepage"
              className={`${fraunces.className} text-[13px] font-black tracking-wide text-violet-700 hover:text-violet-800`}
            >
              SHADOWBAN.ONLINE
            </Link>

            <nav
              aria-label="Platform checkers"
              className="hidden items-center gap-1 sm:flex"
            >
              {platforms.map((platform) => (
                <Link
                  key={platform.href}
                  href={platform.href}
                  className="rounded-full px-3 py-1.5 text-[13px] font-semibold text-stone-700 transition hover:bg-white hover:text-stone-900"
                >
                  {platform.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/about"
                className="hidden rounded-full bg-stone-900 px-4 py-1.5 text-[12px] font-bold text-white transition hover:bg-black sm:block"
              >
                How it works
              </Link>
              <Link
                href="https://x.com/gutnews247"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit the Shadowban.online X profile"
                className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-[12px] font-semibold transition hover:bg-stone-50"
              >
                @gutnews247
              </Link>
            </div>
          </div>

          <nav
            aria-label="Platform checkers"
            className="flex gap-1 overflow-x-auto px-4 pb-2 sm:hidden"
          >
            {platforms.map((platform) => (
              <Link
                key={platform.href}
                href={platform.href}
                className="whitespace-nowrap rounded-full border border-stone-200 bg-white px-3 py-1 text-[12px] font-semibold text-stone-700"
              >
                {platform.label}
              </Link>
            ))}
          </nav>
        </header>

        <main id="main-content" className="flex-1">
          {children}
        </main>

        <footer className="mt-16 border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <h2 className={`${fraunces.className} text-sm font-bold`}>
                  SHADOWBAN.ONLINE
                </h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  Shadowban.online provides selected public visibility checks
                  for X and separate local content or hashtag review tools for
                  other platforms. The methods differ by platform. Results are
                  diagnostic indicators, not official platform decisions.
                </p>
                <div className="mt-4 flex gap-2">
                  <a
                    href="https://github.com/buypeaky-crypto/xclear"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-stone-200 px-3 py-1 text-xs font-semibold transition hover:bg-stone-50"
                  >
                    GitHub
                  </a>
                  <Link
                    href="/about"
                    className="rounded-full border border-stone-200 px-3 py-1 text-xs font-semibold transition hover:bg-stone-50"
                  >
                    Methodology
                  </Link>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-bold text-stone-900">Platforms</h2>
                <ul className="mt-3 space-y-2 text-sm text-stone-600">
                  <li>
                    <Link href="/" className="hover:text-violet-700">
                      X visibility checker
                    </Link>
                  </li>
                  <li>
                    <Link href="/instagram" className="hover:text-violet-700">
                      Instagram hashtag review
                    </Link>
                  </li>
                  <li>
                    <Link href="/tiktok" className="hover:text-violet-700">
                      TikTok content review
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/facebook-shadowban-checker"
                      className="hover:text-violet-700"
                    >
                      Facebook content review
                    </Link>
                  </li>
                  <li>
                    <Link href="/youtube" className="hover:text-violet-700">
                      YouTube content review
                    </Link>
                  </li>
                  <li>
                    <Link href="/reddit" className="hover:text-violet-700">
                      Reddit content review
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-sm font-bold text-stone-900">About</h2>
                <ul className="mt-3 space-y-2 text-sm text-stone-600">
                  <li><Link href="/about" className="hover:text-violet-700">About and methodology</Link></li>
                  <li><Link href="/contact" className="hover:text-violet-700">Contact</Link></li>
                  <li><Link href="/imprint" className="hover:text-violet-700">Imprint</Link></li>
                  <li><Link href="/privacy" className="hover:text-violet-700">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-violet-700">Terms</Link></li>
                  <li><Link href="/cookies" className="hover:text-violet-700">Cookies</Link></li>
                </ul>
              </div>

              <div>
                <h2 className="text-sm font-bold text-stone-900">Languages</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {locales.slice(0, 12).map((locale: Locale) => (
                    <Link
                      key={locale}
                      href={getLocaleUrl1(locale)}
                      hrefLang={locale}
                      className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-medium transition hover:bg-white hover:text-violet-700"
                    >
                      {localeNames[locale]}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/about"
                  className="mt-3 inline-block text-xs font-semibold text-violet-700 hover:underline"
                >
                  Language information
                </Link>
              </div>
            </div>

            <details className="mt-10 rounded-lg border border-stone-200 p-4">
              <summary className="cursor-pointer text-sm font-semibold">
                Platform pages by language
              </summary>
              <div className="mt-4 grid gap-6 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide">Instagram</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {instagramLocales.map((locale) => (
                      <Link
                        key={locale}
                        href={getInstagramUrl(locale)}
                        hrefLang={locale}
                        className="text-xs text-stone-600 hover:text-violet-700"
                      >
                        IG {localeNames[locale] ?? locale}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide">YouTube</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {youtubeLocales.map((locale) => (
                      <Link
                        key={locale}
                        href={getYouTubeUrl(locale)}
                        hrefLang={locale}
                        className="text-xs text-stone-600 hover:text-violet-700"
                      >
                        YT {localeNames[locale] ?? locale}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide">TikTok</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tiktokLocales.map((locale) => (
                      <Link
                        key={locale}
                        href={getTikTokUrl(locale)}
                        hrefLang={locale}
                        className="text-xs text-stone-600 hover:text-violet-700"
                      >
                        TT {localeNames[locale] ?? locale}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide">Facebook</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {facebookLocales.map((locale) => (
                      <Link
                        key={locale}
                        href={getFacebookUrl(locale)}
                        hrefLang={locale}
                        className="text-xs text-stone-600 hover:text-violet-700"
                      >
                        FB {localeNames[locale] ?? locale}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </details>

            <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-stone-200 pt-6 text-xs text-stone-500 sm:flex-row">
              <p>
                © {new Date().getFullYear()} Shadowban.online. Independent
                diagnostic tools; not affiliated with the listed platforms.
              </p>
              <p>
                Built by{" "}
                <a
                  href="https://x.com/gutnews247"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-stone-700 hover:text-violet-700"
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
