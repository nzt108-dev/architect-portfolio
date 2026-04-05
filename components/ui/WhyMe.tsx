'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check, X, Minus } from 'lucide-react'

const rows = [
  {
    feature: 'Pricing',
    me: 'Fixed & transparent',
    meIcon: 'check',
    agency: 'High markup',
    agencyIcon: 'x',
    freelance: 'Variable / hidden',
    freelanceIcon: 'minus',
  },
  {
    feature: 'Delivery',
    me: 'Days to weeks',
    meIcon: 'check',
    agency: 'Weeks to months',
    agencyIcon: 'minus',
    freelance: 'Unpredictable',
    freelanceIcon: 'x',
  },
  {
    feature: 'Communication',
    me: 'Direct to engineer',
    meIcon: 'check',
    agency: 'Filtered via PM',
    agencyIcon: 'minus',
    freelance: 'Async / delayed',
    freelanceIcon: 'x',
  },
  {
    feature: 'Code Quality',
    me: 'Scalable architecture',
    meIcon: 'check',
    agency: 'Scope dependent',
    agencyIcon: 'minus',
    freelance: 'Often fragile',
    freelanceIcon: 'x',
  },
  {
    feature: 'Support',
    me: 'Included',
    meIcon: 'check',
    agency: 'Expensive retainer',
    agencyIcon: 'x',
    freelance: 'No guarantee',
    freelanceIcon: 'x',
  },
]

function StatusIcon({ type }: { type: string }) {
  if (type === 'check') return <Check size={15} className="text-[var(--accent-green)]" />
  if (type === 'x') return <X size={15} className="text-[var(--accent-red)]/60" />
  return <Minus size={15} className="text-[var(--accent-amber)]/60" />
}

export default function WhyMe() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const table = sectionRef.current?.querySelector('.why-table')
    if (table) gsap.set(table, { y: 40, opacity: 0 })

    const ctx = gsap.context(() => {
      if (table) {
        gsap.to(table, {
          y: 0,
          opacity: 1,
          duration: 0.8,
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
      if (table) gsap.to(table, { opacity: 1, y: 0, duration: 0.3 })
    }, 1500)

    return () => {
      clearTimeout(safety)
      ctx.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-20 md:py-28 px-5 lg:px-12 relative z-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="section-title text-3xl md:text-5xl">
            Why Work With Me
          </h2>
          <p className="section-subtitle mx-auto">
            Direct access to a senior engineer. No middlemen, no surprises.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="why-table bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[600px] text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="p-4 md:p-5 text-sm text-[var(--text-muted)] font-medium w-1/4" />
                  <th className="p-4 md:p-5 text-sm font-semibold text-[var(--accent-primary)] bg-[var(--accent-light)] border-x border-[var(--border-color)]">
                    nzt108.dev
                  </th>
                  <th className="p-4 md:p-5 text-sm text-[var(--text-muted)] font-medium w-1/4">
                    Agency
                  </th>
                  <th className="p-4 md:p-5 text-sm text-[var(--text-muted)] font-medium w-1/4">
                    Freelancer
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {rows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`transition-colors hover:bg-white/[0.02] ${
                      i < rows.length - 1 ? 'border-b border-[var(--border-color)]' : ''
                    }`}
                  >
                    <td className="p-4 md:p-5 text-[var(--text-secondary)] font-medium">
                      {row.feature}
                    </td>
                    <td className="p-4 md:p-5 border-x border-[var(--border-color)] bg-[var(--accent-light)]">
                      <div className="flex items-center gap-2">
                        <StatusIcon type={row.meIcon} />
                        <span className="text-[var(--text-primary)]">{row.me}</span>
                      </div>
                    </td>
                    <td className="p-4 md:p-5 text-[var(--text-muted)]">
                      <div className="flex items-center gap-2">
                        <StatusIcon type={row.agencyIcon} />
                        <span>{row.agency}</span>
                      </div>
                    </td>
                    <td className="p-4 md:p-5 text-[var(--text-muted)]">
                      <div className="flex items-center gap-2">
                        <StatusIcon type={row.freelanceIcon} />
                        <span>{row.freelance}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
