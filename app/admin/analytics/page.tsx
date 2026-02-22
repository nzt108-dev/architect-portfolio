'use client'

import { useState, useEffect } from 'react'

interface AnalyticsData {
    totalViews: number
    uniqueVisitors: number
    days: number
    byDay: Record<string, number>
    topPages: { path: string; count: number }[]
    topReferrers: { source: string; count: number }[]
    byDevice: Record<string, number>
    byBrowser: Record<string, number>
    topCountries: { country: string; count: number }[]
}

const PERIOD_OPTIONS = [
    { label: '7 days', value: 7 },
    { label: '30 days', value: 30 },
    { label: '90 days', value: 90 },
]

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [period, setPeriod] = useState(30)

    useEffect(() => {
        setIsLoading(true)
        fetch(`/api/admin/analytics?days=${period}`)
            .then(res => res.json())
            .then(setData)
            .catch(console.error)
            .finally(() => setIsLoading(false))
    }, [period])

    if (isLoading || !data) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--neon-cyan)]" />
            </div>
        )
    }

    // Build sparkline data for last N days
    const sortedDays = Object.entries(data.byDay).sort((a, b) => a[0].localeCompare(b[0]))
    const maxDayViews = Math.max(...sortedDays.map(d => d[1]), 1)
    const avgDaily = data.totalViews > 0 ? Math.round(data.totalViews / Math.min(period, sortedDays.length || 1)) : 0
    const deviceTotal = Object.values(data.byDevice).reduce((s, v) => s + v, 0) || 1

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Analytics</h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">Site traffic and visitor insights</p>
                </div>
                <div className="flex gap-1">
                    {PERIOD_OPTIONS.map(p => (
                        <button
                            key={p.value}
                            onClick={() => setPeriod(p.value)}
                            className={`text-xs px-3 py-1.5 rounded-lg transition-all ${period === p.value
                                ? 'bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/30'
                                : 'text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]'
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Overview Cards ─────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="cyber-card p-4 text-center">
                    <div className="text-3xl font-bold text-[var(--neon-cyan)]">{data.totalViews.toLocaleString()}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">Page Views</div>
                </div>
                <div className="cyber-card p-4 text-center">
                    <div className="text-3xl font-bold text-purple-400">{data.uniqueVisitors.toLocaleString()}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">Unique Visitors</div>
                </div>
                <div className="cyber-card p-4 text-center">
                    <div className="text-3xl font-bold text-amber-400">{avgDaily}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">Avg. Daily</div>
                </div>
                <div className="cyber-card p-4 text-center">
                    <div className="text-3xl font-bold text-green-400">{data.topPages.length}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">Pages Visited</div>
                </div>
            </div>

            {/* ── Traffic Chart ──────────────────────────── */}
            <div className="cyber-card p-5 mb-6">
                <h2 className="font-semibold mb-4">📈 Traffic</h2>
                {sortedDays.length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)] py-8 text-center">No traffic data yet. Views will appear as visitors browse your site.</p>
                ) : (
                    <div>
                        <div className="flex items-end gap-[2px] h-32">
                            {sortedDays.map(([day, count]) => {
                                const height = (count / maxDayViews) * 100
                                const date = new Date(day)
                                return (
                                    <div
                                        key={day}
                                        className="flex-1 group relative"
                                        title={`${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${count} views`}
                                    >
                                        <div
                                            className="w-full rounded-t-sm bg-gradient-to-t from-[var(--neon-cyan)] to-[var(--neon-cyan)]/50 transition-all hover:opacity-80"
                                            style={{ height: `${Math.max(height, 2)}%` }}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                        <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-2">
                            <span>{sortedDays.length > 0 ? new Date(sortedDays[0][0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
                            <span>{sortedDays.length > 0 ? new Date(sortedDays[sortedDays.length - 1][0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {/* ── Top Pages ──────────────────────────── */}
                <div className="cyber-card p-5">
                    <h2 className="font-semibold mb-4">📄 Popular Pages</h2>
                    {data.topPages.length === 0 ? (
                        <p className="text-sm text-[var(--text-muted)] py-4 text-center">No data</p>
                    ) : (
                        <div className="space-y-2">
                            {data.topPages.map((page, i) => (
                                <div key={page.path} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-all">
                                    <span className="text-xs text-[var(--text-muted)] w-5">{i + 1}.</span>
                                    <div className="flex-grow min-w-0">
                                        <span className="text-sm font-medium truncate block">{page.path === '/' ? 'Homepage' : page.path}</span>
                                        <div className="w-full h-1 bg-[var(--bg-secondary)] rounded-full mt-1 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-[var(--neon-cyan)]"
                                                style={{ width: `${(page.count / (data.topPages[0]?.count || 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-[var(--neon-cyan)] flex-shrink-0">{page.count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Referrers ──────────────────────────── */}
                <div className="cyber-card p-5">
                    <h2 className="font-semibold mb-4">🔗 Traffic Sources</h2>
                    {data.topReferrers.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-sm text-[var(--text-muted)]">No referrer data yet</p>
                            <p className="text-xs text-[var(--text-muted)] mt-1">Direct traffic or referrers without headers</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {data.topReferrers.map((ref, i) => (
                                <div key={ref.source} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-all">
                                    <span className="text-xs text-[var(--text-muted)] w-5">{i + 1}.</span>
                                    <span className="text-sm flex-grow truncate">{ref.source}</span>
                                    <span className="text-sm font-medium text-purple-400 flex-shrink-0">{ref.count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* ── Device Breakdown ────────────────────── */}
                <div className="cyber-card p-5">
                    <h2 className="font-semibold mb-4">📱 Devices</h2>
                    <div className="space-y-3">
                        {Object.entries(data.byDevice).sort((a, b) => b[1] - a[1]).map(([device, count]) => {
                            const pct = Math.round((count / deviceTotal) * 100)
                            const icons: Record<string, string> = { desktop: '🖥️', mobile: '📱', tablet: '📋' }
                            return (
                                <div key={device}>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span>{icons[device] || '❓'} {device}</span>
                                        <span className="text-[var(--text-muted)]">{pct}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* ── Browsers ────────────────────────────── */}
                <div className="cyber-card p-5">
                    <h2 className="font-semibold mb-4">🌐 Browsers</h2>
                    <div className="space-y-3">
                        {Object.entries(data.byBrowser).sort((a, b) => b[1] - a[1]).map(([browser, count]) => {
                            const pct = Math.round((count / deviceTotal) * 100)
                            return (
                                <div key={browser}>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span>{browser}</span>
                                        <span className="text-[var(--text-muted)]">{pct}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* ── Countries ───────────────────────────── */}
                <div className="cyber-card p-5">
                    <h2 className="font-semibold mb-4">🌍 Countries</h2>
                    {data.topCountries.length === 0 ? (
                        <p className="text-sm text-[var(--text-muted)] py-4 text-center">No geolocation data</p>
                    ) : (
                        <div className="space-y-2">
                            {data.topCountries.map(c => (
                                <div key={c.country} className="flex items-center justify-between text-sm py-1">
                                    <span>{c.country}</span>
                                    <span className="text-green-400 font-medium">{c.count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
