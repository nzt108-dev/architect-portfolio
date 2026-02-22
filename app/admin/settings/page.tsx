'use client'

import { useState, useEffect } from 'react'

interface SettingGroup {
    title: string
    icon: string
    description: string
    settings: {
        key: string
        label: string
        type: 'text' | 'textarea' | 'url'
        placeholder: string
        description?: string
    }[]
}

const SETTING_GROUPS: SettingGroup[] = [
    {
        title: 'Hero Section',
        icon: '🏠',
        description: 'Main landing page hero content',
        settings: [
            { key: 'hero_title', label: 'Title', type: 'text', placeholder: 'Software Architect' },
            { key: 'hero_subtitle', label: 'Subtitle', type: 'text', placeholder: 'Building digital products...' },
            { key: 'hero_cta_text', label: 'CTA Button Text', type: 'text', placeholder: 'View My Work' },
            { key: 'hero_cta_url', label: 'CTA Button URL', type: 'url', placeholder: '/projects' },
        ],
    },
    {
        title: 'SEO & Meta',
        icon: '🔍',
        description: 'Search engine optimization settings',
        settings: [
            { key: 'seo_title', label: 'Site Title', type: 'text', placeholder: 'nzt108_dev | Software Architect' },
            { key: 'seo_description', label: 'Meta Description', type: 'textarea', placeholder: 'Professional software architect building...', description: 'Appears in Google search results (max 160 chars)' },
            { key: 'seo_og_image', label: 'OG Image URL', type: 'url', placeholder: 'https://nzt108.dev/og-image.png', description: 'Image shown when sharing on social media' },
            { key: 'seo_keywords', label: 'Keywords', type: 'text', placeholder: 'software architect, developer, portfolio', description: 'Comma-separated keywords' },
        ],
    },
    {
        title: 'About Page',
        icon: '👤',
        description: 'About section content',
        settings: [
            { key: 'about_title', label: 'About Title', type: 'text', placeholder: 'About Me' },
            { key: 'about_bio', label: 'Bio Text', type: 'textarea', placeholder: 'I build digital products...' },
            { key: 'about_experience', label: 'Years of Experience', type: 'text', placeholder: '5+' },
        ],
    },
    {
        title: 'Contact & Business',
        icon: '💼',
        description: 'Business settings',
        settings: [
            { key: 'contact_email', label: 'Contact Email', type: 'text', placeholder: 'hello@nzt108.dev' },
            { key: 'contact_calendly', label: 'Calendly URL', type: 'url', placeholder: 'https://calendly.com/...' },
            { key: 'business_location', label: 'Location', type: 'text', placeholder: 'San Francisco, CA' },
            { key: 'business_availability', label: 'Availability Status', type: 'text', placeholder: 'Available for projects', description: 'e.g. "Available", "Booked until March", "Limited availability"' },
        ],
    },
]

export default function SettingsPage() {
    const [settings, setSettings] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [modified, setModified] = useState<Set<string>>(new Set())

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                const map: Record<string, string> = {}
                data.forEach((s: { key: string; value: string }) => { map[s.key] = s.value })
                setSettings(map)
            })
            .catch(console.error)
            .finally(() => setIsLoading(false))
    }, [])

    const updateSetting = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }))
        setModified(prev => new Set(prev).add(key))
    }

    const handleSave = async () => {
        setIsSaving(true)
        setMessage(null)
        try {
            const entries = Array.from(modified).map(key => ({
                key,
                value: settings[key] || '',
            }))

            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings: entries }),
            })

            if (res.ok) {
                setMessage({ type: 'success', text: `Saved ${entries.length} setting(s)!` })
                setModified(new Set())
            } else {
                setMessage({ type: 'error', text: 'Failed to save settings' })
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
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--neon-cyan)]" />
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Site Settings</h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">Configure your website content & SEO</p>
                </div>
                <div className="flex items-center gap-3">
                    {modified.size > 0 && (
                        <span className="text-xs text-amber-400">{modified.size} unsaved</span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isSaving || modified.size === 0}
                        className="cyber-btn disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Status Message */}
            {message && (
                <div className={`mb-6 p-3 rounded-lg text-sm ${message.type === 'success'
                    ? 'bg-green-500/15 border border-green-500/30 text-green-400'
                    : 'bg-red-500/15 border border-red-500/30 text-red-400'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Settings Groups */}
            <div className="space-y-6 max-w-3xl">
                {SETTING_GROUPS.map(group => (
                    <div key={group.title} className="cyber-card p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xl">{group.icon}</span>
                            <div>
                                <h2 className="font-semibold">{group.title}</h2>
                                <p className="text-xs text-[var(--text-muted)]">{group.description}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {group.settings.map(setting => (
                                <div key={setting.key}>
                                    <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-1">
                                        {setting.label}
                                        {modified.has(setting.key) && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                        )}
                                    </label>
                                    {setting.description && (
                                        <p className="text-xs text-[var(--text-muted)] mb-1">{setting.description}</p>
                                    )}
                                    {setting.type === 'textarea' ? (
                                        <textarea
                                            value={settings[setting.key] || ''}
                                            onChange={e => updateSetting(setting.key, e.target.value)}
                                            className="cyber-input text-sm min-h-[80px] resize-none w-full"
                                            placeholder={setting.placeholder}
                                        />
                                    ) : (
                                        <input
                                            type={setting.type === 'url' ? 'url' : 'text'}
                                            value={settings[setting.key] || ''}
                                            onChange={e => updateSetting(setting.key, e.target.value)}
                                            className="cyber-input text-sm"
                                            placeholder={setting.placeholder}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
