import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

// GET /api/admin/services — all services grouped by projectId
export async function GET() {
    try {
        const services = await prisma.projectService.findMany({
            orderBy: [{ projectId: 'asc' }, { category: 'asc' }, { name: 'asc' }],
        })
        return NextResponse.json({ services })
    } catch (error) {
        console.error('GET /api/admin/services error:', error)
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
    }
}

// POST /api/admin/services — create new service entry
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { projectId, name, category, url, account, notes } = body

        if (!projectId || !name || !category) {
            return NextResponse.json({ error: 'projectId, name, category are required' }, { status: 400 })
        }

        const service = await prisma.projectService.create({
            data: {
                id: nanoid(),
                projectId,
                name,
                category,
                url: url || '',
                account: account || '',
                notes: notes || '',
            },
        })

        return NextResponse.json({ service }, { status: 201 })
    } catch (error) {
        console.error('POST /api/admin/services error:', error)
        return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
    }
}
