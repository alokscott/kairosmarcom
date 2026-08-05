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

interface StoreState extends SceneConfig {
  /** False while off-screen, in a background tab, or when WebGL is unavailable. */
  active: boolean
}

let state: StoreState = { preset: 'core', accent: 'orange', intensity: 1, focus: 0, active: true }

const listeners = new Set<() => void>()

const emit = () => listeners.forEach((l) => l())

export function setScene(patch: Partial<StoreState>) {
  const next = { ...state, ...patch }
  if (
    next.preset === state.preset &&
    next.accent === state.accent &&
    next.intensity === state.intensity &&
    next.focus === state.focus &&
    next.active === state.active
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
/** Server snapshot is stable, so the canvas never renders during SSR. */
const getServerSnapshot = (): StoreState => ({
  preset: 'core',
  accent: 'orange',
  intensity: 1,
  focus: 0,
  active: false,
})

export const useSceneStore = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

export const ACCENT_HEX: Record<Accent, string> = {
  orange: '#FF4B23',
  lime: '#C8FF3D',
  violet: '#5C3BFF',
  silver: '#B7B8B5',
}
