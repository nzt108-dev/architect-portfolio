'use client'

import { useState, useEffect, useMemo } from 'react'

/* ───── Types ───── */
interface LastCommit {
    hash: string
    message: string
    date: string | null
}

interface RecentActivity {
    type: string
    title: string
    date: string
}

interface ProjectWorkspace {
    id: string
    title: string
    slug: string
    description: string
    category: string
    progress: number
    localPath: string
    githubUrl: string | null
    demoUrl: string | null
    featured: boolean
    status: string
    stack: string[]
    services: string[]
    deployUrl: string
    backendUrl: string
    lastCommit: LastCommit | null
    lastActivity: string | null
    lastActivityType: string | null
    recentActivity: RecentActivity[]
}

/* ───── Constants ───── */
const CATEGORY_ICONS: Record<string, string> = {
    mobile: '📱', web: '🌐', telegram: '🤖', saas: '☁️', discord: '🎮',
}

const SERVICE_ICONS: Record<string, string> = {
    'Firebase': '🔥', 'Firestore': '🔥', 'Cloud Storage': '🔥', 'FCM': '🔔',
    'Supabase': '⚡', 'Vercel': '▲', 'Docker': '🐳', 'VPS': '🖥️',
    'GitHub': '🐙', 'GitHub Pages': '🐙', 'Redis': '🔴',
    'Telegram API': '🤖', 'YouTube API': '📺', 'OpenRouter': '🧠',
    'ElevenLabs': '🎙️', 'Turso': '🗄️', 'Zillow API': '🏠',
}

const STATUS_ORDER: Record<string, number> = {
    active: 0, mvp: 1, paused: 2, idea: 3, done: 4,
}

