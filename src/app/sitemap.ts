
import type { MetadataRoute } from "next";

import { baseUrl, getLocaleUrl, locales } from "@/lib/i18n/config";
import {
  getInstagramUrl,
  instagramLocales,
} from "@/lib/i18n/instagram";
import {
  getTikTokUrl,
  tiktokLocales,
} from "@/lib/i18n/tiktok";
import {
  getFacebookUrl,
  facebookLocales,
} from "@/lib/i18n/facebook";
import {
  getYouTubeUrl,
  youtubeLocales,
} from "@/lib/i18n/youtube";

type LocalizedRoute = {
  locale: string;
  url: string;
};

type SitemapEntry = MetadataRoute.Sitemap[number];

function createLocalizedEntries(
  routes: readonly LocalizedRoute[],
  priority: number,
): MetadataRoute.Sitemap {
  const languages: Record<string, string> = Object.fromEntries(
    routes.map(({ locale, url }) => [locale, url]),
  );

  const defaultUrl =
    routes.find(({ locale }) => locale === "en")?.url;

  if (defaultUrl) {
    languages["x-default"] = defaultUrl;
  }

  return routes.map(({ url }) => ({
    url,
    changeFrequency: "weekly",
    priority,
    alternates: {
      languages,
    },
  }));
}

function createRouteGroup(
  supportedLocales: readonly string[],
  getUrl: (locale: never) => string,
): LocalizedRoute[] {
  return supportedLocales.map((locale) => ({
    locale,
    url: getUrl(locale as never),
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const xRoutes: LocalizedRoute[] = locales.map((locale) => ({
    locale,
    url:
      locale === "en"
        ? `${baseUrl}/`
        : getLocaleUrl(locale),
  }));

  const instagramRoutes = createRouteGroup(
    instagramLocales,
    getInstagramUrl as (locale: never) => string,
  );

  const tiktokRoutes = createRouteGroup(
    tiktokLocales,
    getTikTokUrl as (locale: never) => string,
  );

  const facebookRoutes = createRouteGroup(
    facebookLocales,
    getFacebookUrl as (locale: never) => string,
  );

  const youtubeRoutes = createRouteGroup(
    youtubeLocales,
    getYouTubeUrl as (locale: never) => string,
  );

  const localizedEntries = [
    ...createLocalizedEntries(xRoutes, 1.0),
    ...createLocalizedEntries(instagramRoutes, 0.85),
    ...createLocalizedEntries(tiktokRoutes, 0.85),
    ...createLocalizedEntries(facebookRoutes, 0.85),
    ...createLocalizedEntries(youtubeRoutes, 0.85),
  ];

  // These are the canonical checker routes.
  // The direct /tiktok and /reddit pages point to these URLs.
  const canonicalCheckerRoutes: SitemapEntry[] = [
    {
      url: `${baseUrl}/checker/tiktok`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/checker/reddit`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ];

  // These pages currently have no equivalent translated versions.
  const informationalPaths = [
    "/about",
    "/contact",
    "/cookies",
    "/imprint",
    "/privacy",
    "/terms",
  ];

  const informationalEntries: SitemapEntry[] =
    informationalPaths.map((path) => ({
      url: new URL(path, baseUrl).toString(),
      changeFrequency: "monthly",
      priority: path === "/about" ? 0.6 : 0.4,
    }));

  // Include the corrected canonical blog article.
 // Rewrite aliases and non-canonical duplicate checker routes
// remain intentionally excluded.

  const uniqueEntries = new Map<string, SitemapEntry>();

  const blogEntry: SitemapEntry = {
  url: `${baseUrl}/blog/what-is-shadowban`,
  changeFrequency: "monthly",
  priority: 0.7,
};

for (const entry of [
  ...localizedEntries,
  ...canonicalCheckerRoutes,
  ...informationalEntries,
  blogEntry,
]) {
  uniqueEntries.set(entry.url, entry);
}

return Array.from(uniqueEntries.values());
}
