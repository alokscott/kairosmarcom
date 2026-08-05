import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

/**
 * Guards the design tokens against a WCAG 2.2 AA regression.
 *
 * The brand palette contains two colours that are NOT safe as body text on one of
 * the two backgrounds (#C8FF3D on bone is 1.03:1, #5C3BFF on near-black is 3.28:1),
 * which is why `--accent` and `--accent-text` are separate tokens. If someone
 * "simplifies" them back into one, this fails.
 */

const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8')

/** Read a custom property from a specific selector block. */
function token(selector, prop) {
  const block = css.slice(css.indexOf(selector) + selector.length)
  const body = block.slice(0, block.indexOf('}'))
  const m = body.match(new RegExp(`${prop}:\\s*(#[0-9a-fA-F]{3,8})`))
  assert.ok(m, `${prop} not found in ${selector}`)
  return m[1]
}

const channel = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)

function luminance(hex) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h
  const [r, g, b] = [0, 2, 4].map((i) => channel(parseInt(full.slice(i, i + 2), 16) / 255))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

const AA_TEXT = 4.5
const AA_LARGE = 3

const themes = {
  dark: { selector: "[data-theme='dark']", accents: ['orange', 'lime', 'violet', 'silver'] },
  light: { selector: "[data-theme='light']", accents: ['orange', 'lime', 'violet', 'silver'] },
}

for (const [name, { selector, accents }] of Object.entries(themes)) {
  const bg = token(selector, '--bg')
  const fg = token(selector, '--fg')
  const muted = token(selector, '--fg-muted')

  test(`${name}: body text meets AA`, () => {
    assert.ok(contrast(fg, bg) >= AA_TEXT, `--fg on --bg is ${contrast(fg, bg).toFixed(2)}:1`)
  })

  test(`${name}: muted text meets AA`, () => {
    assert.ok(contrast(muted, bg) >= AA_TEXT, `--fg-muted on --bg is ${contrast(muted, bg).toFixed(2)}:1`)
  })

  for (const accent of accents) {
    test(`${name}: --${accent}-text meets AA on --bg`, () => {
      const c = contrast(token(selector, `--${accent}-text`), bg)
      assert.ok(c >= AA_TEXT, `--${accent}-text on ${name} --bg is ${c.toFixed(2)}:1, need ${AA_TEXT}`)
    })
  }
}

test('graphic accents remain distinguishable against both backgrounds', () => {
  // Used for rules, shapes and large display type only — 3:1 is the bar (WCAG 1.4.11).
  const graphic = { orange: '#ff4b23', lime: '#c8ff3d', violet: '#5c3bff', silver: '#b7b8b5' }
  for (const [name, hex] of Object.entries(graphic)) {
    const onDark = contrast(hex, token("[data-theme='dark']", '--bg'))
    assert.ok(onDark >= AA_LARGE, `${name} on dark is ${onDark.toFixed(2)}:1`)
  }
})

test('--on-accent is legible on every accent fill', () => {
  // .btn--primary, .skip-link and ::selection all paint --on-accent on --accent.
  for (const accent of ['orange', 'lime', 'violet', 'silver']) {
    const selector = `[data-accent='${accent}']`
    const c = contrast(token(selector, '--on-accent'), token(selector, '--accent'))
    assert.ok(c >= AA_TEXT, `--on-accent on ${accent} is ${c.toFixed(2)}:1, need ${AA_TEXT}`)
  }
})