/* ───── Component ───── */
export default function WorkspacesPage() {
    const [projects, setProjects] = useState<ProjectWorkspace[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [stackFilter, setStackFilter] = useState<string | null>(null)

    useEffect(() => { fetchProjects() }, [])

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

    /* Derived data */
    const stats = useMemo(() => ({
        total: projects.length,
        active: projects.filter(p => p.status === 'active').length,
        paused: projects.filter(p => p.status === 'paused').length,
        done: projects.filter(p => p.status === 'done').length,
        idea: projects.filter(p => p.status === 'idea').length,
    }), [projects])

    const allStacks = useMemo(() => {
        const s = new Set<string>()
        projects.forEach(p => p.stack?.forEach(t => s.add(t)))
        return [...s].sort()
    }, [projects])

    const filtered = useMemo(() => {
        let list = [...projects]
        if (statusFilter !== 'all') list = list.filter(p => p.status === statusFilter)
        if (stackFilter) list = list.filter(p => p.stack?.includes(stackFilter))
        if (search) {
            const q = search.toLowerCase()
            list = list.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.slug.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q) ||
                p.stack?.some(s => s.toLowerCase().includes(q)) ||
                p.services?.some(s => s.toLowerCase().includes(q))
            )
        }
        list.sort((a, b) => {
            const sa = STATUS_ORDER[a.status] ?? 5
            const sb = STATUS_ORDER[b.status] ?? 5
            return sa !== sb ? sa - sb : a.slug.localeCompare(b.slug)
        })
        return list
    }, [projects, statusFilter, stackFilter, search])

    const openInAntigravity = (localPath: string) => {
        if (!localPath) return
        window.location.href = `antigravity://file${localPath}`
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="mc-spinner" />
            </div>
        )
    }

    return (
        <div className="mc-root">
            <style>{mcStyles}</style>

            {/* Header */}
            <div className="mc-header">
                <div>
                    <h1 className="mc-title">
                        <span className="mc-logo">◈</span>
                        Mission Control
                    </h1>
                    <p className="mc-subtitle">Центр управления проектами</p>
                </div>
            </div>

            {/* Stats */}
            <div className="mc-stats">
                <StatCard label="Проектов" value={stats.total} />
                <StatCard label="Active" value={stats.active} color="var(--mc-green)" />
                <StatCard label="Paused" value={stats.paused} color="var(--mc-yellow)" />
                <StatCard label="Done" value={stats.done} color="var(--mc-cyan)" />
                <StatCard label="Ideas" value={stats.idea} color="var(--mc-purple)" />
            </div>

            {/* Filters */}
            <div className="mc-filters">
                <div className="mc-search-wrap">
                    <svg className="mc-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                    <input
                        type="text"
                        className="mc-search"
                        placeholder="Поиск проекта..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="mc-filter-group">
                    {['all', 'active', 'paused', 'done', 'idea'].map(f => (
                        <button
                            key={f}
                            className={`mc-filter-btn ${statusFilter === f ? 'mc-filter-btn--active' : ''}`}
                            onClick={() => setStatusFilter(f)}
                        >
                            {f === 'all' ? 'Все' : f === 'active' ? '🟢 Active' : f === 'paused' ? '🟡 Paused' : f === 'done' ? '✅ Done' : '💡 Idea'}
                        </button>
                    ))}
                </div>
                <div className="mc-filter-group">
                    {allStacks.map(s => (
                        <button
                            key={s}
                            className={`mc-filter-btn mc-filter-btn--stack ${stackFilter === s ? 'mc-filter-btn--active-stack' : ''}`}
                            onClick={() => setStackFilter(stackFilter === s ? null : s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="mc-grid">
                {filtered.length === 0 ? (
                    <div className="mc-empty">Нет проектов по фильтрам</div>
                ) : (
                    filtered.map((p, i) => (
                        <ProjectCard
                            key={p.id}
                            project={p}
                            index={i}
                            onOpenIDE={openInAntigravity}
                        />
                    ))
                )}
            </div>

            <div className="mc-footer">
                <span>Mission Control • Obsidian Second Mind</span>
                <span>{filtered.length} из {projects.length}</span>
            </div>
        </div>
    )
}

/* ───── Sub-components ───── */
function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
    return (
        <div className="mc-stat">
            <span className="mc-stat-value" style={color ? { color } : {}}>{value}</span>
            <span className="mc-stat-label">{label}</span>
        </div>
    )
}

function ProjectCard({
    project: p,
    index,
    onOpenIDE,
}: {
    project: ProjectWorkspace
    index: number
    onOpenIDE: (path: string) => void
}) {
    const icon = CATEGORY_ICONS[p.category] || '📁'
    const displayTitle = p.title.replace(/— PRD$/i, '').trim()

    return (
        <div className={`mc-card mc-card--${p.status}`} style={{ animationDelay: `${index * 0.03}s` }}>
            {/* Top accent line */}
            <div className="mc-card-accent" />

            {/* Header */}
            <div className="mc-card-header">
                <div className="mc-card-info">
                    <span className="mc-card-icon">{icon}</span>
                    <div>
                        <div className="mc-card-name">{displayTitle}</div>
                        <div className="mc-card-slug">{p.slug}</div>
                    </div>
                </div>
                <span className={`mc-status mc-status--${p.status}`}>{p.status}</span>
            </div>

            {/* Description */}
            {p.description && <div className="mc-card-desc">{p.description}</div>}

            {/* Stack */}
            {p.stack?.length > 0 && (
                <div className="mc-badges">
                    {p.stack.map(s => <span key={s} className="mc-badge mc-badge--stack">{s}</span>)}
                </div>
            )}

            {/* Services */}
            {p.services?.length > 0 && (
                <div className="mc-badges">
                    {p.services.map(s => (
                        <span key={s} className="mc-badge mc-badge--service">
                            {SERVICE_ICONS[s] || '•'} {s}
                        </span>
                    ))}
                </div>
            )}

            {/* Deploy/Backend URLs */}
            {(p.deployUrl || p.backendUrl) && (
                <div className="mc-urls">
                    {p.deployUrl && (
                        <a href={p.deployUrl} target="_blank" rel="noreferrer" className="mc-url">
                            🌐 {new URL(p.deployUrl).hostname}
                        </a>
                    )}
                    {p.backendUrl && (
                        <a href={p.backendUrl} target="_blank" rel="noreferrer" className="mc-url">
                            ⚙️ Backend
                        </a>
                    )}
                </div>
            )}

            {/* Git */}
            {p.lastCommit && (
                <div className="mc-git">
                    <span className="mc-git-hash">{p.lastCommit.hash}</span>
                    <span className="mc-git-msg" title={p.lastCommit.message}>{p.lastCommit.message}</span>
                    {p.lastCommit.date && <span className="mc-git-date">{formatTimeAgo(p.lastCommit.date)}</span>}
                </div>
            )}

            {/* Actions */}
            <div className="mc-actions">
                <button
                    onClick={() => onOpenIDE(p.localPath)}
                    disabled={!p.localPath}
                    className={`mc-btn mc-btn--ide ${!p.localPath ? 'mc-btn--disabled' : ''}`}
                >
                    🚀 Open in IDE
                </button>
                {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noreferrer" className="mc-btn mc-btn--github">
                        🐙 GitHub
                    </a>
                )}
            </div>
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
    if (diffMins < 1) return 'сейчас'
    if (diffMins < 60) return `${diffMins}м`
    if (diffHrs < 24) return `${diffHrs}ч`
    if (diffDays < 7) return `${diffDays}д`
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

/* ───── Styles ───── */
const mcStyles = `
:root {
    --mc-bg: #0a0e17;
    --mc-card-bg: rgba(17, 24, 39, 0.7);
    --mc-card-hover: rgba(26, 36, 58, 0.85);
    --mc-border: rgba(99, 119, 150, 0.15);
    --mc-border-hover: rgba(99, 179, 255, 0.35);
    --mc-text: #e2e8f0;
    --mc-text-secondary: #94a3b8;
    --mc-text-muted: #64748b;
    --mc-cyan: #22d3ee;
    --mc-blue: #3b82f6;
    --mc-purple: #a855f7;
    --mc-green: #10b981;
    --mc-yellow: #f59e0b;
    --mc-red: #ef4444;
}

.mc-root {
    min-height: 100vh;
    color: var(--mc-text);
    padding-bottom: 2rem;
}

/* Header */
.mc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
}
.mc-title {
    font-size: 1.5rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.mc-logo {
    color: var(--mc-cyan);
    text-shadow: 0 0 15px rgba(34, 211, 238, 0.5);
    animation: mc-pulse 3s ease-in-out infinite;
}
@keyframes mc-pulse {
    0%, 100% { text-shadow: 0 0 15px rgba(34, 211, 238, 0.5); }
    50% { text-shadow: 0 0 25px rgba(34, 211, 238, 0.8), 0 0 50px rgba(34, 211, 238, 0.3); }
}
.mc-subtitle {
    font-size: 0.75rem;
    color: var(--mc-text-muted);
    font-family: 'JetBrains Mono', monospace;
    margin-top: 2px;
}

/* Stats */
.mc-stats {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
    overflow-x: auto;
}
.mc-stat {
    flex: 1;
    min-width: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 0.75rem 1rem;
    background: var(--mc-card-bg);
    border: 1px solid var(--mc-border);
    border-radius: 10px;
    backdrop-filter: blur(10px);
    transition: all 0.2s ease;
}
.mc-stat:hover { border-color: var(--mc-border-hover); transform: translateY(-2px); }
.mc-stat-value {
    font-size: 1.8rem;
    font-weight: 800;
    font-family: 'JetBrains Mono', monospace;
}
.mc-stat-label {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--mc-text-muted);
    font-weight: 500;
}

/* Filters */
.mc-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
    align-items: center;
}
.mc-search-wrap {
    position: relative;
    flex: 1;
    min-width: 200px;
    max-width: 300px;
}
.mc-search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--mc-text-muted);
}
.mc-search {
    width: 100%;
    padding: 8px 14px 8px 36px;
    background: var(--mc-card-bg);
    border: 1px solid var(--mc-border);
    border-radius: 8px;
    color: var(--mc-text);
    font-size: 0.85rem;
    outline: none;
    transition: all 0.2s ease;
}
.mc-search:focus { border-color: var(--mc-cyan); box-shadow: 0 0 0 3px rgba(34,211,238,0.1); }
.mc-search::placeholder { color: var(--mc-text-muted); }

.mc-filter-group {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
}
.mc-filter-btn {
    padding: 6px 12px;
    font-size: 0.75rem;
    font-weight: 500;
    background: var(--mc-card-bg);
    border: 1px solid var(--mc-border);
    border-radius: 6px;
    color: var(--mc-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
}
.mc-filter-btn:hover { border-color: var(--mc-border-hover); color: var(--mc-text); }
.mc-filter-btn--active { background: rgba(34,211,238,0.1); border-color: rgba(34,211,238,0.3); color: var(--mc-cyan); }
.mc-filter-btn--stack { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; }
.mc-filter-btn--active-stack { background: rgba(168,85,247,0.1); border-color: rgba(168,85,247,0.3); color: var(--mc-purple); }

/* Grid */
.mc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 1rem;
}

/* Card */
.mc-card {
    background: var(--mc-card-bg);
    border: 1px solid var(--mc-border);
    border-radius: 14px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    backdrop-filter: blur(10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    animation: mc-fadeIn 0.4s ease both;
}
@keyframes mc-fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

.mc-card-accent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--mc-cyan), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
}
.mc-card:hover { border-color: var(--mc-border-hover); transform: translateY(-3px); box-shadow: 0 0 20px rgba(59,130,246,0.1); }
.mc-card:hover .mc-card-accent { opacity: 1; }

.mc-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.5rem; }
.mc-card-info { display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0; }
.mc-card-icon { font-size: 1.5rem; flex-shrink: 0; }
.mc-card-name { font-size: 1rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mc-card-slug { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: var(--mc-text-muted); }
.mc-card-desc { font-size: 0.82rem; color: var(--mc-text-secondary); line-height: 1.5; }

/* Status badge */
.mc-status {
    font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;
    padding: 3px 10px; border-radius: 20px; border: 1px solid; flex-shrink: 0; white-space: nowrap;
}
.mc-status--active { color: var(--mc-green); border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.1); }
.mc-status--paused { color: var(--mc-yellow); border-color: rgba(245,158,11,0.3); background: rgba(245,158,11,0.1); }
.mc-status--done { color: var(--mc-cyan); border-color: rgba(34,211,238,0.3); background: rgba(34,211,238,0.1); }
.mc-status--idea { color: var(--mc-purple); border-color: rgba(168,85,247,0.3); background: rgba(168,85,247,0.1); }

/* Badges */
.mc-badges { display: flex; flex-wrap: wrap; gap: 4px; }
.mc-badge {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 0.68rem; font-weight: 500; padding: 2px 8px; border-radius: 4px; white-space: nowrap;
}
.mc-badge--stack {
    font-family: 'JetBrains Mono', monospace;
    background: rgba(59,130,246,0.1); color: var(--mc-blue); border: 1px solid rgba(59,130,246,0.2);
}
.mc-badge--service {
    background: rgba(168,85,247,0.08); color: rgba(196,148,255,0.9); border: 1px solid rgba(168,85,247,0.15);
}

/* URLs */
.mc-urls { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.mc-url {
    font-size: 0.72rem; color: var(--mc-cyan);
    text-decoration: none; font-family: 'JetBrains Mono', monospace;
    padding: 2px 6px; border-radius: 4px; background: rgba(34,211,238,0.05);
    border: 1px solid rgba(34,211,238,0.15);
    transition: all 0.2s ease;
}
.mc-url:hover { background: rgba(34,211,238,0.1); }

/* Git */
.mc-git {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.72rem; color: var(--mc-text-muted);
    font-family: 'JetBrains Mono', monospace;
    padding-top: 0.25rem; border-top: 1px solid var(--mc-border);
}
.mc-git-hash { color: var(--mc-cyan); }
.mc-git-msg { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mc-git-date { flex-shrink: 0; }

/* Actions */
.mc-actions { display: flex; gap: 0.5rem; padding-top: 0.25rem; }
.mc-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 8px 12px; font-size: 0.78rem; font-weight: 600;
    border-radius: 8px; cursor: pointer; transition: all 0.2s ease;
    border: 1px solid; text-decoration: none; text-align: center;
}
.mc-btn--ide {
    background: linear-gradient(135deg, rgba(34,211,238,0.15), rgba(59,130,246,0.15));
    border-color: rgba(34,211,238,0.3); color: var(--mc-cyan);
}
.mc-btn--ide:hover { background: linear-gradient(135deg, rgba(34,211,238,0.25), rgba(59,130,246,0.25)); box-shadow: 0 0 15px rgba(34,211,238,0.15); }
.mc-btn--github {
    background: rgba(99,119,150,0.08); border-color: rgba(99,119,150,0.2); color: var(--mc-text-secondary);
}
.mc-btn--github:hover { background: rgba(99,119,150,0.15); color: var(--mc-text); }
.mc-btn--disabled { opacity: 0.3; cursor: not-allowed; }

/* Footer */
.mc-footer {
    display: flex; justify-content: space-between;
    padding-top: 1rem; margin-top: 1.5rem;
    font-size: 0.72rem; color: var(--mc-text-muted);
    border-top: 1px solid var(--mc-border);
}

/* Empty */
.mc-empty { grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--mc-text-muted); }

/* Spinner */
.mc-spinner {
    width: 32px; height: 32px;
    border: 2px solid var(--mc-border);
    border-top-color: var(--mc-cyan);
    border-radius: 50%;
    animation: mc-spin 1s linear infinite;
}
@keyframes mc-spin { to { transform: rotate(360deg); } }

/* Responsive */
@media (max-width: 900px) { .mc-grid { grid-template-columns: 1fr; } }
@media (max-width: 600px) { .mc-stats { flex-wrap: wrap; } .mc-actions { flex-direction: column; } }
`
