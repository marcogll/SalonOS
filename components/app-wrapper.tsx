'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { LoadingScreen } from '@/components/loading-screen'
import { useScrollEffect } from '@/hooks/use-scroll-effect'

interface AppWrapperProps {
  children: React.ReactNode
}

/** @description Client component wrapper that handles loading screen and scroll effects */
export function AppWrapper({ children }: AppWrapperProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
  const pathname = usePathname()
  const isScrolled = useScrollEffect()

  useEffect(() => {
    // Only show loading screen on first visit to home page
    if (pathname === '/' && !hasLoadedOnce) {
      setIsLoading(true)
      setHasLoadedOnce(true)
    }
  }, [pathname, hasLoadedOnce])

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    // Apply scroll class to header
    const header = document.querySelector('.site-header')
    if (header) {
      if (isScrolled) {
        header.classList.add('scrolled')
      } else {
        header.classList.remove('scrolled')
      }
    }
  }, [isScrolled])

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease' }}>
        {children}
      </div>
    </>
  )
}