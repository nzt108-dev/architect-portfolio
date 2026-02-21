'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface RoadmapItem {
    id?: string
    title: string
    status: 'done' | 'in-progress' | 'planned'
    order: number
}

interface ProjectFormData {
    title: string
    slug: string
    description: string
    longDescription: string
    ideaText: string
    clientBenefit: string
    screenshots: string
    category: 'mobile' | 'telegram' | 'web'
    progress: number
    technologies: string
    githubUrl: string
    demoUrl: string
    featured: boolean
}

interface Props {
    initialData?: ProjectFormData & { id?: string }
    initialRoadmap?: RoadmapItem[]
    isEdit?: boolean
}

export default function ProjectForm({ initialData, initialRoadmap, isEdit }: Props) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState<ProjectFormData>(
        initialData || {
            title: '',
            slug: '',
            description: '',
            longDescription: '',
            ideaText: '',
            clientBenefit: '',
            screenshots: '',
            category: 'web',
            progress: 0,
            technologies: '',
            githubUrl: '',
            demoUrl: '',
            featured: false,
        }
    )

    const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>(
        initialRoadmap || []
    )

    // Auto-generate slug from title
    const handleTitleChange = (title: string) => {
        setFormData((prev) => ({
            ...prev,
            title,
            slug: isEdit ? prev.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        }))
    }

    // Roadmap handlers
    const addRoadmapItem = () => {
        setRoadmapItems((prev) => [
            ...prev,
            { title: '', status: 'planned', order: prev.length }
        ])
    }

    const updateRoadmapItem = (index: number, field: keyof RoadmapItem, value: string) => {
        setRoadmapItems((prev) => {
            const updated = [...prev]
            if (field === 'status') {
                updated[index] = { ...updated[index], status: value as RoadmapItem['status'] }
            } else if (field === 'title') {
                updated[index] = { ...updated[index], title: value }
            }
            return updated
        })
    }

    const removeRoadmapItem = (index: number) => {
        setRoadmapItems((prev) => {
            const updated = prev.filter((_, i) => i !== index)
            return updated.map((item, i) => ({ ...item, order: i }))
        })
    }

    const moveRoadmapItem = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === roadmapItems.length - 1)
        ) return

        setRoadmapItems((prev) => {
            const updated = [...prev]
            const targetIndex = direction === 'up' ? index - 1 : index + 1
            const temp = updated[index]
            updated[index] = updated[targetIndex]
            updated[targetIndex] = temp
            return updated.map((item, i) => ({ ...item, order: i }))
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        try {
            const url = isEdit
                ? `/api/projects/${formData.slug}`
                : '/api/projects'

            const method = isEdit ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
                    screenshots: JSON.stringify(formData.screenshots.split('\n').map(s => s.trim()).filter(Boolean)),
                    roadmapItems: roadmapItems.filter(item => item.title.trim()),
                }),
            })

            if (response.ok) {
                router.push('/admin/projects')
                router.refresh()
            } else {
                const data = await response.json()
                setError(data.error || 'Failed to save project')
            }
        } catch {
            setError('Connection error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const statusColors = {
        'done': 'bg-green-500/20 border-green-500 text-green-400',
        'in-progress': 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
        'planned': 'bg-gray-500/20 border-gray-500 text-gray-400',
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            {/* Title */}
            <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="cyber-input"
                    placeholder="My Awesome Project"
                    required
                />
            </div>

            {/* Slug */}
            <div>
                <label className="block text-sm font-medium mb-2">Slug *</label>
                <div className="flex items-center gap-2">
                    <span className="text-[var(--text-muted)]">/projects/</span>
                    <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                        className="cyber-input flex-grow"
                        placeholder="my-awesome-project"
                        required
                    />
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="cyber-input min-h-[120px] resize-none"
                    placeholder="Brief description of the project..."
                    required
                />
            </div>

            {/* Long Description (Case Study) */}
            <div>
                <label className="block text-sm font-medium mb-2">Detailed Description</label>
                <textarea
                    value={formData.longDescription}
                    onChange={(e) => setFormData((prev) => ({ ...prev, longDescription: e.target.value }))}
                    className="cyber-input min-h-[150px] resize-none"
                    placeholder="Detailed case study description — what the project does, the problem it solves, and why it matters..."
                />
            </div>

            {/* The Idea */}
            <div>
                <label className="block text-sm font-medium mb-2">💡 The Idea</label>
                <textarea
                    value={formData.ideaText}
                    onChange={(e) => setFormData((prev) => ({ ...prev, ideaText: e.target.value }))}
                    className="cyber-input min-h-[100px] resize-none"
                    placeholder="What inspired this project? What problem does it solve?"
                />
            </div>

            {/* Client Benefit */}
            <div>
                <label className="block text-sm font-medium mb-2">🎯 What You Get (Client Benefit)</label>
                <textarea
                    value={formData.clientBenefit}
                    onChange={(e) => setFormData((prev) => ({ ...prev, clientBenefit: e.target.value }))}
                    className="cyber-input min-h-[100px] resize-none"
                    placeholder="What does the client get? What results were achieved?"
                />
            </div>

            {/* Screenshots */}
            <div>
                <label className="block text-sm font-medium mb-2">📸 Screenshot URLs (one per line)</label>
                <textarea
                    value={formData.screenshots}
                    onChange={(e) => setFormData((prev) => ({ ...prev, screenshots: e.target.value }))}
                    className="cyber-input min-h-[100px] resize-none"
                    placeholder={"https://example.com/screenshot1.png\nhttps://example.com/screenshot2.png"}
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">Paste direct image URLs, one per line</p>
            </div>

            {/* Category & Progress */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as 'mobile' | 'telegram' | 'web' }))}
                        className="cyber-input"
                    >
                        <option value="mobile">📱 Mobile App</option>
                        <option value="telegram">🤖 Telegram Bot</option>
                        <option value="web">🌐 Web Service</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Progress: {formData.progress}%
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={formData.progress}
                        onChange={(e) => setFormData((prev) => ({ ...prev, progress: parseInt(e.target.value) }))}
                        className="w-full accent-[var(--neon-cyan)]"
                    />
                </div>
            </div>

            {/* Technologies */}
            <div>
                <label className="block text-sm font-medium mb-2">Technologies</label>
                <input
                    type="text"
                    value={formData.technologies}
                    onChange={(e) => setFormData((prev) => ({ ...prev, technologies: e.target.value }))}
                    className="cyber-input"
                    placeholder="React, TypeScript, Node.js (comma-separated)"
                />
            </div>

            {/* URLs */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2">GitHub URL</label>
                    <input
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))}
                        className="cyber-input"
                        placeholder="https://github.com/..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Demo URL</label>
                    <input
                        type="url"
                        value={formData.demoUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, demoUrl: e.target.value }))}
                        className="cyber-input"
                        placeholder="https://..."
                    />
                </div>
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                    className="w-5 h-5 accent-[var(--neon-cyan)]"
                />
                <label htmlFor="featured" className="text-sm font-medium">
                    Featured on homepage
                </label>
            </div>

            {/* Roadmap / Tasks */}
            <div className="pt-6 border-t border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-4">
                    <label className="block text-lg font-semibold">
                        📋 Roadmap / Tasks
                    </label>
                    <button
                        type="button"
                        onClick={addRoadmapItem}
                        className="text-sm px-3 py-1 rounded border border-[var(--neon-cyan)] text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10 transition-colors"
                    >
                        + Add Task
                    </button>
                </div>

                {roadmapItems.length === 0 ? (
                    <p className="text-[var(--text-muted)] text-sm italic">
                        No tasks yet. Click &quot;Add Task&quot; to add roadmap items.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {roadmapItems.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]"
                            >
                                {/* Order controls */}
                                <div className="flex flex-col gap-1">
                                    <button
                                        type="button"
                                        onClick={() => moveRoadmapItem(index, 'up')}
                                        disabled={index === 0}
                                        className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30"
                                    >
                                        ▲
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveRoadmapItem(index, 'down')}
                                        disabled={index === roadmapItems.length - 1}
                                        className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30"
                                    >
                                        ▼
                                    </button>
                                </div>

                                {/* Title input */}
                                <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => updateRoadmapItem(index, 'title', e.target.value)}
                                    className="flex-grow px-3 py-2 rounded bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-[var(--neon-cyan)]"
                                    placeholder="Task description..."
                                />

                                {/* Status select */}
                                <select
                                    value={item.status}
                                    onChange={(e) => updateRoadmapItem(index, 'status', e.target.value)}
                                    className={`px-3 py-2 rounded border text-sm font-medium ${statusColors[item.status]}`}
                                >
                                    <option value="planned">📋 Planned</option>
                                    <option value="in-progress">🔄 In Progress</option>
                                    <option value="done">✅ Done</option>
                                </select>

                                {/* Delete button */}
                                <button
                                    type="button"
                                    onClick={() => removeRoadmapItem(index)}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400">
                    {error}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cyber-btn"
                >
                    {isSubmitting ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
                </button>
                <Link
                    href="/admin/projects"
                    className="px-6 py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                    Cancel
                </Link>
            </div>
        </form>
    )
}
