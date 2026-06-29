'use client'
import { useEffect, useRef } from 'react'

export function Cursor() {
  const curRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cur = curRef.current!
    const ring = ringRef.current!
    let mx = 0, my = 0, rx = 0, ry = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      cur.style.left = mx + 'px'
      cur.style.top = my + 'px'
    }

    let rafId: number
    const loop = () => {
      rx += (mx - rx) * 0.1
      ry += (my - ry) * 0.1
      ring.style.left = rx + 'px'
      ring.style.top = ry + 'px'
      rafId = requestAnimationFrame(loop)
    }
    loop()

    const addBig = () => ring.classList.add('big')
    const removeBig = () => ring.classList.remove('big')

    document.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', addBig)
      el.addEventListener('mouseleave', removeBig)
    })

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <>
      <div ref={curRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
