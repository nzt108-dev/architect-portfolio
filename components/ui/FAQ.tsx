'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqItems = [
  {
    question: 'What types of projects do you build?',
    answer: 'Mobile applications (iOS & Android via Flutter), web applications (Next.js/React), SaaS platforms, Telegram/Discord bots, REST/GraphQL APIs, and admin dashboards. Full-stack from design to deployment.',
  },
  {
    question: 'Why hire an independent developer over an agency?',
    answer: 'Zero overhead. No project managers, no communication lag, no office costs. You work directly with the engineer who builds your product. Faster execution, higher quality, transparent costs.',
  },
  {
    question: 'How does the development process work?',
    answer: 'Three phases: 1) Tell me your idea — I reply within 24h with estimate and tech plan. 2) Build & Iterate — rapid development with daily staging updates. 3) Launch & Support — production deployment with monitoring.',
  },
  {
    question: 'What happens after launch?',
    answer: 'Every project includes a warranty period for bug fixes. For ongoing feature development or scaling, we can set up a retainer or milestone-based agreement.',
  },
  {
    question: 'How do payments work?',
    answer: '50% upfront to start, 50% on delivery. For larger projects, we break it into milestone-based payments so you only pay for completed work.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 md:py-28 px-5 lg:px-12 relative z-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="section-title text-3xl md:text-5xl">
            FAQ
          </h2>
          <p className="section-subtitle mx-auto">
            Everything you need to know before we start.
          </p>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden transition-all duration-200 hover:border-[var(--border-hover)]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-[var(--text-primary)] pr-4 text-[15px]">
                  {item.question}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-[var(--text-muted)] transition-transform duration-200 flex-shrink-0 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="px-5 pb-5 text-[var(--text-secondary)] text-sm leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
