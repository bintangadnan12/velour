'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type ScrollState = {
  sceneIndex: number
  inHold:     boolean
  velocity:   number
  alpha:      number
  progress:   number
}

// ── Camera: z=9, fov=58 → visible at z=0 ≈ 10.2w × 6.1h ────────────────────
// Shoe occupies roughly center 60%×65% → clear zone: x∈[-3,3], y∈[-2,2]
// All particles spawn OUTSIDE this zone — in the peripheral frame only.

const W = 5.1   // half visible width
const H = 3.05  // half visible height
const CX = 2.8  // clear zone half-width  (shoe area)
const CY = 1.9  // clear zone half-height

// ── Soft glow shader ──────────────────────────────────────────────────────────
const VERT = /* glsl */`
attribute float aSize;
attribute vec3  aColor;
attribute float aOpacity;
varying   vec3  vColor;
varying   float vAlpha;
uniform   float uGlobal;

void main() {
  vColor = aColor;
  vAlpha = aOpacity * uGlobal;
  vec4 mv = modelViewMatrix * vec4(position, 1.);
  gl_Position  = projectionMatrix * mv;
  gl_PointSize = aSize * (320. / -mv.z);
}
`
const FRAG = /* glsl */`
varying vec3  vColor;
varying float vAlpha;

void main() {
  vec2  uv = gl_PointCoord - .5;
  float d  = dot(uv, uv);
  if (d > .25) discard;
  float g = exp(-d * 9.) * (1. - d * 3.8);
  gl_FragColor = vec4(vColor, g * vAlpha);
}
`

// ── Colors ────────────────────────────────────────────────────────────────────
const ORANGE  = new THREE.Color(0xFF7433)
const GOLD    = new THREE.Color(0xFFB84A)
const BLUE    = new THREE.Color(0x3B8BDB)
const COBALT  = new THREE.Color(0x1A5FAD)
const WHITE   = new THREE.Color(0xFFF8F0)

// ── Spawn a point in the peripheral frame (NOT over the shoe) ────────────────
function peripheralPoint(): [number, number, number] {
  // 4 zones: bottom strip, top strip, left column, right column
  // bottom & top are wider so corners get double-covered
  const zone = Math.random()
  if (zone < 0.38) {
    // bottom strip (rising sparks from shoe sole)
    return [
      (Math.random() - 0.5) * W * 2,
      -H + Math.random() * (H - CY),
      0,
    ]
  } else if (zone < 0.56) {
    // top strip (atmospheric drift)
    return [
      (Math.random() - 0.5) * W * 2,
      CY + Math.random() * (H - CY),
      0,
    ]
  } else if (zone < 0.78) {
    // left column
    return [
      -W + Math.random() * (W - CX),
      (Math.random() - 0.5) * H * 2,
      0,
    ]
  } else {
    // right column
    return [
      CX + Math.random() * (W - CX),
      (Math.random() - 0.5) * H * 2,
      0,
    ]
  }
}

// ── Rising sparks from below shoe ─────────────────────────────────────────────
function bottomSpark(): [number, number, number] {
  return [
    (Math.random() - 0.5) * CX * 1.8,   // centered under shoe
    -H + Math.random() * 0.6,            // just off bottom edge
    0,
  ]
}

// ── Particle data builder ─────────────────────────────────────────────────────
function buildGeo(count: number, mode: 'peripheral' | 'sparks'): {
  geo:   THREE.BufferGeometry
  vel:   Float32Array     // x,y velocity per particle
  life:  Float32Array     // random phase offset
} {
  const pos  = new Float32Array(count * 3)
  const col  = new Float32Array(count * 3)
  const sz   = new Float32Array(count)
  const op   = new Float32Array(count)
  const vel  = new Float32Array(count * 2)
  const life = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const [x, y, z] = mode === 'sparks' ? bottomSpark() : peripheralPoint()
    pos[i*3] = x; pos[i*3+1] = y; pos[i*3+2] = z

    // Color: bottom=orange/gold, top=blue, sides=mix
    const isBottom = y < -CY
    const isTop    = y >  CY
    const c = isBottom
      ? (Math.random() < 0.6 ? ORANGE : GOLD)
      : isTop
        ? (Math.random() < 0.6 ? COBALT : BLUE)
        : (Math.random() < 0.5
            ? WHITE.clone().lerp(GOLD, Math.random() * 0.5)
            : BLUE.clone().lerp(WHITE, Math.random() * 0.5))
    col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b

    sz[i]   = mode === 'sparks' ? 0.22 + Math.random() * 0.28 : 0.14 + Math.random() * 0.2
    op[i]   = 0.3 + Math.random() * 0.55

    // Drift direction
    vel[i*2]   = (Math.random() - 0.5) * 0.006   // x drift (gentle)
    vel[i*2+1] = mode === 'sparks'
      ? 0.012 + Math.random() * 0.022             // sparks always rise
      : (Math.random() - 0.38) * 0.005            // peripheral gentle upward bias

    life[i] = Math.random()   // phase for opacity pulsing
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos,  3))
  geo.setAttribute('aColor',   new THREE.BufferAttribute(col,  3))
  geo.setAttribute('aSize',    new THREE.BufferAttribute(sz,   1))
  geo.setAttribute('aOpacity', new THREE.BufferAttribute(op,   1))
  return { geo, vel, life }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PERIPHERAL DRIFT — ambient particles in the frame border, never over shoe
