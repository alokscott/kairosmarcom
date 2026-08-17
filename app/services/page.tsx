import type { Metadata } from 'next'
import Link from 'next/link'
import { Reveal } from '@/components/motion/Reveal'
import { Scene } from '@/components/three/Scene'
import { cases } from '@/content/cases'
import { processSteps, services, servicesIntro } from '@/content/site'
import { breadcrumbLd, graph, pageMeta, serviceLd } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: 'Services — distinct disciplines, integrated model',
  description:
    'Creative design, branding, digital, public relations, technology and video. You brief once and it all comes from the same room, so the story does not drift between channels.',
  path: '/services',
})

/**
 * Engagement options.
 *
 * These are not new commercial terms — they are the shapes the agency already
 * describes in its published objection and FAQ answers, restructured so a visitor
 * can compare them. Nothing here states a price the source site did not state.
 */
const ENGAGEMENTS = [
  {
    title: 'Positioning and messaging only',
    body: 'A fraction of a full brand build, and it is often the part that shifts the numbers. Identity can follow next year if it still matters.',
    shape: 'Scoped per project',
  },
  {
    title: 'Full brand build',
    body: 'Identity, messaging, site and campaign assets made in parallel by the same senior team. Strategic direction comes before creative, and creative before build.',
    shape: 'Scoped per project',
  },
  {
    title: 'Strategy with your team executing',
    body: 'We do the strategy and the master system, your team runs it day to day. Several clients use us exactly this way, two or three times a year.',
    shape: 'Recurring',
  },
  {
    title: 'A single discipline',
    body: 'Just the video, or just the site. We will tell you honestly if the piece will not work without the strategy underneath it, but the decision stays yours.',
    shape: 'Scoped per project',
  },
]

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph(
            ...serviceLd(),
            breadcrumbLd([
              { name: 'Home', path: '/' },
              { name: 'Services', path: '/services' },
            ])
          ),
        }}
      />

      <section className="relative overflow-hidden pt-40 pb-16" data-accent="violet">
        <Scene preset="constellation" accent="violet" />
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-4">What we do</p>
            <h1 className="max-w-[13ch] text-[length:var(--text-display)]">Distinct disciplines. Integrated model.</h1>
            <p className="muted mt-8 max-w-[58ch] text-[length:var(--text-lead)]">{servicesIntro}</p>
          </Reveal>
        </div>
      </section>

      {services.map((service, i) => {
        const evidence = service.cases.map((slug) => cases.find((c) => c.slug === slug)).filter(Boolean)
        return (
          <section
            key={service.id}
            id={service.id}
            data-accent={service.accent}
            className="scroll-mt-24 border-t py-20"
            style={{ borderColor: 'var(--rule)' }}
          >
            <div className="shell">
              <div className="grid-editorial items-start">
                <div className="col-span-4 md:col-span-5">
                  <p className="mono-num eyebrow mb-4">0{i + 1}</p>
                  <h2 className="text-[length:var(--text-h1)]">{service.name}</h2>
                  <p className="mt-6 text-[length:var(--text-lead)] leading-relaxed">{service.blurb}</p>
                </div>

                <div className="col-span-4 md:col-span-6 md:col-start-7">
                  <h3 className="text-xs tracking-[0.14em] uppercase" style={{ color: 'var(--fg-faint)' }}>
                    What this solves
                  </h3>
                  <p className="muted mt-3 max-w-[58ch] leading-relaxed">{service.solves}</p>

                  <h3 className="mt-10 text-xs tracking-[0.14em] uppercase" style={{ color: 'var(--fg-faint)' }}>
                    Deliverables
                  </h3>
                  <ul className="m-0 mt-3 list-none p-0">
                    {service.capabilities.map((cap) => (
                      <li
                        key={cap}
                        className="flex items-baseline gap-3 border-b py-3 text-sm"
                        style={{ borderColor: 'var(--rule)' }}
                      >
                        <span aria-hidden="true" style={{ color: 'var(--accent-text)' }}>
                          →
                        </span>
                        {cap}
                      </li>
                    ))}
                  </ul>

                  {evidence.length > 0 && (
                    <>
                      <h3 className="mt-10 text-xs tracking-[0.14em] uppercase" style={{ color: 'var(--fg-faint)' }}>
                        Where you can see it
                      </h3>
                      <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
                        {evidence.map((c) => (
                          <li key={c!.slug}>
                            <Link
                              href={`/work/${c!.slug}`}
                              className="inline-block px-3 py-1.5 text-xs no-underline"
                              style={{ border: '1px solid var(--rule)', color: 'var(--fg-muted)' }}
                            >
                              {c!.client} <span aria-hidden="true" className="arrow">→</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        )
      })}

      <section className="section border-t" style={{ borderColor: 'var(--rule)' }} data-accent="lime">
        <div className="shell">
          <h2 className="max-w-[20ch] text-[length:var(--text-h1)]">How the six connect</h2>
          <p className="muted mt-6 max-w-[62ch] text-[length:var(--text-lead)]">
            You brief once. The same senior team carries the position through identity, site, earned coverage,
            campaigns and film, which is why the story arrives the same way in each of them. The sequence is the same
            four steps whichever disciplines you engage.
          </p>

          <ol className="mt-12 m-0 grid list-none gap-px p-0 sm:grid-cols-2 lg:grid-cols-4" style={{ background: 'var(--rule)' }}>
            {processSteps.map((step) => (
              <li key={step.title} className="p-6" style={{ background: 'var(--bg)' }}>
                <p className="mono-num text-xs" style={{ color: 'var(--accent-text)' }}>
                  {step.index} · {step.stage}
                </p>
                <h3 className="mt-2 text-[length:var(--text-h3)]">{step.title}</h3>
                <p className="muted mt-3 text-sm leading-relaxed">{step.body}</p>
              </li>
            ))}
          </ol>

          <Link href="/process" className="btn btn--ghost mt-10">
            The process in full <span aria-hidden="true" className="arrow">→</span>
          </Link>
        </div>
      </section>

      <section className="section pt-0" data-accent="orange">
        <div className="shell">
          <h2 className="max-w-[20ch] text-[length:var(--text-h2)]">Ways to engage</h2>
          <ul className="mt-10 m-0 grid list-none gap-px p-0 sm:grid-cols-2" style={{ background: 'var(--rule)' }}>
            {ENGAGEMENTS.map((option) => (
              <li key={option.title} className="p-6" style={{ background: 'var(--bg)' }}>
                <p className="eyebrow mb-2">{option.shape}</p>
                <h3 className="text-[length:var(--text-h3)]">{option.title}</h3>
                <p className="muted mt-3 max-w-[46ch] text-sm leading-relaxed">{option.body}</p>
              </li>
            ))}
          </ul>

          <p className="faint mt-6 max-w-[62ch] text-sm">
            Scope and fee are agreed in writing before we start, and you see the full number before you commit to
            anything. Nothing gets built on a brief you have not signed off.
          </p>

          <Link href="/contact" className="btn btn--primary mt-8">
            Book your 30-minute call
          </Link>
        </div>
      </section>
    </>
  )
}
