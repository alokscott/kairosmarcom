'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { ScenePreset } from '@/content/types'
import { Core, FrameStack, Lattice, NodeCluster, Ripple, ShardField, Streams, Threads, type NodeSpec } from './primitives'
import type { QualitySettings } from './quality'
import { sceneMotion } from './store'

/**
 * Scene presets (brief §17). Each is a composition of the shared primitives, chosen
 * so the object on screen means the thing the copy beside it is saying. No preset
 * exists as decoration.
 *
 * Anything scroll-driven is passed as a getter, never a captured number — these
 * components render once per scene change, not once per frame.
 */

interface PresetProps {
  color: string
  quality: QualitySettings
  intensity: number
  /** Discrete stage/service index, supplied by the store. */
  focus: number
}

const ring = (count: number, radius: number, y = 0): NodeSpec[] =>
  Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2
    return {
      position: [Math.cos(a) * radius, y + Math.sin(a * 2) * 0.35, Math.sin(a) * radius] as [number, number, number],
    }
  })

/** Scroll progress, clamped and scaled. Returned as a getter for the frame loop. */
const scrolled = (gain = 1) => () => THREE.MathUtils.clamp(sceneMotion.progress * gain, 0, 1)

/* ------------------------------------------------------------------ */

/** Kairos Core — dispersed fragments align into the decisive moment. */
function CoreScene({ color, quality, intensity }: PresetProps) {
  return (
    <>
      <ShardField count={quality.shards} convergence={scrolled(1.35)} color={color} radius={2.3} spread={11} seed={11} />
      <Core color={color} quality={quality} scale={() => 0.35 + scrolled(1.35)() * 0.5} intensity={intensity} />
    </>
  )
}

/** Principle transformation — the same core behaves differently for each of the four tests. */
function PrincipleScene({ color, quality, intensity, focus }: PresetProps) {
  const nodes = useMemo(() => ring(7, 2.3), [])

  switch (focus) {
    case 1: // Logic — the loose field snaps onto an ordered axis.
      return (
        <>
          <Lattice color={color} intensity={intensity} divisions={9} opacity={0.4} />
          <ShardField
            count={Math.round(quality.shards * 0.45)}
            convergence={1}
            color={color}
            form="lattice"
            radius={1.6}
            seed={5}
          />
        </>
      )
    case 2: // Magic — one element refracts and reveals a second reading.
      return <Core color={color} quality={quality} scale={1.15} intensity={intensity * 1.4} />
    case 3: // Cause — a single impulse ripples outward.
      return (
        <>
          <Ripple color={color} rings={5} intensity={intensity} />
          <Core color={color} quality={quality} scale={0.5} intensity={intensity} />
        </>
      )
    default: // Connection — independent nodes find each other.
      return (
        <>
          <NodeCluster nodes={nodes} color={color} intensity={intensity} />
          <Threads nodes={nodes} color={color} />
        </>
      )
  }
}

/** Service constellation — six disciplines orbiting one senior team. */
function ConstellationScene({ color, quality, intensity, focus }: PresetProps) {
  const nodes = useMemo(() => ring(6, 2.6), [])
  return (
    <>
      <Core color={color} quality={quality} scale={0.62} intensity={intensity} />
      <NodeCluster nodes={nodes} color={color} focus={focus} intensity={intensity} />
      <Threads nodes={nodes} color={color} />
    </>
  )
}

/** Automotive — light trails and precise contours. */
function AutomotiveScene({ color, intensity }: PresetProps) {
  return (
    <>
      <Streams color={color} count={20} intensity={intensity} converge={0.55} seed={3} />
      <FrameStack count={5} color={color} spacing={0.75} intensity={intensity} tilt={0.5} />
    </>
  )
}

/** Camera technology — optical stack, refraction, spatial frames. */
function OpticsScene({ color, quality, intensity }: PresetProps) {
  return (
    <>
      <Core color={color} quality={quality} scale={0.8} intensity={intensity} />
      <FrameStack count={9} color={color} spacing={0.38} intensity={intensity} />
      <ShardField count={120} convergence={1} color={color} form="ring" radius={2.9} size={0.04} seed={21} opacity={0.75} />
    </>
  )
}

/** Education — pathways, portals and decision points. */
function EducationScene({ color, quality, intensity }: PresetProps) {
  const nodes = useMemo(() => ring(9, 2.5, -0.4), [])
  return (
    <>
      <NodeCluster nodes={nodes} color={color} intensity={intensity} />
      <Threads nodes={nodes} color={color} hub={false} />
      <Core color={color} quality={quality} scale={0.45} intensity={intensity} />
    </>
  )
}

/** Cybersecurity — an adaptive protected grid with signals crossing it. */
function SecurityScene({ color, intensity }: PresetProps) {
  const nodes = useMemo(() => ring(8, 1.9), [])
  return (
    <>
      <Lattice color={color} intensity={intensity} divisions={12} size={4.4} opacity={0.22} />
      <NodeCluster nodes={nodes} color={color} intensity={intensity} />
      <Threads nodes={nodes} color={color} hub={false} opacity={0.35} />
    </>
  )
}

/** Business platform — connected data layers over operational nodes. */
function PlatformScene({ color, intensity }: PresetProps) {
  const nodes = useMemo(() => ring(5, 1.5, -0.9), [])
  return (
    <>
      <FrameStack count={4} color={color} spacing={0.9} intensity={intensity} tilt={-0.35} />
      <NodeCluster nodes={nodes} color={color} intensity={intensity} />
      <Threads nodes={nodes} color={color} opacity={0.4} />
    </>
  )
}

