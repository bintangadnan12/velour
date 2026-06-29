'use client'
import { useState, useCallback } from 'react'
import { Preloader } from '@/components/Preloader'
import { Nav } from '@/components/Nav'
import { VideoScrubber } from '@/components/VideoScrubber'
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
        <VideoScrubber onLoad={handleLoad} onReady={handleReady} />
      </main>
      <Footer />
    </>
  )
}
