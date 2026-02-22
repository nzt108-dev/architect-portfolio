import { createClient } from '@libsql/client'
import 'dotenv/config'

const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
})

interface Task {
    title: string
    type: string
    status: string
    priority: string
    description?: string
}

const tasks: Task[] = [
    // DONE — Milestones
    { title: 'Design System & Premium Dark Theme', type: 'milestone', status: 'done', priority: 'high' },
    { title: 'Core Pages (Home, Projects, Services, Contact)', type: 'milestone', status: 'done', priority: 'high' },
    { title: 'Turso Database + Prisma Integration', type: 'milestone', status: 'done', priority: 'high' },
    { title: 'Admin Panel (Projects, Skills, Messages)', type: 'milestone', status: 'done', priority: 'high' },

    // DONE — Features
    { title: 'Quick Pricing Infographic', type: 'feature', status: 'done', priority: 'medium' },
    { title: 'Lead Capture + Telegram Bot Notifications', type: 'feature', status: 'done', priority: 'high' },
    { title: 'UX Redesign — Apple/Vercel Minimalist Style', type: 'feature', status: 'done', priority: 'high' },
    { title: 'Custom SVG Icons (replace emojis)', type: 'feature', status: 'done', priority: 'medium' },
    { title: 'Activity Logging System', type: 'feature', status: 'done', priority: 'medium', description: 'Push/task/deploy/milestone/note logging via agent API' },
    { title: 'Workspaces Section (Antigravity integration)', type: 'feature', status: 'done', priority: 'medium' },
    { title: 'CRM Kanban Board', type: 'feature', status: 'done', priority: 'high', description: 'Kanban board with 5 columns, metrics, activity timeline' },

    // DONE — Bugs
    { title: 'Mobile Responsive Layout Fix', type: 'bug', status: 'done', priority: 'urgent', description: 'Fixed horizontal overflow, hamburger menu, pricing' },

    // IN-PROGRESS
    { title: 'Project Screenshots & Case Studies', type: 'milestone', status: 'in-progress', priority: 'high', description: 'Collect screenshots for all projects, write case studies' },
    { title: 'Portfolio Sync Skill for All Projects', type: 'task', status: 'in-progress', priority: 'medium', description: 'Copy SKILL.md to all project repos' },

    // TODO
    { title: 'SEO Optimization', type: 'task', status: 'todo', priority: 'medium', description: 'Meta tags, Open Graph, structured data, sitemap' },
    { title: 'Performance Audit', type: 'task', status: 'todo', priority: 'medium', description: 'Lighthouse, image optimization, lazy loading' },

    // BACKLOG
    { title: 'Blog / Articles Section', type: 'milestone', status: 'backlog', priority: 'medium', description: 'Technical blog with MDX, categories, search' },
    { title: 'Multi-language Support (EN/RU)', type: 'milestone', status: 'backlog', priority: 'low', description: 'i18n with language switcher' },
    { title: 'Client Testimonials Section', type: 'feature', status: 'backlog', priority: 'low', description: 'Carousel with client reviews' },
    { title: 'Analytics Dashboard in Admin', type: 'feature', status: 'backlog', priority: 'low', description: 'Visitor stats, page views' },
    { title: 'Drag-and-Drop Kanban', type: 'feature', status: 'backlog', priority: 'low', description: 'Touch-friendly DnD for CRM board' },
]

async function seed() {
    // Find portfolio project ID
    const project = await client.execute({
        sql: 'SELECT id FROM Project WHERE slug = ?',
        args: ['portfolio'],
    })

    if (!project.rows.length) {
        console.error('❌ Project "portfolio" not found!')
        return
    }

    const projectId = project.rows[0].id as string
    console.log(`📁 Found portfolio project: ${projectId}\n`)

    let order = 0
    for (const task of tasks) {
        const id = `crm_${Date.now()}_${order}`
        await client.execute({
            sql: `INSERT INTO CrmTask (id, projectId, title, description, type, status, priority, "order", author, createdAt, updatedAt)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'agent', datetime('now'), datetime('now'))`,
            args: [id, projectId, task.title, task.description || '', task.type, task.status, task.priority, order],
        })

        const icon = task.type === 'milestone' ? '🏆' : task.type === 'feature' ? '✨' : task.type === 'bug' ? '🐛' : '✅'
        console.log(`${icon} [${task.status.padEnd(11)}] ${task.title}`)
        order++
    }

    console.log(`\n✅ Created ${tasks.length} tasks!`)
}

seed().catch(console.error)
