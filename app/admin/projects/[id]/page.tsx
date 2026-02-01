import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProjectForm from '../ProjectForm'

interface Props {
    params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: Props) {
    const { id } = await params

    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            roadmapItems: {
                orderBy: { order: 'asc' },
            },
        },
    })

    if (!project) {
        notFound()
    }

    const initialData = {
        id: project.id,
        title: project.title,
        slug: project.slug,
        description: project.description,
        category: project.category as 'mobile' | 'telegram' | 'web',
        progress: project.progress,
        technologies: JSON.parse(project.technologies).join(', '),
        githubUrl: project.githubUrl || '',
        demoUrl: project.demoUrl || '',
        featured: project.featured,
    }

    const initialRoadmap = project.roadmapItems.map((item) => ({
        id: item.id,
        title: item.title,
        status: item.status as 'done' | 'in-progress' | 'planned',
        order: item.order,
    }))

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Edit Project</h1>
            <ProjectForm
                initialData={initialData}
                initialRoadmap={initialRoadmap}
                isEdit
            />
        </div>
    )
}
