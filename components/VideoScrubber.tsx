'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ─── Constants ────────────────────────────────────────────────────────────────
const TOTAL        = 300
const SCENES       = 5
const VH_PER_SCENE = 700

const SCRUB_END = 0.10
const HOLD_END  = 0.90

const KEY_FRAMES   = [45, 105, 165, 225, 299]
const START_FRAMES = [0,  46,  106, 166, 226]

const pad = (i: number) => String(i).padStart(4, '0')
const desktopSrc = (i: number) => `/frames/frame${pad(i)}.jpg`
const mobileSrc  = (i: number) => `/frames-mobile/frame${pad(i)}.jpg`

// ─── Scene data ───────────────────────────────────────────────────────────────
const SCENE_DATA = [
  { id: 'arrival',   step: '01', headline: ['The', 'Arrival.'],       accent: 'First Edition · 200 Pairs · New York',                    body: 'Engineered from a single conviction — that footwear should earn its place in your life. Permanently.',  cta: false, align: 'left'   as const },
  { id: 'construct', step: '02', headline: ['Every Layer.','Considered.'], accent: '08 Components · 03 Materials · Zero Excess',          body: 'We showed you the inside so you could trust the outside. Nothing hidden. Nothing unnecessary.',          cta: false, align: 'right'  as const },
  { id: 'sole',      step: '03', headline: ['Ground','Intelligence.'], accent: 'Recycled Rubber · Multi-Directional Grip · 12mm Stack',   body: 'The sole is the first thing that meets the world.\nWe treated it accordingly.',                         cta: false, align: 'left'   as const },
  { id: 'upper',     step: '04', headline: ['Skin-Grade','Leather.'],  accent: 'Full-Grain · Naturally Tanned · Traceable to Source',     body: 'The upper ages with you.\nCreases become character. Wear becomes story.',                               cta: false, align: 'right'  as const },
  { id: 'finale',    step: '05', headline: ['FORMA','001.'],           accent: '200 Pairs · No Restock · Ships in 48h',                   body: null, cta: true, align: 'center' as const },
]

// ─── Progress mapping ─────────────────────────────────────────────────────────
function mapProgress(p: number) {
  const si    = Math.min(Math.floor(p * SCENES), SCENES - 1)
  const local = (p - si / SCENES) * SCENES

  let frame = START_FRAMES[si]
  if (local < SCRUB_END) {
    const t = local / SCRUB_END
    frame = Math.round(START_FRAMES[si] + t * (KEY_FRAMES[si] - START_FRAMES[si]))
  } else {
    frame = KEY_FRAMES[si]
  }
  frame = Math.max(0, Math.min(TOTAL - 1, frame))

  let alpha = 0
  if (local >= SCRUB_END && local <= HOLD_END) {
    const inRamp  = SCRUB_END + 0.05
    const outRamp = HOLD_END  - 0.08
    if (local < inRamp)       alpha = (local - SCRUB_END) / (inRamp - SCRUB_END)
    else if (local > outRamp) alpha = Math.max(0, 1 - (local - outRamp) / (HOLD_END - outRamp))
    else                      alpha = 1
  }

  return { frame, sceneIndex: si, inHold: local >= SCRUB_END && local <= HOLD_END, alpha }
}

const ease3d = [0.16, 1, 0.3, 1] as const

// ─── Freeze Aura — 5 completely unique effects per scene ─────────────────────
const C = (a: number) => `rgba(248,246,242,${a})`

const AURA_WRAP: React.CSSProperties = {
  position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3, overflow: 'hidden',
}
const CENTER: React.CSSProperties = {
  position: 'absolute', left: '50%', top: '50%',
  width: 0, height: 0, transform: 'translate(-50%,-50%)',
}

