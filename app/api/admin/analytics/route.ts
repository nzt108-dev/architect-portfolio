import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// POST - Track a page view
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { path } = body

        if (!path) {
            return NextResponse.json({ error: 'path required' }, { status: 400 })
        }

        // Parse user agent
        const ua = request.headers.get('user-agent') || ''
        const referer = request.headers.get('referer') || body.referrer || ''

        let device = 'desktop'
        if (/mobile|android|iphone|ipad/i.test(ua)) {
            device = /ipad|tablet/i.test(ua) ? 'tablet' : 'mobile'
        }

        let browser = 'Other'
        if (/chrome/i.test(ua) && !/edge/i.test(ua)) browser = 'Chrome'
        else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari'
        else if (/firefox/i.test(ua)) browser = 'Firefox'
        else if (/edge/i.test(ua)) browser = 'Edge'

        // Get country from header (set by Vercel/Cloudflare)
        const country = request.headers.get('x-vercel-ip-country') ||
            request.headers.get('cf-ipcountry') || ''

        await prisma.pageView.create({
            data: {
                path,
                referrer: referer,
                device,
                browser,
                country,
                utmSource: body.utmSource || '',
                utmMedium: body.utmMedium || '',
                utmCampaign: body.utmCampaign || '',
            },
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('Analytics tracking error:', error)
        return NextResponse.json({ ok: true }) // Don't fail silently
    }
}

// GET - Fetch analytics data
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const days = parseInt(searchParams.get('days') || '30')
        const since = new Date(Date.now() - days * 86400000)

        const views = await prisma.pageView.findMany({
            where: { createdAt: { gte: since } },
            orderBy: { createdAt: 'desc' },
        })

        // Aggregate data
        const totalViews = views.length

        // Views by day
        const byDay: Record<string, number> = {}
        views.forEach(v => {
            const day = v.createdAt.toISOString().split('T')[0]
            byDay[day] = (byDay[day] || 0) + 1
        })

        // Top pages
        const byPage: Record<string, number> = {}
        views.forEach(v => { byPage[v.path] = (byPage[v.path] || 0) + 1 })
        const topPages = Object.entries(byPage)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([path, count]) => ({ path, count }))

        // Referrers
        const byReferrer: Record<string, number> = {}
        views.forEach(v => {
            if (!v.referrer) return
            try {
                const host = new URL(v.referrer).hostname
                byReferrer[host] = (byReferrer[host] || 0) + 1
            } catch {
                byReferrer[v.referrer] = (byReferrer[v.referrer] || 0) + 1
            }
        })
        const topReferrers = Object.entries(byReferrer)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([source, count]) => ({ source, count }))

        // Device breakdown
        const byDevice: Record<string, number> = {}
        views.forEach(v => { byDevice[v.device || 'unknown'] = (byDevice[v.device || 'unknown'] || 0) + 1 })

        // Browser breakdown
        const byBrowser: Record<string, number> = {}
        views.forEach(v => { byBrowser[v.browser || 'Other'] = (byBrowser[v.browser || 'Other'] || 0) + 1 })

        // Country breakdown
        const byCountry: Record<string, number> = {}
        views.forEach(v => { if (v.country) byCountry[v.country] = (byCountry[v.country] || 0) + 1 })
        const topCountries = Object.entries(byCountry)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([country, count]) => ({ country, count }))

        // Unique visitors (approximate by day + device + browser)
        const uniqueVisitors = new Set(
            views.map(v => `${v.createdAt.toISOString().split('T')[0]}-${v.device}-${v.browser}`)
        ).size

        return NextResponse.json({
            totalViews,
            uniqueVisitors,
            days,
            byDay,
            topPages,
            topReferrers,
            byDevice,
            byBrowser,
            topCountries,
        })
    } catch (error) {
        console.error('Analytics GET error:', error)
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}
