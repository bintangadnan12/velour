'use client'
import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Customization options ────────────────────────────────────────────────────
const UPPER_COLORS = [
  { id: 'chalk',   label: 'Chalk',     hex: '#f5f3ef' },
  { id: 'obsidian',label: 'Obsidian',  hex: '#1a1a1a' },
  { id: 'clay',    label: 'Clay',      hex: '#b08060' },
  { id: 'forest',  label: 'Forest',    hex: '#3a4f3a' },
  { id: 'slate',   label: 'Slate',     hex: '#6b7280' },
  { id: 'sand',    label: 'Sand',      hex: '#c8b89a' },
]
const MIDSOLE_COLORS = [
  { id: 'white',   label: 'White',     hex: '#f0ece6' },
  { id: 'cream',   label: 'Cream',     hex: '#d9c9ad' },
  { id: 'black',   label: 'Black',     hex: '#1a1a1a' },
  { id: 'gum',     label: 'Gum',       hex: '#c49a6c' },
]
const SOLE_PATTERNS = [
  { id: 'flat',    label: 'Clean Flat',   desc: 'Minimal profile' },
  { id: 'commando',label: 'Commando',     desc: 'Deep lug traction' },
  { id: 'wave',    label: 'Wave Grid',    desc: 'Lateral stability' },
]

// ── Sole SVG paths ────────────────────────────────────────────────────────────
function SolePattern({ id, color }: { id: string; color: string }) {
  if (id === 'flat') return (
    <rect x="2" y="2" width="296" height="56" rx="28" fill={color} />
  )
  if (id === 'commando') return (
    <g fill={color}>
      <rect x="2" y="2" width="296" height="56" rx="28" />
      {[24,56,88,120,152,184,216,248].map(x => (
        <rect key={x} x={x} y="8" width="20" height="44" rx="4" fill="rgba(0,0,0,0.12)" />
      ))}
    </g>
  )
  return (
    <g fill={color}>
      <rect x="2" y="2" width="296" height="56" rx="28" />
      {[20,44,68,92,116,140,164,188,212,236,260].map((x, i) => (
        <ellipse key={x} cx={x} cy={i % 2 === 0 ? 18 : 42} rx="9" ry="6" fill="rgba(0,0,0,0.10)" />
      ))}
    </g>
  )
}

// ── 2D Shoe SVG Viewer ────────────────────────────────────────────────────────
function ShoeViewer({
  upperColor, midsoleColor, soleId,
}: { upperColor: string; midsoleColor: string; soleId: string }) {
  return (
    <svg viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      {/* Shadow */}
      <ellipse cx="180" cy="208" rx="140" ry="10" fill="rgba(0,0,0,0.08)" />

      {/* SOLE */}
      <g transform="translate(30,152)">
        <SolePattern id={soleId} color={midsoleColor} />
      </g>

      {/* MIDSOLE stripe */}
      <motion.path
        d="M32 152 Q50 148 100 146 Q180 144 270 148 Q310 150 328 154 L328 162 Q310 158 270 156 Q180 152 100 154 Q50 156 32 160 Z"
        fill={midsoleColor}
        animate={{ fill: midsoleColor }}
        transition={{ duration: 0.5 }}
      />

      {/* UPPER — main body */}
      <motion.path
        d="M60 148 Q58 120 62 90 Q66 62 90 46 Q120 28 160 24 Q200 20 230 28 Q258 36 270 54 Q282 72 280 96 Q278 120 272 148 Z"
        fill={upperColor}
        animate={{ fill: upperColor }}
        transition={{ duration: 0.5 }}
      />

      {/* UPPER — toe box */}
      <motion.path
        d="M60 148 Q40 140 32 124 Q24 108 30 96 Q36 84 56 80 Q62 90 60 148 Z"
        fill={upperColor}
        animate={{ fill: upperColor }}
        transition={{ duration: 0.5 }}
      />

      {/* Upper highlight / crease */}
      <motion.path
        d="M90 46 Q120 36 160 32 Q200 28 230 36 Q240 38 240 40 Q220 34 180 36 Q140 38 108 52 Z"
        fill="rgba(255,255,255,0.14)"
        animate={{ opacity: upperColor === '#1a1a1a' ? 0.22 : 0.14 }}
        transition={{ duration: 0.4 }}
      />

      {/* Collar */}
      <motion.path
        d="M240 28 Q260 32 274 50 Q280 62 280 76 Q262 70 240 68 Q200 66 170 68 Q150 68 138 70 Q120 70 110 64 Q120 56 140 50 Q170 42 200 36 Z"
        fill={upperColor}
        animate={{ fill: upperColor }}
        transition={{ duration: 0.5 }}
        style={{ filter: 'brightness(0.88)' }}
      />

      {/* Collar lining */}
      <motion.path
        d="M240 28 Q260 32 274 50 Q280 62 280 76 Q270 74 260 72 Q240 70 210 70 Q180 70 158 70 Q140 70 130 66 Q140 56 165 50 Q200 40 230 36 Z"
        fill="rgba(0,0,0,0.1)"
      />

      {/* Laces */}
      {[0,1,2,3,4].map(i => {
        const y = 56 + i * 16
        const x1 = 140 + i * 4
        const x2 = 220 - i * 4
        return (
          <g key={i}>
            <line x1={x1} y1={y} x2={x2} y2={y} stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx={x1} cy={y} rx="3.5" ry="3" fill="rgba(255,255,255,0.7)" />
            <ellipse cx={x2} cy={y} rx="3.5" ry="3" fill="rgba(255,255,255,0.7)" />
          </g>
        )
      })}

      {/* Outsole bottom edge */}
      <motion.path
        d="M32 160 Q50 164 180 168 Q280 164 328 160 Q330 172 316 180 Q290 192 180 196 Q80 192 44 180 Q32 174 32 160 Z"
        fill={midsoleColor}
        animate={{ fill: midsoleColor }}
        transition={{ duration: 0.5 }}
        style={{ filter: 'brightness(0.82)' }}
      />
    </svg>
  )
}

