import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/workspaces — list all projects with Mission Control data
export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                category: true,
                progress: true,
                localPath: true,
                githubUrl: true,
                demoUrl: true,
                featured: true,
                status: true,
                stack: true,
                services: true,
                deployUrl: true,
                backendUrl: true,
                sentrySlug: true,
                lastCommitHash: true,
                lastCommitMsg: true,
                lastCommitDate: true,
                projectServices: {
                    orderBy: [{ category: 'asc' }, { name: 'asc' }],
                },
                activityLogs: {
                    select: {
                        createdAt: true,
                        type: true,
                        title: true,
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 3,
                },
            },
            orderBy: { order: 'asc' },
        })

        const result = projects.map(p => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            description: p.description,
            category: p.category,
            progress: p.progress,
            localPath: p.localPath,
            githubUrl: p.githubUrl,
            demoUrl: p.demoUrl,
            featured: p.featured,
            status: p.status || 'active',
            stack: safeParseJSON(p.stack),
            services: safeParseJSON(p.services),
            deployUrl: p.deployUrl || '',
            backendUrl: p.backendUrl || '',
            sentrySlug: p.sentrySlug || '',
            projectServices: p.projectServices,
            lastCommit: p.lastCommitHash ? {
                hash: p.lastCommitHash,
                message: p.lastCommitMsg,
                date: p.lastCommitDate?.toISOString() || null,
            } : null,
            lastActivity: p.activityLogs[0]?.createdAt?.toISOString() || null,
            lastActivityType: p.activityLogs[0]?.type || null,
            recentActivity: p.activityLogs.map(a => ({
                type: a.type,
                title: a.title,
                date: a.createdAt.toISOString(),
            })),
        }))

        return NextResponse.json({ projects: result })
    } catch (error) {
        console.error('Error fetching workspaces:', error)
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
    }
}

function safeParseJSON(val: string | null | undefined): string[] {
    if (!val) return []
    try {
        const parsed = JSON.parse(val)
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}
