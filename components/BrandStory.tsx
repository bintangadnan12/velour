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
        opacity: 0, y: 32, duration: 1, ease: 'power3.out', delay: i * 0.1,
        scrollTrigger: { trigger: el, start: 'top 86%' },
      })
    })
  }, [])

  return (
    <section id="story" ref={ref} style={{ padding: 'clamp(80px,10vw,130px) clamp(24px,5vw,80px)', background: 'var(--off-black)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="grid md:grid-cols-2 gap-x-[clamp(40px,6vw,100px)] gap-y-12 items-start">
          {/* Left column */}
          <div>
            <span className="reveal block text-[9px] tracking-[0.34em] uppercase mb-6" style={{ color: 'rgba(248,246,242,0.3)' }}>
              Founded 2021 · New York
            </span>
            <h2 className="reveal font-serif font-extralight mb-0" style={{ fontSize: 'clamp(32px,4.5vw,60px)', color: 'var(--white)', lineHeight: 1.08 }}>
              LUNARE began<br />with a single question:<br />
              <span style={{ color: 'rgba(248,246,242,0.35)', fontStyle: 'italic' }}>
                why do our closets feel<br />full but our wardrobes feel empty?
              </span>
            </h2>
          </div>

          {/* Right column */}
          <div className="pt-1">
            <p className="reveal text-[14px] leading-loose mb-6" style={{ color: 'rgba(248,246,242,0.5)' }}>
              Elena Marsh spent twelve years as a materials buyer for European luxury houses before she stepped back and asked herself why she still felt like she had nothing to wear. Her closet held over two hundred pieces. None of them felt necessary.
            </p>
            <p className="reveal text-[14px] leading-loose mb-10" style={{ color: 'rgba(248,246,242,0.5)' }}>
              LUNARE was the answer she built for herself first. Four silhouettes, three fabrics, one colorway per season. The constraint became the design. The limitation became the luxury.
            </p>

            {/* Stats */}
            <div className="reveal grid grid-cols-3 gap-6 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                ['2021', 'founded'],
                ['200', 'units per style'],
                ['12', 'styles per year'],
              ].map(([num, label]) => (
                <div key={num}>
                  <div className="font-serif text-[2rem] font-extralight leading-none mb-1.5" style={{ color: 'var(--white)' }}>
                    {num}
                  </div>
                  <div className="text-[10px] tracking-[0.12em] uppercase" style={{ color: 'rgba(248,246,242,0.3)' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
