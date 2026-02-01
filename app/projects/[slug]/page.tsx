import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProjectBySlug, getProjects } from '@/lib/queries'
import ProgressBar from '@/components/ui/ProgressBar'

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    const projects = await getProjects()
    return projects.map((project) => ({
        slug: project.slug,
    }))
}

export const dynamic = 'force-dynamic'

export default async function ProjectDetailPage({ params }: Props) {
    const { slug } = await params
    const project = await getProjectBySlug(slug)

    if (!project) {
        notFound()
    }

    const statusColors = {
        done: 'var(--neon-green)',
        'in-progress': 'var(--neon-cyan)',
        planned: 'var(--text-muted)',
    }

    const statusLabels = {
        done: 'Completed',
        'in-progress': 'In Progress',
        planned: 'Planned',
    }

    return (
        <div className="container mx-auto px-6 py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-8">
                <Link href="/projects" className="text-[var(--text-secondary)] hover:text-[var(--neon-cyan)]">
                    Projects
                </Link>
                <span className="text-[var(--text-muted)]">/</span>
                <span className="text-[var(--neon-cyan)]">{project.title}</span>
            </nav>

            {/* Header */}
            <div className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-[var(--neon-cyan)]20 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]40">
                        {project.category === 'mobile' && '📱 Mobile App'}
                        {project.category === 'telegram' && '🤖 Telegram Bot'}
                        {project.category === 'web' && '🌐 Web Service'}
                    </span>
                    <span className="text-[var(--text-secondary)]">•</span>
                    <span className="text-[var(--text-secondary)]">
                        {project.progress}% Complete
                    </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                    {project.title}
                </h1>

                <p className="text-[var(--text-secondary)] text-lg max-w-3xl">
                    {project.description}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Progress Section */}
                    <section className="cyber-card p-6">
                        <h2 className="text-xl font-semibold mb-4">Development Progress</h2>
                        <ProgressBar progress={project.progress} showLabel size="lg" />
                    </section>

                    {/* Technologies */}
                    <section className="cyber-card p-6">
                        <h2 className="text-xl font-semibold mb-4">Technologies Used</h2>
                        <div className="flex flex-wrap gap-3">
                            {project.technologies.map((tech) => (
                                <span key={tech} className="skill-badge">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Roadmap */}
                    {project.roadmap && project.roadmap.length > 0 && (
                        <section className="cyber-card p-6">
                            <h2 className="text-xl font-semibold mb-6">Roadmap</h2>
                            <div className="space-y-4">
                                {project.roadmap.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]"
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: statusColors[item.status] }}
                                        />
                                        <div className="flex-grow">
                                            <span className="font-medium">{item.title}</span>
                                        </div>
                                        <span
                                            className="text-sm font-medium"
                                            style={{ color: statusColors[item.status] }}
                                        >
                                            {statusLabels[item.status]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Links */}
                    <section className="cyber-card p-6">
                        <h3 className="text-lg font-semibold mb-4">Links</h3>
                        <div className="space-y-3">
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--neon-cyan)] transition-all group"
                                >
                                    <svg className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--neon-cyan)]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    <span className="text-[var(--text-secondary)] group-hover:text-[var(--neon-cyan)]">
                                        View on GitHub
                                    </span>
                                </a>
                            )}
                            {project.demoUrl && (
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--neon-pink)] transition-all group"
                                >
                                    <svg className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--neon-pink)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    <span className="text-[var(--text-secondary)] group-hover:text-[var(--neon-pink)]">
                                        Live Demo
                                    </span>
                                </a>
                            )}
                        </div>
                    </section>

                    {/* Project Info */}
                    <section className="cyber-card p-6">
                        <h3 className="text-lg font-semibold mb-4">Project Info</h3>
                        <dl className="space-y-4">
                            <div>
                                <dt className="text-[var(--text-muted)] text-sm">Category</dt>
                                <dd className="font-medium capitalize">{project.category}</dd>
                            </div>
                            <div>
                                <dt className="text-[var(--text-muted)] text-sm">Started</dt>
                                <dd className="font-medium">
                                    {new Date(project.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                    })}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-[var(--text-muted)] text-sm">Status</dt>
                                <dd className="font-medium">
                                    {project.progress === 100 ? (
                                        <span className="text-[var(--neon-green)]">Completed</span>
                                    ) : (
                                        <span className="text-[var(--neon-cyan)]">In Development</span>
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </section>

                    {/* CTA */}
                    <div className="cyber-card p-6 neon-border">
                        <h3 className="text-lg font-semibold mb-2">Interested?</h3>
                        <p className="text-[var(--text-secondary)] text-sm mb-4">
                            Let&apos;s discuss this project or similar solutions.
                        </p>
                        <Link href="/contact" className="cyber-btn w-full text-center block">
                            Contact Me
                        </Link>
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <div className="mt-12">
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    Back to Projects
                </Link>
            </div>
        </div>
    )
}
