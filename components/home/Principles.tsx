'use client'

import { Reveal } from '@/components/motion/Reveal'
import { KineticHeadline, PinnedStage, Tilt } from '@/components/motion/Kinetic'
import LineIcon from '@/components/site/LineIcon'
import { PRINCIPLE_ICONS } from '@/components/site/icons'
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
            <div className="col-span-4 md:col-span-5">
              <p className="eyebrow mb-4">How we think</p>
              <h2 className="text-[length:var(--text-h1)]">
                {/* Three lines, each at most fourteen characters. The pinned panel
                    sizes to three, and a fourth line clipped against the mask. */}
                <KineticHeadline lines={['How we get', 'things flowing', 'in four steps']} />
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
              {/*
                Grid stack, not absolute + min-height. Every card occupies the same
                cell, so the container measures the TALLEST card and the panel can
                never be shorter than its own text. With `absolute inset-0` the cards
                were locked to the 22rem min-height and the longest one overflowed its
                own background and border by ~40px.
              */}
              <div className="grid">
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
                      className="panel col-start-1 row-start-1"
                      style={{
                        opacity: on ? 1 : 0,
                        transform: on ? 'none' : 'translateY(34px)',
                        transition: 'opacity 620ms var(--ease-out-expo), transform 620ms var(--ease-out-expo)',
                        pointerEvents: on ? 'auto' : 'none',
                      }}
                    >
                      {/* The oversized numeral is the card's anchor; the icon sits
                          opposite it on the same optical line, so the pair reads as one
                          masthead rather than as a glyph added above the text. */}
                      <div className="flex items-start justify-between gap-6">
                        <p
                          className="mono-num font-[family-name:var(--font-display)] text-[clamp(4rem,10vw,9rem)] font-black leading-[0.8] tracking-tighter"
                          style={{ color: 'var(--accent-text)' }}
                        >
                          {p.index}
                        </p>
                        <LineIcon
                          className="mt-2 w-[clamp(2.5rem,4.4vw,3.75rem)] flex-none"
                          style={{ color: 'var(--accent)' }}
                        >
                          {PRINCIPLE_ICONS[p.id]}
                        </LineIcon>
                      </div>
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

      {/*
        DNA sits outside the pin: it is a manifesto to read, not a sequence to scrub.

        It also paints its own near-opaque surface, like the client wall. Four
        paragraphs is the densest block of running text on the homepage, and the ray
        ring passing behind it made it work to read even though the contrast maths
        clears AA. The 6% left over plus the blur keeps the backdrop's colour shifting
        underneath, so the band still belongs to the page rather than sitting on it.
      */}
      <section
        className="section"
        data-accent="silver"
        style={{
          background: 'color-mix(in srgb, var(--bg) 94%, transparent)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="shell">
          <Reveal>
            <DnaHeading />
          </Reveal>
          <dl className="mt-12 grid-editorial m-0">
            {dna.map((item, i) => (
              <Reveal key={item.title} delay={i * 70} className="col-span-4 md:col-span-6">
                <Tilt max={4} lift={6}>
                  {/*
                    No left padding. `md:pl-6` indented every card 24px past the shell,
                    so the heading above started at the column edge and the copy under
                    it did not — the whole block read as nudged out of the grid. Padding
                    stays on the right, where it is what holds the two columns apart.
                  */}
                  <div
                    className="h-full border-t py-6 pr-6"
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

/**
 * "Our DNA", set as a lockup rather than a label.
 *
 * It was an `.eyebrow` — 12px, letterspaced, uppercase — which is the site's smallest
 * type, used for section tags like "HOW WE THINK". That is the right size for a tag
 * above a headline and the wrong size when it IS the headline: the section had no
 * heading at display scale at all, so four serif statements sat under a caption.
 *
 * The lockup pairs the two faces the site already runs against each other — the serif
 * italic that sets the four statements below, and the display black that sets every
 * other H2 — so the heading reads as a deliberate piece of typography rather than a
 * bigger version of the label it replaced. Exported so the About page can use the same
 * one instead of drifting into its own treatment.
 */
export function DnaHeading() {
  return (
    <h2 className="dna-heading">
      {/*
        The explicit space is not cosmetic — the gap between the words is drawn by
        `gap`, and without this the heading's text content is "OurDNA", which is what a
        screen reader announces and what a page search matches against. A whitespace-
        only text node between flex items generates no anonymous flex item, so it
        changes the accessible name and nothing about the layout.
      */}
      <span className="dna-heading__serif">Our</span>{' '}
      <span className="dna-heading__display">DNA</span>
    </h2>
  )
}
