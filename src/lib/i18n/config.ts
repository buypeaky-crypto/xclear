export const baseUrl = "https://shadowbannchecker.vercel.app";

export const locales = ["en", "de", "id", "pt", "es", "it", "th"] as const;

export type Locale = (typeof locales)[number];

export const localeSlugs: Record<Locale, string> = {
  en: "",
  de: "de/shadowban-test",
  id: "id/cek-shadowban",
  pt: "pt/teste-shadowban",
  es: "es/comprobar-shadowban",
  it: "it/test-shadowban",
  th: "th/check-shadowban",
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  id: "Bahasa Indonesia",
  pt: "Português",
  es: "Español",
  it: "Italiano",
  th: "ไทย",
};

export function getLocaleUrl(locale: Locale): string {
  const slug = localeSlugs[locale];
  return slug ? `${baseUrl}/${slug}` : `${baseUrl}/`;
}

export function getLanguageAlternates(): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((locale) => [locale, getLocaleUrl(locale)])),
    "x-default": getLocaleUrl("en"),
  };
}

export function getEnglishLanguageAlternates(path: string): Record<string, string> {
  const url = `${baseUrl}${path}`;
  return { en: url, "x-default": url };
}