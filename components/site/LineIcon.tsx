/**
 * The site's line icons.
 *
 * Every icon on the site is authored the same way and this holds that contract in one
 * place: a 24-unit box, a 1.4 stroke, round caps and joins, `currentColor` so a hover
 * or an accent recolours it from CSS, and `aria-hidden` because in every case the icon
 * sits beside a label that already says the same thing.
 *
 * No icon library. A general-purpose set arrives in someone else's drawing style, and
 * the point of these is that they are built from the shapes the Kairos mark is built
 * from — circles, triangles, straight rules — so they read as a family with the logo
 * rather than as pictograms parked next to it.
 *
 * Callers pass the paths as children and control size with `className`; nothing here
 * sets a size, because the craft rows, the brand cards and the stage panels each want
 * a different one.
 */
export default function LineIcon({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode
  className?: string
  /** Usually just a `color`, which the strokes pick up through `currentColor`. */
  style?: React.CSSProperties
}) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}
