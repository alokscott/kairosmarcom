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
          <p className="muted max-w-[68ch] pb-6 leading-relaxed">{item.a}</p>
        </details>
      ))}
    </div>
  )
}
