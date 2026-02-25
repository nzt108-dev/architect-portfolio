import Link from 'next/link'
import { Project } from '@/types'

interface ProjectCardProps {
    project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
    // Keep a subtle accent color based on category but make it raw
    const categoryAccent = project.category === 'mobile' ? 'var(--accent-primary)' :
        project.category === 'web' ? 'var(--accent-secondary)' :
            'var(--text-secondary)'

    return (
        <Link href={`/projects/${project.slug}`} className="block group h-full">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2rem] h-full flex flex-col overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.8)] transition-all duration-300 hover:border-[var(--accent-primary)] hover:-translate-y-1 relative">

                {/* Image / Thumbnail Container */}
                <div className="relative h-48 border-b border-[var(--border-color)] bg-[var(--bg-primary)] overflow-hidden">
                    {project.screenshots?.length > 0 ? (
                        <>
                            <img
                                src={project.screenshots[0]}
                                alt={project.title}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 origin-center scale-100 group-hover:scale-105"
                            />
                            {/* Scanning line effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-80" />
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center premium-grid opacity-30">
                            <span className="font-mono text-[var(--text-secondary)] text-xs uppercase tracking-widest">NO_SIGNAL</span>
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-[var(--bg-primary)]/80 backdrop-blur-sm border border-[var(--border-color)] rounded-full px-3 py-1 z-10">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryAccent }} />
                        <span className="text-xs font-mono uppercase tracking-widest">{project.category}</span>
                    </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                    {/* Progress Track */}
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[var(--text-secondary)] font-mono text-xs uppercase tracking-widest">
                            Build.Progress
                        </span>
                        <span className="text-[var(--text-primary)] font-mono text-xs">
                            [{project.progress}%]
                        </span>
                    </div>
                    {/* Brutalist Progress Bar */}
                    <div className="w-full h-[2px] bg-[var(--border-color)] mb-6 relative">
                        <div
                            className="absolute top-0 left-0 h-full transition-all duration-1000"
                            style={{ width: `${project.progress}%`, backgroundColor: categoryAccent }}
                        />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-3 tracking-tighter group-hover:text-[var(--accent-primary)] transition-colors">
                        {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[var(--text-secondary)] font-mono text-sm leading-relaxed line-clamp-2 mb-6 flex-1">
                        {project.description}
                    </p>

                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {project.technologies.slice(0, 3).map((tech) => (
                            <span key={tech} className="bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-mono text-[10px] uppercase tracking-widest py-1 px-2 rounded-md">
                                {tech}
                            </span>
                        ))}
                        {project.technologies.length > 3 && (
                            <span className="text-[var(--text-secondary)] font-mono text-[10px] self-center">
                                +{project.technologies.length - 3}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}
