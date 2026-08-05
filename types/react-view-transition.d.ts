/**
 * `<ViewTransition>` type shim.
 *
 * Next's App Router aliases `react` to its own bundled canary build, which exports
 * `ViewTransition` — but the `react` package on disk (19.2.8) and `@types/react` do
 * not declare it, so the compiler cannot see an export that exists at runtime.
 *
 * Verified present with:
 *   node -e "console.log(typeof require('next/dist/compiled/react').ViewTransition)"
 *
 * Delete this file once @types/react ships the declaration.
 */
import 'react'

declare module 'react' {
  /**
   * Names an element so the browser animates between its old and new position across
   * a navigation. Without View Transitions API support the app renders normally and
   * simply does not animate.
   */
  export const ViewTransition: React.FC<{
    name?: string
    children?: React.ReactNode
  }>
}
