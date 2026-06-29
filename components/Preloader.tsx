'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreloaderProps {
  onComplete: () => void
  progress: number
}

const LETTERS = ['F', 'O', 'R', 'M', 'A']
const ease3d = [0.16, 1, 0.3, 1] as const

export function Preloader({ onComplete, progress }: PreloaderProps) {
  const [exiting, setExiting] = useState(false)
  const [visible, setVisible]  = useState(true)

  // Hard fallback: always exit after 8s regardless of progress
  useEffect(() => {
    const fallback = setTimeout(() => {
      if (!exiting) {
        setExiting(true)
        setTimeout(() => { setVisible(false); onComplete() }, 1100)
      }
    }, 8000)
    return () => clearTimeout(fallback)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (progress >= 100 && !exiting) {
      const t1 = setTimeout(() => setExiting(true), 500)
      const t2 = setTimeout(() => {
        setVisible(false)
        onComplete()
      }, 1600)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [progress, exiting, onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'var(--black)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 0,
          }}
        >
          {/* Animated FORMA letters */}
          <div style={{ display: 'flex', gap: 'clamp(6px,1.2vw,14px)', overflow: 'hidden', marginBottom: 32 }}>
            {LETTERS.map((letter, i) => (
              <div key={letter} style={{ overflow: 'hidden' }}>
                <motion.span
                  initial={{ y: '110%', opacity: 0 }}
                  animate={exiting
                    ? { y: '-110%', opacity: 0 }
                    : { y: 0, opacity: 1 }
                  }
                  transition={
                    exiting
                      ? { duration: 0.6, ease: ease3d, delay: i * 0.06 }
                      : { duration: 1.1, ease: ease3d, delay: 0.2 + i * 0.08 }
                  }
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(40px,6vw,80px)',
                    fontWeight: 200,
                    letterSpacing: '0.24em',
                    color: 'var(--white)',
                    lineHeight: 1,
                  }}
                >
                  {letter}
                </motion.span>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: exiting ? 0 : 1 }}
            transition={{ duration: 0.8, delay: exiting ? 0 : 0.9 }}
            style={{
              fontSize: 9,
              letterSpacing: '0.36em',
              textTransform: 'uppercase',
              color: 'rgba(248,246,242,0.25)',
              marginBottom: 40,
            }}
          >
            Walk with intent.
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: exiting ? 0 : 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ width: 180, height: 1, background: 'rgba(248,246,242,0.08)', position: 'relative', transformOrigin: 'left' }}
          >
            <motion.div
              style={{
                position: 'absolute', top: 0, left: 0, height: '100%',
                background: 'rgba(248,246,242,0.5)',
                width: `${progress}%`,
                transition: 'width 0.08s linear',
              }}
            />
          </motion.div>

          {/* Progress number */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: exiting ? 0 : 0.4 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{
              marginTop: 10, fontSize: 10,
              letterSpacing: '0.22em',
              color: 'var(--white)',
              fontFamily: 'var(--font-serif)',
            }}
          >
            {String(progress).padStart(3, ' ')}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
