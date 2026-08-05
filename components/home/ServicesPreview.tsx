'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Reveal } from '@/components/motion/Reveal'
import { Scene } from '@/components/three/Scene'
import { setScene } from '@/components/three/store'
import { services, servicesIntro } from '@/content/site'
import { track } from '@/lib/analytics'

/**
 * Six disciplines as one interconnected system.
 *
 * Selecting a service focuses the matching node in the constellation. This is a
 * radio group, not a set of tab-like divs: arrow keys move between disciplines,
 * the selection is announced, and it works identically by keyboard and pointer.
 */
export default function ServicesPreview() {
  const [selected, setSelected] = useState(0)
  const active = services[selected]

  const choose = (index: number) => {
    setSelected(index)
    setScene({ focus: index, accent: services[index].accent })
    track('service_detail_open', { service: services[index].id })
  }

  return (
    <section id="services" className="section relative overflow-hidden" data-accent={active.accent}>
      <Scene preset="constellation" accent={active.accent} />

      <div className="shell relative">
        <Reveal>
          <p className="eyebrow mb-4">What we do</p>
          <h2 className="max-w-[14ch] text-[length:var(--text-h1)]">Six disciplines. One senior team.</h2>
          <p className="muted mt-6 max-w-[58ch] text-[length:var(--text-lead)]">{servicesIntro}</p>
        </Reveal>

        <div className="mt-16 grid-editorial items-start">
          <div
            className="col-span-4 md:col-span-6"
            role="radiogroup"
            aria-label="Choose a discipline"
          >
            <ul className="m-0 list-none p-0">
              {services.map((service, i) => (
                <li key={service.id}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={i === selected}
                    onClick={() => choose(i)}
                    onFocus={() => choose(i)}
                    className="flex w-full items-baseline justify-between gap-4 border-b py-5 text-left"
                    style={{
                      borderColor: 'var(--rule)',
                      color: i === selected ? 'var(--fg)' : 'var(--fg-muted)',
                    }}
                  >
                    <span className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,3.2vw,2.5rem)] font-extrabold tracking-tight">
                      {service.name}
                    </span>
                    <span
                      aria-hidden="true"
                      className="mono-num shrink-0 text-xs"
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
            <div aria-live="polite" className="min-h-[16rem]">
              <h3 className="sr-only">{active.name}</h3>
              <p className="text-[length:var(--text-lead)] leading-relaxed">{active.blurb}</p>

              <ul className="mt-8 m-0 list-none space-y-0 p-0">
                {active.capabilities.map((cap) => (
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
            </div>

            <Link href="/services" className="btn btn--ghost mt-8">
              All six disciplines in full <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
