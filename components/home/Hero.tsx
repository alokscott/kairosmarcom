'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Counter, Magnetic, Reveal } from '@/components/motion/Reveal'
import { KineticHeadline } from '@/components/motion/Kinetic'
import { useStill } from '@/components/motion/scroll'
import { hero, heroVideo } from '@/content/site'
import { track } from '@/lib/analytics'

/**
 * Hero.
 *
 * One viewport, static, split in two: type on the left, the studio on the right,
 * seen through the Kairos mark.
 *
 * ─── Why the video is not a background ───
 *
 * It was, briefly, and that was wrong twice over. A full-bleed video behind copy has
 * to be pushed most of the way to the page colour before the headline is legible on
 * it, so the footage arrives washed out and half-hidden — you pay the whole 2.4MB and
 * the bandwidth to show almost none of it. And it makes the text's contrast depend on
 * whatever frame happens to be on screen, which is a problem you can only ever manage,
 * never solve.
 *
 * So the footage gets its own place in the composition instead. It is masked into the
 * circle of the logo, with the mark's ray ring turning around it: the brand's own
 * shape becomes a porthole onto the room the work is made in, which is what "the hub
 * of creativity" is supposed to mean. The video plays at full contrast because
 * nothing is set on top of it, and the type sits on plain paper because nothing is set
 * behind it.
 *
 * ─── Why the pin is gone ───
 *
 * This used to be a 280vh pinned stage whose visual GREW as you scrolled — a camera
 * dolly plus four bars of page colour sliding off the edges to open a framed window
 * onto the WebGL canvas. A visitor scrolls to reach what is below; handing them a
 * bigger picture instead reads as the page fighting them, and the half-open state left
 * a hard-edged rectangle behind the headline that looked like a rendering fault.
 *
 * The section also paints its own background, so the site-wide canvas does not show
 * through it. The hero has a mark of its own now, in the DOM, where it is crisp at any
 * DPR and always aligned to the video it frames.
 */

/** Teeth in the DOM ring. Matches the density of the printed mark. */
const RAYS = 44

