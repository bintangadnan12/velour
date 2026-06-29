'use client'
import { motion } from 'framer-motion'

const lines = [
  { text: 'Four silhouettes.', align: 'left' as const },
  { text: 'Three fabrics.', align: 'right' as const },
  { text: 'One season.', align: 'left' as const },
  { text: 'Nothing more.', align: 'right' as const, italic: true },
]

const ease = [0.16, 1, 0.3, 1] as const

export function Manifesto() {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(80px,10vw,140px) clamp(32px,8vw,160px)',
        background: 'var(--black)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient radial */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(248,246,242,0.025) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Label */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{
          fontSize: 9,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(248,246,242,0.22)',
          marginBottom: 'clamp(48px,7vw,96px)',
        }}
      >
        The LUNARE principle
      </motion.div>

      {/* Lines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,22px)' }}>
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              overflow: 'hidden',
              textAlign: line.align,
            }}
          >
            <motion.span
              initial={{ y: '110%', opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1.15, ease, delay: i * 0.13 }}
              style={{
                display: 'block',
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(36px,6.5vw,96px)',
                fontWeight: 200,
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                color: i < lines.length - 1 ? 'rgba(248,246,242,0.7)' : 'var(--white)',
                fontStyle: line.italic ? 'italic' : 'normal',
              }}
            >
              {line.text}
            </motion.span>
          </div>
        ))}
      </div>

      {/* Bottom signature */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.7 }}
        style={{
          marginTop: 'clamp(52px,7vw,96px)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div style={{ width: 40, height: 1, background: 'rgba(248,246,242,0.15)' }} />
        <span style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(248,246,242,0.22)' }}>
          LUNARE · Est. 2021
        </span>
      </motion.div>
    </section>
  )
}
