import { NextResponse, type NextRequest } from 'next/server'
import { cases } from '@/content/cases'
import { resolveLegacy } from '@/lib/legacy-urls'

/**
 * Legacy URL handling.
 *
 * This lives in the proxy layer rather than next.config's `redirects()` for two
 * reasons the config form cannot solve:
 *
 *  1. `redirects()` forwards the original query string to the destination, so
 *     /new/case.php?s=dji-india landed on /work/dji-india?s=dji-india — a second
 *     crawlable URL for the same page.
 *  2. Next's own trailing-slash normalisation runs before config redirects, so
 *     /new/ became /new and then / — a two-hop chain on what is currently the most
 *     linked URL on the live site.
 *
 * Everything here resolves in a single 308 to a clean address. The logic itself is
 * in lib/legacy-urls.ts so it can be tested directly.
 */

const SLUGS = new Set(cases.map((c) => c.slug))

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const target = resolveLegacy(pathname, searchParams.get('s'), SLUGS)
  if (!target) return NextResponse.next()

  // Built from the origin, deliberately dropping the legacy query string.
  return NextResponse.redirect(new URL(target, request.nextUrl.origin), 308)
}

export const config = {
  matcher: [
    /*
     * Everything except Next internals, the API and files with an extension —
     * except .php and .html, which are exactly the legacy shapes we redirect.
     */
    '/((?!_next/static|_next/image|api/|.*\\.(?:png|jpg|jpeg|gif|svg|webp|avif|ico|txt|xml|webmanifest|woff2?)$).*)',
  ],
}
