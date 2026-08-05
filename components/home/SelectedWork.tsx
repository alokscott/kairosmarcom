'use client'

import Link from 'next/link'
import { useEffect, useRef, ViewTransition } from 'react'
import { motion, useTransform, type MotionValue } from 'motion/react'
import { KineticHeadline } from '@/components/motion/Kinetic'
import { Reveal } from '@/components/motion/Reveal'
import { useScrollProgress, useStill } from '@/components/motion/scroll'
import { Scene } from '@/components/three/Scene'
import { cases } from '@/content/cases'
import type { CaseStudy } from '@/content/types'
import { track, trackOnce } from '@/lib/analytics'

/**
 * Selected work — a stacked scroll deck.
 *
 * Each of the nine studies sticks at a slightly lower offset than the one before,
 * so panels pile up as the page scrolls and the deck reads as physical depth rather
 * than as a grid. The card arriving from below tilts in on a CSS scroll-driven
 * animation; the shrink-and-dim on the card being covered is driven from `Deck`
 * below, for the reason documented there.
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

        <Deck />
      </div>
    </section>
  )
}

/**
 * The stacked deck.
 *
 * The recede — each card shrinking and dimming as the next covers it — is driven
 * from here rather than by CSS scroll-driven animation. `animation-timeline: view()`
 * cannot express it: these cards are `position: sticky`, and while an element is
 * stuck its position in the scrollport stops changing, so a `view()` timeline freezes
 * and the `exit` range never advances. The effect was declared and silently never ran,
 * which is why the covered card sat at full contrast with its headline sliced in half
 * by the card above it.
 *
 * Driving it from the deck's own scroll progress works because the deck is not sticky.
 * Each card gets a slice of that progress based on its index.
 */
function Deck() {
  const ref = useRef<HTMLDivElement>(null)
  const still = useStill()
  const progress = useScrollProgress(ref, ['start start', 'end end'])
  const total = cases.length

  return (
    <div ref={ref} className="deck mt-16">
      <BackWord text="WORK" />
      {cases.map((study, i) => (
        <StackPanel key={study.slug} study={study} index={i} total={total} progress={progress} still={!!still} />
      ))}
    </div>
  )
}

/**
 * The oversized, out-of-focus word the deck slides over.
 *
 * It sits behind the cards on a sticky full-height layer with a negative margin, so
 * it holds in the viewport for the length of the deck without occupying any layout.
 * Only `transform` animates — the blur is static, which lets the compositor cache
 * one blurred layer instead of re-filtering a very large glyph every frame.
 */
function BackWord({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const still = useStill()
  const p = useScrollProgress(ref)
  const y = useTransform(p, [0, 1], ['14%', '-14%'])

  // Always rendered, never unmounted. Returning null here left useScroll holding a
  // ref that was never attached, which motion reports as "Target ref is defined but
  // not hydrated". Under reduced motion the word simply stops travelling.
  return (
    <div ref={ref} aria-hidden="true" className="deck__word">
      <motion.span style={still ? undefined : { y }}>{text}</motion.span>
    </div>
  )
}

function StackPanel({
  study,
  index,
  total,
  progress,
  still,
}: {
  study: CaseStudy
  index: number
  total: number
  progress: MotionValue<number>
  still: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  // This card's slice of the deck's travel. It recedes while the next one covers it
  // and stops there; the last card never recedes because nothing covers it.
  const from = index / total
  const to = (index + 0.9) / total
  const scale = useTransform(progress, [from, to], index === total - 1 ? [1, 1] : [1, 0.93])
  const lift = useTransform(progress, [from, to], index === total - 1 ? [0, 0] : [0, -12])
  /*
   * Dimming is a veil painted OVER the card, not opacity on the card itself. These
   * panels are deliberately opaque so a stacked deck does not read as a double
   * exposure; fading the element would make its own background translucent and let
   * the client name underneath show straight through the one on top.
   */
  const veil = useTransform(progress, [from, to], index === total - 1 ? [0, 0] : [0, 0.55])

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
      <motion.div className="stack__inner" style={still ? undefined : { scale, y: lift }}>
        {/* Separate element from stack__inner: both are scroll-driven, but one runs
            on `entry` and the other on `exit`, and a single element cannot hold two
            transform animations on different ranges without them fighting. */}
        <div className="stack__enter">
        <Link
          href={`/work/${study.slug}`}
          onClick={() => track('case_open', { slug: study.slug, source: 'stack' })}
          className="group block no-underline"
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
                  <ViewTransition name={`case-${study.slug}`}>
                    <span>{study.client}</span>
                  </ViewTransition>
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

            {/* Last child, so it paints over the card's own content. */}
            {!still && (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: 'var(--bg)', opacity: veil }}
              />
            )}
          </div>
        </Link>
        </div>
      </motion.div>
    </div>
  )
}
