import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/activity — list activity logs (for admin UI)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const projectSlug = searchParams.get('projectSlug')
        const type = searchParams.get('type')
        const limit = parseInt(searchParams.get('limit') || '50')

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

// POST /api/admin/activity — add manual activity entry
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { projectSlug, type, title, details = '', author = 'manual' } = body

        if (!type || !title) {
            return NextResponse.json(
                { error: 'type and title are required' },
                { status: 400 }
            )
        }

        let projectId: string | null = null
        if (projectSlug) {
            const project = await prisma.project.findUnique({
                where: { slug: projectSlug },
                select: { id: true },
            })
            if (project) projectId = project.id
        }

        const log = await prisma.activityLog.create({
            data: { projectId, type, title, details, author },
        })

        return NextResponse.json({ success: true, id: log.id }, { status: 201 })
    } catch (error) {
        console.error('Error creating activity log:', error)
        return NextResponse.json({ error: 'Failed to create log' }, { status: 500 })
    }
}
