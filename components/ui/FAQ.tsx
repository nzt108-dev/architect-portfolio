'use client'

import { useState } from 'react'

const faqItems = [
    {
        question: 'What types of projects do you build?',
        answer: 'I build mobile apps (iOS & Android via Flutter), web applications, SaaS platforms, Telegram and Discord bots, REST/GraphQL APIs, and admin dashboards. From simple landing pages to complex multi-service platforms.',
    },
    {
        question: 'How are you faster and cheaper than an agency?',
        answer: 'I work solo with AI-powered tools that multiply my output. No project managers, no office costs, no team coordination overhead. You get one experienced architect who handles everything — from design to deployment. The savings go directly to you.',
    },
    {
        question: 'What does the process look like?',
        answer: 'We start with a free consultation to understand your needs. Within 24 hours, you get a detailed estimate with timeline and cost. Once approved, I start building with daily progress updates. You see working demos throughout, not just at the end.',
    },
    {
        question: 'What if I need changes after launch?',
        answer: 'Post-launch support is included. Bug fixes and minor adjustments are covered. For larger feature additions, we discuss scope and timeline — same transparent process as the initial build.',
    },
    {
        question: 'How do you handle payments?',
        answer: 'Typically a 30-50% upfront deposit with the remainder upon completion. For larger projects, we can set up milestone-based payments so you pay as features are delivered. I\'m flexible and open to discussion.',
    },
    {
        question: 'Can I see progress during development?',
        answer: 'Absolutely. You get daily updates with screenshots or short videos, plus access to a staging environment where you can test the latest version anytime. Full transparency is a core value.',
    },
    {
        question: 'What technologies do you use?',
        answer: 'Flutter for mobile, Next.js and React for web, Python/Node.js for backends, PostgreSQL/Supabase for databases, and cloud platforms like Vercel, Railway, and AWS for hosting. I pick the best tools for each project.',
    },
    {
        question: 'Do you work with international clients?',
        answer: 'Yes! I work with clients worldwide. Communication is primarily in English and Russian. I\'m timezone-flexible and available for async communication plus scheduled video calls.',
    },
]

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <section className="py-20">
            <div className="text-center mb-14">
                <h2 className="section-title gradient-text">FAQ</h2>
                <p className="section-subtitle mx-auto">
                    Common questions about working together.
                </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
                {faqItems.map((item, i) => (
                    <div
                        key={i}
                        className="cyber-card overflow-hidden"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--bg-card-hover)] transition-colors"
                        >
                            <span className="font-medium text-[var(--text-primary)] pr-4">{item.question}</span>
                            <svg
                                className={`w-5 h-5 text-[var(--accent-primary)] flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <p className="px-5 pb-5 text-[var(--text-secondary)] text-sm leading-relaxed">
                                {item.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
