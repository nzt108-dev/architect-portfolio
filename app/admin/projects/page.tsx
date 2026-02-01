import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { DeleteProjectButton } from './DeleteButton'

export const dynamic = 'force-dynamic'

export default async function AdminProjectsPage() {
    const projects = await prisma.project.findMany({
        orderBy: { order: 'asc' },
    })

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Projects</h1>
                <Link href="/admin/projects/new" className="cyber-btn">
                    + New Project
                </Link>
            </div>

            <div className="cyber-card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[var(--bg-secondary)]">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-muted)]">
                                Title
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-muted)]">
                                Category
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-muted)]">
                                Progress
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-muted)]">
                                Featured
                            </th>
                            <th className="text-right px-6 py-4 text-sm font-medium text-[var(--text-muted)]">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {projects.map((project) => (
                            <tr key={project.id} className="hover:bg-[var(--bg-card-hover)]">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-medium">{project.title}</div>
                                        <div className="text-[var(--text-muted)] text-sm">
                                            /{project.slug}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded text-xs font-medium bg-[var(--bg-secondary)]">
                                        {project.category === 'mobile' && '📱 Mobile'}
                                        {project.category === 'telegram' && '🤖 Telegram'}
                                        {project.category === 'web' && '🌐 Web'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 h-2 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
                                            <div
                                                className="h-full bg-[var(--neon-cyan)]"
                                                style={{ width: `${project.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-[var(--text-secondary)]">
                                            {project.progress}%
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {project.featured ? (
                                        <span className="text-[var(--neon-green)]">★</span>
                                    ) : (
                                        <span className="text-[var(--text-muted)]">○</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/projects/${project.slug}`}
                                            target="_blank"
                                            className="px-3 py-1.5 rounded text-sm text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] transition-colors"
                                        >
                                            View
                                        </Link>
                                        <Link
                                            href={`/admin/projects/${project.id}`}
                                            className="px-3 py-1.5 rounded text-sm bg-[var(--bg-secondary)] hover:bg-[var(--neon-cyan)]/20 hover:text-[var(--neon-cyan)] transition-all"
                                        >
                                            Edit
                                        </Link>
                                        <DeleteProjectButton id={project.id} title={project.title} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {projects.length === 0 && (
                    <div className="p-12 text-center text-[var(--text-muted)]">
                        No projects yet. Create your first one!
                    </div>
                )}
            </div>
        </div>
    )
}
