'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const reviews = [
  {
    quote: "I've worn The Merino Coat nearly every day since October. It's the first piece of clothing I've owned that made me stop wanting more.",
    name: 'Sofia R.',
    location: 'New York, NY',
    product: 'The Merino Coat',
    verified: true,
  },
  {
    quote: "The Cloud Knit is genuinely unlike anything I've felt. I bought it skeptically — a $165 sweater felt indulgent. Three months later I understand why people talk about investment pieces.",
    name: 'James O.',
    location: 'Los Angeles, CA',
    product: 'The Cloud Knit',
    verified: true,
  },
  {
    quote: "LUNARE doesn't try to convince you of anything. You put on The Tailored Trouser and the conversation is over. That's what good design feels like.",
    name: 'Mara K.',
    location: 'Chicago, IL',
    product: 'The Tailored Trouser',
    verified: true,
  },
]

export function Testimonials() {
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (!ref.current) return
    gsap.from(ref.current, {
      opacity: 0, y: 40, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 78%' },
    })
  }, [])

  useEffect(() => {
    if (!quoteRef.current) return
    gsap.fromTo(quoteRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }
    )
  }, [active])

  return (
    <section ref={ref} style={{ padding: 'clamp(80px,11vw,140px) clamp(24px,5vw,80px)', background: 'var(--off-black)' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
        <span className="block text-[9px] tracking-[0.34em] uppercase mb-14" style={{ color: 'rgba(248,246,242,0.3)' }}>
          Verified Reviews
        </span>

        {/* Quote */}
        <div ref={quoteRef}>
          <blockquote
            className="font-serif font-extralight"
            style={{ fontSize: 'clamp(19px,2.8vw,34px)', lineHeight: 1.5, color: 'var(--white)', marginBottom: 36 }}
          >
            &ldquo;{reviews[active].quote}&rdquo;
          </blockquote>
          <div className="text-[11px] tracking-[0.2em] uppercase mb-1.5" style={{ color: 'rgba(248,246,242,0.65)' }}>
            {reviews[active].name} &nbsp;·&nbsp; {reviews[active].location}
          </div>
          <div className="text-[10px] tracking-[0.14em]" style={{ color: 'rgba(248,246,242,0.28)' }}>
            Purchased: {reviews[active].product}
            {reviews[active].verified && <span style={{ marginLeft: 8, color: 'rgba(248,246,242,0.22)' }}>· Verified Buyer</span>}
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-3 mt-12">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? 28 : 6,
                height: 2,
                background: i === active ? 'var(--white)' : 'rgba(248,246,242,0.2)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.35s ease',
                padding: 0,
              }}
              aria-label={`Review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
