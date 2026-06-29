'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ─── Constants ────────────────────────────────────────────────────────────────
const TOTAL = 300
const SECTIONS = 5
const FRAMES_PER_SECTION = TOTAL / SECTIONS
const SCROLL_HEIGHT = '1000vh'
const PRELOAD_COUNT = 20

const pad = (i: number) => String(i).padStart(4, '0')
const desktopSrc = (i: number) => `/frames/frame${pad(i)}.jpg`
const mobileSrc  = (i: number) => `/frames-mobile/frame${pad(i)}.jpg`

// ─── Section Content ──────────────────────────────────────────────────────────
const SECTION_DATA = [
  {
    id: 'hero',
    index: 0,
    layout: 'center',
    label: '01 — LUNARE',
    heading: ['Wear the', 'quiet luxury.'],
    sub: 'New York · AW26 · Est. 2021',
    body: null,
    cta: { text: 'Scroll to explore', arrow: true },
    items: null,
  },
  {
    id: 'services',
    index: 1,
    layout: 'left',
    label: '02 — What We Offer',
    heading: ['Clothing that earns', 'its place.'],
    sub: 'Each piece designed to outlast trends and justify its space.',
    body: null,
    cta: null,
    items: [
      { name: 'Outerwear', desc: 'Coats & jackets built for decades, not seasons.' },
      { name: 'Knitwear', desc: 'Merino, cashmere, and recycled blends — worn closest to skin.' },
      { name: 'Tailoring', desc: 'Structured pieces that move with your body.' },
      { name: 'Essentials', desc: 'The basics, redone without compromise.' },
    ],
  },
  {
    id: 'why',
    index: 2,
    layout: 'right',
    label: '03 — Why LUNARE',
    heading: ['Two hundred pieces.', 'No exceptions.'],
    sub: null,
    body: null,
    cta: null,
    items: [
      { name: 'Materials', desc: 'GOTS-certified organic cotton and traceable wool. Nothing else.' },
      { name: 'Scale', desc: '200 units per style. When it\'s gone, it\'s gone.' },
      { name: 'Ethics', desc: 'B Corp pending. Fair-wage factories. Carbon-neutral shipping.' },
      { name: 'Longevity', desc: 'Free repair for life. Because ownership means something.' },
    ],
  },
  {
    id: 'testimonials',
    index: 3,
    layout: 'center-quote',
    label: '04 — What They Say',
    heading: null,
    sub: null,
    body: null,
    cta: null,
    items: null,
    quotes: [
      { text: 'The coat I reach for without thinking. I have not touched anything else since October.', author: 'Sofia R.', role: 'The Merino Coat' },
      { text: 'It almost isn\'t there — until it is. Then you cannot imagine the day without it.', author: 'James O.', role: 'The Cloud Knit' },
      { text: 'The trouser that made every other pair redundant. I own three colours.', author: 'Mara K.', role: 'The Tailored Trouser' },
    ],
  },
  {
    id: 'contact',
    index: 4,
    layout: 'center-cta',
    label: '05 — Begin',
    heading: ['Ready to wear', 'less, better?'],
    sub: 'Join the AW26 early access list. 200 pieces per style. Priority to the list.',
    body: null,
    cta: { text: 'Join the List', arrow: false },
    items: null,
  },
]

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  onLoad: (pct: number) => void
  onReady: () => void
}

// ─── 3D transition variants ───────────────────────────────────────────────────
const overlayVariants = {
  enter: { opacity: 0, y: 56, rotateX: 14, filter: 'blur(6px)' },
  center: { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -48, rotateX: -12, filter: 'blur(4px)' },
}
const ease3d = [0.16, 1, 0.3, 1] as const

