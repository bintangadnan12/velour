'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type ScrollState = {
  sceneIndex: number
  inHold:     boolean
  velocity:   number   // raw progress delta — normalise * 300 inside
  alpha:      number
}

// ── palette ───────────────────────────────────────────────────────────────────
const GOLD   = new THREE.Color(0xC9A84C)
const COPPER = new THREE.Color(0xE8B86D)
const WHITE  = new THREE.Color(0xF8F6F2)
const AMBER  = new THREE.Color(0xD4884A)

// ── spring lerp helper ────────────────────────────────────────────────────────
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

// ── GLSL ──────────────────────────────────────────────────────────────────────
const NOISE_GLSL = /* glsl */`
vec3 _p3(vec3 x){return x-floor(x*(1./289.))*289.;}
vec3 _pm(vec3 x){return _p3(((x*34.)+1.)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(.211,.366,-.577,.024);
  vec2 i=floor(v+dot(v,C.yy)),x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1,0):vec2(0,1);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
  i=_p3(i);
  vec3 p=_pm(_pm(i.y+vec3(0,i1.y,1))+i.x+vec3(0,i1.x,1));
  vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
  m=m*m*m*m;
  vec3 x2=2.*fract(p*.024)-1.,h=abs(x2)-.5,ox=floor(x2+.5),a0=x2-ox;
  m*=1.793-.854*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.*dot(m,g);
}
`

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 0 — Spectral shockwave burst  (gold + white explosive rings + particles)
// ═══════════════════════════════════════════════════════════════════════════════
function Scene0({ st }: { st: React.MutableRefObject<ScrollState> }) {
  // ── shockwave rings ──────────────────────────────────────────────────────────
  const ringsRef = useRef<THREE.Group>(null)
  const RING_COUNT = 5
  const ringGeos = useMemo(() =>
    Array.from({ length: RING_COUNT }, (_, i) => {
      const g = new THREE.RingGeometry(0.01, 0.06, 64)
      return g
    }), [])
  const ringMats = useMemo(() =>
    Array.from({ length: RING_COUNT }, (_, i) =>
      new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? GOLD : WHITE,
        transparent: true, opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
    ), [])
  const ringPhases = useRef(Array.from({ length: RING_COUNT }, (_, i) => i / RING_COUNT))

  // ── particles ────────────────────────────────────────────────────────────────
  const ptsRef = useRef<THREE.Points>(null)
  const COUNT  = 360
  const pData  = useMemo(() => {
    const geo  = new THREE.BufferGeometry()
    const pos  = new Float32Array(COUNT * 3)
    const col  = new Float32Array(COUNT * 3)
    const dirs = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      dirs[i*3]   = Math.sin(phi) * Math.cos(theta)
      dirs[i*3+1] = Math.sin(phi) * Math.sin(theta) * 0.45
      dirs[i*3+2] = 0
      const c = Math.random() < 0.55 ? GOLD : WHITE
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3))
    return { geo, dirs }
  }, [])
  const pMat = useMemo(() => new THREE.PointsMaterial({
    vertexColors: true, size: 0.13, transparent: true, opacity: 0,
    sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }), [])
  const clock = useRef(Math.random() * 10)
  const opRef = useRef(0)

  useFrame((state, dt) => {
    const active = st.current.sceneIndex === 0
    const target = active ? (st.current.inHold ? st.current.alpha * 0.95 : st.current.alpha * 0.45) : 0
    opRef.current = lerp(opRef.current, target, 0.07)
    if (opRef.current < 0.005 && !active) return

    clock.current += dt * 0.45
    const t = clock.current % 1  // 0→1 cycling

    // Burst easing: explosive out, slow dissolve
    const burst = Math.pow(t, 0.22)        // fast rush out
    const fade  = 1 - Math.pow(t, 2.5)    // slow dissolve

    // Update particle positions
    const posArr = pData.geo.attributes.position.array as Float32Array
    const maxR   = 3.8
    for (let i = 0; i < COUNT; i++) {
      const r = burst * maxR * (0.3 + (i / COUNT) * 0.7)
      posArr[i*3]   = pData.dirs[i*3]   * r
      posArr[i*3+1] = pData.dirs[i*3+1] * r
      posArr[i*3+2] = 0
    }
    pData.geo.attributes.position.needsUpdate = true
    pMat.opacity = fade * opRef.current

    // Update shockwave rings
    for (let ri = 0; ri < RING_COUNT; ri++) {
      ringPhases.current[ri] = (ringPhases.current[ri] + dt * 0.38) % 1
      const rp  = ringPhases.current[ri]
      const rs  = Math.pow(rp, 0.28) * 4.2
      const rfa = (1 - Math.pow(rp, 1.8)) * opRef.current
      const mesh = ringsRef.current?.children[ri] as THREE.Mesh | undefined
      if (mesh) {
        mesh.scale.setScalar(rs)
        ;(mesh.material as THREE.MeshBasicMaterial).opacity = rfa * 0.7
      }
    }
  })

  return (
    <group>
      <group ref={ringsRef}>
        {ringGeos.map((g, i) => (
          <mesh key={i} geometry={g} material={ringMats[i]} />
        ))}
      </group>
      <points ref={ptsRef} geometry={pData.geo} material={pMat} />
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 1 — Blueprint wireframe sphere dissolving into particles
// ═══════════════════════════════════════════════════════════════════════════════
function Scene1({ st }: { st: React.MutableRefObject<ScrollState> }) {
  const grpRef = useRef<THREE.Group>(null)
  const COUNT  = 420

  const pData = useMemo(() => {
    const geo    = new THREE.BufferGeometry()
    const pos    = new Float32Array(COUNT * 3)
    const target = new Float32Array(COUNT * 3)  // sphere surface positions
    const origin = new Float32Array(COUNT * 3)  // scattered origin

    for (let i = 0; i < COUNT; i++) {
      // Fibonacci sphere distribution
      const phi   = Math.acos(1 - 2 * (i + 0.5) / COUNT)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r     = 2.6
      target[i*3]   = r * Math.sin(phi) * Math.cos(theta)
      target[i*3+1] = r * Math.cos(phi) * 0.75
      target[i*3+2] = r * Math.sin(phi) * Math.sin(theta) * 0.4

      origin[i*3]   = (Math.random() - 0.5) * 12
      origin[i*3+1] = (Math.random() - 0.5) * 8
      origin[i*3+2] = (Math.random() - 0.5) * 3

      pos[i*3]   = origin[i*3]
      pos[i*3+1] = origin[i*3+1]
      pos[i*3+2] = origin[i*3+2]
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return { geo, target, origin }
  }, [])

  const pMat = useMemo(() => new THREE.PointsMaterial({
    color: WHITE, size: 0.09, transparent: true, opacity: 0,
    sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }), [])

  const formRef   = useRef(0)   // 0=scattered, 1=formed sphere
  const opRef     = useRef(0)
  const rotYRef   = useRef(0)

  useFrame((state, dt) => {
    const active = st.current.sceneIndex === 1
    const vel    = Math.abs(st.current.velocity) * 280
    const targetOp = active ? (st.current.inHold ? st.current.alpha * 0.9 : st.current.alpha * 0.4) : 0
    opRef.current  = lerp(opRef.current, targetOp, 0.07)
    if (opRef.current < 0.004 && !active) return

    // Form/scatter based on hold
    const targetForm = (active && st.current.inHold) ? 1 : 0
    formRef.current  = lerp(formRef.current, targetForm, 0.055)

    // Rotation — speed up with scroll velocity
    rotYRef.current += dt * (0.22 + vel * 0.8)
    if (grpRef.current) grpRef.current.rotation.y = rotYRef.current

    const posArr = pData.geo.attributes.position.array as Float32Array
    for (let i = 0; i < COUNT; i++) {
      posArr[i*3]   = lerp(pData.origin[i*3],   pData.target[i*3],   formRef.current)
      posArr[i*3+1] = lerp(pData.origin[i*3+1], pData.target[i*3+1], formRef.current)
      posArr[i*3+2] = lerp(pData.origin[i*3+2], pData.target[i*3+2], formRef.current)
    }
    pData.geo.attributes.position.needsUpdate = true
    pMat.opacity = opRef.current
  })

  return (
    <group ref={grpRef}>
      <points geometry={pData.geo} material={pMat} />
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 2 — Slipstream: ground-plane + depth speed lines (velocity-reactive)
// ═══════════════════════════════════════════════════════════════════════════════
function Scene2({ st }: { st: React.MutableRefObject<ScrollState> }) {
  const COUNT = 280
  const pData = useMemo(() => {
    const geo   = new THREE.BufferGeometry()
    const pos   = new Float32Array(COUNT * 3)
    const seeds = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 18
      pos[i*3+1] = -2 + Math.random() * 4
      pos[i*3+2] = (Math.random() - 0.5) * 2
      seeds[i]   = Math.random()
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return { geo, seeds }
  }, [])
  const pMat = useMemo(() => new THREE.PointsMaterial({
    color: WHITE, size: 0.08, transparent: true, opacity: 0,
    sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }), [])

  // Streak lines
  const SCOUNT = 60
  const sData = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(SCOUNT * 6)
    for (let i = 0; i < SCOUNT; i++) {
      const y = (Math.random() - 0.5) * 7
      const z = (Math.random() - 0.5) * 2
      const len = 0.3 + Math.random() * 1.4
      pos[i*6]   = -len; pos[i*6+1] = y; pos[i*6+2] = z
      pos[i*6+3] =  len; pos[i*6+4] = y; pos[i*6+5] = z
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return { geo }
  }, [])
  const sMat = useMemo(() => new THREE.LineBasicMaterial({
    color: WHITE, transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), [])
  const streakRef = useRef<THREE.LineSegments>(null)
  const opRef     = useRef(0)
  const speedRef  = useRef(3)

  useFrame((state, dt) => {
    const active = st.current.sceneIndex === 2
    const vel    = Math.abs(st.current.velocity) * 300
    const targetOp = active ? (st.current.inHold ? st.current.alpha * 0.85 : st.current.alpha * 0.38) : 0
    opRef.current = lerp(opRef.current, targetOp, 0.07)
    if (opRef.current < 0.004 && !active) return

    // Speed reacts to velocity
    const targetSpeed = 4 + vel * 6
    speedRef.current  = lerp(speedRef.current, targetSpeed, 0.12)

    const posArr = pData.geo.attributes.position.array as Float32Array
    for (let i = 0; i < COUNT; i++) {
      posArr[i*3] -= speedRef.current * dt
      if (posArr[i*3] < -9) posArr[i*3] = 9
    }
    pData.geo.attributes.position.needsUpdate = true
    pMat.opacity = opRef.current

    // Streaks scale with velocity
    const targetScale = 1 + vel * 0.8
    if (streakRef.current) {
      streakRef.current.scale.x = lerp(streakRef.current.scale.x, targetScale, 0.14)
    }
    sMat.opacity = opRef.current * Math.min(1, vel * 1.5 + 0.4)
  })

  return (
    <group>
      <points geometry={pData.geo} material={pMat} />
      <lineSegments ref={streakRef} geometry={sData.geo} material={sMat} />
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 3 — Aurora GLSL shader (gold / amber / copper liquid waves)
// ═══════════════════════════════════════════════════════════════════════════════
const AURORA_VERT = /* glsl */`
varying vec2 vUv;
void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }
`
const AURORA_FRAG = /* glsl */`
uniform float uTime;
uniform float uIntensity;
uniform float uSpeed;
varying vec2 vUv;
${NOISE_GLSL}
void main(){
  vec2 uv=vUv;
  // 4 noise octaves for richness
  float n1=snoise(vec2(uv.x*2.1+uTime*uSpeed*.9,  uv.y*1.3+uTime*uSpeed*.6))*.5+.5;
  float n2=snoise(vec2(uv.x*3.9-uTime*uSpeed*.7,  uv.y*2.2+uTime*uSpeed*1.1))*.5+.5;
  float n3=snoise(vec2(uv.x*1.2+uTime*uSpeed*.4,  uv.y*4.1-uTime*uSpeed*.8))*.5+.5;
  float n4=snoise(vec2(uv.x*5.5-uTime*uSpeed*.5,  uv.y*1.8+uTime*uSpeed*.3))*.5+.5;
  float n =n1*.42+n2*.28+n3*.18+n4*.12;
  vec3 gold  =vec3(.788,.659,.294);
  vec3 amber =vec3(.85,.52,.15);
  vec3 copper=vec3(.95,.78,.42);
  vec3 deep  =vec3(.28,.17,.04);
  vec3 bright=vec3(1.,.92,.62);
  vec3 col=mix(deep,gold,n1);
  col=mix(col,copper,n2*n3*.85);
  col=mix(col,amber, n3*.4);
  col=mix(col,bright,pow(n,4.)*0.6);
  // vignette that still leaves center visible
  float vx=smoothstep(0.,.18,uv.x)*smoothstep(1.,.82,uv.x);
  float vy=smoothstep(0.,.12,uv.y)*smoothstep(1.,.88,uv.y);
  float alpha=n*.72*uIntensity*vx*vy;
  gl_FragColor=vec4(col,alpha);
}
`
function Scene3Aurora({ st }: { st: React.MutableRefObject<ScrollState> }) {
  const matRef   = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => ({
    uTime:      { value: 0 },
    uIntensity: { value: 0 },
    uSpeed:     { value: 1 },
  }), [])

  useFrame((state, dt) => {
    if (!matRef.current) return
    const active = st.current.sceneIndex === 3
    const vel    = Math.abs(st.current.velocity) * 300
    matRef.current.uniforms.uTime.value += dt
    const targetI = active
      ? (st.current.inHold ? st.current.alpha * 0.92 : st.current.alpha * 0.38)
      : 0
    matRef.current.uniforms.uIntensity.value = lerp(
      matRef.current.uniforms.uIntensity.value, targetI, 0.055
    )
    // Aurora flows faster when scrolling
    matRef.current.uniforms.uSpeed.value = lerp(
      matRef.current.uniforms.uSpeed.value, 1 + vel * 2, 0.1
    )
  })

  return (
    <mesh>
      <planeGeometry args={[18, 11]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={AURORA_VERT}
        fragmentShader={AURORA_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 4 — Galaxy vortex (gold spiral arms + core glow)
// ═══════════════════════════════════════════════════════════════════════════════
const VORTEX_VERT = /* glsl */`
attribute float aAngle;
attribute float aRadius;
attribute float aSpeed;
uniform float uTime;
uniform float uSpin;
void main(){
  float a = aAngle + uTime * aSpeed * uSpin;
  float r = aRadius;
  vec3 pos = vec3(cos(a)*r, position.y, sin(a)*r*0.32);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
  gl_PointSize = 3. + (1.-r/6.)*4.;
}
`
const VORTEX_FRAG = /* glsl */`
uniform float uIntensity;
varying vec3 vColor;
void main(){
  vec2 c = gl_PointCoord - .5;
  float d = dot(c,c);
  if(d>.25) discard;
  gl_FragColor = vec4(vColor, (1.-d*4.) * uIntensity);
}
`
function Scene4({ st }: { st: React.MutableRefObject<ScrollState> }) {
  const ref    = useRef<THREE.Points>(null)
  const COUNT  = 500

  const pData = useMemo(() => {
    const geo    = new THREE.BufferGeometry()
    const pos    = new Float32Array(COUNT * 3)
    const col    = new Float32Array(COUNT * 3)
    const angles = new Float32Array(COUNT)
    const radii  = new Float32Array(COUNT)
    const speeds = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      const arm   = i % 3
      const r     = 0.2 + Math.pow(Math.random(), 0.6) * 5.5
      const base  = arm * (Math.PI * 2 / 3)
      const wind  = r * 0.65
      angles[i]   = base + wind + (Math.random() - 0.5) * 0.55
      radii[i]    = r
      speeds[i]   = (0.18 + Math.random() * 0.12) * (r < 1.5 ? 2.5 : 1)
      pos[i*3]    = 0
      pos[i*3+1]  = (Math.random() - 0.5) * (0.3 + r * 0.06)
      pos[i*3+2]  = 0
      const t  = r / 5.5
      const c  = t < 0.4
        ? GOLD.clone().lerp(COPPER, t / 0.4)
        : COPPER.clone().lerp(WHITE, (t - 0.4) / 0.6)
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3))
    geo.setAttribute('aAngle',   new THREE.BufferAttribute(angles, 1))
    geo.setAttribute('aRadius',  new THREE.BufferAttribute(radii, 1))
    geo.setAttribute('aSpeed',   new THREE.BufferAttribute(speeds, 1))
    return { geo }
  }, [])

  const spinRef = useRef(1)
  const opRef   = useRef(0)
  const mat = useMemo(() => new THREE.PointsMaterial({
    vertexColors: true, size: 0.11, transparent: true, opacity: 0,
    sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }), [])

  useFrame((state, dt) => {
    if (!ref.current) return
    const active = st.current.sceneIndex === 4
    const vel    = Math.abs(st.current.velocity) * 300
    const targetOp = active
      ? (st.current.inHold ? st.current.alpha * 0.95 : st.current.alpha * 0.42)
      : 0
    opRef.current = lerp(opRef.current, targetOp, 0.07)
    mat.opacity   = opRef.current

    // Spin accelerates with scroll
    spinRef.current = lerp(spinRef.current, 1 + vel * 1.5, 0.1)

    ref.current.rotation.y += dt * 0.08 * spinRef.current
    ref.current.rotation.x = Math.PI * 0.16 + Math.sin(state.clock.elapsedTime * 0.12) * 0.06
  })

  return <points ref={ref} geometry={pData.geo} material={mat} />
}

// ═══════════════════════════════════════════════════════════════════════════════
// AMBIENT — always-on particle field + velocity streaks
// ═══════════════════════════════════════════════════════════════════════════════
function Ambient({ st }: { st: React.MutableRefObject<ScrollState> }) {
  const COUNT = 220
  const pData = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(COUNT * 3)
    const vel = new Float32Array(COUNT * 2)
    for (let i = 0; i < COUNT; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 20
      pos[i*3+1] = (Math.random() - 0.5) * 12
      pos[i*3+2] = -0.5
      vel[i*2]   = (Math.random() - 0.5) * 0.007
      vel[i*2+1] = (Math.random() - 0.5) * 0.004
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return { geo, vel }
  }, [])
  const pMat = useMemo(() => new THREE.PointsMaterial({
    color: WHITE, size: 0.04, transparent: true, opacity: 0.07,
    sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }), [])

  // Streaks
  const SCOUNT = 50
  const sData = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(SCOUNT * 6)
    for (let i = 0; i < SCOUNT; i++) {
      const y = (Math.random() - 0.5) * 11
      const z = -0.3
      pos[i*6]=-.5; pos[i*6+1]=y; pos[i*6+2]=z
      pos[i*6+3]=.5; pos[i*6+4]=y; pos[i*6+5]=z
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return { geo }
  }, [])
  const sMat = useMemo(() => new THREE.LineBasicMaterial({
    color: WHITE, transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), [])
  const sRef = useRef<THREE.LineSegments>(null)

  useFrame((_, dt) => {
    const vel  = Math.abs(st.current.velocity) * 300
    const posArr = pData.geo.attributes.position.array as Float32Array
    const drift  = 1 + vel * 0.25
    for (let i = 0; i < COUNT; i++) {
      posArr[i*3]   += pData.vel[i*2]   * drift
      posArr[i*3+1] += pData.vel[i*2+1]
      if (posArr[i*3] > 10)   posArr[i*3]   = -10
      if (posArr[i*3] < -10)  posArr[i*3]   = 10
      if (posArr[i*3+1] > 6)  posArr[i*3+1] = -6
      if (posArr[i*3+1] < -6) posArr[i*3+1] = 6
    }
    pData.geo.attributes.position.needsUpdate = true
    pMat.opacity = lerp(pMat.opacity, st.current.inHold ? 0.04 : 0.06 + vel * 0.18, 0.08)

    // Streaks: appear when scrolling fast, scale with velocity
    const streakOp = Math.min(vel * 0.55, 0.7)
    sMat.opacity   = lerp(sMat.opacity, streakOp, 0.14)
    if (sRef.current) {
      sRef.current.scale.x = lerp(sRef.current.scale.x, 1 + vel * 1.8, 0.14)
    }
  })

  return (
    <group>
      <points geometry={pData.geo} material={pMat} />
      <lineSegments ref={sRef} geometry={sData.geo} material={sMat} />
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT SCENE
// ═══════════════════════════════════════════════════════════════════════════════
function Scene({ st }: { st: React.MutableRefObject<ScrollState> }) {
  return (
    <>
      <Ambient   st={st} />
      <Scene0    st={st} />
      <Scene1    st={st} />
      <Scene2    st={st} />
      <Scene3Aurora st={st} />
      <Scene4    st={st} />
    </>
  )
}

// ── Public component (zIndex:4 — above CSS Aura at z:3, text moves to z:5) ───
export function WebGLOverlay({ stateRef }: { stateRef: React.MutableRefObject<ScrollState> }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }}>
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 58, near: 0.1, far: 60 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Scene st={stateRef} />
      </Canvas>
    </div>
  )
}
