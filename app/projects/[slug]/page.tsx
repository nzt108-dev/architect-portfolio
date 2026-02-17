import Link from 'next/link'
import { getProjectBySlug, getProjects } from '@/lib/queries'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
    const projects = await getProjects()
    return projects.map((project) => ({
        slug: project.slug,
    }))
}

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const project = await getProjectBySlug(slug)

    if (!project) {
        notFound()
    }

    const categoryLabels: Record<string, string> = {
        mobile: '📱 Mobile App',
        telegram: '🤖 Telegram Bot',
        web: '🌐 Web Service',
        saas: '💼 SaaS Platform',
        discord: '🎮 Discord Bot',
    }

    const statusLabel =
        project.progress === 100
            ? 'Completed'
            : project.progress > 0
                ? 'In Progress'
                : 'Planning'

    return (
        <div className="container mx-auto px-6 pt-32 pb-20">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-8">
                <Link href="/" className="hover:text-[var(--accent-primary)] transition-colors">
                    Home
                </Link>
                <span>/</span>
                <Link href="/projects" className="hover:text-[var(--accent-primary)] transition-colors">
                    Projects
                </Link>
                <span>/</span>
                <span className="text-[var(--text-secondary)]">{project.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="skill-badge text-xs">
                                {categoryLabels[project.category] || project.category}
                            </span>
                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${project.progress === 100
                                ? 'bg-[var(--accent-green)]/15 text-[var(--accent-green)]'
                                : 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]'
                                }`}>
                                {statusLabel}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
                        <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                            {project.longDescription || project.description}
                        </p>
                    </div>

                    {/* The Idea */}
                    {project.ideaText && (
                        <section className="cyber-card p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <span>💡</span> The Idea
                            </h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                {project.ideaText}
                            </p>
                        </section>
                    )}

                    {/* Client Benefit */}
                    {project.clientBenefit && (
                        <section className="cyber-card p-6 neon-border">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <span>🎯</span> What You Get
                            </h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                {project.clientBenefit}
                            </p>
                        </section>
                    )}

                    {/* Screenshots Gallery */}
                    {project.screenshots.length > 0 && (
                        <section className="cyber-card p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <span>📸</span> Screenshots
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {project.screenshots.map((url, i) => (
                                    <a
                                        key={i}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block rounded-lg overflow-hidden border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-colors"
                                    >
                                        <img
                                            src={url}
                                            alt={`${project.title} screenshot ${i + 1}`}
                                            className="w-full h-auto object-cover"
                                        />
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Technologies */}
                    <section className="cyber-card p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <span>⚙️</span> Tech Stack
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech) => (
                                <span key={tech} className="skill-badge">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Roadmap */}
                    {project.roadmap.length > 0 && (
                        <section className="cyber-card p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <span>🗺️</span> Roadmap
                            </h2>
                            <div className="space-y-3">
                                {project.roadmap.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.status === 'done'
                                            ? 'bg-[var(--accent-green)]'
                                            : item.status === 'in-progress'
                                                ? 'bg-[var(--accent-primary)]'
                                                : 'bg-[var(--text-muted)]'
                                            }`} />
                                        <span className={`text-sm ${item.status === 'done'
                                            ? 'text-[var(--text-secondary)] line-through'
                                            : item.status === 'in-progress'
                                                ? 'text-[var(--accent-primary)]'
                                                : 'text-[var(--text-muted)]'
                                            }`}>
                                            {item.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Progress */}
                    <div className="cyber-card p-6">
                        <h3 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">
                            Progress
                        </h3>
                        <div className="flex items-center gap-4 mb-3">
                            <span className="text-3xl font-bold text-[var(--accent-primary)]">
                                {project.progress}%
                            </span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${project.progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Links */}
                    <div className="cyber-card p-6 space-y-3">
                        {project.demoUrl && (
                            <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-filled w-full text-center text-sm block"
                            >
                                🔗 Live Demo
                            </a>
                        )}
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cyber-btn w-full text-center text-sm block"
                            >
                                GitHub Repository
                            </a>
                        )}
                    </div>

                    {/* CTA */}
                    <div className="cyber-card p-6 neon-border">
                        <h3 className="text-lg font-semibold mb-2">Need Something Similar?</h3>
                        <p className="text-[var(--text-secondary)] text-sm mb-4">
                            I can build a custom solution tailored to your needs. Let&apos;s discuss your project.
                        </p>
                        <Link href="/contact" className="btn-filled w-full text-center text-sm block">
                            Get Free Estimate →
                        </Link>
                    </div>

                    {/* Back */}
                    <Link
                        href="/projects"
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-sm"
                    >
                        ← Back to All Projects
                    </Link>
                </div>
            </div>
        </div>
    )
}
