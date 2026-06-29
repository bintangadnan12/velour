'use client'
import { useEffect, useRef, useState } from 'react'

export function Nav() {
  const navRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.5
      setVisible(pastHero)
      setScrolled(pastHero)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[500] flex items-center justify-between transition-all duration-500"
      style={{
        padding: scrolled ? '14px clamp(24px,5vw,80px)' : '26px clamp(24px,5vw,80px)',
        background: scrolled ? 'rgba(2,2,2,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201,168,76,0.1)' : '1px solid transparent',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-12px)',
        pointerEvents: visible ? 'all' : 'none',
      }}
    >
      <div className="font-serif tracking-[0.28em] uppercase text-[19px] font-light" style={{ color: 'var(--white)' }}>
        LUN<em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>ARE</em>
      </div>
      <ul className="hidden md:flex gap-9 list-none">
        {[['New Arrivals', 'edit'], ['Collections', 'features'], ['About', 'story'], ['Contact', 'footer']].map(([label, id]) => (
          <li key={id}>
            <button
              onClick={() => goTo(id)}
              className="text-[10px] tracking-[0.22em] uppercase transition-colors duration-300 hover:text-white"
              style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => goTo('edit')}
        className="text-[10px] tracking-[0.22em] uppercase transition-all duration-300 hover:text-black"
        style={{
          color: 'var(--gold)',
          border: '1px solid rgba(201,168,76,0.35)',
          padding: '10px 22px',
          background: 'none',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          (e.target as HTMLElement).style.background = 'var(--gold)'
          ;(e.target as HTMLElement).style.color = 'var(--black)'
        }}
        onMouseLeave={e => {
          (e.target as HTMLElement).style.background = 'none'
          ;(e.target as HTMLElement).style.color = 'var(--gold)'
        }}
      >
        Shop the Drop
      </button>
    </nav>
  )
}