// ── Scene 0 — THE ARRIVAL: concentric shockwave rings + radial burst ──────────
function Aura0() {
  const burst = Array.from({ length: 16 }, (_, i) => i * 22.5)
  return (
    <div style={AURA_WRAP}>
      <div style={CENTER}>
        {/* 6 expanding shockwave rings */}
        {[100, 200, 320, 460, 600, 750].map((sz, i) => (
          <motion.div key={i}
            style={{ position: 'absolute', borderRadius: '50%', border: `1.5px solid ${C(0.55)}`,
                     width: sz, height: sz, left: -sz/2, top: -sz/2 }}
            animate={{ scale: [0, 2.5], opacity: [0.8, 0] }}
            transition={{ duration: 2.5 + i * 0.15, repeat: Infinity, ease: [0.2,0,0.8,1],
                          delay: i * 0.35, repeatDelay: 0.4 }}
          />
        ))}
        {/* 16 radial burst streaks */}
        {burst.map((deg, i) => {
          const rad = deg * Math.PI / 180
          const d = 180 + (i % 4) * 45
          return (
            <motion.div key={deg}
              style={{ position: 'absolute', width: i%3===0?4:2.5, height: i%3===0?4:2.5,
                       borderRadius: '50%', background: C(0.9), left: -1.5, top: -1.5,
                       boxShadow: `0 0 8px ${C(0.6)}` }}
              animate={{ x: [0, Math.cos(rad)*d], y: [0, Math.sin(rad)*d], opacity: [1,0], scale:[2,0.3] }}
              transition={{ duration: 1.8+(i%3)*0.3, repeat: Infinity, ease:'easeOut',
                            delay: (i*0.1)%1.5, repeatDelay: 0.6 }}
            />
          )
        })}
        {/* Center supernova */}
        <motion.div
          animate={{ scale:[0.3,3.5], opacity:[0.4,0] }}
          transition={{ duration:2, repeat:Infinity, ease:'easeOut', repeatDelay:0.8 }}
          style={{ position:'absolute', width:60, height:60, left:-30, top:-30, borderRadius:'50%',
                   background:`radial-gradient(circle, ${C(0.5)} 0%, transparent 70%)` }}
        />
      </div>
    </div>
  )
}

// ── Scene 1 — EVERY LAYER: precision engineering grid + laser scan ─────────────
function Aura1({ isMobile }: { isMobile: boolean }) {
  const cols = isMobile ? [-120,-60,0,60,120] : [-240,-160,-80,0,80,160,240]
  const rows = isMobile ? [-120,-60,0,60,120]  : [-180,-90,0,90,180]
  return (
    <div style={AURA_WRAP}>
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {rows.map((y, i) => (
          <motion.div key={`h${i}`}
            style={{ position:'absolute', left:0, right:0, height:1,
                     background:`linear-gradient(to right, transparent, ${C(0.35)} 20%, ${C(0.35)} 80%, transparent)`,
                     top:`calc(50% + ${y}px)` }}
            initial={{ opacity:0, scaleX:0 }} animate={{ opacity:1, scaleX:1 }}
            transition={{ duration:0.9, ease:ease3d, delay: i * 0.12 }}
          />
        ))}
        {cols.map((x, i) => (
          <motion.div key={`v${i}`}
            style={{ position:'absolute', top:0, bottom:0, width:1,
                     background:`linear-gradient(to bottom, transparent, ${C(0.25)} 20%, ${C(0.25)} 80%, transparent)`,
                     left:`calc(50% + ${x}px)` }}
            initial={{ opacity:0, scaleY:0 }} animate={{ opacity:1, scaleY:1 }}
            transition={{ duration:0.9, ease:ease3d, delay: 0.3 + i * 0.08 }}
          />
        ))}
        {rows.flatMap((y, ri) => cols.map((x, ci) => (
          <motion.div key={`d${ri}-${ci}`}
            style={{ position:'absolute', width:4, height:4, borderRadius:'50%',
                     background: C(0.7), boxShadow:`0 0 8px ${C(0.5)}`,
                     left:`calc(50% + ${x}px - 2px)`, top:`calc(50% + ${y}px - 2px)` }}
            initial={{ opacity:0, scale:0 }} animate={{ opacity:1, scale:1 }}
            transition={{ duration:0.3, delay: 0.5 + (ri*cols.length+ci)*0.018 }}
          />
        )))}
        <motion.div
          animate={{ left: ['5%', '95%'] }}
          transition={{ duration:2.8, repeat:Infinity, ease:'linear', repeatType:'reverse' }}
          style={{ position:'absolute', top:0, bottom:0, width:2,
                   background:`linear-gradient(to bottom, transparent, ${C(0.9)} 30%, ${C(0.9)} 70%, transparent)`,
                   boxShadow:`0 0 20px 4px ${C(0.4)}` }}
        />
        <motion.div
          animate={{ top: ['10%','90%'] }}
          transition={{ duration:3.5, repeat:Infinity, ease:'linear', repeatType:'reverse', delay:0.8 }}
          style={{ position:'absolute', left:0, right:0, height:1,
                   background:`linear-gradient(to right, transparent, ${C(0.7)} 30%, ${C(0.7)} 70%, transparent)`,
                   boxShadow:`0 0 16px 3px ${C(0.3)}` }}
        />
      </div>
    </div>
  )
}

