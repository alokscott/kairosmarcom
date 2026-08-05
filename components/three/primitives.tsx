'use client'

import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { mulberry32, type QualitySettings } from './quality'
import { sceneMotion } from './store'

/**
 * The 3D vocabulary. Seven primitives compose every scene preset in the site, so
 * geometry, materials and shaders are authored once and re-parameterised rather
 * than re-authored per section (brief §17).
 *
 * Every primitive is deterministic: layouts come from a seeded PRNG, never
 * Math.random, so a scene looks identical on every visit and across re-renders.
 */

/**
 * A value that may change every frame. Pass a getter for anything driven by scroll
 * or pointer — a plain number would be captured at render time and never animate,
 * because these components deliberately do not re-render per frame.
 */
export type Dyn = number | (() => number)

const resolve = (v: Dyn) => (typeof v === 'function' ? v() : v)

/* ------------------------------------------------------------------ */
/* Shard field — scattered particles that align into a form            */
/* ------------------------------------------------------------------ */

interface ShardFieldProps {
  count: number
  /** 0 = scattered, 1 = aligned on the target form. Pass a getter if scroll drives it. */
  convergence: Dyn
  color: string
  seed?: number
  /** Radius of the converged form. */
  radius?: number
  /** How far shards fly out when scattered. */
  spread?: number
  /** 'sphere' packs onto a shell; 'lattice' snaps to an ordered grid; 'ring' to a disc. */
  form?: 'sphere' | 'lattice' | 'ring'
  size?: number
  opacity?: number
}

/**
 * The convergence lerp runs in the vertex shader via an instanced offset attribute.
 * Doing it in JS would mean recomposing several hundred matrices every frame for
 * an effect the GPU does for free.
 */
export function ShardField({
  count,
  convergence,
  color,
  seed = 1,
  radius = 2.1,
  spread = 7,
  form = 'sphere',
  size = 0.085,
  opacity = 1,
}: ShardFieldProps) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const uniforms = useRef({ uConvergence: { value: 0 } })

  const { matrices, scatter } = useMemo(() => {
    const rand = mulberry32(seed)
    const matrices = new Float32Array(count * 16)
    const scatter = new Float32Array(count * 3)
    const dummy = new THREE.Object3D()
    const side = Math.ceil(Math.cbrt(count))

    for (let i = 0; i < count; i++) {
      if (form === 'sphere') {
        // Fibonacci shell — even coverage, no polar clumping.
        const y = 1 - (i / Math.max(1, count - 1)) * 2
        const r = Math.sqrt(Math.max(0, 1 - y * y))
        const phi = i * Math.PI * (3 - Math.sqrt(5))
        dummy.position.set(Math.cos(phi) * r * radius, y * radius, Math.sin(phi) * r * radius)
      } else if (form === 'lattice') {
        const x = i % side
        const y = Math.floor(i / side) % side
        const z = Math.floor(i / (side * side))
        const step = (radius * 2) / Math.max(1, side - 1)
        dummy.position.set(-radius + x * step, -radius + y * step, -radius + z * step)
      } else {
        const a = (i / count) * Math.PI * 2 * 6
        const r = radius * (0.35 + 0.65 * (i / count))
        dummy.position.set(Math.cos(a) * r, (rand() - 0.5) * 0.5, Math.sin(a) * r)
      }

      dummy.rotation.set(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI)
      const s = size * (0.55 + rand() * 0.9)
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      dummy.matrix.toArray(matrices, i * 16)

      // Scatter offset: outward, biased away from the origin so the field opens up.
      const dir = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize()
      const dist = spread * (0.25 + rand() * 0.75)
      scatter[i * 3] = dir.x * dist
      scatter[i * 3 + 1] = dir.y * dist * 0.7
      scatter[i * 3 + 2] = dir.z * dist
    }
    return { matrices, scatter }
  }, [count, seed, radius, spread, form, size])

  useLayoutEffect(() => {
    const m = mesh.current
    if (!m) return
    m.instanceMatrix.set(matrices)
    m.instanceMatrix.needsUpdate = true
    m.geometry.setAttribute('aScatter', new THREE.InstancedBufferAttribute(scatter, 3))
    m.computeBoundingSphere()
  }, [matrices, scatter])

  useFrame((_, delta) => {
    const u = uniforms.current.uConvergence
    // Ease toward the target so scroll jitter does not read as stutter.
    u.value += (resolve(convergence) - u.value) * Math.min(1, delta * 4)
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.9}
        roughness={0.28}
        metalness={0.2}
        transparent
        opacity={opacity}
        depthWrite={false}
        onBeforeCompile={(shader) => {
          shader.uniforms.uConvergence = uniforms.current.uConvergence
          shader.vertexShader = shader.vertexShader
            .replace(
              '#include <common>',
              `#include <common>
               attribute vec3 aScatter;
               uniform float uConvergence;`
            )
            .replace(
              '#include <begin_vertex>',
              `#include <begin_vertex>
               transformed += aScatter * (1.0 - uConvergence);`
            )
          // Dispersed fragments are faint; they gain presence as they align. This is
          // the narrative and it is also what keeps the scattered state from
          // competing with the headline it sits behind.
          shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', `#include <common>\n uniform float uConvergence;`)
            .replace(
              '#include <dithering_fragment>',
              `#include <dithering_fragment>
               gl_FragColor.a *= mix(0.28, 1.0, uConvergence);`
            )
        }}
      />
    </instancedMesh>
  )
}

