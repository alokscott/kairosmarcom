'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import CanvasBoundary from './CanvasBoundary'
import { canCreateWebGL, mulberry32, prefersReducedMotion } from './quality'
import { ACCENT_HEX, sceneMotion, useSceneStore, type Theme } from './store'

/**
 * The foreground depth layer.
 *
 * This is what makes the site read as three-dimensional rather than as a page with
 * a 3D picture behind it: a second, deliberately cheap layer of particles that
 * renders IN FRONT of the type, so headlines sit inside the scene with material
 * both behind and ahead of them.
 *
 * It is a separate context on purpose. Interleaving depth around DOM text is
 * impossible within one canvas — z-order between WebGL and HTML is decided by the
 * document, not the depth buffer.
 *
 * Kept intentionally minimal so the second context is close to free: one points
 * geometry, one additive material, no lights, no shadows, no raycasting.
 */
export default function Foreground() {
  const { accent, active, theme } = useSceneStore()
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Never on reduced motion — drifting motion over text is the exact thing that
    // preference exists to remove.
    if (prefersReducedMotion()) return
    // Skip on coarse pointers: it costs a second context for parallax that needs
    // a cursor to be legible, and mid-range phones need the headroom elsewhere.
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (!canCreateWebGL()) return
    const id = window.requestIdleCallback?.(() => setEnabled(true), { timeout: 2500 }) ?? window.setTimeout(() => setEnabled(true), 1400)
    return () => {
      window.cancelIdleCallback?.(id as number)
      window.clearTimeout(id as number)
    }
  }, [])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30">
      {/* If the near layer cannot get a context, the page simply loses the near
          layer — the far scene and all content are unaffected. */}
      <CanvasBoundary fallback={null}>
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 0, 5], fov: 55 }}
        /*
         * Required, not belt-and-braces. This layer sits at z-30, ABOVE every link,
         * button and input on the page, and react-three-fiber gives its own
         * container `pointer-events: auto` inline — which beats the
         * `pointer-events-none` class on the wrapper above. Without this the decorative
         * mote canvas silently swallows every click on the document beneath it.
         */
        style={{ pointerEvents: 'none' }}
      >
        <Motes color={ACCENT_HEX[accent]} theme={theme} />
      </Canvas>
      </CanvasBoundary>
    </div>
  )
}

/**
 * Near-field motes. Large, soft and few — this layer is depth cueing, not confetti.
 * Opacity stays low enough that nothing behind it drops below AA contrast.
 *
 * Theme changes the compositing outright rather than just the colour. Additive
 * blending adds light to what is behind it, so on bone it adds to a surface that is
 * already near-white and the whole layer disappears. On light the motes switch to
 * normal blending and darken toward ink, which is the only way a mote reads as a
 * mark on a pale background. Lime is the proof case: #C8FF3D sits at 1.03:1 on bone,
 * so an un-darkened accent would be invisible no matter which blend mode was used.
 */
function Motes({ color, theme, count = 70 }: { color: string; theme: Theme; count?: number }) {
  const points = useRef<THREE.Points>(null)
  const material = useRef<THREE.PointsMaterial>(null)
  const dark = theme === 'dark'

  const tint = useMemo(() => {
    const c = new THREE.Color(color)
    if (!dark) c.lerp(new THREE.Color('#080808'), 0.45)
    return c
  }, [color, dark])

  const { positions, drift } = useMemo(() => {
    const rand = mulberry32(97)
    const positions = new Float32Array(count * 3)
    const drift = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 14
      positions[i * 3 + 1] = (rand() - 0.5) * 10
      // Held close to the camera so parallax is pronounced against the far scene.
      positions[i * 3 + 2] = 1.5 + rand() * 2.6
      drift[i] = 0.25 + rand() * 0.9
    }
    return { positions, drift }
  }, [count])

  useFrame((state, delta) => {
    const p = points.current
    if (!p) return
    const t = state.clock.elapsedTime
    const attr = p.geometry.attributes.position as THREE.BufferAttribute
    const arr = attr.array as Float32Array

    for (let i = 0; i < count; i++) {
      // Slow vertical drift, wrapping rather than respawning.
      arr[i * 3 + 1] += delta * drift[i] * 0.18
      if (arr[i * 3 + 1] > 5) arr[i * 3 + 1] = -5
      arr[i * 3] += Math.sin(t * 0.25 + i) * delta * 0.05
    }
    attr.needsUpdate = true

    // Counter-parallax: the near layer moves opposite the far scene, which is the
    // cue the eye actually reads as depth.
    p.position.x = -sceneMotion.pointerX * 0.85
    p.position.y = sceneMotion.pointerY * 0.55
    p.position.z = sceneMotion.progress * 1.2

    if (material.current) material.current.color.copy(tint)
  })

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={material}
        color={tint}
        size={0.075}
        sizeAttenuation
        transparent
        // Normal blending lands harder than additive, so light runs quieter to hold
        // the same "barely there" weight the dark theme has.
        opacity={dark ? 0.5 : 0.34}
        depthWrite={false}
        blending={dark ? THREE.AdditiveBlending : THREE.NormalBlending}
        toneMapped={false}
      />
    </points>
  )
}
