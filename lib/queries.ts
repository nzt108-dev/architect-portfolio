import { prisma } from '@/lib/prisma'
import { Project, RoadmapItem, Skill, SocialLink, Service } from '@/types'

function mapProject(project: {
    id: string;
    title: string;
    slug: string;
    description: string;
    longDescription: string;
    category: string;
    progress: number;
    technologies: string;
    githubUrl: string | null;
    demoUrl: string | null;
    images: string;
    screenshots: string;
    ideaText: string;
    clientBenefit: string;
    createdAt: Date;
    roadmapItems: { title: string; status: string }[];
}): Project {
    return {
        id: project.id,
        title: project.title,
        slug: project.slug,
        description: project.description,
        longDescription: project.longDescription,
        category: project.category as Project['category'],
        progress: project.progress,
        technologies: JSON.parse(project.technologies),
        githubUrl: project.githubUrl,
        demoUrl: project.demoUrl,
        images: JSON.parse(project.images),
        screenshots: JSON.parse(project.screenshots),
        ideaText: project.ideaText,
        clientBenefit: project.clientBenefit,
        roadmap: project.roadmapItems.map((item) => ({
            title: item.title,
            status: item.status as RoadmapItem['status'],
        })),
        createdAt: project.createdAt,
    }
}

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

    return projects.map(mapProject)
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

    return mapProject(project)
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
        take: 6,
    })

    return projects.map(mapProject)
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

// Fetch all services
export async function getServices(): Promise<Service[]> {
    const services = await prisma.service.findMany({
        orderBy: { order: 'asc' },
    })

    return services.map((service) => ({
        id: service.id,
        title: service.title,
        titleRu: service.titleRu,
        slug: service.slug,
        icon: service.icon,
        description: service.description,
        descriptionRu: service.descriptionRu,
        features: JSON.parse(service.features),
        featuresRu: JSON.parse(service.featuresRu),
        timeline: service.timeline,
        timelineRu: service.timelineRu,
    }))
}

// Static categories (these don't change often)
export const categories = [
    { id: 'all', name: 'All Projects', icon: '🚀' },
    { id: 'mobile', name: 'Mobile Apps', icon: '📱' },
    { id: 'telegram', name: 'Telegram Bots', icon: '🤖' },
    { id: 'web', name: 'Web Services', icon: '🌐' },
    { id: 'saas', name: 'SaaS Platforms', icon: '💼' },
    { id: 'discord', name: 'Discord Bots', icon: '🎮' },
]