export default function Hero() {
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

  return (
    <section
      id="hero"
      data-accent="orange"
      /*
       * One screen, always — and every vertical gap in here is clamped against `svh`
       * to keep that promise.
       *
       * `svh` rather than `vh` because on mobile Safari `vh` is the tallest the
       * viewport ever gets, so a full-height hero spends its last 60–80px underneath
       * the browser chrome until the user scrolls.
       *
       * Clamped rather than fixed because a hero built from fixed rem gaps only fits
       * at the height it was designed on: the same layout that landed exactly on 900px
       * overflowed a 1280×720 laptop by 65px, since the type column narrows as the
       * window does and the body copy gains lines precisely when there is least room
       * for them. Tying the rhythm to viewport height lets the section compress.
       * Verified at 1280×720, 1536×800, 1440×900 and 1920×1080 — hero height equals
       * viewport height at all four.
       */
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-[clamp(5rem,10svh,8rem)] pb-[clamp(1.5rem,4svh,2.5rem)]"
      style={{ background: 'var(--bg)' }}
    >
      <div className="shell relative z-10 w-full">
        <div className="grid-editorial items-center gap-y-[clamp(1.5rem,4svh,2.5rem)]">
          <div className="col-span-4 md:col-span-6">
            <Reveal>
              <p className="eyebrow mb-[clamp(0.75rem,1.6svh,1.25rem)]">{hero.eyebrow}</p>
            </Reveal>

            {/*
              A hero-specific size, one step below `--text-display`. The whole section
              has to land inside one viewport including the stat band, and the display
              scale tops out at 88px — three lines of which is 250px of a 900px screen
              before a word of body copy. Above the fold, so the entrance runs on load
              rather than waiting for a scroll that has already happened.
            */}
            <h1 className="text-[clamp(2.25rem,4.6vw,4rem)]">
              <KineticHeadline lines={hero.headline} kinetic enter="down" trigger="load" />
            </h1>

            <Reveal delay={220}>
              <p className="muted mt-[clamp(1rem,2.6svh,1.5rem)] max-w-[52ch] leading-relaxed">{hero.body}</p>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-[clamp(1.25rem,3svh,1.75rem)] flex flex-wrap items-center gap-3">
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
                  {hero.secondaryCta.label} <span aria-hidden="true" className="arrow">→</span>
                </Link>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <p className="faint mt-[clamp(0.75rem,2svh,1rem)] text-sm">{hero.assurance}</p>
            </Reveal>
          </div>

          <div className="col-span-4 md:col-span-6 md:col-start-7">
            <Reveal delay={180}>
              <Porthole videoRef={video} />
            </Reveal>
          </div>
        </div>

        {/* Sized down from the display scale for the same reason as the headline: this
            band is the last thing that has to fit above the fold. */}
        <Reveal delay={480}>
          <dl className="mt-[clamp(1.5rem,4svh,2.5rem)] grid grid-cols-1 gap-5 border-t pt-[clamp(1rem,2.6svh,1.5rem)] sm:grid-cols-3" style={{ borderColor: 'var(--rule)' }}>
            {hero.proof.map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-3">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="m-0 flex items-baseline gap-3">
                  <span className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,2.8vw,2.5rem)] font-black leading-none tracking-tight">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="muted max-w-[16ch] text-sm leading-snug">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}

/**
 * The mark as a window.
 *
 * An SVG ray ring and thin halo turning slowly around a circular video. Both are DOM,
 * not WebGL: they have to stay locked to the video's edge at every viewport width, and
 * a shared full-viewport canvas cannot promise that — it does not know where this
 * element is. It is also sharp at any device pixel ratio and costs no GL context.
 *
 * With no video the circle holds the mark alone, so the composition is complete either
 * way and nothing here has to branch beyond the one element.
 */
function Porthole({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement | null> }) {
  return (
    <div className="porthole" aria-hidden={heroVideo.src ? undefined : 'true'}>
      {/*
        The spin lives on a DIV wrapping the SVG, not on a <g> inside it.
        `transform-origin: 50% 50%` on an SVG group resolves against `transform-box`,
        whose value differs by browser and by whether the element has a bounding box
        yet — get it wrong and the rays orbit a point off to one side instead of
        turning on the spot, which is exactly what happened. A block element rotates
        about its own centre under every engine, with nothing to resolve.

        `viewBox` is -50..50 so every ray is authored around the origin and the whole
        mark scales with its container rather than needing pixel sizes per breakpoint.
      */}
      <div className="porthole__ring">
        <svg viewBox="-50 -50 100 100" role="presentation" focusable="false">
          {/*
            Short and narrow on purpose. At 41→47.5 the ray band was 13% of the mark's
            radius and read as a thick decorative frame competing with the footage it
            was supposed to be presenting; the printed mark's teeth are a fine edge on
            the circle, not a border around it. 47.2→49.6 is that edge — 2.4 units, so
            the ring costs 5% of the radius and the other 95% is picture.

            The count went up as the teeth got shorter. Density is what makes a serrated
            edge read as one continuous edge; 36 short teeth around a 302-unit
            circumference are dots, 44 are a rim.
          */}
          {Array.from({ length: RAYS }, (_, i) => (
            <polygon
              key={i}
              points="47.2,0 49.6,1.15 49.6,-1.15"
              fill="var(--accent)"
              transform={`rotate(${(i / RAYS) * 360})`}
            />
          ))}
        </svg>
      </div>

      <svg className="porthole__halo" viewBox="-50 -50 100 100" role="presentation" focusable="false">
        <circle r="46.6" fill="none" stroke="var(--accent)" strokeWidth="0.35" opacity="0.55" />
      </svg>

      <div className="porthole__window">
        {heroVideo.src ? (
          <video
            ref={videoRef}
            className="porthole__video"
            src={heroVideo.src}
            poster={heroVideo.poster ?? undefined}
            // Silent, decorative and looping. `muted` + `playsInline` are what let it
            // autoplay at all on mobile Safari; without both it stays on the poster.
            // Reduced motion is handled in the parent, which rewinds and pauses:
            // toggling this attribute after mount would not stop a video already playing.
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            tabIndex={-1}
          />
        ) : (
          /* No footage: the star alone, so the mark still reads as a mark. */
          <svg className="porthole__star" viewBox="-50 -50 100 100" role="presentation" focusable="false">
            <polygon points="0,-34 29.4,17 -29.4,17" fill="none" stroke="var(--accent)" strokeWidth="0.6" />
            <polygon points="0,34 29.4,-17 -29.4,-17" fill="none" stroke="var(--accent)" strokeWidth="0.6" />
          </svg>
        )}
      </div>
    </div>
  )
}
