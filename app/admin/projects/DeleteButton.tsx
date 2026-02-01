'use client'

import { useRouter } from 'next/navigation'

export function DeleteProjectButton({ id, title }: { id: string; title: string }) {
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return

        await fetch(`/api/projects/by-id/${id}`, { method: 'DELETE' })
        router.refresh()
    }

    return (
        <button
            onClick={handleDelete}
            className="px-3 py-1.5 rounded text-sm text-red-400 hover:bg-red-500/20 transition-all"
        >
            Delete
        </button>
    )
}
