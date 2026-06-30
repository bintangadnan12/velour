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

// ─── Freeze Aura — 5 unique effects per scene ────────────────────────────────

const W = 'rgba(248,246,242,'  // white/cream base

// Shared: 3D orbital ring used by Scene 0 and Scene 4
function OrbitalRing({ size, rotateX, rotateZ = 0, duration, reverse = false, ringOpacity, particleDeg, particleSize, particleOpacity, delay = 0 }: {
  size: number; rotateX: number; rotateZ?: number; duration: number; reverse?: boolean
  ringOpacity: number; particleDeg: number[]; particleSize: number; particleOpacity: number; delay?: number
}) {
  const r = size / 2
  return (
    <motion.div
      style={{ position: 'absolute', width: size, height: size, left: -r, top: -r,
               border: `1px solid ${W}${ringOpacity})`, borderRadius: '50%', rotateX, rotateZ }}
      animate={{ rotateZ: reverse ? rotateZ - 360 : rotateZ + 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear', delay, repeatType: 'loop' }}
    >
      {particleDeg.map(deg => {
        const rad = deg * Math.PI / 180
        return <div key={deg} style={{ position: 'absolute', width: particleSize, height: particleSize, borderRadius: '50%',
          background: `${W}${particleOpacity})`,
          left: `calc(50% + ${r * Math.cos(rad)}px - ${particleSize / 2}px)`,
          top:  `calc(50% + ${r * Math.sin(rad)}px - ${particleSize / 2}px)`,
          boxShadow: `0 0 ${particleSize * 2}px ${W}${particleOpacity * 0.5})` }} />
      })}
    </motion.div>
  )
}

// ── Scene 0 — "The Arrival": Shockwave burst rings expanding outward ──────────
function Aura0() {
  const rings = [
    { size: 80,  delay: 0,    dur: 2.8 },
    { size: 180, delay: 0.4,  dur: 3.0 },
    { size: 320, delay: 0.8,  dur: 3.2 },
    { size: 480, delay: 1.2,  dur: 3.4 },
    { size: 650, delay: 1.6,  dur: 3.6 },
  ]
  const burstAngles = Array.from({ length: 12 }, (_, i) => i * 30)
  return (
    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 0, height: 0 }}>
      {rings.map((r, i) => (
        <motion.div key={i}
          style={{ position: 'absolute', width: r.size, height: r.size, left: -r.size / 2, top: -r.size / 2,
                   border: `1px solid ${W}0.22)`, borderRadius: '50%' }}
          animate={{ scale: [0.1, 2.2], opacity: [0.9, 0] }}
          transition={{ duration: r.dur, repeat: Infinity, ease: 'easeOut', delay: r.delay, repeatDelay: 1.2 }}
        />
      ))}
      {burstAngles.map((deg, i) => {
        const rad = deg * Math.PI / 180
        const dist = 160 + (i % 3) * 40
        return (
          <motion.div key={deg}
            style={{ position: 'absolute', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2,
                     borderRadius: '50%', background: `${W}0.7)`, left: -1, top: -1 }}
            animate={{ x: [0, Math.cos(rad) * dist], y: [0, Math.sin(rad) * dist], opacity: [0.9, 0], scale: [1.5, 0.5] }}
            transition={{ duration: 2.4 + (i % 3) * 0.3, repeat: Infinity, ease: 'easeOut', delay: (i * 0.12) % 2, repeatDelay: 0.8 }}
          />
        )
      })}
      <motion.div
        animate={{ scale: [0.6, 2.5], opacity: [0.18, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', repeatDelay: 0.6 }}
        style={{ position: 'absolute', width: 140, height: 140, left: -70, top: -70, borderRadius: '50%',
                 background: `radial-gradient(circle, ${W}0.22) 0%, transparent 70%)` }}
      />
    </div>
  )
}

// ── Scene 1 — "Every Layer": Precision geometric grid + scanning lines ─────────
function Aura1() {
  const hLines = [-120, -60, 0, 60, 120]
  const vLines = [-120, -60, 0, 60, 120]
  const intersections = hLines.flatMap(y => vLines.map(x => ({ x, y })))
  return (
    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 0, height: 0 }}>
      {/* Horizontal grid lines */}
      {hLines.map((y, i) => (
        <motion.div key={`h${i}`}
          style={{ position: 'absolute', height: 1, background: `${W}0.12)`, top: y, left: -200, right: -200 }}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: ease3d, delay: i * 0.1 }}
        />
      ))}
      {/* Vertical grid lines */}
      {vLines.map((x, i) => (
        <motion.div key={`v${i}`}
          style={{ position: 'absolute', width: 1, background: `${W}0.10)`, left: x, top: -160, bottom: -160 }}
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease: ease3d, delay: 0.3 + i * 0.08 }}
        />
      ))}
      {/* Dots at intersections */}
      {intersections.map((pt, i) => (
        <motion.div key={i}
          style={{ position: 'absolute', width: 3, height: 3, borderRadius: '50%', background: `${W}0.45)`,
                   left: pt.x - 1.5, top: pt.y - 1.5, boxShadow: `0 0 6px ${W}0.25)` }}
          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: ease3d, delay: 0.6 + i * 0.025 }}
        />
      ))}
      {/* Scanning laser line — horizontal sweep */}
      <motion.div
        animate={{ y: [-140, 140] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', repeatType: 'reverse' }}
        style={{ position: 'absolute', left: -200, right: -200, height: 1,
                 background: `linear-gradient(to right, transparent, ${W}0.5) 30%, ${W}0.5) 70%, transparent)`,
                 boxShadow: `0 0 12px ${W}0.2)` }}
      />
      {/* Corner brackets */}
      {[[-170,-130],[170,-130],[-170,130],[170,130]].map(([cx,cy],i) => {
        const sx = cx < 0 ? 1 : -1, sy = cy < 0 ? 1 : -1
        return (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.0 + i * 0.1 }}
            style={{ position: 'absolute', left: cx, top: cy, width: 18, height: 18 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 18, height: 1, transformOrigin: `${sx < 0 ? 'right' : 'left'} center`,
                          background: `${W}0.45)` }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 18, transformOrigin: `center ${sy < 0 ? 'bottom' : 'top'}`,
                          background: `${W}0.45)` }} />
          </motion.div>
        )
      })}
    </div>
  )
}

