'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

/* ───── Types ───── */
interface RoadmapItem {
    id: string; title: string; status: string; order: number
}
interface ActivityLog {
    id: string; type: string; title: string; details: string; author: string; createdAt: string
}
interface CrmTask {
    id: string; title: string; description: string; type: string
    status: string; priority: string; dueDate: string | null; createdAt: string
}
interface AgentSuggestion {
    id: string; type: string; title: string; description: string
    impact: string; effort: string; status: string; aiModel: string; createdAt: string
}
interface ProjectDetail {
    id: string; title: string; slug: string; description: string
    category: string; progress: number; status: string
    stack: string[]; services: string[]; technologies: string[]
    githubUrl: string | null; demoUrl: string | null; deployUrl: string; backendUrl: string
    localPath: string; lastCommit: { hash: string; message: string; date: string | null } | null
    roadmapItems: RoadmapItem[]
    activityLogs: ActivityLog[]
    crmTasks: CrmTask[]
    agentSuggestions: AgentSuggestion[]
}

/* ───── Constants ───── */
const CATEGORY_ICONS: Record<string, string> = {
    mobile: '📱', web: '🌐', telegram: '🤖', saas: '☁️', discord: '🎮',
}
const STATUS_COLORS: Record<string, string> = {
    active: '#10b981', paused: '#f59e0b', done: '#22d3ee', idea: '#a855f7',
}
const TASK_STATUS_ORDER = ['in-progress', 'todo', 'backlog', 'review', 'done']

