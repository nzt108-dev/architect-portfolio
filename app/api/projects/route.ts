import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/projects - Get all projects
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const featured = searchParams.get('featured')

        const where: {
            category?: string
            featured?: boolean
        } = {}

        if (category && category !== 'all') {
            where.category = category
        }
        if (featured === 'true') {
            where.featured = true
        }

        const projects = await prisma.project.findMany({
            where,
            include: {
                roadmapItems: {
                    orderBy: { order: 'asc' },
                },
            },
            orderBy: { order: 'asc' },
        })

        // Parse technologies JSON for each project
        const formattedProjects = projects.map((project) => ({
            ...project,
            technologies: JSON.parse(project.technologies),
            images: JSON.parse(project.images),
        }))

        return NextResponse.json(formattedProjects)
    } catch (error) {
        console.error('Error fetching projects:', error)
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        )
    }
}

// POST /api/projects - Create a new project
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { roadmapItems, ...projectData } = body

        // Ensure technologies and images are stored as JSON strings
        const project = await prisma.project.create({
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
                roadmapItems: roadmapItems
                    ? {
                        create: roadmapItems.map(
                            (
                                item: { title: string; status: string; order: number },
                                index: number
                            ) => ({
                                title: item.title,
                                status: item.status,
                                order: item.order ?? index,
                            })
                        ),
                    }
                    : undefined,
            },
            include: {
                roadmapItems: true,
            },
        })

        return NextResponse.json(project, { status: 201 })
    } catch (error) {
        console.error('Error creating project:', error)
        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        )
    }
}
