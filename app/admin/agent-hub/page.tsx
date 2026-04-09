'use client'

import { useState, useEffect, useMemo } from 'react'

/* ───── Types ───── */
interface Suggestion {
    id: string
    type: string
    title: string
    description: string
    impact: string
    effort: string
    status: string
    aiModel: string
    reasoning: string
    codeSnippet: string
    createdAt: string
    reviewedAt: string | null
    project: { title: string; slug: string }
}

interface Stats {
    pending: number
    approvedToday: number
    implemented: number
    total: number
    implementationRate: number
}

interface ProjectOption {
    id: string
    title: string
    slug: string
}

/* ───── Constants ───── */
const TYPE_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
    optimization: { icon: '⚡', label: 'Optimization', color: '#22d3ee' },
    feature: { icon: '✨', label: 'Feature', color: '#a855f7' },
    bug: { icon: '🐛', label: 'Bug Fix', color: '#ef4444' },
    security: { icon: '🛡️', label: 'Security', color: '#f59e0b' },
    refactor: { icon: '♻️', label: 'Refactor', color: '#3b82f6' },
}

const IMPACT_COLORS: Record<string, string> = {
    low: '#64748b',
    medium: '#3b82f6',
    high: '#f59e0b',
    critical: '#ef4444',
}

const EFFORT_COLORS: Record<string, string> = {
    trivial: '#10b981',
    small: '#22d3ee',
    medium: '#f59e0b',
    large: '#ef4444',
}

