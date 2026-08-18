import { Reveal } from '@/components/motion/Reveal'
import LineIcon from '@/components/site/LineIcon'
import { SECTOR_ICONS } from '@/components/site/icons'
import { brandRoster, brandsIntro } from '@/content/site'

/**
 * Brands we work with.
 *
 * A full-width band in the same treatment as the film grid, carrying the roster the
 * site otherwise reduces to the five names on the trust strip.
 *
 * Set in type, not logos: no mark for these brands exists as a file in this repo and
 * none carries written permission to republish, so a logo grid here would mean
 * shipping either fabricated or unapproved assets. The row shape takes logos
 * unchanged once permissions land — see docs/09-content-migration.md.
 *
 * One definition list per sector rather than a single flat grid, so a screen reader
 * hears which sector each set of names belongs to instead of forty-odd loose items.
 *
 * The band carries no `data-accent="silver"`. Silver is the palette's neutral, kept for
 * bands that should recede — and on a silver section `--accent` resolves to grey, which
 * meant the hover state drew a grey rule and turned the icon grey-on-grey: firing
 * correctly and invisible. The quiet here comes from the card surfaces instead.
 */
export default function BrandRoster() {
  return (
    <section id="brands" className="section scroll-mt-24 border-y" style={{ borderColor: 'var(--rule)' }}>
      <div className="shell">
        <Reveal>
          <p className="eyebrow mb-4">Brands we work with</p>
          <h2 className="max-w-[16ch] text-[length:var(--text-h1)]">Different rooms, same conviction</h2>
          <p className="muted mt-6 max-w-[62ch] text-[length:var(--text-lead)]">{brandsIntro}</p>
        </Reveal>

        {/*
          Eight cards, not eight rows.

          As full-width rows this was a table: a tiny grey label stranded in a wide left
          column, forty-odd names running on in one wrapping paragraph per sector, and
          nothing giving any of it a shape. It also had nowhere to hide the scene — the
          centre of the frame falls in the middle of a full-width row, so the star sat
          across the middle of the names.

          Cards fix both. Each sector becomes a bordered cell that paints its own
          surface, which is what a logo wall looks like when the logos are set in type
          instead of drawn — and the scene stays fully visible in the page margins and
          the seams between cells rather than being dimmed away.

          Two columns take the eight sectors exactly, so no cell is ever left empty.
          Borders are per-cell with negative margins collapsing the doubles: the
          gap-px-over-a-tinted-parent trick needs the grid to tile completely and leaves
          a grey slab behind wherever it does not.
        */}
        <dl className="mt-14 m-0 grid sm:grid-cols-2">
          {brandRoster.map((row, i) => (
            <Reveal key={row.sector} delay={i * 50} className="-mt-px -ml-px flex">
              <div
                className="tile tile--lift flex w-full flex-col border p-7"
                style={{ background: 'var(--bg)', borderColor: 'var(--rule)' }}
              >
                <span aria-hidden="true" className="tile__rule" />

                {/* The label sits BESIDE the icon, not pushed to the far edge by a
                    `justify-between`. Across the card the two read as two unrelated
                    marks; together they read as one label with a symbol. */}
                <div className="mb-6 flex items-center gap-4">
                  <LineIcon className="tile__icon">
                    {SECTOR_ICONS[row.sector]}
                  </LineIcon>
                  <dt className="tile__title eyebrow">{row.sector}</dt>
                </div>

                <dd className="m-0">
                  <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2.5 p-0">
                    {row.brands.map((brand) => (
                      <li
                        key={brand}
                        className="font-[family-name:var(--font-display)] text-[clamp(1.0625rem,1.5vw,1.375rem)] font-bold tracking-tight"
                      >
                        {brand}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>

        <p className="faint mt-8 max-w-[62ch] text-sm">
          Names are listed as supplied. Client marks are not reproduced here until written permission for each is on
          file.
        </p>
      </div>
    </section>
  )
}
