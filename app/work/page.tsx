import type { Metadata } from 'next'
import Link from 'next/link'
import { Reveal } from '@/components/motion/Reveal'
import { Scene } from '@/components/three/Scene'
import WorkFilters from '@/components/work/WorkFilters'
import { cases } from '@/content/cases'
import { breadcrumbLd, caseLd, graph, pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: 'Work — nine engagements, written up in full',
  description:
    'Automotive, consumer technology, education, cybersecurity and EV. Nine Kairos Marcom case studies with the objective, the challenge, what we did and the measured result, sourced.',
  path: '/work',
})

/** Featured study for the index hero. The one with the deepest results module. */
const FEATURED = cases.find((c) => c.slug === 'bmw-bavaria-motors')!

export default function WorkIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph(
            breadcrumbLd([
              { name: 'Home', path: '/' },
              { name: 'Work', path: '/work' },
            ]),
            ...cases.map(caseLd)
          ),
        }}
      />

      <section className="relative overflow-hidden pt-40 pb-20" data-accent="orange">
        <Scene preset="metrics" accent="orange" intensity={0.7} />

        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-4">Selected work</p>
            <h1 className="max-w-[15ch] text-[length:var(--text-display)]">Brands we helped find their moment</h1>
          </Reveal>

          <div className="mt-10 grid-editorial items-end">
            <Reveal delay={120} className="col-span-4 md:col-span-6">
              <p className="muted text-[length:var(--text-lead)] leading-relaxed">
                Nine engagements across automotive, consumer technology, education, cybersecurity and EV. Each one is
                written up the same way — objective, challenge, what we did, and what the numbers did afterwards, with
                the source of every figure stated beside it.
              </p>
            </Reveal>

            <Reveal delay={200} className="col-span-4 md:col-span-5 md:col-start-8">
              <div
                data-accent={FEATURED.accent}
                className="p-6"
                style={{ border: '1px solid var(--rule)', background: 'var(--bg-raised)' }}
              >
                <p className="eyebrow mb-3">Featured</p>
                <h2 className="text-[length:var(--text-h3)]">{FEATURED.client}</h2>
                <p className="muted mt-3 text-sm leading-relaxed">{FEATURED.summary}</p>
                <Link href={`/work/${FEATURED.slug}`} className="btn btn--primary mt-5">
                  Read the case study <span aria-hidden="true" className="arrow">→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="shell">
          <h2 className="sr-only">Filter and browse all case studies</h2>
          <WorkFilters studies={cases} />
        </div>
      </section>
    </>
  )
}
