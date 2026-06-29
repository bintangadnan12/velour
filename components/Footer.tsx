export function Footer() {
  return (
    <footer id="footer" style={{ padding: 'clamp(48px,6vw,80px) clamp(24px,5vw,80px)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="flex items-start justify-between flex-wrap gap-10 mb-14">
          {/* Brand */}
          <div style={{ maxWidth: 220 }}>
            <div className="font-serif text-[15px] font-light tracking-[0.26em] uppercase mb-3" style={{ color: 'var(--white)' }}>
              LUNARE
            </div>
            <p className="text-[12px] leading-relaxed mb-5" style={{ color: 'rgba(248,246,242,0.35)' }}>
              Wear the quiet luxury.<br />
              Founded 2021, New York.
            </p>
            <div className="flex gap-5">
              {['Instagram', 'Pinterest', 'TikTok'].map(s => (
                <a
                  key={s}
                  href="#"
                  className="text-[9px] tracking-[0.2em] uppercase transition-colors duration-300 hover:text-white"
                  style={{ color: 'rgba(248,246,242,0.28)', textDecoration: 'none' }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-14 gap-y-8">
            {[
              { heading: 'Shop', links: ['New Arrivals', 'Best Sellers', 'Outerwear', 'Knitwear', 'Tailoring'] },
              { heading: 'Brand', links: ['Our Story', 'Sustainability', 'Size Guide', 'Care Guide'] },
              { heading: 'Support', links: ['Shipping & Returns', 'FAQ', 'Contact Us', 'Track Order'] },
            ].map(col => (
              <div key={col.heading}>
                <div className="text-[9px] tracking-[0.28em] uppercase mb-4" style={{ color: 'rgba(248,246,242,0.3)' }}>
                  {col.heading}
                </div>
                <ul className="flex flex-col gap-2.5 list-none">
                  {col.links.map(link => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-[11px] tracking-[0.08em] transition-colors duration-300 hover:text-white"
                        style={{ color: 'rgba(248,246,242,0.35)', textDecoration: 'none' }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Trust bar */}
        <div
          className="flex flex-wrap gap-4 items-center justify-center mb-8 py-5 text-center"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          {[
            'Free shipping over $150',
            'Free 30-day returns',
            'Secure checkout',
            'GOTS certified materials',
            'Carbon-neutral shipping',
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-2 text-[10px] tracking-[0.1em]" style={{ color: 'rgba(248,246,242,0.2)' }}>
              {i > 0 && <span className="hidden sm:inline" style={{ opacity: 0.3 }}>·</span>}
              {item}
            </span>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="text-[10px] tracking-[0.12em]" style={{ color: 'rgba(248,246,242,0.2)' }}>
            © 2026 LUNARE. All rights reserved.
          </div>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Use', 'Accessibility'].map(link => (
              <a
                key={link}
                href="#"
                className="text-[10px] tracking-[0.1em] transition-colors duration-300 hover:text-white"
                style={{ color: 'rgba(248,246,242,0.2)', textDecoration: 'none' }}
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