// ── Scene 2 — GROUND INTELLIGENCE: horizontal floor ripples at sole level ──────
function Aura2() {
  return (
    <div style={AURA_WRAP}>
      {/* Flat ground ellipses — bottom 60% of screen */}
      <div style={{ position:'absolute', left:'50%', top:'65%', transform:'translate(-50%,-50%)', width:0, height:0 }}>
        {[280,460,640,820,1000].map((w, i) => {
          const h = Math.round(w * 0.12)
          return (
            <motion.div key={i}
              style={{ position:'absolute', width:w, height:h, left:-w/2, top:-h/2,
                       borderRadius:'50%', border:`1.5px solid ${C(0.6)}` }}
              animate={{ scale:[0.1, 1.8], opacity:[0.8, 0] }}
              transition={{ duration:2.8+i*0.2, repeat:Infinity, ease:'easeOut',
                            delay:i*0.45, repeatDelay:0.3 }}
            />
          )
        })}
        {/* Static base plate — always visible */}
        <motion.div
          animate={{ opacity:[0.25,0.55,0.25], scaleX:[0.9,1.05,0.9] }}
          transition={{ duration:2.5, repeat:Infinity, ease:'easeInOut' }}
          style={{ position:'absolute', width:300, height:36, left:-150, top:-18, borderRadius:'50%',
                   border:`1.5px solid ${C(0.6)}`, boxShadow:`0 0 40px ${C(0.1)}` }}
        />
        {/* 5 vertical energy lines rising from ground */}
        {[-100,-50,0,50,100].map((x, i) => (
          <motion.div key={i}
            animate={{ scaleY:[0,1,0], opacity:[0,0.7,0] }}
            transition={{ duration:1.8, repeat:Infinity, ease:'easeInOut', delay:i*0.22+0.5 }}
            style={{ position:'absolute', left:x, bottom:0, top:-120, width:1,
                     background:`linear-gradient(to top, ${C(0.6)}, transparent)`,
                     transformOrigin:'bottom' }}
          />
        ))}
      </div>
    </div>
  )
}

// ── Scene 3 — SKIN-GRADE LEATHER: slow organic wave ribbons sweeping ───────────
function Aura3() {
  const ribbons = [
    { w:500, angle:-25, dur:6,  delay:0   },
    { w:600, angle:15,  dur:8,  delay:0.8 },
    { w:400, angle:-50, dur:5,  delay:1.5 },
    { w:700, angle:35,  dur:9,  delay:0.3 },
    { w:350, angle:70,  dur:4,  delay:1.1 },
    { w:550, angle:-8,  dur:7,  delay:2.0 },
  ]
  return (
    <div style={AURA_WRAP}>
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {/* Wide sweeping ribbon lines — diagonal at various angles */}
        {ribbons.map((r, i) => (
          <motion.div key={i}
            style={{ position:'absolute', width:r.w, height:1.5, rotate:r.angle,
                     background:`linear-gradient(to right, transparent, ${C(0.55)} 25%, ${C(0.55)} 75%, transparent)`,
                     boxShadow:`0 0 12px ${C(0.25)}` }}
            animate={{ scaleX:[0.1,1,0.1], opacity:[0,0.8,0], y:[-20,20,-20] }}
            transition={{ duration:r.dur, repeat:Infinity, ease:'easeInOut', delay:r.delay }}
          />
        ))}
        {/* Slow morphing blob — organic leather texture feel */}
        {[1,2,3].map(i => (
          <motion.div key={i}
            animate={{ scale:[0.8+i*0.1, 1.2+i*0.1, 0.8+i*0.1],
                       opacity:[0.05,0.15,0.05],
                       borderRadius:['40% 60% 55% 45%','55% 45% 40% 60%','40% 60% 55% 45%'] }}
            transition={{ duration:4+i*1.5, repeat:Infinity, ease:'easeInOut', delay:i*0.7 }}
            style={{ position:'absolute', width:250+i*80, height:200+i*60,
                     left:`-${125+i*40}px`, top:`-${100+i*30}px`,
                     background:`radial-gradient(ellipse, ${C(0.8)} 0%, transparent 65%)` }}
          />
        ))}
      </div>
    </div>
  )
}

