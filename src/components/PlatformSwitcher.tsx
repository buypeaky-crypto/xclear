
import Link from "next/link";

import {
  getLocaleUrl,
  locales,
  type Locale,
} from "../lib/i18n/config";

import {
  getInstagramUrl,
  instagramLocales,
  type InstagramLocale,
} from "../lib/i18n/instagram";

import {
  getTikTokUrl,
  tiktokLocales,
  type TikTokLocale,
} from "../lib/i18n/tiktok";

import {
  getFacebookUrl,
  facebookLocales,
  type FacebookLocale,
} from "../lib/i18n/facebook";

import {
  getYouTubeUrl,
  youtubeLocales,
  type YouTubeLocale,
} from "../lib/i18n/youtube";

type Platform =
  | "x"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "reddit"
  | "youtube";

function includesLocale<T extends readonly string[]>(
  values: T,
  locale: string
): locale is T[number] {
  return (values as readonly string[]).includes(locale);
}

function getPlatformHref(
  platform: Platform,
  locale: string
): string {
  switch (platform) {
    case "x":
      return includesLocale(locales, locale)
        ? getLocaleUrl(locale as Locale)
        : "/";

    case "instagram":
      return includesLocale(instagramLocales, locale)
        ? getInstagramUrl(locale as InstagramLocale)
        : "/instagram";

    case "tiktok":
      return includesLocale(tiktokLocales, locale)
        ? getTikTokUrl(locale as TikTokLocale)
        : "/tiktok";

    case "facebook":
      return includesLocale(facebookLocales, locale)
        ? getFacebookUrl(locale as FacebookLocale)
        : "/facebook-shadowban-checker";

    case "youtube":
      if (locale === "en") return "/youtube";

      return includesLocale(youtubeLocales, locale)
        ? getYouTubeUrl(locale as YouTubeLocale)
        : "/youtube";

    case "reddit":
      return "/reddit";

    default:
      return "/";
  }
}

export default function PlatformSwitcher({
  activePlatform,
  locale = "en",
}: {
  activePlatform: Platform;
  locale?: string;
}) {
  const platforms: {
    label: string;
    platform: Platform;
  }[] = [
    { label: "X (Twitter)", platform: "x" },
    { label: "Instagram", platform: "instagram" },
    { label: "TikTok", platform: "tiktok" },
    { label: "Facebook", platform: "facebook" },
    { label: "YouTube", platform: "youtube" },
    { label: "Reddit", platform: "reddit" },
  ];

  return (
    <nav
      aria-label="Choose checker"
      className="mt-7 inline-flex max-w-full flex-wrap justify-center gap-1 rounded-full border border-stone-300 bg-white p-1"
    >
      {platforms.map((item) => {
        const isActive = item.platform === activePlatform;

        return (
          <Link
            key={item.platform}
            href={getPlatformHref(item.platform, locale)}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 ${
              isActive
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:bg-amber-50 hover:text-stone-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
