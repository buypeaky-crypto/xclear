import type { Metadata } from "next";
import { baseUrl, getLanguageAlternates, getLocaleUrl, type Locale } from "./config";
import { dictionaries } from "./dictionaries";

type LocalizedLocale = Exclude<Locale, "en">;

export function getLocaleMetadata(locale: LocalizedLocale): Metadata {
  const dictionary = dictionaries[locale];

  return {
    title: dictionary.title,
    description: dictionary.description,
    keywords: dictionary.keywords,
    alternates: {
      canonical: getLocaleUrl(locale),
      languages: getLanguageAlternates(),
    },
    openGraph: {
      type: "website",
      url: getLocaleUrl(locale),
      siteName: "ShadowbannChecker",
      title: dictionary.title,
      description: dictionary.description,
      locale,
    },
    metadataBase: new URL(baseUrl),
  };
}