'use client'

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/** Get UTM params from URL and sessionStorage (persisted for the session) */
export function getUtmParams(): { utmSource: string; utmMedium: string; utmCampaign: string } {
    if (typeof window === 'undefined') return { utmSource: '', utmMedium: '', utmCampaign: '' }

    // Check URL first, fallback to sessionStorage
    const params = new URLSearchParams(window.location.search)
    const utmSource = params.get('utm_source') || sessionStorage.getItem('utm_source') || ''
    const utmMedium = params.get('utm_medium') || sessionStorage.getItem('utm_medium') || ''
    const utmCampaign = params.get('utm_campaign') || sessionStorage.getItem('utm_campaign') || ''

    // Persist in sessionStorage so they survive navigation
    if (params.get('utm_source')) sessionStorage.setItem('utm_source', utmSource)
    if (params.get('utm_medium')) sessionStorage.setItem('utm_medium', utmMedium)
    if (params.get('utm_campaign')) sessionStorage.setItem('utm_campaign', utmCampaign)

    return { utmSource, utmMedium, utmCampaign }
}

/** Wrapper with Suspense boundary (required by Next.js for useSearchParams) */
export function AnalyticsTracker() {
    return (
        <Suspense fallback={null}>
            <TrackerInner />
        </Suspense>
    )
}

function TrackerInner() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Don't track admin pages
        if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return

        // Persist UTM params on first landing
        const sp = new URLSearchParams(searchParams.toString())
        if (sp.get('utm_source')) sessionStorage.setItem('utm_source', sp.get('utm_source')!)
        if (sp.get('utm_medium')) sessionStorage.setItem('utm_medium', sp.get('utm_medium')!)
        if (sp.get('utm_campaign')) sessionStorage.setItem('utm_campaign', sp.get('utm_campaign')!)

        const track = async () => {
            const { utmSource, utmMedium, utmCampaign } = getUtmParams()
            try {
                await fetch('/api/admin/analytics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        path: pathname,
                        referrer: document.referrer,
                        utmSource,
                        utmMedium,
                        utmCampaign,
                    }),
                })
            } catch {
                // Silently fail
            }
        }

        const timer = setTimeout(track, 300)
        return () => clearTimeout(timer)
    }, [pathname, searchParams])

    return null
}
