'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BRAND, FOOTER as F, INTEGRATIONS } from '@/config/site'

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
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 200, letterSpacing: '0.28em', textTransform: 'uppercase', color: DARK, marginBottom: 10 }}>{BRAND.name}</div>
            <p style={{ fontSize: 12, lineHeight: 1.75, color: MUTED, marginBottom: 18, maxWidth: 200 }}>{F.tagline}<br />Founded {BRAND.founded}, {BRAND.city}.</p>

            {/* WhatsApp in footer when enabled */}
            {INTEGRATIONS.whatsapp.enabled && (
              <a href={`https://wa.me/${INTEGRATIONS.whatsapp.number}?text=${encodeURIComponent(INTEGRATIONS.whatsapp.message)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#25D366', textDecoration: 'none', marginBottom: 14 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {INTEGRATIONS.whatsapp.label}
              </a>
            )}

            <div style={{ display: 'flex', gap: 18 }}>
              {F.socials.map(s => (
                <a key={s} href="#"
                  style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: SUBTLE, textDecoration: 'none', transition: 'color 0.25s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = DARK }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = SUBTLE }}
                >{s}</a>
              ))}
            </div>
          </motion.div>

          {/* Nav columns */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : `repeat(${Math.min(F.nav.length,3)},1fr)`, gap: isMobile ? '28px 20px' : 'clamp(24px,3vw,52px)' }}>
            {F.nav.map((col, ci) => (
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
          {F.trustBar.map((item, i) => (
            <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 9, letterSpacing: '0.1em', color: SUBTLE, textTransform: 'uppercase' }}>
              {i > 0 && <span style={{ opacity: 0.3 }}>·</span>}
              {item}
            </span>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.1em', color: SUBTLE }}>{F.copyright}</div>
          <div style={{ display: 'flex', gap: 18 }}>
            {F.legal.map(link => (
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
