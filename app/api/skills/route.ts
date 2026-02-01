import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/skills - Get all skills
export async function GET() {
    try {
        const skills = await prisma.skill.findMany({
            orderBy: [{ category: 'asc' }, { order: 'asc' }],
        })
        return NextResponse.json(skills)
    } catch (error) {
        console.error('Error fetching skills:', error)
        return NextResponse.json(
            { error: 'Failed to fetch skills' },
            { status: 500 }
        )
    }
}

// POST /api/skills - Create a new skill
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const skill = await prisma.skill.create({
            data: body,
        })
        return NextResponse.json(skill, { status: 201 })
    } catch (error) {
        console.error('Error creating skill:', error)
        return NextResponse.json(
            { error: 'Failed to create skill' },
            { status: 500 }
        )
    }
}
