'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { KineticHeadline } from '@/components/motion/Kinetic'
import { Reveal } from '@/components/motion/Reveal'
import { Scene } from '@/components/three/Scene'
import { cases } from '@/content/cases'
import type { CaseStudy } from '@/content/types'
import { track, trackOnce } from '@/lib/analytics'

/**
 * Selected work — a stacked scroll deck.
 *
 * Each of the nine studies sticks at a slightly lower offset than the one before,
 * so panels pile up as the page scrolls and the deck reads as physical depth rather
 * than as a grid. The shrink-and-dim on the panel underneath is a CSS
 * scroll-driven animation where the browser supports one, and silently absent where
 * it does not — no JavaScript is involved in the effect at all.
 *
 * Every panel is an ordinary link with the full content structure, so the section
 * degrades to a readable stack of cards with sticky positioning off.
 */
export default function SelectedWork() {
  return (
    <section id="work" className="section relative in-scene" data-accent="orange">
      <Scene preset="metrics" accent="orange" intensity={0.6} />

      <div className="shell relative">
        <Reveal>
          <p className="eyebrow mb-4">Selected work</p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-[length:var(--text-h1)]">
              <KineticHeadline lines={['Brands we helped', 'find their moment']} />
            </h2>
            <Link href="/work" className="btn btn--ghost">
              All case studies <span className="arrow">→</span>
            </Link>
          </div>
          <p className="muted mt-6 max-w-[62ch] text-[length:var(--text-lead)]">
            Automotive, consumer technology, education and EV. Every engagement below is written up in full — the
            objective, the challenge, what we did and what actually happened.
          </p>
        </Reveal>

        <div className="mt-16">
          {cases.map((study, i) => (
            <StackPanel key={study.slug} study={study} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StackPanel({ study, index }: { study: CaseStudy; index: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          trackOnce('case_impression', { slug: study.slug })
          io.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [study.slug])

  const headline = study.headline[0]

  return (
    <div
      ref={ref}
      className="stack__item pb-6"
      data-accent={study.accent}
      style={{ ['--stack-top' as string]: `${6.5 + index * 0.7}rem`, zIndex: index + 1 }}
    >
      <div className="stack__inner">
        <Link
          href={`/work/${study.slug}`}
          onClick={() => track('case_open', { slug: study.slug, source: 'stack' })}
          className="group block no-underline"
          style={{ viewTransitionName: `case-${study.slug}` }}
        >
          <div
            className="relative overflow-hidden p-7 md:p-10"
            /*
             * Opaque, unlike the other in-scene surfaces. A stacked deck needs it:
             * at 88% the card underneath reads straight through the one on top and
             * two client names overlap as a double exposure. The scene stays visible
             * in the margins either side of the deck instead.
             */
            style={{ background: 'var(--bg-raised)', border: '1px solid var(--rule)' }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 group-focus-within:scale-x-100"
              style={{ background: 'var(--accent)', transitionTimingFunction: 'var(--ease-out-expo)' }}
            />

            <div className="grid-editorial items-end">
              <div className="col-span-4 md:col-span-7">
                <p className="eyebrow mb-4">
                  <span className="mono-num mr-3">{String(index + 1).padStart(2, '0')}</span>
                  {study.industry ?? study.projectTitle}
                  {study.location ? ` · ${study.location}` : ''}
                </p>

                <h3 className="font-[family-name:var(--font-display)] text-[clamp(2rem,5.5vw,4.25rem)] font-extrabold leading-[0.94] tracking-tight">
                  {study.client}
                </h3>

                <p className="muted mt-5 max-w-[48ch] leading-relaxed">{study.summary}</p>

                <ul className="m-0 mt-6 flex list-none flex-wrap gap-2 p-0">
                  {study.tags.map((tag) => (
                    <li
                      key={tag}
                      className="px-2.5 py-1 text-[0.7rem]"
                      style={{ border: '1px solid var(--rule)', color: 'var(--fg-muted)' }}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-4 md:col-span-4 md:col-start-9">
                {headline && (
                  <p className="mb-6">
                    <span
                      className="mono-num block font-[family-name:var(--font-display)] text-[clamp(2.25rem,5vw,3.75rem)] font-black leading-none tracking-tight"
                      style={{ color: 'var(--accent-text)' }}
                    >
                      {headline.value}
                    </span>
                    <span className="faint mt-2 block text-xs">{headline.label}</span>
                  </p>
                )}

                <span
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: 'var(--accent-text)' }}
                >
                  View case study <span className="arrow">→</span>
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
