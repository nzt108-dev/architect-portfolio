import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function verifyApiKey(request: Request): boolean {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false
    return authHeader.substring(7) === process.env.PORTFOLIO_API_KEY
}

// POST /api/agent/crm — create or update CRM tasks
export async function POST(request: Request) {
    if (!verifyApiKey(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const {
            projectSlug,
            title,
            description = '',
            type = 'task',
            status = 'backlog',
            priority = 'medium',
            dueDate,
            taskId,
        } = body

        if (!projectSlug) {
            return NextResponse.json(
                { error: 'projectSlug is required' },
                { status: 400 }
            )
        }

        const project = await prisma.project.findUnique({
            where: { slug: projectSlug },
            select: { id: true },
        })

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            )
        }

        // If taskId provided, update existing task
        if (taskId) {
            const task = await prisma.crmTask.update({
                where: { id: taskId },
                data: {
                    ...(title && { title }),
                    ...(description && { description }),
                    ...(type && { type }),
                    ...(status && { status }),
                    ...(priority && { priority }),
                    dueDate: dueDate ? new Date(dueDate) : undefined,
                },
            })
            return NextResponse.json({ success: true, action: 'updated', task })
        }

        // Create new task
        if (!title) {
            return NextResponse.json(
                { error: 'title is required for new tasks' },
                { status: 400 }
            )
        }

        const maxOrder = await prisma.crmTask.findFirst({
            where: { projectId: project.id, status },
            orderBy: { order: 'desc' },
            select: { order: true },
        })

        const task = await prisma.crmTask.create({
            data: {
                projectId: project.id,
                title,
                description,
                type,
                status,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null,
                order: (maxOrder?.order ?? -1) + 1,
                author: 'agent',
            },
        })

        return NextResponse.json({ success: true, action: 'created', task }, { status: 201 })
    } catch (error) {
        console.error('Error managing CRM task:', error)
        return NextResponse.json({ error: 'Failed to manage task' }, { status: 500 })
    }
}

// GET /api/agent/crm — list tasks for a project
export async function GET(request: Request) {
    if (!verifyApiKey(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const projectSlug = searchParams.get('projectSlug')
        const status = searchParams.get('status')

        if (!projectSlug) {
            return NextResponse.json(
                { error: 'projectSlug is required' },
                { status: 400 }
            )
        }

        const project = await prisma.project.findUnique({
            where: { slug: projectSlug },
            select: { id: true },
        })

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            )
        }

        const where: Record<string, unknown> = { projectId: project.id }
        if (status) where.status = status

        const tasks = await prisma.crmTask.findMany({
            where,
            orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        })

        return NextResponse.json({ tasks })
    } catch (error) {
        console.error('Error fetching CRM tasks:', error)
        return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
    }
}
