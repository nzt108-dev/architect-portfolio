'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MessageSquare, Code, Rocket } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Tell Me Your Idea',
    description: 'Describe what you need. I\'ll reply within 24 hours with a clear estimate, timeline, and tech approach.',
  },
  {
    number: '02',
    icon: Code,
    title: 'Build & Iterate',
    description: 'I build fast with daily updates. You see progress in real-time and give feedback at every stage.',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Launch & Support',
    description: 'Production deployment, analytics setup, and post-launch support included. Your product goes live.',
  },
]

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const cards = sectionRef.current?.querySelectorAll('.step-card')
    const line = sectionRef.current?.querySelector('.step-line')

    if (cards) gsap.set(cards, { y: 40, opacity: 0 })
    if (line) gsap.set(line, { scaleX: 0 })

    const ctx = gsap.context(() => {
      if (cards) {
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
        })
      }

      if (line) {
        gsap.to(line, {
          scaleX: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        })
      }
    }, sectionRef)

    const safety = setTimeout(() => {
      if (cards) gsap.to(cards, { opacity: 1, y: 0, duration: 0.3 })
      if (line) gsap.to(line, { scaleX: 1, duration: 0.3 })
    }, 1500)

    return () => {
      clearTimeout(safety)
      ctx.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-20 md:py-28 px-5 lg:px-12 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="section-title text-3xl md:text-5xl">
            How It Works
          </h2>
          <p className="section-subtitle mx-auto">
            A simple 3-step process. From your idea to a shipped product.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Connecting line (desktop only) */}
          <div className="step-line hidden md:block absolute top-[3.25rem] left-[16%] right-[16%] h-[1px] bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-primary)]/30 to-[var(--accent-primary)] origin-left" />

          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="step-card flex flex-col items-center text-center">
                {/* Number circle */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center relative z-10">
                    <Icon size={24} className="text-[var(--accent-primary)]" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--accent-primary)] text-white text-[11px] font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
