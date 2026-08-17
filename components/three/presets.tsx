'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import type { ScenePreset } from '@/content/types'
import { Halo, Starburst, StarMark } from './primitives'
import type { QualitySettings } from './quality'
import { sceneMotion } from './store'

/**
 * Scene presets (brief §17).
 *
 * Every preset is the same three marks — the ray ring, the halo and the six-point
 * star — at a different scale, count and speed. A section is distinguished by how the
 * mark BEHAVES, not by swapping it for something else. The site used to run a
 * different piece of geometry per section (a galaxy here, a wireframe stack there, a
 * node graph somewhere else): thirteen unrelated visuals and nothing a visitor could
 * recognise twice.
 *
 * ─── Where the mark sits ───
 *
 * The canvas is centred and full-bleed, and the page's text columns fill the shell.
 * A ring of any middling radius therefore draws its arc straight through the copy —
 * which is what it was doing, and why sections read as busy even at a low alpha.
 *
 * So the ring is pushed OUT: `fit` sizes it off the viewport's half-width, putting the
 * rays in the page margins and leaving the ring's empty interior — most of its area —
 * as the space the text occupies. The mark frames the section instead of sitting
 * behind it. Nothing is dimmed or hidden to achieve that; it is moved.
 *
 * What stays at the centre is only ever small and thin: the star sits in the gutter
 * between the two editorial columns, where there is nothing to obscure.
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
  /**
   * Retained because the store still tracks it and a future preset may want to
   * compose differently on ink. The marks themselves are flat and unlit, so they
   * read the same on both grounds and nothing here branches on it today.
   */
  theme: 'light' | 'dark'
}

/** Scroll progress, clamped and scaled. Returned as a getter for the frame loop. */
const scrolled = (gain = 1) => () => THREE.MathUtils.clamp(sceneMotion.progress * gain, 0, 1)

/** Ray count for a ring, scaled to the device tier but never below a readable mark. */
const rays = (q: QualitySettings, factor = 1) => Math.max(12, Math.round(q.rays * 0.07 * factor))

/**
 * Fractions of the viewport half-width.
 *
 * `FRAME` clears the editorial shell at every aspect ratio the site is used at — the
 * shell caps at 78rem and always sits inside the viewport, so a ring at 0.96 of the
 * half-width has its arc outside the text on a 1280×720 laptop and a 1920×1080 desktop
 * alike. `OUTER` is a second, wider ring for depth.
 */
const FRAME = 0.96
const OUTER = 1.22

/* ------------------------------------------------------------------ */

/**
 * Kairos Core — the mark at rest. Used wherever a section has no preset of its own.
 *
 * Deliberately the one preset with nothing scroll-driven in it: every radius here was
 * a getter reading scroll progress, which meant the visual grew as the page was read.
 * The mark turns slowly and does nothing else.
 */
function CoreScene({ color, quality, intensity }: PresetProps) {
  return (
    <>
      <Starburst rays={rays(quality)} fit={FRAME} color={color} spin={0.05 * intensity} />
      <Halo fit={FRAME} color={color} opacity={0.5} />
      <StarMark color={color} scale={0.62} spin={-0.04 * intensity} nested />
    </>
  )
}

/** Principle transformation — the same mark behaves differently for each of the four. */
function PrincipleScene({ color, quality, intensity, focus }: PresetProps) {
  switch (focus) {
    case 1: // Logic — the ring locks into an ordered, tighter formation.
      return (
        <>
          <Starburst rays={rays(quality, 1.8)} fit={FRAME} color={color} spin={0.012 * intensity} />
          <Halo fit={FRAME} color={color} opacity={0.75} />
        </>
      )
    case 2: // Magic — the star doubles and reveals a second reading.
      return (
        <>
          <Starburst rays={rays(quality)} fit={FRAME} color={color} spin={0.05 * intensity} opacity={0.7} />
          <StarMark color={color} scale={0.9} spin={-0.09 * intensity} nested />
        </>
      )
    case 3: // Cause — a single impulse spreading outward.
      return (
        <>
          <Starburst rays={rays(quality)} fit={FRAME} color={color} spin={0.05 * intensity} />
          <Starburst rays={rays(quality)} fit={OUTER} color={color} spin={0.03 * intensity} opacity={0.5} offset={0.11} />
        </>
      )
    default: // Connection — the star finds the ring around it.
      return (
        <>
          <StarMark color={color} scale={0.7} spin={-0.05 * intensity} />
          <Starburst rays={rays(quality)} fit={FRAME} color={color} spin={0.04 * intensity} />
        </>
      )
  }
}

/**
 * Service constellation — six disciplines around one centre.
 *
 * The focused discipline advances the ring by its own share of a full turn, so
 * selecting a service visibly moves the mark rather than only recolouring it.
 */
function ConstellationScene({ color, quality, intensity, focus }: PresetProps) {
  const step = focus >= 0 ? (focus / 6) * Math.PI * 2 : 0
  return (
    <>
      <Starburst rays={12} fit={FRAME} color={color} spin={0.02 * intensity} offset={step} />
      <Starburst rays={rays(quality, 1.3)} fit={OUTER} color={color} spin={-0.015 * intensity} opacity={0.4} />
      <Halo fit={FRAME} color={color} opacity={0.5} />
      {/*
        No star. This is the one layout whose gutter is too narrow for it: the
        discipline list carries its 01–06 numerals hard against the right edge of the
        left column, which is where the centre of the frame falls. Two rings and a halo
        already carry the mark here.
      */}
    </>
  )
}

