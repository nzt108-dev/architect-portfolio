import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface SentryResult {
    projectId: string
    slug: string
    sentrySlug: string
    issueCount: number | null
    error: string | null
}

// GET /api/admin/sentry — fetch unresolved issue counts from Sentry API
export async function GET() {
    const token = process.env.SENTRY_AUTH_TOKEN
    const org = process.env.SENTRY_ORG_SLUG

    if (!token || !org) {
        return NextResponse.json({ error: 'SENTRY_AUTH_TOKEN or SENTRY_ORG_SLUG not configured' }, { status: 503 })
    }

    const projects = await prisma.project.findMany({
        select: { id: true, slug: true, sentrySlug: true },
        where: { sentrySlug: { not: '' } },
    })

    if (projects.length === 0) {
        return NextResponse.json({ results: [] })
    }

    const results: SentryResult[] = await Promise.all(
        projects.map(async (p) => {
            try {
                const url = `https://sentry.io/api/0/projects/${org}/${p.sentrySlug}/stats/?stat=received&resolution=1d&since=${Math.floor((Date.now() - 86400000) / 1000)}&until=${Math.floor(Date.now() / 1000)}`
                const res = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    next: { revalidate: 300 }, // cache 5 minutes
                })

                if (!res.ok) {
                    return { projectId: p.id, slug: p.slug, sentrySlug: p.sentrySlug, issueCount: null, error: `HTTP ${res.status}` }
                }

                // Stats returns array of [timestamp, count] pairs
                const data: [number, number][] = await res.json()
                const total = data.reduce((sum, [, count]) => sum + count, 0)

                return { projectId: p.id, slug: p.slug, sentrySlug: p.sentrySlug, issueCount: total, error: null }
            } catch (err) {
                return {
                    projectId: p.id, slug: p.slug, sentrySlug: p.sentrySlug,
                    issueCount: null, error: err instanceof Error ? err.message : 'unknown',
                }
            }
        })
    )

    return NextResponse.json({ results, fetchedAt: new Date().toISOString() })
}
