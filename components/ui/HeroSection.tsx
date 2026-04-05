'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowRight, MessageCircle, CheckCircle2, Clock, Shield, DollarSign } from 'lucide-react'
import { trackFBEvent } from '@/components/analytics/AnalyticsTracker'

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered entrance animation
      gsap.from('.hero-el', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.3,
      })

      // Floating gradient blobs
      gsap.to('.hero-blob-1', {
        x: 30,
        y: -20,
        duration: 8,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
      gsap.to('.hero-blob-2', {
        x: -20,
        y: 30,
        duration: 10,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const scrollToEstimate = () => {
    trackFBEvent('InitiateCheckout', { content_name: 'Hero CTA' })
    const el = document.getElementById('cta-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] w-full flex items-center justify-center px-5 lg:px-12 overflow-hidden"
    >
      {/* Background blobs */}
      <div className="hero-blob-1 absolute top-[-15%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-[#7B61FF] opacity-[0.05] blur-[180px] pointer-events-none" />
      <div className="hero-blob-2 absolute bottom-[-20%] left-[-15%] w-[35rem] h-[35rem] rounded-full bg-[#C9A84C] opacity-[0.04] blur-[150px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="grid-bg absolute inset-0 pointer-events-none opacity-50" />

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center py-32">
        {/* Badge */}
        <div className="hero-el mb-8">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-[var(--accent-light)] text-[var(--accent-primary)] text-sm font-medium rounded-full border border-[var(--border-color)]">
            <span className="w-2 h-2 bg-[var(--accent-green)] rounded-full animate-pulse" />
            Available for new projects
          </span>
        </div>

        {/* Headline — Bold + Contrast */}
        <h1 className="hero-el text-[2.5rem] md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
          I build apps{' '}
          <br className="hidden md:block" />
          <span className="gradient-text">that make money.</span>
        </h1>

        {/* Subheadline */}
        <p className="hero-el text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
          Mobile apps, websites, Telegram bots &amp; SaaS platforms — from first idea to production launch. Fixed pricing, fast delivery.
        </p>

        {/* CTA Buttons */}
        <div className="hero-el flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <button
            onClick={scrollToEstimate}
            className="btn-primary px-8 py-4 text-base rounded-2xl w-full sm:w-auto"
          >
            Get a Free Estimate
            <ArrowRight size={18} />
          </button>
          <a
            href="https://t.me/nzt108_dev"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackFBEvent('Contact', { content_name: 'Telegram Hero' })}
            className="btn-secondary px-8 py-4 text-base rounded-2xl w-full sm:w-auto"
          >
            <MessageCircle size={18} />
            Chat on Telegram
          </a>
        </div>

        {/* Trust Markers */}
        <div className="hero-el flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {[
            { icon: CheckCircle2, text: '10+ projects shipped' },
            { icon: Clock, text: 'Reply within 24h' },
            { icon: Shield, text: 'Post-launch support' },
            { icon: DollarSign, text: 'From $300' },
          ].map((item) => (
            <span
              key={item.text}
              className="flex items-center gap-2 text-sm text-[var(--text-muted)]"
            >
              <item.icon size={14} className="text-[var(--accent-primary)]" />
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
