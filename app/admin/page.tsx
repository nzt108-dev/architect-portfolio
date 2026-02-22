'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// ── Types ──────────────────────────────────────────────
interface DashboardData {
    // Counts
    projectCount: number
    skillCount: number
    totalLeads: number
    unreadLeads: number
    totalTasks: number
    // Lead pipeline
    pipeline: { new: number; contacted: number; qualified: number; proposal: number; won: number; lost: number }
    hotLeads: Array<{
        id: string; name: string; email: string; subject: string; budget: string
        status: string; label: string; createdAt: string
    }>
    // Tasks
    upcomingDeadlines: Array<{
        id: string; title: string; status: string; type: string; priority: string
        dueDate: string; project: { title: string; slug: string }
    }>
    overdueTasks: number
    tasksInProgress: number
    tasksDone: number
    // Activity
    recentActivity: Array<{
        id: string; type: string; title: string; createdAt: string
        project: { title: string } | null
    }>
    // Revenue
    wonRevenue: number
    pipelineValue: number
    // Projects
    projects: Array<{ title: string; slug: string; progress: number; category: string }>
}

// ── Main Component ─────────────────────────────────────
export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch('/api/admin/dashboard')
            .then(res => res.json())
            .then(setData)
            .catch(console.error)
            .finally(() => setIsLoading(false))
    }, [])

    if (isLoading || !data) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--neon-cyan)]" />
            </div>
        )
    }

    const conversionRate = data.totalLeads > 0
        ? Math.round((data.pipeline.won / data.totalLeads) * 100)
        : 0

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            {/* ── Top Stats ─────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                <StatCard icon="📁" label="Projects" value={data.projectCount} href="/admin/projects" />
                <StatCard icon="⚡" label="Skills" value={data.skillCount} href="/admin/skills" />
                <StatCard
                    icon="🔥"
                    label="New Leads"
                    value={data.pipeline.new}
                    href="/admin/messages"
                    accent={data.pipeline.new > 0 ? 'cyan' : undefined}
                />
                <StatCard
                    icon="📋"
                    label="Active Tasks"
                    value={data.tasksInProgress}
                    href="/admin/crm"
                    accent={data.tasksInProgress > 0 ? 'amber' : undefined}
                />
                <StatCard
                    icon="💰"
                    label="Revenue"
                    value={data.wonRevenue > 0 ? `$${(data.wonRevenue / 1000).toFixed(0)}k` : '$0'}
                    href="/admin/finance"
                    accent="green"
                />
                <StatCard
                    icon="⚠️"
                    label="Overdue"
                    value={data.overdueTasks}
                    href="/admin/crm"
                    accent={data.overdueTasks > 0 ? 'red' : undefined}
                />
            </div>

            {/* ── Lead Funnel + Revenue ──────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {/* Lead Funnel */}
                <div className="lg:col-span-2 cyber-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold">Lead Funnel</h2>
                        <Link href="/admin/messages" className="text-xs text-[var(--neon-cyan)] hover:underline">
                            View all →
                        </Link>
                    </div>
                    <LeadFunnel pipeline={data.pipeline} total={data.totalLeads} />
                    <div className="mt-3 text-xs text-[var(--text-muted)]">
                        Conversion rate: <span className="text-green-400 font-medium">{conversionRate}%</span>
                        &nbsp;·&nbsp; Total leads: {data.totalLeads}
                    </div>
                </div>

                {/* Revenue Summary */}
                <div className="cyber-card p-5">
                    <h2 className="font-semibold mb-4">💰 Revenue</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="text-3xl font-bold text-green-400">
                                ${data.wonRevenue.toLocaleString()}
                            </div>
                            <div className="text-xs text-[var(--text-muted)]">Won deals</div>
                        </div>
                        <div>
                            <div className="text-xl font-semibold text-amber-400">
                                ${data.pipelineValue.toLocaleString()}
                            </div>
                            <div className="text-xs text-[var(--text-muted)]">Pipeline value</div>
                        </div>
                        <div className="pt-3 border-t border-[var(--border-color)]">
                            <div className="text-sm">
                                <span className="text-green-400">{data.pipeline.won}</span> won ·{' '}
                                <span className="text-red-400">{data.pipeline.lost}</span> lost
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Hot Leads + Deadlines ──────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {/* Hot Leads */}
                <div className="cyber-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold">🔥 Hot Leads</h2>
                        <Link href="/admin/messages" className="text-xs text-[var(--neon-cyan)] hover:underline">
                            All leads →
                        </Link>
                    </div>
                    {data.hotLeads.length === 0 ? (
                        <p className="text-sm text-[var(--text-muted)] py-4 text-center">No hot leads right now</p>
                    ) : (
                        <div className="space-y-2">
                            {data.hotLeads.map(lead => (
                                <Link
                                    key={lead.id}
                                    href="/admin/messages"
                                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] transition-all"
                                >
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">{lead.name}</span>
                                            {lead.label === 'hot' && <span className="text-xs">🔥</span>}
                                        </div>
                                        <p className="text-xs text-[var(--text-muted)] truncate">{lead.subject}</p>
                                    </div>
                                    {lead.budget && (
                                        <span className="text-xs text-green-400 flex-shrink-0 ml-2">
                                            💰 {lead.budget}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Upcoming Deadlines */}
                <div className="cyber-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold">📅 Upcoming Deadlines</h2>
                        <Link href="/admin/crm" className="text-xs text-[var(--neon-cyan)] hover:underline">
                            CRM →
                        </Link>
                    </div>
                    {data.upcomingDeadlines.length === 0 ? (
                        <p className="text-sm text-[var(--text-muted)] py-4 text-center">No upcoming deadlines</p>
                    ) : (
                        <div className="space-y-2">
                            {data.upcomingDeadlines.map(task => {
                                const due = new Date(task.dueDate)
                                const now = new Date()
                                const daysLeft = Math.ceil((due.getTime() - now.getTime()) / 86400000)
                                const isOverdue = daysLeft < 0
                                const isUrgent = daysLeft <= 2

                                return (
                                    <Link
                                        key={task.id}
                                        href="/admin/crm"
                                        className={`flex items-center justify-between p-3 rounded-lg transition-all ${isOverdue
                                            ? 'bg-red-500/5 border border-red-500/20'
                                            : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)]'
                                            }`}
                                    >
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs">
                                                    {task.type === 'milestone' ? '🏆' : task.type === 'bug' ? '🐛' : task.type === 'feature' ? '✨' : '✅'}
                                                </span>
                                                <span className="font-medium text-sm truncate">{task.title}</span>
                                            </div>
                                            <p className="text-xs text-[var(--text-muted)] ml-5">{task.project.title}</p>
                                        </div>
                                        <span className={`text-xs flex-shrink-0 ml-2 ${isOverdue ? 'text-red-400 font-medium' :
                                            isUrgent ? 'text-amber-400' : 'text-[var(--text-muted)]'
                                            }`}>
                                            {isOverdue ? `⚠️ ${Math.abs(daysLeft)}d late` :
                                                daysLeft === 0 ? 'Today' :
                                                    daysLeft === 1 ? 'Tomorrow' :
                                                        `${daysLeft}d left`}
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Projects Progress + Recent Activity ───── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Projects Progress */}
                <div className="cyber-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold">📁 Projects</h2>
                        <Link href="/admin/projects" className="text-xs text-[var(--neon-cyan)] hover:underline">
                            Manage →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {data.projects.map(p => (
                            <Link
                                key={p.slug}
                                href={`/admin/projects`}
                                className="block p-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] transition-all"
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-medium">{p.title}</span>
                                    <span className={`text-xs font-medium ${p.progress >= 80 ? 'text-green-400' :
                                        p.progress >= 40 ? 'text-amber-400' : 'text-[var(--text-muted)]'
                                        }`}>
                                        {p.progress}%
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-[var(--bg-card)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{
                                            width: `${p.progress}%`,
                                            background: p.progress >= 80
                                                ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                                                : p.progress >= 40
                                                    ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                                    : 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))'
                                        }}
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="cyber-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold">📜 Recent Activity</h2>
                        <Link href="/admin/crm" className="text-xs text-[var(--neon-cyan)] hover:underline">
                            Full log →
                        </Link>
                    </div>
                    {data.recentActivity.length === 0 ? (
                        <p className="text-sm text-[var(--text-muted)] py-4 text-center">No recent activity</p>
                    ) : (
                        <div className="space-y-1">
                            {data.recentActivity.map(log => {
                                const icons: Record<string, string> = {
                                    push: '🔀', task: '✅', note: '📝', deploy: '🚀', milestone: '🏆'
                                }
                                const d = new Date(log.createdAt)
                                const now = new Date()
                                const diffH = Math.floor((now.getTime() - d.getTime()) / 3600000)
                                const timeStr = diffH < 1 ? 'just now' :
                                    diffH < 24 ? `${diffH}h` :
                                        `${Math.floor(diffH / 24)}d`

                                return (
                                    <div key={log.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-all">
                                        <span className="text-sm">{icons[log.type] || '📋'}</span>
                                        <div className="flex-grow min-w-0">
                                            <span className="text-sm truncate block">{log.title}</span>
                                        </div>
                                        {log.project && (
                                            <span className="text-[10px] text-[var(--text-muted)] flex-shrink-0">
                                                {log.project.title}
                                            </span>
                                        )}
                                        <span className="text-[10px] text-[var(--text-muted)] flex-shrink-0 w-8 text-right">
                                            {timeStr}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ── Lead Funnel ────────────────────────────────────────
function LeadFunnel({ pipeline, total }: { pipeline: DashboardData['pipeline']; total: number }) {
    const stages = [
        { key: 'new', label: 'New', count: pipeline.new, color: '#22d3ee' },
        { key: 'contacted', label: 'Contacted', count: pipeline.contacted, color: '#3b82f6' },
        { key: 'qualified', label: 'Qualified', count: pipeline.qualified, color: '#f59e0b' },
        { key: 'proposal', label: 'Proposal', count: pipeline.proposal, color: '#a855f7' },
        { key: 'won', label: 'Won', count: pipeline.won, color: '#22c55e' },
    ]

    const maxCount = Math.max(...stages.map(s => s.count), 1)

    return (
        <div className="space-y-2">
            {stages.map((stage, idx) => {
                const width = total > 0 ? Math.max((stage.count / maxCount) * 100, 8) : 8
                // Funnel narrowing effect
                const funnelScale = 100 - (idx * 8)

                return (
                    <div key={stage.key} className="flex items-center gap-3">
                        <span className="text-xs text-[var(--text-muted)] w-20 text-right">{stage.label}</span>
                        <div className="flex-grow" style={{ maxWidth: `${funnelScale}%` }}>
                            <div className="w-full h-6 bg-[var(--bg-secondary)] rounded-md overflow-hidden relative">
                                <div
                                    className="h-full rounded-md transition-all duration-700 flex items-center justify-end pr-2"
                                    style={{
                                        width: `${width}%`,
                                        backgroundColor: `${stage.color}30`,
                                        borderLeft: `3px solid ${stage.color}`,
                                    }}
                                >
                                    {stage.count > 0 && (
                                        <span className="text-xs font-medium" style={{ color: stage.color }}>
                                            {stage.count}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

// ── Stat Card ──────────────────────────────────────────
function StatCard({
    icon, label, value, href, accent,
}: {
    icon: string; label: string; value: number | string; href: string
    accent?: 'cyan' | 'amber' | 'green' | 'red'
}) {
    const accentColors = {
        cyan: 'text-cyan-400',
        amber: 'text-amber-400',
        green: 'text-green-400',
        red: 'text-red-400',
    }

    return (
        <Link
            href={href}
            className="cyber-card p-4 hover:border-[var(--neon-cyan)]/50 transition-all group text-center"
        >
            <div className="text-xl mb-1">{icon}</div>
            <div className={`text-2xl font-bold group-hover:text-[var(--neon-cyan)] transition-colors ${accent ? accentColors[accent] : ''
                }`}>
                {value}
            </div>
            <div className="text-[var(--text-muted)] text-xs">{label}</div>
        </Link>
    )
}
