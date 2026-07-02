'use client'
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BRAND, SCENES as SCENE_DATA, INTEGRATIONS } from '@/config/site'
import { WebGLOverlay, type ScrollState } from '@/components/WebGLOverlay'

// ─── Constants ────────────────────────────────────────────────────────────────
const TOTAL        = BRAND.totalFrames
const SCENES       = 5
const VH_PER_SCENE = 700

const SCRUB_END = 0.10
const HOLD_END  = 0.90

const KEY_FRAMES:   number[] = [...BRAND.keyFrames]
const START_FRAMES: number[] = [...BRAND.startFrames]

const pad = (i: number) => String(i).padStart(4, '0')
const desktopSrc = (i: number) => `/frames/frame${pad(i)}.jpg`
const mobileSrc  = (i: number) => `/frames-mobile/frame${pad(i)}.jpg`

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

// ── Scene 0 — THE ARRIVAL: Chromatic aberration shockwave + radial burst + glitch
function Aura0({ isMobile }: { isMobile: boolean }) {
  const nLines = isMobile ? 16 : 28
  const lineLen = isMobile ? 200 : 360
  const rings = [80, 180, 320, 500, 700]
  return (
    <div style={AURA_WRAP}>
      <div style={{ position:'absolute', left:'50%', top:'50%', width:0, height:0 }}>
        {/* Chromatic aberration rings — 3 colour channels offset */}
        {rings.flatMap((sz, ri) =>
          ([
            ['rgba(255,55,55,', -6],
            ['rgba(248,246,242,', 0],
            ['rgba(55,120,255,', 6],
          ] as [string, number][]).map(([col, ox], ci) => (
            <motion.div key={`${ri}-${ci}`}
              style={{ position:'absolute', width:sz, height:sz,
                       left:-sz/2+(ox as number), top:-sz/2,
                       borderRadius:'50%',
                       border:`${ci===1?'1.5px':'1px'} solid ${col}${ci===1?0.75:0.55})`,
                       mixBlendMode: ci===1 ? 'normal' : 'screen' as const }}
              animate={{ scale:[0.04, 3], opacity:[ci===1?1:0.85, 0] }}
              transition={{ duration:2.2+ri*0.28, repeat:Infinity, ease:[0.12,0,0.8,1] as const,
                            delay:ri*0.42+(ci as number)*0.05, repeatDelay:0.35 }}
            />
          ))
        )}
        {/* Radial speed streaks */}
        {Array.from({length:nLines}, (_,i) => i*(360/nLines)).map((angle, i) => (
          <motion.div key={`sl-${i}`}
            style={{ position:'absolute', left:0, top:-0.5,
                     width:lineLen, height:1,
                     background:'linear-gradient(to right, rgba(248,246,242,0.95), transparent)',
                     transformOrigin:'left center', rotate:angle }}
            animate={{ scaleX:[0,1,0], opacity:[0,1,0] }}
            transition={{ duration:0.42, repeat:Infinity, ease:'easeOut',
                          delay:(i*0.038)%0.85, repeatDelay:2.5 }} />
        ))}
        {/* Center supernova flash */}
        <motion.div
          animate={{ scale:[0,6], opacity:[0.9,0] }}
          transition={{ duration:1.8, repeat:Infinity, ease:'easeOut', repeatDelay:1.3 }}
          style={{ position:'absolute', width:20, height:20, left:-10, top:-10, borderRadius:'50%',
                   background:'white', mixBlendMode:'screen' as const }} />
      </div>
      {/* Glitch bands */}
      {[14, 38, 63, 82].map((pct, i) => (
        <motion.div key={i}
          style={{ position:'absolute', left:0, right:0, top:`${pct}%`, height: i%2===0 ? 3 : 5, overflow:'hidden' }}
          animate={{ x:[0, i%2===0 ? -30 : 22, i%2===0 ? 12 : -15, 0], opacity:[0,1,1,0] }}
          transition={{ duration:0.09, repeat:Infinity, ease:'linear', delay:0.7+i*0.65, repeatDelay:4 }}>
          <div style={{ position:'absolute', inset:0, background:'rgba(248,246,242,0.25)' }} />
        </motion.div>
      ))}
    </div>
  )
}

