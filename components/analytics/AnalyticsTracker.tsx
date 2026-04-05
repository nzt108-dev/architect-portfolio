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

/** Fire a Facebook Pixel event (safe - checks if fbq exists) */
export function trackFBEvent(event: string, params?: Record<string, string | number>) {
    if (typeof window !== 'undefined' && (window as any).fbq) {
        if (params) {
            (window as any).fbq('track', event, params)
        } else {
            (window as any).fbq('track', event)
        }
    }
}

import Script from 'next/script'

/** Wrapper with Suspense boundary (required by Next.js for useSearchParams) */
export function AnalyticsTracker() {
    return (
        <Suspense fallback={null}>
            <TrackerInner />

            {/* Facebook Pixel */}
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

            {/* Facebook Pixel noscript fallback */}
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src="https://www.facebook.com/tr?id=855170140857689&ev=PageView&noscript=1"
                    alt=""
                />
            </noscript>

            {/* Microsoft Clarity — free heatmaps & session recordings */}
            <Script id="ms-clarity" strategy="afterInteractive">
                {`
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "CLARITY_ID_PLACEHOLDER");
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

        // Track FB Pixel PageView on route change (SPA navigation)
        if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'PageView')
        }

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

    // Track scroll depth for FB Pixel ViewContent
    useEffect(() => {
        if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return

        let viewContentFired = false
        let scrollDepth25 = false
        let scrollDepth50 = false
        let scrollDepth75 = false

        const handleScroll = () => {
            const scrollPct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100

            // Fire ViewContent when user scrolls past 25% (engaged user)
            if (scrollPct > 25 && !viewContentFired) {
                viewContentFired = true
                trackFBEvent('ViewContent', { content_name: pathname })
            }

            // Track scroll milestones for custom audiences
            if (scrollPct > 25 && !scrollDepth25) {
                scrollDepth25 = true
                trackFBEvent('CustomEvent', { event_name: 'scroll_25' } as any)
            }
            if (scrollPct > 50 && !scrollDepth50) {
                scrollDepth50 = true
                trackFBEvent('CustomEvent', { event_name: 'scroll_50' } as any)
            }
            if (scrollPct > 75 && !scrollDepth75) {
                scrollDepth75 = true
                trackFBEvent('CustomEvent', { event_name: 'scroll_75' } as any)
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [pathname])

    // Track time on page
    useEffect(() => {
        if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return

        // If user stays 30+ seconds, they're interested
        const timer = setTimeout(() => {
            trackFBEvent('CustomEvent', { event_name: 'engaged_30s' } as any)
        }, 30000)

        return () => clearTimeout(timer)
    }, [pathname])

    return null
}
