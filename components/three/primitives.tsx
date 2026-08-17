'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { sceneMotion } from './store'

/**
 * The 3D vocabulary — three primitives, all drawn from the Kairos mark.
 *
 * The logo is a ring of outward-pointing triangles around a thin circle, with a
 * six-point star inside it. That is the whole alphabet here: `Starburst` is the ray
 * ring, `Halo` is the circle, `StarMark` is the star. Every scene in the site is a
 * composition of those three at different scales, counts and speeds.
 *
 * This replaces the previous vocabulary — a particle galaxy, shard clouds, wireframe
 * frame stacks, lattices, node graphs, ripples and streams. Two problems with it: none
 * of it was recognisably Kairos, and because the canvas is `position: fixed` and
 * composites over the whole document, the scattered geometry landed on top of body
 * copy in any section that did not register a scene of its own.
 *
 * Two rules keep this one honest:
 *
 *  1. Everything is CENTRED and RADIAL. The mark grows from the middle of the frame
 *     outward, so the loud part of the composition sits where the editorial grid keeps
 *     its gutter, not where the text columns are.
 *  2. Everything is FLAT — `meshBasicMaterial`, no lighting, no depth shading. A brand
 *     mark is a graphic, not an object, and flat shapes at low opacity read as a
 *     printed watermark rather than as something floating in front of the page.
 *
 * Every primitive is deterministic: no Math.random, so a scene looks identical on
 * every visit and across re-renders.
 */

/**
 * A value that may change every frame. Pass a getter for anything driven by scroll
 * or pointer — a plain number would be captured at render time and never animate,
 * because these components deliberately do not re-render per frame.
 */
export type Dyn = number | (() => number)

const resolve = (v: Dyn) => (typeof v === 'function' ? v() : v)

/**
 * One multiplier over every mark in the scene.
 *
 * The canvas composites over the whole document, so this is the single number that
 * decides how much the brand mark is allowed to compete with the copy in front of it.
 * Turn it up to make the site louder, down to make it quieter; nothing else needs to
 * change. It is deliberately low: this layer is a watermark, not an illustration.
 *
 * ─── Why 0.22 and not 0.3 ───
 *
 * This is the value at which the scene stops needing a scrim, which is what makes it
 * worth calculating rather than eyeballing.
 *
 * The worst case on the page is `--fg-muted` (#55534e, luminance 0.089) with a ray
 * directly behind it on bone (#f4f1e9). A ray is flat #ee3a3c composited at this
 * alpha, so the surface under the text is:
 *
 *   0.22 × (238,58,60) + 0.78 × (244,241,233) = (243,201,195), luminance 0.646
 *   contrast = (0.646 + 0.05) / (0.089 + 0.05) = 5.00:1
 *
 * At 0.3 the same sum lands on 4.44:1 — under AA, which is why body copy over the
 * scene used to need a scrim painted behind it. Removing that scrim removed a visible
 * smudge from every pinned section (see the note where `.scrim` used to live in
 * globals.css); this number is what pays for it.
 *
 * Raising it means putting the scrim back. Do not raise it alone.
 */
export const GEOMETRY_ALPHA = 0.22

/* ------------------------------------------------------------------ */
/* Starburst — the ring of rays from the mark                          */
/* ------------------------------------------------------------------ */

/**
 * `radius` and `spin` accept getters so scroll can drive them without re-rendering.
 *
 * The rays are one InstancedMesh: the per-instance transform is fixed and the whole
 * ring is animated by rotating its parent group, which means N triangles cost one
 * draw call and one matrix update per frame regardless of N.
 */