// ── Scene 1 — EVERY LAYER: Engineering blueprint crosshair + dual laser scan ───
function Aura1({ isMobile }: { isMobile: boolean }) {
  const labels = isMobile ? [] : [
    { text:'08 COMPONENTS', style:{ left:'3%', top:'7%' } as React.CSSProperties },
    { text:'03 MATERIALS',  style:{ right:'3%', top:'7%' } as React.CSSProperties },
    { text:'ZERO EXCESS',   style:{ left:'3%', bottom:'7%' } as React.CSSProperties },
    { text:'12mm STACK',    style:{ right:'3%', bottom:'7%' } as React.CSSProperties },
  ]
  const ticks = [-30,-20,-10,10,20,30]
  return (
    <div style={AURA_WRAP}>
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}
           viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {Array.from({length:19}, (_,i)=>(i+1)*5).flatMap(v=>[
          <line key={`h${v}`} x1="0" y1={v} x2="100" y2={v} stroke={C(0.08)} strokeWidth="0.06"/>,
          <line key={`v${v}`} x1={v} y1="0" x2={v} y2="100" stroke={C(0.08)} strokeWidth="0.06"/>
        ])}
        <line x1="0" y1="50" x2="43" y2="50" stroke={C(0.4)} strokeWidth="0.14" strokeDasharray="2,2.5"/>
        <line x1="57" y1="50" x2="100" y2="50" stroke={C(0.4)} strokeWidth="0.14" strokeDasharray="2,2.5"/>
        <line x1="50" y1="0" x2="50" y2="43" stroke={C(0.4)} strokeWidth="0.14" strokeDasharray="2,2.5"/>
        <line x1="50" y1="57" x2="50" y2="100" stroke={C(0.4)} strokeWidth="0.14" strokeDasharray="2,2.5"/>
        <circle cx="50" cy="50" r="7"  fill="none" stroke={C(0.55)} strokeWidth="0.24"/>
        <circle cx="50" cy="50" r="14" fill="none" stroke={C(0.32)} strokeWidth="0.15"/>
        <circle cx="50" cy="50" r="22" fill="none" stroke={C(0.2)}  strokeWidth="0.11"/>
        <circle cx="50" cy="50" r="32" fill="none" stroke={C(0.12)} strokeWidth="0.09"/>
        {ticks.flatMap(o=>[
          <line key={`ht${o}`} x1={50+o} y1="48.6" x2={50+o} y2="51.4" stroke={C(0.4)} strokeWidth="0.2"/>,
          <line key={`vt${o}`} x1="48.6" y1={50+o} x2="51.4" y2={50+o} stroke={C(0.4)} strokeWidth="0.2"/>
        ])}
        <path d="M4,4 L4,13 M4,4 L13,4"     stroke={C(0.65)} strokeWidth="0.38" fill="none"/>
        <path d="M96,4 L96,13 M96,4 L87,4"   stroke={C(0.65)} strokeWidth="0.38" fill="none"/>
        <path d="M4,96 L4,87 M4,96 L13,96"   stroke={C(0.65)} strokeWidth="0.38" fill="none"/>
        <path d="M96,96 L96,87 M96,96 L87,96" stroke={C(0.65)} strokeWidth="0.38" fill="none"/>
      </svg>
      <motion.div
        animate={{ top:['7%','93%'] }}
        transition={{ duration:3, repeat:Infinity, ease:'linear', repeatType:'reverse' }}
        style={{ position:'absolute', left:0, right:0, height:2,
                 background:`linear-gradient(to right, transparent, ${C(0.95)} 20%, ${C(0.95)} 80%, transparent)`,
                 boxShadow:`0 0 18px 6px ${C(0.35)}` }} />
      <motion.div
        animate={{ left:['7%','93%'] }}
        transition={{ duration:4, repeat:Infinity, ease:'linear', repeatType:'reverse', delay:0.9 }}
        style={{ position:'absolute', top:0, bottom:0, width:2,
                 background:`linear-gradient(to bottom, transparent, ${C(0.65)} 20%, ${C(0.65)} 80%, transparent)`,
                 boxShadow:`0 0 18px 6px ${C(0.22)}` }} />
      {labels.map((l, i) => (
        <motion.div key={i}
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay:0.5+i*0.1, duration:0.4 }}
          style={{ position:'absolute', fontSize:7, letterSpacing:'0.24em',
                   textTransform:'uppercase', color:C(0.4),
                   fontFamily:'var(--font-sans)', ...l.style }}>
          {l.text}
        </motion.div>
      ))}
    </div>
  )
}

