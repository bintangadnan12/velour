export function Footer() {
  return (
    <footer id="footer" style={{ padding: '52px clamp(24px,5vw,80px)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-start justify-between flex-wrap gap-8 mb-12">
        <div>
          <div className="font-serif text-[16px] font-light tracking-[0.26em] uppercase mb-3">
            LUN<em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>ARE</em>
          </div>
          <p className="text-[12px] max-w-[240px] leading-relaxed" style={{ color: 'var(--muted)' }}>
            Wear the quiet luxury.<br />Minimalist fashion for those who choose well.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-16 gap-y-2">
          {[
            { heading: 'Shop', links: ['New Arrivals', 'Best Sellers', 'Outerwear', 'Knitwear', 'Tailoring'] },
            { heading: 'Info', links: ['About LUNARE', 'Sustainability', 'Size Guide', 'Care Instructions'] },
            { heading: 'Support', links: ['Shipping & Returns', 'FAQ', 'Contact Us', 'Track Order'] },
          ].map(col => (
            <div key={col.heading}>
              <div className="text-[9px] tracking-[0.28em] uppercase mb-4" style={{ color: 'var(--gold)' }}>{col.heading}</div>
              <ul className="flex flex-col gap-2 list-none">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-[11px] tracking-[0.12em] transition-colors duration-300 hover:text-white"
                      style={{ color: 'var(--muted)', textDecoration: 'none' }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between flex-wrap gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24 }}>
        <div className="text-[10px] tracking-[0.16em] uppercase" style={{ color: 'var(--muted)' }}>
          © 2025 LUNARE. All rights reserved.
        </div>
        <div className="flex gap-6">
          {['Instagram', 'Pinterest', 'TikTok'].map(s => (
            <a key={s} href="#" className="text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 hover:text-white"
              style={{ color: 'var(--muted)', textDecoration: 'none' }}>{s}</a>
          ))}
        </div>
        <div className="text-[10px] tracking-[0.12em]" style={{ color: 'rgba(248,246,242,0.2)' }}>
          Free shipping over $150 · Free returns 30 days
        </div>
      </div>
    </footer>
  )
}
