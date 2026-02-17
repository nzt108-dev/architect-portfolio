'use client'

import GradientIcon from './GradientIcon'

const steps = [
    {
        number: '01',
        title: 'Discuss',
        subtitle: 'Free consultation',
        description: 'Tell me about your idea. We\'ll figure out the best approach together.',
        iconName: 'phone',
    },
    {
        number: '02',
        title: 'Estimate',
        subtitle: 'Within 24 hours',
        description: 'Get a detailed plan with timeline, tech stack, and transparent pricing.',
        iconName: 'clipboard-list',
    },
    {
        number: '03',
        title: 'Build',
        subtitle: 'Daily progress updates',
        description: 'I build your product with regular demos so you see results every step.',
        iconName: 'code',
    },
    {
        number: '04',
        title: 'Launch',
        subtitle: 'Deploy + support',
        description: 'Your product goes live. I provide post-launch support to ensure everything runs smoothly.',
        iconName: 'rocket',
    },
]

export default function ProcessSteps() {
    return (
        <section className="py-20">
            <div className="text-center mb-14">
                <h2 className="section-title gradient-text">How It Works</h2>
                <p className="section-subtitle mx-auto">
                    From first call to launch — a simple, transparent process.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {steps.map((step, i) => (
                    <div key={step.number} className="relative">
                        {/* Connector line */}
                        {i < steps.length - 1 && (
                            <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-[var(--accent-primary)]/30 to-[var(--accent-primary)]/10" />
                        )}

                        <div className="cyber-card p-6 text-center relative">
                            {/* Step number */}
                            <div className="text-xs font-mono text-[var(--accent-primary)] mb-3 tracking-widest">
                                STEP {step.number}
                            </div>

                            {/* Icon */}
                            <div className="w-16 h-16 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center mx-auto mb-4">
                                <GradientIcon name={step.iconName} size={30} />
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                            <p className="text-[var(--accent-primary)] text-sm font-medium mb-2">
                                {step.subtitle}
                            </p>
                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
