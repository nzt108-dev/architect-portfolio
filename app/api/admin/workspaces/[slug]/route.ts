import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/admin/workspaces/[slug] — full project detail
export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params

        const project = await prisma.project.findUnique({
            where: { slug },
            include: {
                roadmapItems: {
                    orderBy: { order: 'asc' },
                },
                activityLogs: {
                    orderBy: { createdAt: 'desc' },
                    take: 50,
                },
                crmTasks: {
                    orderBy: { updatedAt: 'desc' },
                    take: 50,
                },
                agentSuggestions: {
                    orderBy: { createdAt: 'desc' },
                    take: 50,
                },
            },
        })

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        // Parse JSON fields safely
        const safeJSON = (val: string | null | undefined): string[] => {
            if (!val) return []
            try {
                const parsed = JSON.parse(val)
                return Array.isArray(parsed) ? parsed : []
            } catch {
                return []
            }
        }

        return NextResponse.json({
            project: {
                ...project,
                stack: safeJSON(project.stack),
                services: safeJSON(project.services),
                technologies: safeJSON(project.technologies),
                images: safeJSON(project.images),
                screenshots: safeJSON(project.screenshots),
                lastCommit: project.lastCommitHash ? {
                    hash: project.lastCommitHash,
                    message: project.lastCommitMsg,
                    date: project.lastCommitDate?.toISOString() || null,
                } : null,
                activityLogs: project.activityLogs.map(a => ({
                    id: a.id,
                    type: a.type,
                    title: a.title,
                    details: a.details,
                    author: a.author,
                    createdAt: a.createdAt.toISOString(),
                })),
                crmTasks: project.crmTasks.map(t => ({
                    id: t.id,
                    title: t.title,
                    description: t.description,
                    type: t.type,
                    status: t.status,
                    priority: t.priority,
                    dueDate: t.dueDate?.toISOString() || null,
                    createdAt: t.createdAt.toISOString(),
                })),
                agentSuggestions: project.agentSuggestions.map(s => ({
                    id: s.id,
                    type: s.type,
                    title: s.title,
                    description: s.description,
                    impact: s.impact,
                    effort: s.effort,
                    status: s.status,
                    aiModel: s.aiModel,
                    createdAt: s.createdAt.toISOString(),
                })),
                roadmapItems: project.roadmapItems.map(r => ({
                    id: r.id,
                    title: r.title,
                    status: r.status,
                    order: r.order,
                })),
            },
        })
    } catch (error) {
        console.error('Error fetching project detail:', error)
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
    }
}
