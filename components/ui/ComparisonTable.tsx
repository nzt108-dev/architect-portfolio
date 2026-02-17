'use client'

export default function ComparisonTable() {
    return (
        <section className="py-20">
            <div className="text-center mb-14">
                <h2 className="section-title gradient-text">How I Compare</h2>
                <p className="section-subtitle mx-auto">
                    See why working with an independent developer beats the alternatives.
                </p>
            </div>

            <div className="cyber-card overflow-hidden neon-border">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr className="border-b border-[var(--border-color)]">
                                <th className="text-left p-5 text-[var(--text-muted)] text-sm font-medium uppercase tracking-wider w-1/4">
                                    Feature
                                </th>
                                <th className="p-5 text-center">
                                    <span className="text-[var(--accent-primary)] font-bold text-lg">nzt108_dev</span>
                                </th>
                                <th className="p-5 text-center text-[var(--text-secondary)] font-semibold">
                                    Agency
                                </th>
                                <th className="p-5 text-center text-[var(--text-secondary)] font-semibold">
                                    Freelance Platform
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, i) => (
                                <tr
                                    key={row.feature}
                                    className={i < rows.length - 1 ? 'border-b border-[var(--border-color)]' : ''}
                                >
                                    <td className="p-5 text-sm font-medium text-[var(--text-primary)]">
                                        {row.feature}
                                    </td>
                                    <td className="p-5 text-center">
                                        <span className="inline-flex items-center gap-2 text-[var(--accent-green)] text-sm font-medium">
                                            {row.me}
                                        </span>
                                    </td>
                                    <td className="p-5 text-center text-[var(--text-secondary)] text-sm">
                                        {row.agency}
                                    </td>
                                    <td className="p-5 text-center text-[var(--text-secondary)] text-sm">
                                        {row.freelance}
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
        feature: 'Cost',
        me: '💰 Fair & transparent',
        agency: '💰💰💰 Premium markup',
        freelance: '💰💰 Varies wildly',
    },
    {
        feature: 'Speed',
        me: '⚡ Days to weeks',
        agency: '🐌 Weeks to months',
        freelance: '🎲 Unpredictable',
    },
    {
        feature: 'Quality',
        me: '✅ Architect-level code',
        agency: '✅ Team-dependent',
        freelance: '⚠️ Hit or miss',
    },
    {
        feature: 'Communication',
        me: '💬 Direct, daily updates',
        agency: '📞 Through a PM',
        freelance: '⏰ Timezone roulette',
    },
    {
        feature: 'Architecture',
        me: '🏗️ Scalable from day 1',
        agency: '📐 Scope-dependent',
        freelance: '❌ Rarely considered',
    },
    {
        feature: 'Post-launch Support',
        me: '🛡️ Included',
        agency: '💰 Extra cost',
        freelance: '👻 Developer disappears',
    },
]
