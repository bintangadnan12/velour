export function Marquee() {
  const items = [
    'Quiet Luxury',
    'Limited to 200',
    'Organic Cotton',
    'Merino Wool',
    'Free Returns',
    'Slow Fashion',
    'Precision Tailoring',
    'Recycled Cashmere',
  ]
  const repeated = [...items, ...items, ...items]

  return (
    <div
      className="py-12 overflow-hidden select-none"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div
        className="flex w-max"
        style={{ animation: 'marquee-slow 60s linear infinite', gap: '80px' }}
        onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
        onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className="font-serif font-extralight whitespace-nowrap flex-shrink-0 cursor-default"
            style={{
              fontSize: 'clamp(22px,2.8vw,36px)',
              color: i % (items.length + 1) === items.length
                ? 'rgba(248,246,242,0.06)'
                : 'rgba(248,246,242,0.08)',
              letterSpacing: '0.04em',
            }}
          >
            {item}
            <span style={{ marginLeft: 80, color: 'rgba(248,246,242,0.05)', fontSize: '0.6em' }}>·</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee-slow {
          from { transform: translateX(0) }
          to { transform: translateX(-33.333%) }
        }
      `}</style>
    </div>
  )
}
