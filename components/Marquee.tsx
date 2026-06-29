export function Marquee() {
  const items = ['Quiet Luxury', 'Limited Drop', 'Organic Cotton', 'Merino Wool', 'Free Returns', 'Slow Fashion', 'Precision Tailoring', 'Recycled Cashmere']
  const doubled = [...items, ...items]

  return (
    <div className="py-14 overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex gap-[72px] w-max" style={{ animation: 'marquee 28s linear infinite' }}
        onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
        onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
      >
        {doubled.map((item, i) => (
          <span key={i} className="font-serif text-[clamp(28px,3.5vw,44px)] font-extralight tracking-wide whitespace-nowrap flex-shrink-0 transition-colors duration-300 cursor-default"
            style={{ color: i % 2 === 1 ? 'var(--gold)' : 'rgba(248,246,242,0.1)' }}
            onMouseEnter={e => { if (i % 2 === 0) (e.target as HTMLElement).style.color = 'var(--gold)' }}
            onMouseLeave={e => { if (i % 2 === 0) (e.target as HTMLElement).style.color = 'rgba(248,246,242,0.1)' }}
          >
            {i % 2 === 1 ? '✦' : item}
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  )
}
