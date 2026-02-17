import Link from 'next/link'
import { Project } from '@/types'

interface ProjectCardProps {
    project: Project
}

const categoryConfig: Record<string, { icon: string; label: string; color: string }> = {
    mobile: { icon: '📱', label: 'Mobile', color: 'var(--accent-primary)' },
    telegram: { icon: '🤖', label: 'Telegram', color: 'var(--accent-blue)' },
    web: { icon: '🌐', label: 'Web', color: 'var(--accent-secondary)' },
    saas: { icon: '💼', label: 'SaaS', color: 'var(--accent-green)' },
    discord: { icon: '🎮', label: 'Discord', color: 'var(--accent-amber)' },
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const config = categoryConfig[project.category] || categoryConfig.web

    return (
        <Link href={`/projects/${project.slug}`} className="block group">
            <div className="cyber-card h-full flex flex-col">
                {/* Screenshot thumbnail */}
                {project.screenshots.length > 0 ? (
                    <div className="relative h-44 overflow-hidden rounded-t-2xl">
                        <img
                            src={project.screenshots[0]}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] to-transparent opacity-60" />
                    </div>
                ) : (
                    <div className="h-3 rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${config.color}, transparent)` }} />
                )}

                <div className="p-6 flex flex-col flex-1">
                    {/* Category & Status */}
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                            style={{
                                background: `color-mix(in srgb, ${config.color} 12%, transparent)`,
                                color: config.color,
                            }}
                        >
                            {config.icon} {config.label}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">
                            {project.progress}%
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                        {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                        {project.description}
                    </p>

                    {/* Progress bar */}
                    <div className="progress-bar mb-4">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${project.progress}%` }}
                        />
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 4).map((tech) => (
                            <span key={tech} className="skill-badge text-xs py-1 px-2">
                                {tech}
                            </span>
                        ))}
                        {project.technologies.length > 4 && (
                            <span className="text-[var(--text-muted)] text-xs self-center">
                                +{project.technologies.length - 4}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}
