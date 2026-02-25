'use client'

const pricingOptions = [
    {
        tag: '[ WEB ]',
        title: 'Websites & Landings',
        price: 'from $300',
        time: 'from 3 days',
    },
    {
        tag: '[ BOT ]',
        title: 'Bots & Parsers',
        price: 'from $500',
        time: 'from 1 week',
    },
    {
        tag: '[ APP ]',
        title: 'Mobile Apps',
        price: 'from $3,000',
        time: 'from 3 weeks',
    },
    {
        tag: '[ SAAS ]',
        title: 'SaaS Platforms',
        price: 'from $3,000',
        time: 'from 1 month',
    },
]

export default function QuickPricing() {
    return (
        <section className="py-20 relative z-10">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2rem] lg:rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">

                {/* Abstract texture background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none premium-grid" />

                <div className="relative z-10">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter">
                            Resource <span className="font-[var(--font-dm-serif)] italic text-[var(--accent-primary)]">Allocation.</span>
                        </h2>
                        <p className="text-[var(--text-secondary)] font-mono text-sm uppercase tracking-widest leading-relaxed">
                            {'//'} Transparent calculation of capital and time requirements. <br />
                            <span className="text-[var(--accent-primary)]">High-performance architecture at competitive rates.</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {pricingOptions.map((item) => (
                            <div
                                key={item.title}
                                className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:border-[var(--accent-primary)] hover:-translate-y-2 group shadow-lg"
                            >
                                <div className="mb-6 mt-2">
                                    <span className="font-mono text-[var(--accent-primary)] text-sm tracking-widest font-bold">
                                        {item.tag}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold mb-8 text-[var(--text-primary)] tracking-tight group-hover:text-[var(--accent-primary)] transition-colors">
                                    {item.title}
                                </h3>

                                <div className="w-full mt-auto flex flex-col gap-3 font-mono text-sm">
                                    <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                                        <span className="text-[var(--text-secondary)] uppercase tracking-widest text-xs">Cost</span>
                                        <span className="text-[var(--text-primary)] font-bold">{item.price}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-[var(--text-secondary)] uppercase tracking-widest text-xs">Time</span>
                                        <span className="text-[var(--text-primary)]">{item.time}</span>
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
