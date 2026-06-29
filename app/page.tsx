'use client'
import { useState, useCallback } from 'react'
import { Preloader } from '@/components/Preloader'
import { Nav } from '@/components/Nav'
import { HeroCanvas } from '@/components/HeroCanvas'
import { Manifesto } from '@/components/Manifesto'
import { ProductReel } from '@/components/ProductReel'
import { BrandStory } from '@/components/BrandStory'
import { Testimonials } from '@/components/Testimonials'
import { Newsletter } from '@/components/Newsletter'
import { Footer } from '@/components/Footer'

export default function Home() {
  const [progress, setProgress] = useState(0)

  const handleLoad = useCallback((pct: number) => setProgress(pct), [])
  const handleReady = useCallback(() => setProgress(100), [])

  return (
    <>
      <Preloader progress={progress} onComplete={() => {}} />
      <Nav />
      <main>
        {/* 01 — Cinematic video scrubber */}
        <HeroCanvas onLoad={handleLoad} onReady={handleReady} />

        {/* 02 — Brand manifesto, line-by-line Framer Motion reveal */}
        <Manifesto />

        {/* 03 — Scroll-driven product reel, full-screen per product */}
        <ProductReel />

        {/* 04 — Origin story */}
        <BrandStory />

        {/* 05 — Social proof */}
        <Testimonials />

        {/* 06 — Newsletter, quiet */}
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
