import { Reveal } from '@/components/motion/Reveal'
import LineIcon from '@/components/site/LineIcon'
import { CRAFT_ICONS } from '@/components/site/icons'
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
                    {CRAFT_ICONS[item.title]}
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
