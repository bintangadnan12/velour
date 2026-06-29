'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const values = [
  {
    label: 'Material',
    headline: 'Fabric first, always.',
    body: 'Every yarn is traced to its source. Organic cotton from certified farms. Merino from free-range flocks. Cashmere reclaimed and rewoven. We know where every thread begins.',
  },
  {
    label: 'Volume',
    headline: '200 pieces. That\'s it.',
    body: 'We produce no more than 200 units of each style per season. Not as a gimmick — because making less is the only way to make better. Scarcity is not our strategy. Integrity is.',
  },
  {
    label: 'Construction',
    headline: 'Built to be worn out.',
    body: 'Double-stitched seams. Reinforced stress points. Cut with extra seam allowance so a tailor can adjust years from now. These are clothes meant to outlast trends by design.',
  },
  {
    label: 'Returns',
    headline: '30 days, no questions.',
    body: 'We believe in the fit you feel, not the fit on a model. Try it. Wear it around your home. If it doesn\'t feel right, send it back. Free shipping both ways, always.',
  },
]

export function Features() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const items = ref.current?.querySelectorAll('.val-item')
    items?.forEach((el, i) => {
      gsap.from(el, {
        opacity: 0, y: 28, duration: 0.9, ease: 'power3.out',
        delay: (i % 2) * 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      })
    })
  }, [])

  return (
    <section id="features" ref={ref} style={{ padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Section label + heading */}
        <div className="mb-[clamp(52px,7vw,96px)]">
          <span className="block text-[9px] tracking-[0.34em] uppercase mb-5" style={{ color: 'rgba(248,246,242,0.3)' }}>
            How we work
          </span>
          <h2 className="font-serif font-extralight" style={{ fontSize: 'clamp(32px,4.5vw,62px)', color: 'var(--white)', lineHeight: 1.08, maxWidth: 520 }}>
            The principles behind everything we make.
          </h2>
        </div>

        {/* 2-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[clamp(40px,6vw,96px)] gap-y-[clamp(48px,6vw,80px)]">
          {values.map((v, i) => (
            <div key={i} className="val-item" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 28 }}>
              <div className="text-[9px] tracking-[0.3em] uppercase mb-4" style={{ color: 'rgba(248,246,242,0.28)' }}>
                {v.label}
              </div>
              <div className="font-serif font-extralight mb-4" style={{ fontSize: 'clamp(20px,2.4vw,30px)', color: 'var(--white)', lineHeight: 1.2 }}>
                {v.headline}
              </div>
              <p className="text-[13px] leading-loose" style={{ color: 'rgba(248,246,242,0.45)' }}>
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
