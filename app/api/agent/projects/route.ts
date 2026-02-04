import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Verify API key
function verifyApiKey(request: Request): boolean {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false
    }
    const token = authHeader.substring(7)
    return token === process.env.PORTFOLIO_API_KEY
}

// POST /api/agent/projects — Create or update a project
export async function POST(request: Request) {
    // Verify API key
    if (!verifyApiKey(request)) {
        return NextResponse.json(
            { error: 'Unauthorized. Invalid or missing API key.' },
            { status: 401 }
        )
    }

    try {
        const body = await request.json()
        const {
            title,
            slug,
            description,
            category = 'web',
            progress = 0,
            technologies = [],
            githubUrl = null,
            demoUrl = null,
            featured = false,
            roadmapItems = [],
        } = body

        // Validate required fields
        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            )
        }

        // Generate slug if not provided
        const projectSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

        // Check if project exists
        const existingProject = await prisma.project.findUnique({
            where: { slug: projectSlug },
        })

        let project

        if (existingProject) {
            // Update existing project - only update fields that are explicitly provided
            const updateData: Record<string, unknown> = { title }

            if (description !== undefined) updateData.description = description
            if (body.category !== undefined) updateData.category = body.category
            if (body.progress !== undefined) updateData.progress = body.progress
            if (body.technologies !== undefined) updateData.technologies = JSON.stringify(body.technologies)
            if (body.githubUrl !== undefined) updateData.githubUrl = body.githubUrl
            if (body.demoUrl !== undefined) updateData.demoUrl = body.demoUrl
            if (body.featured !== undefined) updateData.featured = body.featured

            project = await prisma.project.update({
                where: { slug: projectSlug },
                data: updateData,
            })

            // Update roadmap items only if provided
            if (roadmapItems && roadmapItems.length > 0) {
                // Delete existing items
                await prisma.roadmapItem.deleteMany({
                    where: { projectId: existingProject.id },
                })

                // Create new items
                for (let i = 0; i < roadmapItems.length; i++) {
                    await prisma.roadmapItem.create({
                        data: {
                            title: roadmapItems[i].title,
                            status: roadmapItems[i].status || 'planned',
                            order: i,
                            projectId: existingProject.id,
                        },
                    })
                }
            }

            return NextResponse.json({
                success: true,
                action: 'updated',
                project: {
                    id: project.id,
                    title: project.title,
                    slug: project.slug,
                    progress: project.progress,
                },
            })
        } else {
            // Get max order for new project
            const maxOrder = await prisma.project.aggregate({
                _max: { order: true },
            })
            const newOrder = (maxOrder._max.order || 0) + 1

            // Create new project
            project = await prisma.project.create({
                data: {
                    title,
                    slug: projectSlug,
                    description: description || `${title} project`,
                    category,
                    progress,
                    technologies: JSON.stringify(technologies),
                    images: JSON.stringify([]),
                    githubUrl,
                    demoUrl,
                    featured,
                    order: newOrder,
                },
            })

            // Create roadmap items
            for (let i = 0; i < roadmapItems.length; i++) {
                await prisma.roadmapItem.create({
                    data: {
                        title: roadmapItems[i].title,
                        status: roadmapItems[i].status || 'planned',
                        order: i,
                        projectId: project.id,
                    },
                })
            }

            return NextResponse.json({
                success: true,
                action: 'created',
                project: {
                    id: project.id,
                    title: project.title,
                    slug: project.slug,
                    progress: project.progress,
                },
            })
        }
    } catch (error) {
        console.error('Error in agent projects API:', error)
        return NextResponse.json(
            { error: 'Failed to process project' },
            { status: 500 }
        )
    }
}

// GET /api/agent/projects — List all projects (for agent reference)
export async function GET(request: Request) {
    // Verify API key
    if (!verifyApiKey(request)) {
        return NextResponse.json(
            { error: 'Unauthorized. Invalid or missing API key.' },
            { status: 401 }
        )
    }

    try {
        const projects = await prisma.project.findMany({
            select: {
                id: true,
                title: true,
                slug: true,
                category: true,
                progress: true,
                featured: true,
            },
            orderBy: { order: 'asc' },
        })

        return NextResponse.json({ projects })
    } catch (error) {
        console.error('Error fetching projects:', error)
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        )
    }
}

// DELETE /api/agent/projects?slug=xxx — Delete a project
export async function DELETE(request: Request) {
    // Verify API key
    if (!verifyApiKey(request)) {
        return NextResponse.json(
            { error: 'Unauthorized. Invalid or missing API key.' },
            { status: 401 }
        )
    }

    try {
        const { searchParams } = new URL(request.url)
        const slug = searchParams.get('slug')

        if (!slug) {
            return NextResponse.json(
                { error: 'Slug parameter is required' },
                { status: 400 }
            )
        }

        const project = await prisma.project.findUnique({
            where: { slug },
        })

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            )
        }

        await prisma.project.delete({
            where: { slug },
        })

        return NextResponse.json({
            success: true,
            action: 'deleted',
            slug,
        })
    } catch (error) {
        console.error('Error deleting project:', error)
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        )
    }
}
