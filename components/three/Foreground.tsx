'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import CanvasBoundary from './CanvasBoundary'
import { canCreateWebGL, mulberry32, prefersReducedMotion } from './quality'
import { ACCENT_HEX, sceneMotion, useSceneStore } from './store'

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
  const { accent, active } = useSceneStore()
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
      >
        <Motes color={ACCENT_HEX[accent]} />
      </Canvas>
      </CanvasBoundary>
    </div>
  )
}

/**
 * Near-field motes. Large, soft and few — this layer is depth cueing, not confetti.
 * Opacity stays low enough that nothing behind it drops below AA contrast.
 */
function Motes({ color, count = 70 }: { color: string; count?: number }) {
  const points = useRef<THREE.Points>(null)
  const material = useRef<THREE.PointsMaterial>(null)

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

    if (material.current) material.current.color.set(color)
  })

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={material}
        color={color}
        size={0.075}
        sizeAttenuation
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  )
}
