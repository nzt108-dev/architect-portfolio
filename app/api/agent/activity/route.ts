import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function verifyApiKey(request: Request): boolean {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false
    return authHeader.substring(7) === process.env.PORTFOLIO_API_KEY
}

// POST /api/agent/activity — log a new activity
export async function POST(request: Request) {
    if (!verifyApiKey(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { projectSlug, type, title, details = '', author = 'agent' } = body

        if (!type || !title) {
            return NextResponse.json(
                { error: 'type and title are required' },
                { status: 400 }
            )
        }

        // Resolve project by slug if provided
        let projectId: string | null = null
        if (projectSlug) {
            const project = await prisma.project.findUnique({
                where: { slug: projectSlug },
                select: { id: true },
            })
            if (project) {
                projectId = project.id
            }
        }

        const log = await prisma.activityLog.create({
            data: {
                projectId,
                type,
                title,
                details,
                author,
            },
        })

        return NextResponse.json({ success: true, id: log.id }, { status: 201 })
    } catch (error) {
        console.error('Error creating activity log:', error)
        return NextResponse.json({ error: 'Failed to log activity' }, { status: 500 })
    }
}

// GET /api/agent/activity — list recent activities
export async function GET(request: Request) {
    if (!verifyApiKey(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const projectSlug = searchParams.get('projectSlug')
        const limit = parseInt(searchParams.get('limit') || '50')
        const type = searchParams.get('type')

        const where: Record<string, unknown> = {}

        if (projectSlug) {
            const project = await prisma.project.findUnique({
                where: { slug: projectSlug },
                select: { id: true },
            })
            if (project) where.projectId = project.id
        }

        if (type) where.type = type

        const logs = await prisma.activityLog.findMany({
            where,
            include: {
                project: { select: { title: true, slug: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: Math.min(limit, 100),
        })

        return NextResponse.json({ logs })
    } catch (error) {
        console.error('Error fetching activity logs:', error)
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
    }
}
