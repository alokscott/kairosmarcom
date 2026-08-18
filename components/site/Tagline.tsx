import { site } from '@/content/site'

/**
 * The company tagline, set as a lockup rather than a sentence.
 *
 * "Truthful. Mindful. Thoughtful. Ideas plentiful." is four stopped phrases, and the
 * punctuation is the whole idea — it is a rhythm, not a clause. It ran three times on
 * the site as plain small caps, which read as a caption.
 *
 * The lockup gives the four beats a shape: a short accent rule opens the line, the
 * first three sit light with hairline dividers between them, and the last is set large
 * and heavy so the line lands on the phrase that matters. One typeface, three weights,
 * no second colour beyond the rule and the stops.
 *
 * ─── The typewriter ───
 *
 * It is a CSS width animation on a wrapper with `overflow: hidden`, NOT characters
 * appended by script. The complete text is in the DOM from the first paint, so a
 * screen reader announces the whole tagline at once, a page search matches it, and it
 * is fully present with JavaScript off — the animation only decides how much of it is
 * painted. Typing it character by character would trade all of that for the same
 * picture.
 *
 * It runs once, on load, and stops. A looping typewriter in a footer is a thing that
 * moves forever in the corner of the eye.
 */
export default function Tagline({ className = '' }: { className?: string }) {
  const beats = site.tagline
    .split('.')
    .map((beat) => beat.trim())
    .filter(Boolean)

  const lead = beats.slice(0, -1)
  const last = beats[beats.length - 1]

  return (
    <p className={`tagline ${className}`} style={{ borderColor: 'var(--rule)' }}>
      <span className="tagline__type">
        <span aria-hidden="true" className="tagline__rule" />

        {lead.map((beat) => (
          <span key={beat} className="tagline__beat">
            {beat}
            {/* The stop stays in the text so the sentence is intact when read or
                copied; the divider beside it is the drawn version of the same pause. */}
            <span className="tagline__stop">.</span>
            <span aria-hidden="true" className="tagline__divider" />
          </span>
        ))}

        <span className="tagline__last">
          {last}
          <span className="tagline__stop">.</span>
        </span>
      </span>
    </p>
  )
}
