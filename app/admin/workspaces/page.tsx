'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'

/* ───── Types ───── */
interface ProjectService {
    id: string
    projectId: string
    name: string
    category: string
    url: string
    account: string
    notes: string
    createdAt: string
}

interface ProjectRow {
    id: string
    title: string
    slug: string
    description: string
    category: string
    progress: number
    status: string
    stack: string[]
    deployUrl: string
    backendUrl: string
    sentrySlug: string
    githubUrl: string | null
    localPath: string
    projectServices: ProjectService[]
    lastCommit: { hash: string; message: string; date: string | null } | null
    lastActivity: string | null
}

interface HealthResult {
    projectId: string
    status: 'up' | 'down' | 'unknown'
    latency: number | null
    statusCode: number | null
}

interface SentryResult {
    projectId: string
    issueCount: number | null
    error: string | null
}

/* ───── Constants ───── */
const CATEGORIES = [
    { key: 'database',   label: 'Database',   icon: '🗄️',  color: '#3b82f6' },
    { key: 'frontend',   label: 'Frontend',   icon: '🌐',  color: '#10b981' },
    { key: 'backend',    label: 'Backend',    icon: '⚡',  color: '#06b6d4' },
    { key: 'auth',       label: 'Auth',       icon: '🔐',  color: '#8b5cf6' },
    { key: 'storage',    label: 'Storage',    icon: '💾',  color: '#ec4899' },
    { key: 'ai_llm',     label: 'AI / LLM',   icon: '🧠',  color: '#f59e0b' },
    { key: 'messaging',  label: 'Messaging',  icon: '💬',  color: '#22d3ee' },
    { key: 'payments',   label: 'Payments',   icon: '💳',  color: '#a3e635' },
    { key: 'email',      label: 'Email',      icon: '📧',  color: '#fb923c' },
    { key: 'analytics',  label: 'Analytics',  icon: '📊',  color: '#f472b6' },
    { key: 'monitoring', label: 'Monitoring', icon: '🔍',  color: '#34d399' },
    { key: 'cicd',       label: 'CI/CD',      icon: '⚙️',  color: '#94a3b8' },
] as const

type CategoryKey = typeof CATEGORIES[number]['key']

