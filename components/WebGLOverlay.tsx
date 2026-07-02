'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type ScrollState = {
  sceneIndex: number
  inHold:     boolean
  velocity:   number
  alpha:      number
  progress:   number  // raw 0–1 total scroll progress
}

const COUNT = 1800   // number of particles

// ── Particle shader: soft circular glow with per-vertex color + size ──────────
const VERT = /* glsl */`
attribute float aSize;
attribute vec3  aColor;
varying   vec3  vColor;
varying   float vAlpha;
uniform   float uOpacity;

void main() {
  vColor = aColor;
  vec4 mvp = modelViewMatrix * vec4(position, 1.0);
  gl_Position  = projectionMatrix * mvp;
  gl_PointSize = aSize * (380.0 / -mvp.z);
  vAlpha = uOpacity;
}
`
const FRAG = /* glsl */`
varying vec3  vColor;
varying float vAlpha;

void main() {
  vec2  uv = gl_PointCoord - 0.5;
  float d  = dot(uv, uv);
  if (d > 0.25) discard;
  // Soft exponential glow
  float glow = exp(-d * 10.0);
  gl_FragColor = vec4(vColor, glow * vAlpha);
}
`

// ── Color helpers ─────────────────────────────────────────────────────────────
const ORANGE = new THREE.Color(0xFF7433)   // warm orange
const GOLD   = new THREE.Color(0xFFB84A)   // golden yellow
const WHITE  = new THREE.Color(0xFFF8F0)   // warm white
const BLUE   = new THREE.Color(0x3B8BDB)   // electric blue
const DEEP   = new THREE.Color(0x1A4A8A)   // deep blue

function pickColor(t: number): THREE.Color {
  // t=0 → orange core, t=0.5 → white, t=1 → deep blue
  if (t < 0.35)  return ORANGE.clone().lerp(GOLD,  t / 0.35)
  if (t < 0.55)  return GOLD.clone().lerp(WHITE,   (t - 0.35) / 0.2)
  if (t < 0.78)  return WHITE.clone().lerp(BLUE,   (t - 0.55) / 0.23)
  return BLUE.clone().lerp(DEEP, (t - 0.78) / 0.22)
}

// ── Build 5 state position arrays ─────────────────────────────────────────────
function buildStates(seeds: Float32Array): Float32Array[] {
  // Each state is COUNT*3 floats
  const s: Float32Array[] = Array.from({ length: 5 }, () => new Float32Array(COUNT * 3))

  for (let i = 0; i < COUNT; i++) {
    // Deterministic per-particle random using seeds
    const rx  = seeds[i*4]
    const ry  = seeds[i*4+1]
    const rz  = seeds[i*4+2]
    const rw  = seeds[i*4+3]

    // ── State 0: single point of light (tiny jitter) ────────────────────────
    s[0][i*3]   = (rx - 0.5) * 0.08
    s[0][i*3+1] = (ry - 0.5) * 0.08
    s[0][i*3+2] = (rz - 0.5) * 0.08

    // ── State 1: nebula burst — spherical cloud ─────────────────────────────
    const nb_phi   = Math.acos(2 * rx - 1)
    const nb_theta = ry * Math.PI * 2
    const nb_r     = 0.3 + Math.pow(rz, 0.55) * 4.8
    s[1][i*3]   = nb_r * Math.sin(nb_phi) * Math.cos(nb_theta)
    s[1][i*3+1] = nb_r * Math.cos(nb_phi) * 0.85
    s[1][i*3+2] = nb_r * Math.sin(nb_phi) * Math.sin(nb_theta)

    // ── State 2: disk forming — flatten Y axis ──────────────────────────────
    const dk_theta = rx * Math.PI * 2
    const dk_r     = 0.2 + Math.pow(ry, 0.5) * 4.5
    s[2][i*3]   = Math.cos(dk_theta) * dk_r + (rz - 0.5) * 0.6
    s[2][i*3+1] = (rw - 0.5) * 0.35 * (1 - dk_r / 4.5)
    s[2][i*3+2] = Math.sin(dk_theta) * dk_r + (rz - 0.5) * 0.6

    // ── State 3: proto-galaxy — spiral starts emerging ──────────────────────
    const arm3    = i % 3
    const pg_r    = 0.15 + Math.pow(rz, 0.5) * 4.2
    const pg_base = (arm3 / 3) * Math.PI * 2
    const pg_wind = pg_base + pg_r * 0.5 + (rx - 0.5) * 1.1  // loose wind
    const pg_thick = (1 - pg_r / 4.2) * 0.9
    s[3][i*3]   = Math.cos(pg_wind) * pg_r + (rx - 0.5) * pg_thick
    s[3][i*3+1] = (ry - 0.5) * 0.18 * (1 - pg_r / 4.2)
    s[3][i*3+2] = Math.sin(pg_wind) * pg_r + (rz - 0.5) * pg_thick

    // ── State 4: full galaxy — tight 3-arm spiral ───────────────────────────
    const arm4    = i % 3
    const gx_r    = 0.12 + Math.pow(rx, 0.45) * 4.5
    const gx_base = (arm4 / 3) * Math.PI * 2
    const gx_wind = gx_base + gx_r * 0.75 + (ry - 0.5) * 0.28  // tight wind
    const gx_thick = (1 - gx_r / 4.5) * 0.22
    s[4][i*3]   = Math.cos(gx_wind) * gx_r + (ry - 0.5) * gx_thick
    s[4][i*3+1] = (rz - 0.5) * 0.09 * (1 - gx_r / 4.5)
    s[4][i*3+2] = Math.sin(gx_wind) * gx_r + (rw - 0.5) * gx_thick
  }

  return s
}

