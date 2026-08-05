'use client'

import { Reveal } from '@/components/motion/Reveal'
import { KineticHeadline, PinnedStage, Tilt } from '@/components/motion/Kinetic'
import { Scene } from '@/components/three/Scene'
import { useSceneStore } from '@/components/three/store'
import { dna, principles, principlesIntro } from '@/content/site'

/**
 * Four things every piece of work has to earn.
 *
 * A pinned stage: the panel holds while four viewports of scroll step the core
 * through four behaviours — nodes finding threads, a field snapping to a lattice,
 * a refracting core, an expanding ripple. Each principle cross-fades in the same
 * position rather than scrolling past, so the object and the words describing it
 * are always on screen together.
 *
 * Every principle is in the DOM at all times; the inactive ones are hidden from
 * assistive technology and from the tab order, not merely faded, so a screen reader
 * is never read four competing paragraphs at once.
 */
export default function Principles() {
  const { focus } = useSceneStore()
  const active = Math.min(focus, principles.length - 1)

  return (
    <>
      <PinnedStage
        id="how-we-think"
        vh={420}
        accent={principles[active]?.accent ?? 'orange'}
        className="in-scene"
        scene={<Scene preset="principle" accent={principles[active]?.accent ?? 'orange'} stages={4} intensity={0.95} />}
      >
        <div className="shell relative w-full">
          <div className="grid-editorial items-center">
            <div className="scrim col-span-4 md:col-span-5">
              <p className="eyebrow mb-4">How we think</p>
              <h2 className="text-[length:var(--text-h1)]">
                <KineticHeadline lines={['Four things', 'every piece of', 'work must earn']} />
              </h2>
              <p className="muted mt-6 max-w-[46ch]">{principlesIntro}</p>

              {/* A live index, and a keyboard-reachable list of what is coming. */}
              <ol className="mt-10 m-0 flex list-none gap-2 p-0" aria-label="Principles">
                {principles.map((p, i) => (
                  <li key={p.id} className="flex-1">
                    <span
                      className="block h-0.5 w-full origin-left transition-transform duration-500"
                      style={{
                        background: i <= active ? 'var(--accent)' : 'var(--rule)',
                        transitionTimingFunction: 'var(--ease-out-expo)',
                      }}
                    />
                    <span className="mono-num mt-2 block text-[0.7rem]" style={{ color: i === active ? 'var(--accent-text)' : 'var(--fg-faint)' }}>
                      {p.index}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="col-span-4 md:col-span-6 md:col-start-7">
              <div className="relative min-h-[22rem]">
                {principles.map((p, i) => {
                  const on = i === active
                  return (
                    <article
                      key={p.id}
                      aria-hidden={!on}
                      // `inert={false}` still emitted the attribute here, which made the visible
                      // card inert and left a hidden one focusable. Emitting nothing at all
                      // for the active card is unambiguous.
                      inert={on ? undefined : true}
                      className="panel absolute inset-0"
                      style={{
                        opacity: on ? 1 : 0,
                        transform: on ? 'none' : 'translateY(34px)',
                        transition: 'opacity 620ms var(--ease-out-expo), transform 620ms var(--ease-out-expo)',
                        pointerEvents: on ? 'auto' : 'none',
                      }}
                    >
                      <p
                        className="mono-num font-[family-name:var(--font-display)] text-[clamp(4rem,10vw,9rem)] font-black leading-[0.8] tracking-tighter"
                        style={{ color: 'var(--accent-text)' }}
                      >
                        {p.index}
                      </p>
                      <h3 className="mt-2 text-[length:var(--text-h1)]">{p.title}</h3>
                      <p className="muted mt-6 max-w-[46ch] text-[length:var(--text-lead)] leading-relaxed">{p.body}</p>
                      <p className="faint mt-6 max-w-[40ch] text-sm">
                        <span className="sr-only">Accompanying visual: </span>
                        {p.motif}
                      </p>
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </PinnedStage>

      {/* DNA sits outside the pin: it is a manifesto to read, not a sequence to scrub. */}
      <section className="section" data-accent="silver">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-8">Our DNA</p>
          </Reveal>
          <dl className="grid-editorial m-0">
            {dna.map((item, i) => (
              <Reveal key={item.title} delay={i * 70} className="col-span-4 md:col-span-6">
                <Tilt max={4} lift={6}>
                  <div
                    className="h-full border-t p-6 pl-0 md:pl-6"
                    style={{ borderColor: 'var(--rule)' }}
                  >
                    <dt className="statement mb-3">{item.title}</dt>
                    <dd className="muted m-0 max-w-[52ch] leading-relaxed">{item.body}</dd>
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
