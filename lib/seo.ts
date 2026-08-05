import type { Metadata } from 'next'
import type { CaseStudy, Film } from '@/content/types'
import { faqs, services, site } from '@/content/site'

const abs = (path: string) => new URL(path, site.url).toString()

/** Default social image. Migrated from the source site; replace when new art is approved. */
export const OG_FALLBACK = '/og-cover.jpg'

export function pageMeta({
  title,
  description,
  path,
  image = OG_FALLBACK,
}: {
  title: string
  description: string
  path: string
  image?: string | null
}): Metadata {
  const url = abs(path)
  const og = abs(image ?? OG_FALLBACK)
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: 'en_IN',
      url,
      title,
      description,
      images: [{ url: og, width: 1200, height: 630, alt: `${site.name} — ${title}` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [og] },
  }
}

/* ---------------------------------------------------------------- */
/* Structured data                                                    */
/* ---------------------------------------------------------------- */

export const organizationLd = () => ({
  '@type': 'ProfessionalService',
  '@id': `${site.url}/#org`,
  name: site.name,
  url: site.url,
  description: site.description,
  slogan: site.tagline,
  foundingDate: site.foundingDate,
  email: site.email,
  telephone: site.phone,
  address: {
    '@type': 'PostalAddress',
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    addressCountry: site.address.country,
  },
  sameAs: Object.values(site.social),
  areaServed: 'Worldwide',
  knowsAbout: services.map((s) => s.name),
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '10:00',
    closes: '19:00',
  },
})

export const breadcrumbLd = (trail: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: abs(item.path),
  })),
})

export const faqLd = () => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
})

export const serviceLd = () =>
  services.map((s) => ({
    '@type': 'Service',
    name: s.name,
    description: s.blurb,
    provider: { '@id': `${site.url}/#org` },
    serviceType: s.name,
    areaServed: 'Worldwide',
  }))

/**
 * A case study is a CreativeWork, not a Product or Review — it is our account of a
 * project, and marking it up as a rated product would misrepresent client-reported
 * figures as independently verified ones.
 */
export const caseLd = (c: CaseStudy) => ({
  '@type': 'CreativeWork',
  '@id': abs(`/work/${c.slug}#case`),
  name: `${c.client} — ${c.projectTitle}`,
  headline: c.summary,
  description: c.clientDescription,
  url: abs(`/work/${c.slug}`),
  creator: { '@id': `${site.url}/#org` },
  about: c.industry ?? undefined,
  keywords: [...c.tags, c.industry].filter(Boolean).join(', '),
  ...(c.heroImage ? { image: abs(c.heroImage.src) } : {}),
})

export const videoLd = (f: Film) => {
  if (!f.youtubeId) return null
  return {
    '@type': 'VideoObject',
    name: f.title,
    description: [f.category, f.client].filter(Boolean).join(' — '),
    thumbnailUrl: `https://img.youtube.com/vi/${f.youtubeId}/hqdefault.jpg`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${f.youtubeId}`,
    contentUrl: `https://www.youtube.com/watch?v=${f.youtubeId}`,
    ...(f.year ? { uploadDate: `${f.year}-01-01` } : {}),
    publisher: { '@id': `${site.url}/#org` },
  }
}

/** Wraps nodes in a single @graph so each page emits one script tag. */
export const graph = (...nodes: (object | null)[]) =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes.flat().filter(Boolean) })
