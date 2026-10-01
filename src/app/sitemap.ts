import type { MetadataRoute } from "next";
import { baseUrl, getLocaleUrl, locales } from "../lib/i18n/config";
import { getInstagramUrl, instagramLocales } from "../lib/i18n/instagram";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [`${baseUrl}/og-image.png`],
    },
    ...["privacy", "terms", "about", "cookies", "contact"].map((page) => ({
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
    {
      url: `${baseUrl}/tiktok`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reddit`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
}