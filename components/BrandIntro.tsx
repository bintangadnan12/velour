'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function BrandIntro() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const els = ref.current?.querySelectorAll('.reveal')
    if (!els) return
    els.forEach((el, i) => {
      gsap.from(el, {
        opacity: 0, y: 36, duration: 0.95, ease: 'power3.out', delay: i * 0.1,
        scrollTrigger: { trigger: el, start: 'top 85%' }
      })
    })
  }, [])

  return (
    <section ref={ref} className="text-center relative overflow-hidden"
      style={{ padding: 'clamp(100px,14vw,180px) clamp(24px,5vw,80px)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)' }} />
      <div className="reveal inline-flex items-center gap-3 text-[10px] tracking-[0.28em] uppercase mb-11"
        style={{ color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.18)', padding: '10px 22px' }}>
        <span style={{ width: 20, height: 1, background: 'var(--gold)', opacity: 0.5, display: 'block' }} />
        Autumn · Winter 2025
        <span style={{ width: 20, height: 1, background: 'var(--gold)', opacity: 0.5, display: 'block' }} />
      </div>
      <div className="reveal font-serif text-[clamp(72px,14vw,180px)] font-extralight leading-none"
        style={{ color: 'var(--white)', letterSpacing: '-0.01em' }}>
        Less,<em style={{ color: 'var(--gold)', fontStyle: 'italic' }}> better.</em>
      </div>
      <div className="reveal w-px h-16 mx-auto my-12"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.4), transparent)' }} />
      <div className="reveal font-serif text-[clamp(22px,3.5vw,44px)] font-extralight" style={{ color: 'var(--white)', lineHeight: 1.2 }}>
        Not a trend. A <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>practice.</em>
      </div>
      <div className="reveal text-[13px] mt-4" style={{ color: 'var(--muted)' }}>
        Each piece is designed to outlast a season — and the one after that.
      </div>
    </section>
  )
}