// ── Scene 2 — "Ground Intelligence": Horizontal ground ripple ellipses ─────────
function Aura2() {
  const waves = [
    { w: 180, h: 28,  delay: 0,   dur: 2.6 },
    { w: 320, h: 44,  delay: 0.5, dur: 2.9 },
    { w: 480, h: 62,  delay: 1.0, dur: 3.2 },
    { w: 640, h: 78,  delay: 1.5, dur: 3.5 },
  ]
  return (
    <div style={{ position: 'absolute', left: '50%', top: '62%', transform: 'translate(-50%,-50%)', width: 0, height: 0 }}>
      {waves.map((w, i) => (
        <motion.div key={i}
          style={{ position: 'absolute', left: -w.w / 2, top: -w.h / 2,
                   width: w.w, height: w.h, borderRadius: '50%',
                   border: `1px solid ${W}0.28)` }}
          animate={{ scale: [0.2, 1.8], opacity: [0.75, 0] }}
          transition={{ duration: w.dur, repeat: Infinity, ease: 'easeOut', delay: w.delay, repeatDelay: 0.5 }}
        />
      ))}
      {/* Static base ellipse */}
      <motion.div
        animate={{ opacity: [0.08, 0.22, 0.08] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', left: -130, top: -20, width: 260, height: 40, borderRadius: '50%',
                 border: `1px solid ${W}0.35)`, boxShadow: `0 0 30px ${W}0.06)` }}
      />
      {/* Vertical connection lines — like sole touching ground */}
      {[-60, 0, 60].map((x, i) => (
        <motion.div key={i}
          animate={{ scaleY: [0, 1, 0], opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 + 0.8 }}
          style={{ position: 'absolute', left: x, top: -60, width: 1, height: 60,
                   background: `linear-gradient(to bottom, transparent, ${W}0.3))`, transformOrigin: 'top' }}
        />
      ))}
    </div>
  )
}

