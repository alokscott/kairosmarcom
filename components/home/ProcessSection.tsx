'use client'

import { KineticHeadline, PinnedStage } from '@/components/motion/Kinetic'
import { Scene } from '@/components/three/Scene'
import { useSceneStore } from '@/components/three/store'
import { processIntro, processSteps } from '@/content/site'

/**
 * The Kairos moment — four steps.
 *
 * Pinned, four stages. The shard field changes both how tightly it holds and what
 * shape it holds across Listen → Distil → Build → Hand over: scattered signal,
 * compressed into one object, assembled onto a lattice, then distributed outward
 * as a ring of reusable parts.
 *
 * Each step's own stage name sits as literal text on the left rail, so the sequence
 * is readable whether or not the scene ever runs.
 */
export default function ProcessSection({ heading = true }: { heading?: boolean }) {
  const { focus } = useSceneStore()
  const active = Math.min(focus, processSteps.length - 1)

  return (
    <PinnedStage
      id="process"
      vh={420}
      accent="lime"
      className="in-scene"
      scene={<Scene preset="process" accent="lime" stages={4} />}
    >
      <div className="shell relative w-full">
        <div className="grid-editorial items-center">
          <div className="col-span-4 md:col-span-5">
            {heading && (
              <>
                <p className="eyebrow mb-4">Kairos moment</p>
                <h2 className="text-[length:var(--text-h2)]">
                  <KineticHeadline lines={['Kairos.', 'The Supreme', 'Moment.']} />
                </h2>
                {/* Sized to fit the pin: the serif statement treatment runs at
                    display size and pushed the step rail out of the viewport. */}
                <p className="muted mt-6 max-w-[42ch] leading-relaxed">{processIntro}</p>
              </>
            )}

            <ol className="mt-8 m-0 list-none p-0" aria-label="The four steps">
              {processSteps.map((step, i) => (
                <li
                  key={step.title}
                  className="flex items-baseline gap-4 border-b py-3"
                  style={{ borderColor: 'var(--rule)' }}
                  aria-current={i === active ? 'step' : undefined}
                >
                  <span
                    className="mono-num text-xs transition-colors duration-300"
                    style={{ color: i === active ? 'var(--accent-text)' : 'var(--fg-faint)' }}
                  >
                    {step.index}
                  </span>
                  <span
                    className="text-sm transition-colors duration-300"
                    style={{ color: i === active ? 'var(--fg)' : 'var(--fg-faint)' }}
                  >
                    {step.title}
                  </span>
                  <span className="faint ml-auto text-xs">{step.stage}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="col-span-4 md:col-span-6 md:col-start-7">
            {/* Grid stack — see the note in Principles.tsx; same overflow bug. */}
            <div className="grid">
              {processSteps.map((step, i) => {
                const on = i === active
                return (
                  <article
                    key={step.title}
                    aria-hidden={!on}
                    // `inert={false}` still emitted the attribute here, which made the visible
                      // card inert and left a hidden one focusable. Emitting nothing at all
                      // for the active card is unambiguous.
                      inert={on ? undefined : true}
                    className="panel col-start-1 row-start-1"
                    style={{
                      opacity: on ? 1 : 0,
                      transform: on ? 'none' : 'translateY(34px)',
                      transition: 'opacity 620ms var(--ease-out-expo), transform 620ms var(--ease-out-expo)',
                      pointerEvents: on ? 'auto' : 'none',
                    }}
                  >
                    <p className="mono-num text-xs tracking-[0.18em] uppercase" style={{ color: 'var(--accent-text)' }}>
                      {step.index} — {step.stage}
                    </p>
                    <h3 className="mt-3 text-[clamp(2.5rem,6vw,4.5rem)]">{step.title}</h3>
                    <p className="mt-6 max-w-[52ch] text-[length:var(--text-lead)] leading-relaxed">{step.body}</p>

                    <dl className="mt-8 grid gap-5 border-t pt-6 sm:grid-cols-2" style={{ borderColor: 'var(--rule)' }}>
                      <div>
                        <dt className="faint text-xs tracking-[0.14em] uppercase">Your decision point</dt>
                        <dd className="muted m-0 mt-2 text-sm leading-relaxed">{step.clientDecision}</dd>
                      </div>
                      <div>
                        <dt className="faint text-xs tracking-[0.14em] uppercase">On screen</dt>
                        <dd className="muted m-0 mt-2 text-sm leading-relaxed">{step.motif}</dd>
                      </div>
                    </dl>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </PinnedStage>
  )
}
