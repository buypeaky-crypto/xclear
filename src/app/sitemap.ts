import type { MetadataRoute } from 'next'

// 20+ langs you already support
const langs = ['en','es','fr','de','it','pt','nl','pl','tr','ar','hi','id','ja','ko','ru','zh','vi','th','ro','sv'] as const

const platforms = [
  '', // home = X checker
  '/twitter-shadowban-checker',
  '/instagram-shadowban-checker',
  '/tiktok-shadowban-checker',
  '/youtube-shadowban-checker',
  '/faq',
  '/docs/what-we-check',
  '/docs/recovery'
]

const baseUrl = 'https://shadowban.online'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const lang of langs) {
    for (const path of platforms) {
      const isRoot = path === ''
      const url = isRoot 
        ? (lang === 'en' ? baseUrl : `${baseUrl}/${lang}`)
        : (lang === 'en' ? `${baseUrl}${path}` : `${baseUrl}/${lang}${path}`)

      // hreflang alternates
      const languages: Record<string, string> = {}
      for (const l of langs) {
        const altPath = isRoot ? (l === 'en' ? '' : `/${l}`) : (l === 'en' ? path : `/${l}${path}`)
        languages[l] = `${baseUrl}${altPath}`
      }
      languages['x-default'] = `${baseUrl}${path}`

      entries.push({
        url,
        lastModified: now,
        changeFrequency: path === '' ? 'hourly' : 'weekly',
        priority: isRoot ? 1 : path.includes('twitter') || path.includes('instagram') ? 0.9 : 0.7,
        alternates: { languages }
      })
    }
  }

  return entries
}
