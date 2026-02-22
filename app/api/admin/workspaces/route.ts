import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/workspaces — list all projects with last activity
export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            select: {
                id: true,
                title: true,
                slug: true,
                category: true,
                progress: true,
                localPath: true,
                activityLogs: {
                    select: {
                        createdAt: true,
                        type: true,
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { order: 'asc' },
        })

        const result = projects.map(p => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            category: p.category,
            progress: p.progress,
            localPath: p.localPath,
            lastActivity: p.activityLogs[0]?.createdAt?.toISOString() || null,
            lastActivityType: p.activityLogs[0]?.type || null,
        }))

        return NextResponse.json({ projects: result })
    } catch (error) {
        console.error('Error fetching workspaces:', error)
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
    }
}
