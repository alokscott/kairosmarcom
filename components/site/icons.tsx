import type { ServiceId } from '@/content/types'

/**
 * Every icon on the site, in one place.
 *
 * They started as five private maps, one per component, which was right while each
 * was used once. It stopped being right the moment the inner pages needed the same
 * glyphs: /services shows the disciplines the homepage picker shows, /process lists
 * the same four steps, /about carries the same four principles. A second copy of a
 * hand-drawn path is a second copy to keep in step, and they would not have stayed in
 * step.
 *
 * All of them follow the rules in ./LineIcon.tsx — a 24-unit box, one stroke weight,
 * geometry rather than illustration, `currentColor` so a hover or an accent recolours
 * them without a second copy of each path. No icon library: a general-purpose set
 * arrives in someone else's drawing style, and the point of these is that they are
 * built from the shapes the Kairos mark is built from.
 */

export const SERVICE_ICONS: Record<ServiceId, React.ReactNode> = {
  /* A bezier with its two control handles — drawing, not a drawn thing. */
  'creative-design': (
    <>
      <path d="M3.5 18.5c0-8 5-13 17-13" />
      <circle cx="3.5" cy="18.5" r="1.8" />
      <circle cx="20.5" cy="5.5" r="1.8" />
      <path d="M3.5 12.5h5M15.5 18.5h5" />
    </>
  ),
  /* A tag with its eyelet. */
  branding: (
    <>
      <path d="M11.4 3.5H20a.5.5 0 0 1 .5.5v8.6a1 1 0 0 1-.3.7l-7.7 7.7a1 1 0 0 1-1.4 0l-8-8a1 1 0 0 1 0-1.4l7.7-7.7a1 1 0 0 1 .6-.4Z" />
      <circle cx="16.4" cy="7.6" r="1.6" />
    </>
  ),
  /* A window with a pointer in it. */
  digital: (
    <>
      <rect x="2.5" y="4" width="19" height="15" rx="1.4" />
      <path d="M2.5 8h19" />
      <path d="M10 11.5l6 3-2.6 1-1 2.6-2.4-6.6Z" />
    </>
  ),
  /* A megaphone. */
  'public-relations': (
    <>
      <path d="M3.5 9.5v5a1 1 0 0 0 1 1h2.7l8.3 4.5V4L7.2 8.5H4.5a1 1 0 0 0-1 1Z" />
      <path d="M19 9a4.2 4.2 0 0 1 0 6" />
      <path d="M7.2 15.5v3.2a1 1 0 0 0 1 1h1.6" />
    </>
  ),
  /* Angle brackets — the same glyph the craft row uses, because it means the same
     thing there and a second invention would only make the two look unrelated. */
  technology: (
    <>
      <path d="M8.5 8 4 12l4.5 4M15.5 8l4.5 4-4.5 4" />
      <path d="M13.4 5.5 10.6 18.5" />
    </>
  ),
  /* A clapperboard. */
  video: (
    <>
      <rect x="2.5" y="8" width="19" height="12" rx="1.2" />
      <path d="M2.9 8 6 3.9l3.6 3.6M9.3 8 12.4 3.9 16 7.5M15.7 8l3.1-4.1 2.4 2.4" />
      <path d="M10.4 11.8v4.4l4-2.2-4-2.2Z" />
    </>
  ),
}

