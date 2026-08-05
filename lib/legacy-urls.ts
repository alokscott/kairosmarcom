/**
 * Legacy URL resolution.
 *
 * Dependency-free so it can be tested without a request or a bundler; the slug set
 * is passed in rather than imported for the same reason.
 */

const STATIC_PAGES: Record<string, string> = {
  '/index.html': '/',
  '/index.php': '/',
  '/about.html': '/about',
  '/services.html': '/services',
  '/contact.html': '/contact',
}

/**
 * Returns the clean path a request should land on, or null to pass through.
 *
 * Always resolves in one step: never returns a path that would itself redirect.
 */
export function resolveLegacy(pathname: string, slugParam: string | null, slugs: ReadonlySet<string>): string | null {
  // The 2025 rebuild lived under /new/.
  let path = pathname
  if (path === '/new' || path === '/new/') return '/'
  if (path.startsWith('/new/')) path = path.slice(4)

  const lower = path.toLowerCase().replace(/\/+$/, '') || '/'

  if (lower === '/case.php' || lower === '/case') {
    return slugParam && slugs.has(slugParam) ? `/work/${slugParam}` : '/work'
  }

  if (STATIC_PAGES[lower]) return STATIC_PAGES[lower]

  // Path that only needed the /new/ prefix removed — normalise its slash too.
  if (path !== pathname) return lower

  // Collapse a trailing slash so it never costs a second hop.
  if (path.length > 1 && path.endsWith('/')) return path.replace(/\/+$/, '')

  return null
}