/* ───── Component ───── */
export default function AgentHubPage() {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])
    const [stats, setStats] = useState<Stats>({ pending: 0, approvedToday: 0, implemented: 0, total: 0, implementationRate: 0 })
    const [projects, setProjects] = useState<ProjectOption[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('pending')
    const [typeFilter, setTypeFilter] = useState('all')
    const [projectFilter, setProjectFilter] = useState('')
    const [expandedId, setExpandedId] = useState<string | null>(null)

    useEffect(() => { fetchData() }, [activeTab, typeFilter, projectFilter])

    const fetchData = async () => {
        try {
            const params = new URLSearchParams()
            if (activeTab !== 'all') params.set('status', activeTab)
            if (typeFilter !== 'all') params.set('type', typeFilter)
            if (projectFilter) params.set('projectId', projectFilter)

            const res = await fetch(`/api/admin/agent-hub?${params}`)
            if (res.ok) {
                const data = await res.json()
                setSuggestions(data.suggestions)
                setStats(data.stats)
                setProjects(data.projects)
            }
        } catch (error) {
            console.error('Failed to fetch agent hub:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAction = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/admin/agent-hub/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            })
            if (res.ok) {
                fetchData()
            }
        } catch (error) {
            console.error('Failed to update suggestion:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--neon-cyan)]" />
            </div>
        )
    }

    return (
        <div>
            <style>{styles}</style>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <span className="ah-logo">🤖</span>
                        Agent Hub
                    </h1>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        AI-предложения для улучшения проектов
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="ah-stat">
                    <span className="ah-stat-value" style={{ color: '#f59e0b' }}>{stats.pending}</span>
                    <span className="ah-stat-label">Pending</span>
                </div>
                <div className="ah-stat">
                    <span className="ah-stat-value" style={{ color: '#10b981' }}>{stats.approvedToday}</span>
                    <span className="ah-stat-label">Approved Today</span>
                </div>
                <div className="ah-stat">
                    <span className="ah-stat-value" style={{ color: '#22d3ee' }}>{stats.implemented}</span>
                    <span className="ah-stat-label">Implemented</span>
                </div>
                <div className="ah-stat">
                    <span className="ah-stat-value">{stats.implementationRate}%</span>
                    <span className="ah-stat-label">Implementation Rate</span>
                </div>
            </div>

            {/* Tabs + Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="ah-tabs">
                    {[
                        { key: 'pending', label: '⏳ Pending' },
                        { key: 'approved', label: '✅ Approved' },
                        { key: 'rejected', label: '❌ Rejected' },
                        { key: 'implemented', label: '🚀 Implemented' },
                        { key: 'all', label: '📋 All' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            className={`ah-tab ${activeTab === tab.key ? 'ah-tab--active' : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2 ml-auto">
                    <select
                        className="ah-select"
                        value={typeFilter}
                        onChange={e => setTypeFilter(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                            <option key={key} value={key}>{cfg.icon} {cfg.label}</option>
                        ))}
                    </select>
                    <select
                        className="ah-select"
                        value={projectFilter}
                        onChange={e => setProjectFilter(e.target.value)}
                    >
                        <option value="">All Projects</option>
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Suggestions List */}
            {suggestions.length === 0 ? (
                <div className="ah-empty">
                    <span className="text-4xl mb-3 block">🤖</span>
                    <p>No suggestions yet</p>
                    <p className="text-xs mt-1">AI agents will propose improvements here</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {suggestions.map(s => (
                        <SuggestionCard
                            key={s.id}
                            suggestion={s}
                            expanded={expandedId === s.id}
                            onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)}
                            onAction={handleAction}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

/* ───── Suggestion Card ───── */
function SuggestionCard({
    suggestion: s,
    expanded,
    onToggle,
    onAction,
}: {
    suggestion: Suggestion
    expanded: boolean
    onToggle: () => void
    onAction: (id: string, status: string) => void
}) {
    const typeConfig = TYPE_CONFIG[s.type] || { icon: '📋', label: s.type, color: '#94a3b8' }
    const impactColor = IMPACT_COLORS[s.impact] || '#94a3b8'
    const effortColor = EFFORT_COLORS[s.effort] || '#94a3b8'
    const timeAgo = formatTimeAgo(s.createdAt)

    return (
        <div className={`ah-card ah-card--${s.status}`}>
            {/* Card Header */}
            <div className="ah-card-header" onClick={onToggle} style={{ cursor: 'pointer' }}>
                <div className="ah-card-left">
                    <span className="ah-type-icon" style={{ color: typeConfig.color }}>
                        {typeConfig.icon}
                    </span>
                    <div>
                        <div className="ah-card-title">{s.title}</div>
                        <div className="ah-card-meta">
                            <span className="ah-project-tag">{s.project.title}</span>
                            <span className="ah-time">{timeAgo}</span>
                        </div>
                    </div>
                </div>
                <div className="ah-card-badges">
                    <span className="ah-badge" style={{ color: impactColor, borderColor: `${impactColor}40`, background: `${impactColor}15` }}>
                        Impact: {s.impact}
                    </span>
                    <span className="ah-badge" style={{ color: effortColor, borderColor: `${effortColor}40`, background: `${effortColor}15` }}>
                        Effort: {s.effort}
                    </span>
                    <span className="ah-type-badge" style={{ color: typeConfig.color, borderColor: `${typeConfig.color}40`, background: `${typeConfig.color}15` }}>
                        {typeConfig.label}
                    </span>
                </div>
            </div>

            {/* Expanded Content */}
            {expanded && (
                <div className="ah-card-body">
                    {/* Description */}
                    <div className="ah-section">
                        <div className="ah-section-label">Description</div>
                        <div className="ah-description">{s.description}</div>
                    </div>

                    {/* Reasoning */}
                    {s.reasoning && (
                        <div className="ah-section">
                            <div className="ah-section-label">💡 Reasoning</div>
                            <div className="ah-reasoning">{s.reasoning}</div>
                        </div>
                    )}

                    {/* Code Snippet */}
                    {s.codeSnippet && (
                        <div className="ah-section">
                            <div className="ah-section-label">💻 Code</div>
                            <pre className="ah-code"><code>{s.codeSnippet}</code></pre>
                        </div>
                    )}

                    {/* AI Model */}
                    {s.aiModel && (
                        <div className="ah-ai-model">
                            🧠 {s.aiModel}
                        </div>
                    )}

                    {/* Actions */}
                    {s.status === 'pending' && (
                        <div className="ah-actions">
                            <button
                                className="ah-action-btn ah-action-btn--approve"
                                onClick={() => onAction(s.id, 'approved')}
                            >
                                ✅ Approve
                            </button>
                            <button
                                className="ah-action-btn ah-action-btn--reject"
                                onClick={() => onAction(s.id, 'rejected')}
                            >
                                ❌ Reject
                            </button>
                        </div>
                    )}
                    {s.status === 'approved' && (
                        <div className="ah-actions">
                            <button
                                className="ah-action-btn ah-action-btn--implement"
                                onClick={() => onAction(s.id, 'implemented')}
                            >
                                🚀 Mark Implemented
                            </button>
                            <button
                                className="ah-action-btn ah-action-btn--reject"
                                onClick={() => onAction(s.id, 'rejected')}
                            >
                                ❌ Reject
                            </button>
                        </div>
                    )}
                    {(s.status === 'rejected' || s.status === 'implemented') && (
                        <div className="ah-actions">
                            <button
                                className="ah-action-btn ah-action-btn--reset"
                                onClick={() => onAction(s.id, 'pending')}
                            >
                                ↩️ Reset to Pending
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

/* ───── Helpers ───── */
function formatTimeAgo(dateStr: string): string {
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHrs = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHrs < 24) return `${diffHrs}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
}

/* ───── Styles ───── */
const styles = `
.ah-logo { font-size: 1.5rem; }

/* Stats */
.ah-stat {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 1rem; background: var(--bg-card); border: 1px solid var(--border-color);
    border-radius: 12px; transition: all 0.2s ease;
}
.ah-stat:hover { border-color: var(--border-hover); transform: translateY(-2px); }
.ah-stat-value { font-size: 1.8rem; font-weight: 800; font-family: 'JetBrains Mono', monospace; }
.ah-stat-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); }

/* Tabs */
.ah-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
.ah-tab {
    padding: 8px 14px; font-size: 0.8rem; font-weight: 500;
    background: var(--bg-card); border: 1px solid var(--border-color);
    border-radius: 8px; color: var(--text-secondary); cursor: pointer;
    transition: all 0.2s ease; white-space: nowrap;
}
.ah-tab:hover { border-color: var(--border-hover); color: var(--text-primary); }
.ah-tab--active { background: rgba(34,211,238,0.1); border-color: rgba(34,211,238,0.3); color: #22d3ee; }

/* Select */
.ah-select {
    padding: 8px 12px; font-size: 0.8rem;
    background: var(--bg-card); border: 1px solid var(--border-color);
    border-radius: 8px; color: var(--text-secondary); cursor: pointer;
    outline: none; transition: all 0.2s ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717A' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 8px center; padding-right: 28px;
}
.ah-select:focus { border-color: rgba(34,211,238,0.5); }

/* Card */
.ah-card {
    background: var(--bg-card); border: 1px solid var(--border-color);
    border-radius: 14px; overflow: hidden; transition: all 0.2s ease;
}
.ah-card:hover { border-color: var(--border-hover); }

.ah-card-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    padding: 1rem 1.25rem; gap: 1rem;
}
.ah-card-left { display: flex; align-items: flex-start; gap: 0.75rem; flex: 1; min-width: 0; }
.ah-type-icon { font-size: 1.25rem; flex-shrink: 0; margin-top: 2px; }
.ah-card-title { font-size: 0.95rem; font-weight: 600; }
.ah-card-meta { display: flex; align-items: center; gap: 8px; margin-top: 4px; flex-wrap: wrap; }
.ah-project-tag {
    font-size: 0.7rem; padding: 2px 8px; border-radius: 4px;
    background: rgba(123,97,255,0.1); color: var(--accent-primary);
    border: 1px solid rgba(123,97,255,0.2);
}
.ah-time { font-size: 0.7rem; color: var(--text-muted); }

.ah-card-badges { display: flex; gap: 6px; flex-shrink: 0; flex-wrap: wrap; }
.ah-badge, .ah-type-badge {
    font-size: 0.65rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.06em; padding: 3px 10px; border-radius: 20px;
    border: 1px solid; white-space: nowrap;
}

/* Card Body */
.ah-card-body {
    padding: 0 1.25rem 1.25rem;
    border-top: 1px solid var(--border-color); margin-top: 0;
    padding-top: 1rem;
}
.ah-section { margin-bottom: 1rem; }
.ah-section-label {
    font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: 6px;
}
.ah-description { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.65; white-space: pre-wrap; }
.ah-reasoning { font-size: 0.82rem; color: var(--text-secondary); line-height: 1.6; font-style: italic; }
.ah-code {
    background: var(--bg-secondary); border: 1px solid var(--border-color);
    border-radius: 10px; padding: 1rem; overflow-x: auto;
    font-family: 'JetBrains Mono', monospace; font-size: 0.78rem;
    line-height: 1.5; color: var(--text-primary);
}
.ah-ai-model {
    font-size: 0.72rem; color: var(--text-muted);
    font-family: 'JetBrains Mono', monospace;
    padding: 4px 0;
}

/* Actions */
.ah-actions { display: flex; gap: 8px; padding-top: 0.75rem; flex-wrap: wrap; }
.ah-action-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 10px 16px; font-size: 0.82rem; font-weight: 600;
    border-radius: 10px; cursor: pointer; transition: all 0.2s ease;
    border: 1px solid; min-width: 140px;
}
.ah-action-btn--approve {
    background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.3); color: #10b981;
}
.ah-action-btn--approve:hover { background: rgba(16,185,129,0.2); }
.ah-action-btn--reject {
    background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color: #ef4444;
}
.ah-action-btn--reject:hover { background: rgba(239,68,68,0.2); }
.ah-action-btn--implement {
    background: rgba(34,211,238,0.1); border-color: rgba(34,211,238,0.3); color: #22d3ee;
}
.ah-action-btn--implement:hover { background: rgba(34,211,238,0.2); }
.ah-action-btn--reset {
    background: rgba(148,163,184,0.1); border-color: rgba(148,163,184,0.3); color: #94a3b8;
}
.ah-action-btn--reset:hover { background: rgba(148,163,184,0.2); }

/* Empty */
.ah-empty {
    text-align: center; padding: 4rem 2rem; color: var(--text-muted);
    background: var(--bg-card); border: 1px solid var(--border-color);
    border-radius: 14px;
}

/* Responsive */
@media (max-width: 768px) {
    .ah-card-header { flex-direction: column; }
    .ah-card-badges { margin-top: 8px; }
    .ah-actions { flex-direction: column; }
    .ah-action-btn { min-width: auto; }
}
`
