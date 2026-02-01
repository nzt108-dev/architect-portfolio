'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ProjectFormData {
    title: string
    slug: string
    description: string
    category: 'mobile' | 'telegram' | 'web'
    progress: number
    technologies: string
    githubUrl: string
    demoUrl: string
    featured: boolean
}

interface Props {
    initialData?: ProjectFormData & { id?: string }
    isEdit?: boolean
}

export default function ProjectForm({ initialData, isEdit }: Props) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState<ProjectFormData>(
        initialData || {
            title: '',
            slug: '',
            description: '',
            category: 'web',
            progress: 0,
            technologies: '',
            githubUrl: '',
            demoUrl: '',
            featured: false,
        }
    )

    // Auto-generate slug from title
    const handleTitleChange = (title: string) => {
        setFormData((prev) => ({
            ...prev,
            title,
            slug: isEdit ? prev.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        }))
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
