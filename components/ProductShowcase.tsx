'use client'
import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const ease3d = [0.16, 1, 0.3, 1] as const

const DARK = '#0a0908'
const MUTED  = 'rgba(10,9,8,0.42)'
const SUBTLE = 'rgba(10,9,8,0.22)'
const FAINT  = 'rgba(10,9,8,0.10)'

const PRODUCTS = [
  {
    id: 1,
    name: 'FORMA Drift',
    category: 'Daily Trainer',
    price: '$340',
    tag: 'Bestseller · 3 Seasons',
    desc: "Recycled EVA midsole. Breathable mesh upper. The shoe you forget you're wearing — until you miss it.",
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=85&auto=format&fit=crop',
    accent: '#8c7d6e',
    rotation: -3,
  },
  {
    id: 2,
    name: 'FORMA Bone',
    category: 'Minimal Silhouette',
    price: '$295',
    tag: 'Limited · 62 remaining',
    desc: 'Full-grain leather. Tonal stitching. Wears with everything or nothing else. A wardrobe constant.',
    img: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=900&q=85&auto=format&fit=crop',
    accent: '#8c7d6e',
    rotation: 2,
  },
  {
    id: 3,
    name: 'FORMA Noir',
    category: 'Leather Edition',
    price: '$420',
    tag: 'New this season',
    desc: 'Waxed calfskin. Commando sole. Wears into work or into the night without asking permission.',
    img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=900&q=85&auto=format&fit=crop',
    accent: '#8c7d6e',
    rotation: -2,
  },
]

function ProductCard({ product, index }: { product: typeof PRODUCTS[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start end', 'center center'] })

  const y       = useTransform(scrollYProgress, [0, 1], [100, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1])
  const rotateX = useTransform(scrollYProgress, [0, 1], [18, 0])
  const scale   = useTransform(scrollYProgress, [0, 1], [0.9, 1])

  const [tilt, setTilt]       = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r  = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width  - 0.5
    const ny = (e.clientY - r.top)  / r.height - 0.5
    setTilt({ x: ny * -9, y: nx * 9 })
  }

  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={cardRef}
      style={{ y, opacity, rotateX, scale, transformPerspective: 1200 }}
      className={`flex flex-col md:flex-row items-center gap-0 ${isEven ? '' : 'md:flex-row-reverse'}`}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
    >
      {/* Image panel */}
      <motion.div
        animate={{
          rotateX: hovered ? tilt.x * 0.5 : 0,
          rotateY: hovered ? tilt.y * 0.5 : 0,
          rotateZ: hovered ? 0 : product.rotation,
        }}
        transition={{ type: 'spring', stiffness: 160, damping: 22 }}
        style={{
          flex: '0 0 52%',
          aspectRatio: '4/3',
          overflow: 'hidden',
          position: 'relative',
          transformStyle: 'preserve-3d',
          boxShadow: hovered
            ? '0 32px 80px rgba(10,9,8,0.18), 0 8px 24px rgba(10,9,8,0.10)'
            : '0 12px 40px rgba(10,9,8,0.10)',
          transition: 'box-shadow 0.5s ease',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.img}
          alt={product.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            filter: 'brightness(0.96)',
            transition: 'transform 0.7s ease',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}
        />
        {/* Gloss on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
        {/* Price */}
        <div style={{
          position: 'absolute', bottom: 18, left: 20,
          fontFamily: 'var(--font-serif)', fontSize: 13,
          color: 'rgba(248,246,242,0.75)', letterSpacing: '0.08em',
        }}>
          {product.price}
        </div>
      </motion.div>

      {/* Info panel */}
      <div style={{
        flex: '0 0 48%',
        padding: isEven
          ? 'clamp(32px,5vh,60px) clamp(32px,5vw,72px) clamp(32px,5vh,60px) clamp(40px,5vw,80px)'
          : 'clamp(32px,5vh,60px) clamp(40px,5vw,80px) clamp(32px,5vh,60px) clamp(32px,5vw,72px)',
      }}>
        <div style={{ fontSize: 8, letterSpacing: '0.32em', textTransform: 'uppercase', color: SUBTLE, marginBottom: 10 }}>
          {product.category}
        </div>

        <motion.h3
          initial={{ opacity: 0, x: isEven ? -22 : 22 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1.0, ease: ease3d, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(28px,3.5vw,52px)',
            fontWeight: 200, lineHeight: 1.06,
            color: DARK, marginBottom: 14,
          }}
        >
          {product.name}
        </motion.h3>

        <div style={{ fontSize: 8, letterSpacing: '0.24em', textTransform: 'uppercase', color: product.accent, marginBottom: 20 }}>
          {product.tag}
        </div>

        <motion.div
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}
          style={{ width: 32, height: 1, background: FAINT, transformOrigin: 'left', marginBottom: 20 }}
        />

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.3 }}
          style={{ fontSize: 13, lineHeight: 1.85, color: MUTED, marginBottom: 36, maxWidth: 320 }}
        >
          {product.desc}
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{
            fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase',
            padding: '13px 30px',
            border: `1px solid ${FAINT}`,
            background: 'none', color: DARK,
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'background 0.3s, border-color 0.3s',
          }}
          onMouseEnter={e => { const t = e.currentTarget; t.style.background = 'rgba(10,9,8,0.06)'; t.style.borderColor = 'rgba(10,9,8,0.22)' }}
          onMouseLeave={e => { const t = e.currentTarget; t.style.background = 'none'; t.style.borderColor = FAINT }}
        >
          Add to Bag
        </motion.button>
      </div>
    </motion.div>
  )
}

export function ProductShowcase() {
  return (
    <section id="products" style={{ background: '#f5f3ef', padding: 'clamp(80px,12vh,140px) 0' }}>

      <div style={{ textAlign: 'center', marginBottom: 'clamp(60px,10vh,120px)', padding: '0 clamp(24px,5vw,80px)' }}>
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          style={{ fontSize: 9, letterSpacing: '0.34em', textTransform: 'uppercase', color: SUBTLE, marginBottom: 20 }}
        >
          Best Sellers · AW26
        </motion.div>
        <div style={{ overflow: 'hidden' }}>
          <motion.h2
            initial={{ y: '108%' }} whileInView={{ y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1.1, ease: ease3d }}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(32px,5vw,68px)',
              fontWeight: 200, color: DARK, letterSpacing: '-0.01em',
            }}
          >
            Three pieces.<br />No more needed.
          </motion.h2>
        </div>
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column',
        gap: 'clamp(60px,10vh,120px)',
        padding: '0 clamp(24px,4vw,60px)',
        maxWidth: 1300, margin: '0 auto',
        perspective: '1200px',
      }}>
        {PRODUCTS.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  )
}