// ═══════════════════════════════════════════════════════════════════════════════
function PeripheralDrift({ st }: { st: React.MutableRefObject<ScrollState> }) {
  const COUNT = 280
  const { geo, vel, life } = useMemo(() => buildGeo(COUNT, 'peripheral'), [])
  const mat  = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG,
    uniforms: { uGlobal: { value: 0 } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }), [])
  const t = useRef(0)

  useFrame((_, dt) => {
    const vel2 = Math.abs(st.current.velocity) * 200
    t.current += dt

    const posArr = geo.attributes.position.array as Float32Array
    const opArr  = geo.attributes.aOpacity.array  as Float32Array

    for (let i = 0; i < COUNT; i++) {
      posArr[i*3]   += vel[i*2]   * (1 + vel2 * 0.15)
      posArr[i*3+1] += vel[i*2+1] * (1 + vel2 * 0.08)

      // Respawn if drifted outside visible area
      if (
        posArr[i*3+1] > H * 1.1 ||
        Math.abs(posArr[i*3]) > W * 1.1
      ) {
        const [x, y] = peripheralPoint()
        posArr[i*3]   = x
        posArr[i*3+1] = y
        life[i] = 0
      }

      // Gentle opacity pulse — twinkle
      const phase = (t.current * 0.4 + life[i] * Math.PI * 2) % (Math.PI * 2)
      opArr[i] = 0.2 + Math.sin(phase) * 0.18 + Math.random() * 0.04
    }
    geo.attributes.position.needsUpdate = true
    geo.attributes.aOpacity.needsUpdate = true

    // Global fade in with progress
    const target = Math.min(1, st.current.progress * 8)
    mat.uniforms.uGlobal.value +=
      (target - mat.uniforms.uGlobal.value) * 0.05
  })

  return <points geometry={geo} material={mat} />
}

// ═══════════════════════════════════════════════════════════════════════════════
// RISING SPARKS — orange/gold sparks rising from shoe sole area
// ═══════════════════════════════════════════════════════════════════════════════
function RisingSparks({ st }: { st: React.MutableRefObject<ScrollState> }) {
  const COUNT = 120
  const { geo, vel, life } = useMemo(() => buildGeo(COUNT, 'sparks'), [])
  const mat  = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG,
    uniforms: { uGlobal: { value: 0 } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }), [])
  const t = useRef(0)

  useFrame((_, dt) => {
    const vel2 = Math.abs(st.current.velocity) * 200
    t.current += dt

    const posArr = geo.attributes.position.array as Float32Array
    const opArr  = geo.attributes.aOpacity.array  as Float32Array
    const szArr  = geo.attributes.aSize.array     as Float32Array

    for (let i = 0; i < COUNT; i++) {
      // Rise upward + gentle sideways drift
      posArr[i*3]   += vel[i*2]
      posArr[i*3+1] += vel[i*2+1] * (1 + vel2 * 0.25)

      // Fade out as spark rises toward shoe center — MUST NOT enter shoe zone
      const y = posArr[i*3+1]
      const distToShoeBottom = -CY - y   // positive = below shoe
      const fadeStart = -CY - 0.5         // start fading 0.5 units below shoe

      if (y > -CY - 0.1) {
        // Spark hit the shoe zone boundary — respawn at bottom
        const [x, yNew] = bottomSpark()
        posArr[i*3]   = x
        posArr[i*3+1] = yNew
        life[i] = 0
      }

      // Fade out near top of spark zone
      const fade = Math.max(0, (fadeStart - y) / (H - CY))
      opArr[i] = (0.6 + Math.random() * 0.3) * fade
      szArr[i] = (0.28 + Math.random() * 0.1) * (0.5 + fade * 0.5)
    }
    geo.attributes.position.needsUpdate = true
    geo.attributes.aOpacity.needsUpdate = true
    geo.attributes.aSize.needsUpdate    = true

    // Intensity: strongest during hold (freeze scenes), present during scrub too
    const base   = 0.35 + st.current.progress * 0.3
    const target = st.current.inHold ? base * 1.0 : base * 0.55
    mat.uniforms.uGlobal.value +=
      (target - mat.uniforms.uGlobal.value) * 0.06
  })

  return <points geometry={geo} material={mat} />
}

