'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const products = [
  {
    id: 1,
    name: 'The Merino Coat',
    category: 'Outerwear',
    price: '$285',
    desc: 'Double-faced merino wool. Dropped shoulders. Midi length. The coat you reach for every single day.',
    img: 'https://images.unsplash.com/photo-1539109116155-e2fd576b3c0e?w=700&q=82&auto=format&fit=crop',
    from: { rotateY: -40, x: -100, z: -260, scale: 0.84 },
  },
  {
    id: 2,
    name: 'The Cloud Knit',
    category: 'Knitwear',
    price: '$165',
    desc: "Recycled cashmere blend. Oversized relaxed fit. So light it almost isn't there — until it is.",
    img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=700&q=82&auto=format&fit=crop',
    from: { rotateY: 40, x: 100, z: -260, scale: 0.84 },
  },
  {
    id: 3,
    name: 'The Tailored Trouser',
    category: 'Bottoms',
    price: '$195',
    desc: 'Organic cotton twill. Wide leg, high rise, pressed crease. The trouser that makes every other pair redundant.',
    img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&q=82&auto=format&fit=crop',
    from: { rotateX: -25, y: 140, z: -200, scale: 0.88 },
  },
  {
    id: 4,
    name: 'The Cashmere Crew',
    category: 'Knitwear',
    price: '$145',
    desc: 'Grade-A Mongolian cashmere. Ribbed cuffs and hem. Wears alone or under everything. A true wardrobe constant.',
    img: 'https://images.unsplash.com/photo-1434389277036-48b51f0b95db?w=700&q=82&auto=format&fit=crop',
    from: { rotateY: -32, rotateX: 12, x: -90, z: -230, scale: 0.86 },
  },
  {
    id: 5,
    name: 'The Minimal Blazer',
    category: 'Tailoring',
    price: '$225',
    desc: 'Linen-wool blend. Unstructured construction. Wear open, wear belted, wear with nothing underneath.',
    img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=700&q=82&auto=format&fit=crop',
    from: { rotateY: 38, x: 100, z: -250, scale: 0.84 },
  },
]

function BagButton({ name }: { name: string }) {
  const [state, setState] = useState<'idle' | 'added'>('idle')

  const handleClick = () => {
    if (state === 'added') return
    setState('added')
    setTimeout(() => setState('idle'), 2200)
  }

  return (
    <button
      onClick={handleClick}
      className="text-[10px] tracking-[0.22em] uppercase transition-all duration-300 min-w-[140px]"
      style={{
        color: state === 'added' ? 'var(--black)' : 'var(--white)',
        border: state === 'added' ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.18)',
        padding: '12px 28px',
        background: state === 'added' ? 'var(--white)' : 'none',
        cursor: state === 'added' ? 'default' : 'pointer',
      }}
      aria-label={`Add ${name} to bag`}
    >
      {state === 'added' ? 'Added ✓' : 'Add to Bag'}
    </button>
  )
}

export function TheEdit() {
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    cardsRef.current.forEach((card, i) => {
      if (!card) return
      const p = products[i]

      gsap.set(card, { transformPerspective: 1100, transformStyle: 'preserve-3d' })

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
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect()
        const dx = (e.clientX - rect.left - rect.width / 2) / rect.width
        const dy = (e.clientY - rect.top - rect.height / 2) / rect.height
        gsap.to(card, { rotateY: dx * 6, rotateX: -dy * 4, ease: 'power2.out', duration: 0.5, transformPerspective: 900 })
      })
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateY: 0, rotateX: 0, ease: 'power3.out', duration: 0.9 })
      })
    })

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()) }
  }, [])

  return (
    <section id="edit" style={{ padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        {/* Header */}
        <div className="flex items-end justify-between mb-[clamp(56px,7vw,100px)] flex-wrap gap-4">
          <div>
            <span className="block text-[9px] tracking-[0.34em] uppercase mb-4" style={{ color: 'rgba(248,246,242,0.35)' }}>
              Best Sellers — AW26
            </span>
            <h2 className="font-serif font-extralight" style={{ fontSize: 'clamp(34px,5vw,68px)', color: 'var(--white)', lineHeight: 1.05 }}>
              The Edit
            </h2>
          </div>
          <span className="text-[11px] tracking-[0.18em]" style={{ color: 'rgba(248,246,242,0.3)' }}>
            5 pieces · Limited to 200 units each
          </span>
        </div>

        {/* Products */}
        <div className="flex flex-col gap-[clamp(80px,11vw,150px)]">
          {products.map((p, i) => (
            <div
              key={p.id}
              ref={el => { if (el) cardsRef.current[i] = el }}
              className={`grid md:grid-cols-2 gap-8 md:gap-14 items-center`}
              style={{ willChange: 'transform', direction: i % 2 === 1 ? 'rtl' : 'ltr' }}
            >
              {/* Image */}
              <div className="relative overflow-hidden" style={{ aspectRatio: '4/5', direction: 'ltr' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.img}
                  alt={p.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                  style={{ filter: 'grayscale(15%) brightness(0.88)' }}
                  loading="lazy"
                />
                {/* subtle bottom overlay for text */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,2,2,0.55) 0%, transparent 50%)' }} />
                {/* Index */}
                <div className="absolute top-5 left-5 font-serif text-[11px]" style={{ color: 'rgba(248,246,242,0.3)' }}>
                  {String(p.id).padStart(2, '0')}
                </div>
                {/* Category bottom */}
                <div className="absolute bottom-5 left-5 text-[8px] tracking-[0.24em] uppercase" style={{ color: 'rgba(248,246,242,0.45)' }}>
                  {p.category}
                </div>
              </div>

              {/* Info */}
              <div style={{ direction: 'ltr' }} className="flex flex-col justify-center py-6">
                <span className="text-[9px] tracking-[0.3em] uppercase mb-3" style={{ color: 'rgba(248,246,242,0.3)' }}>
                  {p.category}
                </span>
                <h3 className="font-serif font-extralight mb-5" style={{ fontSize: 'clamp(26px,3.8vw,50px)', color: 'var(--white)', lineHeight: 1.08 }}>
                  {p.name}
                </h3>
                <p className="text-[14px] leading-loose mb-8 max-w-sm" style={{ color: 'rgba(248,246,242,0.5)' }}>
                  {p.desc}
                </p>
                <div className="flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24 }}>
                  <span className="font-serif text-[26px] font-extralight" style={{ color: 'var(--white)' }}>
                    {p.price}
                  </span>
                  <BagButton name={p.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