// ── Scene 2 — GROUND INTELLIGENCE: Rotating radar sweep + sonar blips ─────────
function Aura2({ isMobile }: { isMobile: boolean }) {
  const R = isMobile ? 110 : 190
  const blips = useMemo(() => [
    {fx:0.56,fy:0.62,d:0.4},{fx:0.71,fy:0.56,d:1.2},{fx:0.36,fy:0.69,d:2.0},
    {fx:0.63,fy:0.73,d:0.8},{fx:0.43,fy:0.59,d:2.5},{fx:0.77,fy:0.66,d:1.5},
    {fx:0.30,fy:0.74,d:3.1},{fx:0.68,fy:0.60,d:1.8},
  ], [])
  return (
    <div style={AURA_WRAP}>
      {[1, 1.6, 2.4, 3.5].map((scale, i) => {
        const w = R*2*scale, h = R*0.26*scale
        return (
          <div key={i} style={{ position:'absolute',
            left:`calc(50% - ${w/2}px)`, top:`calc(65% - ${h/2}px)`,
            width:w, height:h, borderRadius:'50%',
            border:`1px solid ${C(Math.max(0.04, 0.16 - i*0.04))}` }} />
        )
      })}
      <div style={{ position:'absolute', left:'50%', top:'65%',
                    transform:'translate(-50%,-50%)', width:0, height:0 }}>
        <motion.div
          animate={{ rotate:[0,360] }}
          transition={{ duration:3.2, repeat:Infinity, ease:'linear' }}
          style={{ position:'absolute',
                   width:R*4.6, height:R*0.55,
                   left:-R*2.3, top:-R*0.275,
                   borderRadius:'50%',
                   background:`conic-gradient(from 0deg, ${C(0.09)} 0deg, ${C(0.04)} 45deg, transparent 75deg, transparent 360deg)` }} />
        <motion.div
          animate={{ rotate:[0,360] }}
          transition={{ duration:3.2, repeat:Infinity, ease:'linear' }}
          style={{ position:'absolute', left:0, top:0, width:0, height:0 }}>
          <div style={{ position:'absolute', left:0, top:-2,
                        width:R*2.3, height:4,
                        background:`linear-gradient(to right, ${C(1)}, ${C(0.55)} 35%, transparent)`,
                        boxShadow:`0 0 14px 5px ${C(0.55)}, 0 0 4px 1px white` }} />
        </motion.div>
        <div style={{ position:'absolute', width:10, height:10, left:-5, top:-5,
                      borderRadius:'50%', background:C(0.9), boxShadow:`0 0 14px 4px ${C(0.6)}` }} />
        {blips.map((b, i) => (
          <motion.div key={i}
            style={{ position:'absolute',
                     left: (b.fx - 0.5) * R * 4.6,
                     top:  (b.fy - 0.65) * R * 2.2,
                     width:5, height:5, borderRadius:'50%',
                     background:C(1), boxShadow:`0 0 12px 4px ${C(0.75)}` }}
            animate={{ opacity:[0,1,0.9,0], scale:[0,1.8,1,0] }}
            transition={{ duration:2.8, repeat:Infinity, ease:'easeOut', delay:b.d, repeatDelay:1.2 }} />
        ))}
      </div>
      <motion.div
        animate={{ opacity:[0.28,0.85,0.28] }}
        transition={{ duration:1.6, repeat:Infinity, ease:'easeInOut' }}
        style={{ position:'absolute', bottom:'7%', right:'4%',
                 fontSize:8, letterSpacing:'0.3em', textTransform:'uppercase',
                 color:C(0.6), fontFamily:'var(--font-sans)' }}>
        ● SCAN ACTIVE
      </motion.div>
    </div>
  )
}

