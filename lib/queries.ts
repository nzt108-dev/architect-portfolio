import { prisma } from '@/lib/prisma'
import { Project, RoadmapItem, Skill, SocialLink } from '@/types'

// Fetch all projects from database
export async function getProjects(category?: string): Promise<Project[]> {
    const where = category && category !== 'all' ? { category } : {}

    const projects = await prisma.project.findMany({
        where,
        include: {
            roadmapItems: {
                orderBy: { order: 'asc' },
            },
        },
        orderBy: { order: 'asc' },
    })

    return projects.map((project) => ({
        id: project.id,
        title: project.title,
        slug: project.slug,
        description: project.description,
        category: project.category as 'mobile' | 'telegram' | 'web',
        progress: project.progress,
        technologies: JSON.parse(project.technologies),
        githubUrl: project.githubUrl,
        demoUrl: project.demoUrl,
        images: JSON.parse(project.images),
        roadmap: project.roadmapItems.map((item) => ({
            title: item.title,
            status: item.status as RoadmapItem['status'],
        })),
        createdAt: project.createdAt,
    }))
}

// Fetch a single project by slug
export async function getProjectBySlug(slug: string): Promise<Project | null> {
    const project = await prisma.project.findUnique({
        where: { slug },
        include: {
            roadmapItems: {
                orderBy: { order: 'asc' },
            },
        },
    })

    if (!project) return null

    return {
        id: project.id,
        title: project.title,
        slug: project.slug,
        description: project.description,
        category: project.category as 'mobile' | 'telegram' | 'web',
        progress: project.progress,
        technologies: JSON.parse(project.technologies),
        githubUrl: project.githubUrl,
        demoUrl: project.demoUrl,
        images: JSON.parse(project.images),
        roadmap: project.roadmapItems.map((item) => ({
            title: item.title,
            status: item.status as RoadmapItem['status'],
        })),
        createdAt: project.createdAt,
    }
}

// Fetch featured projects
export async function getFeaturedProjects(): Promise<Project[]> {
    const projects = await prisma.project.findMany({
        where: { featured: true },
        include: {
            roadmapItems: {
                orderBy: { order: 'asc' },
            },
        },
        orderBy: { order: 'asc' },
        take: 3,
    })

    return projects.map((project) => ({
        id: project.id,
        title: project.title,
        slug: project.slug,
        description: project.description,
        category: project.category as 'mobile' | 'telegram' | 'web',
        progress: project.progress,
        technologies: JSON.parse(project.technologies),
        githubUrl: project.githubUrl,
        demoUrl: project.demoUrl,
        images: JSON.parse(project.images),
        roadmap: project.roadmapItems.map((item) => ({
            title: item.title,
            status: item.status as RoadmapItem['status'],
        })),
        createdAt: project.createdAt,
    }))
}

// Fetch all skills
export async function getSkills(): Promise<Skill[]> {
    const skills = await prisma.skill.findMany({
        orderBy: [{ category: 'asc' }, { order: 'asc' }],
    })

    return skills.map((skill) => ({
        name: skill.name,
        level: skill.level,
        category: skill.category as Skill['category'],
    }))
}

// Fetch social links
export async function getSocialLinks(): Promise<SocialLink[]> {
    const links = await prisma.socialLink.findMany({
        orderBy: { order: 'asc' },
    })

    return links.map((link) => ({
        name: link.name,
        url: link.url,
        icon: link.icon,
    }))
}

// Fetch site settings
export async function getSiteSettings(): Promise<Record<string, string>> {
    const settings = await prisma.siteSetting.findMany()
    return settings.reduce(
        (acc, setting) => {
            acc[setting.key] = setting.value
            return acc
        },
        {} as Record<string, string>
    )
}

// Static categories (these don't change often)
export const categories = [
    { id: 'all', name: 'All Projects', icon: '🚀' },
    { id: 'mobile', name: 'Mobile Apps', icon: '📱' },
    { id: 'telegram', name: 'Telegram Bots', icon: '🤖' },
    { id: 'web', name: 'Web Services', icon: '🌐' },
]
