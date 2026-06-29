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
  { title: 'Material honesty', body: 'Every component is disclosed. No blended fabrics sold as pure. No synthetic leather sold as real.' },
  { title: 'Scale discipline',  body: "200 pairs per style. No exceptions. When it's gone, it doesn't come back." },
  { title: 'Lifetime repair',   body: 'Every FORMA comes with free repair for life. Because ownership should mean something.' },
]

export function AboutSection() {
  return (
    <section id="about" style={{ background: '#ffffff', position: 'relative', overflow: 'hidden' }}>

      {/* Top border accent */}
      <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(10,9,8,0.08) 20%, rgba(10,9,8,0.08) 80%, transparent)' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(56px,7vh,96px) clamp(28px,5vw,100px)' }}>

        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ fontSize: 9, letterSpacing: '0.34em', textTransform: 'uppercase', color: SUBTLE, marginBottom: 'clamp(28px,4vh,48px)' }}
        >
          About FORMA
        </motion.div>

        {/* Two-column grid — fills full height, no gaps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(36px,6vw,96px)',
        }}>

          {/* Left — story */}
          <div>
            <div style={{ overflow: 'hidden', marginBottom: 'clamp(16px,2.5vh,28px)' }}>
              <motion.h2
                initial={{ y: '108%' }} whileInView={{ y: 0 }} viewport={{ once: true }}
                transition={{ duration: 1.1, ease: ease3d }}
                style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px,3.4vw,50px)', fontWeight: 200, lineHeight: 1.1, color: DARK, letterSpacing: '-0.01em' }}
              >
                Built for the ground<br />beneath your feet.
              </motion.h2>
            </div>

            <div style={{ width: 36, height: 1, background: FAINT, marginBottom: 22 }} />

            <motion.p
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.85, ease: ease3d, delay: 0.15 }}
              style={{ fontSize: 'clamp(12px,1.1vw,14px)', lineHeight: 1.9, color: MUTED, marginBottom: 18, maxWidth: 420 }}
            >
              FORMA began in 2022 with a single question: why does footwear that costs a thousand dollars still feel disposable at eighteen months?
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.85, ease: ease3d, delay: 0.25 }}
              style={{ fontSize: 'clamp(12px,1.1vw,14px)', lineHeight: 1.9, color: 'rgba(10,9,8,0.33)', maxWidth: 420, marginBottom: 28 }}
            >
              We stripped out the marketing, the seasonal overproduction, the name-chasing. What remained was material honesty, precision construction, and the discipline to make only 200 pairs per style — ever.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <div style={{ width: 30, height: 1, background: FAINT }} />
              <span style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: SUBTLE }}>FORMA Studio · New York</span>
            </motion.div>
          </div>

          {/* Right — stats + principles */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>

            {/* Stats — 3 numbers side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0 16px', marginBottom: 'clamp(28px,4vh,48px)', paddingBottom: 'clamp(24px,3vh,40px)', borderBottom: `1px solid ${FAINT}` }}>
              {STATS.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: ease3d, delay: 0.12 + i * 0.1 }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px,2.8vw,40px)', fontWeight: 200, color: DARK, lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
                  <div style={{ fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: SUBTLE }}>{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Principles — compact list */}
            <div>
              {PRINCIPLES.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: ease3d, delay: 0.1 + i * 0.1 }}
                  style={{ padding: 'clamp(14px,2vh,22px) 0', borderBottom: `1px solid ${FAINT}` }}
                >
                  <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(10,9,8,0.48)', marginBottom: 6 }}>{item.title}</div>
                  <div style={{ fontSize: 12, lineHeight: 1.7, color: MUTED }}>{item.body}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
