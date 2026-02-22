import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const [
            projectCount,
            skillCount,
            totalLeads,
            unreadLeads,
            allLeads,
            allTasks,
            recentActivity,
            projects,
        ] = await Promise.all([
            prisma.project.count(),
            prisma.skill.count(),
            prisma.contactSubmission.count(),
            prisma.contactSubmission.count({ where: { read: false } }),
            prisma.contactSubmission.findMany({
                orderBy: { createdAt: 'desc' },
            }),
            prisma.crmTask.findMany({
                include: { project: { select: { title: true, slug: true } } },
            }),
            prisma.activityLog.findMany({
                orderBy: { createdAt: 'desc' },
                take: 10,
                include: { project: { select: { title: true } } },
            }),
            prisma.project.findMany({
                orderBy: { order: 'asc' },
                select: { title: true, slug: true, progress: true, category: true },
            }),
        ])

        // Pipeline counts
        const pipeline = {
            new: allLeads.filter(l => l.status === 'new').length,
            contacted: allLeads.filter(l => l.status === 'contacted').length,
            qualified: allLeads.filter(l => l.status === 'qualified').length,
            proposal: allLeads.filter(l => l.status === 'proposal').length,
            won: allLeads.filter(l => l.status === 'won').length,
            lost: allLeads.filter(l => l.status === 'lost').length,
        }

        // Hot leads (new or hot label, with budget preferred)
        const hotLeads = allLeads
            .filter(l => l.label === 'hot' || (l.status === 'new' && !l.read))
            .slice(0, 5)
            .map(l => ({
                id: l.id, name: l.name, email: l.email, subject: l.subject,
                budget: l.budget, status: l.status, label: l.label, createdAt: l.createdAt.toISOString(),
            }))

        // Revenue from won leads (using dealValue)
        const wonRevenue = allLeads
            .filter(l => l.status === 'won')
            .reduce((sum: number, l) => sum + (l.dealValue || 0), 0)

        // Pipeline value (qualified + proposal)
        const pipelineValue = allLeads
            .filter(l => ['qualified', 'proposal'].includes(l.status))
            .reduce((sum: number, l) => sum + (l.dealValue || 0), 0)

        // Task stats
        const now = new Date()
        const upcomingDeadlines = allTasks
            .filter(t => t.dueDate && t.status !== 'done')
            .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
            .slice(0, 5)
            .map(t => ({
                id: t.id, title: t.title, status: t.status, type: t.type, priority: t.priority,
                dueDate: t.dueDate!.toISOString(), project: t.project,
            }))

        const overdueTasks = allTasks.filter(t =>
            t.dueDate && new Date(t.dueDate) < now && t.status !== 'done'
        ).length

        const tasksInProgress = allTasks.filter(t => t.status === 'in-progress').length
        const tasksDone = allTasks.filter(t => t.status === 'done').length
        const totalTasks = allTasks.length

        return NextResponse.json({
            projectCount,
            skillCount,
            totalLeads,
            unreadLeads,
            totalTasks,
            pipeline,
            hotLeads,
            upcomingDeadlines,
            overdueTasks,
            tasksInProgress,
            tasksDone,
            wonRevenue,
            pipelineValue,
            recentActivity: recentActivity.map(a => ({
                id: a.id, type: a.type, title: a.title,
                createdAt: a.createdAt.toISOString(), project: a.project,
            })),
            projects,
        })
    } catch (error) {
        console.error('Dashboard API error:', error)
        return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 })
    }
}
