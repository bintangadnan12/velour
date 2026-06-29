'use client'
import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const TOTAL = 265
const PRELOAD_COUNT = 20
const frameSrc = (i: number) => `/frames/frame${String(i).padStart(4, '0')}.jpg`

interface HeroCanvasProps {
  onLoad: (pct: number) => void
  onReady: () => void
}

export function HeroCanvas({ onLoad, onReady }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const imgsRef = useRef<HTMLImageElement[]>(Array(TOTAL).fill(null))
  const curFrameRef = useRef(0)
  const loadedRef = useRef(0)
  const launchedRef = useRef(false)

  const eyeRef = useRef<HTMLDivElement>(null)
  const w1Ref = useRef<HTMLSpanElement>(null)
  const w2Ref = useRef<HTMLSpanElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const cap1Ref = useRef<HTMLDivElement>(null)
  const cap2Ref = useRef<HTMLDivElement>(null)
  const cap3Ref = useRef<HTMLDivElement>(null)

  const paint = useCallback((idx: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = imgsRef.current[idx]
    if (!img || !img.complete || !img.naturalWidth) return
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

  const startHero = useCallback(() => {
    const eye = eyeRef.current
    const w1 = w1Ref.current
    const w2 = w2Ref.current
    const sub = subRef.current
    const hint = hintRef.current
    if (eye) eye.style.cssText = 'opacity:1;transform:none'
    setTimeout(() => { if (w1) w1.style.transform = 'translateY(0)' }, 80)
    setTimeout(() => { if (w2) w2.style.transform = 'translateY(0)' }, 200)
    setTimeout(() => {
      if (sub) sub.style.cssText = 'opacity:1'
      if (hint) hint.style.opacity = '1'
    }, 600)
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const frameObj = { frame: 0 }

    // Load frames
    for (let i = 1; i <= TOTAL; i++) {
      const img = new Image()
      const idx = i - 1
      img.onload = () => {
        loadedRef.current++
        const pct = Math.floor((loadedRef.current / PRELOAD_COUNT) * 100)
        if (loadedRef.current <= PRELOAD_COUNT) onLoad(Math.min(pct, 100))
        if (idx === 0) paint(0)
        if (loadedRef.current === PRELOAD_COUNT && !launchedRef.current) {
          launchedRef.current = true
          onReady()
          startHero()

          // Setup GSAP ScrollTrigger for frame scrubbing
          gsap.to(frameObj, {
            frame: TOTAL - 1,
            snap: 'frame',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '+=5000',
              scrub: true,
              pin: true,
              anticipatePin: 1,
              onUpdate: (self) => {
                const p = self.progress
                const idx = Math.min(Math.round(p * (TOTAL - 1)), TOTAL - 1)
                if (idx !== curFrameRef.current) {
                  curFrameRef.current = idx
                  paint(idx)
                }

                // Hero text fade
                const heroText = document.getElementById('hero-text')
                if (heroText) heroText.style.opacity = String(Math.max(0, 1 - p * 5))

                // Scroll hint
                const hint = hintRef.current
                if (hint) hint.style.opacity = p < 0.04 ? '1' : '0'

                // Captions
                const c1 = cap1Ref.current
                const c2 = cap2Ref.current
                const c3 = cap3Ref.current
                if (c1) c1.style.opacity = (p > 0.15 && p < 0.40) ? '1' : '0'
                if (c2) c2.style.opacity = (p > 0.44 && p < 0.67) ? '1' : '0'
                if (c3) c3.style.opacity = (p > 0.70 && p < 0.92) ? '1' : '0'
              }
            },
            onUpdate: () => {
              const idx = Math.min(Math.round(frameObj.frame), TOTAL - 1)
              if (idx !== curFrameRef.current) {
                curFrameRef.current = idx
                paint(idx)
              }
            }
          })
        }
      }
      img.onerror = () => {
        loadedRef.current++
        if (loadedRef.current === PRELOAD_COUNT && !launchedRef.current) {
          launchedRef.current = true
          onReady()
        }
      }
      img.src = frameSrc(i)
      imgsRef.current[idx] = img
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [paint, resizeCanvas, startHero, onLoad, onReady])

  return (
    <section ref={sectionRef} className="relative" style={{ height: '100vh' }}>
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Veil gradient */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(2,2,2,0.3) 0%, rgba(2,2,2,0) 35%, rgba(2,2,2,0) 65%, rgba(2,2,2,0.85) 100%)' }} />

      {/* Caption 1 */}
      <div ref={cap1Ref} className="absolute z-[3] pointer-events-none transition-opacity duration-500"
        style={{ left: 'clamp(24px,6vw,110px)', top: '50%', transform: 'translateY(-50%)', opacity: 0 }}>
        <div className="text-[9px] tracking-[0.32em] uppercase mb-2.5" style={{ color: 'var(--gold)' }}>Limited Edition</div>
        <div className="font-serif text-[clamp(26px,3.5vw,52px)] font-extralight leading-tight" style={{ color: 'var(--white)' }}>
          Only 200 pieces<br />per seasonal drop
        </div>
      </div>

      {/* Caption 2 */}
      <div ref={cap2Ref} className="absolute z-[3] pointer-events-none transition-opacity duration-500"
        style={{ right: 'clamp(24px,6vw,110px)', top: '50%', transform: 'translateY(-50%)', textAlign: 'right', opacity: 0 }}>
        <div className="text-[9px] tracking-[0.32em] uppercase mb-2.5" style={{ color: 'var(--gold)' }}>Premium Materials</div>
        <div className="font-serif text-[clamp(26px,3.5vw,52px)] font-extralight leading-tight" style={{ color: 'var(--white)' }}>
          Organic cotton.<br />Merino. Cashmere.
        </div>
      </div>

      {/* Caption 3 */}
      <div ref={cap3Ref} className="absolute z-[3] pointer-events-none transition-opacity duration-500"
        style={{ left: 'clamp(24px,6vw,110px)', top: '50%', transform: 'translateY(-50%)', opacity: 0 }}>
        <div className="text-[9px] tracking-[0.32em] uppercase mb-2.5" style={{ color: 'var(--gold)' }}>Autumn Drop 2025</div>
        <div className="font-serif text-[clamp(26px,3.5vw,52px)] font-extralight leading-tight" style={{ color: 'var(--white)' }}>
          New season.<br /><em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Now available.</em>
        </div>
      </div>

      {/* Hero text */}
      <div id="hero-text" className="absolute inset-0 z-[2] flex flex-col items-center justify-center text-center pointer-events-none">
        <div ref={eyeRef} className="text-[10px] tracking-[0.36em] uppercase mb-7 transition-all duration-700"
          style={{ color: 'var(--gold)', opacity: 0, transform: 'translateY(14px)' }}>
          Minimalist Contemporary Fashion
        </div>
        <h1 className="font-serif uppercase leading-none tracking-wide" style={{ fontSize: 'clamp(60px,11vw,156px)', fontWeight: 200, lineHeight: 0.88 }}>
          <span style={{ display: 'block', overflow: 'hidden' }}>
            <span ref={w1Ref} style={{ display: 'inline-block', transform: 'translateY(110%)', transition: 'transform 1.1s var(--ease)' }}>LUN</span>
            <span ref={w2Ref} style={{ display: 'inline-block', transform: 'translateY(110%)', transition: 'transform 1.1s var(--ease) 0.12s', color: 'var(--gold)', fontStyle: 'italic' }}>ARE</span>
          </span>
        </h1>
        <p ref={subRef} className="mt-8 text-[13px] tracking-[0.18em] uppercase transition-all duration-700 delay-500"
          style={{ color: 'var(--muted)', opacity: 0 }}>
          Wear the quiet luxury.
        </p>
      </div>

      {/* Scroll hint */}
      <div ref={hintRef} className="absolute bottom-9 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2.5 transition-opacity duration-700"
        style={{ opacity: 0 }}>
        <div className="w-px h-14" style={{ background: 'linear-gradient(to bottom, transparent, var(--gold))', animation: 'pulse 1.8s ease-in-out infinite' }} />
        <span className="text-[9px] tracking-[0.28em] uppercase" style={{ color: 'var(--muted)' }}>Scroll</span>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:.3} 50%{opacity:1} }
      `}</style>
    </section>
  )
}
