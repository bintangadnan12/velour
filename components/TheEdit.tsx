'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const products = [
  {
    id: 1,
    name: 'The Merino Coat',
    category: 'Outerwear',
    price: '$285',
    desc: 'Double-faced merino wool. Dropped shoulders. Midi length. The coat you reach for every single day.',
    bg: 'linear-gradient(135deg, #1a1a14 0%, #2a2416 50%, #1a1208 100%)',
    from: { rotateY: -45, x: -120, z: -280, scale: 0.82 },
    delay: 0,
  },
  {
    id: 2,
    name: 'The Cloud Knit',
    category: 'Knitwear',
    price: '$165',
    desc: "Recycled cashmere blend. Oversized relaxed fit. So light it almost isn't there — until it is.",
    bg: 'linear-gradient(135deg, #141414 0%, #1e1e1a 50%, #0a0a0a 100%)',
    from: { rotateY: 45, x: 120, z: -280, scale: 0.82 },
    delay: 0.06,
  },
  {
    id: 3,
    name: 'The Tailored Trouser',
    category: 'Bottoms',
    price: '$195',
    desc: 'Organic cotton twill. Wide leg, high rise, pressed crease. The trouser that makes every other pair redundant.',
    bg: 'linear-gradient(135deg, #10100c 0%, #1c1a10 50%, #0e0d08 100%)',
    from: { rotateX: -30, y: 160, z: -200, scale: 0.88 },
    delay: 0.12,
  },
  {
    id: 4,
    name: 'The Cashmere Crew',
    category: 'Knitwear',
    price: '$145',
    desc: 'Grade-A Mongolian cashmere. Ribbed cuffs and hem. Wears alone or under everything. A true wardrobe constant.',
    bg: 'linear-gradient(135deg, #181412 0%, #241e14 50%, #100e08 100%)',
    from: { rotateY: -35, rotateX: 15, x: -100, z: -240, scale: 0.85 },
    delay: 0.18,
  },
  {
    id: 5,
    name: 'The Minimal Blazer',
    category: 'Tailoring',
    price: '$225',
    desc: 'Linen-wool blend. Unstructured construction. Wear open, wear belted, wear with nothing underneath. Endlessly adaptable.',
    bg: 'linear-gradient(160deg, #14120e 0%, #201c12 50%, #0c0a08 100%)',
    from: { rotateY: 40, x: 120, z: -260, scale: 0.83 },
    delay: 0.24,
  },
]

export function TheEdit() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    cardsRef.current.forEach((card, i) => {
      if (!card) return
      const p = products[i]

      gsap.set(card, { transformPerspective: 1200, transformStyle: 'preserve-3d' })

      gsap.from(card, {
        rotateY: p.from.rotateY ?? 0,
        rotateX: p.from.rotateX ?? 0,
        x: p.from.x ?? 0,
        y: p.from.y ?? 0,
        z: p.from.z,
        scale: p.from.scale,
        opacity: 0,
        ease: 'expo.out',
        duration: 1.4,
        delay: p.delay,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'top 30%',
          toggleActions: 'play none none reverse',
        }
      })

      // Subtle parallax on hover
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = (e.clientX - cx) / rect.width
        const dy = (e.clientY - cy) / rect.height
        gsap.to(card, {
          rotateY: dx * 8,
          rotateX: -dy * 5,
          ease: 'power2.out',
          duration: 0.5,
          transformPerspective: 800,
        })
      })
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateY: 0, rotateX: 0, ease: 'power3.out', duration: 0.8 })
      })
    })

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()) }
  }, [])

  return (
    <section id="edit" ref={sectionRef} style={{ padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div className="flex items-end justify-between mb-[clamp(56px,7vw,96px)] flex-wrap gap-4">
          <div>
            <span className="block text-[9px] tracking-[0.34em] uppercase mb-5" style={{ color: 'var(--gold)' }}>Best Sellers</span>
            <h2 className="font-serif font-extralight" style={{ fontSize: 'clamp(34px,5vw,68px)', color: 'var(--white)', lineHeight: 1.05 }}>
              The <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Edit</em>
            </h2>
          </div>
          <span className="text-[12px] tracking-[0.16em] uppercase" style={{ color: 'var(--muted)' }}>AW25 Collection</span>
        </div>

        {/* Products — alternating layout */}
        <div className="flex flex-col gap-[clamp(80px,10vw,140px)]">
          {products.map((p, i) => (
            <div
              key={p.id}
              ref={el => { if (el) cardsRef.current[i] = el }}
              className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${i % 2 === 1 ? 'md:[direction:rtl]' : ''}`}
              style={{ willChange: 'transform' }}
            >
              {/* Image placeholder */}
              <div className="relative overflow-hidden" style={{ aspectRatio: '4/5', background: p.bg }}>
                {/* Gold accent lines */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }} />
                {/* Center brand mark */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="font-serif italic text-[120px] font-extralight leading-none opacity-[0.05]"
                    style={{ color: 'var(--gold)' }}>L</div>
                  <div className="text-[9px] tracking-[0.4em] uppercase opacity-20"
                    style={{ color: 'var(--gold)' }}>LUNARE</div>
                </div>
                {/* Product number */}
                <div className="absolute top-6 left-6 font-serif text-[11px]" style={{ color: 'var(--gold)', opacity: 0.4 }}>
                  {String(p.id).padStart(2, '0')}
                </div>
                {/* Category badge */}
                <div className="absolute bottom-6 right-6 text-[8px] tracking-[0.2em] uppercase px-3 py-1.5"
                  style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold)' }}>
                  {p.category}
                </div>
              </div>

              {/* Info */}
              <div style={{ direction: 'ltr' }} className="flex flex-col justify-center py-8">
                <span className="text-[9px] tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)', opacity: 0.7 }}>{p.category}</span>
                <h3 className="font-serif font-extralight mb-4" style={{ fontSize: 'clamp(28px,4vw,52px)', color: 'var(--white)', lineHeight: 1.05 }}>
                  {p.name}
                </h3>
                <p className="text-[14px] leading-relaxed mb-8 max-w-sm" style={{ color: 'var(--muted)' }}>{p.desc}</p>
                <div className="flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24 }}>
                  <span className="font-serif text-[28px] font-extralight" style={{ color: 'var(--white)' }}>{p.price}</span>
                  <button
                    className="text-[10px] tracking-[0.22em] uppercase transition-all duration-300"
                    style={{ color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.35)', padding: '12px 28px', background: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'var(--gold)'
                      ;(e.currentTarget as HTMLElement).style.color = 'var(--black)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'none'
                      ;(e.currentTarget as HTMLElement).style.color = 'var(--gold)'
                    }}
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
