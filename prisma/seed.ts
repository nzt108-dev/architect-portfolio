import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import 'dotenv/config'

const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
    authToken: process.env.DATABASE_AUTH_TOKEN,
})
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('🌱 Starting seed...')

    // Clear existing data
    await prisma.roadmapItem.deleteMany()
    await prisma.project.deleteMany()
    await prisma.skill.deleteMany()
    await prisma.socialLink.deleteMany()
    await prisma.siteSetting.deleteMany()

    // Seed Projects
    const projects = [
        {
            title: 'Christian Social Network',
            slug: 'christian-social-network',
            description: 'Мобильное приложение для христианского сообщества с функциями общения, молитвенных запросов и организации мероприятий.',
            category: 'mobile',
            progress: 25,
            technologies: JSON.stringify(['Flutter', 'Firebase', 'Dart', 'Cloud Functions']),
            githubUrl: 'https://github.com/nzt108-dev/christian-social',
            featured: true,
            order: 1,
            roadmap: [
                { title: 'UI Design', status: 'done', order: 1 },
                { title: 'Auth & Profiles', status: 'in-progress', order: 2 },
                { title: 'Chat System', status: 'planned', order: 3 },
                { title: 'Events Module', status: 'planned', order: 4 },
            ],
        },
        {
            title: 'Drip Campaign Bot',
            slug: 'drip-campaign-bot',
            description: 'SaaS Telegram бот для автоматизированной отправки последовательности сообщений (drip-кампании) подписчикам.',
            category: 'telegram',
            progress: 40,
            technologies: JSON.stringify(['Python', 'Telegram API', 'PostgreSQL', 'Redis', 'Docker']),
            githubUrl: 'https://github.com/nzt108-dev/drip-bot',
            demoUrl: 'https://t.me/DripCampaignBot',
            featured: true,
            order: 2,
            roadmap: [
                { title: 'Core Bot Logic', status: 'done', order: 1 },
                { title: 'Campaign Builder', status: 'done', order: 2 },
                { title: 'Analytics Dashboard', status: 'in-progress', order: 3 },
                { title: 'Payment Integration', status: 'planned', order: 4 },
            ],
        },
        {
            title: 'Landing Builder',
            slug: 'landing-builder',
            description: 'Веб-сервис для создания и управления лендингами с drag-and-drop редактором и интеграцией аналитики.',
            category: 'web',
            progress: 70,
            technologies: JSON.stringify(['Next.js', 'React', 'Prisma', 'PostgreSQL', 'TypeScript']),
            githubUrl: 'https://github.com/nzt108-dev/landing-builder',
            demoUrl: 'https://landing-builder.demo',
            featured: true,
            order: 3,
            roadmap: [
                { title: 'Editor Core', status: 'done', order: 1 },
                { title: 'Templates System', status: 'done', order: 2 },
                { title: 'A/B Testing', status: 'in-progress', order: 3 },
                { title: 'Team Collaboration', status: 'planned', order: 4 },
            ],
        },
        {
            title: 'Auth Microservice',
            slug: 'auth-microservice',
            description: 'Высокопроизводительный микросервис аутентификации с поддержкой OAuth2, JWT и multi-tenancy.',
            category: 'web',
            progress: 90,
            technologies: JSON.stringify(['Go', 'gRPC', 'Redis', 'PostgreSQL', 'Docker', 'Kubernetes']),
            githubUrl: 'https://github.com/nzt108-dev/auth-service',
            featured: false,
            order: 4,
            roadmap: [
                { title: 'Core Auth Flow', status: 'done', order: 1 },
                { title: 'OAuth Providers', status: 'done', order: 2 },
                { title: 'Rate Limiting', status: 'done', order: 3 },
                { title: 'Audit Logs', status: 'in-progress', order: 4 },
            ],
        },
        {
            title: 'Portfolio Site',
            slug: 'portfolio-site',
            description: 'Персональный сайт-портфолио в киберпанк стиле для демонстрации архитектурных решений и проектов.',
            category: 'web',
            progress: 50,
            technologies: JSON.stringify(['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'Vercel']),
            githubUrl: 'https://github.com/nzt108-dev/portfolio',
            demoUrl: 'https://nzt108.dev',
            featured: false,
            order: 5,
            roadmap: [
                { title: 'Design System', status: 'done', order: 1 },
                { title: 'Core Pages', status: 'done', order: 2 },
                { title: 'Database Integration', status: 'in-progress', order: 3 },
                { title: 'Admin Panel', status: 'planned', order: 4 },
            ],
        },
    ]

    for (const projectData of projects) {
        const { roadmap, ...project } = projectData
        const createdProject = await prisma.project.create({
            data: project,
        })

        if (roadmap) {
            for (const item of roadmap) {
                await prisma.roadmapItem.create({
                    data: {
                        ...item,
                        projectId: createdProject.id,
                    },
                })
            }
        }
    }

    console.log('✅ Created 5 projects with roadmap items')

    // Seed Skills
    const skills = [
        { name: 'TypeScript', level: 95, category: 'language', order: 1 },
        { name: 'Go', level: 85, category: 'language', order: 2 },
        { name: 'Python', level: 90, category: 'language', order: 3 },
        { name: 'Dart/Flutter', level: 75, category: 'language', order: 4 },
        { name: 'React/Next.js', level: 95, category: 'frontend', order: 1 },
        { name: 'Node.js', level: 90, category: 'backend', order: 1 },
        { name: 'PostgreSQL', level: 85, category: 'database', order: 1 },
        { name: 'Redis', level: 80, category: 'database', order: 2 },
        { name: 'Docker', level: 90, category: 'devops', order: 1 },
        { name: 'Kubernetes', level: 70, category: 'devops', order: 2 },
        { name: 'AWS', level: 75, category: 'cloud', order: 1 },
        { name: 'System Design', level: 90, category: 'architecture', order: 1 },
    ]

    await prisma.skill.createMany({ data: skills })
    console.log('✅ Created 12 skills')

    // Seed Social Links
    const socialLinks = [
        { name: 'GitHub', url: 'https://github.com/nzt108-dev', icon: 'github', order: 1 },
        { name: 'Telegram', url: 'https://t.me/nzt108_dev', icon: 'telegram', order: 2 },
        { name: 'LinkedIn', url: 'https://linkedin.com/in/nzt108', icon: 'linkedin', order: 3 },
        { name: 'Email', url: 'mailto:nzt108@nzt108.dev', icon: 'email', order: 4 },
    ]

    await prisma.socialLink.createMany({ data: socialLinks })
    console.log('✅ Created 4 social links')

    // Seed Site Settings
    const settings = [
        { key: 'siteName', value: 'nzt108_dev' },
        { key: 'slogan', value: 'Building digital futures, one architecture at a time' },
        { key: 'bio', value: "I'm nzt108_dev, a software architect with a passion for creating elegant solutions to complex problems. I specialize in designing and building scalable applications using modern technologies and best practices." },
        { key: 'email', value: 'contact@nzt108.dev' },
        { key: 'location', value: 'Remote / Worldwide' },
    ]

    await prisma.siteSetting.createMany({ data: settings })
    console.log('✅ Created site settings')

    console.log('🎉 Seed completed successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
