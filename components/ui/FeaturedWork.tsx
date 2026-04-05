'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ExternalLink } from 'lucide-react'

const featuredProjects = [
  {
    title: 'BriefTube AI',
    category: 'Mobile App',
    description: 'AI-powered YouTube video summaries with comment analysis.',
    tech: ['Flutter', 'FastAPI', 'Gemini AI'],
    color: '#7B61FF',
  },
  {
    title: 'NorCal Deal Engine',
    category: 'Mobile App',
    description: 'Real estate discovery with AI deal scoring and 18+ filters.',
    tech: ['Flutter', 'Python', 'Supabase'],
    color: '#34D399',
  },
  {
    title: 'Drip Campaign Bot',
    category: 'Telegram Bot',
    description: 'Automated drip messaging SaaS for Telegram channels.',
    tech: ['Python', 'PostgreSQL', 'Redis'],
    color: '#FBBF24',
  },
  {
    title: 'Auth Microservice',
    category: 'Backend',
    description: 'High-performance auth service with OAuth2, JWT & multi-tenancy.',
    tech: ['Go', 'gRPC', 'Kubernetes'],
    color: '#C9A84C',
  },
]

export default function FeaturedWork() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const cards = sectionRef.current?.querySelectorAll('.work-card')
    if (cards) gsap.set(cards, { y: 40, opacity: 0 })

    const ctx = gsap.context(() => {
      if (cards) {
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
        })
      }
    }, sectionRef)

    const safety = setTimeout(() => {
      if (cards) gsap.to(cards, { opacity: 1, y: 0, duration: 0.3 })
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
            Recent Work
          </h2>
          <p className="section-subtitle mx-auto">
            Real projects built for real users. Not demos — products.
          </p>
        </div>

        {/* Mobile: horizontal scroll / Desktop: grid */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 overflow-x-auto no-scrollbar pb-4 md:pb-0 snap-x snap-mandatory md:snap-none">
          {featuredProjects.map((project) => (
            <div
              key={project.title}
              className="work-card flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-auto snap-start bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col group hover:border-[var(--border-hover)] transition-all duration-300 hover:-translate-y-1"
            >
              {/* Category badge */}
              <div className="mb-4">
                <span
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{
                    background: `${project.color}15`,
                    color: project.color,
                  }}
                >
                  {project.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                {project.title}
                <ExternalLink size={14} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>

              {/* Description */}
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 flex-1">
                {project.description}
              </p>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-[var(--text-muted)] font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
