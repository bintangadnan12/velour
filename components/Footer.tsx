'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function useIsMobile() {
  const [m, setM] = useState(false)
  useEffect(() => {
    const check = () => setM(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return m
}

const ease3d = [0.16, 1, 0.3, 1] as const
const DARK   = '#0a0908'
const MUTED  = 'rgba(10,9,8,0.40)'
const SUBTLE = 'rgba(10,9,8,0.22)'
const FAINT  = 'rgba(10,9,8,0.07)'

export function Footer() {
  const isMobile = useIsMobile()
  return (
    <footer id="footer" style={{ background: '#ede9e4', borderTop: `1px solid ${FAINT}` }}>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(44px,5vw,72px) clamp(24px,5vw,80px) clamp(28px,3vw,44px)' }}>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto', gap: 'clamp(32px,4vw,56px)', marginBottom: 'clamp(28px,3vh,40px)', alignItems: 'start' }}>

          {/* Brand block */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.85, ease: ease3d }}
          >
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 200, letterSpacing: '0.28em', textTransform: 'uppercase', color: DARK, marginBottom: 10 }}>FORMA</div>
            <p style={{ fontSize: 12, lineHeight: 1.75, color: MUTED, marginBottom: 18, maxWidth: 200 }}>Walk with intent.<br />Founded 2022, New York.</p>
            <div style={{ display: 'flex', gap: 18 }}>
              {['Instagram', 'Pinterest', 'TikTok'].map(s => (
                <a key={s} href="#"
                  style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: SUBTLE, textDecoration: 'none', transition: 'color 0.25s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = DARK }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = SUBTLE }}
                >{s}</a>
              ))}
            </div>
          </motion.div>

          {/* Nav columns */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: isMobile ? '28px 20px' : 'clamp(24px,3vw,52px)' }}>
            {[
              { heading: 'Shop',    links: ['New Arrivals', 'Best Sellers', 'FORMA Drift', 'FORMA Bone', 'FORMA Noir'] },
              { heading: 'Brand',   links: ['Our Story', 'Sustainability', 'Size Guide', 'Care Guide'] },
              { heading: 'Support', links: ['Shipping & Returns', 'FAQ', 'Contact', 'Track Order'] },
            ].map((col, ci) => (
              <motion.div key={col.heading}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.7, ease: ease3d, delay: ci * 0.07 }}
              >
                <div style={{ fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase', color: SUBTLE, marginBottom: 14 }}>{col.heading}</div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#"
                        style={{ fontSize: 11, color: MUTED, textDecoration: 'none', transition: 'color 0.25s', letterSpacing: '0.04em' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = DARK }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = MUTED }}
                      >{link}</a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trust bar — compact single line */}
        <div style={{ borderTop: `1px solid ${FAINT}`, borderBottom: `1px solid ${FAINT}`, padding: '12px 0', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0, marginBottom: 20 }}>
          {['Free shipping over $200', 'Free 30-day returns', 'Secure checkout', 'GOTS certified', 'Carbon-neutral shipping', 'Lifetime repair'].map((item, i) => (
            <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 9, letterSpacing: '0.1em', color: SUBTLE, textTransform: 'uppercase' }}>
              {i > 0 && <span style={{ opacity: 0.3 }}>·</span>}
              {item}
            </span>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.1em', color: SUBTLE }}>© 2026 FORMA. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 18 }}>
            {['Privacy Policy', 'Terms of Use', 'Accessibility'].map(link => (
              <a key={link} href="#"
                style={{ fontSize: 10, letterSpacing: '0.08em', color: SUBTLE, textDecoration: 'none', transition: 'color 0.25s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = DARK }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = SUBTLE }}
              >{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
