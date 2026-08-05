import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DepthTracker, Reveal } from '@/components/motion/Reveal'
import { Scene } from '@/components/three/Scene'
import CaseNav from '@/components/work/CaseNav'
import CaseCard from '@/components/work/CaseCard'
import MetricChart from '@/components/work/MetricChart'
import EditorialFlags from '@/components/work/EditorialFlags'
import { caseBySlug, caseNeighbours, cases, relatedCases } from '@/content/cases'
import { serviceById } from '@/content/site'
import type { CaseStudy } from '@/content/types'
import { breadcrumbLd, caseLd, graph, pageMeta } from '@/lib/seo'

export const dynamicParams = false

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const study = caseBySlug(slug)
  if (!study) return {}
  return pageMeta({
    title: study.seo.title,
    description: study.seo.description,
    path: `/work/${study.slug}`,
    image: study.seo.socialImage,
  })
}

/** Only the sections this study actually has get an anchor. */
function navItems(study: CaseStudy) {
  return [
    { id: 'overview', label: 'Overview' },
    { id: 'objective', label: 'Objective' },
    ...(study.challenge.length ? [{ id: 'challenge', label: 'Challenge' }] : []),
    ...(study.insight ? [{ id: 'insight', label: 'Insight' }] : []),
    { id: 'strategy', label: 'What we did' },
    ...(study.deliverables.length ? [{ id: 'deliverables', label: 'Delivered' }] : []),
    { id: 'results', label: 'Results' },
    ...(study.charts.length ? [{ id: 'numbers', label: 'The numbers' }] : []),
    ...(study.gallery.length ? [{ id: 'gallery', label: 'Gallery' }] : []),
    { id: 'services', label: 'Services' },
    { id: 'next', label: 'Next project' },
  ]
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const study = caseBySlug(slug)
  if (!study) notFound()

  const { previous, next } = caseNeighbours(slug)
  const related = relatedCases(slug)
  const items = navItems(study)

  return (
    <article data-accent={study.accent}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph(
            caseLd(study),
            breadcrumbLd([
              { name: 'Home', path: '/' },
              { name: 'Work', path: '/work' },
              { name: study.client, path: `/work/${study.slug}` },
            ])
          ),
        }}
      />
      <DepthTracker slug={study.slug} />

      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden pt-36 pb-16">
        <Scene preset={study.scene} accent={study.accent} />

        <div className="shell relative">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs">
            <ol className="m-0 flex list-none flex-wrap gap-2 p-0" style={{ color: 'var(--fg-faint)' }}>
              <li>
                <Link href="/" className="link-underline">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/work" className="link-underline">
                  Work
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{study.client}</li>
            </ol>
          </nav>

          <Reveal>
            <p className="eyebrow mb-5">
              {[study.industry, study.location].filter(Boolean).join(' · ') || study.projectTitle}
            </p>
            <h1
              className="max-w-[14ch] text-[length:var(--text-display)]"
              style={{ viewTransitionName: `case-${study.slug}` }}
            >
              {study.client}
            </h1>
          </Reveal>

          <div className="mt-10 grid-editorial items-start">
            <Reveal delay={120} className="col-span-4 md:col-span-6">
              <p className="text-[length:var(--text-lead)] leading-relaxed">{study.clientDescription}</p>

              <ul className="mt-7 m-0 flex list-none flex-wrap gap-2 p-0">
                {study.tags.map((tag) => (
                  <li
                    key={tag}
                    className="px-3 py-1.5 text-xs"
                    style={{ border: '1px solid var(--rule)', color: 'var(--fg-muted)' }}
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              {study.duration && (
                <p className="faint mt-5 text-sm">
                  <span className="tracking-[0.14em] uppercase">Duration</span> — {study.duration}
                </p>
              )}
            </Reveal>

            {study.headline.length > 0 && (
              <Reveal delay={200} className="col-span-4 md:col-span-5 md:col-start-8">
                <dl className="m-0 space-y-5 border-t pt-6" style={{ borderColor: 'var(--rule)' }}>
                  {study.headline.map((stat) => (
                    <div key={stat.label}>
                      <dt className="sr-only">{stat.label}</dt>
                      <dd className="m-0">
                        <span
                          className="mono-num block font-[family-name:var(--font-display)] text-[clamp(2rem,4.5vw,3.25rem)] font-black leading-none tracking-tight"
                          style={{ color: 'var(--accent-text)' }}
                        >
                          {stat.value}
                        </span>
                        <span className="muted mt-1.5 block text-sm">{stat.label}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}
          </div>

          {/* The hero art slot. Empty by design until approved assets exist. */}
          {study.heroImage && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={study.heroImage.src}
              alt={study.heroImage.alt}
              width={study.heroImage.width}
              height={study.heroImage.height}
              className="mt-14 w-full"
              sizes="100vw"
            />
          )}
        </div>
      </section>

      <EditorialFlags study={study} />

      {/* ---------------- Body ---------------- */}
      <div className="shell">
        <div className="grid-editorial items-start">
          <div className="col-span-4 md:col-span-3 lg:col-span-2">
            <CaseNav items={items} />
          </div>

          <div className="col-span-4 md:col-span-9 lg:col-span-9 lg:col-start-4">
            <Block id="overview" number="01" title="Overview">
              <p className="text-[length:var(--text-lead)] leading-relaxed">{study.summary}</p>
              {study.channels.length > 0 && (
                <p className="muted mt-4 text-sm">
                  Channels run by Kairos:{' '}
                  {study.channels.map((c, i) => (
                    <span key={c.handle}>
                      {i > 0 ? ', ' : ''}
                      {c.platform} <span className="faint">{c.handle}</span>
                    </span>
                  ))}
                  .
                </p>
              )}
            </Block>

            <Block id="objective" number="02" title="Objective">
              <PointList items={study.objective} />
            </Block>

            {study.challenge.length > 0 && (
              <Block id="challenge" number="03" title="Brand challenge">
                <PointList items={study.challenge} />
              </Block>
            )}

            {study.insight && (
              <Block id="insight" number="04" title="Insight">
                <p className="statement max-w-[36ch]">{study.insight}</p>
              </Block>
            )}

            <Block id="strategy" number="05" title="What we did">
              <PointList items={study.strategy} />
            </Block>

            {study.deliverables.length > 0 && (
              <Block id="deliverables" number="06" title="What we delivered">
                <PointList items={study.deliverables} />
              </Block>
            )}

            <Block id="results" number="07" title="Impact">
              <PointList items={study.results} />
            </Block>

            {study.charts.length > 0 && (
              <Block id="numbers" number="08" title="The numbers">
                <div className="flex flex-col gap-14">
                  {study.charts.map((chart) => (
                    <MetricChart key={chart.id} chart={chart} />
                  ))}
                </div>

                {study.metricSource && (
                  <div className="mt-10 border-t pt-5" style={{ borderColor: 'var(--rule)' }}>
                    <h3 className="text-xs tracking-[0.14em] uppercase" style={{ color: 'var(--fg-faint)' }}>
                      Where these come from
                    </h3>
                    <p className="muted mt-2 max-w-[68ch] text-sm leading-relaxed">{study.metricSource}</p>
                  </div>
                )}
              </Block>
            )}

            {study.gallery.length > 0 && (
              <Block id="gallery" number="09" title="Gallery">
                <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
                  {study.gallery.map((item) => (
                    <li key={item.src}>
                      <figure className="m-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.src}
                          alt={item.alt}
                          width={item.width}
                          height={item.height}
                          loading="lazy"
                          decoding="async"
                          className="w-full"
                        />
                        {(item.caption || item.credit) && (
                          <figcaption className="faint mt-2 text-xs">
                            {item.caption}
                            {item.credit ? ` — ${item.credit}` : ''}
                          </figcaption>
                        )}
                      </figure>
                    </li>
                  ))}
                </ul>
              </Block>
            )}

            {study.testimonial && (
              <Block id="testimonial" number="10" title="In the client's words">
                <blockquote className="m-0">
                  <p className="statement max-w-[38ch]">“{study.testimonial.quote}”</p>
                  <footer className="muted mt-4 text-sm">
                    {study.testimonial.name}, {study.testimonial.role}, {study.testimonial.company}
                  </footer>
                </blockquote>
              </Block>
            )}

            <Block id="services" number="11" title="Services on this account">
              {/* Per-item borders, not a gap-px container background: service counts
                  vary 2-6 per study, and an unfilled cell would paint as a grey block. */}
              <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
                {study.services.map((id) => {
                  const service = serviceById(id)
                  return (
                    <li key={id} className="p-5" style={{ border: '1px solid var(--rule)' }}>
                      <Link href={`/services#${service.id}`} className="link-underline font-semibold">
                        {service.name}
                      </Link>
                      <p className="muted mt-2 text-sm leading-relaxed">{service.blurb}</p>
                    </li>
                  )
                })}
              </ul>
            </Block>
          </div>
        </div>
      </div>

      {/* ---------------- Recap + CTA ---------------- */}
      <section className="section">
        <div className="shell">
          <div className="p-8 md:p-12" style={{ border: '1px solid var(--accent)', background: 'var(--bg-raised)' }}>
            <div className="grid-editorial items-center">
              <div className="col-span-4 md:col-span-7">
                <h2 className="max-w-[18ch] text-[length:var(--text-h2)]">Want this kind of result for your brand?</h2>
                <p className="muted mt-6 max-w-[52ch] leading-relaxed">
                  Thirty minutes, no pitch deck. Describe what is stuck and you will leave the call with a clear read on
                  the problem, whether or not you work with us.
                </p>
              </div>
              <div className="col-span-4 md:col-span-4 md:col-start-9">
                <Link href="/contact" className="btn btn--primary w-full justify-center">
                  Book a clarity call
                </Link>
                <Link href="/work" className="btn btn--ghost mt-3 w-full justify-center">
                  All case studies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Related + prev/next ---------------- */}
      {related.length > 0 && (
        <section className="section pt-0">
          <div className="shell">
            <h2 className="mb-10 text-[length:var(--text-h2)]">Related work</h2>
            <div className="grid-editorial">
              {related.map((item, i) => (
                <CaseCard key={item.slug} study={item} index={i} layout="tall" />
              ))}
            </div>
          </div>
        </section>
      )}

      <nav aria-label="Case study navigation" className="border-t" style={{ borderColor: 'var(--rule)' }} id="next">
        <div className="shell grid grid-cols-1 gap-px py-0 sm:grid-cols-2">
          <NeighbourLink study={previous} direction="Previous" />
          <NeighbourLink study={next} direction="Next" />
        </div>
      </nav>
    </article>
  )
}

/* ------------------------------------------------------------------ */

function Block({
  id,
  number,
  title,
  children,
}: {
  id: string
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-28 border-b py-14" style={{ borderColor: 'var(--rule)' }}>
      <div className="mb-7 flex items-baseline gap-4">
        <span className="mono-num text-xs" style={{ color: 'var(--accent-text)' }}>
          {number}
        </span>
        <h2 className="text-[length:var(--text-h3)]">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function PointList({ items }: { items: string[] }) {
  return (
    <ul className="m-0 list-none space-y-0 p-0">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-baseline gap-4 border-b py-4 last:border-b-0"
          style={{ borderColor: 'var(--rule)' }}
        >
          <span aria-hidden="true" className="shrink-0" style={{ color: 'var(--accent-text)' }}>
            —
          </span>
          <span className="max-w-[64ch] leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function NeighbourLink({ study, direction }: { study: CaseStudy | null; direction: 'Previous' | 'Next' }) {
  if (!study) {
    return (
      <div className="p-8" style={{ background: 'var(--bg)' }}>
        <p className="faint text-xs tracking-[0.14em] uppercase">{direction}</p>
        <p className="muted mt-2 text-sm">
          {direction === 'Previous' ? 'This is the first case study.' : 'This is the last case study.'}
        </p>
      </div>
    )
  }

  return (
    <Link
      href={`/work/${study.slug}`}
      className="group block p-8 no-underline"
      style={{ background: 'var(--bg)' }}
    >
      <p className="faint text-xs tracking-[0.14em] uppercase">{direction}</p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold tracking-tight">
        {study.client} <span className="arrow inline-block">{direction === 'Next' ? '→' : '←'}</span>
      </p>
      <p className="muted mt-2 max-w-[44ch] text-sm">{study.summary}</p>
    </Link>
  )
}
