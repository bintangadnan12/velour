'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type ScrollState = {
  sceneIndex: number
  inHold:     boolean
  velocity:   number   // scroll delta per frame, approx –1..1
  alpha:       number   // overlay alpha from mapProgress
}

// ── color palette ─────────────────────────────────────────────────────────────
const GOLD   = new THREE.Color(0xC9A84C)
const WHITE  = new THREE.Color(0xF8F6F2)
const AMBER  = new THREE.Color(0xD4884A)
const COPPER = new THREE.Color(0xE8B86D)

// ── GLSL noise helpers ────────────────────────────────────────────────────────
const NOISE_GLSL = `
vec3 mod289v(vec3 x){return x-floor(x*(1./289.))*289.;}
vec2 mod289v(vec2 x){return x-floor(x*(1./289.))*289.;}
vec3 permute3(vec3 x){return mod289v(((x*34.)+1.)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(.211324865,.366025404,-.577350269,.024390244);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1,0):vec2(0,1);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
  i=mod289v(i);
  vec3 p=permute3(permute3(i.y+vec3(0,i1.y,1))+i.x+vec3(0,i1.x,1));
  vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
  m=m*m*m*m;
  vec3 x=2.*fract(p*C.www)-1.;
  vec3 h=abs(x)-.5;
  vec3 ox=floor(x+.5);
  vec3 a0=x-ox;
  m*=1.79284291-.85373472*(a0*a0+h*h);
  vec3 g;
  g.x=a0.x*x0.x+h.x*x0.y;
  g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.*dot(m,g);
}
`

// ── Scene 0: Spectral particle burst — gold+white explosion ──────────────────
function Scene0Burst({ st }: { st: React.MutableRefObject<ScrollState> }) {
  const ref  = useRef<THREE.Points>(null)
  const COUNT = 320
  const dirs = useMemo(() => {
    const d = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      d[i*3]   = Math.sin(phi) * Math.cos(theta)
      d[i*3+1] = Math.sin(phi) * Math.sin(theta) * 0.55
      d[i*3+2] = 0
    }
    return d
  }, [])
  const colors = useMemo(() => {
    const c = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const col = Math.random() < 0.6 ? GOLD : WHITE
      c[i*3] = col.r; c[i*3+1] = col.g; c[i*3+2] = col.b
    }
    return c
  }, [])
  const t = useRef(0)

  useFrame((_, dt) => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.PointsMaterial
    if (st.current.sceneIndex !== 0) { mat.opacity = 0; return }

    t.current = (t.current + dt * 0.38) % 1
    const ease = t.current < 0.35
      ? t.current / 0.35
      : 1 - (t.current - 0.35) / 0.65
    const R = ease * 7
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < COUNT; i++) {
      pos[i*3]   = dirs[i*3]   * R * (0.45 + (i / COUNT) * 0.55)
      pos[i*3+1] = dirs[i*3+1] * R * (0.45 + (i / COUNT) * 0.55)
      pos[i*3+2] = 0
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    mat.opacity = st.current.inHold ? st.current.alpha * 0.9 : st.current.alpha * 0.28
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} args={[new Float32Array(COUNT * 3), 3]} />
        <bufferAttribute attach="attributes-color"    count={COUNT} args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial vertexColors size={0.055} transparent opacity={0} sizeAttenuation depthWrite={false} />
    </points>
  )
}

// ── Scene 1: Helix DNA spiral — blueprint white lines ────────────────────────
function Scene1Helix({ st }: { st: React.MutableRefObject<ScrollState> }) {
  const ref  = useRef<THREE.LineSegments>(null)
  const COUNT = 80
  const geo = useMemo(() => {
    const pos: number[] = []
    for (let i = 0; i < COUNT; i++) {
      const t  = (i / COUNT) * Math.PI * 6
      const t2 = ((i+1) / COUNT) * Math.PI * 6
      const r  = 3.2
      // strand A
      pos.push(Math.cos(t)*r, (i/COUNT)*8-4, Math.sin(t)*1.2)
      pos.push(Math.cos(t2)*r, ((i+1)/COUNT)*8-4, Math.sin(t2)*1.2)
      // strand B (offset 180°)
      pos.push(Math.cos(t+Math.PI)*r, (i/COUNT)*8-4, Math.sin(t+Math.PI)*1.2)
      pos.push(Math.cos(t2+Math.PI)*r, ((i+1)/COUNT)*8-4, Math.sin(t2+Math.PI)*1.2)
      // rungs every 4
      if (i % 4 === 0) {
        pos.push(Math.cos(t)*r, (i/COUNT)*8-4, Math.sin(t)*1.2)
        pos.push(Math.cos(t+Math.PI)*r, (i/COUNT)*8-4, Math.sin(t+Math.PI)*1.2)
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3))
    return g
  }, [])

  useFrame((state, dt) => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.LineBasicMaterial
    if (st.current.sceneIndex !== 1) { mat.opacity = 0; return }
    ref.current.rotation.y = state.clock.elapsedTime * 0.18
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.12
    mat.opacity = st.current.inHold ? st.current.alpha * 0.7 : st.current.alpha * 0.22
  })

  return (
    <lineSegments ref={ref} geometry={geo}>
      <lineBasicMaterial color={WHITE} transparent opacity={0} depthWrite={false} />
    </lineSegments>
  )
}