/* ------------------------------------------------------------------ */
/* Core — the decisive moment                                          */
/* ------------------------------------------------------------------ */

export function Core({
  color,
  quality,
  scale = 1,
  intensity = 1,
}: {
  color: string
  quality: QualitySettings
  scale?: Dyn
  intensity?: number
}) {
  const group = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const s = resolve(scale)
    g.scale.setScalar(g.scale.x + (s - g.scale.x) * Math.min(1, delta * 3))
    g.rotation.y += delta * 0.12 * intensity
    g.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08 * intensity
    // Pointer parallax — the core leans toward the cursor, it does not chase it.
    const tx = sceneMotion.pointerX * 0.18 + sceneMotion.tiltX * 0.1
    const ty = sceneMotion.pointerY * 0.12 + sceneMotion.tiltY * 0.1
    g.position.x += (tx - g.position.x) * Math.min(1, delta * 2)
    g.position.y += (-ty - g.position.y) * Math.min(1, delta * 2)
  })

  return (
    <group ref={group} scale={typeof scale === 'number' ? scale : 0.001}>
      <mesh>
        <icosahedronGeometry args={[1, quality.coreDetail]} />
        {quality.transmission ? (
          <meshPhysicalMaterial
            color={color}
            transmission={0.92}
            thickness={1.4}
            roughness={0.08}
            ior={1.6}
            metalness={0}
            emissive={color}
            emissiveIntensity={0.5}
          />
        ) : (
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.85}
            roughness={0.22}
            metalness={0.3}
          />
        )}
      </mesh>
      {/* Faceted shell: the core reads as something assembled rather than a sphere. */}
      <mesh scale={1.12}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.35} toneMapped={false} />
      </mesh>
      {/* Inner light kernel, visible through the shell. */}
      <mesh scale={0.42}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <pointLight color={color} intensity={14} distance={20} decay={2} />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Nodes + threads — connection, networks, pathways                    */
/* ------------------------------------------------------------------ */

export type NodeSpec = { position: [number, number, number]; scale?: number }