// ── Scene 3 — SKIN-GRADE LEATHER: Isocontour wave field + grain texture ───────
function Aura3({ isMobile }: { isMobile: boolean }) {
  const lineCount = isMobile ? 14 : 22
  const grains = useMemo(() =>
    Array.from({length: isMobile ? 35 : 70}, () => ({
      x:  5 + Math.random() * 90,
      y:  8 + Math.random() * 84,
      s:  0.8 + Math.random() * 2,
      o:  0.1 + Math.random() * 0.3,
      dur:2.5 + Math.random() * 3.5,
      del:Math.random() * 5,
    })), [isMobile])
  return (
    <div style={AURA_WRAP}>
      {Array.from({length:lineCount}, (_, i) => {
        const topPct = 12 + (i / (lineCount-1)) * 76
        const baseOp = 0.05 + Math.sin((i/(lineCount-1)) * Math.PI) * 0.22
        const amp    = 5 + (i % 4) * 5
        const dur    = 3.5 + (i % 5) * 0.9
        return (
          <motion.div key={i}
            style={{ position:'absolute', left:0, right:0, height:1, top:`${topPct}%`,
                     background:`linear-gradient(to right, transparent, ${C(baseOp)} 12%, ${C(baseOp)} 88%, transparent)` }}
            animate={{ y:[-amp, amp, -amp] }}
            transition={{ duration: dur, repeat:Infinity, ease:'easeInOut', delay:i*0.22 }} />
        )
      })}
      {grains.map((g, i) => (
        <motion.div key={i}
          style={{ position:'absolute', left:`${g.x}%`, top:`${g.y}%`,
                   width:g.s, height:g.s, borderRadius:'50%', background:C(g.o) }}
          animate={{ opacity:[g.o*0.3, g.o, g.o*0.3] }}
          transition={{ duration:g.dur, repeat:Infinity, ease:'easeInOut', delay:g.del }} />
      ))}
      <motion.div
        animate={{ scale:[0.85,1.3,0.85], opacity:[0.07,0.22,0.07] }}
        transition={{ duration:5.5, repeat:Infinity, ease:'easeInOut' }}
        style={{ position:'absolute', left:'50%', top:'50%',
                 width:isMobile?280:500, height:isMobile?180:320,
                 transform:'translate(-50%,-50%)',
                 borderRadius:'38% 62% 50% 50% / 45% 45% 55% 55%',
                 background:`radial-gradient(ellipse, ${C(1)} 0%, transparent 65%)` }} />
      {!isMobile && (
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1, duration:0.6 }}
          style={{ position:'absolute', left:'4%', bottom:'9%',
                   fontSize:7, letterSpacing:'0.26em', color:C(0.32),
                   textTransform:'uppercase', fontFamily:'var(--font-sans)', lineHeight:2 }}>
          FULL-GRAIN CALFSKIN<br/>NATURALLY TANNED<br/>2.8mm THICKNESS
        </motion.div>
      )}
    </div>
  )
}

