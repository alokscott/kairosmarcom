import type { Metadata } from 'next'
import Link from 'next/link'
import ProcessSection from '@/components/home/ProcessSection'
import { Reveal } from '@/components/motion/Reveal'
import Accordion from '@/components/site/Accordion'
import LineIcon from '@/components/site/LineIcon'
import { STEP_ICONS } from '@/components/site/icons'
import { Scene } from '@/components/three/Scene'
import { faqs, objections, processIntro, processSteps } from '@/content/site'
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
          {/*
            Two columns. Capped at 13ch the heading broke to three lines and the right
            half of the fold held nothing, on a page whose entire subject is a sequence
            of four steps. Listing them here answers "what is the process" before a
            word of the explanation is read, and each entry jumps to its own stage.
          */}
          <div className="grid-editorial items-start gap-y-10">
            <div className="col-span-4 md:col-span-6">
              <Reveal>
                <p className="eyebrow mb-4">Kairos moment</p>
                <h1 className="max-w-[13ch] text-[length:var(--text-display)]">Kairos. The Supreme Moment.</h1>
                <p className="statement mt-10 max-w-[38ch]">{processIntro}</p>
              </Reveal>
            </div>

            <ol className="col-span-4 m-0 list-none p-0 md:col-span-5 md:col-start-8">
              {processSteps.map((step) => (
                <Reveal key={step.title} as="li" delay={Number(step.index) * 70}>
                  <div className="flex items-center gap-4 border-b py-4" style={{ borderColor: 'var(--rule)' }}>
                    <LineIcon className="w-9 flex-none" style={{ color: 'var(--accent)' }}>
                      {STEP_ICONS[step.title]}
                    </LineIcon>
                    <span className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-bold tracking-tight">
                      {step.title}
                    </span>
                    <span className="faint ml-auto text-xs tracking-[0.14em] uppercase">{step.stage}</span>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
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
              {/* Numbered, not dashed. Five dashes read as an aside; a numbered list
                  reads as the whole of what is being asked for, which is what the
                  paragraph beside it promises. */}
              <ol className="m-0 list-none p-0">
                {RESPONSIBILITIES.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-4 border-b py-4"
                    style={{ borderColor: 'var(--rule)' }}
                  >
                    <span aria-hidden="true" className="mono-num shrink-0 text-xs" style={{ color: 'var(--accent-text)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="max-w-[56ch] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ol>

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

      {/*
        Two sections, each two columns and numbered — the treatment the homepage's
        objections and FAQs already use.

        They were one section holding two full-width accordions stacked on top of each
        other: an unnumbered list of short questions running across ten columns with the
        right half of the page empty, and a small h3 as the only thing separating the
        two sets. Splitting them gives each its own heading beside its own list, and the
        numbers give a closed accordion of one-line questions something to hold onto.
      */}
      <section className="section pt-0" data-accent="orange">
        <div className="shell">
          <div className="grid-editorial items-start gap-y-10">
            <div className="col-span-4 md:col-span-5">
              <p className="eyebrow mb-4">Straight answers</p>
              <h2 className="max-w-[16ch] text-[length:var(--text-h2)]">
                The things people say before they say yes
              </h2>
            </div>
            <div className="col-span-4 md:col-span-6 md:col-start-7">
              <Accordion items={objections} idPrefix="process-objection" numbered />
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0" data-accent="lime">
        <div className="shell">
          <div className="grid-editorial items-start gap-y-10">
            {/* Sticky for the same reason as the homepage FAQs: seven questions make
                this column twice the height of its heading, and a heading that scrolls
                away leaves the reader part-way down an unlabelled set of rows. */}
            <div className="col-span-4 md:col-span-5 md:self-stretch">
              <div className="md:sticky md:top-32">
                <p className="eyebrow mb-4">FAQs</p>
                <h2 className="max-w-[16ch] text-[length:var(--text-h2)]">And the questions after that</h2>
                <Link href="/contact" className="btn btn--primary mt-8">
                  Book your 30-minute call
                </Link>
              </div>
            </div>
            <div className="col-span-4 md:col-span-6 md:col-start-7">
              <Accordion items={faqs} idPrefix="process-faq" numbered />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
