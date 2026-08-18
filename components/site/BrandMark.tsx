/**
 * The Kairos mark, drawn — a ray ring, a halo and the six-point star.
 *
 * Decorative only: `aria-hidden`, no title, never the accessible logo. The real
 * wordmark is an <Image> beside it; this is the mark used as ornament, at watermark
 * strength, where a band needs the brand's own shape in its background rather than a
 * texture that means nothing.
 *
 * Everything inherits `currentColor`, so a caller sets one colour and the whole mark
 * follows — which is what lets it sit on the red band in white without a second copy.
 *
 * The `viewBox` runs -50..50 so every part is authored around the origin, the same
 * coordinate space the hero's porthole uses.
 */

/** Teeth in the ring. Matches the density of the printed mark. */
const RAYS = 44

export default function BrandMark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="-50 -50 100 100" aria-hidden="true" focusable="false">
      <g className="brand-spin">
        {Array.from({ length: RAYS }, (_, i) => (
          <polygon
            key={i}
            points="41,0 47.5,1.6 47.5,-1.6"
            fill="currentColor"
            transform={`rotate(${(i / RAYS) * 360})`}
          />
        ))}
        <circle r="39" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </g>

      {/* Two overlapping equilateral triangles — the six-point star at the centre of
          the mark. Counter-rotating, so the two halves of the logo read as one object
          turning rather than as a single sheet spinning. */}
      <g className="brand-spin brand-spin--reverse">
        <polygon points="0,-26 22.5,13 -22.5,13" fill="none" stroke="currentColor" strokeWidth="1" />
        <polygon points="0,26 22.5,-13 -22.5,-13" fill="none" stroke="currentColor" strokeWidth="1" />
      </g>
    </svg>
  )
}