// ── Scene 4 — FORMA 001: All systems — orbital + burst + radar + glitch ────────
function Aura4({ isMobile }: { isMobile: boolean }) {
  const op = (n: number) => Array.from({length:n}, (_,i) => i*(360/n))
  const burstN  = isMobile ? 18 : 28
  const ringSz  = isMobile ? [200,130,78] : [380,255,155]
  return (
    <div style={AURA_WRAP}>
      <div style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)',
                    width:0, height:0, perspective:'800px', transformStyle:'preserve-3d' }}>
        {([
          { sz:ringSz[0], rx:65, rz:10,  dur:22, rev:false, op:0.5,  pDeg:op(7), ps:3,   po:0.7  },
          { sz:ringSz[1], rx:78, rz:-45, dur:14, rev:true,  op:0.38, pDeg:op(5), ps:3.5, po:0.55, dl:-3 },
          { sz:ringSz[2], rx:50, rz:60,  dur:9,  rev:false, op:0.28, pDeg:op(8), ps:2,   po:0.45, dl:-6 },
        ] as Array<{sz:number,rx:number,rz:number,dur:number,rev:boolean,op:number,pDeg:number[],ps:number,po:number,dl?:number}>)
        .map((r, i) => {
          const half = r.sz/2
          return (
            <motion.div key={i}
              style={{ position:'absolute', width:r.sz, height:r.sz, left:-half, top:-half,
                       border:`1.5px solid ${C(r.op)}`, borderRadius:'50%',
                       rotateX:r.rx, rotateZ:r.rz }}
              animate={{ rotateZ: r.rev ? r.rz-360 : r.rz+360 }}
              transition={{ duration:r.dur, repeat:Infinity, ease:'linear',
                            delay:r.dl ?? 0, repeatType:'loop' }}>
              {r.pDeg.map(deg => {
                const rad = deg*Math.PI/180
                return <div key={deg} style={{ position:'absolute', width:r.ps, height:r.ps,
                  borderRadius:'50%', background:C(r.po),
                  boxShadow:`0 0 ${r.ps*3}px ${C(r.po*0.7)}`,
                  left:`calc(50% + ${half*Math.cos(rad)}px - ${r.ps/2}px)`,
                  top: `calc(50% + ${half*Math.sin(rad)}px - ${r.ps/2}px)` }} />
              })}
            </motion.div>
          )
        })}
      </div>
      <div style={CENTER}>
        {Array.from({length:burstN}, (_,i) => i*(360/burstN)).map((angle, i) => {
          const rad = angle*Math.PI/180
          const d   = (isMobile?150:240) + (i%5)*38
          return (
            <motion.div key={i}
              style={{ position:'absolute', width:2.5, height:2.5, borderRadius:'50%',
                       background:C(0.95), left:-1.5, top:-1.5, boxShadow:`0 0 8px ${C(0.7)}` }}
              animate={{ x:[0,Math.cos(rad)*d], y:[0,Math.sin(rad)*d], opacity:[1,0], scale:[2.5,0.2] }}
              transition={{ duration:2.2+(i%4)*0.3, repeat:Infinity, ease:'easeOut',
                            delay:(i*0.09)%1.8, repeatDelay:0.5 }} />
          )
        })}
      </div>
      <div style={{ position:'absolute', left:'50%', top:'65%',
                    transform:'translate(-50%,-50%)', width:0, height:0 }}>
        <motion.div
          animate={{ rotate:[0,360] }}
          transition={{ duration:3.5, repeat:Infinity, ease:'linear' }}
          style={{ position:'absolute', left:0, top:0, width:0, height:0 }}>
          <div style={{ position:'absolute', left:0, top:-1.5,
                        width:isMobile?180:280, height:3,
                        background:`linear-gradient(to right, ${C(0.9)}, ${C(0.4)} 40%, transparent)`,
                        boxShadow:`0 0 10px 3px ${C(0.45)}` }} />
        </motion.div>
      </div>
      {[20, 52, 76].map((pct, i) => (
        <motion.div key={i}
          style={{ position:'absolute', left:0, right:0, top:`${pct}%`, height:i%2===0?3:5 }}
          animate={{ x:[0, i%2===0?-26:18, 0], opacity:[0,1,0] }}
          transition={{ duration:0.08, repeat:Infinity, delay:1.2+i*0.9, repeatDelay:4 }}>
          <div style={{ position:'absolute', inset:0, background:'rgba(248,246,242,0.28)' }} />
        </motion.div>
      ))}
      <motion.div
        animate={{ top:['10%','90%'] }}
        transition={{ duration:4.5, repeat:Infinity, ease:'linear', repeatType:'reverse' }}
        style={{ position:'absolute', left:0, right:0, height:1.5,
                 background:`linear-gradient(to right, transparent, ${C(0.7)} 25%, ${C(0.7)} 75%, transparent)`,
                 boxShadow:`0 0 22px 7px ${C(0.25)}` }} />
      {!isMobile && (
        <motion.div
          animate={{ opacity:[0,1,1,0] }}
          transition={{ duration:0.25, repeat:Infinity, times:[0,0.12,0.88,1], repeatDelay:5, delay:1.5 }}
          style={{ position:'absolute', top:'11%', left:'50%', transform:'translateX(-50%)',
                   fontFamily:'var(--font-serif)', fontSize:28, fontWeight:200,
                   letterSpacing:'0.38em', textTransform:'uppercase', color:C(0.95),
                   textShadow:`0 0 40px ${C(0.7)}, 0 0 80px ${C(0.35)}`,
                   whiteSpace:'nowrap' }}>
          {BRAND.name} {SCENE_DATA[4]?.headline[1] ?? '001'}
        </motion.div>
      )}
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
          <Aura0 isMobile={isMobile} />
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
          <Aura2 isMobile={isMobile} />
        </motion.div>
      )}
      {active && sceneIndex === 3 && (
        <motion.div key="s3" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          transition={{ duration:0.6 }} style={shared}>
          <Aura3 isMobile={isMobile} />
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
        {data.step} / 05 &nbsp;·&nbsp; {BRAND.name}
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
              {INTEGRATIONS.email.successMsg}
            </motion.p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-start' : 'center', gap: 12 }}>
              {/* Email form */}
              {INTEGRATIONS.email.enabled && (
                <form onSubmit={async e => {
                  e.preventDefault()
                  if (!email) return
                  if (INTEGRATIONS.email.apiEndpoint) {
                    await fetch(INTEGRATIONS.email.apiEndpoint, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email }),
                    }).catch(() => {})
                  }
                  setSubmitted(true)
                }}
                  style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 8 : 0, width: isMobile ? '100%' : 'auto' }}>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder={INTEGRATIONS.email.placeholder} required
                    style={{ background: 'rgba(248,246,242,0.07)', border: '1px solid rgba(248,246,242,0.18)', borderRight: isMobile ? '1px solid rgba(248,246,242,0.18)' : 'none', borderBottom: isMobile ? 'none' : '1px solid rgba(248,246,242,0.18)', color: 'var(--white)', fontSize: 11, letterSpacing: '0.1em', padding: '14px 18px', outline: 'none', fontFamily: 'inherit', width: isMobile ? '100%' : 210 }} />
                  <button type="submit"
                    style={{ background: 'rgba(248,246,242,0.1)', border: '1px solid rgba(248,246,242,0.18)', color: 'var(--white)', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', padding: '14px 24px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', width: isMobile ? '100%' : 'auto' }}>
                    {INTEGRATIONS.email.buttonLabel}
                  </button>
                </form>
              )}

              {/* WhatsApp button */}
              {INTEGRATIONS.whatsapp.enabled && (
                <a href={`https://wa.me/${INTEGRATIONS.whatsapp.number}?text=${encodeURIComponent(INTEGRATIONS.whatsapp.message)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.35)', color: 'var(--white)', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', padding: '14px 24px', textDecoration: 'none', fontFamily: 'inherit', whiteSpace: 'nowrap', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  {INTEGRATIONS.whatsapp.label}
                </a>
              )}

              {/* Store link */}
              {INTEGRATIONS.store.enabled && (
                <a href={INTEGRATIONS.store.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(248,246,242,0.1)', border: '1px solid rgba(248,246,242,0.25)', color: 'var(--white)', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', padding: '14px 24px', textDecoration: 'none', fontFamily: 'inherit', whiteSpace: 'nowrap', width: isMobile ? '100%' : 'auto' }}>
                  {INTEGRATIONS.store.label}
                </a>
              )}

              <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(248,246,242,0.2)' }}>
                {BRAND.city} · {BRAND.name.toLowerCase()}@brand.co · Free shipping
              </div>
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

  // WebGL scroll state — updated every ScrollTrigger tick, read every Three.js frame
  const glStateRef = useRef<ScrollState>({ sceneIndex: 0, inHold: false, velocity: 0, alpha: 0 })
  const prevProgressRef = useRef(0)

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
            // Update WebGL state ref (no re-render)
            const velocity = self.progress - prevProgressRef.current
            prevProgressRef.current = self.progress
            glStateRef.current = { sceneIndex, inHold, velocity, alpha }
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

        {/* Three.js WebGL overlay — scroll-driven particles + shaders */}
        <WebGLOverlay stateRef={glStateRef} />

        {/* Freeze aura — unique per scene */}
        <FreezeAura active={freezeAura} sceneIndex={activeScene} isMobile={isMobile} />

        {/* Scene overlay */}
        <div ref={overlayRef} style={{ position: 'absolute', inset: 0, zIndex: 5, opacity: 0, perspective: '1400px' }}>
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
        <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 6, display: 'flex', justifyContent: 'center', padding: '28px 0', pointerEvents: 'none' }}>
          <span style={{ fontSize: 9, letterSpacing: '0.34em', textTransform: 'uppercase', color: 'rgba(248,246,242,0.14)' }}>FORMA · AW26</span>
        </div>

        {/* Progress dots */}
        <div aria-hidden style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', zIndex: 6, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
          {SCENE_DATA.map((s, i) => (
            <div key={s.id} style={{ width: i === activeScene ? 2 : 1, height: i === activeScene ? 32 : 14, background: i === activeScene ? 'rgba(248,246,242,0.65)' : 'rgba(248,246,242,0.18)', borderRadius: 1, transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)' }} />
          ))}
        </div>

        {/* Counter */}
        <div aria-hidden style={{ position: 'absolute', bottom: 28, left: 32, zIndex: 6, fontFamily: 'var(--font-serif)', fontSize: 11, color: 'rgba(248,246,242,0.16)', letterSpacing: '0.1em', pointerEvents: 'none' }}>
          {String(activeScene + 1).padStart(2, '0')} / 05
        </div>
      </div>

      <style>{`@keyframes fpulse{0%,100%{opacity:.18}50%{opacity:.75}}`}</style>
    </section>
  )
}