// ── Scene 2: Slipstream — horizontal speed particle trails ───────────────────
function Scene2Slipstream({ st }: { st: React.MutableRefObject<ScrollState> }) {
  const ref  = useRef<THREE.Points>(null)
  const COUNT = 220
  const data = useMemo(() => {
    const pos   = new Float32Array(COUNT * 3)
    const seeds = new Float32Array(COUNT)      // per-particle phase
    for (let i = 0; i < COUNT; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 18
      pos[i*3+1] = (Math.random() - 0.5) * 10
      pos[i*3+2] = 0
      seeds[i]   = Math.random()
    }
    return { pos, seeds }
  }, [])

  useFrame((state, dt) => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.PointsMaterial
    if (st.current.sceneIndex !== 2) { mat.opacity = 0; return }

    const posArr = ref.current.geometry.attributes.position.array as Float32Array
    const speed  = 3.5 + Math.abs(st.current.velocity) * 12
    for (let i = 0; i < COUNT; i++) {
      posArr[i*3] -= speed * dt
      if (posArr[i*3] < -9) posArr[i*3] = 9
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    mat.opacity = st.current.inHold ? st.current.alpha * 0.75 : st.current.alpha * 0.25
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} args={[data.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial color={WHITE} size={0.04} transparent opacity={0} sizeAttenuation depthWrite={false} />
    </points>
  )
}

// ── Scene 3: Aurora GLSL — fluid gold/amber shader full-screen ───────────────
const AURORA_VERT = `
varying vec2 vUv;
void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
`
const AURORA_FRAG = `
uniform float uTime;
uniform float uIntensity;
varying vec2 vUv;
${NOISE_GLSL}
void main(){
  vec2 uv=vUv;
  float n1=snoise(vec2(uv.x*2.2+uTime*.11,uv.y*1.4+uTime*.07))*.5+.5;
  float n2=snoise(vec2(uv.x*3.8-uTime*.09,uv.y*2.1+uTime*.14))*.5+.5;
  float n3=snoise(vec2(uv.x*1.1+uTime*.05,uv.y*3.9-uTime*.1))*.5+.5;
  float n=n1*.5+n2*.3+n3*.2;
  vec3 gold  =vec3(0.788,0.659,0.294);
  vec3 amber =vec3(0.85,0.52,0.15);
  vec3 copper=vec3(0.95,0.78,0.42);
  vec3 deep  =vec3(0.32,0.20,0.06);
  vec3 col=mix(deep,gold,n1);
  col=mix(col,copper,n2*n3*.9);
  col=mix(col,amber,n3*.35);
  float edge=smoothstep(0.,.22,uv.x)*smoothstep(1.,.78,uv.x)
            *smoothstep(0.,.18,uv.y)*smoothstep(1.,.82,uv.y);
  float a=n*.6*uIntensity*edge;
  gl_FragColor=vec4(col,a);
}
`

function Scene3Aurora({ st }: { st: React.MutableRefObject<ScrollState> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => ({
    uTime:      { value: 0 },
    uIntensity: { value: 0 },
  }), [])

  useFrame((state) => {
    if (!matRef.current) return
    if (st.current.sceneIndex !== 3) {
      matRef.current.uniforms.uIntensity.value *= 0.92
      return
    }
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime
    const target = st.current.inHold ? st.current.alpha : st.current.alpha * 0.3
    matRef.current.uniforms.uIntensity.value +=
      (target - matRef.current.uniforms.uIntensity.value) * 0.06
  })

  return (
    <mesh>
      <planeGeometry args={[20, 12]} />
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

// ── Scene 4: Galaxy vortex — gold spiral particles ────────────────────────────
function Scene4Vortex({ st }: { st: React.MutableRefObject<ScrollState> }) {
  const ref  = useRef<THREE.Points>(null)
  const COUNT = 380
  const data = useMemo(() => {
    const pos    = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const arm    = Math.floor(Math.random() * 3)          // 3 spiral arms
      const r      = 0.5 + Math.random() * 5.5
      const theta  = (arm * Math.PI * 2 / 3) + r * 0.55 + Math.random() * 0.5
      const spread = (1 - r / 6) * 0.8
      pos[i*3]   = Math.cos(theta) * r + (Math.random()-0.5) * spread
      pos[i*3+1] = (Math.random()-0.5) * (0.4 + r * 0.08)
      pos[i*3+2] = Math.sin(theta) * r * 0.4 + (Math.random()-0.5) * spread * 0.4
      const blend = r / 6
      const col   = Math.random() < 0.55 ? GOLD : (Math.random() < 0.5 ? COPPER : WHITE)
      colors[i*3] = col.r; colors[i*3+1] = col.g; colors[i*3+2] = col.b
    }
    return { pos, colors }
  }, [])

  useFrame((state, dt) => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.PointsMaterial
    if (st.current.sceneIndex !== 4) { mat.opacity = 0; return }
    ref.current.rotation.y = state.clock.elapsedTime * 0.09
    ref.current.rotation.x = Math.PI * 0.18
    mat.opacity = st.current.inHold ? st.current.alpha * 0.88 : st.current.alpha * 0.28
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} args={[data.pos, 3]} />
        <bufferAttribute attach="attributes-color"    count={COUNT} args={[data.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial vertexColors size={0.05} transparent opacity={0} sizeAttenuation depthWrite={false} />
    </points>
  )
}

// ── Ambient: always-on subtle particle field reacting to velocity ─────────────
function AmbientField({ st }: { st: React.MutableRefObject<ScrollState> }) {
  const ref  = useRef<THREE.Points>(null)
  const COUNT = 180
  const data = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const vel = new Float32Array(COUNT * 2)
    for (let i = 0; i < COUNT; i++) {
      pos[i*3]   = (Math.random()-0.5) * 20
      pos[i*3+1] = (Math.random()-0.5) * 12
      pos[i*3+2] = -1
      vel[i*2]   = (Math.random()-0.5) * 0.008
      vel[i*2+1] = (Math.random()-0.5) * 0.005
    }
    return { pos, vel }
  }, [])

  useFrame((_, dt) => {
    if (!ref.current) return
    const posArr = ref.current.geometry.attributes.position.array as Float32Array
    const speed  = 1 + Math.abs(st.current.velocity) * 8
    for (let i = 0; i < COUNT; i++) {
      posArr[i*3]   += data.vel[i*2]   * speed
      posArr[i*3+1] += data.vel[i*2+1] * speed
      if (posArr[i*3]   > 10)  posArr[i*3]   = -10
      if (posArr[i*3]   < -10) posArr[i*3]   = 10
      if (posArr[i*3+1] > 6)   posArr[i*3+1] = -6
      if (posArr[i*3+1] < -6)  posArr[i*3+1] = 6
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    const mat = ref.current.material as THREE.PointsMaterial
    const baseOp = st.current.inHold ? 0.04 : 0.08 + Math.abs(st.current.velocity) * 0.6
    mat.opacity += (Math.min(baseOp, 0.4) - mat.opacity) * 0.08
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} args={[data.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial color={WHITE} size={0.028} transparent opacity={0.06} sizeAttenuation depthWrite={false} />
    </points>
  )
}

// ── Velocity streaks: horizontal lines when scrolling fast ────────────────────
function VelocityStreaks({ st }: { st: React.MutableRefObject<ScrollState> }) {
  const ref  = useRef<THREE.LineSegments>(null)
  const COUNT = 40
  const geo = useMemo(() => {
    const pos = new Float32Array(COUNT * 6) // 2 verts per line
    for (let i = 0; i < COUNT; i++) {
      const y = (Math.random()-0.5) * 11
      pos[i*6]   = -0.8; pos[i*6+1] = y; pos[i*6+2] = -0.5
      pos[i*6+3] =  0.8; pos[i*6+4] = y; pos[i*6+5] = -0.5
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [])

  useFrame((state, dt) => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.LineBasicMaterial
    const v   = Math.abs(st.current.velocity)
    const targetOp = v > 0.015 ? Math.min(v * 18, 0.65) : 0
    mat.opacity += (targetOp - mat.opacity) * 0.14

    // scale lines with velocity
    const scale = 1 + v * 22
    ref.current.scale.x = scale
  })

  return (
    <lineSegments ref={ref} geometry={geo}>
      <lineBasicMaterial color={WHITE} transparent opacity={0} depthWrite={false} />
    </lineSegments>
  )
}

// ── Inner scene (inside Canvas) ───────────────────────────────────────────────
function Scene({ stateRef }: { stateRef: React.MutableRefObject<ScrollState> }) {
  return (
    <>
      <AmbientField   st={stateRef} />
      <VelocityStreaks st={stateRef} />
      <Scene0Burst    st={stateRef} />
      <Scene1Helix    st={stateRef} />
      <Scene2Slipstream st={stateRef} />
      <Scene3Aurora   st={stateRef} />
      <Scene4Vortex   st={stateRef} />
    </>
  )
}

// ── Public component ──────────────────────────────────────────────────────────
export function WebGLOverlay({
  stateRef,
}: {
  stateRef: React.MutableRefObject<ScrollState>
}) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
    }}>
      <Canvas
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 50 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Scene stateRef={stateRef} />
      </Canvas>
    </div>
  )
}
