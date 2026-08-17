/**
 * Accordion built on native <details>/<summary>.
 *
 * Keyboard operation, the expanded/collapsed state announcement and open-by-default
 * behaviour when a visitor uses in-page find are all supplied by the element. A
 * hand-rolled ARIA disclosure would need roughly forty lines to reach parity and
 * would still lose find-in-page.
 *
 * No `name` attribute: forcing one-at-a-time closes the answer a visitor is reading
 * the moment they open the next one.
 */
export default function Accordion({
  items,
  idPrefix,
  /**
   * Numbers the rows.
   *
   * Worth it where the heading counts them — "the four things people say", a run of
   * questions — because the count is then a promise the list keeps visibly, and a
   * closed accordion of short questions has nothing else giving it structure. Off by
   * default: on a page that already numbers its sections it would be a second,
   * competing sequence.
   */
  numbered = false,
}: {
  items: { q: string; a: string }[]
  idPrefix: string
  numbered?: boolean
}) {
  return (
    <div className={`accordion ${numbered ? 'accordion--numbered' : ''}`}>
      {items.map((item, i) => (
        <details key={item.q} id={`${idPrefix}-${i}`}>
          <summary>
            {numbered && (
              /* Presentational: the number is a visual index, and reading "zero one"
                 before every question adds nothing a screen reader user needs. */
              <span className="accordion__index mono-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
            )}
            <span className="accordion__q">{item.q}</span>
          </summary>
          {/* 58ch, not 68ch. The CSS `ch` unit is the width of the "0" glyph, which in
              Space Grotesk is 10.25px against an average character of 7.91px — so a
              68ch column actually renders ~88 characters per line, well past the 65–75
              the eye tracks comfortably. 58ch measures ~75. */}
          <p className="accordion__a muted max-w-[58ch] pb-6 leading-relaxed">{item.a}</p>
        </details>
      ))}
    </div>
  )
}
