'use client'

export default function ComparisonTable() {
    return (
        <section className="py-20 relative z-10">
            <div className="mb-14">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">
                    Vendor <span className="font-[var(--font-dm-serif)] italic text-[var(--accent-primary)]">Comparison.</span>
                </h2>
                <p className="text-[var(--text-secondary)] font-mono uppercase tracking-widest text-sm">
                    {'//'} Analysis of development resource allocation.
                </p>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-color)] bg-[var(--bg-primary)]/50">
                                <th className="p-6 font-mono text-[var(--text-secondary)] text-xs uppercase tracking-widest w-1/4">
                                    Metric Unit
                                </th>
                                <th className="p-6 font-mono text-[var(--accent-primary)] text-xs uppercase tracking-widest border-l border-r border-[var(--border-color)] bg-[var(--accent-primary)]/5">
                                    Architect (Me)
                                </th>
                                <th className="p-6 font-mono text-[var(--text-secondary)] text-xs uppercase tracking-widest w-1/4">
                                    Traditional Agency
                                </th>
                                <th className="p-6 font-mono text-[var(--text-secondary)] text-xs uppercase tracking-widest w-1/4">
                                    Freelance Platform
                                </th>
                            </tr>
                        </thead>
                        <tbody className="font-mono text-sm">
                            {rows.map((row, i) => (
                                <tr
                                    key={row.feature}
                                    className={`group hover:bg-[var(--bg-primary)]/30 transition-colors ${i < rows.length - 1 ? 'border-b border-[var(--border-color)]' : ''}`}
                                >
                                    <td className="p-6 text-[var(--text-primary)]">
                                        {row.feature}
                                    </td>
                                    <td className="p-6 border-l border-r border-[var(--border-color)] bg-[var(--accent-primary)]/5 group-hover:bg-[var(--accent-primary)]/10 transition-colors">
                                        <span className="text-[var(--text-primary)]">
                                            {row.me}
                                        </span>
                                    </td>
                                    <td className="p-6 text-[var(--text-secondary)]">
                                        {row.agency}
                                    </td>
                                    <td className="p-6 text-[var(--text-secondary)]">
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
        feature: 'Capital Overhead',
        me: '[OK] Transparent & Fixed',
        agency: '[ERR] High Agency Markup',
        freelance: '[WARN] Variable / Hidden',
    },
    {
        feature: 'Execution Velocity',
        me: '[OK] Days to Weeks',
        agency: '[WARN] Weeks to Months',
        freelance: '[ERR] Unpredictable',
    },
    {
        feature: 'Code Architecture',
        me: '[OK] Scalable Foundation',
        agency: '[WARN] Scope Dependent',
        freelance: '[ERR] Often Legacy/Fragile',
    },
    {
        feature: 'Communication Sync',
        me: '[OK] Direct to Engineer',
        agency: '[WARN] Filtered via PM',
        freelance: '[ERR] Asynchronous / Delayed',
    },
    {
        feature: 'System Maintenance',
        me: '[OK] Included by design',
        agency: '[ERR] High Retainer Fee',
        freelance: '[ERR] No Guarantee',
    },
]
