'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface SocialLink {
    id?: string
    name: string
    url: string
    icon: string
}

const iconOptions = [
    { value: 'github', label: '💻 GitHub' },
    { value: 'telegram', label: '✈️ Telegram' },
    { value: 'linkedin', label: '💼 LinkedIn' },
    { value: 'email', label: '📧 Email' },
    { value: 'twitter', label: '🐦 Twitter/X' },
    { value: 'instagram', label: '📸 Instagram' },
    { value: 'youtube', label: '🎬 YouTube' },
    { value: 'discord', label: '🎮 Discord' },
    { value: 'website', label: '🌐 Website' },
]

export default function ContactsAdminPage() {
    const [links, setLinks] = useState<SocialLink[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    useEffect(() => {
        fetchLinks()
    }, [])

    const fetchLinks = async () => {
        try {
            const response = await fetch('/api/social-links')
            if (response.ok) {
                const data = await response.json()
                setLinks(data)
            }
        } catch (error) {
            console.error('Error fetching links:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const addLink = () => {
        setLinks((prev) => [
            ...prev,
            { name: '', url: '', icon: 'website' }
        ])
    }

    const updateLink = (index: number, field: keyof SocialLink, value: string) => {
        setLinks((prev) => {
            const updated = [...prev]
            updated[index] = { ...updated[index], [field]: value }
            return updated
        })
    }

    const removeLink = (index: number) => {
        setLinks((prev) => prev.filter((_, i) => i !== index))
    }

    const moveLink = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === links.length - 1)
        ) return

        setLinks((prev) => {
            const updated = [...prev]
            const targetIndex = direction === 'up' ? index - 1 : index + 1
            const temp = updated[index]
            updated[index] = updated[targetIndex]
            updated[targetIndex] = temp
            return updated
        })
    }

    const handleSave = async () => {
        setIsSaving(true)
        setMessage(null)

        try {
            const response = await fetch('/api/social-links', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ links: links.filter(l => l.name && l.url) }),
            })

            if (response.ok) {
                const data = await response.json()
                setLinks(data)
                setMessage({ type: 'success', text: 'Contacts saved successfully!' })
            } else {
                setMessage({ type: 'error', text: 'Failed to save contacts' })
            }
        } catch {
            setMessage({ type: 'error', text: 'Connection error' })
        } finally {
            setIsSaving(false)
            setTimeout(() => setMessage(null), 3000)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--neon-cyan)]" />
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Contacts & Social Links</h1>
                <Link href="/admin" className="text-[var(--text-secondary)] hover:text-[var(--neon-cyan)]">
                    ← Back to Dashboard
                </Link>
            </div>

            <div className="max-w-2xl space-y-6">
                {/* Info */}
                <div className="cyber-card p-4 border-l-4 border-[var(--neon-cyan)]">
                    <p className="text-sm text-[var(--text-secondary)]">
                        These links appear in the footer and contact page. For email, use <code className="text-[var(--neon-cyan)]">mailto:your@email.com</code> as the URL.
                    </p>
                </div>

                {/* Links List */}
                <div className="space-y-4">
                    {links.length === 0 ? (
                        <div className="cyber-card p-6 text-center text-[var(--text-muted)]">
                            No contacts added yet. Click &quot;Add Contact&quot; to add one.
                        </div>
                    ) : (
                        links.map((link, index) => (
                            <div
                                key={index}
                                className="cyber-card p-4 flex gap-4 items-start"
                            >
                                {/* Order controls */}
                                <div className="flex flex-col gap-1">
                                    <button
                                        type="button"
                                        onClick={() => moveLink(index, 'up')}
                                        disabled={index === 0}
                                        className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30"
                                    >
                                        ▲
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveLink(index, 'down')}
                                        disabled={index === links.length - 1}
                                        className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30"
                                    >
                                        ▼
                                    </button>
                                </div>

                                {/* Fields */}
                                <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Icon */}
                                    <div>
                                        <label className="block text-xs text-[var(--text-muted)] mb-1">Type</label>
                                        <select
                                            value={link.icon}
                                            onChange={(e) => updateLink(index, 'icon', e.target.value)}
                                            className="cyber-input text-sm"
                                        >
                                            {iconOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Name */}
                                    <div>
                                        <label className="block text-xs text-[var(--text-muted)] mb-1">Label</label>
                                        <input
                                            type="text"
                                            value={link.name}
                                            onChange={(e) => updateLink(index, 'name', e.target.value)}
                                            className="cyber-input text-sm"
                                            placeholder="GitHub"
                                        />
                                    </div>

                                    {/* URL */}
                                    <div>
                                        <label className="block text-xs text-[var(--text-muted)] mb-1">URL</label>
                                        <input
                                            type="text"
                                            value={link.url}
                                            onChange={(e) => updateLink(index, 'url', e.target.value)}
                                            className="cyber-input text-sm"
                                            placeholder="https://github.com/..."
                                        />
                                    </div>
                                </div>

                                {/* Delete */}
                                <button
                                    type="button"
                                    onClick={() => removeLink(index)}
                                    className="text-red-400 hover:text-red-300 mt-5"
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={addLink}
                        className="px-4 py-2 rounded border border-[var(--neon-cyan)] text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10 transition-colors"
                    >
                        + Add Contact
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="cyber-btn"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                {/* Status Message */}
                {message && (
                    <div className={`p-4 rounded-lg ${message.type === 'success'
                            ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                            : 'bg-red-500/20 border border-red-500/40 text-red-400'
                        }`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    )
}
