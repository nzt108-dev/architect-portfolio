'use client'

import Link from 'next/link'
import { Globe, Bot, Smartphone, Layers } from 'lucide-react'

const pricingOptions = [
    {
        icon: Globe,
        title: 'Websites & Landings',
        price: 'from $300',
        time: '~3 days',
        features: ['Responsive design', 'SEO optimized', 'Fast loading'],
    },
    {
        icon: Bot,
        title: 'Bots & Parsers',
        price: 'from $500',
        time: '~1 week',
        features: ['Telegram / Discord', 'Data scraping', 'API integration'],
    },
    {
        icon: Smartphone,
        title: 'Mobile Apps',
        price: 'from $3,000',
        time: '~3 weeks',
        features: ['iOS & Android', 'Flutter / React Native', 'App Store deployment'],
    },
    {
        icon: Layers,
        title: 'SaaS Platforms',
        price: 'from $3,000',
        time: '~1 month',
        features: ['Full-stack', 'Auth & payments', 'Admin dashboard'],
    },
]

export default function QuickPricing() {
    return (
        <section className="py-20 relative z-10">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="section-title">
                        Simple, transparent pricing
                    </h2>
                    <p className="section-subtitle mx-auto">
                        Every project starts with a free consultation. No hidden fees, no surprises.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {pricingOptions.map((item) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={item.title}
                                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-md hover:-translate-y-1 group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center mb-4">
                                    <Icon size={20} className="text-[var(--accent-primary)]" />
                                </div>

                                <h3 className="text-lg font-bold mb-1 text-[var(--text-primary)]">
                                    {item.title}
                                </h3>

                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-2xl font-bold text-[var(--text-primary)]">{item.price}</span>
                                    <span className="text-sm text-[var(--text-muted)]">· {item.time}</span>
                                </div>

                                <ul className="flex flex-col gap-2 mb-6 flex-1">
                                    {item.features.map((f) => (
                                        <li key={f} className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-[var(--accent-primary)]" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/contact"
                                    className="btn-secondary text-sm py-2.5 rounded-xl text-center mt-auto"
                                >
                                    Get Estimate
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
