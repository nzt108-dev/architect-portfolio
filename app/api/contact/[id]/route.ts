import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Params {
    params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: Params) {
    try {
        const { id } = await params
        const body = await request.json()

        await prisma.contactSubmission.update({
            where: { id },
            data: { read: body.read },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Update contact error:', error)
        return NextResponse.json(
            { error: 'Failed to update' },
            { status: 500 }
        )
    }
}
