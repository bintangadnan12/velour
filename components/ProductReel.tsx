'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const PRODUCTS = [
  {
    id: 1,
    name: 'The Merino Coat',
    category: 'Outerwear',
    price: '$285',
    tag: 'Sold out last season',
    desc: 'Double-faced merino wool. Dropped shoulders. Midi length.\nThe coat you reach for without thinking.',
    img: 'https://images.unsplash.com/photo-1539109116155-e2fd576b3c0e?w=900&q=85&auto=format&fit=crop',
    color: '#1a1714',
  },
  {
    id: 2,
    name: 'The Cloud Knit',
    category: 'Knitwear',
    price: '$165',
    tag: '12 remaining',
    desc: 'Recycled cashmere blend. Oversized and intentionally so.\nSo light it almost isn\'t there — until it is.',
    img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=85&auto=format&fit=crop',
    color: '#111110',
  },
  {
    id: 3,
    name: 'The Tailored Trouser',
    category: 'Bottoms',
    price: '$195',
    tag: 'New this season',
    desc: 'Organic cotton twill. Wide leg, high rise, pressed crease.\nThe trouser that makes every other pair redundant.',
    img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=85&auto=format&fit=crop',
    color: '#13120f',
  },
  {
    id: 4,
    name: 'The Cashmere Crew',
    category: 'Knitwear',
    price: '$145',
    tag: 'Bestseller · 3 seasons',
    desc: 'Grade-A Mongolian cashmere. Ribbed cuffs, raw hem.\nWears alone or under everything. A wardrobe constant.',
    img: 'https://images.unsplash.com/photo-1434389277036-48b51f0b95db?w=900&q=85&auto=format&fit=crop',
    color: '#141210',
  },
  {
    id: 5,
    name: 'The Minimal Blazer',
    category: 'Tailoring',
    price: '$225',
    tag: 'Limited · 38 remaining',
    desc: 'Linen-wool blend. Unstructured. Wear open, wear belted,\nwear over nothing. Endlessly re-inventable.',
    img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=85&auto=format&fit=crop',
    color: '#0e0d0b',
  },
]

const ease = [0.16, 1, 0.3, 1] as const

function BagBtn({ name }: { name: string }) {
  const [added, setAdded] = useState(false)
  return (
    <button
      onClick={() => { if (!added) { setAdded(true); setTimeout(() => setAdded(false), 2400) } }}
      style={{
        fontSize: 10,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        padding: '13px 32px',
        border: '1px solid rgba(248,246,242,0.18)',
        background: added ? 'var(--white)' : 'none',
        color: added ? 'var(--black)' : 'var(--white)',
        cursor: added ? 'default' : 'pointer',
        transition: 'all 0.35s ease',
        minWidth: 150,
        fontFamily: 'inherit',
      }}
      aria-label={`Add ${name} to bag`}
    >
      {added ? 'Added ✓' : 'Add to Bag'}
    </button>
  )
}

export function ProductReel() {
  const [active, setActive] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: false,
      onUpdate: (self) => {
        const next = Math.min(
          Math.floor(self.progress * PRODUCTS.length),
          PRODUCTS.length - 1
        )
        setActive(next)
      },
    })

    return () => st.kill()
  }, [])

  const p = PRODUCTS[active]

  return (
    <section
      id="edit"
      ref={containerRef}
      style={{ height: `${PRODUCTS.length * 100}vh`, position: 'relative' }}
    >
      {/* Sticky viewport */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Background color transition */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`bg-${active}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, background: p.color, zIndex: 0 }}
          />
        </AnimatePresence>

        {/* Layout: image left 58%, info right 42% */}
        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '58% 42%', height: '100%' }}>

          {/* === IMAGE PANEL === */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={`img-${active}`}
                // eslint-disable-next-line @next/next/no-img-element
                src={p.img}
                alt={p.name}
                initial={{ opacity: 0, scale: 1.05, x: -30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.97, x: 20 }}
                transition={{ duration: 0.85, ease }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'grayscale(8%) brightness(0.82)',
                }}
              />
            </AnimatePresence>

            {/* Image number overlay */}
            <div style={{
              position: 'absolute', bottom: 28, left: 28,
              fontFamily: 'var(--font-serif)', fontSize: 11,
              color: 'rgba(248,246,242,0.28)', letterSpacing: '0.1em',
            }}>
              {String(active + 1).padStart(2, '0')} / {String(PRODUCTS.length).padStart(2, '0')}
            </div>
          </div>

          {/* === INFO PANEL === */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(32px,5vw,72px) clamp(28px,4vw,60px)',
            borderLeft: '1px solid rgba(248,246,242,0.04)',
          }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`info-${active}`}
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.7, ease }}
              >
                {/* Tag */}
                <div style={{
                  fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase',
                  color: 'rgba(248,246,242,0.28)', marginBottom: 20,
                }}>
                  {p.tag}
                </div>

                {/* Category */}
                <div style={{
                  fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase',
                  color: 'rgba(248,246,242,0.22)', marginBottom: 10,
                }}>
                  {p.category}
                </div>

                {/* Name */}
                <h2 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(28px,3.8vw,54px)',
                  fontWeight: 200,
                  color: 'var(--white)',
                  lineHeight: 1.06,
                  marginBottom: 24,
                }}>
                  {p.name}
                </h2>

                {/* Divider */}
                <div style={{ width: 32, height: 1, background: 'rgba(248,246,242,0.12)', marginBottom: 24 }} />

                {/* Description */}
                <p style={{
                  fontSize: 13, lineHeight: 1.85,
                  color: 'rgba(248,246,242,0.42)',
                  whiteSpace: 'pre-line',
                  marginBottom: 40,
                  maxWidth: 320,
                }}>
                  {p.desc}
                </p>

                {/* Price + CTA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(22px,2.8vw,34px)',
                    fontWeight: 200,
                    color: 'var(--white)',
                  }}>
                    {p.price}
                  </span>
                  <BagBtn name={p.name} />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress indicator */}
            <div style={{
              position: 'absolute',
              bottom: 36, right: 36,
              display: 'flex', gap: 6, alignItems: 'center',
            }}>
              {PRODUCTS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 2,
                    width: i === active ? 28 : 6,
                    background: i === active ? 'rgba(248,246,242,0.6)' : 'rgba(248,246,242,0.15)',
                    transition: 'all 0.4s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Section label top-right */}
        <div style={{
          position: 'absolute', top: 28, right: 32, zIndex: 2,
          fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'rgba(248,246,242,0.18)',
        }}>
          The Edit · AW26
        </div>
      </div>
    </section>
  )
}
