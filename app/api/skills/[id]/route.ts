import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Params {
    params: Promise<{ id: string }>
}

export async function DELETE(_request: Request, { params }: Params) {
    try {
        const { id } = await params

        await prisma.skill.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete skill error:', error)
        return NextResponse.json(
            { error: 'Failed to delete skill' },
            { status: 500 }
        )
    }
}
