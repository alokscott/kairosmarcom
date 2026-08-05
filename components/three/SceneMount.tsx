'use client'

import dynamic from 'next/dynamic'

/**
 * Client boundary for the two canvas layers.
 *
 * `ssr: false` is only legal inside a Client Component, and neither layer has any
 * meaning until there is a device to ask about.
 *
 * Two layers, deliberately: the far scene renders behind the document, the near
 * motes render in front of it. Text sits between them, which is the only way to put
 * type *inside* a WebGL scene while keeping it real, selectable, indexable DOM.
 */
const SceneRoot = dynamic(() => import('./SceneRoot'), { ssr: false })
const Foreground = dynamic(() => import('./Foreground'), { ssr: false })

export default function SceneMount() {
  return (
    <>
      <SceneRoot />
      <Foreground />
    </>
  )
}