// ═══════════════════════════════════════════════════════════════════════════════
// CORNER GLINTS — bright accent sparkles in the 4 corners
// ═══════════════════════════════════════════════════════════════════════════════
const CORNER_VERT = /* glsl */`
uniform float uTime;
uniform float uOpacity;
attribute float aPhase;
attribute float aRadius;
attribute float aSpeed;
attribute vec3 aColor;
varying vec3 vColor;
varying float vAlpha;

void main() {
  float a   = aPhase + uTime * aSpeed;
  vec3  pos = position + vec3(cos(a)*aRadius, sin(a)*aRadius*0.5, 0.);
  vColor    = aColor;
  vAlpha    = (.5 + .5*sin(uTime*aSpeed*1.7+aPhase)) * uOpacity;
  vec4 mv   = modelViewMatrix * vec4(pos, 1.);
  gl_Position  = projectionMatrix * mv;
  gl_PointSize = (.08 + aRadius*.02) * (320./-mv.z);
}
`
const CORNER_FRAG = /* glsl */`
varying vec3  vColor;
varying float vAlpha;
void main(){
  vec2  uv=gl_PointCoord-.5;
  float d=dot(uv,uv);
  if(d>.25)discard;
  gl_FragColor=vec4(vColor, exp(-d*10.)*vAlpha);
}
`

function CornerGlints({ st }: { st: React.MutableRefObject<ScrollState> }) {
  const COUNT = 60   // 15 per corner
  const data  = useMemo(() => {
    const geo    = new THREE.BufferGeometry()
    const pos    = new Float32Array(COUNT * 3)
    const col    = new Float32Array(COUNT * 3)
    const phase  = new Float32Array(COUNT)
    const radius = new Float32Array(COUNT)
    const speed  = new Float32Array(COUNT)

    const corners = [
      [-W + 0.4, H - 0.4],
      [ W - 0.4, H - 0.4],
      [-W + 0.4, -H + 0.4],
      [ W - 0.4, -H + 0.4],
    ]

    for (let i = 0; i < COUNT; i++) {
      const ci  = Math.floor(i / (COUNT / 4))
      const [cx, cy] = corners[ci]
      pos[i*3] = cx + (Math.random()-0.5)*1.2
      pos[i*3+1] = cy + (Math.random()-0.5)*0.9
      pos[i*3+2] = 0

      const c = ci < 2
        ? GOLD.clone().lerp(WHITE, Math.random())   // top corners: gold/white
        : BLUE.clone().lerp(COBALT, Math.random())  // bottom corners: blue
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b

      phase[i]  = Math.random() * Math.PI * 2
      radius[i] = 0.05 + Math.random() * 0.35
      speed[i]  = 0.3 + Math.random() * 0.6
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos,    3))
    geo.setAttribute('aColor',   new THREE.BufferAttribute(col,    3))
    geo.setAttribute('aPhase',   new THREE.BufferAttribute(phase,  1))
    geo.setAttribute('aRadius',  new THREE.BufferAttribute(radius, 1))
    geo.setAttribute('aSpeed',   new THREE.BufferAttribute(speed,  1))
    return { geo }
  }, [])

  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader:   CORNER_VERT,
    fragmentShader: CORNER_FRAG,
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }), [])

  useFrame((state, dt) => {
    mat.uniforms.uTime.value += dt
    const target = Math.min(st.current.progress * 5, 0.8) * (st.current.inHold ? 1 : 0.5)
    mat.uniforms.uOpacity.value +=
      (target - mat.uniforms.uOpacity.value) * 0.055
  })

  return <points geometry={data.geo} material={mat} />
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
function Scene({ st }: { st: React.MutableRefObject<ScrollState> }) {
  return (
    <>
      <PeripheralDrift st={st} />
      <RisingSparks    st={st} />
      <CornerGlints    st={st} />
    </>
  )
}

export function WebGLOverlay({ stateRef }: { stateRef: React.MutableRefObject<ScrollState> }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
      <Canvas
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 9], fov: 58, near: 0.1, far: 60 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Scene st={stateRef} />
      </Canvas>
    </div>
  )
}
