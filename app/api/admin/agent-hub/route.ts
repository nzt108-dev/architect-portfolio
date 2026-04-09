import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/admin/agent-hub — get all suggestions with filters
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const type = searchParams.get('type')
        const projectId = searchParams.get('projectId')

        const where: Record<string, unknown> = {}
        if (status && status !== 'all') where.status = status
        if (type && type !== 'all') where.type = type
        if (projectId) where.projectId = projectId

        const [suggestions, pending, approvedToday, implemented, total, projects] = await Promise.all([
            prisma.agentSuggestion.findMany({
                where,
                include: {
                    project: { select: { title: true, slug: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.agentSuggestion.count({ where: { status: 'pending' } }),
            prisma.agentSuggestion.count({
                where: {
                    status: 'approved',
                    reviewedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
                },
            }),
            prisma.agentSuggestion.count({ where: { status: 'implemented' } }),
            prisma.agentSuggestion.count(),
            prisma.project.findMany({
                select: { id: true, title: true, slug: true },
                orderBy: { title: 'asc' },
            }),
        ])

        return NextResponse.json({
            suggestions,
            stats: {
                pending,
                approvedToday,
                implemented,
                total,
                implementationRate: total > 0 ? Math.round((implemented / total) * 100) : 0,
            },
            projects,
        })
    } catch (error) {
        console.error('Error fetching agent hub data:', error)
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
    }
}
