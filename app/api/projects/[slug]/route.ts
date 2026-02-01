import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
    params: Promise<{ slug: string }>
}

// GET /api/projects/[slug] - Get a single project by slug
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { slug } = await params

        const project = await prisma.project.findUnique({
            where: { slug },
            include: {
                roadmapItems: {
                    orderBy: { order: 'asc' },
                },
            },
        })

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        // Parse JSON fields
        const formattedProject = {
            ...project,
            technologies: JSON.parse(project.technologies),
            images: JSON.parse(project.images),
        }

        return NextResponse.json(formattedProject)
    } catch (error) {
        console.error('Error fetching project:', error)
        return NextResponse.json(
            { error: 'Failed to fetch project' },
            { status: 500 }
        )
    }
}

// PUT /api/projects/[slug] - Update a project
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const { slug } = await params
        const body = await request.json()
        const { roadmapItems, ...projectData } = body

        // Find existing project
        const existingProject = await prisma.project.findUnique({
            where: { slug },
        })

        if (!existingProject) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        // Update project
        const updatedProject = await prisma.project.update({
            where: { slug },
            data: {
                ...projectData,
                technologies:
                    typeof projectData.technologies === 'string'
                        ? projectData.technologies
                        : JSON.stringify(projectData.technologies || []),
                images:
                    typeof projectData.images === 'string'
                        ? projectData.images
                        : JSON.stringify(projectData.images || []),
            },
            include: {
                roadmapItems: true,
            },
        })

        // Update roadmap items if provided
        if (roadmapItems) {
            // Delete existing items
            await prisma.roadmapItem.deleteMany({
                where: { projectId: existingProject.id },
            })

            // Create new items
            for (const item of roadmapItems) {
                await prisma.roadmapItem.create({
                    data: {
                        title: item.title,
                        status: item.status,
                        order: item.order,
                        projectId: existingProject.id,
                    },
                })
            }
        }

        return NextResponse.json(updatedProject)
    } catch (error) {
        console.error('Error updating project:', error)
        return NextResponse.json(
            { error: 'Failed to update project' },
            { status: 500 }
        )
    }
}

// DELETE /api/projects/[slug] - Delete a project
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const { slug } = await params

        const project = await prisma.project.findUnique({
            where: { slug },
        })

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        await prisma.project.delete({
            where: { slug },
        })

        return NextResponse.json({ message: 'Project deleted successfully' })
    } catch (error) {
        console.error('Error deleting project:', error)
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        )
    }
}
