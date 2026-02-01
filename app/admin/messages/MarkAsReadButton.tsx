'use client'

import { useRouter } from 'next/navigation'

export function MarkAsReadButton({ id, read }: { id: string; read: boolean }) {
    const router = useRouter()

    const handleToggle = async () => {
        await fetch(`/api/contact/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ read: !read }),
        })
        router.refresh()
    }

    return (
        <button
            onClick={handleToggle}
            className="text-[var(--text-muted)] text-sm hover:text-[var(--text-secondary)]"
        >
            {read ? 'Mark as unread' : 'Mark as read'}
        </button>
    )
}
