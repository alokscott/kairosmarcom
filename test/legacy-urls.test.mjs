import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolveLegacy } from '../lib/legacy-urls.ts'

/**
 * Redirect correctness is not something you notice breaking — you notice it in the
 * traffic report three months later. These pin the two properties that matter:
 * every legacy URL lands on the right page, and it does so in exactly one hop.
 */

const SLUGS = new Set([
  'ageless-digital',
  'bmw-bavaria-motors',
  'dji-india',
  'insta360-india',
  'global-opportunities',
  'audi-gurugram',
  'byd-kristan-auto',
  'thinkcyber-india',
  'thrivedx',
])

const resolve = (path, slug = null) => resolveLegacy(path, slug, SLUGS)

test('every published case slug maps to its clean URL', () => {
  for (const slug of SLUGS) {
    assert.equal(resolve('/new/case.php', slug), `/work/${slug}`)
    assert.equal(resolve('/case.php', slug), `/work/${slug}`)
  }
})

test('an unknown or missing slug falls back to the index, never a 404', () => {
  assert.equal(resolve('/new/case.php', 'not-a-client'), '/work')
  assert.equal(resolve('/new/case.php', null), '/work')
  assert.equal(resolve('/new/case.php', ''), '/work')
})

test('the /new prefix resolves to the homepage with or without a trailing slash', () => {
  assert.equal(resolve('/new'), '/')
  assert.equal(resolve('/new/'), '/')
})

test('paths under /new lose the prefix', () => {
  assert.equal(resolve('/new/work'), '/work')
  assert.equal(resolve('/new/services'), '/services')
})

test('the 2021 static site maps to the new routes', () => {
  assert.equal(resolve('/index.html'), '/')
  assert.equal(resolve('/about.html'), '/about')
  assert.equal(resolve('/services.html'), '/services')
  assert.equal(resolve('/contact.html'), '/contact')
})

test('trailing slashes collapse in one step', () => {
  assert.equal(resolve('/work/'), '/work')
  assert.equal(resolve('/work/dji-india/'), '/work/dji-india')
})

test('clean URLs pass straight through', () => {
  for (const path of ['/', '/work', '/work/dji-india', '/services', '/contact', '/privacy']) {
    assert.equal(resolve(path), null, `${path} should not redirect`)
  }
})

test('no result ever needs a second hop', () => {
  // The property that actually matters: feeding any output back in must be a no-op.
  const inputs = [
    '/new',
    '/new/',
    '/new/work',
    '/new/case.php',
    '/case.php',
    '/index.html',
    '/about.html',
    '/services.html',
    '/contact.html',
    '/work/',
    '/work/dji-india/',
    '/new/services/',
  ]
  for (const input of inputs) {
    const once = resolve(input, 'dji-india')
    assert.ok(once, `${input} produced no target`)
    assert.equal(resolve(once, 'dji-india'), null, `${input} -> ${once} would redirect again`)
  }
})

test('case-insensitive legacy filenames still resolve', () => {
  assert.equal(resolve('/Index.html'), '/')
  assert.equal(resolve('/new/CASE.PHP', 'thrivedx'), '/work/thrivedx')
})
