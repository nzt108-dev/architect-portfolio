'use client'

import { useState, useEffect } from 'react'

interface Lead {
    id: string; name: string; email: string; subject: string; budget: string
    serviceType: string; status: string; label: string; dealValue: number; createdAt: string
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

    // ── Revenue Calculations ───────────────────────────
    const wonDeals = leads.filter(l => l.status === 'won')
    const wonRevenue = wonDeals.reduce((s, l) => s + (l.dealValue || 0), 0)
    const pipelineDeals = leads.filter(l => ['contacted', 'qualified', 'proposal'].includes(l.status))
    const pipelineValue = pipelineDeals.reduce((s, l) => s + (l.dealValue || 0), 0)
    const allActiveDeals = leads.filter(l => !['lost', 'archived'].includes(l.status))
    const totalPotential = allActiveDeals.reduce((s, l) => s + (l.dealValue || 0), 0)
    const lostDeals = leads.filter(l => l.status === 'lost')
    const lostValue = lostDeals.reduce((s, l) => s + (l.dealValue || 0), 0)

    // ── Metrics ────────────────────────────────────────
    const totalLeads = leads.length
    const conversionRate = totalLeads > 0 ? Math.round((wonDeals.length / totalLeads) * 100) : 0
    const avgDealSize = wonDeals.length > 0 ? Math.round(wonRevenue / wonDeals.length) : 0
    const winRate = (wonDeals.length + lostDeals.length) > 0
        ? Math.round((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100)
        : 0

    // ── Group by service type ──────────────────────────
    const byService: Record<string, { count: number; revenue: number; pipeline: number; deals: number }> = {}
    leads.forEach(l => {
        const svc = l.serviceType || 'Other'
        if (!byService[svc]) byService[svc] = { count: 0, revenue: 0, pipeline: 0, deals: 0 }
        byService[svc].count++
        if (l.status === 'won') {
            byService[svc].revenue += (l.dealValue || 0)
            byService[svc].deals++
        }
        if (['contacted', 'qualified', 'proposal'].includes(l.status)) {
            byService[svc].pipeline += (l.dealValue || 0)
        }
    })

    // ── Monthly breakdown (won deals by month) ─────────
    const byMonth: Record<string, { revenue: number; count: number }> = {}
    wonDeals.forEach(l => {
        const d = new Date(l.createdAt)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (!byMonth[key]) byMonth[key] = { revenue: 0, count: 0 }
        byMonth[key].revenue += (l.dealValue || 0)
        byMonth[key].count++
    })
    const sortedMonths = Object.entries(byMonth).sort((a, b) => b[0].localeCompare(a[0]))
    const maxMonthly = Math.max(...Object.values(byMonth).map(m => m.revenue), 1)

    // ── Pipeline by stage ──────────────────────────────
    const pipelineStages = [
        { key: 'new', label: 'New', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
        { key: 'contacted', label: 'Contacted', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
        { key: 'qualified', label: 'Qualified', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
        { key: 'proposal', label: 'Proposal', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    ]

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Finance</h1>
            <p className="text-[var(--text-muted)] text-sm mb-6">Revenue tracking from lead pipeline</p>

            {/* ── Overview Cards ─────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="cyber-card p-4 text-center">
                    <div className="text-3xl font-bold text-green-400">${wonRevenue.toLocaleString()}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">Won Revenue</div>
                    <div className="text-xs text-green-400/60">{wonDeals.length} deal{wonDeals.length !== 1 ? 's' : ''}</div>
                </div>
                <div className="cyber-card p-4 text-center">
                    <div className="text-3xl font-bold text-amber-400">${pipelineValue.toLocaleString()}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">Pipeline Value</div>
                    <div className="text-xs text-amber-400/60">{pipelineDeals.length} deal{pipelineDeals.length !== 1 ? 's' : ''}</div>
                </div>
                <div className="cyber-card p-4 text-center">
                    <div className="text-3xl font-bold text-[var(--neon-cyan)]">${totalPotential.toLocaleString()}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">Total Potential</div>
                </div>
                <div className="cyber-card p-4 text-center">
                    <div className="text-3xl font-bold text-red-400">${lostValue.toLocaleString()}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">Lost</div>
                    <div className="text-xs text-red-400/60">{lostDeals.length} deal{lostDeals.length !== 1 ? 's' : ''}</div>
                </div>
            </div>

            {/* ── KPI Metrics Row ────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="cyber-card p-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--text-muted)]">Conversion Rate</span>
                        <span className="text-lg font-bold text-[var(--neon-cyan)]">{conversionRate}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--bg-secondary)] rounded-full mt-2 overflow-hidden">
                        <div className="h-full rounded-full bg-[var(--neon-cyan)] transition-all" style={{ width: `${conversionRate}%` }} />
                    </div>
                </div>
                <div className="cyber-card p-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--text-muted)]">Win Rate</span>
                        <span className="text-lg font-bold text-green-400">{winRate}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--bg-secondary)] rounded-full mt-2 overflow-hidden">
                        <div className="h-full rounded-full bg-green-400 transition-all" style={{ width: `${winRate}%` }} />
                    </div>
                </div>
                <div className="cyber-card p-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--text-muted)]">Avg Deal Size</span>
                        <span className="text-lg font-bold text-amber-400">${avgDealSize.toLocaleString()}</span>
                    </div>
                </div>
                <div className="cyber-card p-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--text-muted)]">Total Leads</span>
                        <span className="text-lg font-bold">{totalLeads}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {/* ── Won Deals Table ────────────────────── */}
                <div className="cyber-card p-5">
                    <h2 className="font-semibold mb-4">🎉 Won Deals</h2>
                    {wonDeals.length === 0 ? (
                        <div className="text-center py-6">
                            <p className="text-sm text-[var(--text-muted)] mb-2">No won deals yet</p>
                            <p className="text-xs text-[var(--text-muted)]">
                                Set deal values in <a href="/admin/messages" className="text-[var(--neon-cyan)] hover:underline">Leads</a> →
                                open a lead → enter Deal Value → move to Won
                            </p>
                        </div>
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
                                            {deal.dealValue > 0 ? `$${deal.dealValue.toLocaleString()}` : '—'}
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

                {/* ── Monthly Revenue Chart ──────────────── */}
                <div className="cyber-card p-5">
                    <h2 className="font-semibold mb-4">📊 Monthly Revenue</h2>
                    {sortedMonths.length === 0 ? (
                        <p className="text-sm text-[var(--text-muted)] py-6 text-center">No revenue data yet</p>
                    ) : (
                        <div className="space-y-3">
                            {sortedMonths.map(([month, data]) => {
                                const [year, m] = month.split('-')
                                const monthName = new Date(parseInt(year), parseInt(m) - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                                return (
                                    <div key={month}>
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span>{monthName}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-[var(--text-muted)]">{data.count} deal{data.count !== 1 ? 's' : ''}</span>
                                                <span className="text-green-400 font-medium">${data.revenue.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="w-full h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                                                style={{ width: `${(data.revenue / maxMonthly) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* ── Pipeline Breakdown ──────────────────── */}
                <div className="cyber-card p-5">
                    <h2 className="font-semibold mb-4">🏗 Pipeline Breakdown</h2>
                    <div className="space-y-3">
                        {pipelineStages.map(stage => {
                            const stageLeads = leads.filter(l => l.status === stage.key)
                            const stageValue = stageLeads.reduce((s, l) => s + (l.dealValue || 0), 0)
                            return (
                                <div key={stage.key} className={`p-3 rounded-lg border ${stage.color}`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-sm font-medium">{stage.label}</span>
                                            <span className="text-xs opacity-60 ml-2">{stageLeads.length} lead{stageLeads.length !== 1 ? 's' : ''}</span>
                                        </div>
                                        <span className="text-sm font-bold">${stageValue.toLocaleString()}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* ── By Service Type ────────────────────── */}
                <div className="cyber-card p-5">
                    <h2 className="font-semibold mb-4">📋 Revenue by Service</h2>
                    {Object.keys(byService).length === 0 ? (
                        <p className="text-sm text-[var(--text-muted)] py-4 text-center">No data</p>
                    ) : (
                        <div className="space-y-3">
                            {Object.entries(byService)
                                .sort((a, b) => b[1].revenue - a[1].revenue)
                                .map(([svc, data]) => (
                                    <div key={svc} className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium">{svc}</span>
                                            <span className="text-xs text-[var(--text-muted)]">{data.count} lead{data.count !== 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div>
                                                <div className="text-sm font-bold text-green-400">${data.revenue.toLocaleString()}</div>
                                                <div className="text-[10px] text-[var(--text-muted)]">Won ({data.deals})</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-amber-400">${data.pipeline.toLocaleString()}</div>
                                                <div className="text-[10px] text-[var(--text-muted)]">Pipeline</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold">${(data.revenue + data.pipeline).toLocaleString()}</div>
                                                <div className="text-[10px] text-[var(--text-muted)]">Total</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
