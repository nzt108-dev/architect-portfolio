import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function verifyApiKey(request: Request): boolean {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false
    return authHeader.substring(7) === process.env.PORTFOLIO_API_KEY
}

// POST /api/agent/suggestions — AI agent creates a suggestion
export async function POST(request: Request) {
    if (!verifyApiKey(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const {
            projectSlug,
            type,
            title,
            description,
            impact = 'medium',
            effort = 'medium',
            aiModel = '',
            reasoning = '',
            codeSnippet = '',
        } = body

        if (!projectSlug || !type || !title || !description) {
            return NextResponse.json(
                { error: 'projectSlug, type, title, and description are required' },
                { status: 400 }
            )
        }

        // Validate type
        const validTypes = ['optimization', 'feature', 'bug', 'security', 'refactor']
        if (!validTypes.includes(type)) {
            return NextResponse.json(
                { error: `type must be one of: ${validTypes.join(', ')}` },
                { status: 400 }
            )
        }

        // Resolve project by slug
        const project = await prisma.project.findUnique({
            where: { slug: projectSlug },
            select: { id: true },
        })

        if (!project) {
            return NextResponse.json(
                { error: `Project with slug "${projectSlug}" not found` },
                { status: 404 }
            )
        }

        const suggestion = await prisma.agentSuggestion.create({
            data: {
                projectId: project.id,
                type,
                title,
                description,
                impact,
                effort,
                aiModel,
                reasoning,
                codeSnippet,
            },
        })

        return NextResponse.json({ success: true, id: suggestion.id }, { status: 201 })
    } catch (error) {
        console.error('Error creating agent suggestion:', error)
        return NextResponse.json({ error: 'Failed to create suggestion' }, { status: 500 })
    }
}

// GET /api/agent/suggestions — list suggestions (for agent use)
export async function GET(request: Request) {
    if (!verifyApiKey(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const projectSlug = searchParams.get('projectSlug')
        const limit = parseInt(searchParams.get('limit') || '50')

        const where: Record<string, unknown> = {}

        if (status) where.status = status

        if (projectSlug) {
            const project = await prisma.project.findUnique({
                where: { slug: projectSlug },
                select: { id: true },
            })
            if (project) where.projectId = project.id
        }

        const suggestions = await prisma.agentSuggestion.findMany({
            where,
            include: {
                project: { select: { title: true, slug: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: Math.min(limit, 100),
        })

        return NextResponse.json({ suggestions })
    } catch (error) {
        console.error('Error fetching suggestions:', error)
        return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 })
    }
}
