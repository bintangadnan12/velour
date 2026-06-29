'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    gsap.from(ref.current?.querySelector('.testi-quote') ?? [], {
      opacity: 0, y: 40, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 75%' }
    })
  }, [])

  return (
    <section ref={ref} className="text-center relative overflow-hidden"
      style={{ padding: 'clamp(100px,13vw,160px) clamp(24px,5vw,80px)' }}>
      <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 font-serif font-extralight pointer-events-none"
        style={{ fontSize: 'clamp(180px,22vw,380px)', color: 'rgba(201,168,76,0.04)', lineHeight: 1 }}>
        &ldquo;
      </div>
      <blockquote className="testi-quote font-serif font-extralight relative z-[1]"
        style={{ fontSize: 'clamp(22px,3.2vw,46px)', lineHeight: 1.35, color: 'var(--white)', maxWidth: 840, margin: '0 auto' }}>
        &ldquo;I&apos;ve worn The Merino Coat nearly every day since it arrived. It&apos;s the first piece of clothing I&apos;ve owned that made me{' '}
        <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>stop wanting more.</em>&rdquo;
      </blockquote>
      <div className="mt-11 text-[11px] tracking-[0.28em] uppercase" style={{ color: 'var(--muted)' }}>
        — <span style={{ color: 'var(--gold)' }}>Sofia R.</span>, Verified Buyer · New York
      </div>
    </section>
  )
}
