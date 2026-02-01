import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/social-links - Get all social links
export async function GET() {
    try {
        const links = await prisma.socialLink.findMany({
            orderBy: { order: 'asc' },
        })
        return NextResponse.json(links)
    } catch (error) {
        console.error('Error fetching social links:', error)
        return NextResponse.json(
            { error: 'Failed to fetch social links' },
            { status: 500 }
        )
    }
}

// PUT /api/social-links - Update all social links (replace all)
export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { links } = body

        // Delete all existing links
        await prisma.socialLink.deleteMany()

        // Create new links
        if (links && links.length > 0) {
            await prisma.socialLink.createMany({
                data: links.map((link: { name: string; url: string; icon: string }, index: number) => ({
                    name: link.name,
                    url: link.url,
                    icon: link.icon,
                    order: index,
                })),
            })
        }

        const updatedLinks = await prisma.socialLink.findMany({
            orderBy: { order: 'asc' },
        })

        return NextResponse.json(updatedLinks)
    } catch (error) {
        console.error('Error updating social links:', error)
        return NextResponse.json(
            { error: 'Failed to update social links' },
            { status: 500 }
        )
    }
}