const SERVICE_PRESETS: Record<CategoryKey, string[]> = {
    database:   ['Turso', 'Supabase', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Firestore', 'PlanetScale', 'Neon', 'SQLite'],
    frontend:   ['Vercel', 'Netlify', 'GitHub Pages', 'Cloudflare Pages', 'Firebase Hosting', 'App Store', 'Google Play'],
    backend:    ['Railway', 'Fly.io', 'Heroku', 'DigitalOcean', 'VPS', 'AWS EC2', 'GCP Cloud Run', 'Render', 'Firebase Functions'],
    auth:       ['NextAuth', 'Supabase Auth', 'Firebase Auth', 'Clerk', 'Auth0', 'JWT', 'Custom'],
    storage:    ['Supabase Storage', 'Firebase Storage', 'AWS S3', 'Cloudflare R2', 'Vercel Blob', 'UploadThing'],
    ai_llm:     ['OpenAI', 'Anthropic', 'Gemini', 'OpenRouter', 'ElevenLabs', 'Groq', 'Mistral', 'YouTube Data API'],
    messaging:  ['Telegram Bot API', 'Twilio', 'FCM', 'WhatsApp API', 'Discord API', 'Slack API', 'Vonage'],
    payments:   ['Stripe', 'PayPal', 'LiqPay', 'Robokassa', 'YooKassa', 'Telegram Stars'],
    email:      ['SendGrid', 'Resend', 'Postmark', 'Mailgun', 'Amazon SES', 'Brevo'],
    analytics:  ['Microsoft Clarity', 'Google Analytics', 'PostHog', 'Plausible', 'Mixpanel', 'Amplitude'],
    monitoring: ['Sentry', 'BetterStack', 'Datadog', 'LogRocket', 'Uptime Kuma', 'Grafana'],
    cicd:       ['GitHub Actions', 'Vercel CI', 'Railway CI', 'CircleCI', 'GitLab CI'],
}

const CATEGORY_ICONS: Record<string, string> = {
    mobile: '📱', web: '🌐', telegram: '🤖', saas: '☁️', discord: '🎮',
}

const STATUS_ORDER: Record<string, number> = {
    active: 0, mvp: 1, paused: 2, idea: 3, done: 4,
}

/* ───── Main Component ───── */
export default function WorkspacesPage() {
    const [projects, setProjects] = useState<ProjectRow[]>([])
    const [health, setHealth] = useState<Record<string, HealthResult>>({})
    const [sentry, setSentry] = useState<Record<string, SentryResult>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [healthLoading, setHealthLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editingService, setEditingService] = useState<ProjectService | null>(null)
    const [drawerProjectId, setDrawerProjectId] = useState<string>('')
    const [drawerCategory, setDrawerCategory] = useState<CategoryKey>('database')
    const [form, setForm] = useState({ name: '', url: '', account: '', notes: '', category: 'database' as CategoryKey })
    const [saving, setSaving] = useState(false)
    const [lastHealthCheck, setLastHealthCheck] = useState<string | null>(null)

    const fetchProjects = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/workspaces')
            if (res.ok) {
                const data = await res.json()
                setProjects(data.projects)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const fetchHealth = useCallback(async () => {
        setHealthLoading(true)
        try {
            const res = await fetch('/api/admin/health')
            if (res.ok) {
                const data = await res.json()
                const map: Record<string, HealthResult> = {}
                for (const r of data.results) map[r.projectId] = r
                setHealth(map)
                setLastHealthCheck(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }))
            }
        } catch (e) {
            console.error(e)
        } finally {
            setHealthLoading(false)
        }
    }, [])

    const fetchSentry = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/sentry')
            if (res.ok) {
                const data = await res.json()
                const map: Record<string, SentryResult> = {}
                for (const r of data.results ?? []) map[r.projectId] = r
                setSentry(map)
            }
        } catch (e) {
            console.error(e)
        }
    }, [])

    useEffect(() => {
        fetchProjects()
        fetchSentry()
    }, [fetchProjects, fetchSentry])

    /* Derived */
    const stats = useMemo(() => ({
        total: projects.length,
        active: projects.filter(p => p.status === 'active').length,
        paused: projects.filter(p => p.status === 'paused').length,
        done: projects.filter(p => p.status === 'done').length,
    }), [projects])

    const filtered = useMemo(() => {
        let list = [...projects]
        if (statusFilter !== 'all') list = list.filter(p => p.status === statusFilter)
        if (search) {
            const q = search.toLowerCase()
            list = list.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.slug.toLowerCase().includes(q) ||
                p.stack?.some(s => s.toLowerCase().includes(q)) ||
                p.projectServices?.some(s => s.name.toLowerCase().includes(q))
            )
        }
        list.sort((a, b) => {
            const sa = STATUS_ORDER[a.status] ?? 5
            const sb = STATUS_ORDER[b.status] ?? 5
            return sa !== sb ? sa - sb : a.title.localeCompare(b.title)
        })
        return list
    }, [projects, statusFilter, search])

    /* Drawer helpers */
    const openAddDrawer = (projectId: string, category: CategoryKey) => {
        setEditingService(null)
        setDrawerProjectId(projectId)
        setDrawerCategory(category)
        setForm({ name: '', url: '', account: '', notes: '', category })
        setDrawerOpen(true)
    }

    const openEditDrawer = (service: ProjectService) => {
        setEditingService(service)
        setDrawerProjectId(service.projectId)
        setDrawerCategory(service.category as CategoryKey)
        setForm({ name: service.name, url: service.url, account: service.account, notes: service.notes, category: service.category as CategoryKey })
        setDrawerOpen(true)
    }

    const closeDrawer = () => { setDrawerOpen(false); setEditingService(null) }

    const saveService = async () => {
        if (!form.name.trim()) return
        setSaving(true)
        try {
            if (editingService) {
                await fetch(`/api/admin/services/${editingService.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form),
                })
            } else {
                await fetch('/api/admin/services', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectId: drawerProjectId, ...form }),
                })
            }
            await fetchProjects()
            closeDrawer()
        } catch (e) {
            console.error(e)
        } finally {
            setSaving(false)
        }
    }

    const deleteService = async (id: string) => {
        if (!confirm('Удалить сервис?')) return
        await fetch(`/api/admin/services/${id}`, { method: 'DELETE' })
        await fetchProjects()
        closeDrawer()
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="im-spinner" />
            </div>
        )
    }

    return (
        <div className="im-root">
            <style>{imStyles}</style>

            {/* Header */}
            <div className="im-header">
                <div>
                    <h1 className="im-title"><span className="im-logo">◈</span> Infrastructure Matrix</h1>
                    <p className="im-subtitle">Все сервисы проектов в одном месте</p>
                </div>
                <div className="im-header-actions">
                    <button
                        className={`im-btn-refresh ${healthLoading ? 'im-btn-refresh--loading' : ''}`}
                        onClick={fetchHealth}
                        disabled={healthLoading}
                        title="Проверить доступность сервисов"
                    >
                        {healthLoading ? '⏳' : '🔄'} Health Check
                        {lastHealthCheck && <span className="im-health-time">{lastHealthCheck}</span>}
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="im-stats">
                {[
                    { label: 'Проектов', value: stats.total, color: undefined },
                    { label: 'Active', value: stats.active, color: '#10b981' },
                    { label: 'Paused', value: stats.paused, color: '#f59e0b' },
                    { label: 'Done', value: stats.done, color: '#22d3ee' },
                ].map(s => (
                    <div key={s.label} className="im-stat">
                        <span className="im-stat-val" style={s.color ? { color: s.color } : {}}>{s.value}</span>
                        <span className="im-stat-label">{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="im-filters">
                <div className="im-search-wrap">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="im-search-icon"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                    <input className="im-search" placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="im-filter-group">
                    {['all', 'active', 'paused', 'done', 'idea'].map(f => (
                        <button
                            key={f}
                            className={`im-filter-btn ${statusFilter === f ? 'im-filter-btn--active' : ''}`}
                            onClick={() => setStatusFilter(f)}
                        >
                            {f === 'all' ? 'Все' : f === 'active' ? '🟢 Active' : f === 'paused' ? '🟡 Paused' : f === 'done' ? '✅ Done' : '💡 Idea'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Matrix Table */}
            <div className="im-table-wrap">
                <table className="im-table">
                    <thead>
                        <tr>
                            <th className="im-th im-th--project">Project</th>
                            {CATEGORIES.map(c => (
                                <th key={c.key} className="im-th">
                                    <span className="im-th-icon">{c.icon}</span>
                                    {c.label}
                                </th>
                            ))}
                            <th className="im-th im-th--health">Health</th>
                            <th className="im-th im-th--sentry">Sentry</th>
                            <th className="im-th im-th--git">Last Push</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={CATEGORIES.length + 4} className="im-empty">Нет проектов</td>
                            </tr>
                        ) : filtered.map(p => (
                            <ProjectRow
                                key={p.id}
                                project={p}
                                health={health[p.id]}
                                sentry={sentry[p.id]}
                                onAddService={openAddDrawer}
                                onEditService={openEditDrawer}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="im-footer">
                <span>Infrastructure Matrix • {filtered.length} из {projects.length} проектов</span>
                {Object.keys(health).length > 0 && (
                    <span>
                        {Object.values(health).filter(h => h.status === 'up').length}/
                        {Object.keys(health).length} сервисов online
                    </span>
                )}
            </div>

            {/* Add/Edit Service Drawer */}
            {drawerOpen && (
                <ServiceDrawer
                    editing={editingService}
                    projectId={drawerProjectId}
                    defaultCategory={drawerCategory}
                    form={form}
                    onFormChange={(f) => setForm(prev => ({ ...prev, ...f }))}
                    onSave={saveService}
                    onDelete={editingService ? () => deleteService(editingService.id) : undefined}
                    onClose={closeDrawer}
                    saving={saving}
                />
            )}
        </div>
    )
}

/* ───── ProjectRow ───── */
function ProjectRow({
    project: p,
    health,
    sentry,
    onAddService,
    onEditService,
}: {
    project: ProjectRow
    health: HealthResult | undefined
    sentry: SentryResult | undefined
    onAddService: (projectId: string, category: CategoryKey) => void
    onEditService: (service: ProjectService) => void
}) {
    const router = useRouter()
    const icon = CATEGORY_ICONS[p.category] || '📁'

    return (
        <tr className={`im-tr im-tr--${p.status}`}>
            {/* Project info — sticky left col */}
            <td className="im-td im-td--project" onClick={() => router.push(`/admin/workspaces/${p.slug}`)}>
                <div className="im-proj-header">
                    <span className="im-proj-icon">{icon}</span>
                    <div className="im-proj-info">
                        <span className="im-proj-name">{p.title.replace(/— PRD$/i, '').trim()}</span>
                        <span className="im-proj-slug">{p.slug}</span>
                    </div>
                    <span className={`im-status im-status--${p.status}`}>{p.status}</span>
                </div>
                <div className="im-progress-bar">
                    <div className="im-progress-fill" style={{ width: `${p.progress}%` }} />
                </div>
                <div className="im-proj-urls">
                    {p.deployUrl && (
                        <a href={p.deployUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="im-proj-url">
                            🌐
                        </a>
                    )}
                    {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="im-proj-url">
                            🐙
                        </a>
                    )}
                </div>
            </td>

            {/* Service category columns */}
            {CATEGORIES.map(cat => {
                const services = p.projectServices?.filter(s => s.category === cat.key) ?? []
                return (
                    <td key={cat.key} className="im-td im-td--service">
                        <div className="im-cell">
                            {services.map(s => (
                                <ServiceChip key={s.id} service={s} color={cat.color} onEdit={onEditService} />
                            ))}
                            <button
                                className="im-add-btn"
                                onClick={() => onAddService(p.id, cat.key as CategoryKey)}
                                title={`Добавить ${cat.label}`}
                            >
                                +
                            </button>
                        </div>
                    </td>
                )
            })}

            {/* Health */}
            <td className="im-td im-td--health">
                <HealthCell health={health} />
            </td>

            {/* Sentry */}
            <td className="im-td im-td--sentry">
                <SentryCell sentry={sentry} hasSentrySlug={!!p.sentrySlug} />
            </td>

            {/* Last push */}
            <td className="im-td im-td--git">
                {p.lastCommit ? (
                    <div className="im-git">
                        <span className="im-git-hash">{p.lastCommit.hash.slice(0, 7)}</span>
                        {p.lastCommit.date && <span className="im-git-date">{timeAgo(p.lastCommit.date)}</span>}
                    </div>
                ) : (
                    <span className="im-empty-val">—</span>
                )}
            </td>
        </tr>
    )
}

/* ───── ServiceChip ───── */
function ServiceChip({ service, color, onEdit }: { service: ProjectService; color: string; onEdit: (s: ProjectService) => void }) {
    return (
        <div className="im-chip-wrap">
            {service.url ? (
                <a
                    href={service.url}
                    target="_blank"
                    rel="noreferrer"
                    className="im-chip"
                    style={{ borderColor: color + '40', color: color + 'cc' }}
                    title={service.account ? `Аккаунт: ${service.account}` : service.name}
                >
                    {service.name}
                    {service.account && <span className="im-chip-account">@{service.account}</span>}
                </a>
            ) : (
                <span
                    className="im-chip im-chip--no-url"
                    style={{ borderColor: color + '30', color: color + '99' }}
                    title={service.account ? `Аккаунт: ${service.account}` : service.name}
                >
                    {service.name}
                    {service.account && <span className="im-chip-account">@{service.account}</span>}
                </span>
            )}
            <button className="im-chip-edit" onClick={() => onEdit(service)} title="Редактировать">✏️</button>
        </div>
    )
}

/* ───── HealthCell ───── */
function HealthCell({ health }: { health: HealthResult | undefined }) {
    if (!health) return <span className="im-empty-val">—</span>
    const color = health.status === 'up' ? '#10b981' : health.status === 'down' ? '#ef4444' : '#f59e0b'
    const label = health.status === 'up' ? `${health.latency}ms` : health.status === 'down' ? 'down' : '?'
    return (
        <div className="im-health">
            <span className="im-health-dot" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
            <span className="im-health-label" style={{ color }}>{label}</span>
        </div>
    )
}

/* ───── SentryCell ───── */
function SentryCell({ sentry, hasSentrySlug }: { sentry: SentryResult | undefined; hasSentrySlug: boolean }) {
    if (!hasSentrySlug) return <span className="im-empty-val">—</span>
    if (!sentry) return <span className="im-empty-val im-empty-val--loading">···</span>
    if (sentry.error) return <span className="im-empty-val" title={sentry.error}>err</span>
    const count = sentry.issueCount ?? 0
    return (
        <span className={`im-sentry-badge ${count > 0 ? 'im-sentry-badge--errors' : ''}`}>
            {count > 0 ? `⚠ ${count}` : '✓ 0'}
        </span>
    )
}

/* ───── ServiceDrawer ───── */
function ServiceDrawer({
    editing,
    defaultCategory,
    form,
    onFormChange,
    onSave,
    onDelete,
    onClose,
    saving,
}: {
    editing: ProjectService | null
    projectId: string
    defaultCategory: CategoryKey
    form: { name: string; url: string; account: string; notes: string; category: CategoryKey }
    onFormChange: (f: Partial<typeof form>) => void
    onSave: () => void
    onDelete?: () => void
    onClose: () => void
    saving: boolean
}) {
    const cat = CATEGORIES.find(c => c.key === form.category)!
    const presets = SERVICE_PRESETS[form.category]

    return (
        <div className="im-overlay" onClick={onClose}>
            <div className="im-drawer" onClick={e => e.stopPropagation()}>
                <div className="im-drawer-header">
                    <div>
                        <h2 className="im-drawer-title">
                            {editing ? '✏️ Редактировать' : '+ Добавить'} сервис
                        </h2>
                        <p className="im-drawer-subtitle">{cat.icon} {cat.label}</p>
                    </div>
                    <button className="im-drawer-close" onClick={onClose}>✕</button>
                </div>

                <div className="im-drawer-body">
                    {/* Category */}
                    <div className="im-form-group">
                        <label className="im-label">Категория</label>
                        <div className="im-category-grid">
                            {CATEGORIES.map(c => (
                                <button
                                    key={c.key}
                                    className={`im-cat-btn ${form.category === c.key ? 'im-cat-btn--active' : ''}`}
                                    style={form.category === c.key ? { borderColor: c.color + '60', color: c.color } : {}}
                                    onClick={() => onFormChange({ category: c.key as CategoryKey })}
                                >
                                    {c.icon} {c.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Name with presets */}
                    <div className="im-form-group">
                        <label className="im-label">Название *</label>
                        <input
                            className="im-input"
                            placeholder="Turso, Vercel, Sentry..."
                            value={form.name}
                            onChange={e => onFormChange({ name: e.target.value })}
                        />
                        <div className="im-presets">
                            {presets.map(p => (
                                <button key={p} className="im-preset-btn" onClick={() => onFormChange({ name: p })}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* URL */}
                    <div className="im-form-group">
                        <label className="im-label">Dashboard URL</label>
                        <input
                            className="im-input"
                            placeholder="https://app.turso.tech/..."
                            value={form.url}
                            onChange={e => onFormChange({ url: e.target.value })}
                        />
                    </div>

                    {/* Account */}
                    <div className="im-form-group">
                        <label className="im-label">Аккаунт</label>
                        <input
                            className="im-input"
                            placeholder="nzt108, personal, gmail..."
                            value={form.account}
                            onChange={e => onFormChange({ account: e.target.value })}
                        />
                    </div>

                    {/* Notes */}
                    <div className="im-form-group">
                        <label className="im-label">Заметки</label>
                        <textarea
                            className="im-input im-textarea"
                            placeholder="Free tier, plan info, etc."
                            value={form.notes}
                            onChange={e => onFormChange({ notes: e.target.value })}
                            rows={2}
                        />
                    </div>
                </div>

                <div className="im-drawer-footer">
                    {onDelete && (
                        <button className="im-btn im-btn--danger" onClick={onDelete}>
                            🗑 Удалить
                        </button>
                    )}
                    <div className="im-drawer-footer-right">
                        <button className="im-btn im-btn--ghost" onClick={onClose}>Отмена</button>
                        <button className="im-btn im-btn--primary" onClick={onSave} disabled={saving || !form.name.trim()}>
                            {saving ? '...' : editing ? 'Сохранить' : 'Добавить'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ───── Helpers ───── */
function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const m = Math.floor(diff / 60000)
    const h = Math.floor(diff / 3600000)
    const d = Math.floor(diff / 86400000)
    if (m < 1) return 'сейчас'
    if (m < 60) return `${m}м`
    if (h < 24) return `${h}ч`
    if (d < 7) return `${d}д`
    return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

/* ───── Styles ───── */
const imStyles = `
:root {
    --im-bg: #0a0e17;
    --im-card: rgba(17,24,39,0.7);
    --im-border: rgba(99,119,150,0.15);
    --im-border-h: rgba(99,179,255,0.3);
    --im-text: #e2e8f0;
    --im-text2: #94a3b8;
    --im-muted: #64748b;
    --im-cyan: #22d3ee;
    --im-green: #10b981;
    --im-yellow: #f59e0b;
    --im-red: #ef4444;
    --im-purple: #a855f7;
}

.im-root { min-height: 100vh; color: var(--im-text); padding-bottom: 3rem; }

/* Header */
.im-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.25rem; gap: 1rem; flex-wrap: wrap; }
.im-title { font-size: 1.4rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }
.im-logo { color: var(--im-cyan); text-shadow: 0 0 15px rgba(34,211,238,0.5); animation: im-pulse 3s ease-in-out infinite; }
@keyframes im-pulse { 0%,100% { text-shadow: 0 0 15px rgba(34,211,238,0.5); } 50% { text-shadow: 0 0 25px rgba(34,211,238,0.8); } }
.im-subtitle { font-size: 0.72rem; color: var(--im-muted); font-family: 'JetBrains Mono', monospace; margin-top: 2px; }
.im-header-actions { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }

.im-btn-refresh {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px; font-size: 0.8rem; font-weight: 600;
    background: rgba(34,211,238,0.08); border: 1px solid rgba(34,211,238,0.25); color: var(--im-cyan);
    cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.im-btn-refresh:hover { background: rgba(34,211,238,0.15); }
.im-btn-refresh--loading { opacity: 0.6; cursor: not-allowed; }
.im-health-time { font-size: 0.68rem; color: var(--im-muted); margin-left: 4px; }

/* Stats */
.im-stats { display: flex; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
.im-stat { flex: 1; min-width: 80px; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 0.6rem 0.75rem; background: var(--im-card); border: 1px solid var(--im-border); border-radius: 10px; backdrop-filter: blur(10px); }
.im-stat-val { font-size: 1.6rem; font-weight: 800; font-family: 'JetBrains Mono', monospace; }
.im-stat-label { font-size: 0.64rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--im-muted); }

/* Filters */
.im-filters { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem; align-items: center; }
.im-search-wrap { position: relative; min-width: 180px; max-width: 260px; flex: 1; }
.im-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--im-muted); pointer-events: none; }
.im-search { width: 100%; padding: 7px 12px 7px 30px; background: var(--im-card); border: 1px solid var(--im-border); border-radius: 8px; color: var(--im-text); font-size: 0.82rem; outline: none; transition: all 0.2s; }
.im-search:focus { border-color: var(--im-cyan); box-shadow: 0 0 0 2px rgba(34,211,238,0.1); }
.im-search::placeholder { color: var(--im-muted); }
.im-filter-group { display: flex; gap: 4px; flex-wrap: wrap; }
.im-filter-btn { padding: 5px 11px; font-size: 0.72rem; font-weight: 500; background: var(--im-card); border: 1px solid var(--im-border); border-radius: 6px; color: var(--im-text2); cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.im-filter-btn:hover { border-color: var(--im-border-h); color: var(--im-text); }
.im-filter-btn--active { background: rgba(34,211,238,0.08); border-color: rgba(34,211,238,0.3); color: var(--im-cyan); }

/* Table */
.im-table-wrap { overflow-x: auto; border-radius: 14px; border: 1px solid var(--im-border); background: var(--im-card); backdrop-filter: blur(10px); }
.im-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }

.im-th {
    padding: 10px 12px; text-align: left; font-size: 0.68rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.06em; color: var(--im-muted);
    border-bottom: 1px solid var(--im-border); white-space: nowrap;
    background: rgba(10,14,23,0.8);
    min-width: 130px;
}
.im-th--project { min-width: 220px; position: sticky; left: 0; z-index: 2; background: rgba(10,14,23,0.95); }
.im-th--health, .im-th--sentry { min-width: 80px; text-align: center; }
.im-th--git { min-width: 90px; }
.im-th-icon { margin-right: 4px; }

.im-tr { transition: background 0.15s; }
.im-tr:not(:last-child) .im-td { border-bottom: 1px solid var(--im-border); }
.im-tr:hover .im-td { background: rgba(26,36,58,0.5); }
.im-tr:hover .im-td--project { background: rgba(26,36,58,0.85); }

.im-td { padding: 10px 12px; vertical-align: top; }
.im-td--project {
    position: sticky; left: 0; z-index: 1;
    background: rgba(10,14,23,0.9);
    min-width: 220px; cursor: pointer;
    transition: background 0.15s;
}
.im-td--project:hover { background: rgba(20,30,50,0.95) !important; }
.im-td--service { min-width: 130px; }
.im-td--health, .im-td--sentry { text-align: center; vertical-align: middle; }

/* Project cell */
.im-proj-header { display: flex; align-items: center; gap: 6px; margin-bottom: 5px; }
.im-proj-icon { font-size: 1.1rem; flex-shrink: 0; }
.im-proj-info { flex: 1; min-width: 0; }
.im-proj-name { display: block; font-size: 0.85rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.im-proj-slug { display: block; font-family: 'JetBrains Mono', monospace; font-size: 0.64rem; color: var(--im-muted); }
.im-proj-urls { display: flex; gap: 4px; margin-top: 4px; }
.im-proj-url { font-size: 0.9rem; opacity: 0.6; transition: opacity 0.2s; text-decoration: none; }
.im-proj-url:hover { opacity: 1; }

/* Status badge */
.im-status {
    font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
    padding: 2px 7px; border-radius: 20px; border: 1px solid; flex-shrink: 0;
}
.im-status--active { color: var(--im-green); border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.08); }
.im-status--paused { color: var(--im-yellow); border-color: rgba(245,158,11,0.3); background: rgba(245,158,11,0.08); }
.im-status--done { color: var(--im-cyan); border-color: rgba(34,211,238,0.3); background: rgba(34,211,238,0.08); }
.im-status--idea { color: var(--im-purple); border-color: rgba(168,85,247,0.3); background: rgba(168,85,247,0.08); }

/* Progress bar */
.im-progress-bar { height: 2px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; margin-bottom: 4px; }
.im-progress-fill { height: 100%; background: linear-gradient(90deg, var(--im-cyan), var(--im-purple)); border-radius: 2px; transition: width 0.3s; }

/* Service cell */
.im-cell { display: flex; flex-wrap: wrap; gap: 4px; align-items: flex-start; }
.im-chip-wrap { display: flex; align-items: center; gap: 2px; }
.im-chip {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 0.68rem; font-weight: 500; padding: 2px 8px;
    border-radius: 5px; border: 1px solid; white-space: nowrap;
    text-decoration: none; transition: opacity 0.15s;
    cursor: pointer;
}
.im-chip:hover { opacity: 0.8; }
.im-chip--no-url { cursor: default; }
.im-chip-account { font-size: 0.6rem; opacity: 0.65; }
.im-chip-edit { font-size: 0.6rem; opacity: 0; cursor: pointer; background: none; border: none; padding: 0 2px; transition: opacity 0.15s; color: var(--im-text2); }
.im-chip-wrap:hover .im-chip-edit { opacity: 1; }
.im-add-btn {
    width: 20px; height: 20px; border-radius: 4px;
    border: 1px dashed var(--im-border); color: var(--im-muted);
    background: none; cursor: pointer; font-size: 0.85rem;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; opacity: 0;
    line-height: 1;
}
.im-td--service:hover .im-add-btn, .im-tr:hover .im-add-btn { opacity: 1; }
.im-add-btn:hover { border-color: var(--im-cyan); color: var(--im-cyan); background: rgba(34,211,238,0.08); }

/* Health */
.im-health { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.im-health-dot { width: 10px; height: 10px; border-radius: 50%; }
.im-health-label { font-size: 0.65rem; font-family: 'JetBrains Mono', monospace; }

/* Sentry badge */
.im-sentry-badge { font-size: 0.7rem; font-family: 'JetBrains Mono', monospace; color: var(--im-green); font-weight: 600; }
.im-sentry-badge--errors { color: var(--im-red); animation: im-blink 2s ease-in-out infinite; }
@keyframes im-blink { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }

/* Git */
.im-git { display: flex; flex-direction: column; gap: 2px; font-family: 'JetBrains Mono', monospace; }
.im-git-hash { font-size: 0.68rem; color: var(--im-cyan); }
.im-git-date { font-size: 0.65rem; color: var(--im-muted); }

.im-empty-val { color: var(--im-muted); font-size: 0.75rem; }
.im-empty-val--loading { animation: im-blink 1s ease-in-out infinite; }
.im-empty { padding: 2rem; text-align: center; color: var(--im-muted); }

/* Footer */
.im-footer { display: flex; justify-content: space-between; padding-top: 1rem; margin-top: 1rem; font-size: 0.72rem; color: var(--im-muted); }

/* Drawer Overlay */
.im-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    display: flex; justify-content: flex-end;
    animation: im-fadein 0.2s ease;
}
@keyframes im-fadein { from { opacity: 0; } to { opacity: 1; } }

.im-drawer {
    width: 400px; max-width: 100vw;
    background: #0d1421;
    border-left: 1px solid var(--im-border);
    display: flex; flex-direction: column;
    animation: im-slidein 0.25s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden;
}
@keyframes im-slidein { from { transform: translateX(100%); } to { transform: translateX(0); } }

.im-drawer-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    padding: 1.25rem; border-bottom: 1px solid var(--im-border);
}
.im-drawer-title { font-size: 1rem; font-weight: 700; }
.im-drawer-subtitle { font-size: 0.75rem; color: var(--im-text2); margin-top: 3px; }
.im-drawer-close {
    width: 30px; height: 30px; border-radius: 7px;
    background: rgba(255,255,255,0.05); border: 1px solid var(--im-border);
    color: var(--im-text2); cursor: pointer; font-size: 0.85rem;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.im-drawer-close:hover { background: rgba(255,255,255,0.1); }

.im-drawer-body { flex: 1; overflow-y: auto; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
.im-drawer-footer { padding: 1rem 1.25rem; border-top: 1px solid var(--im-border); display: flex; justify-content: space-between; align-items: center; }
.im-drawer-footer-right { display: flex; gap: 0.5rem; }

.im-form-group { display: flex; flex-direction: column; gap: 6px; }
.im-label { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--im-text2); }
.im-input {
    width: 100%; padding: 8px 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--im-border);
    border-radius: 8px; color: var(--im-text); font-size: 0.85rem;
    outline: none; font-family: inherit; transition: border-color 0.2s;
}
.im-input:focus { border-color: var(--im-cyan); }
.im-textarea { resize: vertical; min-height: 60px; }

.im-category-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; }
.im-cat-btn {
    padding: 5px 6px; font-size: 0.68rem; font-weight: 500;
    background: rgba(255,255,255,0.03); border: 1px solid var(--im-border);
    border-radius: 6px; color: var(--im-text2); cursor: pointer;
    transition: all 0.15s; text-align: center; white-space: nowrap;
}
.im-cat-btn:hover { background: rgba(255,255,255,0.06); color: var(--im-text); }
.im-cat-btn--active { background: rgba(34,211,238,0.06); }

