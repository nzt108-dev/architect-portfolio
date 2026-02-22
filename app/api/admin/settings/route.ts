import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET - Fetch all settings
export async function GET() {
    try {
        const settings = await prisma.siteSetting.findMany()
        return NextResponse.json(settings)
    } catch (error) {
        console.error('Settings fetch error:', error)
        return NextResponse.json([], { status: 200 })
    }
}

// PUT - Upsert settings
export async function PUT(request: Request) {
    try {
        const { settings } = await request.json()

        if (!Array.isArray(settings)) {
            return NextResponse.json({ error: 'settings must be an array' }, { status: 400 })
        }

        const results = await Promise.all(
            settings.map(({ key, value }: { key: string; value: string }) =>
                prisma.siteSetting.upsert({
                    where: { key },
                    create: { key, value },
                    update: { value },
                })
            )
        )

        return NextResponse.json(results)
    } catch (error) {
        console.error('Settings update error:', error)
        return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }
}
