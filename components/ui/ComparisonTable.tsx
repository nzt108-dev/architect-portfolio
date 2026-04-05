'use client'

import { Check, X, Minus } from 'lucide-react'

export default function ComparisonTable() {
    return (
        <section className="py-20 relative z-10">
            <div className="mb-12">
                <h2 className="section-title">
                    Why work with me?
                </h2>
                <p className="section-subtitle">
                    See how I compare to traditional alternatives.
                </p>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-color)]">
                                <th className="p-5 text-sm text-[var(--text-secondary)] font-medium w-1/4">
                                    Feature
                                </th>
                                <th className="p-5 text-sm font-semibold text-[var(--accent-primary)] border-l border-r border-[var(--border-color)] bg-[var(--accent-light)]">
                                    nzt108.dev
                                </th>
                                <th className="p-5 text-sm text-[var(--text-secondary)] font-medium w-1/4">
                                    Agency
                                </th>
                                <th className="p-5 text-sm text-[var(--text-secondary)] font-medium w-1/4">
                                    Freelance Platform
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {rows.map((row, i) => (
                                <tr
                                    key={row.feature}
                                    className={`hover:bg-[var(--bg-secondary)]/50 transition-colors ${i < rows.length - 1 ? 'border-b border-[var(--border-color)]' : ''}`}
                                >
                                    <td className="p-5 text-[var(--text-primary)] font-medium">
                                        {row.feature}
                                    </td>
                                    <td className="p-5 border-l border-r border-[var(--border-color)] bg-[var(--accent-light)]">
                                        <div className="flex items-center gap-2">
                                            <Check size={16} className="text-[var(--accent-green)]" />
                                            <span className="text-[var(--text-primary)]">{row.me}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-[var(--text-secondary)]">
                                        <div className="flex items-center gap-2">
                                            {row.agencyIcon === 'minus' ? <Minus size={16} className="text-[var(--accent-amber)]" /> : <X size={16} className="text-red-400" />}
                                            <span>{row.agency}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-[var(--text-secondary)]">
                                        <div className="flex items-center gap-2">
                                            {row.freelanceIcon === 'minus' ? <Minus size={16} className="text-[var(--accent-amber)]" /> : <X size={16} className="text-red-400" />}
                                            <span>{row.freelance}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

const rows = [
    {
        feature: 'Pricing',
        me: 'Fixed & transparent',
        agency: 'High markup',
        agencyIcon: 'x',
        freelance: 'Variable / hidden',
        freelanceIcon: 'minus',
    },
    {
        feature: 'Delivery Speed',
        me: 'Days to weeks',
        agency: 'Weeks to months',
        agencyIcon: 'minus',
        freelance: 'Unpredictable',
        freelanceIcon: 'x',
    },
    {
        feature: 'Code Quality',
        me: 'Scalable architecture',
        agency: 'Scope dependent',
        agencyIcon: 'minus',
        freelance: 'Often fragile',
        freelanceIcon: 'x',
    },
    {
        feature: 'Communication',
        me: 'Direct to engineer',
        agency: 'Filtered via PM',
        agencyIcon: 'minus',
        freelance: 'Async / delayed',
        freelanceIcon: 'x',
    },
    {
        feature: 'Post-launch Support',
        me: 'Included',
        agency: 'Expensive retainer',
        agencyIcon: 'x',
        freelance: 'No guarantee',
        freelanceIcon: 'x',
    },
]