.im-presets { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
.im-preset-btn {
    padding: 3px 8px; font-size: 0.68rem;
    background: rgba(255,255,255,0.04); border: 1px solid var(--im-border);
    border-radius: 5px; color: var(--im-text2); cursor: pointer;
    transition: all 0.15s;
}
.im-preset-btn:hover { background: rgba(34,211,238,0.08); color: var(--im-cyan); border-color: rgba(34,211,238,0.3); }

.im-btn {
    padding: 8px 16px; font-size: 0.82rem; font-weight: 600;
    border-radius: 8px; cursor: pointer; transition: all 0.2s; border: 1px solid;
}
.im-btn--primary { background: rgba(34,211,238,0.12); border-color: rgba(34,211,238,0.35); color: var(--im-cyan); }
.im-btn--primary:hover { background: rgba(34,211,238,0.2); }
.im-btn--primary:disabled { opacity: 0.4; cursor: not-allowed; }
.im-btn--ghost { background: transparent; border-color: var(--im-border); color: var(--im-text2); }
.im-btn--ghost:hover { background: rgba(255,255,255,0.05); }
.im-btn--danger { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.3); color: var(--im-red); }
.im-btn--danger:hover { background: rgba(239,68,68,0.15); }

/* Spinner */
.im-spinner { width: 28px; height: 28px; border: 2px solid var(--im-border); border-top-color: var(--im-cyan); border-radius: 50%; animation: im-spin 0.8s linear infinite; }
@keyframes im-spin { to { transform: rotate(360deg); } }

/* Responsive */
@media (max-width: 700px) {
    .im-stats { gap: 0.5rem; }
    .im-stat { min-width: 60px; padding: 0.5rem; }
    .im-drawer { width: 100vw; }
    .im-th--project { min-width: 160px; }
    .im-td--project { min-width: 160px; }
}
`
