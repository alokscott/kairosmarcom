'use client'

import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { sceneMotion, type Theme } from './store'

/**
 * Lightning — the site-wide animated backdrop.
 *
 * A single full-bleed quad behind everything else in the scene: a slow domain-warped
 * colour flow with intermittent filaments arcing through it. One draw call, one
 * fragment shader, no textures, no external assets, no dependencies.
 *
 * ─── Why this is not @firecms/neat ───
 *
 * That package declares `SEE LICENSE IN LICENSE` and then ships no LICENSE file, so
 * there is no readable grant to rely on for a commercial site. It is also 905KB and
 * would stand up a third WebGL context alongside the two this site already runs.
 * Everything it does that matters here is a fragment shader, which is what this is.
 *
 * ─── The legibility guarantee ───
 *
 * This sits behind EVERY page, under body copy, in both themes. An unconstrained
 * gradient behind text is how a site ends up with passages that are unreadable at
 * some scroll positions and fine at others — a bug that only shows up in motion and
 * that no static audit catches.
 *
 * So the shader does not merely use muted colours and hope. It measures the
 * luminance of what it has produced and rescales it back inside a hard band around
 * the theme's own `--bg` (see `uBand`). The backdrop is therefore never more than a
 * known distance from the page colour, which keeps the contrast of `--fg` over it
 * bounded no matter what the flow does. Hue moves freely; brightness does not.
 */

const VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const FRAGMENT = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uProgress;
uniform float uStrength;
uniform float uBandDown;
uniform float uBandUp;
uniform float uVeins;
uniform float uDark;
uniform float uOctaves;
uniform vec3  uBg;
uniform vec3  uA;
uniform vec3  uB;
uniform vec3  uC;

varying vec2 vUv;

/* Value noise — cheaper than simplex and entirely sufficient once it is folded into
   fbm and then domain-warped twice. */
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  ) * 2.0 - 1.0;
}

/*
 * Octave count is a uniform so the low tier can drop passes without a second shader
 * program — this is the "stays lightweight" path.
 *
 * Three is the default rather than five, and that is a measured choice: this runs
 * six times per pixel (twice for each warp, once for the blend, once for the veins),
 * so every octave costs six full-screen noise evaluations. Going 5→3 recovered
 * ~10fps under a 4x CPU throttle, and because the field is already folded by two
 * rounds of domain warping the extra octaves were adding cost without adding
 * visible structure.
 */
float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    if (float(i) >= uOctaves) break;
    sum += vnoise(p) * amp;
    p *= 2.02;
    amp *= 0.5;
  }
  return sum;
}

