'use client'

import { useState } from 'react'

const faqItems = [
    {
        question: 'What types of systems do you build?',
        answer: 'Mobile applications (iOS & Android via Flutter), high-performance web applications (Next.js/React), SaaS platforms, Telegram/Discord bots, REST/GraphQL API layers, and admin dashboards. Full-stack execution from logic to deployment.',
    },
    {
        question: 'Why hire an independent architect over an agency?',
        answer: 'Zero overhead. No PMs, no communication lag, no office costs. You get direct access to a senior engineer who builds the architecture and writes the code. Faster execution, higher quality, transparent costs.',
    },
    {
        question: 'How is the development process structured?',
        answer: '1. Discovery & Architecture (defining the schema and stack). 2. Build Phase (rapid sprints with daily staging deployments). 3. Launch & Telemetry (production deployment with monitoring). You see the code running every single day.',
    },
    {
        question: 'What happens post-launch?',
        answer: 'Systems require maintenance. I provide a warranty period for bug fixes. For ongoing feature development or scaling, we establish a structured retainer or milestone-based agreement.',
    },
    {
        question: 'How are resources (payments) allocated?',
        answer: 'Standard protocol: 50% upfront to initiate architecture, 50% upon final production deployment. For large-scale systems, we divide into strict milestone-based tranches.',
    },
    {
        question: 'What is your core technology stack?',
        answer: 'Frontend: React, Next.js, Tailwind CSS, GSAP. Mobile: Flutter. Backend: Node.js, Python. Database: PostgreSQL, Supabase, Prisma. Infrastructure: Vercel, AWS, custom VPS deployments.',
    },
]

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <section className="py-32 relative z-10 border-t border-[var(--border-color)]">
            <div className="mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">
                    Query <span className="font-[var(--font-dm-serif)] italic text-[var(--accent-primary)]">Database.</span>
                </h2>
                <p className="text-[var(--text-secondary)] font-mono uppercase tracking-widest text-sm">
                    {'//'} Frequently Asked Questions.
                </p>
            </div>

            <div className="max-w-4xl mx-auto flex flex-col gap-4">
                {faqItems.map((item, i) => (
                    <div
                        key={i}
                        className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden transition-colors hover:border-[var(--accent-primary)]/50"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="w-full flex items-center justify-between p-6 text-left"
                        >
                            <div className="flex items-center gap-6">
                                <span className="font-mono text-[var(--accent-primary)] text-sm tracking-widest hidden sm:inline-block">
                                    [Q_{(i + 1).toString().padStart(2, '0')}]
                                </span>
                                <span className="font-bold text-lg md:text-xl text-[var(--text-primary)] tracking-tight">
                                    {item.question}
                                </span>
                            </div>
                            <span className="font-mono text-[var(--text-secondary)] text-xl transition-transform duration-300 ml-4" style={{ transform: openIndex === i ? 'rotate(45deg)' : 'none' }}>
                                +
                            </span>
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out border-t-[var(--border-color)] ${openIndex === i ? 'max-h-96 border-t opacity-100' : 'max-h-0 opacity-0 border-t-0'}`}
                        >
                            <p className="p-6 pt-4 text-[var(--text-secondary)] font-mono text-sm md:text-base leading-relaxed">
                                {'>'} {item.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
