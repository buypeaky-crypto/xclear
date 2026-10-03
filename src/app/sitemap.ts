import type { MetadataRoute } from "next";
import { baseUrl, getLocaleUrl, locales } from "../lib/i18n/config";
import { getInstagramUrl, instagramLocales } from "../lib/i18n/instagram";
import { facebookLocales, getFacebookUrl } from "../lib/i18n/facebook";
import { getTikTokUrl, tiktokLocales } from "../lib/i18n/tiktok";
import { getYouTubeUrl, youtubeLocales } from "../lib/i18n/youtube";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [`${baseUrl}/og-image.png`],
    },
    ...["privacy", "terms", "about", "cookies", "contact", "imprint"].map((page) => ({
      url: `${baseUrl}/${page}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...locales.filter((locale) => locale !== "en").map((locale) => ({
      url: getLocaleUrl(locale),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    ...instagramLocales.map((locale) => ({
      url: getInstagramUrl(locale),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    ...facebookLocales.map((locale) => ({
      url: getFacebookUrl(locale),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    ...tiktokLocales.map((locale) => ({
      url: getTikTokUrl(locale),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    ...youtubeLocales.map((locale) => ({
      url: getYouTubeUrl(locale),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    {
      url: `${baseUrl}/reddit`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...[
      "twitter-shadowban-checker",
      "x-shadowban-checker",
      "twitter",
      "instagram-shadowban-checker",
      "tiktok-shadowban-checker",
      "reddit-shadowban-checker",
      "facebook",
      "youtube",
      "youtube-shadowban-checker",
    ].map((alias) => ({
      url: `${baseUrl}/${alias}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    { url: `${baseUrl}/imprint`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
  { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
  { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },];

  return Array.from(new Map(entries.map((entry) => [entry.url, entry])).values());
}