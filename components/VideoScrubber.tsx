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

// ─── Freeze Aura — cinematic life during hold phases ─────────────────────────
// Tiny floating dust + ambient orbs + slow light sweep
const DUST_POSITIONS = [8,18,27,36,45,54,63,72,81,90,14,41,58,79].map((x, i) => ({
  x, delay: i * 0.55, dur: 9 + (i % 4) * 2.5,
  size: 1.2 + (i % 3) * 0.7,
  drift: [-12, 18, -6, 24, -18, 8, -24, 14, -8, 20, -16, 10, -4, 22][i] ?? 10,
}))

function FreezeAura({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="aura"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4 }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3, overflow: 'hidden' }}
        >
          {/* Floating dust particles */}
          {DUST_POSITIONS.map((d, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${d.x}%`,
                bottom: '-1%',
                width: d.size,
                height: d.size * 3,
                borderRadius: '50%',
                background: 'rgba(248,246,242,0.55)',
                animationName: `dust${i % 3}`,
                animationDuration: `${d.dur}s`,
                animationDelay: `${d.delay}s`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
              }}
            />
          ))}

          {/* Ambient glow orb — upper left */}
          <motion.div
            animate={{ x: [0, 28, -12, 0], y: [0, -18, 22, 0], scale: [1, 1.06, 0.96, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', left: '8%', top: '18%',
              width: 420, height: 420, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(248,246,242,0.055) 0%, transparent 70%)',
            }}
          />

          {/* Ambient glow orb — lower right */}
          <motion.div
            animate={{ x: [0, -22, 16, 0], y: [0, 14, -20, 0], scale: [1, 0.92, 1.07, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: -5 }}
            style={{
              position: 'absolute', right: '10%', bottom: '15%',
              width: 340, height: 340, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(248,246,242,0.038) 0%, transparent 70%)',
            }}
          />

          {/* Slow diagonal light sweep */}
          <motion.div
            animate={{ x: ['-120%', '220%'] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'linear', delay: 1 }}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(108deg, transparent 38%, rgba(248,246,242,0.03) 50%, transparent 62%)',
            }}
          />

          {/* Corner accent lines */}
          <motion.div
            animate={{ opacity: [0.12, 0.22, 0.12], scaleX: [0.8, 1, 0.8] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', bottom: 48, right: 48,
              width: 60, height: 1,
              background: 'rgba(248,246,242,0.35)',
              transformOrigin: 'right',
            }}
          />
          <motion.div
            animate={{ opacity: [0.12, 0.22, 0.12], scaleY: [0.8, 1, 0.8] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', bottom: 48, right: 48,
              width: 1, height: 60,
              background: 'rgba(248,246,242,0.35)',
              transformOrigin: 'bottom',
            }}
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
      <div
        style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}
        className={freezeAura ? 'canvas-breathe' : ''}
      >
        {/* Canvas — breathing animation during freeze via CSS class */}
        <canvas
          ref={canvasRef}
          className={freezeAura ? 'frame-breathe' : ''}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
        />

        {/* Cinematic vignette */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(2,2,2,0.40) 0%, rgba(2,2,2,0) 28%, rgba(2,2,2,0) 62%, rgba(2,2,2,0.85) 100%)' }} />

        {/* Freeze aura — particles, orbs, sweep */}
        <FreezeAura active={freezeAura} />

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

      <style>{`
        @keyframes fpulse  { 0%,100%{opacity:.18} 50%{opacity:.75} }
        @keyframes dust0   { 0%{transform:translateY(0) translateX(0);opacity:0} 8%{opacity:.7} 92%{opacity:.3} 100%{transform:translateY(-105vh) translateX(-18px);opacity:0} }
        @keyframes dust1   { 0%{transform:translateY(0) translateX(0);opacity:0} 8%{opacity:.6} 92%{opacity:.25} 100%{transform:translateY(-108vh) translateX(22px);opacity:0} }
        @keyframes dust2   { 0%{transform:translateY(0) translateX(0);opacity:0} 8%{opacity:.5} 92%{opacity:.2} 100%{transform:translateY(-106vh) translateX(-8px);opacity:0} }
        @keyframes frameBreathe { 0%,100%{transform:scale(1) translate(0,0)} 30%{transform:scale(1.018) translate(-5px,-3px)} 60%{transform:scale(1.024) translate(4px,5px)} 80%{transform:scale(1.016) translate(-2px,-6px)} }
        .frame-breathe { animation: frameBreathe 10s ease-in-out infinite !important; transform-origin: center center; }
      `}</style>
    </section>
  )
}
