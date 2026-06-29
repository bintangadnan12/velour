'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const features = [
  { num: '01', name: 'Premium Materials', desc: 'Organic cotton, merino wool, and recycled cashmere blend. Every fabric is certified and sourced with intention — no compromise on what touches your skin.' },
  { num: '02', name: 'Limited Production', desc: 'Maximum 200 units per style per season. When a drop sells out, it is gone. Rarity is not a marketing tactic — it is a commitment to quality over volume.' },
  { num: '03', name: 'Precision Tailoring', desc: 'Each piece is cut and sewn with obsessive attention to seam allowance, drape, and silhouette. Clothes that hang the way they are supposed to.' },
  { num: '04', name: 'Sustainable Packaging', desc: '100% recycled and biodegradable packaging. No plastic, no filler. Your order arrives in kraft paper and organic cotton dust bag — reusable by design.' },
  { num: '05', name: 'Free Global Shipping', desc: 'Complimentary shipping on all orders over $150. Free returns within 30 days, no questions asked. We want you to feel confident in every purchase.' },
  { num: '06', name: 'Designed to Last', desc: 'Anti-trend by principle. Our silhouettes are considered and seasonless. Buy less, choose well, make it last — this is the LUNARE philosophy in practice.' },
]

export function Features() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const cards = ref.current?.querySelectorAll('.feat-card')
    cards?.forEach((card, i) => {
      gsap.from(card, {
        opacity: 0, y: 36, duration: 0.85, ease: 'power3.out',
        delay: (i % 3) * 0.08,
        scrollTrigger: { trigger: card, start: 'top 88%' }
      })
    })
  }, [])

  return (
    <section id="features" ref={ref} style={{ padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)', background: 'var(--off-black)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="flex items-end justify-between mb-[clamp(44px,6vw,80px)] flex-wrap gap-5">
          <h2 className="font-serif font-extralight" style={{ fontSize: 'clamp(34px,5vw,68px)', color: 'var(--white)', lineHeight: 1.05 }}>
            Crafted with <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>intention</em>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          {features.map(f => (
            <div key={f.num} className="feat-card group p-9 transition-colors duration-300 hover:bg-[rgba(201,168,76,0.04)] cursor-default"
              style={{ borderRight: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="font-serif text-[12px] mb-5" style={{ color: 'var(--gold)', opacity: 0.7 }}>{f.num}</div>
              <div className="text-[15px] font-medium mb-2.5" style={{ color: 'var(--white)' }}>{f.name}</div>
              <div className="text-[13px] leading-relaxed" style={{ color: 'var(--muted)' }}>{f.desc}</div>
              <div className="mt-4 text-[16px] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                style={{ color: 'var(--gold)' }}>→</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
