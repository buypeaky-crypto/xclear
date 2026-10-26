import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'ClaudeBot',
          'PerplexityBot',
          'Google-Extended',
          'anthropic-ai',
          'cohere-ai',
          'Mediapartners-Google',
          'AdsBot-Google'
        ],
        allow: '/',
      },
    ],
    sitemap: [
      'https://shadowban.online/sitemap.xml',
      'https://shadowban.site/sitemap.xml'
    ],
    host: 'https://shadowban.online',
  }
}
