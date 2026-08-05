'use client'

import { createContext, useContext, useEffect, useId, useRef } from 'react'
import type { Accent, ScenePreset } from '@/content/types'
import { sceneMotion, setScene } from './store'

/**
 * Declarative scene binding for the DOM layer.
 *
 * A page says "this section means `case-optics` in violet" and the shared canvas
 * responds. Sections do not own canvases and this component renders nothing
 * visible — it is a measurement anchor, so removing it can never remove content.
 *
 * One rAF loop serves every registered scene. Per-section scroll listeners would
 * multiply work by the number of sections for information a single pass already has.
 */

interface Registered {
  el: HTMLElement
  preset: ScenePreset
  accent: Accent
  intensity: number
  /** Stage markers inside this scene, in document order. */
  stages: Map<string, HTMLElement>
  /**
   * Number of discrete stages for a pinned section. When set, the stage index and
   * the scroll scrub are both derived from the pin window rather than from marker
   * elements — inside a sticky panel every marker shares one scroll position, so
   * markers cannot distinguish the stages.
   */
  stageCount: number
}

const registry = new Map<string, Registered>()
let rafId = 0

function measure() {
  rafId = 0
  if (registry.size === 0) return

  const vh = window.innerHeight
  let best: Registered | null = null
  let bestVisible = 0

  for (const entry of registry.values()) {
    const r = entry.el.getBoundingClientRect()
    const visible = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0))
    if (visible > bestVisible) {
      bestVisible = visible
      best = entry
    }
  }

  if (!best || bestVisible === 0) return

  const rect = best.el.getBoundingClientRect()
  const raw = clamp((vh - rect.top) / (vh + rect.height), 0, 1)

  let focus = 0

  if (best.stageCount > 0) {
    // Re-normalise to the window during which the panel is actually pinned:
    // the section enters and leaves the viewport outside that range, and scrubbing
    // across those parts would spend most of the animation off-screen.
    const pinStart = vh / (vh + rect.height)
    const pinEnd = rect.height / (vh + rect.height)
    const t = clamp((raw - pinStart) / Math.max(0.0001, pinEnd - pinStart), 0, 1)
    sceneMotion.progress = t
    focus = clamp(Math.floor(t * best.stageCount), 0, best.stageCount - 1)
    setScene({ preset: best.preset, accent: best.accent, intensity: best.intensity, focus })
    return
  }

  sceneMotion.progress = raw

  // Which stage inside the winning scene is nearest the middle of the viewport.
  if (best.stages.size) {
    const centre = vh * 0.45
    let nearest = Infinity
    let i = 0
    for (const stage of best.stages.values()) {
      const sr = stage.getBoundingClientRect()
      const d = Math.abs(sr.top + sr.height / 2 - centre)
      if (d < nearest) {
        nearest = d
        focus = i
      }
      i++
    }
  }

  setScene({ preset: best.preset, accent: best.accent, intensity: best.intensity, focus })
}

const schedule = () => {
  if (!rafId) rafId = requestAnimationFrame(measure)
}

let listening = 0
function startListening() {
  if (listening++ > 0) return
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
  schedule()
}
function stopListening() {
  if (--listening > 0) return
  window.removeEventListener('scroll', schedule)
  window.removeEventListener('resize', schedule)
  if (rafId) cancelAnimationFrame(rafId)
  rafId = 0
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

const SceneIdContext = createContext<string | null>(null)

export function Scene({
  preset,
  accent,
  intensity = 1,
  stages = 0,
  children,
}: {
  preset: ScenePreset
  accent: Accent
  /** Ambient motion multiplier for this section. */
  intensity?: number
  /**
   * Number of stages for a pinned section. Set this instead of using `useStage`
   * when the content sits inside a sticky panel.
   */
  stages?: number
  /** Stage markers, if the section drives a staged transformation by position. */
  children?: React.ReactNode
}) {
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const parent = el.parentElement
    if (!parent) return

    const existing = registry.get(id)
    registry.set(id, {
      el: parent,
      preset,
      accent,
      intensity,
      stageCount: stages,
      stages: existing?.stages ?? new Map(),
    })
    startListening()
    // Re-measure immediately on re-registration. A staged section changes its accent
    // when the active stage changes, which is a render, not a scroll — without this
    // the scene keeps the previous colour until the visitor moves again.
    schedule()
    return () => {
      registry.delete(id)
      stopListening()
    }
  }, [id, preset, accent, intensity, stages])

  return (
    <SceneIdContext.Provider value={id}>
      <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0" />
      {children}
    </SceneIdContext.Provider>
  )
}

