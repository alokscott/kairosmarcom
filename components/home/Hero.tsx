'use client'

import Link from 'next/link'
import { Counter, Magnetic, Reveal } from '@/components/motion/Reveal'
import { KineticHeadline, PinnedStage } from '@/components/motion/Kinetic'
import { Scene } from '@/components/three/Scene'
import { hero } from '@/content/site'
import { track } from '@/lib/analytics'

/**
 * Hero.
 *
 * A pinned stage: the panel holds while roughly two extra viewports of scroll drive
 * the camera in and the fragments converge into the core. The headline, both CTAs
 * and the response assurance are server-rendered text that never moves out of
 * reading position while that happens.
 *
 * Pinning is `position: sticky`, so the wheel and scrollbar still move the page at
 * their normal rate. Under reduced motion the stage stops pinning and this becomes
 * a plain static hero.
 */
export default function Hero() {
  return (
    <PinnedStage
      vh={280}
      accent="orange"
      className="in-scene"
      scene={<Scene preset="core" accent="orange" />}
    >
      <div className="shell relative w-full">
        <div className="grid-editorial items-start">
          <div className="scrim col-span-4 md:col-span-7">
            <Reveal>
              <p className="eyebrow mb-5">{hero.eyebrow}</p>
            </Reveal>

            {/* The width axis is scroll-driven: the headline compresses on entry and
                opens out as the core assembles behind it. */}
            <h1 className="text-[length:var(--text-display)]">
              <KineticHeadline lines={hero.headline} kinetic />
            </h1>
          </div>

          <div className="panel col-span-4 md:col-span-5 md:col-start-8">
            <Reveal delay={220}>
              <p className="muted max-w-[46ch] text-[length:var(--text-lead)] leading-relaxed">{hero.body}</p>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <Link
                    href={hero.primaryCta.href}
                    className="btn btn--primary"
                    onClick={() => track('hero_cta_primary')}
                  >
                    {hero.primaryCta.label}
                  </Link>
                </Magnetic>
                <Link
                  href={hero.secondaryCta.href}
                  className="btn btn--ghost"
                  onClick={() => track('hero_cta_secondary')}
                >
                  {hero.secondaryCta.label} <span className="arrow">→</span>
                </Link>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <p className="faint mt-5 text-sm">{hero.assurance}</p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={480}>
          <dl
            className="panel mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3"
            style={{ borderColor: 'var(--rule)' }}
          >
            {hero.proof.map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-3">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="m-0 flex items-baseline gap-3">
                  <span className="font-[family-name:var(--font-display)] text-[clamp(2.25rem,4vw,3.25rem)] font-black leading-none tracking-tight">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="muted max-w-[16ch] text-sm leading-snug">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <ScrollHint />
      </div>
    </PinnedStage>
  )
}

/** Signals that the pin is intentional and there is more below. */
function ScrollHint() {
  return (
    <p
      aria-hidden="true"
      className="faint mt-10 hidden items-center gap-3 text-[0.7rem] tracking-[0.18em] uppercase lg:flex"
    >
      <span className="relative block h-8 w-px overflow-hidden" style={{ background: 'var(--rule-strong)' }}>
        <span className="scroll-hint absolute inset-x-0 top-0 h-3" style={{ background: 'var(--accent)' }} />
      </span>
      Scroll to assemble
    </p>
  )
}
