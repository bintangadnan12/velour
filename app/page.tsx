'use client'
import { useState, useCallback } from 'react'
import { Preloader } from '@/components/Preloader'
import { Nav } from '@/components/Nav'
import { VideoScrubber } from '@/components/VideoScrubber'
import { ProductShowcase } from '@/components/ProductShowcase'
import { ShoeConfigurator } from '@/components/ShoeConfigurator'
import { AboutSection } from '@/components/AboutSection'
import { Footer } from '@/components/Footer'

export default function Home() {
  const [progress, setProgress] = useState(0)
  const handleLoad  = useCallback((pct: number) => setProgress(pct), [])
  const handleReady = useCallback(() => setProgress(100), [])

  return (
    <>
      <Preloader progress={progress} onComplete={() => {}} />
      <Nav />
      <main>
        {/* 01 — Cinematic scroll-driven video (2500vh, 5 freeze scenes) */}
        <VideoScrubber onLoad={handleLoad} onReady={handleReady} />

        {/* 02 — Product showcase, 3D stacked reveal */}
        <ProductShowcase />

        {/* 03 — Shoe configurator */}
        <ShoeConfigurator />

        {/* 04 — Brand story */}
        <AboutSection />
      </main>
      <Footer />
    </>
  )
}
