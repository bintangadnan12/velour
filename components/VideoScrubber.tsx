'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ─── Constants ────────────────────────────────────────────────────────────────
const TOTAL        = 300
const SCENES       = 5
const VH_PER_SCENE = 700   // 700vh × 5 = 3500vh total — relaxed pacing

// Per scene (local 0→1):
//   0.00–0.10  → scrub   (video advances to key frame)
//   0.10–0.90  → freeze  (video frozen, text visible)
//   0.90–1.00  → fade    (text fades out)
const SCRUB_END = 0.10
const HOLD_END  = 0.90

// "Hero moment" frame for each of the 5 scenes
const KEY_FRAMES   = [45, 105, 165, 225, 299]
const START_FRAMES = [0,  46,  106, 166, 226]

const pad = (i: number) => String(i).padStart(4, '0')
const desktopSrc = (i: number) => `/frames/frame${pad(i)}.jpg`
const mobileSrc  = (i: number) => `/frames-mobile/frame${pad(i)}.jpg`
const PRELOAD_COUNT = 1

// ─── Scene content (FORMA shoe brand) ────────────────────────────────────────
const SCENE_DATA = [
  {
    id: 'arrival', step: '01',
    headline: ['The', 'Arrival.'],
    accent: 'First Edition · 200 Pairs · New York',
    body: 'Engineered from a single conviction — that footwear should earn its place in your life. Permanently.',
    cta: false, align: 'left' as const,
  },
  {
    id: 'construct', step: '02',
    headline: ['Every Layer.', 'Considered.'],
    accent: '08 Components · 03 Materials · Zero Excess',
    body: 'We showed you the inside so you could trust the outside. Nothing hidden. Nothing unnecessary.',
    cta: false, align: 'right' as const,
  },
  {
    id: 'sole', step: '03',
    headline: ['Ground', 'Intelligence.'],
    accent: 'Recycled Rubber · Multi-Directional Grip · 12mm Stack',
    body: 'The sole is the first thing that meets the world.\nWe treated it accordingly.',
    cta: false, align: 'left' as const,
  },
  {
    id: 'upper', step: '04',
    headline: ['Skin-Grade', 'Leather.'],
    accent: 'Full-Grain · Naturally Tanned · Traceable to Source',
    body: 'The upper ages with you.\nCreases become character. Wear becomes story.',
    cta: false, align: 'right' as const,
  },
  {
    id: 'finale', step: '05',
    headline: ['FORMA', '001.'],
    accent: '200 Pairs · No Restock · Ships in 48h',
    body: null, cta: true, align: 'center' as const,
  },
]

// ─── Map scroll progress → frame index + overlay state ───────────────────────
function mapProgress(p: number) {
  const si    = Math.min(Math.floor(p * SCENES), SCENES - 1)
  const local = (p - si / SCENES) * SCENES   // 0→1 within this scene

  // Frame
  let frame: number
  if (local < SCRUB_END) {
    const t = local / SCRUB_END
    frame = Math.round(START_FRAMES[si] + t * (KEY_FRAMES[si] - START_FRAMES[si]))
  } else {
    frame = KEY_FRAMES[si]
  }
  frame = Math.max(0, Math.min(TOTAL - 1, frame))

  // Overlay alpha: ramp in over 5%, hold, ramp out over 8%
  let alpha = 0
  if (local >= SCRUB_END && local <= HOLD_END) {
    const inRamp  = SCRUB_END + 0.05
    const outRamp = HOLD_END  - 0.08
    if (local < inRamp)       alpha = (local - SCRUB_END) / (inRamp - SCRUB_END)
    else if (local > outRamp) alpha = Math.max(0, 1 - (local - outRamp) / (HOLD_END - outRamp))
    else                      alpha = 1
  }

  const inHold = local >= SCRUB_END && local <= HOLD_END

  return { frame, sceneIndex: si, inHold, alpha }
}

const ease3d = [0.16, 1, 0.3, 1] as const

