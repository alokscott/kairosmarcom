'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Reveal } from '@/components/motion/Reveal'
import LineIcon from '@/components/site/LineIcon'
import { Scene } from '@/components/three/Scene'
import { setScene } from '@/components/three/store'
import { services, servicesIntro } from '@/content/site'
import { track } from '@/lib/analytics'
import type { ServiceId } from '@/content/types'

/** One icon per discipline, drawn to the rules in components/site/LineIcon.tsx. */
const SERVICE_ICONS: Record<ServiceId, React.ReactNode> = {
  /* A bezier with its two control handles — drawing, not a drawn thing. */
  'creative-design': (
    <>
      <path d="M3.5 18.5c0-8 5-13 17-13" />
      <circle cx="3.5" cy="18.5" r="1.8" />
      <circle cx="20.5" cy="5.5" r="1.8" />
      <path d="M3.5 12.5h5M15.5 18.5h5" />
    </>
  ),
  /* A tag with its eyelet. */
  branding: (
    <>
      <path d="M11.4 3.5H20a.5.5 0 0 1 .5.5v8.6a1 1 0 0 1-.3.7l-7.7 7.7a1 1 0 0 1-1.4 0l-8-8a1 1 0 0 1 0-1.4l7.7-7.7a1 1 0 0 1 .6-.4Z" />
      <circle cx="16.4" cy="7.6" r="1.6" />
    </>
  ),
  /* A window with a pointer in it. */
  digital: (
    <>
      <rect x="2.5" y="4" width="19" height="15" rx="1.4" />
      <path d="M2.5 8h19" />
      <path d="M10 11.5l6 3-2.6 1-1 2.6-2.4-6.6Z" />
    </>
  ),
  /* A megaphone. */
  'public-relations': (
    <>
      <path d="M3.5 9.5v5a1 1 0 0 0 1 1h2.7l8.3 4.5V4L7.2 8.5H4.5a1 1 0 0 0-1 1Z" />
      <path d="M19 9a4.2 4.2 0 0 1 0 6" />
      <path d="M7.2 15.5v3.2a1 1 0 0 0 1 1h1.6" />
    </>
  ),
  /* Angle brackets — the same glyph the craft row uses, because it means the same
     thing there and a second invention would only make the two look unrelated. */
  technology: (
    <>
      <path d="M8.5 8 4 12l4.5 4M15.5 8l4.5 4-4.5 4" />
      <path d="M13.4 5.5 10.6 18.5" />
    </>
  ),
  /* A clapperboard. */
  video: (
    <>
      <rect x="2.5" y="8" width="19" height="12" rx="1.2" />
      <path d="M2.9 8 6 3.9l3.6 3.6M9.3 8 12.4 3.9 16 7.5M15.7 8l3.1-4.1 2.4 2.4" />
      <path d="M10.4 11.8v4.4l4-2.2-4-2.2Z" />
    </>
  ),
}

/**
 * Six disciplines as one interconnected system.
 *
 * Selecting a discipline focuses the matching node in the constellation. This is a
 * radio group, not a set of tab-like divs: arrow keys move between disciplines, the
 * selection is announced, and it works identically by keyboard and pointer.
 *
 * ─── Hover selects; click and focus also record it ───
 *
 * A list that only responds to a click asks for a decision before it has shown you
 * anything, so the panel now follows the pointer. But hovering is not choosing: moving
 * a mouse across six rows would otherwise fire six `service_detail_open` events, and an
 * analytics number that counts mouse travel is worse than no number at all.
 *
 * So the two are split. `preview` moves the selection and the scene and is what hover
 * calls. `choose` does that and records it, and is reached only by a click or by
 * keyboard focus — both of which are deliberate acts.
 */
export default function ServicesPreview() {
  const [selected, setSelected] = useState(0)
  const active = services[selected]

  const preview = (index: number) => {
    setSelected(index)
    setScene({ focus: index, accent: services[index].accent })
  }

  const choose = (index: number) => {
    preview(index)
    track('service_detail_open', { service: services[index].id })
  }

  return (
    <section id="services" className="section relative overflow-hidden" data-accent={active.accent}>
      <Scene preset="constellation" accent={active.accent} />

      <div className="shell relative">
        {/*
          The heading block is deliberately tighter than the other sections'. This one
          has a working control under it, and at `--text-h1` with a lead-size intro the
          list and its panel both started below the fold — you had to scroll past the
          section's own title to find out that it did anything.
        */}
        <Reveal>
          <p className="eyebrow mb-3">What we do</p>
          <h2 className="max-w-[16ch] text-[length:var(--text-h2)]">Distinct disciplines. Integrated model.</h2>
          <p className="muted mt-4 max-w-[58ch] leading-relaxed">{servicesIntro}</p>
        </Reveal>

        <div className="mt-10 grid-editorial items-start">
          <div className="col-span-4 md:col-span-6" role="radiogroup" aria-label="Choose a discipline">
            <ul className="m-0 list-none p-0">
              {services.map((service, i) => (
                <li key={service.id}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={i === selected}
                    onClick={() => choose(i)}
                    onFocus={() => choose(i)}
                    onMouseEnter={() => preview(i)}
                    className="service-row flex w-full items-center gap-4 border-b py-4 text-left"
                    style={{
                      borderColor: 'var(--rule)',
                      color: i === selected ? 'var(--fg)' : 'var(--fg-muted)',
                    }}
                  >
                    <LineIcon
                      className="service-row__icon w-7 flex-none"
                      style={{ color: i === selected ? 'var(--accent)' : 'var(--fg-faint)' }}
                    >
                      {SERVICE_ICONS[service.id]}
                    </LineIcon>

                    <span className="service-row__name font-[family-name:var(--font-display)] text-[clamp(1.375rem,2.6vw,2rem)] font-extrabold tracking-tight">
                      {service.name}
                    </span>

                    <span
                      aria-hidden="true"
                      className="mono-num ml-auto shrink-0 text-xs"
                      style={{ color: i === selected ? 'var(--accent-text)' : 'var(--fg-faint)' }}
                    >
                      0{i + 1}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-4 md:col-span-5 md:col-start-8">
            {/* Announced on change so the panel is not a silent update for screen readers. */}
            <div aria-live="polite" className="min-h-[18rem]">
              <h3 className="sr-only">{active.name}</h3>

              {/*
                Keyed on the service id so React replaces the block rather than mutating
                it, which is what lets the entrance animation run again on every change.
                Without the key the panel swaps its text in place and the change reads as
                a glitch rather than as a new card arriving.
              */}
              <div key={active.id} className="service-panel">
                <LineIcon className="mb-5 w-12" style={{ color: 'var(--accent)' }}>
                  {SERVICE_ICONS[active.id]}
                </LineIcon>

                <p className="text-[length:var(--text-lead)] leading-relaxed">{active.blurb}</p>

                <ul className="mt-6 m-0 list-none space-y-0 p-0">
                  {active.capabilities.map((cap) => (
                    <li
                      key={cap}
                      className="flex items-baseline gap-3 border-b py-2.5 text-sm"
                      style={{ borderColor: 'var(--rule)' }}
                    >
                      <span aria-hidden="true" style={{ color: 'var(--accent-text)' }}>
                        →
                      </span>
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link href="/services" className="btn btn--ghost mt-6">
              All six disciplines in full <span aria-hidden="true" className="arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
