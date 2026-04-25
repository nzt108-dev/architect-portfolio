import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface HealthResult {
    projectId: string
    slug: string
    url: string
    status: 'up' | 'down' | 'unknown'
    latency: number | null
    statusCode: number | null
}

// GET /api/admin/health — ping all project deployUrls
export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            select: { id: true, slug: true, deployUrl: true },
            where: { deployUrl: { not: '' } },
        })

        const results: HealthResult[] = await Promise.all(
            projects.map(async (p) => {
                if (!p.deployUrl) {
                    return { projectId: p.id, slug: p.slug, url: '', status: 'unknown', latency: null, statusCode: null }
                }

                const start = Date.now()
                try {
                    const controller = new AbortController()
                    const timeoutId = setTimeout(() => controller.abort(), 5000)

                    const res = await fetch(p.deployUrl, {
                        method: 'HEAD',
                        signal: controller.signal,
                        headers: { 'User-Agent': 'nzt108-healthcheck/1.0' },
                    })
                    clearTimeout(timeoutId)

                    const latency = Date.now() - start
                    return {
                        projectId: p.id,
                        slug: p.slug,
                        url: p.deployUrl,
                        status: res.ok || res.status < 400 ? 'up' : 'down',
                        latency,
                        statusCode: res.status,
                    }
                } catch {
                    return {
                        projectId: p.id,
                        slug: p.slug,
                        url: p.deployUrl,
                        status: 'down',
                        latency: Date.now() - start,
                        statusCode: null,
                    }
                }
            })
        )

        return NextResponse.json({ results, checkedAt: new Date().toISOString() })
    } catch (error) {
        console.error('GET /api/admin/health error:', error)
        return NextResponse.json({ error: 'Failed to check health' }, { status: 500 })
    }
}
