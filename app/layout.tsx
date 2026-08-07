import type { Metadata, Viewport } from 'next'
import { Archivo, Instrument_Serif, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import { MotionPreferenceProbe } from '@/components/motion/Reveal'
import SmoothScroll from '@/components/motion/SmoothScroll'
import SceneMount from '@/components/three/SceneMount'
import { site } from '@/content/site'
import { graph, organizationLd, OG_FALLBACK } from '@/lib/seo'

/**
 * Archivo carries a width axis as well as weight, which is what makes the display
 * type able to compress and expand without a second font file.
 */
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Kairos Marcom | Branding, Creative & Campaigns That Make People Act',
    template: '%s | Kairos Marcom',
  },
  description: site.description,
  applicationName: site.name,
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'en_IN',
    url: site.url,
    images: [{ url: OG_FALLBACK, width: 1200, height: 630, alt: 'Kairos Marcom — full-service branding and communications' }],
  },
  twitter: { card: 'summary_large_image' },
  /*
   * iOS does not read the web app manifest. Everything Android takes from
   * `app/manifest.ts` has to be restated here in Apple's own meta tags, or an
   * added-to-home-screen launch opens in a plain Safari window with a screenshot of
   * the page as its icon.
   */
  appleWebApp: {
    capable: true,
    title: site.name,
    /*
     * `default` — an opaque status bar in the page's own colour, which is the
     * behaviour `themeColor` describes. `black-translucent` would put the page under
     * the clock; the safe-area padding added in globals.css handles that case, but
     * only a design that wants content up there should ask for it.
     */
    statusBarStyle: 'default',
  },
  /*
   * No `icons` key. `app/icon.png` and `app/apple-icon.png` are file-convention
   * metadata, which Next emits the <link> tags for automatically — and declaring
   * `icons` here would override both with a hand-written list that has to be kept in
   * step with the files by hand. The manifest's larger icons are declared where they
   * belong, in app/manifest.ts.
   */
}

/**
 * Light is the default theme, so this is the bone background. It is not keyed to
 * `prefers-color-scheme` any more: the OS no longer decides anything here, and a
 * media-keyed value reported the wrong browser chrome to anyone who had chosen the
 * theme the site does not follow. ThemeToggle rewrites this at runtime on switch.
 */
export const viewport: Viewport = {
  themeColor: '#F4F1E9',
  width: 'device-width',
  initialScale: 1,
  /*
   * Paint into the notch and under the home indicator instead of letting the browser
   * letterbox the page between them — the edge-to-edge look an installed app has. The
   * `--safe-*` tokens in globals.css are the other half of this: `cover` hands the
   * unsafe areas to the author, and every fixed or full-bleed surface on the site pads
   * itself off them.
   */
  viewportFit: 'cover',
  /*
   * `maximumScale` and `userScalable` are deliberately not set. Locking zoom is the
   * usual shortcut to stopping iOS's zoom-on-focus behaviour, and it works by removing
   * pinch-to-zoom from everyone who needs it. The real cause is a sub-16px field, and
   * that is fixed at source in globals.css instead.
   */
}

/**
 * Applies the stored theme before first paint. Inline and synchronous by necessity —
 * anything deferred produces a flash of the wrong theme.
 *
 * Writes the attribute unconditionally so that `data-theme` is always present and
 * always one of two values. Anything other than a stored 'dark' resolves to light,
 * including a first visit, a cleared store, and localStorage throwing in private mode.
 */
const themeScript = `(function(){var t='light';try{if(localStorage.getItem('kairos-theme')==='dark')t='dark'}catch(e){}document.documentElement.setAttribute('data-theme',t)})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      className={`${archivo.variable} ${spaceGrotesk.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: graph(organizationLd()) }} />
      </head>
      <body className="grain">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <SceneMount />
        <SmoothScroll />
        <MotionPreferenceProbe />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
