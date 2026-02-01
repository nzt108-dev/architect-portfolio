import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const [projectCount, skillCount, messageCount, unreadCount] = await Promise.all([
        prisma.project.count(),
        prisma.skill.count(),
        prisma.contactSubmission.count(),
        prisma.contactSubmission.count({ where: { read: false } }),
    ])

    const recentMessages = await prisma.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
    })

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatCard
                    icon="📁"
                    label="Projects"
                    value={projectCount}
                    href="/admin/projects"
                />
                <StatCard
                    icon="⚡"
                    label="Skills"
                    value={skillCount}
                    href="/admin/skills"
                />
                <StatCard
                    icon="✉️"
                    label="Messages"
                    value={messageCount}
                    href="/admin/messages"
                    highlight={unreadCount > 0 ? `${unreadCount} unread` : undefined}
                />
                <StatCard
                    icon="👁️"
                    label="Site"
                    value="Live"
                    href="/"
                    external
                />
            </div>

            {/* Quick Actions */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="flex gap-4">
                    <Link href="/admin/projects/new" className="cyber-btn">
                        + New Project
                    </Link>
                    <Link href="/admin/skills" className="cyber-btn cyber-btn-pink">
                        Manage Skills
                    </Link>
                </div>
            </div>

            {/* Recent Messages */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Recent Messages</h2>
                    <Link
                        href="/admin/messages"
                        className="text-[var(--neon-cyan)] text-sm hover:underline"
                    >
                        View all →
                    </Link>
                </div>

                <div className="cyber-card divide-y divide-[var(--border-color)]">
                    {recentMessages.length === 0 ? (
                        <div className="p-6 text-[var(--text-muted)] text-center">
                            No messages yet
                        </div>
                    ) : (
                        recentMessages.map((msg) => (
                            <div key={msg.id} className="p-4 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        {!msg.read && (
                                            <span className="w-2 h-2 rounded-full bg-[var(--neon-cyan)]" />
                                        )}
                                        <span className="font-medium">{msg.name}</span>
                                        <span className="text-[var(--text-muted)] text-sm">
                                            ({msg.email})
                                        </span>
                                    </div>
                                    <p className="text-[var(--text-secondary)] text-sm mt-1">
                                        {msg.subject}
                                    </p>
                                </div>
                                <span className="text-[var(--text-muted)] text-sm">
                                    {new Date(msg.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

function StatCard({
    icon,
    label,
    value,
    href,
    highlight,
    external,
}: {
    icon: string
    label: string
    value: number | string
    href: string
    highlight?: string
    external?: boolean
}) {
    return (
        <Link
            href={href}
            target={external ? '_blank' : undefined}
            className="cyber-card p-6 hover:border-[var(--neon-cyan)]/50 transition-all group"
        >
            <div className="flex items-center gap-4">
                <div className="text-3xl">{icon}</div>
                <div>
                    <div className="text-2xl font-bold group-hover:text-[var(--neon-cyan)] transition-colors">
                        {value}
                    </div>
                    <div className="text-[var(--text-secondary)] text-sm">{label}</div>
                    {highlight && (
                        <div className="text-[var(--neon-cyan)] text-xs mt-1">{highlight}</div>
                    )}
                </div>
            </div>
        </Link>
    )
}