export const STEP_ICONS: Record<string, React.ReactNode> = {
  /* An eye — the step is called Observe. */
  Listen: (
    <>
      <path d="M2 12s3.8-6 10-6 10 6 10 6-3.8 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  /* A funnel with a single drop under it. */
  Distil: (
    <>
      <path d="M3.5 4.5h17l-6.4 7.6v6.1l-4.2 2.3v-8.4L3.5 4.5Z" />
    </>
  ),
  /* Blocks assembling into one form. */
  Build: (
    <>
      <rect x="3" y="13" width="8" height="8" rx="0.8" />
      <rect x="13" y="13" width="8" height="8" rx="0.8" />
      <rect x="8" y="3" width="8" height="8" rx="0.8" />
      <path d="M12 11v2" />
    </>
  ),
  /* A box with the work leaving it. */
  'Hand over': (
    <>
      <path d="M20.5 13.5v6a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-6" />
      <path d="M12 15V3.5" />
      <path d="M8 7.2 12 3.2l4 4" />
    </>
  ),
}

export const PRINCIPLE_ICONS: Record<string, React.ReactNode> = {
  connection: (
    <>
      <circle cx="8.5" cy="12" r="5.5" />
      <circle cx="15.5" cy="12" r="5.5" />
    </>
  ),
  logic: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="1" />
      <path d="M3.5 9.2h17M3.5 14.8h17M9.2 3.5v17M14.8 3.5v17" />
    </>
  ),
  magic: (
    <>
      <path d="M12 3.2c0 4.4 1.4 5.8 5.8 5.8-4.4 0-5.8 1.4-5.8 5.8 0-4.4-1.4-5.8-5.8-5.8 4.4 0 5.8-1.4 5.8-5.8Z" />
      <path d="M17.6 15.4c0 2.2.7 2.9 2.9 2.9-2.2 0-2.9.7-2.9 2.9 0-2.2-.7-2.9-2.9-2.9 2.2 0 2.9-.7 2.9-2.9Z" />
    </>
  ),
  cause: (
    <>
      <circle cx="12" cy="12" r="1.8" />
      <path d="M12 6.4a5.6 5.6 0 0 1 0 11.2 5.6 5.6 0 0 1 0-11.2Z" />
      <path d="M12 2.5a9.5 9.5 0 0 1 0 19 9.5 9.5 0 0 1 0-19Z" />
    </>
  ),
}

export const SECTOR_ICONS: Record<string, React.ReactNode> = {
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

export const CRAFT_ICONS: Record<string, React.ReactNode> = {
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

/**
 * The three hero statistics, in order.
 *
 * An array rather than a keyed map: these are positional by nature — `hero.proof` is a
 * fixed three in content/site.ts — and keying them by their label would make a copy
 * edit silently drop an icon.
 */
export const STAT_ICONS: React.ReactNode[] = [
  /* Two figures — clients, not users. */
  <>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20.5a6 6 0 0 1 12 0" />
    <path d="M16 5.4a3.2 3.2 0 0 1 0 6.2" />
    <path d="M17.5 14.4a6 6 0 0 1 3.5 5.4" />
  </>,
  /* Six cells — one per discipline. */
  <>
    <rect x="3" y="4.5" width="8" height="5.5" rx="0.8" />
    <rect x="13" y="4.5" width="8" height="5.5" rx="0.8" />
    <rect x="3" y="14" width="8" height="5.5" rx="0.8" />
    <rect x="13" y="14" width="8" height="5.5" rx="0.8" />
  </>,
  /* A pin. */
  <>
    <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </>,
]

/**
 * The four social platforms, keyed by the label in `social`.
 *
 * The one place the house style bends. Every other icon here is geometry invented for
 * this site, but these four are marks other companies own and a visitor recognises them
 * by their exact shape — "creatively reinterpreting" Instagram's camera would make a
 * glyph nobody can read, which is the only job this icon has.
 *
 * So the silhouettes are the real ones, redrawn to the LineIcon contract — 24-unit box,
 * one 1.4 stroke, `currentColor` — instead of pasted in as the filled brand assets.
 * That way they sit at the same weight as the rest of the site's icons and take the
 * hover colour from CSS like everything else, rather than arriving as four fixed-colour
 * logos in four different drawing styles.
 *
 * Keyed by label so a profile added to `social` without an icon fails visibly at the
 * call site rather than rendering an empty circle.
 */
export const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  /* The camera: rounded square, lens, and the flash in its corner. */
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <path d="M17.2 6.8h.01" strokeWidth="2.2" />
    </>
  ),
  /* The "f", stroked rather than filled — stem, shoulder and crossbar. */
  Facebook: (
    <>
      <path d="M15.6 3.8h-1.9a3.4 3.4 0 0 0-3.4 3.4v13" />
      <path d="M7.6 11.2h6.7" />
    </>
  ),
  /* "in": the dotted stem and the shoulder of the n. */
  LinkedIn: (
    <>
      <path d="M6 10.2v9.4" />
      <path d="M6 5.6h.01" strokeWidth="2.4" />
      <path d="M11.4 19.6v-9.4" />
      <path d="M11.4 14.6a3.5 3.5 0 0 1 7 0v5" />
    </>
  ),
  /* The tube and its play triangle. */
  YouTube: (
    <>
      <rect x="2.4" y="5.4" width="19.2" height="13.2" rx="4" />
      <path d="M10.2 9.3l5.3 2.7-5.3 2.7Z" />
    </>
  ),
}
