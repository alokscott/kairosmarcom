'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { nav, site } from '@/content/site'
import { track } from '@/lib/analytics'
import { Magnetic } from '@/components/motion/Reveal'
import ThemeToggle from './ThemeToggle'

/**
 * Sticky header.
 *
 * The mobile menu is a native <dialog>, which brings the focus trap, Esc-to-close,
 * inert background and backdrop with it. Navigation labels are ordinary anchors in
 * every state — the brief allows a 3D navigation object, but never in place of
 * real links.
 */
export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the menu when the route changes, so back/forward never leaves it open.
  useEffect(() => {
    dialogRef.current?.close()
  }, [pathname])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  const openMenu = () => {
    dialogRef.current?.showModal()
    track('nav_menu_open')
  }

  return (
    <header
      className="no-print nav-sheen fixed inset-x-0 top-0 z-50"
      // Surface lives in CSS keyed off this attribute, not in an inline style: inline
      // styles cannot be overridden by a media query, and phones need the bar opaque
      // at every scroll position.
      data-scrolled={scrolled}
    >
      <div
        className="shell-wide flex items-center justify-between gap-6"
        style={{
          paddingBlock: scrolled ? '0.7rem' : '1.15rem',
          transition: 'padding 380ms var(--ease-out-expo)',
        }}
      >
        {/* Both marks ship; CSS picks one, so the logo is correct before hydration. */}
        {/* The mark is 28px tall; the link needs a 44px target around it. */}
        <Link
          href="/"
          className="flex min-h-11 items-center no-underline"
          aria-label={`${site.name} — home`}
        >
          <Image
            src="/logo-wr.png"
            alt=""
            width={503}
            height={160}
            priority
            className="brand-mark brand-mark--dark h-7 w-auto"
          />
          <Image
            src="/logo.png"
            alt=""
            width={503}
            height={160}
            priority
            className="brand-mark brand-mark--light h-7 w-auto"
          />
          <span className="sr-only">{site.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              onClick={() => track('nav_route_select', { to: item.href })}
              className="relative px-3 py-2 text-sm no-underline"
              style={{ color: isActive(item.href) ? 'var(--fg)' : 'var(--fg-muted)' }}
            >
              {item.label}
              {isActive(item.href) && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 bottom-1 h-px"
                  style={{ background: 'var(--accent)' }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/*
            The responsive visibility lives on this wrapper, NOT on Magnetic.
            Magnetic prepends its own `inline-block`, and `hidden` is the same display
            utility at the same specificity — so which one wins is decided by Tailwind's
            stylesheet order, and `inline-block` did. The CTA stayed visible on phones,
            wrapped to three lines, and `border-radius: 999px` turned it into a circle
            that covered the logo and pushed the header down over the hero headline.
          */}
          <span className="hidden sm:block">
            <Magnetic>
              <Link
                href="/contact"
                className="btn btn--primary whitespace-nowrap"
                onClick={() => track('nav_route_select', { to: '/contact', source: 'header-cta' })}
              >
                Book a clarity call
              </Link>
            </Magnetic>
          </span>
          <button
            type="button"
            onClick={openMenu}
            className="btn btn--ghost lg:hidden"
            aria-haspopup="dialog"
          >
            Menu
          </button>
        </div>
      </div>

      <dialog ref={dialogRef} aria-label="Site menu" className="m-0 h-dvh max-h-none w-screen max-w-none">
        <div className="flex h-dvh flex-col justify-between p-6" style={{ background: 'var(--bg)' }}>
          <div className="flex items-center justify-between">
            <Image src="/logo-wr.png" alt="" width={503} height={160} className="brand-mark brand-mark--dark h-6 w-auto" />
            <Image src="/logo.png" alt="" width={503} height={160} className="brand-mark brand-mark--light h-6 w-auto" />
            <button type="button" className="btn btn--ghost" onClick={() => dialogRef.current?.close()} autoFocus>
              Close
            </button>
          </div>

          <nav aria-label="Site" className="py-8">
            <ul className="m-0 list-none space-y-1 p-0">
              {nav.map((item, i) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => track('nav_route_select', { to: item.href, source: 'mobile-menu' })}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className="block py-2 font-[family-name:var(--font-display)] text-[clamp(2.25rem,11vw,3.5rem)] font-extrabold leading-[0.95] tracking-tight no-underline"
                    style={{ color: isActive(item.href) ? 'var(--accent-text)' : 'var(--fg)' }}
                  >
                    <span className="mr-3 align-super text-xs font-medium" style={{ color: 'var(--fg-faint)' }}>
                      0{i + 1}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-3 text-sm">
            <Link href="/contact" className="btn btn--primary w-full justify-center">
              Book a clarity call
            </Link>
            <p className="muted">
              <a href={`mailto:${site.email}`} className="link-underline">
                {site.email}
              </a>
              {' · '}
              <a href={site.phoneHref} className="link-underline">
                {site.phone}
              </a>
            </p>
          </div>
        </div>
      </dialog>
    </header>
  )
}
