import { clients, clientsIntro } from '@/content/site'

/**
 * Client wall.
 *
 * Set in type, not logos. Only five client marks exist as files in the migrated
 * assets and none of them carries written permission to republish, so shipping a
 * logo wall would mean shipping either fabricated or unapproved assets. Type is
 * accurate today and the layout takes logos unchanged once permissions land.
 *
 * The marquee is duplicated for seamless looping; the copy is aria-hidden so the
 * list is announced once. It pauses on hover and is removed under reduced motion.
 */
export default function ClientWall() {
  return (
    <section className="relative overflow-hidden border-y py-10" style={{ borderColor: 'var(--rule)' }} data-accent="silver">
      <h2 className="shell mb-8 text-xs font-medium tracking-[0.18em] uppercase" style={{ color: 'var(--fg-faint)' }}>
        {clientsIntro}
      </h2>

      <div className="relative">
        <div className="marquee">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 ? 'true' : undefined}
              className="m-0 flex list-none items-center gap-[clamp(2rem,6vw,5rem)] px-[clamp(1rem,3vw,2.5rem)] p-0"
            >
              {clients.map((client) => (
                <li
                  key={client}
                  className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,3.5vw,2.75rem)] font-bold tracking-tight whitespace-nowrap"
                  style={{ color: 'var(--fg-faint)' }}
                >
                  {client}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
