import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function verifyApiKey(request: Request): boolean {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false
    return authHeader.substring(7) === process.env.PORTFOLIO_API_KEY
}

// POST /api/agent/dataflow — save data flow HTML for a project
export async function POST(request: Request) {
    if (!verifyApiKey(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { projectSlug, html } = body

        if (!projectSlug || !html) {
            return NextResponse.json(
                { error: 'projectSlug and html are required' },
                { status: 400 }
            )
        }

        const project = await prisma.project.findUnique({
            where: { slug: projectSlug },
            select: { id: true },
        })

        if (!project) {
            return NextResponse.json(
                { error: `Project "${projectSlug}" not found` },
                { status: 404 }
            )
        }

        await prisma.project.update({
            where: { slug: projectSlug },
            data: { dataFlowHtml: html },
        })

        return NextResponse.json(
            { success: true, projectSlug, size: html.length },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error saving data flow:', error)
        return NextResponse.json({ error: 'Failed to save data flow' }, { status: 500 })
    }
}

// GET /api/agent/dataflow?projectSlug=xxx — retrieve data flow HTML
export async function GET(request: Request) {
    if (!verifyApiKey(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const projectSlug = searchParams.get('projectSlug')

        if (!projectSlug) {
            return NextResponse.json(
                { error: 'projectSlug query param required' },
                { status: 400 }
            )
        }

        const project = await prisma.project.findUnique({
            where: { slug: projectSlug },
            select: { dataFlowHtml: true, title: true, slug: true },
        })

        if (!project) {
            return NextResponse.json(
                { error: `Project "${projectSlug}" not found` },
                { status: 404 }
            )
        }

        return NextResponse.json({
            projectSlug: project.slug,
            title: project.title,
            hasDataFlow: !!project.dataFlowHtml,
            html: project.dataFlowHtml,
        })
    } catch (error) {
        console.error('Error fetching data flow:', error)
        return NextResponse.json({ error: 'Failed to fetch data flow' }, { status: 500 })
    }
}
