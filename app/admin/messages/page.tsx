'use client'

import { useState, useEffect, useCallback } from 'react'

// ── Types ──────────────────────────────────────────────
interface Message {
    id: string
    name: string
    email: string
    subject: string
    message: string
    budget: string
    serviceType: string
    read: boolean
    status: string
    label: string
    notes: string
    dealValue: number
    createdAt: string
}

// ── Constants ──────────────────────────────────────────
const PIPELINE_STAGES = [
    { key: 'new', label: 'New', icon: '📩', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
    { key: 'contacted', label: 'Contacted', icon: '📧', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    { key: 'qualified', label: 'Qualified', icon: '⭐', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    { key: 'proposal', label: 'Proposal', icon: '📄', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
    { key: 'won', label: 'Won', icon: '🎉', color: 'bg-green-500/15 text-green-400 border-green-500/30' },
    { key: 'lost', label: 'Lost', icon: '❌', color: 'bg-red-500/15 text-red-400 border-red-500/30' },
    { key: 'archived', label: 'Archived', icon: '🗄️', color: 'bg-gray-500/15 text-gray-400 border-gray-500/30' },
]

const LABELS: Record<string, { label: string; dot: string; bg: string }> = {
    hot: { label: '🔥 Hot', dot: 'bg-red-400', bg: 'bg-red-500/15 text-red-400 border-red-500/30' },
    warm: { label: '🌤 Warm', dot: 'bg-amber-400', bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    cold: { label: '❄️ Cold', dot: 'bg-blue-400', bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
}

// ── Main Component ─────────────────────────────────────
export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
    const [viewMode, setViewMode] = useState<'pipeline' | 'list'>('pipeline')
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [filterLabel, setFilterLabel] = useState<string>('all')

    const fetchMessages = useCallback(async () => {
        try {
            const res = await fetch('/api/contact')
            if (res.ok) {
                const data = await res.json()
                setMessages(data)
            }
        } catch (err) {
            console.error('Failed to fetch messages:', err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => { fetchMessages() }, [fetchMessages])

    const updateMessage = async (id: string, data: Partial<Message>) => {
        try {
            const res = await fetch(`/api/contact/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (res.ok) {
                setMessages(prev => prev.map(m => m.id === id ? { ...m, ...data } : m))
                if (selectedMessage?.id === id) {
                    setSelectedMessage(prev => prev ? { ...prev, ...data } : null)
                }
            }
        } catch (err) {
            console.error('Failed to update:', err)
        }
    }

    const deleteMessage = async (id: string) => {
        if (!confirm('Delete this message permanently?')) return
        try {
            const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setMessages(prev => prev.filter(m => m.id !== id))
                if (selectedMessage?.id === id) setSelectedMessage(null)
            }
        } catch (err) {
            console.error('Failed to delete:', err)
        }
    }

    const moveToStage = (id: string, status: string) => {
        updateMessage(id, { status, read: true })
    }

    // Stats
    const newCount = messages.filter(m => m.status === 'new').length
    const activeCount = messages.filter(m => ['contacted', 'qualified', 'proposal'].includes(m.status)).length
    const wonCount = messages.filter(m => m.status === 'won').length
    const totalRevenue = messages
        .filter(m => m.status === 'won')
        .reduce((sum, m) => sum + (m.dealValue || 0), 0)

    // Filtered messages for list view
    const filteredMessages = messages.filter(m => {
        if (filterStatus !== 'all' && m.status !== filterStatus) return false
        if (filterLabel !== 'all' && m.label !== filterLabel) return false
        return true
    })

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr)
        const now = new Date()
        const diffMs = now.getTime() - d.getTime()
        const diffHrs = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)
        if (diffHrs < 1) return 'just now'
        if (diffHrs < 24) return `${diffHrs}h ago`
        if (diffDays < 7) return `${diffDays}d ago`
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Lead Pipeline</h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                        Manage incoming inquiries from contact form
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* View Toggle */}
                    <div className="flex rounded-lg border border-[var(--border-color)] overflow-hidden">
                        <button
                            onClick={() => setViewMode('pipeline')}
                            className={`px-3 py-1.5 text-xs font-medium transition-all ${viewMode === 'pipeline'
                                ? 'bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)]'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            🏗 Pipeline
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1.5 text-xs font-medium transition-all ${viewMode === 'list'
                                ? 'bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)]'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            📋 List
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="cyber-card p-3 text-center">
                    <div className="text-2xl font-bold text-cyan-400">{newCount}</div>
                    <div className="text-[var(--text-muted)] text-xs">New Leads</div>
                </div>
                <div className="cyber-card p-3 text-center">
                    <div className="text-2xl font-bold text-amber-400">{activeCount}</div>
                    <div className="text-[var(--text-muted)] text-xs">In Pipeline</div>
                </div>
                <div className="cyber-card p-3 text-center">
                    <div className="text-2xl font-bold text-green-400">{wonCount}</div>
                    <div className="text-[var(--text-muted)] text-xs">Won</div>
                </div>
                <div className="cyber-card p-3 text-center">
                    <div className="text-2xl font-bold text-[var(--neon-cyan)]">
                        {totalRevenue > 0 ? `$${totalRevenue.toLocaleString()}` : '$0'}
                    </div>
                    <div className="text-[var(--text-muted)] text-xs">Revenue</div>
                </div>
            </div>

            {/* Pipeline or List View */}
            {viewMode === 'pipeline' ? (
                <PipelineView
                    messages={messages}
                    onSelect={setSelectedMessage}
                    onMove={moveToStage}
                    onLabel={(id, label) => updateMessage(id, { label })}
                    formatDate={formatDate}
                />
            ) : (
                <ListView
                    messages={filteredMessages}
                    onSelect={setSelectedMessage}
                    onMove={moveToStage}
                    onLabel={(id, label) => updateMessage(id, { label })}
                    onDelete={deleteMessage}
                    filterStatus={filterStatus}
                    filterLabel={filterLabel}
                    setFilterStatus={setFilterStatus}
                    setFilterLabel={setFilterLabel}
                    formatDate={formatDate}
                />
            )}

            {/* Detail Modal */}
            {selectedMessage && (
                <MessageDetail
                    message={selectedMessage}
                    onClose={() => setSelectedMessage(null)}
                    onUpdate={(data) => updateMessage(selectedMessage.id, data)}
                    onDelete={() => deleteMessage(selectedMessage.id)}
                    onMove={(status) => moveToStage(selectedMessage.id, status)}
                />
            )}
        </div>
    )
}

// ── Pipeline View ──────────────────────────────────────
function PipelineView({
    messages,
    onSelect,
    onMove,
    onLabel,
    formatDate,
}: {
    messages: Message[]
    onSelect: (m: Message) => void
    onMove: (id: string, status: string) => void
    onLabel: (id: string, label: string) => void
    formatDate: (d: string) => string
}) {
    // Show only active pipeline stages (not lost/archived) + compact lost/archived count
    const activeStages = PIPELINE_STAGES.filter(s => !['lost', 'archived'].includes(s.key))
    const lostCount = messages.filter(m => m.status === 'lost').length
    const archivedCount = messages.filter(m => m.status === 'archived').length

    return (
        <div>
            <div className="grid grid-cols-5 gap-3" style={{ minHeight: '55vh' }}>
                {activeStages.map((stage, idx) => {
                    const stageMsgs = messages.filter(m => m.status === stage.key)
                    return (
                        <div key={stage.key} className="flex flex-col">
                            {/* Column header */}
                            <div className={`flex items-center justify-between px-3 py-2 rounded-xl mb-3 border ${stage.color}`}>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <span>{stage.icon}</span>
                                    <span>{stage.label}</span>
                                </div>
                                <span className="text-xs opacity-70">{stageMsgs.length}</span>
                            </div>

                            {/* Cards */}
                            <div className="flex-1 space-y-2 overflow-y-auto pr-1" style={{ maxHeight: '60vh' }}>
                                {stageMsgs.map(msg => (
                                    <LeadCard
                                        key={msg.id}
                                        message={msg}
                                        stageIndex={idx}
                                        totalStages={activeStages.length}
                                        onSelect={onSelect}
                                        onMove={onMove}
                                        onLabel={onLabel}
                                        stages={activeStages}
                                        formatDate={formatDate}
                                    />
                                ))}
                                {stageMsgs.length === 0 && (
                                    <div className="flex items-center justify-center h-24 rounded-xl border border-dashed border-[var(--border-color)] text-[var(--text-muted)] text-xs">
                                        No leads
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Lost & Archived summary */}
            {(lostCount > 0 || archivedCount > 0) && (
                <div className="flex gap-4 mt-4 text-xs text-[var(--text-muted)]">
                    {lostCount > 0 && <span>❌ {lostCount} lost</span>}
                    {archivedCount > 0 && <span>🗄️ {archivedCount} archived</span>}
                </div>
            )}
        </div>
    )
}

// ── Lead Card ──────────────────────────────────────────
function LeadCard({
    message,
    stageIndex,
    totalStages,
    onSelect,
    onMove,
    onLabel,
    stages,
    formatDate,
}: {
    message: Message
    stageIndex: number
    totalStages: number
    onSelect: (m: Message) => void
    onMove: (id: string, status: string) => void
    onLabel: (id: string, label: string) => void
    stages: typeof PIPELINE_STAGES
    formatDate: (d: string) => string
}) {
    const labelInfo = message.label ? LABELS[message.label] : null

    return (
        <div
            className={`rounded-xl p-3 border bg-[var(--bg-card)] border-[var(--border-color)] hover:border-[var(--border-hover)] transition-all cursor-pointer ${!message.read ? 'ring-1 ring-[var(--neon-cyan)]/30' : ''
                }`}
            onClick={() => onSelect(message)}
        >
            {/* Name + Label */}
            <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-sm font-medium truncate">{message.name}</h4>
                {!message.read && (
                    <span className="w-2 h-2 rounded-full bg-[var(--neon-cyan)] flex-shrink-0" />
                )}
            </div>

            {/* Subject */}
            <p className="text-xs text-[var(--text-secondary)] mb-2 line-clamp-1">{message.subject}</p>

            {/* Budget + Service */}
            <div className="flex flex-wrap gap-1 mb-2">
                {message.budget && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                        💰 {message.budget}
                    </span>
                )}
                {message.serviceType && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)]">
                        {message.serviceType}
                    </span>
                )}
            </div>

            {/* Label selector */}
            {labelInfo && (
                <div className={`text-[10px] px-1.5 py-0.5 rounded border w-fit mb-2 ${labelInfo.bg}`}>
                    {labelInfo.label}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)]">{formatDate(message.createdAt)}</span>
                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                    {/* Label quick toggle */}
                    <button
                        onClick={() => {
                            const labels = ['', 'hot', 'warm', 'cold']
                            const idx = labels.indexOf(message.label || '')
                            onLabel(message.id, labels[(idx + 1) % labels.length])
                        }}
                        className="w-6 h-6 rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] text-[10px] transition-all flex items-center justify-center"
                        title="Toggle label"
                    >
                        {message.label === 'hot' ? '🔥' : message.label === 'warm' ? '🌤' : message.label === 'cold' ? '❄️' : '🏷'}
                    </button>
                    {/* Move buttons */}
                    {stageIndex > 0 && (
                        <button
                            onClick={() => onMove(message.id, stages[stageIndex - 1].key)}
                            className="w-6 h-6 rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs transition-all flex items-center justify-center"
                            title={`Move to ${stages[stageIndex - 1].label}`}
                        >
                            ←
                        </button>
                    )}
                    {stageIndex < totalStages - 1 && (
                        <button
                            onClick={() => onMove(message.id, stages[stageIndex + 1].key)}
                            className="w-6 h-6 rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs transition-all flex items-center justify-center"
                            title={`Move to ${stages[stageIndex + 1].label}`}
                        >
                            →
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

// ── List View ──────────────────────────────────────────
function ListView({
    messages,
    onSelect,
    onMove,
    onLabel,
    onDelete,
    filterStatus,
    filterLabel,
    setFilterStatus,
    setFilterLabel,
    formatDate,
}: {
    messages: Message[]
    onSelect: (m: Message) => void
    onMove: (id: string, status: string) => void
    onLabel: (id: string, label: string) => void
    onDelete: (id: string) => void
    filterStatus: string
    filterLabel: string
    setFilterStatus: (s: string) => void
    setFilterLabel: (l: string) => void
    formatDate: (d: string) => string
}) {
    return (
        <div>
            {/* Filters */}
            <div className="flex gap-3 mb-4">
                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="cyber-input text-sm w-44"
                >
                    <option value="all">All Statuses</option>
                    {PIPELINE_STAGES.map(s => (
                        <option key={s.key} value={s.key}>{s.icon} {s.label}</option>
                    ))}
                </select>
                <select
                    value={filterLabel}
                    onChange={e => setFilterLabel(e.target.value)}
                    className="cyber-input text-sm w-36"
                >
                    <option value="all">All Labels</option>
                    <option value="hot">🔥 Hot</option>
                    <option value="warm">🌤 Warm</option>
                    <option value="cold">❄️ Cold</option>
                </select>
            </div>

            {messages.length === 0 ? (
                <div className="cyber-card p-12 text-center text-[var(--text-muted)]">
                    No messages match your filters
                </div>
            ) : (
                <div className="space-y-2">
                    {messages.map(msg => {
                        const stage = PIPELINE_STAGES.find(s => s.key === msg.status) || PIPELINE_STAGES[0]
                        const labelInfo = msg.label ? LABELS[msg.label] : null

                        return (
                            <div
                                key={msg.id}
                                className={`cyber-card p-4 flex items-center gap-4 cursor-pointer hover:border-[var(--border-hover)] transition-all ${!msg.read ? 'border-[var(--neon-cyan)]/40' : ''
                                    }`}
                                onClick={() => onSelect(msg)}
                            >
                                {/* Unread dot */}
                                <div className="w-2 flex-shrink-0">
                                    {!msg.read && <span className="w-2 h-2 rounded-full bg-[var(--neon-cyan)] block" />}
                                </div>

                                {/* Info */}
                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="font-medium text-sm">{msg.name}</span>
                                        <span className="text-[var(--text-muted)] text-xs">{msg.email}</span>
                                    </div>
                                    <p className="text-xs text-[var(--text-secondary)] truncate">{msg.subject}</p>
                                </div>

                                {/* Budget */}
                                {msg.budget && (
                                    <span className="text-xs text-green-400 flex-shrink-0">💰 {msg.budget}</span>
                                )}

                                {/* Label */}
                                {labelInfo && (
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border flex-shrink-0 ${labelInfo.bg}`}>
                                        {labelInfo.label}
                                    </span>
                                )}

                                {/* Status badge */}
                                <span className={`text-[10px] px-2 py-1 rounded border flex-shrink-0 ${stage.color}`}>
                                    {stage.icon} {stage.label}
                                </span>

                                {/* Time */}
                                <span className="text-xs text-[var(--text-muted)] flex-shrink-0 w-16 text-right">
                                    {formatDate(msg.createdAt)}
                                </span>

                                {/* Actions */}
                                <div className="flex gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                                    <select
                                        value={msg.status}
                                        onChange={e => onMove(msg.id, e.target.value)}
                                        className="cyber-input text-[10px] py-1 w-24"
                                    >
                                        {PIPELINE_STAGES.map(s => (
                                            <option key={s.key} value={s.key}>{s.label}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => {
                                            const labels = ['', 'hot', 'warm', 'cold']
                                            const idx = labels.indexOf(msg.label || '')
                                            onLabel(msg.id, labels[(idx + 1) % labels.length])
                                        }}
                                        className="w-7 h-7 rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] text-xs transition-all flex items-center justify-center"
                                        title="Toggle label"
                                    >
                                        {msg.label === 'hot' ? '🔥' : msg.label === 'warm' ? '🌤' : msg.label === 'cold' ? '❄️' : '🏷'}
                                    </button>
                                    <button
                                        onClick={() => onDelete(msg.id)}
                                        className="w-7 h-7 rounded-md bg-[var(--bg-secondary)] hover:bg-red-500/20 text-[var(--text-muted)] hover:text-red-400 text-xs transition-all flex items-center justify-center"
                                        title="Delete"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

// ── Message Detail Modal ───────────────────────────────
function MessageDetail({
    message,
    onClose,
    onUpdate,
    onDelete,
    onMove,
}: {
    message: Message
    onClose: () => void
    onUpdate: (data: Partial<Message>) => void
    onDelete: () => void
    onMove: (status: string) => void
}) {
    const [notes, setNotes] = useState(message.notes || '')
    const [dealValue, setDealValue] = useState(message.dealValue || 0)
    const [isEditingNotes, setIsEditingNotes] = useState(false)
    const stage = PIPELINE_STAGES.find(s => s.key === message.status) || PIPELINE_STAGES[0]

    // Mark as read on open
    useEffect(() => {
        if (!message.read) onUpdate({ read: true })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const saveNotes = () => {
        onUpdate({ notes })
        setIsEditingNotes(false)
    }

    const saveDealValue = () => {
        onUpdate({ dealValue } as Partial<Message>)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div
                className="w-full max-w-2xl mx-4 cyber-card p-6 neon-border max-h-[85vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold">{message.name}</h2>
                        <a href={`mailto:${message.email}`} className="text-[var(--neon-cyan)] text-sm hover:underline">
                            {message.email}
                        </a>
                    </div>
                    <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xl">×</button>
                </div>

                {/* Status + Label row */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--text-muted)]">Stage:</span>
                        <select
                            value={message.status}
                            onChange={e => onMove(e.target.value)}
                            className="cyber-input text-sm py-1 w-36"
                        >
                            {PIPELINE_STAGES.map(s => (
                                <option key={s.key} value={s.key}>{s.icon} {s.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--text-muted)]">Label:</span>
                        <div className="flex gap-1">
                            {Object.entries(LABELS).map(([key, info]) => (
                                <button
                                    key={key}
                                    onClick={() => onUpdate({ label: message.label === key ? '' : key })}
                                    className={`text-xs px-2 py-1 rounded border transition-all ${message.label === key ? info.bg : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--border-hover)]'
                                        }`}
                                >
                                    {info.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Message details */}
                <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                            <div className="text-xs text-[var(--text-muted)] mb-1">Subject</div>
                            <div className="text-sm font-medium">{message.subject}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                            <div className="text-xs text-[var(--text-muted)] mb-1">Received</div>
                            <div className="text-sm">{new Date(message.createdAt).toLocaleString()}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {message.budget && (
                            <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                                <div className="text-xs text-[var(--text-muted)] mb-1">Budget Range</div>
                                <div className="text-sm font-medium text-green-400">💰 {message.budget}</div>
                            </div>
                        )}
                        {message.serviceType && (
                            <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                                <div className="text-xs text-[var(--text-muted)] mb-1">Service Type</div>
                                <div className="text-sm">{message.serviceType}</div>
                            </div>
                        )}
                        <div className="p-3 rounded-lg bg-[var(--neon-cyan)]/5 border border-[var(--neon-cyan)]/20 col-span-2">
                            <div className="text-xs text-[var(--text-muted)] mb-1">💵 Deal Value (USD)</div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-[var(--text-muted)]">$</span>
                                <input
                                    type="number"
                                    value={dealValue || ''}
                                    onChange={e => setDealValue(parseInt(e.target.value) || 0)}
                                    onBlur={saveDealValue}
                                    onKeyDown={e => e.key === 'Enter' && saveDealValue()}
                                    className="cyber-input text-sm py-1 flex-grow"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-[var(--bg-secondary)]">
                        <div className="text-xs text-[var(--text-muted)] mb-2">Message</div>
                        <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">{message.message}</p>
                    </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium">📝 Internal Notes</h3>
                        {!isEditingNotes && (
                            <button
                                onClick={() => setIsEditingNotes(true)}
                                className="text-xs text-[var(--neon-cyan)] hover:underline"
                            >
                                {notes ? 'Edit' : '+ Add note'}
                            </button>
                        )}
                    </div>
                    {isEditingNotes ? (
                        <div className="space-y-2">
                            <textarea
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                className="cyber-input text-sm min-h-[80px] resize-none w-full"
                                placeholder="Add private notes about this lead..."
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button onClick={saveNotes} className="cyber-btn text-xs py-1">Save</button>
                                <button
                                    onClick={() => { setNotes(message.notes); setIsEditingNotes(false) }}
                                    className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : notes ? (
                        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-sm text-[var(--text-secondary)] whitespace-pre-wrap">
                            {notes}
                        </div>
                    ) : (
                        <p className="text-xs text-[var(--text-muted)] italic">No notes yet</p>
                    )}
                </div>

                {/* Quick actions */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                    <div className="flex gap-2">
                        {/* Pipeline quick moves */}
                        {PIPELINE_STAGES.filter(s => s.key !== message.status).slice(0, 4).map(s => (
                            <button
                                key={s.key}
                                onClick={() => onMove(s.key)}
                                className={`text-xs px-2.5 py-1.5 rounded border transition-all hover:opacity-100 opacity-70 ${s.color}`}
                            >
                                {s.icon} {s.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <a
                            href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                            className="cyber-btn text-xs py-1.5"
                        >
                            ↗ Reply via Email
                        </a>
                        <button
                            onClick={onDelete}
                            className="text-xs text-red-400 hover:text-red-300"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
