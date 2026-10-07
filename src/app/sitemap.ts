import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://shadowbannchecker.vercel.app'

  const checkerPages = [
    '',
    'instagram',
    'tiktok',
    'twitter',
    'youtube',
    'reddit',
    'facebook',
    'facebook-shadowban-checker',
    'youtube-shadowban-checker',
    'instagram-shadowban-checker',
    'de',
    'de/instagram-shadowban-test',
    'de/shadowban-test',
    'it/test-shadowban',
    'it/test-shadowban-instagram',
    'pt/teste-shadowban',
    'th/check-shadowban',
    'id/cek-shadowban',
  ]

  const entries: MetadataRoute.Sitemap = [
    ...checkerPages.map((p) => ({
      url: `${baseUrl}/${p}`.replace(/\/$/, '') || baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: p === '' ? 1 : 0.9,
    })),
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/imprint`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
  ]

  // de-duplicate
  return Array.from(new Map(entries.map(e => [e.url, e])).values())
}