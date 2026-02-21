'use client'

import { useState, useEffect, useCallback } from 'react'

interface ActivityLog {
    id: string
    type: string
    title: string
    details: string
    author: string
    createdAt: string
    project: { title: string; slug: string } | null
}

interface Project {
    id: string
    title: string
    slug: string
}

const TYPE_BADGES: Record<string, { label: string; icon: string; color: string }> = {
    push: { label: 'Push', icon: '🔀', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    task: { label: 'Task', icon: '✅', color: 'bg-green-500/15 text-green-400 border-green-500/30' },
    note: { label: 'Note', icon: '📝', color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
    deploy: { label: 'Deploy', icon: '🚀', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
    milestone: { label: 'Milestone', icon: '🏆', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
}

export default function ActivityPage() {
    const [logs, setLogs] = useState<ActivityLog[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [filterProject, setFilterProject] = useState('')
    const [filterType, setFilterType] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    // Add note form
    const [showAddNote, setShowAddNote] = useState(false)
    const [noteTitle, setNoteTitle] = useState('')
    const [noteDetails, setNoteDetails] = useState('')
    const [noteProject, setNoteProject] = useState('')
    const [noteType, setNoteType] = useState('note')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchLogs = useCallback(async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (filterProject) params.set('projectSlug', filterProject)
            if (filterType) params.set('type', filterType)
            params.set('limit', '50')

            const res = await fetch(`/api/admin/activity?${params}`)
            if (res.ok) {
                const data = await res.json()
                setLogs(data.logs)
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error)
        } finally {
            setIsLoading(false)
        }
    }, [filterProject, filterType])

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects')
            if (res.ok) {
                const data = await res.json()
                setProjects(data)
            }
        } catch (error) {
            console.error('Failed to fetch projects:', error)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    useEffect(() => {
        fetchLogs()
    }, [fetchLogs])

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!noteTitle.trim()) return

        setIsSubmitting(true)
        try {
            const res = await fetch('/api/admin/activity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectSlug: noteProject || null,
                    type: noteType,
                    title: noteTitle,
                    details: noteDetails,
                    author: 'manual',
                }),
            })

            if (res.ok) {
                setNoteTitle('')
                setNoteDetails('')
                setNoteProject('')
                setNoteType('note')
                setShowAddNote(false)
                fetchLogs()
            }
        } catch (error) {
            console.error('Failed to add note:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

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

    // Group logs by date
    const groupedLogs: Record<string, ActivityLog[]> = {}
    logs.forEach(log => {
        const dateKey = new Date(log.createdAt).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        })
        if (!groupedLogs[dateKey]) groupedLogs[dateKey] = []
        groupedLogs[dateKey].push(log)
    })

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Activity Log</h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                        Track progress across all projects
                    </p>
                </div>
                <button
                    onClick={() => setShowAddNote(!showAddNote)}
                    className="cyber-btn text-sm"
                >
                    {showAddNote ? '✕ Cancel' : '+ Add Entry'}
                </button>
            </div>

            {/* Add Note Form */}
            {showAddNote && (
                <form
                    onSubmit={handleAddNote}
                    className="cyber-card p-6 mb-8 space-y-4 neon-border"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                                Project
                            </label>
                            <select
                                value={noteProject}
                                onChange={(e) => setNoteProject(e.target.value)}
                                className="cyber-input text-sm"
                            >
                                <option value="">General (no project)</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.slug}>{p.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                                Type
                            </label>
                            <select
                                value={noteType}
                                onChange={(e) => setNoteType(e.target.value)}
                                className="cyber-input text-sm"
                            >
                                <option value="note">📝 Note</option>
                                <option value="task">✅ Task</option>
                                <option value="push">🔀 Push</option>
                                <option value="deploy">🚀 Deploy</option>
                                <option value="milestone">🏆 Milestone</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            className="cyber-input text-sm"
                            placeholder="What did you do?"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                            Details (optional)
                        </label>
                        <textarea
                            value={noteDetails}
                            onChange={(e) => setNoteDetails(e.target.value)}
                            className="cyber-input text-sm min-h-[60px] resize-none"
                            placeholder="More context..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-filled text-sm px-6 py-2"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Entry'}
                    </button>
                </form>
            )}

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <select
                    value={filterProject}
                    onChange={(e) => setFilterProject(e.target.value)}
                    className="cyber-input text-sm w-48"
                >
                    <option value="">All Projects</option>
                    {projects.map(p => (
                        <option key={p.id} value={p.slug}>{p.title}</option>
                    ))}
                </select>

                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="cyber-input text-sm w-40"
                >
                    <option value="">All Types</option>
                    <option value="push">🔀 Push</option>
                    <option value="task">✅ Task</option>
                    <option value="note">📝 Note</option>
                    <option value="deploy">🚀 Deploy</option>
                    <option value="milestone">🏆 Milestone</option>
                </select>
            </div>

            {/* Timeline */}
            {isLoading ? (
                <div className="text-center py-12 text-[var(--text-muted)]">Loading...</div>
            ) : logs.length === 0 ? (
                <div className="cyber-card p-12 text-center">
                    <div className="text-4xl mb-4">📋</div>
                    <h3 className="text-lg font-medium mb-2">No activity yet</h3>
                    <p className="text-[var(--text-muted)] text-sm">
                        Activities will appear here when you or your agents push code, complete tasks, or add notes.
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedLogs).map(([date, dateLogs]) => (
                        <div key={date}>
                            <h3 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">
                                {date}
                            </h3>
                            <div className="space-y-2">
                                {dateLogs.map(log => {
                                    const badge = TYPE_BADGES[log.type] || TYPE_BADGES.note
                                    return (
                                        <div
                                            key={log.id}
                                            className="flex items-start gap-4 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--border-hover)] transition-colors"
                                        >
                                            {/* Type badge */}
                                            <span className={`text-xs font-medium px-2 py-1 rounded-md border whitespace-nowrap ${badge.color}`}>
                                                {badge.icon} {badge.label}
                                            </span>

                                            {/* Content */}
                                            <div className="flex-grow min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-sm">{log.title}</span>
                                                </div>
                                                {log.details && (
                                                    <p className="text-[var(--text-muted)] text-xs mt-1 line-clamp-2">
                                                        {log.details}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Meta */}
                                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                                {log.project && (
                                                    <span className="text-xs text-[var(--accent-blue)]">
                                                        {log.project.title}
                                                    </span>
                                                )}
                                                <span className="text-xs text-[var(--text-muted)]">
                                                    {formatDate(log.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
