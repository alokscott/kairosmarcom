import { site } from '@/content/site'

/**
 * The company tagline, set as four beats rather than one sentence.
 *
 * "Truthful. Mindful. Thoughtful. Ideas plentiful." is written as four stopped
 * phrases, and that punctuation is the whole idea — it is a rhythm, not a clause. Run
 * as plain text it reads as a caption; the site had it three times, twice at 12px in
 * an `.eyebrow` and once as small print under the hero CTAs.
 *
 * Two things carry the rhythm here. The full stops take the brand red permanently, so
 * the four beats are visible before a word is read. And each phrase takes the accent
 * in turn on a slow loop, which is the line saying itself.
 *
 * The animation is COLOUR ONLY. Nothing moves, nothing resizes, so there is no reflow
 * and no layout cost — and a line of type that jumped or slid would be a distraction
 * sitting directly under the hero's call to action rather than a signature under it.
 *
 * Split from `site.tagline` rather than stored pre-split, so the string stays one
 * source of truth in content/site.ts. The rendered text content is identical to the
 * original — stops and spaces included — so a screen reader and a page search still
 * see the sentence exactly as written.
 */
export default function Tagline({ className = '' }: { className?: string }) {
  const beats = site.tagline
    .split('.')
    .map((beat) => beat.trim())
    .filter(Boolean)

  return (
    /* `borderColor` here rather than at every call site: the hero asks for a rule above
       the line, and a caller passing `border-t` should not also have to remember which
       token draws it. */
    <p className={`tagline ${className}`} style={{ borderColor: 'var(--rule)' }}>
      {beats.map((beat, i) => (
        /*
         * The delay goes through a custom property, not `animation-delay` directly.
         * Each beat runs TWO animations in step — the colour on the span and the rule
         * on its `::after` — and a pseudo-element cannot read an inline style. One
         * variable set here is what keeps the two from drifting apart.
         */
        <span
          key={beat}
          className="tagline__beat"
          style={{ ['--beat-delay' as string]: `${i * 1.4}s` }}
        >
          {beat}
          <span className="tagline__stop">.</span>
          {/* A real space, so the text content matches the source string. `gap` on a
              flex container would look the same and would not survive being copied. */}
          {i < beats.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}