/** EV — stored energy releasing outward. */
function EvScene({ color, quality, intensity }: PresetProps) {
  return (
    <>
      <Ripple color={color} rings={5} intensity={intensity} />
      <Core color={color} quality={quality} scale={0.7} intensity={intensity} />
      <Streams color={color} count={12} intensity={intensity} converge={1} seed={9} />
    </>
  )
}

/** Metric environment — an ordered field where the numbers are read. */
function MetricsScene({ color, quality, intensity }: PresetProps) {
  return (
    <>
      <Lattice color={color} intensity={intensity} divisions={10} size={5} opacity={0.16} />
      <ShardField
        count={Math.round(quality.shards * 0.35)}
        convergence={1}
        color={color}
        form="lattice"
        radius={2}
        seed={31}
        opacity={0.6}
      />
    </>
  )
}

/** Film gallery — a volumetric timeline of frames. */
function FilmScene({ color, intensity }: PresetProps) {
  return (
    <>
      <FrameStack count={12} color={color} spacing={0.42} intensity={intensity} progress={scrolled()} />
      <Streams color={color} count={8} intensity={intensity} converge={0} seed={17} />
    </>
  )
}

/**
 * Process — scattered data, condensed insight, assembled system, distributed toolkit.
 * The field changes shape per stage; `key` forces the geometry to rebuild when the
 * target form changes, which is the one case where a remount is the cheap option.
 */
function ProcessScene({ color, quality, intensity, focus }: PresetProps) {
  const nodes = useMemo(() => ring(6, 3), [])
  const stage = THREE.MathUtils.clamp(focus, 0, 3)

  const convergence = stage === 0 ? 0.12 : stage === 3 ? 0.55 : 1
  const form = stage === 2 ? 'lattice' : stage === 3 ? 'ring' : 'sphere'
  const radius = stage === 1 ? 0.9 : stage === 3 ? 3.2 : 2.1

  return (
    <>
      <ShardField
        key={`${form}-${radius}`}
        count={quality.shards}
        convergence={convergence}
        color={color}
        form={form}
        radius={radius}
        spread={9}
        seed={13}
      />
      {stage === 1 && <Core color={color} quality={quality} scale={0.55} intensity={intensity} />}
      {stage === 3 && <Threads nodes={nodes} color={color} opacity={0.3} />}
    </>
  )
}

/** Contact convergence — everything the site separated aligns into one object. */
function ContactScene({ color, quality, intensity }: PresetProps) {
  return (
    <>
      <ShardField count={quality.shards} convergence={scrolled(1.6)} color={color} radius={1.9} spread={13} seed={41} />
      <Core color={color} quality={quality} scale={() => 0.2 + scrolled(1.6)() * 0.85} intensity={intensity} />
    </>
  )
}

/* ------------------------------------------------------------------ */

const PRESETS: Record<ScenePreset, (p: PresetProps) => React.ReactElement> = {
  core: CoreScene,
  principle: PrincipleScene,
  constellation: ConstellationScene,
  'case-automotive': AutomotiveScene,
  'case-optics': OpticsScene,
  'case-education': EducationScene,
  'case-security': SecurityScene,
  'case-platform': PlatformScene,
  'case-ev': EvScene,
  metrics: MetricsScene,
  film: FilmScene,
  process: ProcessScene,
  contact: ContactScene,
}

export function Preset({ preset, ...props }: PresetProps & { preset: ScenePreset }) {
  const Component = PRESETS[preset] ?? CoreScene
  return <Component {...props} />
}

/**
 * Camera choreography.
 *
 * A genuine dolly — 9.6 units out to 5.8 across a section's scroll — plus a slow
 * roll and pointer lead. Shallow camera movement was the main reason the scene read
 * as wallpaper rather than as a space the page is inside.
 *
 * The end distance is capped deliberately. Pushed closer the core becomes a
 * full-bleed field behind the body copy, and bone on the orange core measures
 * 2.95:1 — below AA for text and below even the 3:1 large-text bar.
 *
 * The roll is capped and the lerp is damped so the horizon never swings fast enough
 * to be a vestibular problem; reduced motion zeroes `intensity` and freezes all of it.
 */
export function Camera({ intensity }: { intensity: number }) {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3())
  const look = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    const p = sceneMotion.progress
    // Ease the dolly so the approach decelerates into the section rather than
    // arriving at constant speed.
    const eased = 1 - Math.pow(1 - p, 2.2)

    target.current.set(
      sceneMotion.pointerX * 1.15 * intensity + Math.sin(p * Math.PI) * 0.5 * intensity,
      sceneMotion.pointerY * -0.7 * intensity + Math.cos(p * Math.PI * 0.75) * 0.35 * intensity,
      9.6 - eased * 3.8
    )
    camera.position.lerp(target.current, Math.min(1, delta * 2.2))

    // Look slightly ahead of centre so the object drifts across frame instead of
    // sitting locked to the middle of the viewport.
    look.current.set(sceneMotion.pointerX * 0.35 * intensity, -p * 0.45 * intensity, 0)
    camera.lookAt(look.current)
    camera.rotation.z = Math.sin(state.clock.elapsedTime * 0.11) * 0.035 * intensity + p * 0.06 * intensity
  })

  return null
}