// ─── Helper: Section Overlay ──────────────────────────────────────────────────
function SectionOverlay({ data, isMobile }: { data: typeof SECTION_DATA[0]; isMobile: boolean }) {
  const [quoteIdx, setQuoteIdx] = useState(0)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (data.id !== 'testimonials') return
    const id = setInterval(() => setQuoteIdx(p => (p + 1) % 3), 3800)
    return () => clearInterval(id)
  }, [data.id])

  const isCenter = data.layout === 'center'
  const isLeft   = data.layout === 'left'
  const isRight  = data.layout === 'right'
  const isQuote  = data.layout === 'center-quote'
  const isCTA    = data.layout === 'center-cta'

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: isMobile
      ? 'clamp(60px,10vw,80px) clamp(24px,6vw,40px)'
      : isLeft
        ? 'clamp(80px,10vh,120px) clamp(48px,8vw,160px) clamp(80px,10vh,120px) clamp(60px,8vw,120px)'
        : isRight
          ? 'clamp(80px,10vh,120px) clamp(60px,8vw,120px) clamp(80px,10vh,120px) clamp(48px,8vw,160px)'
          : 'clamp(80px,10vh,120px) clamp(48px,8vw,140px)',
    alignItems: isLeft ? 'flex-start' : isRight ? 'flex-end' : 'center',
    textAlign: isLeft ? 'left' : isRight ? 'right' : 'center',
    pointerEvents: 'none',
  }

  return (
    <div style={containerStyle}>
      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          fontSize: isMobile ? 8 : 9,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(248,246,242,0.28)',
          marginBottom: 'clamp(20px,3vh,36px)',
        }}
      >
        {data.label}
      </motion.div>

      {/* Heading */}
      {data.heading && (
        <div style={{ overflow: 'hidden', marginBottom: data.items ? 'clamp(28px,4vh,48px)' : 'clamp(16px,2vh,24px)' }}>
          {data.heading.map((line, i) => (
            <motion.div
              key={i}
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: ease3d, delay: 0.2 + i * 0.1 }}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: isMobile
                  ? 'clamp(28px,8vw,42px)'
                  : 'clamp(32px,4.8vw,72px)',
                fontWeight: 200,
                color: 'var(--white)',
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                display: 'block',
              }}
            >
              {line}
            </motion.div>
          ))}
        </div>
      )}

      {/* Sub */}
      {data.sub && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          style={{
            fontSize: isMobile ? 11 : 12,
            letterSpacing: '0.12em',
            color: 'rgba(248,246,242,0.4)',
            marginBottom: 'clamp(16px,3vh,32px)',
            maxWidth: isMobile ? '100%' : 380,
            lineHeight: 1.7,
          }}
        >
          {data.sub}
        </motion.p>
      )}

      {/* Grid items (services & why) */}
      {data.items && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '16px 0' : '20px 40px',
            maxWidth: isMobile ? '100%' : 560,
            pointerEvents: 'auto',
          }}
        >
          {data.items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 + i * 0.1, ease: ease3d }}
            >
              <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(248,246,242,0.32)', marginBottom: 6 }}>
                {item.name}
              </div>
              <div style={{ fontSize: isMobile ? 11 : 12, lineHeight: 1.65, color: 'rgba(248,246,242,0.45)' }}>
                {item.desc}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Quote (testimonials) */}
      {isQuote && (data as any).quotes && (
        <div style={{ maxWidth: isMobile ? '90%' : 600, pointerEvents: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIdx}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.75, ease: ease3d }}
            >
              <div style={{ fontSize: isMobile ? 13 : 16, fontFamily: 'var(--font-serif)', fontWeight: 200, fontStyle: 'italic', lineHeight: 1.7, color: 'rgba(248,246,242,0.82)', marginBottom: 28 }}>
                &ldquo;{(data as any).quotes[quoteIdx].text}&rdquo;
              </div>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--white)', marginBottom: 4 }}>
                  {(data as any).quotes[quoteIdx].author}
                </div>
                <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(248,246,242,0.28)' }}>
                  {(data as any).quotes[quoteIdx].role}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Quote dots */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 32 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: i === quoteIdx ? 20 : 5, height: 2, background: i === quoteIdx ? 'rgba(248,246,242,0.6)' : 'rgba(248,246,242,0.18)', transition: 'all 0.4s ease', borderRadius: 1 }} />
            ))}
          </div>
        </div>
      )}

      {/* Contact CTA */}
      {isCTA && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          style={{ marginTop: 'clamp(20px,3vh,36px)', pointerEvents: 'auto' }}
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ fontSize: 12, letterSpacing: '0.18em', color: 'rgba(248,246,242,0.55)' }}
            >
              You&apos;re on the list. We&apos;ll be in touch before the drop.
            </motion.div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true) }}
              style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 0, maxWidth: 440 }}
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  flex: 1,
                  background: 'rgba(248,246,242,0.06)',
                  border: '1px solid rgba(248,246,242,0.14)',
                  borderRight: isMobile ? '1px solid rgba(248,246,242,0.14)' : 'none',
                  borderBottom: isMobile ? 'none' : '1px solid rgba(248,246,242,0.14)',
                  color: 'var(--white)',
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  padding: '14px 20px',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'rgba(248,246,242,0.08)',
                  border: '1px solid rgba(248,246,242,0.14)',
                  color: 'var(--white)',
                  fontSize: 9,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  padding: '14px 28px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                }}
              >
                Join the List
              </button>
            </form>
          )}
          <div style={{ marginTop: 20, fontSize: 9, letterSpacing: '0.22em', color: 'rgba(248,246,242,0.2)' }}>
            New York · Studio · hello@lunare.com
          </div>
        </motion.div>
      )}

      {/* Hero scroll hint */}
      {data.id === 'hero' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 'clamp(32px,5vh,56px)' }}
        >
          <div style={{ width: 1, height: 52, background: 'linear-gradient(to bottom, transparent, rgba(248,246,242,0.4))', animation: 'vidPulse 1.8s ease-in-out infinite' }} />
          <span style={{ fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(248,246,242,0.25)' }}>Scroll</span>
        </motion.div>
      )}
    </div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function VideoScrubber({ onLoad, onReady }: Props) {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const sectionRef  = useRef<HTMLDivElement>(null)
  const imgsRef     = useRef<HTMLImageElement[]>(Array(TOTAL).fill(null))
  const curFrameRef = useRef(0)
  const loadedRef   = useRef(0)
  const launchedRef = useRef(false)

  const [activeSection, setActiveSection] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [heroReady, setHeroReady] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

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

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    paint(curFrameRef.current)
  }, [paint])

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
        const pct = Math.floor((loadedRef.current / PRELOAD_COUNT) * 100)
        if (loadedRef.current <= PRELOAD_COUNT) onLoad(Math.min(pct, 100))
        if (idx === 0) { paint(0) }
        if (loadedRef.current === PRELOAD_COUNT && !launchedRef.current) {
          launchedRef.current = true
          onReady()
          setHeroReady(true)

          gsap.to({ frame: 0 }, {
            frame: TOTAL - 1,
            snap: 'frame',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: `+=${window.innerHeight * 10}`,
              scrub: 0.5,
              pin: true,
              anticipatePin: 1,
              onUpdate: (self) => {
                const p = self.progress
                const nextSection = Math.min(Math.floor(p * SECTIONS), SECTIONS - 1)
                setActiveSection(prev => prev !== nextSection ? nextSection : prev)

                const frameIdx = Math.min(Math.round(p * (TOTAL - 1)), TOTAL - 1)
                if (frameIdx !== curFrameRef.current) {
                  curFrameRef.current = frameIdx
                  paint(frameIdx)
                }
              },
            },
            onUpdate: function() {
              const frameIdx = Math.min(Math.round((this as any).targets()[0].frame), TOTAL - 1)
              if (frameIdx !== curFrameRef.current) {
                curFrameRef.current = frameIdx
                paint(frameIdx)
              }
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
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [isMobile, paint, resizeCanvas, onLoad, onReady])

  return (
    <section ref={sectionRef} style={{ height: SCROLL_HEIGHT, position: 'relative' }}>
      {/* Sticky viewport */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Canvas */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />

        {/* Cinematic veil */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(2,2,2,0.35) 0%, rgba(2,2,2,0) 25%, rgba(2,2,2,0) 65%, rgba(2,2,2,0.75) 100%)',
        }} />

        {/* Progress bar (vertical, right side) */}
        <div style={{
          position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
          zIndex: 10, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center',
        }}>
          {SECTION_DATA.map((s, i) => (
            <div key={s.id} style={{
              width: 2,
              height: i === activeSection ? 28 : 12,
              background: i === activeSection ? 'rgba(248,246,242,0.7)' : 'rgba(248,246,242,0.18)',
              borderRadius: 1,
              transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
            }} />
          ))}
        </div>

        {/* Section overlays — perspective wrapper for 3D */}
        {heroReady && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 2, perspective: '1200px', perspectiveOrigin: '50% 50%' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                variants={overlayVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.75, ease: ease3d }}
                style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}
              >
                <SectionOverlay data={SECTION_DATA[activeSection]} isMobile={isMobile} />
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Section counter bottom-left */}
        <div style={{
          position: 'absolute', bottom: 28, left: 28, zIndex: 10,
          fontFamily: 'var(--font-serif)',
          fontSize: 11, color: 'rgba(248,246,242,0.22)', letterSpacing: '0.12em',
        }}>
          {String(activeSection + 1).padStart(2, '0')} / {String(SECTIONS).padStart(2, '0')}
        </div>

        {/* Brand watermark top-right */}
        <div style={{
          position: 'absolute', top: 28, right: 48, zIndex: 10,
          fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'rgba(248,246,242,0.18)',
        }}>
          LUNARE · AW26
        </div>
      </div>

      <style>{`
        @keyframes vidPulse { 0%,100%{opacity:.25} 50%{opacity:.9} }
      `}</style>
    </section>
  )
}
