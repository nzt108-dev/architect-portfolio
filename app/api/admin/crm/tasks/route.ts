import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/crm/tasks — list tasks
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const projectSlug = searchParams.get('projectSlug')
        const status = searchParams.get('status')
        const type = searchParams.get('type')
        const priority = searchParams.get('priority')

        const where: Record<string, unknown> = {}

        if (projectSlug) {
            const project = await prisma.project.findUnique({
                where: { slug: projectSlug },
                select: { id: true },
            })
            if (project) where.projectId = project.id
        }

        if (status) where.status = status
        if (type) where.type = type
        if (priority) where.priority = priority

        const tasks = await prisma.crmTask.findMany({
            where,
            include: {
                project: { select: { title: true, slug: true } },
            },
            orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        })

        return NextResponse.json({ tasks })
    } catch (error) {
        console.error('Error fetching CRM tasks:', error)
        return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
    }
}

// POST /api/admin/crm/tasks — create task
export async function POST(request: Request) {
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
            author = 'manual',
        } = body

        if (!projectSlug || !title) {
            return NextResponse.json(
                { error: 'projectSlug and title are required' },
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

        // Get max order for this project + status
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
                author,
            },
        })

        return NextResponse.json({ success: true, task }, { status: 201 })
    } catch (error) {
        console.error('Error creating CRM task:', error)
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
    }
}

// PATCH /api/admin/crm/tasks — update task
export async function PATCH(request: Request) {
    try {
        const body = await request.json()
        const { id, ...updates } = body

        if (!id) {
            return NextResponse.json(
                { error: 'id is required' },
                { status: 400 }
            )
        }

        // Handle dueDate conversion
        if (updates.dueDate !== undefined) {
            updates.dueDate = updates.dueDate ? new Date(updates.dueDate) : null
        }

        const task = await prisma.crmTask.update({
            where: { id },
            data: updates,
        })

        return NextResponse.json({ success: true, task })
    } catch (error) {
        console.error('Error updating CRM task:', error)
        return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
    }
}

// DELETE /api/admin/crm/tasks — delete task
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'id is required' },
                { status: 400 }
            )
        }

        await prisma.crmTask.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting CRM task:', error)
        return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
    }
}
