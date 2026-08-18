'use client'

import { useSyncExternalStore } from 'react'
import type { Accent, ScenePreset } from '@/content/types'

/**
 * Scene state is split in two on purpose.
 *
 * `sceneMotion` is a plain mutable object read inside useFrame. Scroll progress and
 * pointer position change every frame; routing them through React state would
 * re-render the tree 60 times a second for no benefit.
 *
 * The subscribable store below holds only what changes rarely — which preset is
 * active, its accent, whether the canvas should render at all — so React work
 * happens on scene changes and nothing else.
 */

export const sceneMotion = {
  /** 0–1 through the active scene's own scroll range. */
  progress: 0,
  /** -1..1, normalised pointer. Stays at 0 on coarse pointers. */
  pointerX: 0,
  pointerY: 0,
  /** Device orientation, normalised the same way. */
  tiltX: 0,
  tiltY: 0,
}

export interface SceneConfig {
  preset: ScenePreset
  accent: Accent
  /** Ambient motion multiplier. 0 freezes the scene (reduced motion). */
  intensity: number
  /**
   * Index of the focused stage or service. Discrete and low-frequency (it changes
   * a handful of times per page), so unlike scroll progress it goes through React
   * and is allowed to swap which primitives are mounted.
   */
  focus: number
}

export type Theme = 'light' | 'dark'

interface StoreState extends SceneConfig {
  /** False while off-screen, in a background tab, or when WebGL is unavailable. */
  active: boolean
  /**
   * Which theme the document is in. The canvas is transparent, so it composites
   * over `--bg` — additive blending and a white key light read correctly on ink and
   * wash out to nothing on bone. The scene has to know which one it is standing on.
   */
  theme: Theme
}

let state: StoreState = { preset: 'core', accent: 'orange', intensity: 1, focus: 0, active: true, theme: 'light' }

const listeners = new Set<() => void>()

const emit = () => listeners.forEach((l) => l())

export function setScene(patch: Partial<StoreState>) {
  const next = { ...state, ...patch }
  if (
    next.preset === state.preset &&
    next.accent === state.accent &&
    next.intensity === state.intensity &&
    next.focus === state.focus &&
    next.active === state.active &&
    next.theme === state.theme
  ) {
    return
  }
  state = next
  emit()
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => void listeners.delete(l)
}

const getSnapshot = () => state

/**
 * Server snapshot is stable, so the canvas never renders during SSR.
 *
 * Hoisted to a module constant rather than built in the getter: useSyncExternalStore
 * compares snapshots by identity, and returning a fresh object literal on every call
 * makes React warn about an infinite loop.
 */
const SERVER_SNAPSHOT: StoreState = {
  preset: 'core',
  accent: 'orange',
  intensity: 1,
  focus: 0,
  active: false,
  theme: 'light',
}

const getServerSnapshot = (): StoreState => SERVER_SNAPSHOT

export const useSceneStore = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

/**
 * Must stay in step with the `[data-accent]` blocks in globals.css — this is what the
 * WebGL layer paints, and the DOM and the canvas disagreeing is visible as a section
 * whose backdrop is a different colour from its own type.
 *
 * One colour, sampled from the logo, plus one neutral for the bands that recede.
 * Three slots share the red deliberately; see the palette note in globals.css.
 */
export const ACCENT_HEX: Record<Accent, string> = {
  orange: '#EE3A3C',
  lime: '#EE3A3C',
  violet: '#EE3A3C',
  silver: '#B7B8B5',
}
