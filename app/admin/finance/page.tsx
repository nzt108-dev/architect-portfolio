'use client'

import { useState, useEffect } from 'react'

interface Lead {
    id: string; name: string; email: string; subject: string; budget: string
    serviceType: string; status: string; label: string; createdAt: string
}

export default function FinancePage() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch('/api/contact')
            .then(res => res.json())
            .then(data => setLeads(data))
            .catch(console.error)
            .finally(() => setIsLoading(false))
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--neon-cyan)]" />
            </div>
        )
    }

    const parseBudget = (b: string) => {
        const num = parseInt(b.replace(/\D/g, ''))
        return isNaN(num) ? 0 : num
    }

    // Revenue breakdown
    const wonDeals = leads.filter(l => l.status === 'won')
    const wonRevenue = wonDeals.reduce((s, l) => s + parseBudget(l.budget), 0)
    const pipelineDeals = leads.filter(l => ['qualified', 'proposal'].includes(l.status))
    const pipelineValue = pipelineDeals.reduce((s, l) => s + parseBudget(l.budget), 0)
    const totalPotential = leads.filter(l => !['lost', 'archived'].includes(l.status)).reduce((s, l) => s + parseBudget(l.budget), 0)
    const lostValue = leads.filter(l => l.status === 'lost').reduce((s, l) => s + parseBudget(l.budget), 0)

    // Group by service type
    const byService: Record<string, { count: number; revenue: number; pipeline: number }> = {}
    leads.forEach(l => {
        const svc = l.serviceType || 'Other'
        if (!byService[svc]) byService[svc] = { count: 0, revenue: 0, pipeline: 0 }
        byService[svc].count++
        if (l.status === 'won') byService[svc].revenue += parseBudget(l.budget)
        if (['qualified', 'proposal'].includes(l.status)) byService[svc].pipeline += parseBudget(l.budget)
    })

    // Monthly breakdown (group won deals by month)
    const byMonth: Record<string, number> = {}
    wonDeals.forEach(l => {
        const d = new Date(l.createdAt)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        byMonth[key] = (byMonth[key] || 0) + parseBudget(l.budget)
    })
    const sortedMonths = Object.entries(byMonth).sort((a, b) => b[0].localeCompare(a[0]))
    const maxMonthly = Math.max(...Object.values(byMonth), 1)

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Finance</h1>
            <p className="text-[var(--text-muted)] text-sm mb-6">Revenue tracking from lead pipeline</p>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="cyber-card p-4 text-center">
                    <div className="text-3xl font-bold text-green-400">${wonRevenue.toLocaleString()}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">Won Revenue</div>
                    <div className="text-xs text-green-400/60">{wonDeals.length} deals</div>
                </div>
                <div className="cyber-card p-4 text-center">
                    <div className="text-3xl font-bold text-amber-400">${pipelineValue.toLocaleString()}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">Pipeline Value</div>
                    <div className="text-xs text-amber-400/60">{pipelineDeals.length} deals</div>
                </div>
                <div className="cyber-card p-4 text-center">
                    <div className="text-3xl font-bold text-[var(--neon-cyan)]">${totalPotential.toLocaleString()}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">Total Potential</div>
                </div>
                <div className="cyber-card p-4 text-center">
                    <div className="text-3xl font-bold text-red-400">${lostValue.toLocaleString()}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">Lost</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {/* Won Deals Table */}
                <div className="cyber-card p-5">
                    <h2 className="font-semibold mb-4">🎉 Won Deals</h2>
                    {wonDeals.length === 0 ? (
                        <p className="text-sm text-[var(--text-muted)] py-6 text-center">No won deals yet. Move leads to &quot;Won&quot; in the pipeline!</p>
                    ) : (
                        <div className="space-y-2">
                            {wonDeals.map(deal => (
                                <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/15">
                                    <div>
                                        <div className="font-medium text-sm">{deal.name}</div>
                                        <div className="text-xs text-[var(--text-muted)]">{deal.serviceType || deal.subject}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-green-400">
                                            {deal.budget ? `$${parseBudget(deal.budget).toLocaleString()}` : '—'}
                                        </div>
                                        <div className="text-[10px] text-[var(--text-muted)]">
                                            {new Date(deal.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Monthly Revenue */}
                <div className="cyber-card p-5">
                    <h2 className="font-semibold mb-4">📊 Monthly Revenue</h2>
                    {sortedMonths.length === 0 ? (
                        <p className="text-sm text-[var(--text-muted)] py-6 text-center">No revenue data yet</p>
                    ) : (
                        <div className="space-y-3">
                            {sortedMonths.map(([month, amount]) => {
                                const [year, m] = month.split('-')
                                const monthName = new Date(parseInt(year), parseInt(m) - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                                return (
                                    <div key={month}>
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span>{monthName}</span>
                                            <span className="text-green-400 font-medium">${amount.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                                                style={{ width: `${(amount / maxMonthly) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* By Service Type */}
            <div className="cyber-card p-5">
                <h2 className="font-semibold mb-4">📋 Revenue by Service</h2>
                {Object.keys(byService).length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)] py-4 text-center">No data</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(byService).map(([svc, data]) => (
                            <div key={svc} className="p-4 rounded-xl bg-[var(--bg-secondary)]">
                                <div className="text-sm font-medium mb-2">{svc}</div>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div>
                                        <div className="text-lg font-bold">{data.count}</div>
                                        <div className="text-[10px] text-[var(--text-muted)]">Leads</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-green-400">${data.revenue.toLocaleString()}</div>
                                        <div className="text-[10px] text-[var(--text-muted)]">Won</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-amber-400">${data.pipeline.toLocaleString()}</div>
                                        <div className="text-[10px] text-[var(--text-muted)]">Pipeline</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
