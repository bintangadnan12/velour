'use client'
import { motion } from 'framer-motion'

const ease3d = [0.16, 1, 0.3, 1] as const

const DARK   = '#0a0908'
const MUTED  = 'rgba(10,9,8,0.45)'
const SUBTLE = 'rgba(10,9,8,0.24)'
const FAINT  = 'rgba(10,9,8,0.08)'

const STATS = [
  { value: '2022', label: 'Founded' },
  { value: '200',  label: 'Units per style' },
  { value: '12',   label: 'Styles per year' },
]

const PRINCIPLES = [
  {
    title: 'Material honesty',
    body:  'Every component is disclosed. No blended fabrics sold as pure. No synthetic leather sold as real.',
  },
  {
    title: 'Scale discipline',
    body:  "200 pairs per style. No exceptions. When it's gone, it doesn't come back.",
  },
  {
    title: 'Lifetime repair',
    body:  'Every FORMA comes with free repair for life. Because ownership should mean something.',
  },
]

export function AboutSection() {
  return (
    <section
      id="about"
      style={{
        background: '#ffffff',
        padding: 'clamp(100px,14vh,180px) clamp(32px,6vw,120px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle ambient */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(10,9,8,0.02) 0%, transparent 70%)',
        }}
      />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: 9, letterSpacing: '0.34em', textTransform: 'uppercase',
            color: SUBTLE,
            marginBottom: 'clamp(32px,5vh,56px)',
          }}
        >
          About FORMA
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(48px,8vw,120px)',
          alignItems: 'start',
        }}>

          {/* Left: brand story */}
          <div>
            <div style={{ overflow: 'hidden', marginBottom: 'clamp(20px,3vh,36px)' }}>
              <motion.h2
                initial={{ y: '108%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: ease3d }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(28px,3.8vw,56px)',
                  fontWeight: 200, lineHeight: 1.08,
                  color: DARK, letterSpacing: '-0.01em',
                }}
              >
                Built for the ground<br />beneath your feet.
              </motion.h2>
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: ease3d, delay: 0.2 }}
              style={{
                width: 40, height: 1,
                background: FAINT,
                transformOrigin: 'left',
                marginBottom: 28,
              }}
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: ease3d, delay: 0.25 }}
              style={{ fontSize: 'clamp(13px,1.2vw,15px)', lineHeight: 1.9, color: MUTED, marginBottom: 22, maxWidth: 440 }}
            >
              FORMA began in 2022 with a single question: why does footwear that costs a thousand dollars still feel disposable at eighteen months?
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: ease3d, delay: 0.35 }}
              style={{ fontSize: 'clamp(13px,1.2vw,15px)', lineHeight: 1.9, color: 'rgba(10,9,8,0.35)', maxWidth: 440 }}
            >
              We stripped out the marketing, the seasonal overproduction, the name-chasing. What remained was material honesty, precision construction, and the discipline to make only 200 pairs per style — ever.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.6 }}
              style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 14 }}
            >
              <div style={{ width: 36, height: 1, background: FAINT }} />
              <span style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: SUBTLE }}>
                FORMA Studio · New York
              </span>
            </motion.div>
          </div>

          {/* Right: stats + principles */}
          <div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0 20px',
              marginBottom: 'clamp(40px,6vh,72px)',
            }}>
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.85, ease: ease3d, delay: 0.15 + i * 0.12 }}
                >
                  <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(26px,3vw,44px)',
                    fontWeight: 200, color: DARK,
                    lineHeight: 1, marginBottom: 10,
                  }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase', color: SUBTLE }}>
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {PRINCIPLES.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.85, ease: ease3d, delay: 0.2 + i * 0.12 }}
                  style={{ padding: '22px 0', borderBottom: `1px solid ${FAINT}` }}
                >
                  <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(10,9,8,0.50)', marginBottom: 8 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 12, lineHeight: 1.75, color: MUTED }}>
                    {item.body}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