// ── Scene 4 — FORMA 001: grand finale — 3D orbit + shockwave + grid + ground ───
function Aura4({ isMobile }: { isMobile: boolean }) {
  const orbitParticles = (n: number) => Array.from({length:n}, (_,i) => i*(360/n))
  const burst = Array.from({ length: 20 }, (_, i) => i * 18)
  const rings = isMobile
    ? [
        { sz:240, rx:65, rz:10,  dur:22, rev:false, op:0.35, pDeg:orbitParticles(6), ps:2.5, po:0.6  },
        { sz:155, rx:78, rz:-45, dur:15, rev:true,  op:0.28, pDeg:orbitParticles(4), ps:3,   po:0.5, dl:-4 },
        { sz:90,  rx:50, rz:60,  dur:10, rev:false, op:0.22, pDeg:orbitParticles(6), ps:1.5, po:0.4, dl:-6 },
      ]
    : [
        { sz:440, rx:65, rz:10,  dur:22, rev:false, op:0.35, pDeg:orbitParticles(7), ps:3,   po:0.6  },
        { sz:300, rx:78, rz:-45, dur:15, rev:true,  op:0.28, pDeg:orbitParticles(5), ps:3.5, po:0.5, dl:-4 },
        { sz:180, rx:50, rz:60,  dur:10, rev:false, op:0.22, pDeg:orbitParticles(8), ps:2,   po:0.4, dl:-6 },
      ]
  return (
    <div style={AURA_WRAP}>
      {/* 3D orbital rings */}
      <div style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)',
                    width:0, height:0, perspective:'700px', transformStyle:'preserve-3d' }}>
        {rings.map((r, i) => {
          const half = r.sz/2
          return (
            <motion.div key={i}
              style={{ position:'absolute', width:r.sz, height:r.sz, left:-half, top:-half,
                       border:`1.5px solid ${C(r.op)}`, borderRadius:'50%', rotateX:r.rx, rotateZ:r.rz }}
              animate={{ rotateZ: r.rev ? r.rz-360 : r.rz+360 }}
              transition={{ duration:r.dur, repeat:Infinity, ease:'linear', delay:r.dl??0, repeatType:'loop' }}
            >
              {r.pDeg.map(deg => {
                const rad = deg*Math.PI/180
                return <div key={deg} style={{ position:'absolute', width:r.ps, height:r.ps, borderRadius:'50%',
                  background:C(r.po), boxShadow:`0 0 ${r.ps*2.5}px ${C(r.po*0.6)}`,
                  left:`calc(50% + ${half*Math.cos(rad)}px - ${r.ps/2}px)`,
                  top: `calc(50% + ${half*Math.sin(rad)}px - ${r.ps/2}px)` }} />
              })}
            </motion.div>
          )
        })}
      </div>
      {/* Burst particles */}
      <div style={CENTER}>
        {burst.map((deg, i) => {
          const rad = deg*Math.PI/180, d = 220+(i%5)*40
          return (
            <motion.div key={deg}
              style={{ position:'absolute', width:3, height:3, borderRadius:'50%',
                       background:C(0.9), left:-1.5, top:-1.5, boxShadow:`0 0 6px ${C(0.6)}` }}
              animate={{ x:[0,Math.cos(rad)*d], y:[0,Math.sin(rad)*d], opacity:[1,0], scale:[2.5,0.2] }}
              transition={{ duration:2.5+(i%4)*0.3, repeat:Infinity, ease:'easeOut',
                            delay:(i*0.12)%2, repeatDelay:0.5 }}
            />
          )
        })}
        {/* Ground ripples below */}
        {[200,360,520].map((w, i) => (
          <motion.div key={`g${i}`}
            style={{ position:'absolute', width:w, height:Math.round(w*0.11), left:-w/2, top:120+i*18,
                     borderRadius:'50%', border:`1px solid ${C(0.4)}` }}
            animate={{ scale:[0.2,2.2], opacity:[0.7,0] }}
            transition={{ duration:2.5, repeat:Infinity, ease:'easeOut', delay:i*0.6, repeatDelay:0.4 }}
          />
        ))}
        {/* Center supernova */}
        <motion.div
          animate={{ scale:[0.2,4], opacity:[0.35,0] }}
          transition={{ duration:2.8, repeat:Infinity, ease:'easeOut', repeatDelay:0.8 }}
          style={{ position:'absolute', width:100, height:100, left:-50, top:-50, borderRadius:'50%',
                   background:`radial-gradient(circle, ${C(0.45)} 0%, transparent 70%)` }}
        />
      </div>
      {/* Full-width scanning line */}
      <motion.div
        animate={{ top:['15%','85%'] }}
        transition={{ duration:4, repeat:Infinity, ease:'linear', repeatType:'reverse' }}
        style={{ position:'absolute', left:0, right:0, height:1,
                 background:`linear-gradient(to right, transparent, ${C(0.6)} 35%, ${C(0.6)} 65%, transparent)`,
                 boxShadow:`0 0 20px 4px ${C(0.2)}` }}
      />
    </div>
  )
}