/**
 * Case studies.
 *
 * Six presets, one composition, differing only in ring count and speed. They used to
 * be six unrelated scenes (light trails, an optical stack, a protected grid…), which
 * meant a visitor moving between two case studies saw two different websites.
 */
const caseScene =
  (spin: number, second: boolean) =>
  function CaseScene({ color, quality, intensity }: PresetProps) {
    return (
      <>
        <Starburst rays={rays(quality)} fit={FRAME} color={color} spin={spin * intensity} />
        {second && (
          <Starburst
            rays={rays(quality)}
            fit={OUTER}
            color={color}
            spin={-spin * 0.6 * intensity}
            opacity={0.45}
            offset={0.13}
          />
        )}
        <Halo fit={FRAME} color={color} opacity={0.45} />
        <StarMark color={color} scale={0.5} spin={-0.03 * intensity} />
      </>
    )
  }

/** Metric environment — a still, wide ring. The numbers are the subject here. */
function MetricsScene({ color, quality, intensity }: PresetProps) {
  return (
    <>
      <Starburst rays={rays(quality, 1.4)} fit={FRAME} color={color} spin={0.012 * intensity} opacity={0.5} />
      <Halo fit={FRAME} color={color} opacity={0.35} />
    </>
  )
}

/** Film — the ring opens outward as the rail travels sideways. */
function FilmScene({ color, quality, intensity }: PresetProps) {
  return (
    <>
      <Starburst rays={rays(quality)} fit={FRAME} color={color} spin={0.03 * intensity} />
      <Halo fit={FRAME} color={color} opacity={0.4} />
      <StarMark color={color} scale={() => 0.45 + scrolled()() * 0.35} spin={-0.04 * intensity} />
    </>
  )
}

/**
 * Process — observe, distil, build, hand over.
 *
 * Loose, then drawn in tight, then ordered and doubled, then released outward as a set
 * of reusable parts. The stage is read in the ring's density and speed rather than its
 * radius, which has to stay outside the copy at every stage.
 */
function ProcessScene({ color, quality, intensity, focus }: PresetProps) {
  const stage = THREE.MathUtils.clamp(focus, 0, 3)
  const spin = [0.06, 0.018, 0.03, 0.05][stage]
  const density = [0.7, 1.1, 1.6, 1][stage]

  return (
    <>
      <Starburst rays={rays(quality, density)} fit={FRAME} color={color} spin={spin * intensity} />
      {stage >= 2 && (
        <Starburst
          rays={rays(quality, density)}
          fit={OUTER}
          color={color}
          spin={-spin * 0.5 * intensity}
          opacity={0.45}
          offset={0.13}
        />
      )}
      <Halo fit={FRAME} color={color} opacity={0.45} />
      <StarMark color={color} scale={stage === 1 ? 0.8 : 0.5} spin={-0.04 * intensity} nested={stage === 1} />
    </>
  )
}

/** Contact — everything the site separated aligns into one mark. */
function ContactScene({ color, quality, intensity }: PresetProps) {
  return (
    <>
      <Starburst rays={rays(quality)} fit={FRAME} color={color} spin={0.05 * intensity} />
      <Halo fit={FRAME} color={color} opacity={0.5} />
      {/* Capped low. The contact preset stays active through the FAQ accordion above
          it, which spans the full shell — so the centre of the frame is a line of type
          there, and a star that grew past ~0.65 crossed two rows of questions. */}
      <StarMark color={color} scale={() => 0.4 + scrolled(1.6)() * 0.25} spin={-0.05 * intensity} nested />
    </>
  )
}

/* ------------------------------------------------------------------ */

const PRESETS: Record<ScenePreset, (p: PresetProps) => React.ReactElement> = {
  core: CoreScene,
  principle: PrincipleScene,
  constellation: ConstellationScene,
  'case-automotive': caseScene(0.045, true),
  'case-optics': caseScene(0.03, true),
  'case-education': caseScene(0.025, false),
  'case-security': caseScene(0.02, true),
  'case-platform': caseScene(0.035, false),
  'case-ev': caseScene(0.055, true),
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
 * A short dolly plus a slow roll and pointer lead. The travel is deliberately small:
 * at the old 3.8 units the mark visibly grew as a section was read and ended up
 * filling the frame behind the copy. The roll is capped and the lerp damped so the
 * horizon never swings fast enough to be a vestibular problem; reduced motion zeroes
 * `intensity` and freezes all of it.
 *
 * The roll is now zero as well. The ring is sized to sit just outside the text, so a
 * few degrees of rotation is enough to swing part of its arc back across a column —
 * the one motion that would undo the framing.
 */
export function Camera({ intensity }: { intensity: number }) {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3())
  const look = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    const p = sceneMotion.progress
    // Ease the dolly so the approach decelerates into the section rather than
    // arriving at constant speed.
    const eased = 1 - Math.pow(1 - p, 2.2)

    target.current.set(
      sceneMotion.pointerX * 0.35 * intensity,
      sceneMotion.pointerY * -0.2 * intensity,
      9.6 - eased * 0.9
    )
    camera.position.lerp(target.current, Math.min(1, delta * 2.2))

    // On axis and level: looking off-centre or rolling pushes the ring's dense edge
    // back under one of the two text columns.
    look.current.set(0, 0, 0)
    camera.lookAt(look.current)
    camera.rotation.z = 0
  })

  return null
}
