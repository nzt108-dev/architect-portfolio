'use client'

import { useState, useEffect } from 'react'

interface ContentBlock {
    key: string
    label: string
    type: 'text' | 'textarea' | 'richtext'
    placeholder: string
    maxLength?: number
}

interface ContentSection {
    title: string
    icon: string
    description: string
    blocks: ContentBlock[]
}

const CONTENT_SECTIONS: ContentSection[] = [
    {
        title: 'About Page',
        icon: '👤',
        description: 'Your personal bio and about section',
        blocks: [
            { key: 'about_heading', label: 'Page Heading', type: 'text', placeholder: 'About Me' },
            { key: 'about_intro', label: 'Introduction (shown at top)', type: 'textarea', placeholder: 'A brief introduction...' },
            { key: 'about_bio', label: 'Full Bio', type: 'richtext', placeholder: 'Detailed biography and professional background...' },
            { key: 'about_experience_years', label: 'Years of Experience', type: 'text', placeholder: '5+' },
            { key: 'about_projects_count', label: 'Projects Completed', type: 'text', placeholder: '50+' },
            { key: 'about_clients_count', label: 'Happy Clients', type: 'text', placeholder: '20+' },
        ],
    },
    {
        title: 'Services Page',
        icon: '🛠',
        description: 'Service offerings and process',
        blocks: [
            { key: 'services_heading', label: 'Page Heading', type: 'text', placeholder: 'What I Build' },
            { key: 'services_intro', label: 'Introduction', type: 'textarea', placeholder: 'I help businesses build...' },
            { key: 'services_process_title', label: 'Process Section Title', type: 'text', placeholder: 'How I Work' },
            { key: 'services_process_steps', label: 'Process Steps (one per line)', type: 'richtext', placeholder: 'Discovery & Planning\nDesign & Architecture\nDevelopment\nTesting & Launch' },
        ],
    },
    {
        title: 'Homepage',
        icon: '🏠',
        description: 'Landing page hero and sections',
        blocks: [
            { key: 'home_hero_title', label: 'Hero Title', type: 'text', placeholder: 'Software Architect' },
            { key: 'home_hero_subtitle', label: 'Hero Subtitle', type: 'textarea', placeholder: 'Building premium digital products...' },
            { key: 'home_hero_cta', label: 'CTA Button Text', type: 'text', placeholder: 'View My Work' },
            { key: 'home_why_title', label: '"Why Choose Me" Title', type: 'text', placeholder: 'Why Choose Me' },
            { key: 'home_process_title', label: '"How It Works" Title', type: 'text', placeholder: 'How It Works' },
        ],
    },
    {
        title: 'Footer & Global',
        icon: '🌐',
        description: 'Footer text and global content',
        blocks: [
            { key: 'footer_tagline', label: 'Footer Tagline', type: 'text', placeholder: 'Building the future, one line at a time.' },
            { key: 'footer_copyright', label: 'Copyright Text', type: 'text', placeholder: '© 2024 nzt108. All rights reserved.' },
            { key: 'global_cta_text', label: 'Global CTA Text', type: 'text', placeholder: 'Ready to start your project?' },
        ],
    },
]

export default function ContentPage() {
    const [content, setContent] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [modified, setModified] = useState<Set<string>>(new Set())
    const [activeSection, setActiveSection] = useState(0)

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                const map: Record<string, string> = {}
                data.forEach((s: { key: string; value: string }) => { map[s.key] = s.value })
                setContent(map)
            })
            .catch(console.error)
            .finally(() => setIsLoading(false))
    }, [])

    const updateContent = (key: string, value: string) => {
        setContent(prev => ({ ...prev, [key]: value }))
        setModified(prev => new Set(prev).add(key))
    }

    const handleSave = async () => {
        setIsSaving(true)
        setMessage(null)
        try {
            const entries = Array.from(modified).map(key => ({ key, value: content[key] || '' }))
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings: entries }),
            })
            if (res.ok) {
                setMessage({ type: 'success', text: `Saved ${entries.length} field(s)!` })
                setModified(new Set())
            } else {
                setMessage({ type: 'error', text: 'Failed to save' })
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

    const section = CONTENT_SECTIONS[activeSection]

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Content Editor</h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">Edit your site&apos;s text content</p>
                </div>
                <div className="flex items-center gap-3">
                    {modified.size > 0 && (
                        <span className="text-xs text-amber-400 animate-pulse">{modified.size} unsaved</span>
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

            {message && (
                <div className={`mb-6 p-3 rounded-lg text-sm ${message.type === 'success'
                    ? 'bg-green-500/15 border border-green-500/30 text-green-400'
                    : 'bg-red-500/15 border border-red-500/30 text-red-400'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Section Navigation */}
                <div className="space-y-1">
                    {CONTENT_SECTIONS.map((s, idx) => {
                        const sectionModified = s.blocks.some(b => modified.has(b.key))
                        return (
                            <button
                                key={idx}
                                onClick={() => setActiveSection(idx)}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3 ${activeSection === idx
                                    ? 'bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/30'
                                    : 'hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                                    }`}
                            >
                                <span>{s.icon}</span>
                                <span>{s.title}</span>
                                {sectionModified && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-auto" />}
                            </button>
                        )
                    })}
                </div>

                {/* Content Fields */}
                <div className="lg:col-span-3 cyber-card p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl">{section.icon}</span>
                        <div>
                            <h2 className="font-semibold text-lg">{section.title}</h2>
                            <p className="text-xs text-[var(--text-muted)]">{section.description}</p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        {section.blocks.map(block => (
                            <div key={block.key}>
                                <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                                    {block.label}
                                    {modified.has(block.key) && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                    )}
                                </label>
                                {block.type === 'text' ? (
                                    <input
                                        type="text"
                                        value={content[block.key] || ''}
                                        onChange={e => updateContent(block.key, e.target.value)}
                                        className="cyber-input text-sm"
                                        placeholder={block.placeholder}
                                        maxLength={block.maxLength}
                                    />
                                ) : (
                                    <textarea
                                        value={content[block.key] || ''}
                                        onChange={e => updateContent(block.key, e.target.value)}
                                        className="cyber-input text-sm w-full resize-none"
                                        placeholder={block.placeholder}
                                        rows={block.type === 'richtext' ? 6 : 3}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
