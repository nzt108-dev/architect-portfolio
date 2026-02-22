'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function AnalyticsTracker() {
    const pathname = usePathname()

    useEffect(() => {
        // Don't track admin pages
        if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return

        const track = async () => {
            try {
                await fetch('/api/admin/analytics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        path: pathname,
                        referrer: document.referrer,
                    }),
                })
            } catch {
                // Silently fail
            }
        }

        // Small delay to avoid tracking on instant navigation
        const timer = setTimeout(track, 300)
        return () => clearTimeout(timer)
    }, [pathname])

    return null
}
