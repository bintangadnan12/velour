'use client'
import { useState, useCallback } from 'react'
import { Preloader } from '@/components/Preloader'
import { Nav } from '@/components/Nav'
import { HeroCanvas } from '@/components/HeroCanvas'
import { Marquee } from '@/components/Marquee'
import { BrandIntro } from '@/components/BrandIntro'
import { Features } from '@/components/Features'
import { TheEdit } from '@/components/TheEdit'
import { BrandStory } from '@/components/BrandStory'
import { Testimonials } from '@/components/Testimonials'
import { Newsletter } from '@/components/Newsletter'
import { Footer } from '@/components/Footer'

export default function Home() {
  const [progress, setProgress] = useState(0)

  const handleLoad = useCallback((pct: number) => setProgress(pct), [])
  const handleReady = useCallback(() => {
    setProgress(100)
  }, [])

  return (
    <>
      <Preloader progress={progress} onComplete={() => {}} />
      <Nav />
      <main>
        <HeroCanvas onLoad={handleLoad} onReady={handleReady} />
        <Marquee />
        <BrandIntro />
        <Features />
        <TheEdit />
        <BrandStory />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
