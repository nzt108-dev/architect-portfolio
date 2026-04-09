import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/admin/agent-hub/[id] — approve/reject/mark implemented
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { status } = body

        const validStatuses = ['pending', 'approved', 'rejected', 'implemented']
        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json(
                { error: `status must be one of: ${validStatuses.join(', ')}` },
                { status: 400 }
            )
        }

        const suggestion = await prisma.agentSuggestion.update({
            where: { id },
            data: {
                status,
                reviewedAt: status !== 'pending' ? new Date() : null,
            },
        })

        return NextResponse.json({ success: true, suggestion })
    } catch (error) {
        console.error('Error updating suggestion:', error)
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }
}