function FreezeAura({ active, sceneIndex, isMobile }: { active: boolean; sceneIndex: number; isMobile: boolean }) {
  const shared: React.CSSProperties = { position:'absolute', inset:0, pointerEvents:'none', zIndex:3, overflow:'hidden' }
  return (
    <AnimatePresence mode="wait">
      {active && sceneIndex === 0 && (
        <motion.div key="s0" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          transition={{ duration:0.6 }} style={shared}>
          <Aura0 />
        </motion.div>
      )}
      {active && sceneIndex === 1 && (
        <motion.div key="s1" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          transition={{ duration:0.6 }} style={shared}>
          <Aura1 isMobile={isMobile} />
        </motion.div>
      )}
      {active && sceneIndex === 2 && (
        <motion.div key="s2" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          transition={{ duration:0.6 }} style={shared}>
          <Aura2 />
        </motion.div>
      )}
      {active && sceneIndex === 3 && (
        <motion.div key="s3" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          transition={{ duration:0.6 }} style={shared}>
          <Aura3 />
        </motion.div>
      )}
      {active && sceneIndex === 4 && (
        <motion.div key="s4" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          transition={{ duration:0.6 }} style={shared}>
          <Aura4 isMobile={isMobile} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Scene overlay content ────────────────────────────────────────────────────
function SceneContent({ data, isMobile }: { data: typeof SCENE_DATA[0]; isMobile: boolean }) {
  const [email, setEmail]         = useState('')
  const [submitted, setSubmitted] = useState(false)
  // On mobile: always left-aligned, full width
  const iL = isMobile ? true  : data.align === 'left'
  const iR = isMobile ? false : data.align === 'right'
  const iC = isMobile ? false : data.align === 'center'

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column', justifyContent: isMobile ? 'flex-end' : 'center',
      padding: isMobile
        ? '0 24px clamp(48px,7vh,80px)'
        : iC
          ? 'clamp(80px,10vh,120px) clamp(40px,8vw,140px)'
          : `clamp(80px,10vh,120px) ${iR ? 'clamp(60px,8vw,120px)' : '10%'} clamp(80px,10vh,120px) ${iL ? 'clamp(60px,8vw,120px)' : '10%'}`,
      alignItems: iC ? 'center' : 'flex-start',
      textAlign: 'left',
      maxWidth: isMobile ? '100%' : iC ? '100%' : '55%',
      marginLeft: iR ? 'auto' : undefined,
      pointerEvents: 'none',
    }}>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ fontSize: 9, letterSpacing: '0.36em', textTransform: 'uppercase', color: 'rgba(248,246,242,0.22)', marginBottom: 'clamp(16px,2.5vh,36px)' }}
      >
        {data.step} / 05 &nbsp;·&nbsp; FORMA
      </motion.div>

      <div style={{ marginBottom: 'clamp(12px,2vh,24px)' }}>
        {data.headline.map((line, i) => (
          <div key={i} style={{ overflow: 'hidden' }}>
            <motion.div
              initial={{ y: '108%' }} animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: ease3d, delay: 0.08 + i * 0.12 }}
              style={{
                display: 'block',
                fontFamily: 'var(--font-serif)',
                fontSize: isMobile ? 'clamp(34px,10vw,52px)' : 'clamp(40px,5.8vw,88px)',
                fontWeight: 200, lineHeight: 1.04,
                letterSpacing: '-0.02em', color: 'var(--white)',
              }}
            >
              {line}
            </motion.div>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 'clamp(14px,2.5vh,34px)', flexWrap: 'wrap' }}
      >
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: ease3d, delay: 0.28 }}
          style={{ width: 28, height: 1, marginTop: 6, background: 'rgba(248,246,242,0.28)', transformOrigin: 'left', flexShrink: 0 }}
        />
        <span style={{ fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(248,246,242,0.30)', lineHeight: 1.6 }}>{data.accent}</span>
      </motion.div>

      {data.body && (
        <motion.div
          initial={{ opacity: 0, y: 18, rotateX: 8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, ease: ease3d, delay: 0.38 }}
          style={{ fontSize: 'clamp(12px,3.5vw,15px)', lineHeight: 1.88, color: 'rgba(248,246,242,0.42)', whiteSpace: 'pre-line', maxWidth: isMobile ? '100%' : 380 }}
        >
          {data.body}
        </motion.div>
      )}

      {data.cta && (
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: ease3d, delay: 0.5 }}
          style={{ marginTop: 'clamp(22px,4vh,48px)', pointerEvents: 'auto' }}
        >
          {submitted ? (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontSize: 12, letterSpacing: '0.16em', color: 'rgba(248,246,242,0.5)' }}>
              You&apos;re on the list — we&apos;ll reach out before the drop.
            </motion.p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-start' : 'center', gap: 12 }}>
              <form onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true) }}
                style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 8 : 0, width: isMobile ? '100%' : 'auto' }}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                  style={{ background: 'rgba(248,246,242,0.07)', border: '1px solid rgba(248,246,242,0.18)', borderRight: isMobile ? '1px solid rgba(248,246,242,0.18)' : 'none', borderBottom: isMobile ? 'none' : '1px solid rgba(248,246,242,0.18)', color: 'var(--white)', fontSize: 11, letterSpacing: '0.1em', padding: '14px 18px', outline: 'none', fontFamily: 'inherit', width: isMobile ? '100%' : 210 }} />
                <button type="submit"
                  style={{ background: 'rgba(248,246,242,0.1)', border: '1px solid rgba(248,246,242,0.18)', color: 'var(--white)', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', padding: '14px 24px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', width: isMobile ? '100%' : 'auto' }}>
                  Secure Pair
                </button>
              </form>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(248,246,242,0.2)' }}>New York · hello@forma.co · Free shipping</div>
            </div>
          )}
        </motion.div>
      )}

      {data.id === 'arrival' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, marginTop: 44 }}>
          <div style={{ width: 1, height: 44, background: 'linear-gradient(to bottom, transparent, rgba(248,246,242,0.38))', animation: 'fpulse 2s ease-in-out infinite' }} />
          <span style={{ fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(248,246,242,0.2)' }}>Continue scrolling</span>
        </motion.div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface Props { onLoad: (pct: number) => void; onReady: () => void }

export function VideoScrubber({ onLoad, onReady }: Props) {
  const canvasRef      = useRef<HTMLCanvasElement>(null)
  const sectionRef     = useRef<HTMLDivElement>(null)
  const overlayRef     = useRef<HTMLDivElement>(null)
  const imgsRef        = useRef<HTMLImageElement[]>(Array(TOTAL).fill(null))
  const curFrameRef    = useRef(0)
  const targetFrameRef = useRef(0)
  const rafRef         = useRef<number | null>(null)
  const launchedRef    = useRef(false)

  const [isMobile,    setIsMobile]    = useState(false)
  const [heroReady,   setHeroReady]   = useState(false)
  const [activeScene, setActiveScene] = useState(0)
  const [showOverlay, setShowOverlay] = useState(false)
  const [freezeAura,  setFreezeAura]  = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const paint = useCallback((idx: number) => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const img = imgsRef.current[idx]; if (!img?.complete || !img.naturalWidth) return
    const { width: cw, height: ch } = canvas
    const { naturalWidth: iw, naturalHeight: ih } = img
    const s = Math.max(cw / iw, ch / ih)
    ctx.drawImage(img, (cw - iw * s) / 2, (ch - ih * s) / 2, iw * s, ih * s)
  }, [])

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    paint(Math.round(curFrameRef.current))
  }, [paint])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const src = isMobile ? mobileSrc : desktopSrc
    for (let i = 1; i <= TOTAL; i++) {
      const img = new Image(); const idx = i - 1
      img.onload = () => { if (idx === 0) paint(0) }
      img.src = src(i)
      imgsRef.current[idx] = img
    }

    // RAF smooth lerp — feels like real video
    const tick = () => {
      const cur = curFrameRef.current, tgt = targetFrameRef.current, d = tgt - cur
      if (Math.abs(d) > 0.2) {
        curFrameRef.current = cur + d * 0.10
        paint(Math.round(curFrameRef.current))
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    // Launch immediately — don't wait for images
    if (!launchedRef.current) {
      launchedRef.current = true
      let p = 0
      const fill = setInterval(() => { p = Math.min(p + 10, 100); onLoad(p); if (p >= 100) clearInterval(fill) }, 60)

      setTimeout(() => {
        onReady(); setHeroReady(true)
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top', end: 'bottom bottom',
          onUpdate: (self) => {
            const { frame, sceneIndex, inHold, alpha } = mapProgress(self.progress)
            targetFrameRef.current = frame
            const ov = overlayRef.current; if (ov) ov.style.opacity = String(alpha)
            setActiveScene(prev => prev !== sceneIndex ? sceneIndex : prev)
            setShowOverlay(prev => prev !== inHold ? inHold : prev)
            setFreezeAura(prev => prev !== inHold ? inHold : prev)
          },
        })
      }, 650)
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      ScrollTrigger.getAll().forEach(t => t.kill())
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isMobile, paint, resizeCanvas, onLoad, onReady])

  return (
    <section ref={sectionRef} style={{ height: `${VH_PER_SCENE * SCENES}vh`, position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
        />

        {/* Cinematic vignette */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(2,2,2,0.40) 0%, rgba(2,2,2,0) 28%, rgba(2,2,2,0) 62%, rgba(2,2,2,0.85) 100%)' }} />

        {/* Freeze aura — unique per scene */}
        <FreezeAura active={freezeAura} sceneIndex={activeScene} isMobile={isMobile} />

        {/* Scene overlay */}
        <div ref={overlayRef} style={{ position: 'absolute', inset: 0, zIndex: 4, opacity: 0, perspective: '1400px' }}>
          <AnimatePresence mode="wait">
            {heroReady && showOverlay && (
              <motion.div key={activeScene} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }} style={{ position: 'absolute', inset: 0 }}>
                <SceneContent data={SCENE_DATA[activeScene]} isMobile={isMobile} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Watermark */}
        <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, display: 'flex', justifyContent: 'center', padding: '28px 0', pointerEvents: 'none' }}>
          <span style={{ fontSize: 9, letterSpacing: '0.34em', textTransform: 'uppercase', color: 'rgba(248,246,242,0.14)' }}>FORMA · AW26</span>
        </div>

        {/* Progress dots */}
        <div aria-hidden style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
          {SCENE_DATA.map((s, i) => (
            <div key={s.id} style={{ width: i === activeScene ? 2 : 1, height: i === activeScene ? 32 : 14, background: i === activeScene ? 'rgba(248,246,242,0.65)' : 'rgba(248,246,242,0.18)', borderRadius: 1, transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)' }} />
          ))}
        </div>

        {/* Counter */}
        <div aria-hidden style={{ position: 'absolute', bottom: 28, left: 32, zIndex: 10, fontFamily: 'var(--font-serif)', fontSize: 11, color: 'rgba(248,246,242,0.16)', letterSpacing: '0.1em', pointerEvents: 'none' }}>
          {String(activeScene + 1).padStart(2, '0')} / 05
        </div>
      </div>

      <style>{`@keyframes fpulse{0%,100%{opacity:.18}50%{opacity:.75}}`}</style>
    </section>
  )
}
