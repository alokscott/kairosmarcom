'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useTransform, type MotionValue } from 'motion/react'
import { Counter, Magnetic, Reveal } from '@/components/motion/Reveal'
import { KineticHeadline, PinnedStage } from '@/components/motion/Kinetic'
import { useScrollProgress, useStill } from '@/components/motion/scroll'
import { Scene } from '@/components/three/Scene'
import { hero, heroVideo } from '@/content/site'
import { track } from '@/lib/analytics'

/**
 * Hero.
 *
 * A pinned stage: the panel holds while roughly two extra viewports of scroll drive
 * the camera in and the fragments converge into the core. The headline, both CTAs
 * and the response assurance are server-rendered text that never moves out of
 * reading position while that happens.
 *
 * Over that, the scene opens. An aperture starts as a contained window onto the
 * canvas and expands to full bleed as the pin runs — so the 3D layer arrives as a
 * framed object and then becomes the room the page is standing in. The two text
 * columns drift apart by a few viewport-width percent as it opens, which is what
 * makes the expansion read as depth rather than as a rectangle being resized.
 *
 * Pinning is `position: sticky`, so the wheel and scrollbar still move the page at
 * their normal rate. Under reduced motion the stage stops pinning, the aperture is
 * not rendered at all, and this becomes a plain static hero.
 */
export default function Hero() {
  const stage = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const still = useStill()

  // A looping background is exactly the kind of persistent movement the reduced-motion
  // preference exists to remove. Rewound as well as paused, so what remains is the
  // opening frame rather than wherever it happened to be when the effect ran.
  useEffect(() => {
    if (!still || !video.current) return
    video.current.pause()
    video.current.currentTime = 0
  }, [still])
  // 'start start' → 'end end' is exactly the window in which the panel is pinned.
  const p = useScrollProgress(stage, ['start start', 'end end'])

  /*
   * The aperture is four bars of page colour that slide off the edges, not a box
   * being resized. Same picture, but every frame is a transform on four elements
   * instead of a layout pass plus a viewport-sized repaint. It finishes opening at
   * 55%, leaving the rest of the pin for reading.
   */
  const barY = useTransform(p, [0, 0.55], ['0vh', '-28vh'])
  const barYneg = useTransform(p, [0, 0.55], ['0vh', '28vh'])
  const barX = useTransform(p, [0, 0.55], ['0vw', '-27vw'])
  const barXneg = useTransform(p, [0, 0.55], ['0vw', '27vw'])

  const leftX = useTransform(p, [0, 0.55], ['0vw', '-3vw'])
  const rightX = useTransform(p, [0, 0.55], ['0vw', '3vw'])
  const cue = useTransform(p, [0, 0.18], [1, 0])

  return (
    <PinnedStage
      ref={stage}
      vh={280}
      accent="orange"
      className="in-scene"
      scene={<Scene preset="core" accent="orange" />}
    >
      {heroVideo.src && (
        <div aria-hidden="true" className="hero-video">
          <video
            ref={video}
            className="hero-video__el"
            src={heroVideo.src}
            poster={heroVideo.poster ?? undefined}
            // Silent, decorative and looping. `muted` + `playsInline` are what let it
            // autoplay at all on mobile Safari; without both it stays on the poster.
            // Reduced motion is handled by the effect above, which rewinds and pauses:
            // toggling this attribute after mount would not stop a video already playing.
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            tabIndex={-1}
          />
          {/*
            Legibility guard. The scrim is painted in --bg itself, so it darkens the
            footage in dark mode and lightens it in light mode — which means --fg is
            the winning colour over the video in BOTH themes without a second set of
            text colours. Video frames are unpredictable; this is what stops a bright
            frame from dropping the headline below AA.
          */}
          <span className="hero-video__scrim" />
        </div>
      )}

      {!still && (
        <div aria-hidden="true" className="hero-aperture">
          <motion.span className="hero-aperture__bar hero-aperture__bar--t" style={{ y: barY }} />
          <motion.span className="hero-aperture__bar hero-aperture__bar--b" style={{ y: barYneg }} />
          <motion.span className="hero-aperture__bar hero-aperture__bar--l" style={{ x: barX }} />
          <motion.span className="hero-aperture__bar hero-aperture__bar--r" style={{ x: barXneg }} />
        </div>
      )}

      <div className="shell relative z-10 w-full">
        <div className="grid-editorial items-start">
          <motion.div className="scrim col-span-4 md:col-span-7" style={still ? undefined : { x: leftX }}>
            <Reveal>
              <p className="eyebrow mb-5">{hero.eyebrow}</p>
            </Reveal>

            {/* The width axis is scroll-driven: the headline compresses on entry and
                opens out as the core assembles behind it. */}
            {/* Above the fold, so it runs on load rather than waiting for a scroll
                that has already happened. Descends into place. */}
            <h1 className="text-[length:var(--text-display)]">
              <KineticHeadline lines={hero.headline} kinetic enter="down" trigger="load" />
            </h1>
          </motion.div>

          <motion.div
            className="panel col-span-4 md:col-span-5 md:col-start-8"
            style={still ? undefined : { x: rightX }}
          >
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
          </motion.div>
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

        <ScrollHint opacity={still ? undefined : cue} />
      </div>
    </PinnedStage>
  )
}

/** Signals that the pin is intentional and there is more below. */
function ScrollHint({ opacity }: { opacity?: MotionValue<number> }) {
  return (
    <motion.p
      aria-hidden="true"
      style={{ opacity }}
      className="faint mt-10 hidden items-center gap-3 text-[0.7rem] tracking-[0.18em] uppercase lg:flex"
    >
      <span className="relative block h-8 w-px overflow-hidden" style={{ background: 'var(--rule-strong)' }}>
        <span className="scroll-hint absolute inset-x-0 top-0 h-3" style={{ background: 'var(--accent)' }} />
      </span>
      Scroll to assemble
    </motion.p>
  )
}