// ── Scene 3 — "Skin-Grade Leather": Flowing organic arcs + ribbon waves ────────
function Aura3() {
  const arcs = [
    { size: 200, rotateZ: 0,   dur: 8,  opacity: 0.14, reverse: false },
    { size: 300, rotateZ: 30,  dur: 12, opacity: 0.10, reverse: true  },
    { size: 160, rotateZ: -20, dur: 6,  opacity: 0.18, reverse: false },
    { size: 420, rotateZ: 60,  dur: 16, opacity: 0.07, reverse: true  },
  ]
  return (
    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 0, height: 0 }}>
      {/* Breathing arcs — quarter-circle with organic rotation */}
      {arcs.map((a, i) => (
        <motion.div key={i}
          style={{ position: 'absolute', width: a.size, height: a.size, left: -a.size / 2, top: -a.size / 2,
                   borderRadius: '50%', border: `1px solid ${W}${a.opacity})`,
                   clipPath: 'inset(0 50% 50% 0 round 50%)' }}
          animate={{ rotate: a.reverse ? [a.rotateZ, a.rotateZ - 360] : [a.rotateZ, a.rotateZ + 360],
                     scale: [0.92, 1.08, 0.92] }}
          transition={{ rotate: { duration: a.dur, repeat: Infinity, ease: 'linear' },
                        scale: { duration: a.dur * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 } }}
        />
      ))}
      {/* Flowing ribbon lines — organic sine-wave feel via rotation stagger */}
      {[0, 45, 90, 135].map((angle, i) => (
        <motion.div key={`r${i}`}
          style={{ position: 'absolute', width: 280, height: 1, left: -140,
                   background: `linear-gradient(to right, transparent, ${W}0.18) 30%, ${W}0.18) 70%, transparent)`,
                   rotate: angle }}
          animate={{ scaleX: [0.4, 1.2, 0.4], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}
      {/* Soft center organic glow */}
      <motion.div
        animate={{ scale: [0.7, 1.3, 0.7], opacity: [0.04, 0.12, 0.04] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', width: 160, height: 160, left: -80, top: -80, borderRadius: '40% 60% 55% 45% / 50% 45% 55% 50%',
                 background: `radial-gradient(ellipse, ${W}1) 0%, transparent 65%)` }}
      />
    </div>
  )
}

// ── Scene 4 — "FORMA 001": Grand finale — all systems combined ────────────────
function Aura4() {
  const p6 = Array.from({ length: 6  }, (_, i) => i * 60)
  const p8 = Array.from({ length: 8  }, (_, i) => i * 45)
  const p4 = Array.from({ length: 4  }, (_, i) => i * 90)
  const burst = Array.from({ length: 16 }, (_, i) => i * 22.5)
  return (
    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 0, height: 0, perspective: '700px', transformStyle: 'preserve-3d' }}>
      {/* Orbital ring system */}
      <OrbitalRing size={400} rotateX={68} rotateZ={10}  duration={20}    ringOpacity={0.16} particleDeg={p6} particleSize={2.5} particleOpacity={0.45} />
      <OrbitalRing size={270} rotateX={80} rotateZ={-40} duration={14} reverse ringOpacity={0.12} particleDeg={p4} particleSize={3}   particleOpacity={0.35} delay={-3} />
      <OrbitalRing size={170} rotateX={55} rotateZ={55}  duration={9}     ringOpacity={0.10} particleDeg={p8} particleSize={1.5} particleOpacity={0.28} delay={-5} />
      {/* Burst particles — biggest energy */}
      {burst.map((deg, i) => {
        const rad = deg * Math.PI / 180, dist = 200 + (i % 4) * 35
        return (
          <motion.div key={deg}
            style={{ position: 'absolute', width: 2, height: 2, borderRadius: '50%', background: `${W}0.8)`, left: -1, top: -1 }}
            animate={{ x: [0, Math.cos(rad) * dist], y: [0, Math.sin(rad) * dist], opacity: [1, 0], scale: [2, 0.5] }}
            transition={{ duration: 2.8 + (i % 3) * 0.4, repeat: Infinity, ease: 'easeOut', delay: (i * 0.15) % 2.5, repeatDelay: 0.6 }}
          />
        )
      })}
      {/* Ground echo */}
      {[1,2,3].map(i => (
        <motion.div key={`g${i}`}
          style={{ position: 'absolute', left: -120, top: 100 + i * 22, width: 240, height: 28, borderRadius: '50%',
                   border: `1px solid ${W}0.14)` }}
          animate={{ scale: [0.3, 2], opacity: [0.6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: i * 0.7, repeatDelay: 0.4 }}
        />
      ))}
      {/* Center nova */}
      <motion.div
        animate={{ scale: [0.4, 2.8], opacity: [0.22, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', repeatDelay: 1 }}
        style={{ position: 'absolute', width: 80, height: 80, left: -40, top: -40, borderRadius: '50%',
                 background: `radial-gradient(circle, ${W}0.3) 0%, transparent 70%)` }}
      />
      {/* Scanning line */}
      <motion.div
        animate={{ y: [-200, 200] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatType: 'reverse' }}
        style={{ position: 'absolute', left: -250, right: -250, height: 1,
                 background: `linear-gradient(to right, transparent, ${W}0.35) 40%, ${W}0.35) 60%, transparent)`,
                 boxShadow: `0 0 14px ${W}0.15)` }}
      />
    </div>
  )
}

function FreezeAura({ active, sceneIndex }: { active: boolean; sceneIndex: number }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={`aura-${sceneIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3, overflow: 'hidden' }}
        >
          {sceneIndex === 0 && <Aura0 />}
          {sceneIndex === 1 && <Aura1 />}
          {sceneIndex === 2 && <Aura2 />}
          {sceneIndex === 3 && <Aura3 />}
          {sceneIndex === 4 && <Aura4 />}
          {/* Ambient light sweep — all scenes */}
          <motion.div
            animate={{ x: ['-130%', '230%'] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear', delay: 2 }}
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(106deg, transparent 40%, rgba(248,246,242,0.016) 50%, transparent 60%)' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Scene overlay content ────────────────────────────────────────────────────
function SceneContent({ data }: { data: typeof SCENE_DATA[0] }) {
  const [email, setEmail]         = useState('')
  const [submitted, setSubmitted] = useState(false)
  const iL = data.align === 'left', iR = data.align === 'right', iC = data.align === 'center'

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: iC
        ? 'clamp(80px,10vh,120px) clamp(40px,8vw,140px)'
        : `clamp(80px,10vh,120px) ${iR ? 'clamp(60px,8vw,120px)' : '10%'} clamp(80px,10vh,120px) ${iL ? 'clamp(60px,8vw,120px)' : '10%'}`,
      alignItems: iC ? 'center' : iL ? 'flex-start' : 'flex-end',
      textAlign:  iC ? 'center' : iL ? 'left'        : 'right',
      maxWidth:   iC ? '100%' : '55%',
      marginLeft: iR ? 'auto' : undefined,
      pointerEvents: 'none',
    }}>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ fontSize: 9, letterSpacing: '0.36em', textTransform: 'uppercase', color: 'rgba(248,246,242,0.22)', marginBottom: 'clamp(20px,3vh,36px)' }}
      >
        {data.step} / 05 &nbsp;·&nbsp; FORMA
      </motion.div>

      <div style={{ marginBottom: 'clamp(14px,2vh,24px)' }}>
        {data.headline.map((line, i) => (
          <div key={i} style={{ overflow: 'hidden' }}>
            <motion.div
              initial={{ y: '108%' }} animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: ease3d, delay: 0.08 + i * 0.12 }}
              style={{
                display: 'block',
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(40px,5.8vw,88px)',
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
        style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 'clamp(18px,3vh,34px)', justifyContent: iC ? 'center' : iR ? 'flex-end' : 'flex-start' }}
      >
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: ease3d, delay: 0.28 }}
          style={{ width: 36, height: 1, background: 'rgba(248,246,242,0.28)', transformOrigin: iR ? 'right' : 'left', flexShrink: 0 }}
        />
        <span style={{ fontSize: 8, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(248,246,242,0.30)', whiteSpace: 'nowrap' }}>{data.accent}</span>
      </motion.div>

      {data.body && (
        <motion.div
          initial={{ opacity: 0, y: 18, rotateX: 8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, ease: ease3d, delay: 0.38 }}
          style={{ fontSize: 'clamp(12px,1.25vw,15px)', lineHeight: 1.88, color: 'rgba(248,246,242,0.42)', whiteSpace: 'pre-line', maxWidth: 380, alignSelf: iC ? 'center' : undefined }}
        >
          {data.body}
        </motion.div>
      )}

      {data.cta && (
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: ease3d, delay: 0.5 }}
          style={{ marginTop: 'clamp(28px,4vh,48px)', pointerEvents: 'auto', alignSelf: iC ? 'center' : undefined }}
        >
          {submitted ? (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontSize: 12, letterSpacing: '0.16em', color: 'rgba(248,246,242,0.5)' }}>
              You&apos;re on the list — we&apos;ll reach out before the drop.
            </motion.p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <form onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true) }} style={{ display: 'flex' }}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                  style={{ background: 'rgba(248,246,242,0.07)', border: '1px solid rgba(248,246,242,0.18)', borderRight: 'none', color: 'var(--white)', fontSize: 11, letterSpacing: '0.1em', padding: '14px 22px', outline: 'none', fontFamily: 'inherit', width: 210 }} />
                <button type="submit"
                  style={{ background: 'rgba(248,246,242,0.1)', border: '1px solid rgba(248,246,242,0.18)', color: 'var(--white)', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', padding: '14px 24px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
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
        <FreezeAura active={freezeAura} sceneIndex={activeScene} />

        {/* Scene overlay */}
        <div ref={overlayRef} style={{ position: 'absolute', inset: 0, zIndex: 4, opacity: 0, perspective: '1400px' }}>
          <AnimatePresence mode="wait">
            {heroReady && showOverlay && (
              <motion.div key={activeScene} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }} style={{ position: 'absolute', inset: 0 }}>
                <SceneContent data={SCENE_DATA[activeScene]} />
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
