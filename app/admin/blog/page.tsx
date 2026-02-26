'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Article {
    id: string
    title: string
    slug: string
    status: string
    publishedAt: string | null
    createdAt: string
}

export default function BlogAdminPage() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetchArticles()
    }, [])

    const fetchArticles = async () => {
        try {
            const res = await fetch('/api/admin/blog')
            const data = await res.json()
            if (Array.isArray(data)) {
                setArticles(data)
            }
        } catch (error) {
            console.error('Failed to load articles:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleGenerate = async () => {
        setGenerating(true)
        setMessage('Generating article via OpenRouter LLM... This may take up to 20-30 seconds.')
        try {
            const res = await fetch('/api/cron/generate-article')
            const data = await res.json()
            if (res.ok && data.success) {
                setMessage(`Generated successfully: ${data.article} (Source: ${data.sourceNews})`)
                fetchArticles()
            } else {
                setMessage(`Error: ${data.error || 'Failed to generate'}`)
            }
        } catch (error: any) {
            setMessage(`Exception: ${error.message}`)
        } finally {
            setGenerating(false)
        }
    }

    const handleDelete = async (id: string, slug: string) => {
        if (!confirm(`Are you sure you want to delete "${slug}"?`)) return
        try {
            const res = await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setArticles(articles.filter(a => a.id !== id))
            } else {
                alert('Failed to delete article')
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('Error deleting article')
        }
    }

    if (loading) return <div className="animate-pulse flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[var(--neon-cyan)]"></div>Loading artifacts...</div>

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">AI Blog Engine</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Manage automated SEO articles and generate new content.</p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="flex items-center gap-2 bg-[var(--bg-primary)] border border-green-500/50 text-green-400 px-6 py-2.5 rounded-lg hover:bg-green-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm uppercase tracking-wider"
                >
                    {generating ? (
                        <>
                            <span className="w-4 h-4 rounded-full border-2 border-green-400 border-t-transparent animate-spin" />
                            [GENERATING...]
                        </>
                    ) : (
                        '🤖 Trigger AI Content'
                    )}
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg font-mono text-sm ${message.includes('Error') || message.includes('Exception') ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-green-500/10 text-green-400 border border-green-500/30'}`}>
                    {message}
                </div>
            )}

            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#1a1a1a] font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-color)]">
                        <tr>
                            <th className="px-6 py-4 font-normal">Article Info</th>
                            <th className="px-6 py-4 font-normal">Date Published</th>
                            <th className="px-6 py-4 font-normal">Status</th>
                            <th className="px-6 py-4 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {articles.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-[var(--text-muted)]">
                                    No artifacts found. Trigger the AI Generator to analyze RSS and produce a new article.
                                </td>
                            </tr>
                        ) : (
                            articles.map((article) => (
                                <tr key={article.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-[var(--text-primary)] mb-1">
                                            {article.title}
                                        </div>
                                        <div className="font-mono text-xs text-[var(--text-secondary)] flex items-center gap-2">
                                            <Link href={`/blog/${article.slug}`} target="_blank" className="hover:text-[var(--neon-cyan)] hover:underline truncate max-w-[300px] block">
                                                /blog/{article.slug}
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm text-[var(--text-secondary)]">
                                        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono tracking-widest bg-green-500/10 text-green-400 border border-green-500/20">
                                            {article.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(article.id, article.slug)}
                                            className="text-xs font-mono uppercase text-red-500 hover:text-red-400 transition-colors bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
