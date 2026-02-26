import Link from 'next/link'
import { getProjectBySlug, getProjects } from '@/lib/queries'
import { notFound } from 'next/navigation'
import ImageGallery from '@/components/ui/ImageGallery'

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
        mobile: 'APP',
        telegram: 'BOT',
        web: 'WEB',
        saas: 'SYS',
        discord: 'BOT',
    }

    const statusLabel =
        project.progress === 100
            ? 'DEPLOYED'
            : project.progress > 0
                ? 'IN_PROGRESS'
                : 'INITIATING'

    return (
        <div className="container mx-auto px-6 py-20 lg:py-32 relative z-10 w-full max-w-7xl">
            {/* Breadcrumb Console */}
            <nav className="flex items-center gap-3 font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-12 border-b border-[var(--border-color)] pb-4">
                <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
                    ROOT
                </Link>
                <span className="text-[var(--text-secondary)]">/</span>
                <Link href="/projects" className="hover:text-[var(--text-primary)] transition-colors">
                    ARCHIVE
                </Link>
                <span className="text-[var(--accent-primary)]">/</span>
                <span className="text-[var(--text-primary)] font-bold">{project.slug}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-4 mb-6 font-mono">
                            <span className="bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--accent-primary)] text-xs font-bold px-3 py-1.5 rounded uppercase tracking-widest">
                                [{categoryLabels[project.category] || project.category.toUpperCase()}]
                            </span>
                            <span className={`text-xs font-bold px-3 py-1.5 rounded border uppercase tracking-widest ${project.progress === 100
                                ? 'bg-[var(--bg-primary)] border-[var(--accent-green)] text-[var(--accent-green)]'
                                : 'bg-[var(--bg-card)] border-[var(--accent-primary)] text-[var(--accent-primary)]'
                                }`}>
                                STATUS: {statusLabel}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter text-[var(--text-primary)] leading-[1.1]">
                            {project.title}
                        </h1>
                        <p className="font-mono text-[var(--text-secondary)] text-sm md:text-base leading-relaxed max-w-3xl border-l-[3px] border-[var(--accent-primary)] pl-6">
                            {project.longDescription || project.description}
                        </p>
                    </div>

                    {/* Technical Spec */}
                    {project.ideaText && (
                        <section className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 md:p-10 rounded-[2rem]">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-4 text-[var(--text-primary)]">
                                <span className="font-mono text-[var(--accent-primary)] text-sm tracking-widest">[ SPEC ]</span>
                                Technical Architecture
                            </h2>
                            <p className="text-[var(--text-secondary)] font-mono text-sm leading-relaxed whitespace-pre-line">
                                {project.ideaText}
                            </p>
                        </section>
                    )}

                    {/* Client Outcomes */}
                    {project.clientBenefit && (
                        <section className="bg-[var(--bg-card)] border border-[var(--accent-primary)] p-8 md:p-10 rounded-[2rem] shadow-[0_4px_30px_rgba(230,59,46,0.05)]">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-4 text-[var(--text-primary)]">
                                <span className="font-mono text-[var(--accent-primary)] text-sm tracking-widest">[ ROI ]</span>
                                Business Outcomes
                            </h2>
                            <p className="text-[var(--text-secondary)] font-mono text-sm leading-relaxed whitespace-pre-line">
                                {project.clientBenefit}
                            </p>
                        </section>
                    )}

                    {/* Screenshots Gallery */}
                    {project.screenshots.length > 0 && (
                        <section className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 md:p-10 rounded-[2rem]">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-4 text-[var(--text-primary)]">
                                <span className="font-mono text-[var(--accent-primary)] text-sm tracking-widest">[ VISUALS ]</span>
                                Interface Capture
                            </h2>
                            <ImageGallery images={project.screenshots} title={project.title} />
                        </section>
                    )}

                    {/* Roadmap */}
                    {project.roadmap.length > 0 && (
                        <section className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 md:p-10 rounded-[2rem]">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-4 text-[var(--text-primary)]">
                                <span className="font-mono text-[var(--accent-primary)] text-sm tracking-widest">[ LOG ]</span>
                                Execution Timeline
                            </h2>
                            <div className="space-y-4">
                                {project.roadmap.map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 border border-[var(--border-color)] bg-[var(--bg-primary)] rounded-xl">
                                        <div className={`mt-1 font-mono text-xs font-bold tracking-widest ${item.status === 'done'
                                            ? 'text-[var(--accent-green)]'
                                            : item.status === 'in-progress'
                                                ? 'text-[var(--accent-primary)] animate-pulse'
                                                : 'text-[var(--text-muted)]'
                                            }`}>
                                            {item.status === 'done' ? '[✓]' : item.status === 'in-progress' ? '[>]' : '[-]'}
                                        </div>
                                        <span className={`font-mono text-sm leading-relaxed ${item.status === 'done'
                                            ? 'text-[var(--text-secondary)] line-through opacity-70'
                                            : item.status === 'in-progress'
                                                ? 'text-[var(--text-primary)] font-bold'
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
                <div className="space-y-8">

                    {/* Technologies */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-[2rem] shadow-lg">
                        <h3 className="font-mono text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest mb-6">
                            {'>'} Stack Requirements
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech) => (
                                <span key={tech} className="px-3 py-1.5 font-mono text-xs text-[var(--text-primary)] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-[2rem] shadow-lg">
                        <div className="flex justify-between items-end mb-4">
                            <h3 className="font-mono text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest">
                                Build Progress
                            </h3>
                            <span className="font-mono text-2xl font-bold text-[var(--accent-primary)] leading-none">
                                {project.progress}%
                            </span>
                        </div>
                        {/* Brutalist Progress Bar */}
                        <div className="w-full h-8 bg-[var(--bg-primary)] border border-[var(--border-color)] relative overflow-hidden flex">
                            <div
                                className="h-full bg-[var(--accent-primary)] transition-all duration-1000 ease-out flex items-center justify-end pr-2 opacity-80"
                                style={{ width: `${project.progress}%` }}
                            >
                                <span className="font-mono text-[10px] text-[var(--bg-primary)] font-bold mix-blend-difference opacity-50 block md:hidden lg:block whitespace-nowrap">
                                    SYS_LOADING
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-[2rem] flex flex-col gap-4 shadow-lg">
                        {project.demoUrl ? (
                            <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative bg-[var(--bg-primary)] border border-[var(--accent-primary)] px-6 py-4 flex items-center justify-center gap-3 hover:bg-[var(--accent-primary)]/10 transition-colors rounded-xl w-full"
                            >
                                <span className="font-mono text-[var(--text-primary)] text-xs uppercase tracking-widest">Launch App</span>
                                <div className="w-1.5 h-3 bg-[var(--accent-primary)] animate-pulse" />
                            </a>
                        ) : (
                            <div className="bg-[var(--bg-primary)] border border-[var(--border-color)]/50 px-6 py-4 flex items-center justify-center rounded-xl w-full opacity-50 cursor-not-allowed">
                                <span className="font-mono text-[var(--text-muted)] text-xs uppercase tracking-widest">Internal Access Only</span>
                            </div>
                        )}

                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[var(--bg-primary)] border border-[var(--border-color)] px-6 py-4 flex items-center justify-center hover:border-[var(--text-primary)] transition-colors rounded-xl w-full"
                            >
                                <span className="font-mono text-[var(--text-secondary)] text-xs uppercase tracking-widest">
                                    Source Code
                                </span>
                            </a>
                        )}
                    </div>

                    {/* CTA */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-[2rem] shadow-lg">
                        <h3 className="font-bold text-xl mb-3 text-[var(--text-primary)] tracking-tight">Need Similar Scope?</h3>
                        <p className="text-[var(--text-secondary)] font-mono text-xs leading-relaxed mb-6">
                            I can architect a custom solution matching your specific business logic.
                        </p>
                        <Link href="/contact" className="inline-flex items-center gap-2 text-[var(--text-primary)] border-b border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors font-mono text-sm uppercase tracking-widest">
                            Request Assessment →
                        </Link>
                    </div>

                    {/* Back */}
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-3 font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent-primary)] uppercase tracking-widest mt-8"
                    >
                        <span>{'<'}</span> Return to Archive
                    </Link>
                </div>
            </div>
        </div>
    )
}
