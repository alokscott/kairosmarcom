import type { MetadataRoute } from 'next'
import { cases } from '@/content/cases'
import { site } from '@/content/site'

/** Every route in the sitemap is a real, linked page — there are no orphans. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const url = (path: string) => new URL(path, site.url).toString()

  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1, changeFrequency: 'monthly' },
    { path: '/work', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/services', priority: 0.8, changeFrequency: 'yearly' },
    { path: '/process', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/about', priority: 0.6, changeFrequency: 'yearly' },
    { path: '/films', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.9, changeFrequency: 'yearly' },
    { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.2, changeFrequency: 'yearly' },
  ]

  return [
    ...staticRoutes.map((r) => ({
      url: url(r.path),
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...cases.map((c) => ({
      url: url(`/work/${c.slug}`),
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
  ]
}
