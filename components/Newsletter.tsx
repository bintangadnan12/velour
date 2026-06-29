'use client'
import { useState } from 'react'

export function Newsletter() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section id="newsletter" className="text-center relative overflow-hidden"
      style={{ padding: 'clamp(100px,14vw,180px) clamp(24px,5vw,80px)', background: 'linear-gradient(to bottom, var(--black), #0e0b02)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)' }} />
      <div className="inline-flex items-center gap-3.5 text-[10px] tracking-[0.26em] uppercase mb-10 relative z-[1]"
        style={{ color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.18)', padding: '10px 24px' }}>
        ✦ &nbsp;Join the Drop&nbsp; ✦
      </div>
      <h2 className="relative z-[1] font-serif font-extralight uppercase"
        style={{ fontSize: 'clamp(40px,8vw,110px)', lineHeight: 0.92, letterSpacing: '0.01em', color: 'var(--white)', marginBottom: 16 }}>
        Be first<br />for the next<br /><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>drop.</em>
      </h2>
      <p className="relative z-[1] text-[14px] mb-12" style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
        New arrivals, restock alerts, and early access — direct to your inbox.<br />
        <strong style={{ color: 'var(--white)', fontWeight: 400 }}>No noise. Only what matters.</strong>
      </p>
      <form onSubmit={handleSubmit} className="relative z-[1] flex max-w-[420px] mx-auto mb-6">
        <input
          type="email"
          required
          placeholder="your@email.com"
          className="flex-1 text-[13px] outline-none"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRight: 'none',
            color: 'var(--white)',
            padding: '16px 20px',
            fontFamily: 'inherit',
          }}
        />
        <button
          type="submit"
          className="text-[10px] tracking-[0.2em] uppercase font-semibold whitespace-nowrap transition-colors duration-300"
          style={{
            background: sent ? '#2d6a2d' : 'var(--gold)',
            color: 'var(--black)',
            border: 'none',
            padding: '16px 26px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {sent ? 'Joined ✓' : 'Join the Drop'}
        </button>
      </form>
      <p className="relative z-[1] text-[11px] tracking-[0.08em]" style={{ color: 'rgba(248,246,242,0.25)' }}>
        Unsubscribe anytime. No spam, ever.
      </p>
    </section>
  )
}
