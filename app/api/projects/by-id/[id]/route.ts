import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Params {
    params: Promise<{ id: string }>
}

// DELETE /api/projects/by-id/[id]
export async function DELETE(_request: Request, { params }: Params) {
    try {
        const { id } = await params

        await prisma.roadmapItem.deleteMany({ where: { projectId: id } })
        await prisma.project.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete project error:', error)
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        )
    }
}
