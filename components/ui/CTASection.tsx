'use client'

import React from 'react'
import { CheckCircle } from 'lucide-react'
import LeadCaptureWidget from './LeadCaptureWidget'

export default function CTASection() {
  return (
    <section
      id="cta-section"
      className="py-20 md:py-28 px-5 lg:px-12 relative z-10"
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-primary)] opacity-[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--gold)] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight leading-[1.1]">
              Ready to build{' '}
              <span className="gradient-text">something great?</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-8 leading-relaxed">
              Get a free project estimate within 24 hours. No commitment, no hidden fees.
            </p>
            <ul className="space-y-3">
              {[
                'Free project estimate',
                'No commitment required',
                'Response within 24 hours',
                'Post-launch support included',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[var(--text-secondary)]">
                  <CheckCircle size={18} className="text-[var(--accent-green)] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Form */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-xl overflow-hidden gradient-border">
            <LeadCaptureWidget />
          </div>
        </div>
      </div>
    </section>
  )
}
