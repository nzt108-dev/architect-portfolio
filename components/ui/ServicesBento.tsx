'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Smartphone, Globe, Bot, Layers, ArrowRight } from 'lucide-react'

const services = [
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    price: 'from $3,000',
    time: '~3 weeks',
    description: 'Cross-platform iOS & Android apps with native performance.',
    features: ['iOS & Android', 'Flutter / React Native', 'App Store deployment'],
    accent: '#7B61FF',
  },
  {
    icon: Globe,
    title: 'Websites & Landings',
    price: 'from $300',
    time: '~3–7 days',
    description: 'Fast, responsive sites optimized for conversions and SEO.',
    features: ['Responsive design', 'SEO optimized', 'Fast loading'],
    accent: '#34D399',
  },
  {
    icon: Bot,
    title: 'Bots & Automation',
    price: 'from $500',
    time: '~1 week',
    description: 'Custom Telegram & Discord bots for business automation.',
    features: ['Telegram / Discord', 'Data scraping', 'API integration'],
    accent: '#FBBF24',
  },
  {
    icon: Layers,
    title: 'SaaS Platforms',
    price: 'from $3,000',
    time: '~1 month',
    description: 'Full-stack SaaS with auth, payments, and admin dashboards.',
    features: ['Full-stack', 'Auth & payments', 'Admin dashboard'],
    accent: '#C9A84C',
  },
]

export default function ServicesBento() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const items = sectionRef.current?.querySelectorAll('.bento-item')
    if (!items || items.length === 0) return

    // Set initial state
    gsap.set(items, { y: 40, opacity: 0 })

    const ctx = gsap.context(() => {
      gsap.to(items, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          once: true,
        },
      })
    }, sectionRef)

    // Safety: ensure items are visible even if ScrollTrigger doesn't fire
    const safety = setTimeout(() => {
      gsap.to(items, { opacity: 1, y: 0, duration: 0.3 })
    }, 1500)

    return () => {
      clearTimeout(safety)
      ctx.revert()
    }
  }, [])

  const scrollToEstimate = () => {
    const el = document.getElementById('cta-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section ref={sectionRef} className="py-20 md:py-28 px-5 lg:px-12 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="section-title text-3xl md:text-5xl">
            What I Build
          </h2>
          <p className="section-subtitle mx-auto">
            Fixed prices. No hidden fees. Every project starts with a free consultation.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.title}
                className="bento-item bento-card group cursor-pointer"
                onClick={scrollToEstimate}
              >
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${service.accent}15` }}
                >
                  <Icon size={22} style={{ color: service.accent }} />
                </div>

                {/* Title & Price */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">
                    {service.title}
                  </h3>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-lg font-bold text-[var(--text-primary)]">
                      {service.price}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">{service.time}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="flex flex-col gap-1.5 mb-5">
                  {service.features.map((f) => (
                    <li
                      key={f}
                      className="text-sm text-[var(--text-muted)] flex items-center gap-2"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: service.accent }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="flex items-center gap-1 text-sm font-medium text-[var(--accent-primary)] group-hover:gap-2 transition-all">
                  Get Estimate <ArrowRight size={14} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
