import { Reveal } from '@/components/motion/Reveal'
import LineIcon from '@/components/site/LineIcon'
import { craftIntro, craftProof } from '@/content/site'

/**
 * Craft proof.
 *
 * The credentials work that has no case study of its own — marks drawn, systems
 * written, feeds run, coverage placed and platforms built.
 *
 * Seven cards, not six. The copy deck describes this as a reuse of the six-card
 * discipline grid but supplies Logo Creation and Logo Revamp separately, and merging
 * them would lose the distinction between new marks and rebuilds. The grid is two-up
 * and three-up rather than fixed at six, so an odd count sits correctly.
 */

/**
 * One line icon per discipline, drawn rather than imported.
 *
 * No icon library: seven glyphs is not worth a dependency, and a general-purpose set
 * would arrive in someone else's drawing style. These are built from the same shapes
 * as the brand mark — circles, triangles, the six-point star, straight rules — at a
 * single stroke weight, so they read as a family with the logo rather than as stock
 * pictograms sitting next to it.
 *
 * `currentColor` throughout, which is what lets the hover state recolour them from CSS
 * without a second copy of each path.
 */
const ICONS: Record<string, React.ReactNode> = {
  /* A drafting compass over the arc it has struck — mark-making, rather than a
     finished mark. The six-point star was here first and read as the Kairos logo
     itself, which says "this is our brand", not "we draw yours". */
  'Logo Creation': (
    <>
      <path d="M12 3.2v2.4" />
      <circle cx="12" cy="4" r="1.4" />
      <path d="M11 5.4 6.5 18.2M13 5.4l4.5 12.8" />
      <path d="M5.2 20.4a11 11 0 0 1 13.6 0" />
    </>
  ),
  'Logo Revamp': (
    <>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path d="M20 4v4.2h-4.2" />
      <circle cx="12" cy="12" r="2.4" />
    </>
  ),
  'Brand Guidelines': (
    <>
      <rect x="4" y="3.5" width="16" height="17" rx="1" />
      <path d="M8 8.5h8M8 12h8M8 15.5h5" />
    </>
  ),
  'Social Media': (
    <>
      <circle cx="6" cy="17" r="2.4" />
      <circle cx="18" cy="17" r="2.4" />
      <circle cx="12" cy="6" r="2.4" />
      <path d="M10.6 8.1 7.4 14.9M13.4 8.1l3.2 6.8M8.4 17h7.2" />
    </>
  ),
  'Digital Marketing': (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.6" />
      <path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3" />
    </>
  ),
  'Public Relations': (
    <>
      <circle cx="12" cy="12" r="2" />
      <path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4" />
      <path d="M4.6 4.6a10.5 10.5 0 0 0 0 14.8M19.4 4.6a10.5 10.5 0 0 1 0 14.8" />
    </>
  ),
  Technology: (
    <>
      <path d="M8.5 8 4 12l4.5 4M15.5 8l4.5 4-4.5 4" />
      <path d="M13.4 5.5 10.6 18.5" />
    </>
  ),
}

export default function CraftProof() {
  return (
    <section className="section" data-accent="violet">
      <div className="shell">
        <Reveal>
          <p className="eyebrow mb-4">Craft proof</p>
          <h2 className="max-w-[18ch] text-[length:var(--text-h1)]">The work behind the work</h2>
          <p className="muted mt-6 max-w-[62ch] text-[length:var(--text-lead)]">{craftIntro}</p>
        </Reveal>

        {/*
          Rows, not a card grid.

          Seven is prime: no two- or three-column grid can tile it, so the last row was
          always short. A grid of six with the two logo lines merged would tile, but a
          new mark and a rebuild are different pieces of work and the copy deck lists
          them apart. Letting the seventh card span the remaining columns tiled the grid
          and looked worse than the hole — a title stranded at the bottom-left of a
          band with its body floating away at the top-right.

          A row list has no leftover to solve. It also gives the body copy a proper
          measure instead of a narrow card column, and it takes an eighth discipline or
          a sixth without anyone having to think about the arithmetic again.
        */}
        <ul className="mt-14 m-0 list-none p-0">
          {craftProof.map((item, i) => (
            <li
              key={item.title}
              className="tile tile--turn border-t"
              style={{ borderColor: 'var(--rule)' }}
            >
              {/* Drawn from the left on hover, the same gesture the case cards use —
                  one hover language across the page rather than two. */}
              <span aria-hidden="true" className="tile__rule" />

              {/*
                A plain grid, NOT `.grid-editorial`.

                That class sets its own `row-gap` and globals.css is unlayered, so it
                beats any Tailwind `gap-y-*` utility regardless of specificity — the
                same trap documented on `.panel` and `.lightbox`. The utility here was
                being silently ignored and each row got the editorial gap meant for
                separating unrelated blocks, which on a phone put ~50px between an icon
                and the title it belongs to.
              */}
              <div className="grid grid-cols-4 items-start gap-x-[clamp(1rem,2.5vw,2rem)] gap-y-3 py-8 md:grid-cols-12">
                <div className="col-span-4 flex items-center gap-5 md:col-span-2">
                  <LineIcon className="tile__icon">
                    {ICONS[item.title]}
                  </LineIcon>
                  <p className="mono-num text-xs" style={{ color: 'var(--accent-text)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </p>
                </div>

                <h3 className="tile__title col-span-4 text-[length:var(--text-h3)] md:col-span-4">
                  {item.title}
                </h3>

                <p className="muted col-span-4 m-0 max-w-[62ch] leading-relaxed md:col-span-6">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
