import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/admin/services/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await req.json()
        const { name, category, url, account, notes } = body

        const service = await prisma.projectService.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(category !== undefined && { category }),
                ...(url !== undefined && { url }),
                ...(account !== undefined && { account }),
                ...(notes !== undefined && { notes }),
            },
        })

        return NextResponse.json({ service })
    } catch (error) {
        console.error('PATCH /api/admin/services/[id] error:', error)
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
    }
}

// DELETE /api/admin/services/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        await prisma.projectService.delete({ where: { id } })
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('DELETE /api/admin/services/[id] error:', error)
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
    }
}
