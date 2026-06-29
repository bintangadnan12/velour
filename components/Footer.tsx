'use client'
import { motion } from 'framer-motion'

const ease3d = [0.16, 1, 0.3, 1] as const

const DARK   = '#0a0908'
const MUTED  = 'rgba(10,9,8,0.38)'
const SUBTLE = 'rgba(10,9,8,0.22)'
const FAINT  = 'rgba(10,9,8,0.07)'

export function Footer() {
  return (
    <footer
      id="footer"
      style={{
        background: '#ede9e4',
        borderTop: `1px solid ${FAINT}`,
        padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,80px) clamp(32px,4vw,56px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Top: brand + links */}
        <div className="flex items-start justify-between flex-wrap gap-12 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9, ease: ease3d }}
            style={{ maxWidth: 240 }}
          >
            <div style={{
              fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 200,
              letterSpacing: '0.26em', textTransform: 'uppercase',
              color: DARK, marginBottom: 14,
            }}>
              FORMA
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.8, color: MUTED, marginBottom: 22 }}>
              Walk with intent.<br />Founded 2022, New York.
            </p>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Instagram', 'Pinterest', 'TikTok'].map(s => (
                <a key={s} href="#"
                  style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: SUBTLE, textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = DARK }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = SUBTLE }}
                >
                  {s}
                </a>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-14 gap-y-8">
            {[
              { heading: 'Shop',    links: ['New Arrivals', 'Best Sellers', 'FORMA Drift', 'FORMA Bone', 'FORMA Noir'] },
              { heading: 'Brand',   links: ['Our Story', 'Sustainability', 'Size Guide', 'Care Guide'] },
              { heading: 'Support', links: ['Shipping & Returns', 'FAQ', 'Contact', 'Track Order'] },
            ].map((col, ci) => (
              <motion.div
                key={col.heading}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.8, ease: ease3d, delay: ci * 0.08 }}
              >
                <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: SUBTLE, marginBottom: 16 }}>
                  {col.heading}
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#"
                        style={{ fontSize: 11, letterSpacing: '0.06em', color: MUTED, textDecoration: 'none', transition: 'color 0.3s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = DARK }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = MUTED }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trust bar */}
        <div style={{
          borderTop: `1px solid ${FAINT}`,
          borderBottom: `1px solid ${FAINT}`,
          padding: '18px 0',
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
          gap: '8px 0', marginBottom: 28,
        }}>
          {['Free shipping over $200', 'Free 30-day returns', 'Secure checkout', 'GOTS certified', 'Carbon-neutral shipping', 'Lifetime repair'].map((item, i) => (
            <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 9, letterSpacing: '0.12em', color: SUBTLE, textTransform: 'uppercase' }}>
              {i > 0 && <span style={{ opacity: 0.35 }}>·</span>}
              {item}
            </span>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.12em', color: SUBTLE }}>
            © 2026 FORMA. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Use', 'Accessibility'].map(link => (
              <a key={link} href="#"
                style={{ fontSize: 10, letterSpacing: '0.1em', color: SUBTLE, textDecoration: 'none', transition: 'color 0.3s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = DARK }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = SUBTLE }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
