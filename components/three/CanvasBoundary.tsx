'use client'

import { Component, type ReactNode } from 'react'

/**
 * Catches a WebGL failure and swaps in the static poster.
 *
 * This exists because probing for support is not the same as succeeding: a driver
 * can advertise WebGL and still refuse to create a context (blocklisted GPU,
 * exhausted context pool, a headless or locked-down environment). Three throws
 * synchronously when that happens, and without a boundary the whole subtree
 * unmounts — on a page whose canvas is mounted in the root layout, that is the
 * entire site.
 *
 * A boundary is also the reason the separate capability probe was removed. Trying
 * once and catching is both more accurate than asking in advance and avoids
 * creating a throwaway context to answer a question the real one answers anyway.
 */
export default class CanvasBoundary extends Component<
  { fallback: ReactNode; onError?: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    // Aggregate signal only — no device data is collected (brief §18).
    this.props.onError?.()
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
