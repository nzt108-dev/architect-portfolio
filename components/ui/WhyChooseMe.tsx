'use client'

import GradientIcon from './GradientIcon'

const advantages = [
    {
        iconName: 'zap',
        title: '3-5x Faster',
        description: 'AI-powered workflows and modern tools let me ship in days what agencies deliver in months.',
        accent: 'var(--accent-primary)',
    },
    {
        iconName: 'piggy-bank',
        title: 'Up to 70% Cheaper',
        description: 'One person, no overhead. You pay for results, not office rent and layers of management.',
        accent: 'var(--accent-secondary)',
    },
    {
        iconName: 'message-circle',
        title: 'Direct Communication',
        description: 'No managers, no middlemen. You talk directly with the person building your product.',
        accent: 'var(--accent-blue)',
    },
    {
        iconName: 'search',
        title: 'Transparent Process',
        description: 'Daily updates, live progress tracking, and full visibility into every step of development.',
        accent: 'var(--accent-green)',
    },
]

export default function WhyChooseMe() {
    return (
        <section className="py-20">
            <div className="text-center mb-14">
                <h2 className="section-title gradient-text">Why Choose Me</h2>
                <p className="section-subtitle mx-auto">
                    Skip the agency markup and freelancer lottery. Get professional results — faster and for less.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {advantages.map((item) => (
                    <div
                        key={item.title}
                        className="cyber-card p-6 text-center group"
                    >
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                            style={{ background: `color-mix(in srgb, ${item.accent} 15%, transparent)` }}
                        >
                            <GradientIcon name={item.iconName} size={28} />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}
