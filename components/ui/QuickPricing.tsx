'use client'

import GradientIcon from './GradientIcon'

const pricingOptions = [
    {
        iconName: 'globe',
        title: 'Websites & Landings',
        price: 'from $300',
        time: 'from 3 days',
        accent: 'var(--accent-primary)',
    },
    {
        iconName: 'bot',
        title: 'Bots & Parsers',
        price: 'from $500',
        time: 'from 1 week',
        accent: 'var(--accent-secondary)',
    },
    {
        iconName: 'smartphone',
        title: 'Mobile Apps',
        price: 'from $1,500',
        time: 'from 3 weeks',
        accent: 'var(--accent-blue)',
    },
    {
        iconName: 'server',
        title: 'SaaS Platforms',
        price: 'from $3,000',
        time: 'from 1 month',
        accent: 'var(--accent-green)',
    },
]

export default function QuickPricing() {
    return (
        <section className="py-8 md:py-12 mt-[-2rem] mb-8 relative z-10">
            <div className="cyber-card p-8 md:p-12 relative overflow-hidden">
                {/* Background glow effects */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)] opacity-[0.03] blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--accent-secondary)] opacity-[0.03] blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="text-center mb-10 max-w-2xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">
                            Let&apos;s just calculate your idea.
                        </h2>
                        <p className="text-[var(--accent-primary)] text-lg md:text-xl font-medium mb-3">
                            I&apos;m sure it&apos;s much cheaper than you think.
                        </p>
                        <p className="text-[var(--text-secondary)] text-sm md:text-base">
                            Transparent starting prices based on my average delivery times.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {pricingOptions.map((item) => (
                            <div
                                key={item.title}
                                className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 flex flex-col items-center text-center transition-all hover:border-[var(--border-hover)] hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] hover:-translate-y-1 relative group"
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                                    style={{ background: `color-mix(in srgb, ${item.accent} 15%, transparent)` }}
                                >
                                    <GradientIcon name={item.iconName} size={24} />
                                </div>

                                <h3 className="text-base font-semibold mb-5 text-[var(--text-primary)]">{item.title}</h3>

                                <div className="w-full mt-auto space-y-2">
                                    <div className="bg-[var(--bg-card)] rounded-lg py-2.5 px-3 flex items-center justify-between border border-[var(--border-color)] group-hover:border-[var(--border-hover)] transition-colors">
                                        <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-mono">Cost</span>
                                        <span className="font-bold text-[var(--text-primary)]">{item.price}</span>
                                    </div>
                                    <div className="bg-[var(--bg-card)] rounded-lg py-2.5 px-3 flex items-center justify-between border border-[var(--border-color)] group-hover:border-[var(--border-hover)] transition-colors">
                                        <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-mono">Time</span>
                                        <span className="font-medium text-[var(--text-primary)]">{item.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
