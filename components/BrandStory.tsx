'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function BrandStory() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const els = ref.current?.querySelectorAll('.reveal')
    els?.forEach((el, i) => {
      gsap.from(el, {
        opacity: 0, y: 40, duration: 1, ease: 'power3.out', delay: i * 0.12,
        scrollTrigger: { trigger: el, start: 'top 85%' }
      })
    })
  }, [])

  return (
    <section id="story" ref={ref} style={{ padding: 'clamp(80px,10vw,130px) clamp(24px,5vw,80px)', background: 'var(--off-black)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,100px)', alignItems: 'center' }}>
        <div>
          <span className="reveal block text-[9px] tracking-[0.34em] uppercase mb-5" style={{ color: 'var(--gold)' }}>Our Philosophy</span>
          <h2 className="reveal font-serif font-extralight mb-8" style={{ fontSize: 'clamp(34px,5vw,68px)', color: 'var(--white)', lineHeight: 1.05 }}>
            Built on the belief<br />that <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>restraint</em><br />is a form of luxury.
          </h2>
        </div>
        <div>
          <p className="reveal text-[15px] leading-loose mb-6" style={{ color: 'var(--muted)' }}>
            LUNARE was founded on a simple premise: most wardrobes contain too many pieces that mean too little. We set out to make the opposite — fewer, more considered garments that earn a permanent place in how you dress.
          </p>
          <p className="reveal text-[15px] leading-loose mb-10" style={{ color: 'var(--muted)' }}>
            Every material is chosen for longevity. Every silhouette is drawn to transcend seasons. Every stitch is placed with the understanding that the person wearing it has chosen quality over quantity — and deserves work that honors that choice.
          </p>
          <div className="reveal grid grid-cols-3 gap-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 36 }}>
            {[['200', 'pieces per drop'], ['3', 'collections per year'], ['100%', 'organic certified']].map(([num, label]) => (
              <div key={num}>
                <div className="font-serif text-[2.2rem] font-extralight leading-none mb-1.5" style={{ color: 'var(--gold)' }}>{num}</div>
                <div className="text-[11px] tracking-[0.1em] uppercase" style={{ color: 'rgba(248,246,242,0.4)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