/* ───── Component ───── */
export default function ProjectDetailPage() {
    const params = useParams()
    const slug = params.slug as string
    const [project, setProject] = useState<ProjectDetail | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        if (!slug) return
        fetch(`/api/admin/workspaces/${slug}`)
            .then(res => res.json())
            .then(data => setProject(data.project))
            .catch(console.error)
            .finally(() => setIsLoading(false))
    }, [slug])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--neon-cyan)]" />
            </div>
        )
    }

    if (!project) {
        return (
            <div className="text-center py-20 text-[var(--text-muted)]">
                <p className="text-4xl mb-4">🔍</p>
                <p>Project not found</p>
                <Link href="/admin/workspaces" className="text-[var(--neon-cyan)] text-sm mt-2 block">
                    ← Back to Workspaces
                </Link>
            </div>
        )
    }

    const icon = CATEGORY_ICONS[project.category] || '📁'
    const statusColor = STATUS_COLORS[project.status] || '#94a3b8'

    return (
        <div>
            <style>{styles}</style>

            {/* Breadcrumb */}
            <Link href="/admin/workspaces" className="text-sm text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors">
                ← Workspaces
            </Link>

            {/* Header */}
            <div className="pd-header">
                <div className="pd-header-top">
                    <div className="pd-title-row">
                        <span className="pd-icon">{icon}</span>
                        <h1 className="pd-title">{project.title}</h1>
                        <span
                            className="pd-status"
                            style={{ color: statusColor, borderColor: `${statusColor}40`, background: `${statusColor}15` }}
                        >
                            {project.status}
                        </span>
                    </div>
                    <p className="pd-desc">{project.description}</p>
                </div>

                {/* Stack & Links */}
                <div className="pd-meta">
                    {project.stack.length > 0 && (
                        <div className="pd-badges">
                            {project.stack.map(s => (
                                <span key={s} className="pd-badge pd-badge--stack">{s}</span>
                            ))}
                        </div>
                    )}
                    <div className="pd-links">
                        {project.deployUrl && (
                            <a href={project.deployUrl} target="_blank" rel="noreferrer" className="pd-link">
                                🌐 {new URL(project.deployUrl).hostname}
                            </a>
                        )}
                        {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="pd-link">
                                🐙 GitHub
                            </a>
                        )}
                        {project.backendUrl && (
                            <a href={project.backendUrl} target="_blank" rel="noreferrer" className="pd-link">
                                ⚙️ Backend
                            </a>
                        )}
                    </div>
                </div>

                {/* Last Commit */}
                {project.lastCommit && (
                    <div className="pd-commit">
                        <span className="pd-commit-hash">{project.lastCommit.hash}</span>
                        <span className="pd-commit-msg">{project.lastCommit.message}</span>
                        {project.lastCommit.date && (
                            <span className="pd-commit-date">{formatTimeAgo(project.lastCommit.date)}</span>
                        )}
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="pd-tabs">
                {[
                    { key: 'overview', label: '📊 Overview' },
                    { key: 'tasks', label: `📋 Tasks (${project.crmTasks.length})` },
                    { key: 'agent', label: `🤖 Agent (${project.agentSuggestions.length})` },
                    { key: 'activity', label: `📜 Activity (${project.activityLogs.length})` },
                ].map(tab => (
                    <button
                        key={tab.key}
                        className={`pd-tab ${activeTab === tab.key ? 'pd-tab--active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && <OverviewTab project={project} />}
            {activeTab === 'tasks' && <TasksTab tasks={project.crmTasks} />}
            {activeTab === 'agent' && <AgentTab suggestions={project.agentSuggestions} />}
            {activeTab === 'activity' && <ActivityTab logs={project.activityLogs} />}
        </div>
    )
}

/* ───── Overview Tab ───── */
function OverviewTab({ project }: { project: ProjectDetail }) {
    const doneRoadmap = project.roadmapItems.filter(r => r.status === 'done').length
    const totalRoadmap = project.roadmapItems.length

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            {/* Progress */}
            <div className="cyber-card p-5">
                <h3 className="font-semibold mb-4">📈 Progress</h3>
                <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl font-bold font-mono text-[var(--neon-cyan)]">
                        {project.progress}%
                    </div>
                    <div className="flex-grow">
                        <div className="w-full h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                    width: `${project.progress}%`,
                                    background: project.progress >= 80
                                        ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                                        : project.progress >= 40
                                            ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                            : 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Roadmap */}
            <div className="cyber-card p-5">
                <h3 className="font-semibold mb-4">
                    🗺️ Roadmap
                    <span className="text-xs text-[var(--text-muted)] ml-2">
                        {doneRoadmap}/{totalRoadmap} done
                    </span>
                </h3>
                {project.roadmapItems.length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)]">No roadmap items</p>
                ) : (
                    <div className="space-y-2">
                        {project.roadmapItems.map(item => {
                            const statusIcon = item.status === 'done' ? '✅' :
                                item.status === 'in-progress' ? '🔄' : '📌'
                            return (
                                <div key={item.id} className="flex items-center gap-3 py-1.5">
                                    <span className="text-sm">{statusIcon}</span>
                                    <span className={`text-sm ${item.status === 'done' ? 'text-[var(--text-muted)] line-through' : ''}`}>
                                        {item.title}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Recent Activity */}
            <div className="cyber-card p-5 lg:col-span-2">
                <h3 className="font-semibold mb-4">📜 Recent Activity</h3>
                {project.activityLogs.length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)]">No activity yet</p>
                ) : (
                    <div className="space-y-1">
                        {project.activityLogs.slice(0, 10).map(log => {
                            const icons: Record<string, string> = {
                                push: '🔀', task: '✅', note: '📝', deploy: '🚀', milestone: '🏆'
                            }
                            return (
                                <div key={log.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-all">
                                    <span className="text-sm">{icons[log.type] || '📋'}</span>
                                    <span className="text-sm flex-grow truncate">{log.title}</span>
                                    <span className="text-[10px] text-[var(--text-muted)]">{formatTimeAgo(log.createdAt)}</span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

/* ───── Tasks Tab ───── */
function TasksTab({ tasks }: { tasks: CrmTask[] }) {
    const sorted = [...tasks].sort((a, b) => {
        const ai = TASK_STATUS_ORDER.indexOf(a.status)
        const bi = TASK_STATUS_ORDER.indexOf(b.status)
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
    })

    const priorityColors: Record<string, string> = {
        urgent: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#64748b',
    }
    const statusIcons: Record<string, string> = {
        'in-progress': '🔄', todo: '📌', backlog: '📥', review: '👀', done: '✅',
    }

    return (
        <div className="mt-4">
            {sorted.length === 0 ? (
                <div className="text-center py-10 text-[var(--text-muted)]">No tasks</div>
            ) : (
                <div className="space-y-2">
                    {sorted.map(task => (
                        <div key={task.id} className="cyber-card p-4 flex items-start gap-3">
                            <span className="text-lg">{statusIcons[task.status] || '📋'}</span>
                            <div className="flex-grow min-w-0">
                                <div className="font-medium text-sm">{task.title}</div>
                                {task.description && (
                                    <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{task.description}</p>
                                )}
                                <div className="flex gap-2 mt-2">
                                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded"
                                        style={{ color: priorityColors[task.priority], background: `${priorityColors[task.priority]}15` }}>
                                        {task.priority}
                                    </span>
                                    <span className="text-[10px] text-[var(--text-muted)]">{task.status}</span>
                                    {task.dueDate && (
                                        <span className="text-[10px] text-[var(--text-muted)]">
                                            Due: {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

/* ───── Agent Tab ───── */
function AgentTab({ suggestions }: { suggestions: AgentSuggestion[] }) {
    const typeIcons: Record<string, string> = {
        optimization: '⚡', feature: '✨', bug: '🐛', security: '🛡️', refactor: '♻️',
    }
    const impactColors: Record<string, string> = {
        low: '#64748b', medium: '#3b82f6', high: '#f59e0b', critical: '#ef4444',
    }
    const statusColors: Record<string, string> = {
        pending: '#f59e0b', approved: '#10b981', rejected: '#ef4444', implemented: '#22d3ee',
    }

    return (
        <div className="mt-4">
            {suggestions.length === 0 ? (
                <div className="text-center py-10 text-[var(--text-muted)]">
                    <span className="text-3xl block mb-2">🤖</span>
                    No agent suggestions for this project
                </div>
            ) : (
                <div className="space-y-2">
                    {suggestions.map(s => (
                        <div key={s.id} className="cyber-card p-4">
                            <div className="flex items-start gap-3">
                                <span className="text-lg">{typeIcons[s.type] || '📋'}</span>
                                <div className="flex-grow min-w-0">
                                    <div className="font-medium text-sm">{s.title}</div>
                                    <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{s.description}</p>
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded border"
                                            style={{
                                                color: statusColors[s.status],
                                                borderColor: `${statusColors[s.status]}40`,
                                                background: `${statusColors[s.status]}15`,
                                            }}>
                                            {s.status}
                                        </span>
                                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded"
                                            style={{ color: impactColors[s.impact], background: `${impactColors[s.impact]}15` }}>
                                            Impact: {s.impact}
                                        </span>
                                        {s.aiModel && (
                                            <span className="text-[10px] text-[var(--text-muted)] font-mono">
                                                🧠 {s.aiModel}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className="text-[10px] text-[var(--text-muted)] flex-shrink-0">
                                    {formatTimeAgo(s.createdAt)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

/* ───── Activity Tab ───── */
function ActivityTab({ logs }: { logs: ActivityLog[] }) {
    const icons: Record<string, string> = {
        push: '🔀', task: '✅', note: '📝', deploy: '🚀', milestone: '🏆',
    }

    return (
        <div className="mt-4 cyber-card p-5">
            {logs.length === 0 ? (
                <div className="text-center py-10 text-[var(--text-muted)]">No activity</div>
            ) : (
                <div className="space-y-1">
                    {logs.map(log => (
                        <div key={log.id} className="flex items-start gap-3 py-3 px-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-all border-b border-[var(--border-color)] last:border-0">
                            <span className="text-sm mt-0.5">{icons[log.type] || '📋'}</span>
                            <div className="flex-grow min-w-0">
                                <div className="text-sm font-medium">{log.title}</div>
                                {log.details && (
                                    <p className="text-xs text-[var(--text-muted)] mt-1">{log.details}</p>
                                )}
                            </div>
                            <div className="flex-shrink-0 text-right">
                                <div className="text-[10px] text-[var(--text-muted)]">{formatTimeAgo(log.createdAt)}</div>
                                <div className="text-[10px] text-[var(--text-muted)] capitalize">{log.author}</div>
                            </div>
                        </div>
                    ))}
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
    if (diffMins < 60) return `${diffMins}m`
    if (diffHrs < 24) return `${diffHrs}h`
    if (diffDays < 7) return `${diffDays}d`
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

/* ───── Styles ───── */
const styles = `
.pd-header {
    margin-top: 1rem; padding: 1.5rem;
    background: var(--bg-card); border: 1px solid var(--border-color);
    border-radius: 14px; margin-bottom: 1rem;
}
.pd-header-top { margin-bottom: 1rem; }
.pd-title-row { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.pd-icon { font-size: 1.5rem; }
.pd-title { font-size: 1.5rem; font-weight: 700; }
.pd-status {
    font-size: 0.65rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.06em; padding: 3px 10px; border-radius: 20px;
    border: 1px solid;
}
.pd-desc { font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem; line-height: 1.6; }

.pd-meta { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; }
.pd-badges { display: flex; flex-wrap: wrap; gap: 4px; }
.pd-badge {
    font-size: 0.7rem; font-weight: 500; padding: 3px 10px; border-radius: 6px;
    font-family: 'JetBrains Mono', monospace;
}
.pd-badge--stack {
    background: rgba(59,130,246,0.1); color: #3b82f6; border: 1px solid rgba(59,130,246,0.2);
}
.pd-links { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.pd-link {
    font-size: 0.72rem; color: #22d3ee; font-family: 'JetBrains Mono', monospace;
    padding: 3px 8px; border-radius: 6px; background: rgba(34,211,238,0.05);
    border: 1px solid rgba(34,211,238,0.15); text-decoration: none; transition: all 0.2s;
}
.pd-link:hover { background: rgba(34,211,238,0.1); }

.pd-commit {
    display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem;
    font-size: 0.72rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;
    padding-top: 0.75rem; border-top: 1px solid var(--border-color);
}
.pd-commit-hash { color: #22d3ee; }
.pd-commit-msg { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pd-commit-date { flex-shrink: 0; }

/* Tabs */
.pd-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
.pd-tab {
    padding: 10px 16px; font-size: 0.82rem; font-weight: 500;
    background: var(--bg-card); border: 1px solid var(--border-color);
    border-radius: 10px; color: var(--text-secondary); cursor: pointer;
    transition: all 0.2s ease; white-space: nowrap;
}
.pd-tab:hover { border-color: var(--border-hover); color: var(--text-primary); }
.pd-tab--active { background: rgba(34,211,238,0.1); border-color: rgba(34,211,238,0.3); color: #22d3ee; }

/* Cyber card used in tabs */
.cyber-card {
    background: var(--bg-card); border: 1px solid var(--border-color);
    border-radius: 14px; transition: all 0.2s ease;
}
.cyber-card:hover { border-color: var(--border-hover); }

@media (max-width: 768px) {
    .pd-header { padding: 1rem; }
    .pd-title { font-size: 1.2rem; }
    .pd-tabs { overflow-x: auto; flex-wrap: nowrap; }
}
`
