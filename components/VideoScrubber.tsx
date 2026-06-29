'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

// ─── Constants ────────────────────────────────────────────────────────────────
const TOTAL = 300
const SCENES = 5

// Each scene = 200vh total:
//   Phase A (SCRUB):  0–25%  → video scrubs to key frame
//   Phase B (HOLD):  25–88%  → video frozen, text visible
//   Phase C (FADE):  88–100% → text fades out before next scene
const SCRUB_END  = 0.25
const HOLD_END   = 0.88

// Key frames: the "hero moment" frame of each scene
// Scene 0: shoe arrives        ~ frame 45
// Scene 1: puzzle opening      ~ frame 105
// Scene 2: sole close-up       ~ frame 165
// Scene 3: upper close-up      ~ frame 225
// Scene 4: full shot           ~ frame 299
const KEY_FRAMES   = [45, 105, 165, 225, 299]
const START_FRAMES = [0, 46, 106, 166, 226]

const pad = (i: number) => String(i).padStart(4, '0')
const desktopSrc = (i: number) => `/frames/frame${pad(i)}.jpg`
const mobileSrc  = (i: number) => `/frames-mobile/frame${pad(i)}.jpg`
const PRELOAD_COUNT = 20

// ─── Brand Content (FORMA – shoe brand) ──────────────────────────────────────
const SCENE_DATA = [
  {
    id:       'arrival',
    step:     '01',
    headline: ['The', 'Arrival.'],
    accent:   'First Edition · 200 Pairs · New York',
    body:     'Engineered from a single conviction — that footwear should earn its place in your life. Permanently.',
    cta:      null,
    align:    'left' as const,
  },
  {
    id:       'construct',
    step:     '02',
    headline: ['Every Layer.', 'Considered.'],
    accent:   '08 Components · 03 Materials · Zero Excess',
    body:     'We showed you the inside so you could trust the outside. Nothing hidden. Nothing unnecessary.',
    cta:      null,
    align:    'right' as const,
  },
  {
    id:       'sole',
    step:     '03',
    headline: ['Ground', 'Intelligence.'],
    accent:   'Recycled Rubber · Multi-Directional Grip · 12mm Stack',
    body:     'The sole is the first thing that meets the world.\nWe treated it accordingly.',
    cta:      null,
    align:    'left' as const,
  },
  {
    id:       'upper',
    step:     '04',
    headline: ['Skin-Grade', 'Leather.'],
    accent:   'Full-Grain · Naturally Tanned · Traceable to Source',
    body:     'The upper ages with you.\nCreases become character. Wear becomes story.',
    cta:      null,
    align:    'right' as const,
  },
  {
    id:       'full',
    step:     '05',
    headline: ['FORMA', '001.'],
    accent:   '200 Pairs · No Restock · Ships in 48h',
    body:     null,
    cta:      'Secure Your Pair →',
    align:    'center' as const,
  },
]

// ─── Progress Mapping: scroll progress → { frame, sceneIndex, showOverlay, overlayAlpha } ──
function mapProgress(p: number) {
  const sceneSize = 1 / SCENES
  const si = Math.min(Math.floor(p / sceneSize), SCENES - 1)
  const local = (p - si * sceneSize) / sceneSize  // 0→1 within scene

  let frame: number
  if (local < SCRUB_END) {
    const t = local / SCRUB_END
    frame = Math.round(START_FRAMES[si] + t * (KEY_FRAMES[si] - START_FRAMES[si]))
  } else {
    frame = KEY_FRAMES[si]
  }
  frame = Math.max(0, Math.min(TOTAL - 1, frame))

  const showOverlay = local >= SCRUB_END && local < HOLD_END
  const overlayAlpha = showOverlay
    ? local < SCRUB_END + 0.06
      ? (local - SCRUB_END) / 0.06          // fade in
      : local > HOLD_END - 0.06
        ? (HOLD_END - local) / 0.06          // fade out
        : 1
    : 0

  return { frame, sceneIndex: si, showOverlay, overlayAlpha }
}

// ─── Framer Motion Variants ───────────────────────────────────────────────────
const ease3d = [0.16, 1, 0.3, 1] as const

const headlineVariants = {
  hidden: { y: '105%', opacity: 0 },
  show:   { y: '0%',   opacity: 1, transition: { duration: 1.05, ease: ease3d } },
}
const accentVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  show:   { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: ease3d, delay: 0.2 } },
}
const bodyVariants = {
  hidden: { opacity: 0, y: 22, rotateX: 10 },
  show:   { opacity: 1, y: 0,  rotateX: 0,  transition: { duration: 0.85, ease: ease3d, delay: 0.28 } },
}
const ctaVariants = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.7, ease: ease3d, delay: 0.45 } },
}
const stepVariants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.5, delay: 0.05 } },
}

