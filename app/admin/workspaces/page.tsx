'use client'

import { useState, useEffect } from 'react'

interface ProjectWorkspace {
    id: string
    title: string
    slug: string
    category: string
    progress: number
    localPath: string
    lastActivity: string | null
    lastActivityType: string | null
}

const CATEGORY_ICONS: Record<string, string> = {
    mobile: '📱',
    web: '🌐',
    telegram: '🤖',
    saas: '☁️',
    discord: '🎮',
}

export default function WorkspacesPage() {
    const [projects, setProjects] = useState<ProjectWorkspace[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/admin/workspaces')
            if (res.ok) {
                const data = await res.json()
                setProjects(data.projects)
            }
        } catch (error) {
            console.error('Failed to fetch workspaces:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const openInAntigravity = (localPath: string) => {
        if (!localPath) return
        // Antigravity uses the same URL scheme as VS Code
        window.location.href = `antigravity://file${localPath}`
    }

    const formatTimeAgo = (dateStr: string | null) => {
        if (!dateStr) return 'Нет активности'
        const d = new Date(dateStr)
        const now = new Date()
        const diffMs = now.getTime() - d.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHrs = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'только что'
        if (diffMins < 60) return `${diffMins} мин назад`
        if (diffHrs < 24) return `${diffHrs}ч назад`
        if (diffDays < 7) return `${diffDays}д назад`
        return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    }

    if (isLoading) {
        return <div className="text-center py-12 text-[var(--text-muted)]">Loading...</div>
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Workspaces</h1>
                <p className="text-[var(--text-muted)] text-sm mt-1">
                    Управление проектами • Нажми &quot;Открыть&quot; чтобы запустить в Antigravity
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="cyber-card p-5 flex flex-col gap-3 group hover:border-[var(--border-hover)] transition-all"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{CATEGORY_ICONS[project.category] || '📁'}</span>
                                <div>
                                    <h3 className="font-semibold text-base">{project.title}</h3>
                                    <span className="text-xs text-[var(--text-muted)] font-mono">
                                        {project.slug}
                                    </span>
                                </div>
                            </div>

                            {/* Progress badge */}
                            <span className={`text-xs font-medium px-2 py-1 rounded-md border ${project.progress >= 80
                                    ? 'bg-green-500/15 text-green-400 border-green-500/30'
                                    : project.progress >= 40
                                        ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                                        : 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
                                }`}>
                                {project.progress}%
                            </span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]"
                                style={{ width: `${project.progress}%` }}
                            />
                        </div>

                        {/* Last activity */}
                        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                            <span>
                                {project.lastActivityType && (
                                    <span className="mr-1">
                                        {project.lastActivityType === 'push' ? '🔀' :
                                            project.lastActivityType === 'task' ? '✅' :
                                                project.lastActivityType === 'deploy' ? '🚀' :
                                                    project.lastActivityType === 'milestone' ? '🏆' : '📝'}
                                    </span>
                                )}
                                {formatTimeAgo(project.lastActivity)}
                            </span>
                            {project.localPath && (
                                <span className="font-mono truncate max-w-[200px]" title={project.localPath}>
                                    {project.localPath.split('/').pop()}
                                </span>
                            )}
                        </div>

                        {/* Launch button */}
                        <button
                            onClick={() => openInAntigravity(project.localPath)}
                            disabled={!project.localPath}
                            className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${project.localPath
                                    ? 'bg-[var(--accent-primary)] text-white hover:brightness-110 active:scale-[0.98] cursor-pointer'
                                    : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed'
                                }`}
                        >
                            {project.localPath ? '🚀 Открыть в Antigravity' : '⚠️ Путь не указан'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