// ── Color swatch ──────────────────────────────────────────────────────────────
function Swatch({ hex, label, selected, onClick }: { hex: string; label: string; selected: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      style={{
        width: 32, height: 32, borderRadius: '50%', background: hex, border: 'none', cursor: 'pointer',
        boxShadow: selected
          ? `0 0 0 2px #0a0908, 0 0 0 4px ${hex}`
          : '0 0 0 1px rgba(0,0,0,0.12)',
        position: 'relative', transition: 'box-shadow 0.2s',
        flexShrink: 0,
      }}
      title={label}
    >
      {selected && (
        <motion.div
          layoutId={`check-${hex}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M2 5l2.5 2.5L8 3" stroke={hex === '#f5f3ef' || hex === '#f0ece6' || hex === '#d9c9ad' || hex === '#c8b89a' ? '#0a0908' : '#fff'} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  )
}

// ── Pattern pill ──────────────────────────────────────────────────────────────
function PatternPill({ id, label, desc, selected, onClick }: { id: string; label: string; desc: string; selected: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      style={{
        flex: 1, padding: '10px 8px', background: selected ? '#0a0908' : 'transparent',
        border: `1px solid ${selected ? '#0a0908' : 'rgba(10,9,8,0.12)'}`,
        borderRadius: 4, cursor: 'pointer', textAlign: 'left', transition: 'all 0.22s',
      }}
    >
      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: selected ? '#f5f3ef' : '#0a0908', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 9, color: selected ? 'rgba(245,243,239,0.5)' : 'rgba(10,9,8,0.38)', letterSpacing: '0.06em' }}>{desc}</div>
    </motion.button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function ShoeConfigurator() {
  const [upper, setUpper]     = useState<string | null>(null)
  const [midsole, setMidsole] = useState<string | null>(null)
  const [sole, setSole]       = useState<string | null>(null)
  const [added, setAdded]     = useState(false)
  const viewerRef = useRef<HTMLDivElement>(null)

  const upperHex   = UPPER_COLORS.find(c => c.id === upper)?.hex   ?? '#c8b89a'
  const midsoleHex = MIDSOLE_COLORS.find(c => c.id === midsole)?.hex ?? '#f0ece6'
  const soleId     = sole ?? 'flat'

  const complete = upper !== null && midsole !== null && sole !== null
  const progress = [upper, midsole, sole].filter(Boolean).length

  const handleAddToBag = useCallback(() => {
    if (!complete) return
    setAdded(true)
    setTimeout(() => setAdded(false), 2800)
  }, [complete])

  const handleShare = useCallback(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('upper', upper ?? '')
    url.searchParams.set('mid', midsole ?? '')
    url.searchParams.set('sole', sole ?? '')
    navigator.clipboard.writeText(url.toString()).catch(() => {})
    // Visual feedback handled by AnimatePresence below
    const btn = document.getElementById('share-btn')
    if (btn) {
      btn.textContent = 'Link copied!'
      setTimeout(() => { if (btn) btn.textContent = 'Share' }, 2000)
    }
  }, [upper, midsole, sole])

  const DARK   = '#0a0908'
  const SUBTLE = 'rgba(10,9,8,0.30)'
  const FAINT  = 'rgba(10,9,8,0.07)'
  const ease3d = [0.16, 1, 0.3, 1] as const

  return (
    <section id="configurator" style={{ background: '#faf8f5', position: 'relative', overflow: 'hidden' }}>
      <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(10,9,8,0.07) 20%, rgba(10,9,8,0.07) 80%, transparent)' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(56px,7vh,96px) clamp(28px,5vw,100px)' }}>

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ fontSize: 9, letterSpacing: '0.34em', textTransform: 'uppercase', color: SUBTLE, marginBottom: 'clamp(32px,5vh,56px)' }}
        >
          Customize Your Pair
        </motion.div>

        {/* 60/40 split */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'clamp(280px, 58%, 680px) 1fr',
          gap: 'clamp(32px,5vw,80px)',
          alignItems: 'start',
        }}>

          {/* LEFT — shoe viewer 60% */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: ease3d }}
          >
            <div
              ref={viewerRef}
              style={{
                background: 'rgba(10,9,8,0.02)', borderRadius: 12,
                border: '1px solid rgba(10,9,8,0.06)',
                aspectRatio: '16/9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '10%', position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Ambient gradient bg */}
              <motion.div
                animate={{ background: `radial-gradient(circle at 50% 60%, ${upperHex}22 0%, transparent 70%)` }}
                transition={{ duration: 0.6 }}
                style={{ position: 'absolute', inset: 0 }}
              />
              <ShoeViewer upperColor={upperHex} midsoleColor={midsoleHex} soleId={soleId} />

              {/* Progress badge */}
              <div style={{
                position: 'absolute', top: 16, right: 16,
                fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: SUBTLE, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: i < progress ? 20 : 8, height: 2,
                    background: i < progress ? DARK : 'rgba(10,9,8,0.15)',
                    borderRadius: 1, transition: 'all 0.4s',
                  }} />
                ))}
                <span style={{ opacity: 0.5 }}>{progress}/3</span>
              </div>
            </div>

            {/* Share button under viewer */}
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                id="share-btn"
                onClick={handleShare}
                style={{
                  fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: SUBTLE, background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6, padding: 0,
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Share
              </button>
            </div>
          </motion.div>

          {/* RIGHT — controls 40% */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: ease3d, delay: 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px,3vh,36px)' }}
          >

            {/* Upper color */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                <div style={{ fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase', color: SUBTLE }}>Upper Color</div>
                {upper && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 10, color: DARK, letterSpacing: '0.08em' }}>
                    {UPPER_COLORS.find(c => c.id === upper)?.label}
                  </motion.div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {UPPER_COLORS.map(c => (
                  <Swatch key={c.id} hex={c.hex} label={c.label} selected={upper === c.id} onClick={() => setUpper(c.id)} />
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: FAINT }} />

            {/* Midsole color */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                <div style={{ fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase', color: SUBTLE }}>Midsole</div>
                {midsole && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 10, color: DARK, letterSpacing: '0.08em' }}>
                    {MIDSOLE_COLORS.find(c => c.id === midsole)?.label}
                  </motion.div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {MIDSOLE_COLORS.map(c => (
                  <Swatch key={c.id} hex={c.hex} label={c.label} selected={midsole === c.id} onClick={() => setMidsole(c.id)} />
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: FAINT }} />

            {/* Sole pattern */}
            <div>
              <div style={{ fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase', color: SUBTLE, marginBottom: 14 }}>Sole Pattern</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {SOLE_PATTERNS.map(p => (
                  <PatternPill key={p.id} id={p.id} label={p.label} desc={p.desc} selected={sole === p.id} onClick={() => setSole(p.id)} />
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: FAINT }} />

            {/* Gamification hint */}
            <AnimatePresence mode="wait">
              {!complete ? (
                <motion.div
                  key="hint"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4 }}
                  style={{ fontSize: 10, color: SUBTLE, letterSpacing: '0.08em', lineHeight: 1.7 }}
                >
                  {progress === 0 && 'Select upper color, midsole, and sole to unlock your pair.'}
                  {progress === 1 && 'Two more selections to complete your build.'}
                  {progress === 2 && 'One more — choose your sole pattern.'}
                </motion.div>
              ) : (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4 }}
                  style={{ fontSize: 10, color: 'rgba(50,120,50,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                >
                  ✓ Build complete
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add to Bag */}
            <motion.button
              onClick={handleAddToBag}
              disabled={!complete}
              whileHover={complete ? { scale: 1.02 } : {}}
              whileTap={complete ? { scale: 0.98 } : {}}
              animate={complete ? { opacity: 1 } : { opacity: 0.35 }}
              transition={{ duration: 0.35 }}
              style={{
                width: '100%', padding: '16px 0',
                background: added ? '#2d6a2d' : DARK,
                color: added ? '#d4f4d4' : '#f5f3ef',
                border: 'none', cursor: complete ? 'pointer' : 'not-allowed',
                fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase',
                transition: 'background 0.4s, color 0.4s',
                borderRadius: 2,
              }}
            >
              {added ? '✓ Added to Bag' : 'Add to Bag'}
            </motion.button>

            {/* SKU preview */}
            {complete && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                style={{ fontSize: 9, color: 'rgba(10,9,8,0.25)', letterSpacing: '0.14em', textAlign: 'center' }}
              >
                SKU: {[upper, midsole, sole].map(s => s?.toUpperCase().slice(0,3)).join('-')}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
