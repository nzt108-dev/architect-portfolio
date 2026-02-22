'use client'

import { useState, useEffect, useCallback } from 'react'

// ── Types ──────────────────────────────────────────────
interface CrmTask {
    id: string
    title: string
    description: string
    type: string
    status: string
    priority: string
    dueDate: string | null
    order: number
    author: string
    createdAt: string
    updatedAt: string
    project: { title: string; slug: string }
}

interface Project {
    id: string
    title: string
    slug: string
    progress: number
    category: string
}

interface ActivityLog {
    id: string
    type: string
    title: string
    details: string
    author: string
    createdAt: string
    project: { title: string; slug: string } | null
}

// ── Constants ──────────────────────────────────────────
const STATUSES = [
    { key: 'backlog', label: 'Backlog', icon: '📥', color: 'bg-gray-500/15 text-gray-400 border-gray-500/30' },
    { key: 'todo', label: 'To Do', icon: '📋', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    { key: 'in-progress', label: 'In Progress', icon: '🔄', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    { key: 'review', label: 'Review', icon: '👀', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
    { key: 'done', label: 'Done', icon: '✅', color: 'bg-green-500/15 text-green-400 border-green-500/30' },
]

const TYPES: Record<string, { label: string; icon: string; color: string }> = {
    task: { label: 'Task', icon: '✅', color: 'text-blue-400' },
    milestone: { label: 'Milestone', icon: '🏆', color: 'text-amber-400' },
    bug: { label: 'Bug', icon: '🐛', color: 'text-red-400' },
    feature: { label: 'Feature', icon: '✨', color: 'text-emerald-400' },
}

const PRIORITIES: Record<string, { label: string; color: string; dot: string }> = {
    low: { label: 'Low', color: 'bg-gray-500/15 text-gray-400 border-gray-500/30', dot: 'bg-gray-400' },
    medium: { label: 'Medium', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30', dot: 'bg-blue-400' },
    high: { label: 'High', color: 'bg-orange-500/15 text-orange-400 border-orange-500/30', dot: 'bg-orange-400' },
    urgent: { label: 'Urgent', color: 'bg-red-500/15 text-red-400 border-red-500/30', dot: 'bg-red-400' },
}

const ACTIVITY_BADGES: Record<string, { label: string; icon: string; color: string }> = {
    push: { label: 'Push', icon: '🔀', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    task: { label: 'Task', icon: '✅', color: 'bg-green-500/15 text-green-400 border-green-500/30' },
    note: { label: 'Note', icon: '📝', color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
    deploy: { label: 'Deploy', icon: '🚀', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
    milestone: { label: 'Milestone', icon: '🏆', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
}

// ── Main Component ─────────────────────────────────────
export default function CrmPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [selectedProject, setSelectedProject] = useState('')
    const [tasks, setTasks] = useState<CrmTask[]>([])
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
    const [activeTab, setActiveTab] = useState<'kanban' | 'metrics' | 'activity'>('kanban')
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingTask, setEditingTask] = useState<CrmTask | null>(null)

    // Fetch projects
    useEffect(() => {
        fetch('/api/projects')
            .then(res => res.json())
            .then(data => {
                setProjects(data)
                if (data.length > 0) setSelectedProject(data[0].slug)
            })
            .catch(console.error)
    }, [])

    // Fetch tasks when project changes
    const fetchTasks = useCallback(async () => {
        if (!selectedProject) return
        setIsLoading(true)
        try {
            const res = await fetch(`/api/admin/crm/tasks?projectSlug=${selectedProject}`)
            if (res.ok) {
                const data = await res.json()
                setTasks(data.tasks)
            }
        } catch (err) {
            console.error('Failed to fetch tasks:', err)
        } finally {
            setIsLoading(false)
        }
    }, [selectedProject])

    // Fetch activity logs
    const fetchActivity = useCallback(async () => {
        if (!selectedProject) return
        try {
            const res = await fetch(`/api/admin/activity?projectSlug=${selectedProject}&limit=50`)
            if (res.ok) {
                const data = await res.json()
                setActivityLogs(data.logs)
            }
        } catch (err) {
            console.error('Failed to fetch activity:', err)
        }
    }, [selectedProject])

    useEffect(() => {
        fetchTasks()
        fetchActivity()
    }, [fetchTasks, fetchActivity])

    // Move task to new status
    const moveTask = async (taskId: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/crm/tasks', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: taskId, status: newStatus }),
            })
            if (res.ok) {
                setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
            }
        } catch (err) {
            console.error('Failed to move task:', err)
        }
    }

    // Delete task
    const deleteTask = async (taskId: string) => {
        try {
            const res = await fetch(`/api/admin/crm/tasks?id=${taskId}`, { method: 'DELETE' })
            if (res.ok) {
                setTasks(prev => prev.filter(t => t.id !== taskId))
            }
        } catch (err) {
            console.error('Failed to delete task:', err)
        }
    }

    // Format time
    const formatDate = (dateStr: string) => {
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
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    const isDueSoon = (dueDate: string | null) => {
        if (!dueDate) return false
        const due = new Date(dueDate)
        const now = new Date()
        const diffDays = (due.getTime() - now.getTime()) / 86400000
        return diffDays <= 3 && diffDays >= 0
    }

    const isOverdue = (dueDate: string | null) => {
        if (!dueDate) return false
        return new Date(dueDate) < new Date()
    }

    // Stats
    const tasksByStatus = STATUSES.reduce((acc, s) => {
        acc[s.key] = tasks.filter(t => t.status === s.key).length
        return acc
    }, {} as Record<string, number>)

    const tasksByType = Object.keys(TYPES).reduce((acc, t) => {
        acc[t] = tasks.filter(task => task.type === t).length
        return acc
    }, {} as Record<string, number>)

    const tasksByPriority = Object.keys(PRIORITIES).reduce((acc, p) => {
        acc[p] = tasks.filter(task => task.priority === p).length
        return acc
    }, {} as Record<string, number>)

    const completionRate = tasks.length > 0
        ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100)
        : 0

    const milestones = tasks.filter(t => t.type === 'milestone')
    const doneMilestones = milestones.filter(t => t.status === 'done').length

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Project CRM</h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                        Kanban board, metrics & activity tracking
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={selectedProject}
                        onChange={e => setSelectedProject(e.target.value)}
                        className="cyber-input text-sm w-56"
                    >
                        {projects.map(p => (
                            <option key={p.id} value={p.slug}>{p.title}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => { setEditingTask(null); setShowModal(true) }}
                        className="cyber-btn text-sm whitespace-nowrap"
                    >
                        + New Task
                    </button>
                </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                <div className="cyber-card p-3 text-center">
                    <div className="text-2xl font-bold">{tasks.length}</div>
                    <div className="text-[var(--text-muted)] text-xs">Total Tasks</div>
                </div>
                <div className="cyber-card p-3 text-center">
                    <div className="text-2xl font-bold text-amber-400">{tasksByStatus['in-progress']}</div>
                    <div className="text-[var(--text-muted)] text-xs">In Progress</div>
                </div>
                <div className="cyber-card p-3 text-center">
                    <div className="text-2xl font-bold text-green-400">{tasksByStatus['done']}</div>
                    <div className="text-[var(--text-muted)] text-xs">Completed</div>
                </div>
                <div className="cyber-card p-3 text-center">
                    <div className="text-2xl font-bold text-[var(--neon-cyan)]">{completionRate}%</div>
                    <div className="text-[var(--text-muted)] text-xs">Completion</div>
                </div>
                <div className="cyber-card p-3 text-center">
                    <div className="text-2xl font-bold text-amber-400">
                        {doneMilestones}/{milestones.length}
                    </div>
                    <div className="text-[var(--text-muted)] text-xs">Milestones</div>
                </div>
                <div className="cyber-card p-3 text-center">
                    <div className="text-2xl font-bold text-red-400">
                        {tasks.filter(t => isOverdue(t.dueDate) && t.status !== 'done').length}
                    </div>
                    <div className="text-[var(--text-muted)] text-xs">Overdue</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] w-fit">
                {[
                    { key: 'kanban' as const, label: '📋 Kanban' },
                    { key: 'metrics' as const, label: '📊 Metrics' },
                    { key: 'activity' as const, label: '📜 Activity' },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key
                                ? 'bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/30'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {isLoading ? (
                <div className="text-center py-12 text-[var(--text-muted)]">Loading...</div>
            ) : activeTab === 'kanban' ? (
                <KanbanBoard
                    tasks={tasks}
                    onMove={moveTask}
                    onEdit={(task) => { setEditingTask(task); setShowModal(true) }}
                    onDelete={deleteTask}
                    formatDate={formatDate}
                    isDueSoon={isDueSoon}
                    isOverdue={isOverdue}
                />
            ) : activeTab === 'metrics' ? (
                <MetricsPanel
                    tasks={tasks}
                    tasksByStatus={tasksByStatus}
                    tasksByType={tasksByType}
                    tasksByPriority={tasksByPriority}
                    completionRate={completionRate}
                    milestones={milestones}
                    doneMilestones={doneMilestones}
                />
            ) : (
                <ActivityTimeline logs={activityLogs} formatDate={formatDate} />
            )}

            {/* Modal */}
            {showModal && (
                <TaskModal
                    task={editingTask}
                    projectSlug={selectedProject}
                    onClose={() => { setShowModal(false); setEditingTask(null) }}
                    onSave={() => { setShowModal(false); setEditingTask(null); fetchTasks() }}
                />
            )}
        </div>
    )
}

// ── Kanban Board ───────────────────────────────────────
function KanbanBoard({
    tasks,
    onMove,
    onEdit,
    onDelete,
    formatDate,
    isDueSoon,
    isOverdue,
}: {
    tasks: CrmTask[]
    onMove: (id: string, status: string) => void
    onEdit: (task: CrmTask) => void
    onDelete: (id: string) => void
    formatDate: (d: string) => string
    isDueSoon: (d: string | null) => boolean
    isOverdue: (d: string | null) => boolean
}) {
    return (
        <div className="grid grid-cols-5 gap-3" style={{ minHeight: '60vh' }}>
            {STATUSES.map((col, colIdx) => {
                const colTasks = tasks.filter(t => t.status === col.key)
                return (
                    <div key={col.key} className="flex flex-col">
                        {/* Column header */}
                        <div className={`flex items-center justify-between px-3 py-2 rounded-xl mb-3 border ${col.color}`}>
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <span>{col.icon}</span>
                                <span>{col.label}</span>
                            </div>
                            <span className="text-xs opacity-70">{colTasks.length}</span>
                        </div>

                        {/* Cards */}
                        <div className="flex-1 space-y-2 overflow-y-auto pr-1" style={{ maxHeight: '65vh' }}>
                            {colTasks.map(task => {
                                const typeInfo = TYPES[task.type] || TYPES.task
                                const priorityInfo = PRIORITIES[task.priority] || PRIORITIES.medium
                                const overdue = isOverdue(task.dueDate) && task.status !== 'done'
                                const dueSoon = isDueSoon(task.dueDate) && task.status !== 'done'

                                return (
                                    <div
                                        key={task.id}
                                        className={`rounded-xl p-3 border transition-all hover:border-[var(--border-hover)] cursor-pointer ${overdue
                                                ? 'bg-red-500/5 border-red-500/20'
                                                : 'bg-[var(--bg-card)] border-[var(--border-color)]'
                                            }`}
                                        onClick={() => onEdit(task)}
                                    >
                                        {/* Type + Priority */}
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-xs ${typeInfo.color}`}>
                                                {typeInfo.icon} {typeInfo.label}
                                            </span>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${priorityInfo.color}`}>
                                                {priorityInfo.label}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h4 className="text-sm font-medium mb-2 line-clamp-2">{task.title}</h4>

                                        {/* Description preview */}
                                        {task.description && (
                                            <p className="text-[var(--text-muted)] text-xs mb-2 line-clamp-2">
                                                {task.description}
                                            </p>
                                        )}

                                        {/* Due date */}
                                        {task.dueDate && (
                                            <div className={`text-xs mb-2 ${overdue ? 'text-red-400 font-medium' :
                                                    dueSoon ? 'text-amber-400' : 'text-[var(--text-muted)]'
                                                }`}>
                                                {overdue ? '⚠️' : '📅'} {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
                                            <span className="text-[10px] text-[var(--text-muted)]">
                                                {formatDate(task.createdAt)}
                                            </span>
                                            <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                                {colIdx > 0 && (
                                                    <button
                                                        onClick={() => onMove(task.id, STATUSES[colIdx - 1].key)}
                                                        className="w-6 h-6 rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs transition-all flex items-center justify-center"
                                                        title={`Move to ${STATUSES[colIdx - 1].label}`}
                                                    >
                                                        ←
                                                    </button>
                                                )}
                                                {colIdx < STATUSES.length - 1 && (
                                                    <button
                                                        onClick={() => onMove(task.id, STATUSES[colIdx + 1].key)}
                                                        className="w-6 h-6 rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs transition-all flex items-center justify-center"
                                                        title={`Move to ${STATUSES[colIdx + 1].label}`}
                                                    >
                                                        →
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => onDelete(task.id)}
                                                    className="w-6 h-6 rounded-md bg-[var(--bg-secondary)] hover:bg-red-500/20 text-[var(--text-muted)] hover:text-red-400 text-xs transition-all flex items-center justify-center"
                                                    title="Delete"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Empty state */}
                            {colTasks.length === 0 && (
                                <div className="flex items-center justify-center h-24 rounded-xl border border-dashed border-[var(--border-color)] text-[var(--text-muted)] text-xs">
                                    No tasks
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

// ── Metrics Panel ──────────────────────────────────────
function MetricsPanel({
    tasks,
    tasksByStatus,
    tasksByType,
    tasksByPriority,
    completionRate,
    milestones,
    doneMilestones,
}: {
    tasks: CrmTask[]
    tasksByStatus: Record<string, number>
    tasksByType: Record<string, number>
    tasksByPriority: Record<string, number>
    completionRate: number
    milestones: CrmTask[]
    doneMilestones: number
}) {
    const maxStatusCount = Math.max(...Object.values(tasksByStatus), 1)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Completion ring */}
            <div className="cyber-card p-6">
                <h3 className="font-semibold mb-4">Overall Progress</h3>
                <div className="flex items-center gap-8">
                    <div className="relative w-28 h-28">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-color)" strokeWidth="8" />
                            <circle
                                cx="50" cy="50" r="42" fill="none"
                                stroke="var(--neon-cyan)" strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${completionRate * 2.64} 264`}
                                className="transition-all duration-700"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold">{completionRate}%</span>
                        </div>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div>Total: <b>{tasks.length}</b> tasks</div>
                        <div>Done: <b className="text-green-400">{tasksByStatus['done']}</b></div>
                        <div>Active: <b className="text-amber-400">{tasksByStatus['in-progress']}</b></div>
                        <div>Blocked: <b className="text-purple-400">{tasksByStatus['review']}</b></div>
                    </div>
                </div>
            </div>

            {/* Status distribution */}
            <div className="cyber-card p-6">
                <h3 className="font-semibold mb-4">Tasks by Status</h3>
                <div className="space-y-3">
                    {STATUSES.map(s => (
                        <div key={s.key}>
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span>{s.icon} {s.label}</span>
                                <span className="text-[var(--text-muted)]">{tasksByStatus[s.key]}</span>
                            </div>
                            <div className="w-full h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] transition-all duration-500"
                                    style={{ width: `${(tasksByStatus[s.key] / maxStatusCount) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Type breakdown */}
            <div className="cyber-card p-6">
                <h3 className="font-semibold mb-4">Tasks by Type</h3>
                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(TYPES).map(([key, info]) => (
                        <div key={key} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)]">
                            <span className="text-2xl">{info.icon}</span>
                            <div>
                                <div className="text-xl font-bold">{tasksByType[key]}</div>
                                <div className="text-xs text-[var(--text-muted)]">{info.label}s</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Priority breakdown */}
            <div className="cyber-card p-6">
                <h3 className="font-semibold mb-4">Priority Distribution</h3>
                <div className="space-y-3">
                    {Object.entries(PRIORITIES).map(([key, info]) => (
                        <div key={key} className="flex items-center gap-3">
                            <span className={`w-2.5 h-2.5 rounded-full ${info.dot}`} />
                            <span className="text-sm flex-grow">{info.label}</span>
                            <span className="text-sm font-medium">{tasksByPriority[key]}</span>
                            <div className="w-20 h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${info.dot} transition-all duration-500`}
                                    style={{ width: tasks.length > 0 ? `${(tasksByPriority[key] / tasks.length) * 100}%` : '0%' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Milestones timeline */}
            <div className="cyber-card p-6 md:col-span-2">
                <h3 className="font-semibold mb-4">
                    🏆 Milestones ({doneMilestones}/{milestones.length})
                </h3>
                {milestones.length === 0 ? (
                    <p className="text-[var(--text-muted)] text-sm">No milestones yet</p>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {milestones.map(m => (
                            <div
                                key={m.id}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm ${m.status === 'done'
                                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                        : m.status === 'in-progress'
                                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                            : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)]'
                                    }`}
                            >
                                <span>{m.status === 'done' ? '✅' : m.status === 'in-progress' ? '🔄' : '⏳'}</span>
                                <span>{m.title}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// ── Activity Timeline ──────────────────────────────────
function ActivityTimeline({
    logs,
    formatDate,
}: {
    logs: ActivityLog[]
    formatDate: (d: string) => string
}) {
    // Group by date
    const groupedLogs: Record<string, ActivityLog[]> = {}
    logs.forEach(log => {
        const dateKey = new Date(log.createdAt).toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric',
        })
        if (!groupedLogs[dateKey]) groupedLogs[dateKey] = []
        groupedLogs[dateKey].push(log)
    })

    if (logs.length === 0) {
        return (
            <div className="cyber-card p-12 text-center">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-lg font-medium mb-2">No activity yet</h3>
                <p className="text-[var(--text-muted)] text-sm">
                    Activities will appear here when you or your agents push code, complete tasks, or add notes.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {Object.entries(groupedLogs).map(([date, dateLogs]) => (
                <div key={date}>
                    <h3 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">
                        {date}
                    </h3>
                    <div className="space-y-2">
                        {dateLogs.map(log => {
                            const badge = ACTIVITY_BADGES[log.type] || ACTIVITY_BADGES.note
                            return (
                                <div
                                    key={log.id}
                                    className="flex items-start gap-4 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--border-hover)] transition-colors"
                                >
                                    <span className={`text-xs font-medium px-2 py-1 rounded-md border whitespace-nowrap ${badge.color}`}>
                                        {badge.icon} {badge.label}
                                    </span>
                                    <div className="flex-grow min-w-0">
                                        <span className="font-medium text-sm">{log.title}</span>
                                        {log.details && (
                                            <p className="text-[var(--text-muted)] text-xs mt-1 line-clamp-2">
                                                {log.details}
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-xs text-[var(--text-muted)] flex-shrink-0">
                                        {formatDate(log.createdAt)}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}

// ── Task Modal ─────────────────────────────────────────
function TaskModal({
    task,
    projectSlug,
    onClose,
    onSave,
}: {
    task: CrmTask | null
    projectSlug: string
    onClose: () => void
    onSave: () => void
}) {
    const [title, setTitle] = useState(task?.title || '')
    const [description, setDescription] = useState(task?.description || '')
    const [type, setType] = useState(task?.type || 'task')
    const [status, setStatus] = useState(task?.status || 'backlog')
    const [priority, setPriority] = useState(task?.priority || 'medium')
    const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.split('T')[0] : '')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return

        setIsSubmitting(true)
        try {
            if (task) {
                // Update
                await fetch('/api/admin/crm/tasks', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: task.id,
                        title,
                        description,
                        type,
                        status,
                        priority,
                        dueDate: dueDate || null,
                    }),
                })
            } else {
                // Create
                await fetch('/api/admin/crm/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        projectSlug,
                        title,
                        description,
                        type,
                        status,
                        priority,
                        dueDate: dueDate || null,
                    }),
                })
            }
            onSave()
        } catch (err) {
            console.error('Failed to save task:', err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div
                className="w-full max-w-lg mx-4 cyber-card p-6 neon-border"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold">{task ? 'Edit Task' : 'New Task'}</h2>
                    <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xl">×</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="cyber-input text-sm"
                            placeholder="Task title"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="cyber-input text-sm min-h-[80px] resize-none"
                            placeholder="Details..."
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Type</label>
                            <select value={type} onChange={e => setType(e.target.value)} className="cyber-input text-sm">
                                <option value="task">✅ Task</option>
                                <option value="milestone">🏆 Milestone</option>
                                <option value="bug">🐛 Bug</option>
                                <option value="feature">✨ Feature</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Status</label>
                            <select value={status} onChange={e => setStatus(e.target.value)} className="cyber-input text-sm">
                                {STATUSES.map(s => (
                                    <option key={s.key} value={s.key}>{s.icon} {s.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Priority</label>
                            <select value={priority} onChange={e => setPriority(e.target.value)} className="cyber-input text-sm">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Due Date</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={e => setDueDate(e.target.value)}
                            className="cyber-input text-sm"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-filled text-sm px-6 py-2.5 flex-1"
                        >
                            {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="cyber-btn text-sm px-6 py-2.5"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
