'use client'
import { useEffect, useRef, useState } from 'react'
import { BRAND, FOOTER } from '@/config/site'

export function Nav() {
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToSection = (pct: number) => {
    setMenuOpen(false)
    const totalScroll = document.body.scrollHeight - window.innerHeight
    window.scrollTo({ top: totalScroll * pct, behavior: 'smooth' })
  }

  const links: [string, number | string][] = [
    ['Collection', 0.21],
    ['Craft', 0.41],
    ['Shop', 'products'],
    ['About', 'about'],
  ]

  const goToId = (id: string) => {
    setMenuOpen(false)
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[500] flex items-center justify-between transition-all duration-500"
        style={{
          padding: scrolled ? '14px clamp(24px,5vw,80px)' : '22px clamp(24px,5vw,80px)',
          background: scrolled ? 'rgba(2,2,2,0.92)' : 'rgba(2,2,2,0.18)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled
            ? '1px solid rgba(255,255,255,0.07)'
            : '1px solid rgba(255,255,255,0.03)',
        }}
      >
        <div
          className="font-serif tracking-[0.28em] uppercase text-[17px] font-light cursor-pointer select-none"
          style={{ color: 'var(--white)' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {BRAND.name}
        </div>

        <ul className="hidden md:flex gap-9 list-none">
          {links.map(([label, target]) => (
            <li key={label}>
              <button
                onClick={() => typeof target === 'number' ? scrollToSection(target) : goToId(target as string)}
                className="text-[10px] tracking-[0.22em] uppercase transition-colors duration-300 hover:text-white"
                style={{ color: 'rgba(248,246,242,0.45)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => scrollToSection(0.81)}
          className="hidden md:block text-[10px] tracking-[0.22em] uppercase transition-all duration-300"
          style={{ color: 'var(--white)', border: '1px solid rgba(255,255,255,0.18)', padding: '9px 22px', background: 'none', cursor: 'pointer' }}
          onMouseEnter={e => { const t = e.currentTarget; t.style.background = 'var(--white)'; t.style.color = 'var(--black)' }}
          onMouseLeave={e => { const t = e.currentTarget; t.style.background = 'none'; t.style.color = 'var(--white)' }}
        >
          {FOOTER.nav[0]?.links[0] ? 'Shop the Drop' : 'Shop Now'}
        </button>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
        >
          <span className="block w-5 h-px transition-all duration-300" style={{ background: 'var(--white)', transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none' }} />
          <span className="block w-5 h-px transition-all duration-300" style={{ background: 'var(--white)', opacity: menuOpen ? 0 : 1 }} />
          <span className="block w-5 h-px transition-all duration-300" style={{ background: 'var(--white)', transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile overlay menu */}
      <div
        className="fixed inset-0 z-[400] flex flex-col items-center justify-center md:hidden transition-all duration-500"
        style={{ background: 'rgba(2,2,2,0.97)', backdropFilter: 'blur(24px)', opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'all' : 'none' }}
      >
        <ul className="flex flex-col items-center gap-8 list-none mb-14">
          {links.map(([label, target], i) => (
            <li key={label}>
              <button
                onClick={() => typeof target === 'number' ? scrollToSection(target) : goToId(target as string)}
                className="font-serif font-extralight uppercase tracking-[0.14em]"
                style={{
                  fontSize: 'clamp(28px,7vw,44px)',
                  color: 'rgba(248,246,242,0.7)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  transitionDelay: `${i * 55}ms`,
                }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={() => scrollToSection(0.81)}
          className="text-[10px] tracking-[0.26em] uppercase"
          style={{ color: 'var(--white)', border: '1px solid rgba(255,255,255,0.2)', padding: '14px 40px', background: 'none', cursor: 'pointer' }}
        >
          Shop the Drop
        </button>
      </div>
    </>
  )
}