// ── Inner Three.js component ───────────────────────────────────────────────────
function CosmicSwarm({ st }: { st: React.MutableRefObject<ScrollState> }) {
  const meshRef = useRef<THREE.Points>(null)

  // ── Stable per-particle seeds (4 randoms each) ───────────────────────────
  const seeds = useMemo(() => {
    const s = new Float32Array(COUNT * 4)
    for (let i = 0; i < COUNT * 4; i++) s[i] = Math.random()
    return s
  }, [])

  // ── Precomputed state positions ───────────────────────────────────────────
  const states = useMemo(() => buildStates(seeds), [seeds])

  // ── Per-particle galaxy-state radius (0→1) for color mapping ─────────────
  const galaxyT = useMemo(() => {
    const t = new Float32Array(COUNT)
    const s4 = states[4]
    for (let i = 0; i < COUNT; i++) {
      const x = s4[i*3], y = s4[i*3+1], z = s4[i*3+2]
      t[i] = Math.min(1, Math.sqrt(x*x + y*y + z*z) / 4.5)
    }
    return t
  }, [states])

  // ── Geometry ──────────────────────────────────────────────────────────────
  const geo = useMemo(() => {
    const g     = new THREE.BufferGeometry()
    const pos   = new Float32Array(COUNT * 3)     // updated each frame
    const col   = new Float32Array(COUNT * 3)     // updated per progress
    const sizes = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      const c = pickColor(galaxyT[i])
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b
      // Core particles bigger, outer smaller
      sizes[i] = galaxyT[i] < 0.15
        ? 0.38 + Math.random() * 0.4   // bright core
        : 0.10 + Math.random() * 0.22  // arm particles
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos,   3))
    g.setAttribute('aColor',   new THREE.BufferAttribute(col,   3))
    g.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1))
    return g
  }, [galaxyT])

  // ── Shader material ───────────────────────────────────────────────────────
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader:   VERT,
    fragmentShader: FRAG,
    uniforms: { uOpacity: { value: 0 } },
    transparent:  true,
    depthWrite:   false,
    blending:     THREE.AdditiveBlending,
  }), [])

  // ── Lerp workspace ────────────────────────────────────────────────────────
  const rotY    = useRef(0)
  const opSmooth = useRef(0)

  useFrame((state, dt) => {
    if (!meshRef.current) return

    const { progress, inHold, velocity } = st.current
    const vel = Math.abs(velocity) * 250

    // ── Target opacity: fully visible once loaded (after preloader) ──────────
    const targetOp = Math.min(1, progress > 0.01 ? 0.9 : 0)
    opSmooth.current = opSmooth.current + (targetOp - opSmooth.current) * 0.04
    mat.uniforms.uOpacity.value = opSmooth.current

    // ── Map scroll progress (0→1) to state blend ─────────────────────────────
    // 0.00–0.18  → state 0 (point) → state 1 (nebula)
    // 0.18–0.38  → state 1 → state 2 (disk)
    // 0.38–0.58  → state 2 → state 3 (proto-spiral)
    // 0.58–0.80  → state 3 → state 4 (galaxy arms)
    // 0.80–1.00  → state 4 fully formed + faster rotation
    const BREAKS = [0, 0.18, 0.38, 0.58, 0.80, 1.0]
    let stateA = 0, stateB = 1, blend = 0
    for (let s = 0; s < BREAKS.length - 1; s++) {
      if (progress >= BREAKS[s] && progress < BREAKS[s + 1]) {
        stateA = Math.min(s, 4)
        stateB = Math.min(s + 1, 4)
        blend  = (progress - BREAKS[s]) / (BREAKS[s + 1] - BREAKS[s])
        // Ease-in-out
        blend  = blend < 0.5 ? 2 * blend * blend : 1 - Math.pow(-2 * blend + 2, 2) / 2
        break
      }
    }
    if (progress >= 0.80) {
      stateA = stateB = 4
      blend  = 0
    }

    // ── Update particle positions via lerp ───────────────────────────────────
    const posArr = geo.attributes.position.array as Float32Array
    const sa     = states[stateA]
    const sb     = states[stateB]
    const inv    = 1 - blend
    for (let i = 0; i < COUNT; i++) {
      posArr[i*3]   = sa[i*3]   * inv + sb[i*3]   * blend
      posArr[i*3+1] = sa[i*3+1] * inv + sb[i*3+1] * blend
      posArr[i*3+2] = sa[i*3+2] * inv + sb[i*3+2] * blend
    }
    geo.attributes.position.needsUpdate = true

    // ── Update colors: transition from orange (start) to blue (galaxy) ────────
    const colArr = geo.attributes.aColor.array as Float32Array
    for (let i = 0; i < COUNT; i++) {
      // Blend toward galaxy T as scroll progresses
      const t = galaxyT[i] * progress + (1 - progress) * 0
      const c = pickColor(t)
      colArr[i*3] = c.r; colArr[i*3+1] = c.g; colArr[i*3+2] = c.b
    }
    geo.attributes.aColor.needsUpdate = true

    // ── Rotation: slow drift throughout, faster at finale ────────────────────
    const rotSpeed = 0.04 + progress * 0.14 + vel * 0.3
    rotY.current  += dt * rotSpeed
    meshRef.current.rotation.y = rotY.current
    // Tilt: galaxy tilts to show 3D as it forms
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      0.1,
      Math.PI * 0.18,
      Math.min(1, progress / 0.7)
    )
  })

  return <points ref={meshRef} geometry={geo} material={mat} />
}

// ── Public component ──────────────────────────────────────────────────────────
export function WebGLOverlay({ stateRef }: { stateRef: React.MutableRefObject<ScrollState> }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
      <Canvas
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 9], fov: 58, near: 0.1, far: 60 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <CosmicSwarm st={stateRef} />
      </Canvas>
    </div>
  )
}
