'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useCallback, useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import CanvasBoundary from './CanvasBoundary'
import { Camera, Preset } from './presets'
import { canCreateWebGL, createGovernor, detectTier, prefersReducedMotion, settingsFor, type Tier } from './quality'
import { ACCENT_HEX, sceneMotion, setScene, useSceneStore } from './store'

/**
 * The far scene — one canvas for the whole site.
 *
 * A single WebGL context is created once and persists across routes; scenes change
 * by swapping the preset inside it, not by rebuilding a context per section
 * (brief §17). The canvas is decorative: aria-hidden, no text, no pointer events.
 *
 * Failure is handled in two layers, because one is not enough. `canCreateWebGL()`
 * is the fast path: R3F builds its renderer asynchronously, so a failure there
 * surfaces as an unhandled promise rejection that no React error boundary can
 * catch — checking first is what stops that from ever happening. `CanvasBoundary`
 * then covers what a check cannot predict: a context that dies after a successful
 * start. Either route lands on the same static poster.
 */
export default function SceneRoot() {
  const { preset, accent, intensity, focus, active } = useSceneStore()
  const [tier, setTier] = useState<Tier | null>(null)
  const [failed, setFailed] = useState(false)

  const onFailure = useCallback(() => {
    setFailed(true)
    setScene({ active: false })
    // Aggregate-only signal; no device data is collected.
    window.dispatchEvent(new CustomEvent('kairos:webgl-unavailable'))
  }, [])

  /* ---- defer until the page is interactive ---- */
  useEffect(() => {
    const start = () => {
      if (!canCreateWebGL()) {
        onFailure()
        return
      }
      setTier(detectTier())
    }
    // Text and CTAs render and hydrate first; WebGL waits for idle time.
    const idle = window.requestIdleCallback?.(start, { timeout: 1200 }) ?? window.setTimeout(start, 400)
    return () => {
      window.cancelIdleCallback?.(idle as number)
      window.clearTimeout(idle as number)
    }
  }, [onFailure])

  /* ---- pause in background tabs ---- */
  useEffect(() => {
    const onVisibility = () => setScene({ active: document.visibilityState === 'visible' })
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  /* ---- pointer parallax, fine pointers only ---- */
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      sceneMotion.pointerX = (e.clientX / window.innerWidth) * 2 - 1
      sceneMotion.pointerY = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  /* ---- device orientation, where no permission prompt is required ---- */
  useEffect(() => {
    if (typeof DeviceOrientationEvent === 'undefined') return
    if ('requestPermission' in DeviceOrientationEvent) return
    const onTilt = (e: DeviceOrientationEvent) => {
      sceneMotion.tiltX = THREE.MathUtils.clamp((e.gamma ?? 0) / 45, -1, 1)
      sceneMotion.tiltY = THREE.MathUtils.clamp(((e.beta ?? 0) - 45) / 45, -1, 1)
    }
    window.addEventListener('deviceorientation', onTilt, { passive: true })
    return () => window.removeEventListener('deviceorientation', onTilt)
  }, [])

  const reduced = useMemo(() => (typeof window === 'undefined' ? false : prefersReducedMotion()), [])
  const quality = useMemo(() => settingsFor(tier ?? 'low'), [tier])
  const color = ACCENT_HEX[accent]
  const effectiveIntensity = reduced ? 0 : intensity

  /**
   * Static fallback: a soft accent bloom in the section's colour. Shown before the
   * canvas mounts, behind it once it does, and on its own if WebGL never works — so
   * the composition never collapses to a flat rectangle.
   */
  const poster = (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 transition-[background] duration-700"
      style={{
        background: `radial-gradient(58% 52% at 50% 44%, color-mix(in srgb, ${color} 26%, transparent) 0%, transparent 70%), var(--bg)`,
      }}
    />
  )

  if (failed || !tier) return poster

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      {poster}
      <CanvasBoundary fallback={null} onError={onFailure}>
        <Canvas
          frameloop={active ? 'always' : 'never'}
          dpr={[1, quality.maxDpr]}
          gl={{ antialias: quality.tier !== 'low', alpha: true, powerPreference: 'high-performance' }}
          camera={{ position: [0, 0, 9.6], fov: 42 }}
          style={{ position: 'absolute', inset: 0 }}
          onCreated={({ gl }) => {
            // A context can be lost after a successful start — a GPU reset, a laptop
            // switching graphics, or the tab being backgrounded too long.
            gl.domElement.addEventListener('webglcontextlost', onFailure, { once: true })
            // WebGL1 cannot sustain the high tier regardless of what the CPU signals said.
            if (!gl.capabilities.isWebGL2 && tier === 'high') setTier('medium')
          }}
        >
          <Governor tier={quality.tier} onDemote={setTier} />
          <Camera intensity={effectiveIntensity} />
          <ambientLight intensity={0.45} />
          <directionalLight position={[4, 6, 5]} intensity={quality.richLighting ? 1.3 : 0.8} color="#ffffff" />
          {quality.richLighting && <directionalLight position={[-5, -2, -4]} intensity={0.6} color={color} />}
          <Preset preset={preset} color={color} quality={quality} intensity={effectiveIntensity} focus={focus} />
        </Canvas>
      </CanvasBoundary>
    </div>
  )
}

/**
 * Frame-rate governor. Demotes the quality tier once if the measured rate does not
 * hold. It never promotes: a scene that oscillates between tiers reads worse than
 * one that settles at the lower setting.
 */
function Governor({ tier, onDemote }: { tier: Tier; onDemote: (t: Tier) => void }) {
  const sample = useMemo(
    () =>
      createGovernor(() => {
        if (tier === 'high') onDemote('medium')
        else if (tier === 'medium') onDemote('low')
      }),
    [tier, onDemote]
  )
  useFrame((_, delta) => sample(delta))
  return null
}