export function Starburst({
  rays = 28,
  radius = 2.4,
  /**
   * Length of one ray, along the outward axis, in world units.
   *
   * Kept small on purpose. The frame is about 7.4 world units tall at the scene's
   * camera distance, so 0.2 puts a ray at roughly 5% of the frame — the proportion it
   * has to the ring in the printed mark. Anything near 0.5 and each triangle becomes
   * a shape the eye reads as an object rather than as one tooth of a circle.
   */
  length = 0.2,
  /** Width of one ray at its base, in world units. */
  width = 0.095,
  color,
  /** Radians per second. Negative counter-rotates. */
  spin = 0.08,
  opacity = 1,
  /** Phase offset so stacked rings do not line up their rays. */
  offset = 0,
  /**
   * Size the ring off the VIEWPORT rather than the scene, as a fraction of its
   * half-width. This is what turns the mark from something behind the copy into
   * something around it.
   *
   * The canvas is centred and full-bleed and the page's text columns fill the shell,
   * so a ring of any middling radius draws its arc straight through the words — which
   * is exactly what it was doing. Pushing the arc out past the shell puts the rays in
   * the page margins and leaves the ring's empty interior, which is most of it, as the
   * area the text sits in. The animation is not dimmed or hidden; it is moved.
   *
   * It has to be computed from the viewport rather than hard-coded because the two
   * things being reconciled scale on different axes: world units map to pixels via the
   * viewport HEIGHT, and the shell is a function of its WIDTH. A fixed radius that
   * clears the columns at 1440×900 cuts through them at 1280×720.
   *
   * Measured against the LONGER axis, not the width. On a landscape desktop those are
   * the same thing. On a phone they are not: the text column there is essentially the
   * whole viewport, so a ring sized to sit just inside the width has nowhere to go and
   * draws its arc straight across the copy — the exact fault this prop was added to
   * fix, reappearing at 390px. Taking the longer axis pushes the ring off the short
   * one, leaving the faint edge of an arc and a clean column of text.
   */
  fit,
}: {
  rays?: number
  radius?: Dyn
  length?: number
  width?: number
  color: string
  spin?: number
  opacity?: number
  offset?: number
  fit?: number
}) {
  const group = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.InstancedMesh>(null)
  const viewport = useThree((s) => s.viewport)

  /*
   * A three-segment circle IS a triangle, and it is the one built-in that gives a
   * flat, filled, correctly-centred one without hand-authoring a BufferGeometry.
   * Sized here in WORLD units and never scaled again, so a ray is the same size at
   * every radius — see the note on the frame loop below.
   */
  const geometry = useMemo(() => {
    const g = new THREE.CircleGeometry(0.5, 3)
    // -90° puts the triangle's apex on +X, which is the outward axis once each
    // instance is rotated to its own angle on the ring.
    g.rotateZ(-Math.PI / 2)
    g.scale(length * 2, width * 2, 1)
    return g
  }, [length, width])

  useLayoutEffect(() => () => geometry.dispose(), [geometry])

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const current = useRef(0)

  /*
   * Matrices are rebuilt on the frames where the radius actually moves, rather than
   * the ring being scaled as a group.
   *
   * Scaling the group was the obvious cheap trick and it was wrong: an instance's
   * scale rides on the parent's, so widening the ring also inflated every ray with
   * it. At radius 3.6 a 0.4-unit ray rendered 2.6 units long — a third of the frame
   * per triangle. Writing N matrices is nothing at these counts (12–40 rays, one
   * Object3D reused) and it keeps position and size independent, which is the whole
   * requirement.
   */
  useFrame((state, delta) => {
    const g = group.current
    const m = mesh.current
    if (!g || !m) return

    g.rotation.z += delta * spin
    // The mark leans toward the pointer; it does not chase it.
    g.position.x = sceneMotion.pointerX * 0.22 + sceneMotion.tiltX * 0.12
    g.position.y = -sceneMotion.pointerY * 0.14 + sceneMotion.tiltY * 0.12

    const target = fit ? (Math.max(viewport.width, viewport.height) / 2) * fit : resolve(radius)
    // Damped so a scroll-driven radius eases rather than snapping frame to frame.
    const r = current.current + (target - current.current) * Math.min(1, delta * 2.5)
    if (Math.abs(r - current.current) < 0.0005 && state.clock.elapsedTime > 0.5) return
    current.current = r

    for (let i = 0; i < rays; i++) {
      const a = offset + (i / rays) * Math.PI * 2
      dummy.position.set(Math.cos(a) * r, Math.sin(a) * r, 0)
      dummy.rotation.set(0, 0, a)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[geometry, undefined, rays]} frustumCulled={false}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity * GEOMETRY_ALPHA}
          depthWrite={false}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Halo — the thin circle the rays sit on                              */
/* ------------------------------------------------------------------ */

export function Halo({
  radius = 2,
  color,
  opacity = 1,
  spin = 0,
  /** Same viewport-relative sizing as Starburst — see the note there. */
  fit,
}: {
  radius?: Dyn
  color: string
  opacity?: number
  spin?: number
  fit?: number
}) {
  const group = useRef<THREE.Group>(null)
  const viewport = useThree((s) => s.viewport)

  const geometry = useMemo(() => {
    const points: number[] = []
    const segments = 128
    for (let i = 0; i < segments; i++) {
      const a = (i / segments) * Math.PI * 2
      const b = ((i + 1) / segments) * Math.PI * 2
      points.push(Math.cos(a), Math.sin(a), 0, Math.cos(b), Math.sin(b), 0)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    return g
  }, [])

  useLayoutEffect(() => () => geometry.dispose(), [geometry])

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    g.rotation.z += delta * spin
    const r = fit ? (Math.max(viewport.width, viewport.height) / 2) * fit : resolve(radius)
    const s = g.scale.x + (r - g.scale.x) * Math.min(1, delta * 2.5)
    g.scale.set(s, s, 1)
    g.position.x = sceneMotion.pointerX * 0.22
    g.position.y = -sceneMotion.pointerY * 0.14
  })

  return (
    <group ref={group} scale={0.001}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={color} transparent opacity={opacity * GEOMETRY_ALPHA} toneMapped={false} />
      </lineSegments>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* StarMark — the six-point star at the centre of the mark             */
/* ------------------------------------------------------------------ */

/**
 * Two overlapping equilateral triangles, drawn as an outline.
 *
 * This is the focal object of every scene — the thing the camera approaches and the
 * thing that grows as a section is read. It replaces the old `Core`, an icosahedron
 * with a transmissive shell: a glass ball is a nice piece of WebGL and it said nothing
 * about this brand, while this is the mark on the letterhead.
 */
export function StarMark({
  color,
  scale = 1,
  opacity = 1,
  spin = -0.05,
  /** Draws a second, smaller star inside the first. */
  nested = false,
}: {
  color: string
  scale?: Dyn
  opacity?: number
  spin?: number
  nested?: boolean
}) {
  const group = useRef<THREE.Group>(null)

  const geometry = useMemo(() => {
    const points: number[] = []
    // Two triangles, the second rotated 60°, gives the six-point star of the mark.
    for (const phase of [0, Math.PI / 3]) {
      for (let i = 0; i < 3; i++) {
        const a = phase + (i / 3) * Math.PI * 2 + Math.PI / 2
        const b = phase + ((i + 1) / 3) * Math.PI * 2 + Math.PI / 2
        points.push(Math.cos(a), Math.sin(a), 0, Math.cos(b), Math.sin(b), 0)
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    return g
  }, [])

  useLayoutEffect(() => () => geometry.dispose(), [geometry])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    g.rotation.z += delta * spin
    const s = resolve(scale)
    const eased = g.scale.x + (s - g.scale.x) * Math.min(1, delta * 3)
    g.scale.setScalar(eased)
    g.position.x = sceneMotion.pointerX * 0.3 + sceneMotion.tiltX * 0.14
    g.position.y = -sceneMotion.pointerY * 0.2 + sceneMotion.tiltY * 0.14
    void state
  })

  return (
    <group ref={group} scale={0.001}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={color} transparent opacity={opacity * GEOMETRY_ALPHA} toneMapped={false} />
      </lineSegments>
      {nested && (
        <lineSegments geometry={geometry} scale={0.5} rotation={[0, 0, Math.PI / 6]}>
          <lineBasicMaterial color={color} transparent opacity={opacity * GEOMETRY_ALPHA * 0.7} toneMapped={false} />
        </lineSegments>
      )}
    </group>
  )
}