// ─── Scene overlay content ────────────────────────────────────────────────────
function SceneContent({ data }: { data: typeof SCENE_DATA[0] }) {
  const [email, setEmail]         = useState('')
  const [submitted, setSubmitted] = useState(false)

  const iL = data.align === 'left'
  const iR = data.align === 'right'
  const iC = data.align === 'center'

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: iC
        ? 'clamp(80px,10vh,120px) clamp(40px,8vw,140px)'
        : `clamp(80px,10vh,120px) ${iR ? 'clamp(60px,8vw,120px)' : '10%'} clamp(80px,10vh,120px) ${iL ? 'clamp(60px,8vw,120px)' : '10%'}`,
      alignItems: iC ? 'center' : iL ? 'flex-start' : 'flex-end',
      textAlign:  iC ? 'center' : iL ? 'left' : 'right',
      maxWidth:   iC ? '100%' : '55%',
      marginLeft: iR ? 'auto' : undefined,
      pointerEvents: 'none',
    }}>

      {/* Step label */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        style={{ fontSize: 9, letterSpacing: '0.36em', textTransform: 'uppercase', color: 'rgba(248,246,242,0.22)', marginBottom: 'clamp(20px,3vh,36px)' }}
      >
        {data.step} / 05 &nbsp;·&nbsp; FORMA
      </motion.div>

      {/* Headline lines — clip reveal */}
      <div style={{ marginBottom: 'clamp(14px,2vh,24px)' }}>
        {data.headline.map((line, i) => (
          <div key={i} style={{ overflow: 'hidden' }}>
            <motion.div
              initial={{ y: '108%' }} animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: ease3d, delay: 0.1 + i * 0.13 }}
              style={{
                display: 'block',
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(40px,5.8vw,86px)',
                fontWeight: 200, lineHeight: 1.04,
                letterSpacing: '-0.02em', color: 'var(--white)',
              }}
            >
              {line}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Accent bar */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          marginBottom: 'clamp(18px,3vh,34px)',
          justifyContent: iC ? 'center' : iR ? 'flex-end' : 'flex-start',
        }}
      >
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: ease3d, delay: 0.3 }}
          style={{
            width: 36, height: 1,
            background: 'rgba(248,246,242,0.28)',
            transformOrigin: iR ? 'right' : 'left',
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: 8, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(248,246,242,0.30)', whiteSpace: 'nowrap' }}>
          {data.accent}
        </span>
      </motion.div>

      {/* Body */}
      {data.body && (
        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, ease: ease3d, delay: 0.4 }}
          style={{
            fontSize: 'clamp(12px,1.25vw,15px)', lineHeight: 1.88,
            color: 'rgba(248,246,242,0.42)', whiteSpace: 'pre-line',
            maxWidth: 380, alignSelf: iC ? 'center' : undefined,
          }}
        >
          {data.body}
        </motion.div>
      )}

      {/* Contact form (scene 5) */}
      {data.cta && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: ease3d, delay: 0.5 }}
          style={{ marginTop: 'clamp(28px,4vh,48px)', pointerEvents: 'auto', alignSelf: iC ? 'center' : undefined }}
        >
          {submitted ? (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontSize: 12, letterSpacing: '0.16em', color: 'rgba(248,246,242,0.5)' }}
            >
              You&apos;re on the list — we&apos;ll reach out before the drop.
            </motion.p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <form
                onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true) }}
                style={{ display: 'flex' }}
              >
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" required
                  style={{ background: 'rgba(248,246,242,0.07)', border: '1px solid rgba(248,246,242,0.18)', borderRight: 'none', color: 'var(--white)', fontSize: 11, letterSpacing: '0.1em', padding: '14px 22px', outline: 'none', fontFamily: 'inherit', width: 210 }}
                />
                <button
                  type="submit"
                  style={{ background: 'rgba(248,246,242,0.1)', border: '1px solid rgba(248,246,242,0.18)', color: 'var(--white)', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', padding: '14px 24px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                >
                  Secure Pair
                </button>
              </form>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(248,246,242,0.2)' }}>
                New York · hello@forma.co · Free shipping
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Scroll hint (scene 1 only) */}
      {data.id === 'arrival' && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, marginTop: 44 }}
        >
          <div style={{ width: 1, height: 44, background: 'linear-gradient(to bottom, transparent, rgba(248,246,242,0.38))', animation: 'fpulse 2s ease-in-out infinite' }} />
          <span style={{ fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(248,246,242,0.2)' }}>Continue scrolling</span>
        </motion.div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface Props {
  onLoad:  (pct: number) => void
  onReady: () => void
}

export function VideoScrubber({ onLoad, onReady }: Props) {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const sectionRef  = useRef<HTMLDivElement>(null)
  const overlayRef  = useRef<HTMLDivElement>(null)
  const imgsRef     = useRef<HTMLImageElement[]>(Array(TOTAL).fill(null))
  const curFrameRef = useRef(0)
  const loadedRef   = useRef(0)
  const launchedRef = useRef(false)

  const [isMobile,    setIsMobile]    = useState(false)
  const [heroReady,   setHeroReady]   = useState(false)
  const [activeScene, setActiveScene] = useState(0)
  const [showOverlay, setShowOverlay] = useState(false)

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Paint a frame to canvas (cover fit)
  const paint = useCallback((idx: number) => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const img = imgsRef.current[idx]; if (!img?.complete || !img.naturalWidth) return
    const { width: cw, height: ch } = canvas
    const { naturalWidth: iw, naturalHeight: ih } = img
    const s = Math.max(cw / iw, ch / ih)
    ctx.drawImage(img, (cw - iw * s) / 2, (ch - ih * s) / 2, iw * s, ih * s)
  }, [])

  // Resize canvas to fill viewport
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    paint(curFrameRef.current)
  }, [paint])

  // Main setup: preload frames + ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const src = isMobile ? mobileSrc : desktopSrc

    for (let i = 1; i <= TOTAL; i++) {
      const img = new Image()
      const idx = i - 1

      img.onload = () => {
        loadedRef.current++

        // Report loading progress for preloader
        if (loadedRef.current <= PRELOAD_COUNT) {
          onLoad(Math.min(Math.floor((loadedRef.current / PRELOAD_COUNT) * 100), 100))
        }

        // Paint first frame immediately
        if (idx === 0) paint(0)

        // Once enough frames are ready, start hero + setup scroll
        if (loadedRef.current >= PRELOAD_COUNT && !launchedRef.current) {
          launchedRef.current = true
          onReady()
          setHeroReady(true)

          // ── ScrollTrigger tracks section progress (no pin — CSS sticky handles it) ──
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start:   'top top',
            end:     'bottom bottom',
            scrub:   1.4,
            onUpdate: (self) => {
              const { frame, sceneIndex, inHold, alpha } = mapProgress(self.progress)

              // Paint frame
              if (frame !== curFrameRef.current) {
                curFrameRef.current = frame
                paint(frame)
              }

              // Drive overlay opacity directly via DOM (avoid state churn)
              const ov = overlayRef.current
              if (ov) ov.style.opacity = String(alpha)

              // Section state — only update on change
              setActiveScene(prev => prev !== sceneIndex ? sceneIndex : prev)
              setShowOverlay(prev => prev !== inHold ? inHold : prev)
            },
          })
        }
      }

      img.onerror = () => {
        loadedRef.current++
        if (loadedRef.current >= PRELOAD_COUNT && !launchedRef.current) {
          launchedRef.current = true
          onReady()
          setHeroReady(true)
        }
      }

      img.src = src(i)
      imgsRef.current[idx] = img
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [isMobile, paint, resizeCanvas, onLoad, onReady])

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    // Outer container — tall enough for all 5 freeze zones
    <section
      ref={sectionRef}
      style={{ height: `${VH_PER_SCENE * SCENES}vh`, position: 'relative' }}
    >
      {/* CSS sticky inner — stays in viewport as section scrolls */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
        />

        {/* Cinematic veil gradient */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(2,2,2,0.42) 0%, rgba(2,2,2,0) 28%, rgba(2,2,2,0) 62%, rgba(2,2,2,0.85) 100%)',
          }}
        />

        {/* Overlay — opacity driven via ref for zero-lag scroll sync */}
        <div
          ref={overlayRef}
          style={{ position: 'absolute', inset: 0, zIndex: 2, opacity: 0, perspective: '1400px' }}
        >
          <AnimatePresence mode="wait">
            {heroReady && showOverlay && (
              <motion.div
                key={activeScene}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <SceneContent data={SCENE_DATA[activeScene]} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Watermark — top center */}
        <div
          aria-hidden
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
            display: 'flex', justifyContent: 'center', padding: '28px 0',
            pointerEvents: 'none',
          }}
        >
          <span style={{ fontSize: 9, letterSpacing: '0.34em', textTransform: 'uppercase', color: 'rgba(248,246,242,0.14)' }}>
            FORMA · AW26
          </span>
        </div>

        {/* Vertical progress bar — right edge */}
        <div
          aria-hidden
          style={{
            position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
            zIndex: 10, display: 'flex', flexDirection: 'column', gap: 8,
            pointerEvents: 'none',
          }}
        >
          {SCENE_DATA.map((s, i) => (
            <div
              key={s.id}
              style={{
                width:      i === activeScene ? 2 : 1,
                height:     i === activeScene ? 32 : 14,
                background: i === activeScene ? 'rgba(248,246,242,0.65)' : 'rgba(248,246,242,0.18)',
                borderRadius: 1,
                transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
              }}
            />
          ))}
        </div>

        {/* Scene counter — bottom left */}
        <div
          aria-hidden
          style={{
            position: 'absolute', bottom: 28, left: 32, zIndex: 10,
            fontFamily: 'var(--font-serif)',
            fontSize: 11, color: 'rgba(248,246,242,0.16)', letterSpacing: '0.1em',
            pointerEvents: 'none',
          }}
        >
          {String(activeScene + 1).padStart(2, '0')} / 05
        </div>
      </div>

      <style>{`@keyframes fpulse{0%,100%{opacity:.18}50%{opacity:.75}}`}</style>
    </section>
  )
}
