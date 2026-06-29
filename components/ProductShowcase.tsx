'use client'
import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const ease3d = [0.16, 1, 0.3, 1] as const
const DARK   = '#0a0908'
const MUTED  = 'rgba(10,9,8,0.42)'
const SUBTLE = 'rgba(10,9,8,0.22)'
const FAINT  = 'rgba(10,9,8,0.09)'

const PRODUCTS = [
  {
    id: 1, name: 'FORMA Drift', category: 'Daily Trainer', price: '$340',
    tag: 'Bestseller · 3 Seasons',
    desc: "Recycled EVA midsole. Breathable mesh upper. The shoe you forget you're wearing — until you miss it.",
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=85&auto=format&fit=crop',
    rotation: -2,
  },
  {
    id: 2, name: 'FORMA Bone', category: 'Minimal Silhouette', price: '$295',
    tag: 'Limited · 62 remaining',
    desc: 'Full-grain leather. Tonal stitching. Wears with everything or nothing else. A wardrobe constant.',
    img: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=900&q=85&auto=format&fit=crop',
    rotation: 2,
  },
  {
    id: 3, name: 'FORMA Noir', category: 'Leather Edition', price: '$420',
    tag: 'New this season',
    desc: 'Waxed calfskin. Commando sole. Wears into work or into the night without asking permission.',
    img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=900&q=85&auto=format&fit=crop',
    rotation: -2,
  },
]

function ProductCard({ product, index }: { product: typeof PRODUCTS[0]; index: number }) {
  const wrapRef = useRef<HTMLDivElement>(null)

  // Scroll-driven 3D reveal — triggers as card enters viewport
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start 100%', 'start 15%'],
  })
  const y       = useTransform(scrollYProgress, [0, 1], [90,  0])
  const rotateX = useTransform(scrollYProgress, [0, 1], [26,  0])
  const scale   = useTransform(scrollYProgress, [0, 1], [0.86, 1])

  // Mouse 3D tilt
  const [tilt, setTilt]       = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -9, y: ((e.clientX - r.left) / r.width - 0.5) * 9 })
  }

  const isEven = index % 2 === 0

  return (
    /* Outer ref div — useScroll tracks this */
    <div ref={wrapRef} style={{ perspective: '1300px', paddingBottom: 2 }}>
      <motion.div
        style={{ y, rotateX, scale }}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
        className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-stretch`}
      >
        {/* ── Image ── */}
        <motion.div
          animate={{ rotateX: hovered ? tilt.x * 0.4 : 0, rotateY: hovered ? tilt.y * 0.4 : 0, rotateZ: hovered ? 0 : product.rotation }}
          transition={{ type: 'spring', stiffness: 160, damping: 22 }}
          style={{
            flex: '0 0 54%',
            position: 'relative',
            minHeight: 'clamp(300px, 42vw, 560px)',
            overflow: 'hidden',
            transformStyle: 'preserve-3d',
            boxShadow: hovered ? '0 30px 72px rgba(10,9,8,0.18)' : '0 8px 36px rgba(10,9,8,0.09)',
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
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.8s ease',
            }}
          />
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%)', pointerEvents: 'none' }}
          />
          <div style={{ position: 'absolute', bottom: 20, left: 22, fontFamily: 'var(--font-serif)', fontSize: 13, color: 'rgba(248,246,242,0.80)', letterSpacing: '0.08em', textShadow: '0 1px 8px rgba(0,0,0,0.35)' }}>
            {product.price}
          </div>
        </motion.div>

        {/* ── Info ── */}
        <div style={{
          flex: '0 0 46%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(36px,5vh,64px) clamp(32px,4vw,72px)',
          background: '#f5f3ef',
        }}>
          <div style={{ fontSize: 8, letterSpacing: '0.32em', textTransform: 'uppercase', color: SUBTLE, marginBottom: 12 }}>
            {product.category}
          </div>

          <motion.h3
            initial={{ opacity: 0, x: isEven ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: ease3d, delay: 0.12 }}
            style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px,3.2vw,48px)', fontWeight: 200, lineHeight: 1.06, color: DARK, marginBottom: 12 }}
          >
            {product.name}
          </motion.h3>

          <div style={{ fontSize: 8, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(10,9,8,0.34)', marginBottom: 20 }}>
            {product.tag}
          </div>

          <div style={{ width: 32, height: 1, background: FAINT, marginBottom: 20 }} />

          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2 }}
            style={{ fontSize: 13, lineHeight: 1.85, color: MUTED, marginBottom: 32, maxWidth: 300 }}
          >
            {product.desc}
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{ alignSelf: 'flex-start', fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase', padding: '12px 28px', border: `1px solid ${FAINT}`, background: 'none', color: DARK, cursor: 'pointer', fontFamily: 'inherit' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(10,9,8,0.05)'; e.currentTarget.style.borderColor = 'rgba(10,9,8,0.18)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = FAINT }}
          >
            Add to Bag
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export function ProductShowcase() {
  return (
    <section id="products" style={{ background: '#f5f3ef', padding: 'clamp(72px,10vh,120px) 0 0' }}>

      <div style={{ textAlign: 'center', marginBottom: 'clamp(48px,8vh,96px)', padding: '0 clamp(24px,5vw,80px)' }}>
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          style={{ fontSize: 9, letterSpacing: '0.34em', textTransform: 'uppercase', color: SUBTLE, marginBottom: 18 }}
        >
          Best Sellers · AW26
        </motion.div>
        <div style={{ overflow: 'hidden' }}>
          <motion.h2
            initial={{ y: '108%' }} whileInView={{ y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1.1, ease: ease3d }}
            style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(30px,4.5vw,62px)', fontWeight: 200, color: DARK, letterSpacing: '-0.01em' }}
          >
            Three pieces.<br />No more needed.
          </motion.h2>
        </div>
      </div>

      {/* Cards — no horizontal padding, full-bleed image+text rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {PRODUCTS.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  )
}
