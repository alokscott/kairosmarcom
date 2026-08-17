import { Reveal } from '@/components/motion/Reveal'
import { brandRoster, brandsIntro } from '@/content/site'

/**
 * One line icon per sector, drawn to the same rules as the craft-proof set: single
 * stroke weight, 24-unit box, geometry rather than illustration, `currentColor` so
 * the hover state recolours them from CSS.
 *
 * These name the ROOM, which is what the heading promises — "different rooms, same
 * conviction". A sector is otherwise a 12px uppercase label, and eight of those
 * stacked in a grid give the eye nothing to sort by. The icon is what makes the card
 * findable at a glance.
 */
const SECTOR_ICONS: Record<string, React.ReactNode> = {
  /* Concierge bell. */
  Hospitality: (
    <>
      <path d="M4 17h16" />
      <path d="M5.5 17a6.5 6.5 0 0 1 13 0" />
      <path d="M12 10.5V8" />
      <circle cx="12" cy="6.6" r="1.4" />
      <path d="M6.5 20h11" />
    </>
  ),
  /* Card with a rising column — money that moves, not a coin. */
  Fintech: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="1.5" />
      <path d="M3 10h18" />
      <path d="M7.5 15v-1.5M11 15v-3M14.5 15v-2.2" />
    </>
  ),
  /* A wheel. A car outline at this weight turns into a blob. */
  Automotive: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v5.5M12 15v5.5M3.5 12h5.5M15 12h5.5" />
    </>
  ),
  /* Org chart — the shape a standards body or a council actually has. */
  Organisation: (
    <>
      <rect x="9" y="3" width="6" height="4.5" rx="0.8" />
      <rect x="2.5" y="16.5" width="6" height="4.5" rx="0.8" />
      <rect x="15.5" y="16.5" width="6" height="4.5" rx="0.8" />
      <path d="M12 7.5v4M5.5 16.5v-2.5h13v2.5" />
    </>
  ),
  /* Paper plane. */
  Airlines: (
    <>
      <path d="M21 3 10.5 14" />
      <path d="M21 3 14.5 21l-4-7-7-4L21 3Z" />
    </>
  ),
  /* Shopping bag. */
  Consumer: (
    <>
      <path d="M4.5 7.5h15l-1.2 13H5.7l-1.2-13Z" />
      <path d="M8.7 10V6.2a3.3 3.3 0 0 1 6.6 0V10" />
    </>
  ),
  /* Mortarboard. */
  Education: (
    <>
      <path d="M12 4 2.5 8.6 12 13.2l9.5-4.6L12 4Z" />
      <path d="M6.5 10.8v5.1c0 1.6 2.5 2.9 5.5 2.9s5.5-1.3 5.5-2.9v-5.1" />
      <path d="M21.5 8.6v5.6" />
    </>
  ),
  /* House with a plot line under it. */
  'Real Estate': (
    <>
      <path d="M3.5 10.8 12 4l8.5 6.8" />
      <path d="M5.8 9v9.5h12.4V9" />
      <path d="M10 18.5v-4.6h4v4.6" />
      <path d="M2.5 21h19" />
    </>
  ),
}

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
 */
/*
 * The band carries no `data-accent="silver"` any more.
 *
 * Silver is the palette's neutral, kept for bands that should recede — and on a silver
 * section `--accent` resolves to grey, which meant the hover state drew a grey rule and
 * turned the icon grey-on-grey. The feedback was firing correctly and was invisible.
 * The quiet in this band now comes from the card surfaces, not from draining the colour
 * out of the one thing that has to be seen to work.
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
                  <svg
                    className="tile__icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    {SECTOR_ICONS[row.sector]}
                  </svg>
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
