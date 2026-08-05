'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import type { CaseStudy } from '@/content/types'
import { track, trackOnce } from '@/lib/analytics'
import { Tilt } from '@/components/motion/Kinetic'

/**
 * Editorial case panel.
 *
 * There is no project photography anywhere in the migrated content, so the visual
 * weight is carried by type, the accent rule and the client's headline number.
 * `heroImage` is honoured the moment a CMS supplies one — the layout has the slot,
 * it just refuses to fake the asset.
 */
export default function CaseCard({
  study,
  index,
  layout = 'wide',
}: {
  study: CaseStudy
  index: number
  /** Panels alternate so the index never reads as a uniform card grid. */
  layout?: 'wide' | 'tall' | 'split'
}) {
  const ref = useRef<HTMLElement>(null)

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
  const span =
    layout === 'wide' ? 'md:col-span-12' : layout === 'split' ? 'md:col-span-7' : 'md:col-span-5'

  return (
    <article
      ref={ref}
      data-accent={study.accent}
      className={`group relative col-span-4 ${span}`}
      style={{ ['--panel-index' as string]: index }}
    >
      <Tilt max={6} lift={14} className="h-full">
      <Link
        href={`/work/${study.slug}`}
        onClick={() => track('case_open', { slug: study.slug, source: 'card' })}
        className="block h-full cursor-pointer no-underline"
        style={{ viewTransitionName: `case-${study.slug}` }}
      >
        <div
          className="relative flex h-full flex-col justify-between overflow-hidden p-6 md:p-8"
          style={{
            background: 'color-mix(in srgb, var(--bg-raised) 86%, transparent)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--rule)',
            transition: 'border-color 380ms var(--ease-out-expo)',
          }}
        >
          {/* Accent rule that draws across on hover — the only decorative motion here. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 group-focus-within:scale-x-100"
            style={{ background: 'var(--accent)', transitionTimingFunction: 'var(--ease-out-expo)' }}
          />

          <div>
            <p className="eyebrow mb-4">
              {study.industry ?? study.projectTitle}
              {study.location ? ` · ${study.location}` : ''}
            </p>

            <h3
              className={`font-[family-name:var(--font-display)] font-extrabold tracking-tight ${
                layout === 'wide' ? 'text-[clamp(2rem,5vw,4rem)]' : 'text-[clamp(1.75rem,3vw,2.5rem)]'
              }`}
            >
              {study.client}
            </h3>

            <p className="muted mt-4 max-w-[46ch] text-[0.95rem] leading-relaxed">{study.summary}</p>
          </div>

          <div className="mt-8">
            {headline && (
              <p className="mb-5 flex items-baseline gap-3">
                <span
                  className="mono-num font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,3rem)] font-black leading-none tracking-tight"
                  style={{ color: 'var(--accent-text)' }}
                >
                  {headline.value}
                </span>
                <span className="faint text-xs">{headline.label}</span>
              </p>
            )}

            <ul className="m-0 mb-5 flex list-none flex-wrap gap-2 p-0">
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

            <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--accent-text)' }}>
              View case study <span className="arrow">→</span>
            </span>
          </div>
        </div>
      </Link>
      </Tilt>
    </article>
  )
}
