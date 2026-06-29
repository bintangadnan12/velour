'use client'
import { useState } from 'react'

export function Newsletter() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <section
      id="newsletter"
      style={{
        padding: 'clamp(80px,11vw,140px) clamp(24px,5vw,80px)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <span className="block text-[9px] tracking-[0.34em] uppercase mb-8" style={{ color: 'rgba(248,246,242,0.3)' }}>
          Stay in the loop
        </span>
        <h2
          className="font-serif font-extralight mb-5"
          style={{ fontSize: 'clamp(28px,4vw,52px)', color: 'var(--white)', lineHeight: 1.15 }}
        >
          For those who prefer<br />to know first.
        </h2>
        <p className="text-[13px] mb-10" style={{ color: 'rgba(248,246,242,0.4)', lineHeight: 1.75 }}>
          New drops, restock alerts, and early access — quietly, to your inbox.
          Never more than twice a month.
        </p>

        {sent ? (
          <div
            className="text-[12px] tracking-[0.18em] uppercase py-5"
            style={{ color: 'rgba(248,246,242,0.55)', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            You&rsquo;re on the list.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex max-w-[380px] mx-auto">
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="flex-1 text-[12px] outline-none"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRight: 'none',
                color: 'var(--white)',
                padding: '14px 18px',
                fontFamily: 'inherit',
              }}
            />
            <button
              type="submit"
              className="text-[10px] tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-300"
              style={{
                background: 'var(--white)',
                color: 'var(--black)',
                border: 'none',
                padding: '14px 22px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 500,
              }}
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="text-[10px] mt-5 tracking-[0.06em]" style={{ color: 'rgba(248,246,242,0.18)' }}>
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}
