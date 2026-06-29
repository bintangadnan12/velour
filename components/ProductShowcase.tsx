'use client'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

const ease3d = [0.16, 1, 0.3, 1] as const

const DARK   = '#0a0908'
const MUTED  = 'rgba(10,9,8,0.42)'
const SUBTLE = 'rgba(10,9,8,0.22)'
const FAINT  = 'rgba(10,9,8,0.09)'

const PRODUCTS = [
  {
    id: 1,
    name: 'FORMA Drift',
    category: 'Daily Trainer',
    price: '$340',
    tag: 'Bestseller · 3 Seasons',
    desc: "Recycled EVA midsole. Breathable mesh upper. The shoe you forget you're wearing — until you miss it.",
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=85&auto=format&fit=crop',
    rotation: -2,
  },
  {
    id: 2,
    name: 'FORMA Bone',
    category: 'Minimal Silhouette',
    price: '$295',
    tag: 'Limited · 62 remaining',
    desc: 'Full-grain leather. Tonal stitching. Wears with everything or nothing else. A wardrobe constant.',
    img: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=900&q=85&auto=format&fit=crop',
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
    rotation: -2,
  },
]

function ProductCard({ product, index }: { product: typeof PRODUCTS[0]; index: number }) {
  const [tilt, setTilt]       = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r  = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width  - 0.5
    const ny = (e.clientY - r.top)  / r.height - 0.5
    setTilt({ x: ny * -8, y: nx * 8 })
  }

  const isEven = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 1.0, ease: ease3d, delay: 0.05 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        alignItems: 'center',
        gap: 0,
      }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
    >
      {/* ── Image panel ── */}
      <motion.div
        ref={imgRef}
        animate={{
          rotateX: hovered ? tilt.x * 0.5 : 0,
          rotateY: hovered ? tilt.y * 0.5 : 0,
          rotateZ: hovered ? 0 : product.rotation,
          order:   isEven ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 160, damping: 22 }}
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(320px, 44vw, 580px)',
          overflow: 'hidden',
          transformStyle: 'preserve-3d',
          order: isEven ? 0 : 1,
          boxShadow: hovered
            ? '0 28px 64px rgba(10,9,8,0.16)'
            : '0 8px 32px rgba(10,9,8,0.08)',
          transition: 'box-shadow 0.5s ease',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.img}
          alt={product.name}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.7s ease',
          }}
        />
        {/* Gloss */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 55%)',
            pointerEvents: 'none',
          }}
        />
        {/* Price chip */}
        <div style={{
          position: 'absolute', bottom: 20, left: 20,
          fontFamily: 'var(--font-serif)', fontSize: 13,
          color: 'rgba(248,246,242,0.80)', letterSpacing: '0.08em',
          textShadow: '0 1px 8px rgba(0,0,0,0.4)',
        }}>
          {product.price}
        </div>
      </motion.div>

      {/* ── Info panel ── */}
      <div style={{
        padding: 'clamp(40px,6vh,72px) clamp(36px,5vw,80px)',
        order: isEven ? 1 : 0,
      }}>
        <div style={{ fontSize: 8, letterSpacing: '0.32em', textTransform: 'uppercase', color: SUBTLE, marginBottom: 12 }}>
          {product.category}
        </div>

        <motion.h3
          initial={{ opacity: 0, x: isEven ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: ease3d, delay: 0.15 }}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(28px,3.5vw,52px)',
            fontWeight: 200, lineHeight: 1.06,
            color: DARK, marginBottom: 14,
          }}
        >
          {product.name}
        </motion.h3>

        <div style={{ fontSize: 8, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(10,9,8,0.36)', marginBottom: 22 }}>
          {product.tag}
        </div>

        <motion.div
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}
          style={{ width: 32, height: 1, background: FAINT, transformOrigin: 'left', marginBottom: 22 }}
        />

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.25 }}
          style={{ fontSize: 13, lineHeight: 1.85, color: MUTED, marginBottom: 36, maxWidth: 320 }}
        >
          {product.desc}
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{
            fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase',
            padding: '13px 30px',
            border: `1px solid ${FAINT}`,
            background: 'none', color: DARK,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(10,9,8,0.05)'; e.currentTarget.style.borderColor = 'rgba(10,9,8,0.20)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = FAINT }}
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

      {/* Header */}
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

      {/* Product rows — no gap between image and text, full bleed grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(48px,8vh,100px)' }}>
        {PRODUCTS.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  )
}