float lum(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

void main() {
  /* ---- Radial, not turbulent ----
   *
   * This used to be two rounds of domain-warped fbm with ridged filaments arcing
   * through it — a liquid, weather-map flow. It looked like a lava lamp and it agreed
   * with nothing else on the page: the mark in front of it is a centred ring of rays
   * and a six-point star, and the backdrop was a blob drifting sideways behind it.
   *
   * The field is now concentric and centred on the same origin as the mark, so the
   * page has ONE geometry. Slow rings breathe outward from the middle, a faint
   * angular ripple echoes the ray count, and noise survives only as a low-amplitude
   * warp so the rings are never mechanically perfect.
   */
  float t = uTime * 0.05 + uProgress * 0.6;

  // Aspect-corrected so the rings are circles rather than ellipses on a wide viewport.
  vec2 c = (vUv - 0.5) * vec2(1.7, 1.0);
  float d = length(c);
  float ang = atan(c.y, c.x);

  // One octave of noise, used only to bend the rings. Two rounds of warping bought
  // structure the rings now provide for free.
  float warp = fbm(c * 2.2 + vec2(0.0, t)) * 0.16;

  // Rings breathing outward. 6.0 is roughly one ring per 8% of the frame — wide
  // enough to read as atmosphere, never as a target.
  float rings = sin((d + warp) * 6.0 - t * 1.4) * 0.5 + 0.5;

  // Six lobes, echoing the six points of the star. Very low weight: this is the
  // difference between "a gradient" and "the brand's gradient".
  float lobes = sin(ang * 6.0 + t * 0.6) * 0.5 + 0.5;

  float f = mix(rings, lobes, 0.22);

  // Centre reads as the accent and the edges fall to the neutral, so the frame is
  // brightest where the mark sits and quietest where the text columns are.
  vec3 col = mix(uA, uB, clamp(f, 0.0, 1.0));
  col = mix(col, uC, clamp(d * 1.15, 0.0, 1.0));

  vec3 base = mix(uBg, col, uStrength);

  /* ---- Sweep ----
     One soft band travelling out from the centre, replacing the old filaments. Two
     slow out-of-phase sines multiplied, so it surfaces and fades rather than
     flickering; nothing here crosses 3Hz. */
  float band = pow(clamp(1.0 - abs(fract(d * 1.6 - t * 0.5) - 0.5) * 2.0, 0.0, 1.0), 6.0);
  float pulse = smoothstep(0.55, 1.0, sin(uTime * 0.31) * 0.5 + 0.5)
              * smoothstep(0.35, 1.0, sin(uTime * 0.17 + 2.1) * 0.5 + 0.5);

  // Dark: the sweep adds light. Light: it deposits ink, because adding light to bone
  // does nothing.
  vec3 veinCol = mix(vec3(0.03), uA, uDark);
  base = mix(base, veinCol, band * pulse * uVeins);

  /*
   * Luminance clamp. Everything above is free to move in hue; this is what stops it
   * moving in brightness, so body copy over the backdrop keeps a bounded contrast
   * ratio at every frame and every scroll position.
   *
   * The band is ASYMMETRIC, because the two directions are not equally safe. Text is
   * dark on bone and light on ink, so on light the danger is the backdrop getting
   * darker (closing on the type) and on dark it is the backdrop getting lighter.
   * Each theme therefore gets a wide allowance in its safe direction and a narrow one
   * in the direction that eats contrast — which is also why the field is free to look
   * quite different between themes rather than being one effect mirrored.
   */
  float lb = lum(uBg);
  float lc = lum(base);
  float target = clamp(lc, lb - uBandDown, lb + uBandUp);
  base *= lc > 0.0015 ? target / lc : 1.0;

  gl_FragColor = vec4(base, 1.0);
}
`

/** Matches --bg in each theme block of globals.css. */
const BG: Record<Theme, string> = { light: '#f4f1e9', dark: '#080808' }

/**
 * The field's second pole, opposite whatever the section accent is.
 *
 * This was hard-coded to #5c3bff. The backdrop is full-bleed and sits under every
 * page, so that one literal put a violet cast on the entire site regardless of the
 * section's own colour — a hue the brand does not contain. Then it was a second red,
 * which was on-brand but gave the two poles nothing to be different about.
 *
 * It is now the palette's one neutral. With a single accent the field's job is a
 * red-to-grey fall from the centre outward, not a two-colour blend: the mark sits in
 * warmth and the text columns at the edges sit on near-paper.
 */
const POLE = '#8c8880'

/**
 * How far the backdrop's luminance may stray from --bg, per theme and per direction.
 *
 * This is the contract that keeps text legible over a moving background, so it is
 * exported and asserted: test/contrast.test.mjs reads these numbers, computes the
 * worst-case backdrop each one allows, and checks every foreground token still clears
 * AA against it. Widening a band without re-checking the tokens fails the suite.
 *
 * The directions are not symmetric — on bone the risk is the backdrop DARKENING toward
 * the type, on ink it is the backdrop LIGHTENING toward it — so each theme gets room
 * only where room is safe.
 */
export const LUMA_BAND = {
  light: { down: 0.010, up: 0.050 },
  dark: { down: 0.002, up: 0.012 },
} as const

export function LightningField({
  color,
  theme,
  /** Fewer fbm octaves on weak hardware. */
  lightweight = false,
}: {
  color: string
  theme: Theme
  lightweight?: boolean
}) {
  const dark = theme === 'dark'

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        depthWrite: false,
        // Never occludes the scene in front of it, and never fights the depth buffer.
        depthTest: false,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uStrength: { value: 0.5 },
          uBandDown: { value: 0.014 },
          uBandUp: { value: 0.05 },
          uVeins: { value: 0.4 },
          uDark: { value: 1 },
          uOctaves: { value: 3 },
          uBg: { value: new THREE.Color() },
          uA: { value: new THREE.Color() },
          uB: { value: new THREE.Color() },
          uC: { value: new THREE.Color() },
        },
      }),
    []
  )

  useEffect(() => {
    const u = material.uniforms
    const accent = new THREE.Color(color)
    const bg = new THREE.Color(BG[theme])
    u.uBg.value.copy(bg)
    u.uDark.value = dark ? 1 : 0

    if (dark) {
      // Deep, saturated tints over ink. The crimson pole and the section accent read
      // as the two ends, with a near-black trough between them.
      u.uA.value.copy(bg).lerp(accent, 0.55)
      u.uB.value.copy(bg).lerp(new THREE.Color(POLE), 0.5)
      u.uC.value.copy(bg).lerp(accent, 0.18)
      u.uStrength.value = 0.9
      /*
       * Dark can fall away from --bg freely but must barely rise: --fg-muted (#a3a099)
       * sits at 7.30:1 on ink, and letting the backdrop climb 0.03 in luminance
       * already spends that down to 4.89:1. Above that it breaks AA.
       */
      u.uBandDown.value = LUMA_BAND.dark.down
      u.uBandUp.value = LUMA_BAND.dark.up
      u.uVeins.value = 0.5
    } else {
      // Pale washes on bone. The accents are lifted toward the page colour first,
      // because at full saturation orange on bone is a poster, not a backdrop.
      // Barely-there washes. The luminance clamp pins BRIGHTNESS but says nothing
      // about saturation, and at 0.3 toward the accent this read as a salmon poster
      // rather than atmosphere. On an editorial brand the backdrop should register
      // as a tint you notice only when it moves.
      u.uA.value.copy(bg).lerp(accent, 0.10)
      u.uB.value.copy(bg).lerp(new THREE.Color(POLE), 0.08)
      u.uC.value.copy(bg).lerp(new THREE.Color('#b7b8b5'), 0.26)
      u.uStrength.value = 0.9
      /*
       * Mirror image on bone: brightening is free, darkening is what closes on the
       * type. 0.014 down holds --fg-faint at 4.52:1, which is the tightest ratio on
       * the page and therefore the one that sets the limit.
       */
      u.uBandDown.value = LUMA_BAND.light.down
      u.uBandUp.value = LUMA_BAND.light.up
      u.uVeins.value = 0.28
    }
    material.needsUpdate = true
  }, [material, color, theme, dark])

  useEffect(() => {
    material.uniforms.uOctaves.value = lightweight ? 2 : 3
  }, [material, lightweight])

  useEffect(() => () => material.dispose(), [material])

  useFrame((_, delta) => {
    const u = material.uniforms
    // Clamped so a restored background tab does not jump the flow forward by seconds.
    u.uTime.value += Math.min(delta, 0.05)
    u.uProgress.value = sceneMotion.progress
  })

  /*
   * Parented to nothing and placed far back with depthTest off, so the camera dolly
   * and roll move across it as parallax while it always covers the frame. Sized well
   * past the frustum at this distance so no aspect ratio can reveal an edge.
   */
  return (
    <mesh position={[0, 0, -26]} material={material} frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[140, 90]} />
    </mesh>
  )
}