// ─── Scene Content Component ──────────────────────────────────────────────────
function SceneContent({ data }: { data: typeof SCENE_DATA[0] }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const isLeft   = data.align === 'left'
  const isRight  = data.align === 'right'
  const isCenter = data.align === 'center'

  const wrapStyle: React.CSSProperties = {
    position:      'absolute',
    inset:         0,
    display:       'flex',
    flexDirection: 'column',
    justifyContent:'center',
    padding:       isCenter
      ? 'clamp(80px,10vh,120px) clamp(40px,8vw,140px)'
      : isLeft
        ? 'clamp(80px,10vh,120px) 10% clamp(80px,10vh,120px) clamp(60px,8vw,120px)'
        : 'clamp(80px,10vh,120px) clamp(60px,8vw,120px) clamp(80px,10vh,120px) 10%',
    alignItems:    isCenter ? 'center' : isLeft ? 'flex-start' : 'flex-end',
    textAlign:     isCenter ? 'center' : isLeft ? 'left' : 'right',
    maxWidth:      isCenter ? '100%' : '55%',
    marginLeft:    isRight ? 'auto' : undefined,
    pointerEvents: 'none',
  }

  return (
    <motion.div
      style={wrapStyle}
      initial="hidden"
      animate="show"
      exit="hidden"
    >
      {/* Step label */}
      <motion.div
        variants={stepVariants}
        style={{
          fontSize: 9,
          letterSpacing: '0.36em',
          textTransform: 'uppercase',
          color: 'rgba(248,246,242,0.25)',
          marginBottom: 'clamp(24px,3.5vh,40px)',
        }}
      >
        {data.step} / {String(SCENES).padStart(2, '0')} &nbsp;·&nbsp; FORMA
      </motion.div>

      {/* Headline with clip reveal */}
      <div style={{ marginBottom: 'clamp(14px,2vh,22px)' }}>
        {data.headline.map((line, i) => (
          <div key={i} style={{ overflow: 'hidden' }}>
            <motion.div
              variants={headlineVariants}
              transition={{ duration: 1.05, ease: ease3d, delay: i * 0.12 }}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(44px,6.2vw,88px)',
                fontWeight: 200,
                lineHeight: 1.03,
                letterSpacing: '-0.02em',
                color: 'var(--white)',
                display: 'block',
              }}
            >
              {line}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Accent line with slide reveal */}
      <div style={{
        display: 'flex', alignItems: 'center',
        gap: 14,
        justifyContent: isCenter ? 'center' : isRight ? 'flex-end' : 'flex-start',
        marginBottom: 'clamp(20px,3vh,36px)',
        overflow: 'hidden',
      }}>
        <motion.div
          variants={accentVariants}
          style={{
            width: 40, height: 1,
            background: 'rgba(248,246,242,0.3)',
            transformOrigin: isRight ? 'right' : 'left',
            flexShrink: 0,
          }}
        />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            fontSize: 8,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(248,246,242,0.32)',
            whiteSpace: 'nowrap',
          }}
        >
          {data.accent}
        </motion.span>
      </div>

      {/* Body copy */}
      {data.body && (
        <motion.div
          variants={bodyVariants}
          style={{
            fontSize: 'clamp(12px,1.3vw,15px)',
            lineHeight: 1.85,
            color: 'rgba(248,246,242,0.45)',
            whiteSpace: 'pre-line',
            maxWidth: 400,
            alignSelf: isCenter ? 'center' : undefined,
          }}
        >
          {data.body}
        </motion.div>
      )}

      {/* CTA (scene 5 only) */}
      {data.cta && (
        <motion.div
          variants={ctaVariants}
          style={{ marginTop: 'clamp(28px,4vh,48px)', pointerEvents: 'auto', alignSelf: isCenter ? 'center' : undefined }}
        >
          {!submitted ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <form
                onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true) }}
                style={{ display: 'flex', gap: 0 }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{
                    background: 'rgba(248,246,242,0.07)',
                    border: '1px solid rgba(248,246,242,0.18)',
                    borderRight: 'none',
                    color: 'var(--white)',
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    padding: '14px 22px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    width: 220,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'rgba(248,246,242,0.12)',
                    border: '1px solid rgba(248,246,242,0.18)',
                    color: 'var(--white)',
                    fontSize: 9,
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    padding: '14px 26px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Secure Pair
                </button>
              </form>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(248,246,242,0.2)' }}>
                New York · hello@forma.co · Free shipping
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ fontSize: 12, letterSpacing: '0.16em', color: 'rgba(248,246,242,0.55)' }}
            >
              You&apos;re on the list — we&apos;ll reach out before the drop.
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Scroll hint on scene 1 */}
      {data.id === 'arrival' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, marginTop: 48 }}
        >
          <div style={{ width: 1, height: 44, background: 'linear-gradient(to bottom, transparent, rgba(248,246,242,0.4))', animation: 'freezePulse 2s ease-in-out infinite' }} />
          <span style={{ fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(248,246,242,0.2)' }}>Continue scrolling</span>
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface Props {
  onLoad: (pct: number) => void
  onReady: () => void
}

export function VideoScrubber({ onLoad, onReady }: Props) {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const sectionRef   = useRef<HTMLDivElement>(null)
  const overlayRef   = useRef<HTMLDivElement>(null)
  const imgsRef      = useRef<HTMLImageElement[]>(Array(TOTAL).fill(null))
  const curFrameRef  = useRef(0)
  const loadedRef    = useRef(0)
  const launchedRef  = useRef(false)

  const [isMobile,     setIsMobile]     = useState(false)
  const [heroReady,    setHeroReady]    = useState(false)
  const [activeScene,  setActiveScene]  = useState(0)
  const [showOverlay,  setShowOverlay]  = useState(false)

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Paint frame to canvas
  const paint = useCallback((idx: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = imgsRef.current[idx]
    if (!img?.complete || !img.naturalWidth) return
    const cw = canvas.width, ch = canvas.height
    const iw = img.naturalWidth, ih = img.naturalHeight
    const s = Math.max(cw / iw, ch / ih)
    ctx.drawImage(img, (cw - iw * s) / 2, (ch - ih * s) / 2, iw * s, ih * s)
  }, [])

  // Resize canvas
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    paint(curFrameRef.current)
  }, [paint])

  // Main effect: load frames + setup GSAP + Lenis
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // ── Lenis smooth scroll ──────────────────────────────────────────────────
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenis.on('scroll', ScrollTrigger.update)
    const lenisRaf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(lenisRaf)
    gsap.ticker.lagSmoothing(0)

    // ── Image preloading ─────────────────────────────────────────────────────
    const src = isMobile ? mobileSrc : desktopSrc
    for (let i = 1; i <= TOTAL; i++) {
      const img = new Image()
      const idx = i - 1
      img.onload = () => {
        loadedRef.current++
        if (loadedRef.current <= PRELOAD_COUNT) {
          onLoad(Math.min(Math.floor((loadedRef.current / PRELOAD_COUNT) * 100), 100))
        }
        if (idx === 0) paint(0)
        if (loadedRef.current === PRELOAD_COUNT && !launchedRef.current) {
          launchedRef.current = true
          onReady()
          setHeroReady(true)

          // ── ScrollTrigger ────────────────────────────────────────────────
          ScrollTrigger.create({
            trigger:       sectionRef.current,
            start:         'top top',
            end:           `+=${window.innerHeight * 10}`,   // 1000vh
            pin:           true,
            anticipatePin: 1,
            scrub:         0,   // Lenis handles smoothing
            onUpdate: (self) => {
              const { frame, sceneIndex, showOverlay: show, overlayAlpha } = mapProgress(self.progress)

              // Paint frame
              if (frame !== curFrameRef.current) {
                curFrameRef.current = frame
                paint(frame)
              }

              // Drive overlay opacity directly (no state re-render for alpha)
              const ov = overlayRef.current
              if (ov) ov.style.opacity = String(overlayAlpha)

              // State updates (only on change to avoid render loops)
              setActiveScene(prev => prev !== sceneIndex ? sceneIndex : prev)
              setShowOverlay(prev => prev !== show ? show : prev)
            },
          })
        }
      }
      img.onerror = () => {
        loadedRef.current++
        if (loadedRef.current === PRELOAD_COUNT && !launchedRef.current) {
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
      gsap.ticker.remove(lenisRaf)
      lenis.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [isMobile, paint, resizeCanvas, onLoad, onReady])

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section ref={sectionRef} style={{ height: '1000vh', position: 'relative' }}>
      {/* Sticky viewport */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
        />

        {/* Cinematic veil */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(2,2,2,0.4) 0%, rgba(2,2,2,0) 30%, rgba(2,2,2,0) 60%, rgba(2,2,2,0.8) 100%)',
          }}
        />

        {/* ── Overlay container (opacity driven by scroll) ── */}
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

        {/* ── Brand watermark top-center ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
          display: 'flex', justifyContent: 'center', padding: '28px 0',
          pointerEvents: 'none',
        }}>
          <span style={{
            fontSize: 9, letterSpacing: '0.34em', textTransform: 'uppercase',
            color: 'rgba(248,246,242,0.15)',
          }}>
            FORMA · AW26
          </span>
        </div>

        {/* ── Vertical progress bar — right side ── */}
        <div style={{
          position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
          zIndex: 10, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center',
          pointerEvents: 'none',
        }}>
          {SCENE_DATA.map((s, i) => (
            <div
              key={s.id}
              style={{
                width: i === activeScene ? 2 : 1,
                height: i === activeScene ? 32 : 14,
                background: i === activeScene ? 'rgba(248,246,242,0.7)' : 'rgba(248,246,242,0.2)',
                borderRadius: 1,
                transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
              }}
            />
          ))}
        </div>

        {/* ── Frame counter bottom-left ── */}
        <div style={{
          position: 'absolute', bottom: 28, left: 32, zIndex: 10,
          fontFamily: 'var(--font-serif)',
          fontSize: 11, color: 'rgba(248,246,242,0.18)', letterSpacing: '0.1em',
          pointerEvents: 'none',
        }}>
          {String(activeScene + 1).padStart(2, '0')} / {String(SCENES).padStart(2, '0')}
        </div>
      </div>

      <style>{`
        @keyframes freezePulse { 0%,100%{opacity:.2} 50%{opacity:.8} }
      `}</style>
    </section>
  )
}
