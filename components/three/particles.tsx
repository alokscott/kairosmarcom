'use client'

import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { mulberry32 } from './quality'
import { sceneMotion, type Theme } from './store'

/**
 * GPU particle fields.
 *
 * Every particle's motion is computed in the vertex shader from a time uniform and
 * a handful of per-particle seed attributes. Nothing is written back to a buffer, so
 * there is no ping-pong FBO and no per-frame CPU work — the draw call is the same
 * whether there are 3,500 particles or 24,000, and the count becomes a fill-rate
 * question the quality tier can answer.
 *
 * ─── Why this is not simply "the same effect, recoloured" for light mode ───
 *
 * Cosmic and flame imagery is built on ADDITIVE blending: it adds light to what is
 * behind it. That is why every galaxy/ember demo on the web sits on black. On bone
 * (#F4F1E9, relative luminance 0.88) there is almost no headroom left to add to, so
 * an additive field is mathematically close to invisible — the same trap that made
 * the old foreground motes disappear.
 *
 * So the two themes composite in opposite directions. Dark mode adds light: emissive
 * particles over ink, which reads as a nebula. Light mode subtracts it: the same
 * geometry and the same motion drawn as ink pigment settling on paper. One system,
 * two legible results, rather than one result that only works on one background.
 */

export type FieldVariant = 'cosmos' | 'flow' | 'embers'

const VARIANT_ID: Record<FieldVariant, number> = { cosmos: 0, flow: 1, embers: 2 }

/* ------------------------------------------------------------------ */
/* Shaders                                                             */
/* ------------------------------------------------------------------ */

/**
 * Ashima / Stefan Gustavson simplex noise, MIT licensed, trimmed to the 3D case.
 * Public-domain-equivalent and the standard implementation — worth carrying inline
 * rather than adding a dependency for sixty lines of GLSL.
 */
const SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uIntensity;
uniform float uSize;
uniform float uVariant;
uniform vec2  uPointer;

attribute vec4 aSeed;
attribute float aScale;

varying float vAlpha;
varying float vTint;

${SIMPLEX}

/*
 * Three noise samples read as a vector field. A true curl would need the finite
 * differences of a vector potential — six potential() calls, eighteen snoise calls
 * per vertex — which at 24k particles costs more than the swirl is worth. This is
 * not divergence-free, so the field has faint sources and sinks; at this scale and
 * opacity that is indistinguishable from curl, and it runs six times cheaper.
 */
vec3 flowField(vec3 p) {
  return vec3(snoise(p), snoise(p + 19.19), snoise(p - 33.71));
}

