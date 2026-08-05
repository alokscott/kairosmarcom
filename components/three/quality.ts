'use client'

/**
 * Device capability tiering and the frame-rate governor.
 *
 * Tier is decided by capability, not screen width (brief §17): a 13" laptop on
 * integrated graphics and a 6.7" flagship are not the same machine, and neither
 * is described by a media query.
 */

export type Tier = 'low' | 'medium' | 'high'

export interface QualitySettings {
  tier: Tier
  /** Upper bound passed to <Canvas dpr={[1, maxDpr]}>. */
  maxDpr: number
  /** Instance count for the shard field. */
  shards: number
  /** Segment count for the core icosahedron. */
  coreDetail: number
  /** Real refraction is expensive — high tier only. */
  transmission: boolean
  /** Soft shadows / extra lights. */
  richLighting: boolean
}

const TIERS: Record<Tier, QualitySettings> = {
  low: { tier: 'low', maxDpr: 1, shards: 90, coreDetail: 1, transmission: false, richLighting: false },
  medium: { tier: 'medium', maxDpr: 1.5, shards: 220, coreDetail: 2, transmission: false, richLighting: true },
  high: { tier: 'high', maxDpr: 2, shards: 420, coreDetail: 4, transmission: true, richLighting: true },
}

export const settingsFor = (tier: Tier) => TIERS[tier]

/**
 * One-shot support check, cached for the session.
 *
 * Deliberately does NOT call `loseContext()`. An earlier version did, to be tidy
 * about the context budget, and that turned out to make the *next* context creation
 * fail — so the probe reported "supported" and the real canvas then threw. The
 * throwaway canvas is simply dropped here and collected normally.
 *
 * This is a fast path, not the guarantee: R3F creates its renderer asynchronously,
 * so a failure there surfaces as an unhandled rejection that no React error boundary
 * can catch. Checking first is what keeps that from ever being reached; the boundary
 * still backs it up for contexts that die after a successful start.
 */
let webglSupport: boolean | null = null

export function canCreateWebGL(): boolean {
  if (webglSupport !== null) return webglSupport
  if (typeof document === 'undefined') return false
  try {
    const probe = document.createElement('canvas')
    webglSupport = Boolean(probe.getContext('webgl2') ?? probe.getContext('webgl'))
  } catch {
    webglSupport = false
  }
  return webglSupport
}

/**
 * Initial tier guess from device signals alone.
 *
 * This deliberately does NOT create a probe context. Creating one and calling
 * `loseContext()` on it can make the next creation fail, which is how a probe that
 * reported "supported" ended up followed by a canvas that threw. Whether WebGL
 * actually works is answered by trying it — see CanvasBoundary — and whether it is
 * WebGL2 is read off the real renderer in `onCreated`.
 *
 * The governor demotes from here if the measured frame rate does not hold. It never
 * promotes: a scene that oscillates between tiers is worse than one that settles low.
 */
export function detectTier(): Tier {
  if (typeof navigator === 'undefined') return 'low'

  const cores = navigator.hardwareConcurrency ?? 2
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData

  if (saveData) return 'low'
  if (cores <= 4 || memory <= 2) return 'low'
  // Touch devices get one tier down: sustained load matters more than peak there.
  if (coarse) return cores >= 8 && memory >= 6 ? 'medium' : 'low'
  return cores >= 8 && memory >= 8 ? 'high' : 'medium'
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Rolling frame-rate governor. Feed it a delta each frame; it reports whether the
 * scene should drop a tier. Demotion needs a sustained shortfall, not one slow
 * frame, so a single GC pause does not wreck the whole scene.
 */
export function createGovernor(onDemote: () => void, targetFps = 45, windowSize = 90) {
  let samples = 0
  let total = 0
  let demoted = false

  return function sample(delta: number) {
    if (demoted || delta <= 0) return
    total += delta
    samples += 1
    if (samples < windowSize) return

    const fps = samples / total
    if (fps < targetFps) {
      demoted = true
      onDemote()
    }
    samples = 0
    total = 0
  }
}

/** Deterministic PRNG. Scene layouts must be identical run to run and across renders. */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
