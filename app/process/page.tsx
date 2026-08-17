import type { Metadata } from 'next'
import Link from 'next/link'
import ProcessSection from '@/components/home/ProcessSection'
import { Reveal } from '@/components/motion/Reveal'
import Accordion from '@/components/site/Accordion'
import { Scene } from '@/components/three/Scene'
import { faqs, objections, processIntro } from '@/content/site'
import { breadcrumbLd, faqLd, graph, pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: 'Process — Kairos, the supreme moment',
  description:
    'Observe, reflect and discuss, plan and act, impact. Interviews with your team and your customers, one defensible position you approve, a parallel build, and a handover your team can run from.',
  path: '/process',
})

/**
 * Client responsibilities.
 *
 * Written for this page from the commitments the source site already makes
 * ("you approve this before anything gets designed", "a working session so your
 * team can run it"). Nothing here invents a new contractual term.
 */
const RESPONSIBILITIES = [
  'Nominate the customers and team members we interview.',
  'Give one named decision-maker who can approve the position.',
  'Return consolidated feedback in each review round, rather than per-stakeholder.',
  'Supply existing assets, analytics access and brand files you already own.',
  'Send the people who will actually run the system to the handover.',
]

export default function ProcessPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph(
            faqLd(),
            breadcrumbLd([
              { name: 'Home', path: '/' },
              { name: 'Process', path: '/process' },
            ])
          ),
        }}
      />

      <section className="relative overflow-hidden pt-40 pb-12" data-accent="lime">
        <Scene preset="process" accent="lime" intensity={0.8} />
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-4">Kairos moment</p>
            <h1 className="max-w-[13ch] text-[length:var(--text-display)]">Kairos. The Supreme Moment.</h1>
            <p className="statement mt-10 max-w-[42ch]">{processIntro}</p>
          </Reveal>
        </div>
      </section>

      <ProcessSection heading={false} />

      <section className="section border-t" style={{ borderColor: 'var(--rule)' }} data-accent="violet">
        <div className="shell">
          <div className="grid-editorial items-start">
            <div className="col-span-4 md:col-span-5">
              <h2 className="text-[length:var(--text-h1)]">What we need from you</h2>
              <p className="muted mt-6 max-w-[46ch] leading-relaxed">
                A timeline only holds if the decisions land on time. This is the whole list — there is nothing else we
                will ask you to produce.
              </p>
            </div>

            <div className="col-span-4 md:col-span-6 md:col-start-7">
              <ul className="m-0 list-none p-0">
                {RESPONSIBILITIES.map((item) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-4 border-b py-4"
                    style={{ borderColor: 'var(--rule)' }}
                  >
                    <span aria-hidden="true" className="shrink-0" style={{ color: 'var(--accent-text)' }}>
                      —
                    </span>
                    <span className="max-w-[56ch] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-12 text-[length:var(--text-h3)]">After handover</h3>
              <p className="muted mt-4 max-w-[56ch] leading-relaxed">
                You own the files and the guidelines outright. Some clients bring us back two or three times a year for
                strategy and the master system while their own team executes day to day; others do not need us again
                until the next launch. There is no retainer unless you ask for one.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0" data-accent="orange">
        <div className="shell">
          <h2 className="max-w-[20ch] text-[length:var(--text-h2)]">The things people say before they say yes</h2>
          <div className="mt-10 grid-editorial">
            <div className="col-span-4 md:col-span-10">
              <Accordion items={objections} idPrefix="process-objection" />
              <h3 className="mt-16 mb-2 text-[length:var(--text-h3)]">And the questions after that</h3>
              <Accordion items={faqs} idPrefix="process-faq" />
            </div>
          </div>

          <Link href="/contact" className="btn btn--primary mt-12">
            Book your 30-minute call
          </Link>
        </div>
      </section>
    </>
  )
}
