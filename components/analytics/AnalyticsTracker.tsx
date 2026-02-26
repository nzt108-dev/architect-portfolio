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

import Script from 'next/script'

/** Wrapper with Suspense boundary (required by Next.js for useSearchParams) */
export function AnalyticsTracker() {
    return (
        <Suspense fallback={null}>
            <TrackerInner />
            <Script id="meta-pixel" strategy="afterInteractive">
                {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '855170140857689');
                fbq('track', 'PageView');
                `}
            </Script>
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
