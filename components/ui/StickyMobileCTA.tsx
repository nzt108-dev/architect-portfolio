'use client'

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'

export default function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(false)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Show after scrolling past hero
    const showTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: '600px top',
      onEnter: () => setIsVisible(true),
      onLeaveBack: () => setIsVisible(false),
    })

    // Hide when near CTA section (avoid overlap)
    const hideTrigger = ScrollTrigger.create({
      trigger: '#cta-section',
      start: 'top 90%',
      onEnter: () => setIsAtBottom(true),
      onLeaveBack: () => setIsAtBottom(false),
    })

    return () => {
      showTrigger.kill()
      hideTrigger.kill()
    }
  }, [])

  const scrollToEstimate = () => {
    const el = document.getElementById('cta-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  if (!isVisible || isAtBottom) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden p-4 pb-[calc(env(safe-area-inset-bottom,0px)+16px)]">
      <button
        onClick={scrollToEstimate}
        className="btn-primary w-full py-4 rounded-2xl text-base shadow-lg animate-pulse-glow"
        style={{ animationDuration: '4s' }}
      >
        Get a Free Estimate
        <ArrowRight size={18} />
      </button>
    </div>
  )
}