export function NodeCluster({
  nodes,
  color,
  focus = -1,
  intensity = 1,
}: {
  nodes: NodeSpec[]
  color: string
  focus?: number
  intensity?: number
}) {
  const group = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    g.rotation.y += delta * 0.07 * intensity
    g.children.forEach((child, i) => {
      const target = focus === i ? 1.7 : focus === -1 ? 1 : 0.62
      const s = child.scale.x + (target * (nodes[i]?.scale ?? 1) - child.scale.x) * Math.min(1, delta * 5)
      child.scale.setScalar(s)
      child.position.y += Math.sin(state.clock.elapsedTime * 0.6 + i) * delta * 0.06 * intensity
    })
  })

  return (
    <group ref={group}>
      {nodes.map((n, i) => (
        <mesh key={i} position={n.position} scale={n.scale ?? 1}>
          <icosahedronGeometry args={[0.16, 1]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.2} roughness={0.3} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

/** Threads joining independent nodes. `draw` reveals them 0→1. */
export function Threads({
  nodes,
  color,
  draw = 1,
  hub = true,
  opacity = 0.5,
}: {
  nodes: NodeSpec[]
  color: string
  draw?: number
  /** True: every node connects to the origin. False: nodes chain to each other. */
  hub?: boolean
  opacity?: number
}) {
  const geometry = useMemo(() => {
    const points: number[] = []
    nodes.forEach((n, i) => {
      if (hub) {
        points.push(0, 0, 0, ...n.position)
      } else {
        const next = nodes[(i + 1) % nodes.length]
        points.push(...n.position, ...next.position)
      }
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    return g
  }, [nodes, hub])

  useLayoutEffect(() => () => geometry.dispose(), [geometry])

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity * draw} />
    </lineSegments>
  )
}

/* ------------------------------------------------------------------ */
/* Frames — surfaces, timelines, optical stacks                        */
/* ------------------------------------------------------------------ */

export function FrameStack({
  count = 7,
  color,
  spacing = 0.55,
  progress = 0,
  intensity = 1,
  tilt = 0,
}: {
  count?: number
  color: string
  spacing?: number
  /** Slides the stack through its own depth. Pass a getter if scroll drives it. */
  progress?: Dyn
  intensity?: number
  tilt?: number
}) {
  const group = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    g.rotation.y = tilt + Math.sin(state.clock.elapsedTime * 0.25) * 0.14 * intensity + sceneMotion.pointerX * 0.25
    g.position.z = resolve(progress) * spacing * count * 0.5
    void delta
  })

  return (
    <group ref={group}>
      {Array.from({ length: count }, (_, i) => {
        const t = i / Math.max(1, count - 1)
        return (
          <mesh key={i} position={[0, 0, -i * spacing + (count * spacing) / 2]}>
            <planeGeometry args={[3.2 - t * 0.9, 1.9 - t * 0.55]} />
            <meshBasicMaterial
              color={color}
              wireframe
              transparent
              opacity={0.2 + (1 - t) * 0.55}
              side={THREE.DoubleSide}
            />
          </mesh>
        )
      })}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Ripple — cause, influence spreading outward                         */
/* ------------------------------------------------------------------ */

export function Ripple({ color, rings = 4, intensity = 1 }: { color: string; rings?: number; intensity?: number }) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime * 0.35 * intensity
    g.children.forEach((child, i) => {
      const phase = (t + i / rings) % 1
      child.scale.setScalar(0.4 + phase * 3.4)
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
      mat.opacity = (1 - phase) * 0.5
    })
  })

  return (
    <group ref={group} rotation={[-Math.PI / 2.4, 0, 0]}>
      {Array.from({ length: rings }, (_, i) => (
        <mesh key={i}>
          <torusGeometry args={[1, 0.012, 8, 96]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Lattice — logic, frameworks, protected grids                        */
/* ------------------------------------------------------------------ */

export function Lattice({
  color,
  size = 3.4,
  divisions = 8,
  intensity = 1,
  opacity = 0.28,
}: {
  color: string
  size?: number
  divisions?: number
  intensity?: number
  opacity?: number
}) {
  const group = useRef<THREE.Group>(null)

  const geometry = useMemo(() => {
    const points: number[] = []
    const step = size / divisions
    const half = size / 2
    for (let i = 0; i <= divisions; i++) {
      const p = -half + i * step
      points.push(-half, p, 0, half, p, 0)
      points.push(p, -half, 0, p, half, 0)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    return g
  }, [size, divisions])

  useLayoutEffect(() => () => geometry.dispose(), [geometry])

  useFrame((state) => {
    const g = group.current
    if (!g) return
    g.rotation.x = -0.5 + Math.sin(state.clock.elapsedTime * 0.18) * 0.06 * intensity + sceneMotion.pointerY * 0.12
    g.rotation.z = sceneMotion.pointerX * 0.1
  })

  return (
    <group ref={group}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={color} transparent opacity={opacity} />
      </lineSegments>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Streams — directional media converging on an outcome                */
/* ------------------------------------------------------------------ */

export function Streams({
  color,
  count = 14,
  seed = 7,
  intensity = 1,
  converge = 1,
}: {
  color: string
  count?: number
  seed?: number
  intensity?: number
  /** 1 = all streams point at the origin, 0 = parallel drift. */
  converge?: number
}) {
  const group = useRef<THREE.Group>(null)

  const lanes = useMemo(() => {
    const rand = mulberry32(seed)
    return Array.from({ length: count }, () => ({
      angle: rand() * Math.PI * 2,
      radius: 1.6 + rand() * 2.6,
      y: (rand() - 0.5) * 2.6,
      speed: 0.25 + rand() * 0.5,
      offset: rand(),
    }))
  }, [count, seed])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    g.children.forEach((child, i) => {
      const lane = lanes[i]
      const t = (state.clock.elapsedTime * lane.speed * intensity + lane.offset) % 1
      const r = lane.radius * (1 - t * converge)
      child.position.set(Math.cos(lane.angle) * r, lane.y * (1 - t * converge * 0.8), Math.sin(lane.angle) * r)
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
      mat.opacity = Math.sin(t * Math.PI) * 0.85
      child.lookAt(0, 0, 0)
    })
    void delta
  })

  return (
    <group ref={group}>
      {lanes.map((_, i) => (
        <mesh key={i}>
          <boxGeometry args={[0.02, 0.02, 0.9]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}
