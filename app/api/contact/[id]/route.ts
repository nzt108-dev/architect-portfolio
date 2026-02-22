import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Params {
    params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: Params) {
    try {
        const { id } = await params
        const body = await request.json()

        // Build update data from provided fields
        const data: Record<string, unknown> = {}
        if (body.read !== undefined) data.read = body.read
        if (body.status !== undefined) data.status = body.status
        if (body.label !== undefined) data.label = body.label
        if (body.notes !== undefined) data.notes = body.notes

        const updated = await prisma.contactSubmission.update({
            where: { id },
            data,
        })

        return NextResponse.json({ success: true, submission: updated })
    } catch (error) {
        console.error('Update contact error:', error)
        return NextResponse.json(
            { error: 'Failed to update' },
            { status: 500 }
        )
    }
}

export async function DELETE(_request: Request, { params }: Params) {
    try {
        const { id } = await params
        await prisma.contactSubmission.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete contact error:', error)
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
    }
}
