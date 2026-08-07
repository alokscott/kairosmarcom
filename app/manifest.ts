import type { MetadataRoute } from 'next'
import { nav, site } from '@/content/site'

/**
 * Web app manifest.
 *
 * This is what lets the site be added to a home screen and opened without browser
 * chrome — the last piece of "feels like an app" that markup and CSS cannot supply on
 * their own, because the decision belongs to the OS rather than to the page.
 *
 * `display: 'standalone'` rather than `'fullscreen'`: the status bar and the home
 * indicator stay, which is what visitors expect from an installed site, and the safe
 * areas in globals.css are sized on the assumption that they are there.
 *
 * `background_color` is the bone page colour and NOT keyed to the stored theme. The
 * OS reads this value once at install time to paint the splash screen, long before any
 * script of ours has run, so a dark value here would flash ink for anyone on the light
 * default — which is everyone on a first launch.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.positioning}`,
    short_name: site.name,
    description: site.description,
    start_url: '/',
    /* Links to other origins open in the browser; anything on this site stays in the
       installed window. Without it, every outbound social link hijacks the app. */
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#F4F1E9',
    theme_color: '#F4F1E9',
    lang: 'en-IN',
    dir: 'ltr',
    categories: ['business', 'design', 'marketing'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      /*
       * A separate file, not the same one relabelled. Android crops a maskable icon to
       * whatever shape the launcher uses and only the middle 80% is guaranteed to
       * survive, so this one is drawn with the mark at a smaller scale on the same
       * bone field. Reusing the `any` icon here clips the sunburst on a circle mask.
       */
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    /* Long-press the installed icon to jump straight into a section. */
    shortcuts: nav
      .filter((item) => item.href === '/work' || item.href === '/services' || item.href === '/contact')
      .map((item) => ({ name: item.label, url: item.href })),
  }
}
