'use client'

import Link from 'next/link'
import { useEffect, useRef, ViewTransition } from 'react'
import type { CaseStudy } from '@/content/types'
import { track, trackOnce } from '@/lib/analytics'
import { motion } from 'motion/react'
import { EASE_OUT_EXPO, useStill } from '@/components/motion/scroll'
import LineIcon from '@/components/site/LineIcon'
import { SERVICE_ICONS } from '@/components/site/icons'

/**
 * Case card.
 *
 * ─── There is no photography, and that is the design problem ───
 *
 * Not one of the nine case studies carries an image or a video: every `heroImage` is
 * null, every `gallery` and `videos` array is empty. A work index with no pictures is
 * the hardest brief on the site, and pretending otherwise — stock, gradients standing
 * in for screenshots — would be worse than the honest version.
 *
 * So the RESULT is the picture. Each card leads with a plate carrying the study's
 * headline figure at display size, which is the one genuinely striking asset the
 * content does have, and it is real. Ageless Digital has no measured figure, so its
 * plate carries the discipline's icon instead: the same shape, never an invented
 * number. The plate slot is a fixed aspect either way, which is what keeps nine cards
 * the same height.
 *
 * ─── Uniform, not alternating ───
 *
 * The cards used to take a `layout` of wide, split or tall, spanning 12, 7 or 5
 * columns on a rotation. The intent was an editorial rhythm; the effect was a ragged
 * grid of mismatched boxes that read as a layout bug, because nothing about a
 * particular study justified its box being the odd size. Every card is now identical
 * and the grid does the composing.
 */
export default function CaseCard({
  study,
  index,
  /** `row` is the list view: one full-width card per line, plate beside the text. */
  layout = 'card',
}: {
  study: CaseStudy
  index: number
  layout?: 'card' | 'row'
}) {
  const ref = useRef<HTMLElement>(null)
  const still = useStill()

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
  const row = layout === 'row'

  /*
   * Sequential entrance.
   *
   * Purpose: give the grid a reading order instead of nine cards appearing at once.
   * Trigger: the card scrolling into view, once — re-animating on every pass turns a
   *   flourish into a distraction on the way back up the page.
   *
   * The step is capped at four cards (1.2s). Uncapped, card nine would sit blank for
   * 2.4s after it was already on screen, which reads as a page that failed to load
   * rather than as a considered sequence.
   */
  const step = Math.min(index, 4) * 0.12

  return (
    <motion.article
      ref={ref}
      className="case-card group"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -6% 0px' }}
      transition={still ? { duration: 0 } : { duration: 0.55, delay: step, ease: EASE_OUT_EXPO }}
    >
      <Link
        href={`/work/${study.slug}`}
        onClick={() => track('case_open', { slug: study.slug, source: 'card' })}
        className={`flex h-full cursor-pointer no-underline ${row ? 'flex-col sm:flex-row' : 'flex-col'}`}
        style={{ background: 'var(--bg-raised)', border: '1px solid var(--rule)' }}
      >
        {/* Drawn from the left on hover — the site's one hover gesture. */}
        <span aria-hidden="true" className="case-card__rule" />

        <div
          className={`case-card__plate relative grid place-items-center overflow-hidden p-6 ${
            row ? 'sm:w-[18rem] sm:flex-none' : 'aspect-[16/10]'
          }`}
        >
          {headline ? (
            <p className="m-0 text-center">
              <span
                className="mono-num block font-[family-name:var(--font-display)] text-[clamp(2.25rem,5vw,3.5rem)] font-black leading-none tracking-tight"
                style={{ color: 'var(--accent-text)' }}
              >
                {headline.value}
              </span>
              <span className="faint mt-2 block text-xs">{headline.label}</span>
            </p>
          ) : (
            /* No measured figure on this study. The discipline's own mark stands in —
               the plate keeps its shape and nothing is invented to fill it. */
            <LineIcon className="w-16" style={{ color: 'var(--accent)', opacity: 0.5 }}>
              {SERVICE_ICONS[study.services[0]]}
            </LineIcon>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <p className="eyebrow mb-3">
            {study.industry ?? study.projectTitle}
            {study.location ? ` · ${study.location}` : ''}
          </p>

          <h3 className="case-card__title font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-extrabold tracking-tight">
            <ViewTransition name={`case-${study.slug}`}>
              <span>{study.client}</span>
            </ViewTransition>
          </h3>

          <p className="muted mt-3 max-w-[46ch] text-sm leading-relaxed">{study.summary}</p>

          {/* `mt-auto` pins everything below to the bottom of the card, so the tags and
              the link line up across a row whatever length the summary runs to. */}
          <ul className="m-0 mt-auto flex list-none flex-wrap gap-2 p-0 pt-5">
            {study.tags.map((tag) => (
              <li
                key={tag}
                className="px-2.5 py-1 text-[0.7rem] tracking-wide"
                style={{ border: '1px solid var(--rule)', color: 'var(--fg-muted)' }}
              >
                {tag}
              </li>
            ))}
          </ul>

          <span
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: 'var(--accent-text)' }}
          >
            View case study <span aria-hidden="true" className="arrow">→</span>
          </span>
        </div>
      </Link>
    </motion.article>
  )
}
