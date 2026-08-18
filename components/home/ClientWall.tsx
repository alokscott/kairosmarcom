import Image from 'next/image'
import { clients, clientsIntro } from '@/content/site'

/**
 * Client wall.
 *
 * The copy deck asks for logos rather than type. Each entry renders its mark where a
 * file exists in `public/logos` and falls back to a wordmark where it does not, so the
 * strip is accurate today and takes the remaining marks unchanged once written
 * permission for each is on file — no placeholder art, no fabricated logos.
 *
 * The marquee is duplicated for seamless looping; the copy is aria-hidden so the
 * list is announced once. It pauses on hover and is removed under reduced motion.
 */
export default function ClientWall() {
  return (
    <section
      className="relative overflow-hidden border-y py-10"
      /*
       * Paints its own near-opaque surface. Everything either side of this band is
       * `in-scene`, so the fixed canvas was running the particle field straight across
       * the client marks — the one band on the page whose whole job is to be read
       * quickly and trusted. The 6% left over plus the blur keeps the backdrop's colour
       * shifting underneath without any mote ever resolving on top of a logo.
       */
      style={{
        borderColor: 'var(--rule)',
        background: 'color-mix(in srgb, var(--bg) 94%, transparent)',
        backdropFilter: 'blur(12px)',
      }}
      data-accent="silver"
    >
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
                <li key={client.name} className="flex shrink-0 items-center">
                  {client.logo ? (
                    /*
                     * Height-constrained rather than width-constrained: these marks have
                     * very different aspect ratios, and matching their optical weight
                     * means matching cap height, not bounding-box width.
                     */
                    <Image
                      src={client.logo}
                      alt={client.name}
                      width={160}
                      height={44}
                      className="client-mark h-[clamp(1.75rem,3vw,2.5rem)] w-auto object-contain"
                      unoptimized
                    />
                  ) : (
                    <span
                      className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,3.5vw,2.75rem)] font-bold tracking-tight whitespace-nowrap"
                      style={{ color: 'var(--fg-faint)' }}
                    >
                      {client.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
