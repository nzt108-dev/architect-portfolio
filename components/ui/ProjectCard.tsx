import Link from 'next/link'
import { Project } from '@/types'
import { ArrowUpRight } from 'lucide-react'

interface ProjectCardProps {
    project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Link href={`/projects/${project.slug}`} className="block group h-full">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl h-full flex flex-col overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-lg hover:-translate-y-1">

                {/* Image */}
                <div className="relative h-52 bg-[var(--bg-secondary)] overflow-hidden">
                    {project.screenshots?.length > 0 ? (
                        <div className="relative w-full h-full flex items-center justify-center p-6">
                            {project.screenshots.slice(0, 3).map((img, i) => {
                                const isMultiple = project.screenshots.length > 1
                                const rotation = isMultiple ? (i === 0 ? '-rotate-3' : i === 1 ? 'z-10 scale-105' : 'rotate-3') : ''

                                return (
                                    <div key={i} className={`relative flex-1 h-full transition-all duration-500 origin-center group-hover:scale-[1.02] ${rotation}`}>
                                        <img
                                            src={img}
                                            alt={`${project.title} screenshot ${i + 1}`}
                                            className={`w-full h-full object-contain transition-all duration-500 drop-shadow-lg ${isMultiple ? 'opacity-90 group-hover:opacity-100' : ''}`}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-[var(--text-muted)] text-sm">No preview</span>
                        </div>
                    )}

                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                        <span className="badge text-xs capitalize">
                            {project.category}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold tracking-tight group-hover:text-[var(--accent-primary)] transition-colors">
                            {project.title}
                        </h3>
                        <ArrowUpRight size={18} className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors flex-shrink-0 mt-1" />
                    </div>

                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed line-clamp-2 mb-5 flex-1">
                        {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                        {project.technologies.slice(0, 4).map((tech) => (
                            <span key={tech} className="text-xs text-[var(--text-secondary)] bg-[var(--bg-secondary)] py-1 px-2.5 rounded-md font-medium">
                                {tech}
                            </span>
                        ))}
                        {project.technologies.length > 4 && (
                            <span className="text-xs text-[var(--text-muted)] self-center">
                                +{project.technologies.length - 4}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}
