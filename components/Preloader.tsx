'use client'
import { useEffect, useRef, useState } from 'react'

interface PreloaderProps {
  onComplete: () => void
  progress: number
}

export function Preloader({ onComplete, progress }: PreloaderProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => {
        setVisible(false)
        setTimeout(onComplete, 900)
      }, 400)
      return () => clearTimeout(t)
    }
  }, [progress, onComplete])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-1000"
      style={{
        background: 'var(--black)',
        opacity: progress >= 100 ? 0 : 1,
        pointerEvents: progress >= 100 ? 'none' : 'all',
      }}
    >
      <div
        className="font-serif text-[clamp(36px,5vw,60px)] font-extralight tracking-[0.3em] uppercase"
        style={{ color: 'var(--white)', animation: 'fadeUp 0.9s var(--ease) 0.3s both' }}
      >
        LUN<em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>ARE</em>
      </div>
      <div
        className="w-[200px] h-px mt-8 overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.08)', animation: 'fadeUp 0.6s var(--ease) 0.7s both' }}
      >
        <div
          className="h-full transition-all duration-75 linear"
          style={{ width: `${progress}%`, background: 'var(--gold)' }}
        />
      </div>
      <div
        className="text-[10px] tracking-[0.3em] mt-2.5"
        style={{ color: 'var(--muted)', animation: 'fadeUp 0.6s var(--ease) 0.7s both' }}
      >
        {progress}%
      </div>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
