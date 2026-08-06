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
}: {
  items: { q: string; a: string }[]
  idPrefix: string
}) {
  return (
    <div className="accordion">
      {items.map((item, i) => (
        <details key={item.q} id={`${idPrefix}-${i}`}>
          <summary>
            <span className="font-[family-name:var(--font-display)] text-[clamp(1.125rem,2vw,1.5rem)] font-bold tracking-tight">
              {item.q}
            </span>
          </summary>
{/* 58ch, not 68ch. The CSS `ch` unit is the width of the "0" glyph, which in
            Space Grotesk is 10.25px against an average character of 7.91px — so a
            68ch column actually renders ~88 characters per line, well past the 65–75
            the eye tracks comfortably. 58ch measures ~75. */}
          <p className="muted max-w-[58ch] pb-6 leading-relaxed">{item.a}</p>
        </details>
      ))}
    </div>
  )
}