void main() {
  vec3 p;
  float alpha = 1.0;
  float tint = aSeed.w;

  if (uVariant < 0.5) {
    /* ---- COSMOS: a logarithmic spiral disc with differential rotation ---- */
    float r = aSeed.x;
    // Inner particles complete an orbit faster than outer ones. That velocity
    // gradient is what winds the arms over time instead of turning the whole disc
    // like a solid plate — it is the entire reason this reads as a galaxy.
    float spin = uTime * 0.10 / (0.28 + r);
    // More winding than a quarter-turn, or the arms read as four straight spokes.
    float ang = aSeed.y * 6.2831853 + r * 4.2 + spin;
    /*
     * A real disc, not a lens. At (1-r)*0.5 the centre was ±0.5 units thick against a
     * radius of 1.0 — half as deep as it was wide — so the core filled in as a solid
     * ball and swallowed the arms exactly where they are tightest.
     */
    float thickness = (1.0 - r) * 0.10 + 0.02;
    /*
     * Built in XY — the plane FACING the camera — not XZ. The camera sits on +Z
     * looking at the origin, so a disc laid out in XZ is seen edge-on and the arms
     * collapse into a flat band with no spiral visible at all.
     */
    vec3 disc = vec3(cos(ang) * r, sin(ang) * r, aSeed.z * thickness);
    // Then tilted off-axis, so it reads as a disc in space rather than a flat decal.
    const float TILT = 0.42;
    disc = vec3(
      disc.x,
      disc.y * cos(TILT) - disc.z * sin(TILT),
      disc.y * sin(TILT) + disc.z * cos(TILT)
    );
    p = disc * 5.2;
    // Scroll draws the disc into a tighter, brighter core.
    p *= mix(1.0, 0.62, uProgress);
    // Light turbulence only — enough to soften the arm edges, not to erase them.
    p += flowField(p * 0.18 + uTime * 0.02) * 0.16;
    tint = r;
    alpha = smoothstep(1.02, 0.28, r) * 0.8 + 0.2;
  } else if (uVariant < 1.5) {
    /* ---- FLOW: particles dragged through a turbulent field ---- */
    vec3 base = position;
    vec3 n = flowField(base * 0.30 + vec3(0.0, uTime * 0.045, uTime * 0.02));
    p = base + n * (1.7 + uProgress * 0.9);
    p.y += sin(uTime * 0.22 + aSeed.x * 6.2831853) * 0.22;
    tint = clamp(length(n) * 0.6, 0.0, 1.0);
    alpha = 0.55 + 0.45 * tint;
  } else {
    /* ---- EMBERS: a rising column, wrapping rather than respawning ---- */
    // fract() gives every particle its own phase through one shared cycle, so the
    // column is continuously populated without any CPU-side lifetime bookkeeping.
    float life = fract(aSeed.x + uTime * (0.045 + aSeed.y * 0.055));
    p = position;
    p.y = mix(-3.0, 3.6, life);
    float wob = 0.30 + life * 1.15;
    p.x += snoise(vec3(p.y * 0.38, aSeed.z * 12.0, uTime * 0.16)) * wob;
    p.z += snoise(vec3(aSeed.w * 12.0, p.y * 0.38, uTime * 0.16)) * wob;
    // Converge toward the axis as they climb, the way a flame necks in.
    p.xz *= mix(1.0, 0.55, life);
    tint = life;
    // Fade in off the floor and out at the ceiling so nothing pops at the wrap.
    alpha = smoothstep(0.0, 0.16, life) * (1.0 - smoothstep(0.62, 1.0, life));
  }

  // Pointer parallax, scaled by depth so near particles lead far ones.
  p.xy += uPointer * (0.35 + aSeed.z * 0.5);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  /*
   * Perspective attenuation: -mv.z is view depth, so distant particles shrink.
   * The constant is calibrated to this camera (which sits at z≈9.6 and dollies to
   * 5.8), giving roughly 3–8px points. It is not a free parameter — at 300.0 each
   * point covered ~80px and twenty thousand of them composited into one opaque slab
   * instead of a field.
   */
  gl_PointSize = uSize * aScale * (16.0 / max(-mv.z, 0.1));

  /*
   * Deliberately low per-particle alpha. Both blend modes ACCUMULATE where sprites
   * overlap, and in the core of the spiral hundreds overlap per pixel — so opacity
   * here is a budget shared across the stack, not the visibility of one mote.
   */
  vAlpha = alpha * uIntensity * 0.42;
  vTint = tint;
}
`

const FRAGMENT = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uDark;

varying float vAlpha;
varying float vTint;

void main() {
  // Round the square point sprite and give it a soft edge, so the field reads as
  // motes rather than as a screen full of little squares.
  vec2 d = gl_PointCoord - 0.5;
  float dist = dot(d, d);
  if (dist > 0.25) discard;
  float falloff = smoothstep(0.25, 0.0, dist);

  vec3 col = mix(uColorA, uColorB, vTint);

  /*
   * Dark: additive, so overlapping particles bloom toward the core.
   * Light: normal alpha over bone, so overlapping particles DARKEN toward it.
   * The falloff is sharpened on light because ink on paper has a harder edge than
   * a glow does, and a soft dark halo just reads as smudge.
   */
  float a = vAlpha * mix(pow(falloff, 1.6), falloff, uDark);
  gl_FragColor = vec4(col, a);
}
`

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function ParticleField({
  variant = 'cosmos',
  color,
  theme,
  count = 8000,
  intensity = 1,
  size = 2.4,
  progress,
}: {
  variant?: FieldVariant
  /** Section accent, in hex. */
  color: string
  theme: Theme
  count?: number
  intensity?: number
  size?: number
  /** Scroll progress getter, read per frame without re-rendering. */
  progress?: () => number
}) {
  const dark = theme === 'dark'

  // Seeded, so the field is identical between server-adjacent renders and reloads —
  // a scene that reshuffles on every mount reads as a glitch, not as variety.
  const geometry = useMemo(() => {
    const rand = mulberry32(variant === 'cosmos' ? 1337 : variant === 'flow' ? 4242 : 9001)
    const position = new Float32Array(count * 3)
    const seed = new Float32Array(count * 4)
    const scale = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      if (variant === 'cosmos') {
        // Radius biased outward so the arms carry more mass than the hub.
        seed[i * 4] = Math.pow(rand(), 0.62)
        /*
         * Snapped to one of four arms, then jittered. The jitter has to stay small
         * relative to the arm spacing (1/4 turn): at ±0.045 it was over a third of
         * the gap, which smeared the four arms back into an even disc.
         */
        seed[i * 4 + 1] = (Math.floor(rand() * 4) / 4 + (rand() - 0.5) * 0.03) % 1
        seed[i * 4 + 2] = (rand() - 0.5) * 2
        seed[i * 4 + 3] = rand()
      } else if (variant === 'flow') {
        position[i * 3] = (rand() - 0.5) * 11
        position[i * 3 + 1] = (rand() - 0.5) * 7
        position[i * 3 + 2] = (rand() - 0.5) * 7
        seed[i * 4] = rand()
        seed[i * 4 + 1] = rand()
        seed[i * 4 + 2] = rand()
        seed[i * 4 + 3] = rand()
      } else {
        // A disc footprint, so the column has a round base rather than a square one.
        const a = rand() * Math.PI * 2
        const r = Math.sqrt(rand()) * 1.5
        position[i * 3] = Math.cos(a) * r
        position[i * 3 + 1] = 0
        position[i * 3 + 2] = Math.sin(a) * r
        seed[i * 4] = rand()
        seed[i * 4 + 1] = rand()
        seed[i * 4 + 2] = rand()
        seed[i * 4 + 3] = rand()
      }
      scale[i] = 0.5 + rand() * 1.1
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(position, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4))
    g.setAttribute('aScale', new THREE.BufferAttribute(scale, 1))
    // The vertex shader moves particles far outside their authored bounds, so an
    // automatic bounding sphere would cull the field the moment it drifted.
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 24)
    return g
  }, [variant, count])

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uIntensity: { value: intensity },
        uSize: { value: size },
        uVariant: { value: VARIANT_ID[variant] },
        uPointer: { value: new THREE.Vector2() },
        uColorA: { value: new THREE.Color() },
        uColorB: { value: new THREE.Color() },
        uDark: { value: 1 },
      },
    })
    // Colour and blending are set in the theme effect below, so a theme change does
    // not recompile the shader.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant])

  // Theme drives compositing, not just hue — see the note at the top of this file.
  useEffect(() => {
    const accent = new THREE.Color(color)
    const u = material.uniforms

    if (dark) {
      u.uColorA.value.copy(accent)
      // Toward bone at the rim, so the field cools outward instead of flattening.
      u.uColorB.value.copy(accent).lerp(new THREE.Color('#f4f1e9'), 0.55)
      u.uDark.value = 1
      material.blending = THREE.AdditiveBlending
    } else {
      // Pull the accent toward ink so it can register as pigment on bone. Lime is
      // the proof case: #C8FF3D is 1.03:1 against the light background untouched.
      u.uColorA.value.copy(accent).lerp(new THREE.Color('#080808'), 0.55)
      u.uColorB.value.copy(accent).lerp(new THREE.Color('#080808'), 0.2)
      u.uDark.value = 0
      material.blending = THREE.NormalBlending
    }
    material.needsUpdate = true
  }, [material, color, dark])

  useEffect(() => {
    material.uniforms.uIntensity.value = intensity
    material.uniforms.uSize.value = size
  }, [material, intensity, size])

  // Owned here, so they are released when the preset swaps rather than accumulating
  // one geometry and one shader program per scene the visitor scrolls through.
  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => material.dispose(), [material])

  useFrame((_, delta) => {
    const u = material.uniforms
    // Clamped: a backgrounded tab resumes with a multi-second delta, which would
    // otherwise teleport the whole field on the first frame back.
    u.uTime.value += Math.min(delta, 0.05)
    u.uProgress.value = progress ? progress() : sceneMotion.progress
    u.uPointer.value.set(sceneMotion.pointerX * 0.5, sceneMotion.pointerY * 0.35)
  })

  return <points geometry={geometry} material={material} frustumCulled={false} />
}
