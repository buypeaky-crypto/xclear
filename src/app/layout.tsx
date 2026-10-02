import type { Metadata } from "next";
import Link from "next/link";
import { baseUrl, getLanguageAlternates, getLocaleUrl, localeNames, locales } from "../lib/i18n/config";
import { getInstagramUrl, instagramLocales } from "../lib/i18n/instagram";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import FacebookPixel from "./components/FacebookPixel";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Twitter Shadowban Test 2026 | 100% Free & Instant Check",
  description:
    "Free Twitter shadowban checker. Instantly test your account for search bans, ghost bans, and reply deboosting without logging in.",
  keywords: [
    "twitter shadowban checker",
    "Instagram shadowban checker",
    "TikTok shadowban checker",
    "Reddit shadowban checker",
    "shadowban checker",
    "twitter shadowban test",
    "X shadowban checker",
    "check Twitter account status",
  ],
  alternates: {
    canonical: `${baseUrl}/`,
    languages: getLanguageAlternates(),
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shadowbannchecker.vercel.app/",
    siteName: "ShadowbanChecker",
    title: "Twitter Shadowban Test 2026 | 100% Free & Instant Check",
    description: "Free Twitter shadowban checker. Instantly test your account for search bans, ghost bans, and reply deboosting without logging in.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Shadowban Checker for Twitter, Instagram, TikTok, and Reddit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Twitter Shadowban Test 2026 | 100% Free & Instant Check",
    description: "Free Twitter shadowban checker. Instantly test your account for search bans, ghost bans, and reply deboosting without logging in.",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-F1E42SVH2T"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-F1E42SVH2T');`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <FacebookPixel />
        {children}
        <footer className="border-t border-stone-200 bg-[#FFFBEB] text-stone-600">
          <nav
            aria-label="Legal and site information"
            className="mx-auto flex max-w-4xl flex-wrap justify-center gap-x-6 gap-y-3 px-4 py-6 text-sm"
          >
            <Link className="transition-colors hover:text-violet-700" href="/privacy">Privacy</Link>
            <Link className="transition-colors hover:text-violet-700" href="/terms">Terms</Link>
            <Link className="transition-colors hover:text-violet-700" href="/about">About</Link>
            <Link className="transition-colors hover:text-violet-700" href="/cookies">Cookies</Link>
            <Link className="transition-colors hover:text-violet-700" href="/contact">Contact</Link>
          </nav>
          <nav
            aria-label="Choose language"
            className="mx-auto flex max-w-4xl flex-wrap justify-center gap-x-5 gap-y-3 px-4 pb-6 text-sm"
          >
            {locales.map((locale) => (
              <Link
                key={locale}
                className="transition-colors hover:text-violet-700"
                href={getLocaleUrl(locale)}
                hrefLang={locale}
              >
                {localeNames[locale]}
              </Link>
            ))}
          </nav>
          <nav
            aria-label="Instagram checker by language"
            className="mx-auto flex max-w-4xl flex-wrap justify-center gap-x-5 gap-y-3 px-4 pb-6 text-sm"
          >
            {instagramLocales.map((locale) => (
              <Link
                key={locale}
                className="transition-colors hover:text-violet-700"
                href={getInstagramUrl(locale)}
                hrefLang={locale}
              >
                Instagram · {localeNames[locale]}
              </Link>
            ))}
          </nav>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
