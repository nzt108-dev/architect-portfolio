import { getProjects, categories } from '@/lib/queries'
import ProjectCard from '@/components/ui/ProjectCard'
import ProjectsFilter from './ProjectsFilter'

export const dynamic = 'force-dynamic'

interface Props {
    searchParams: Promise<{ category?: string }>
}

export default async function ProjectsPage({ searchParams }: Props) {
    const { category } = await searchParams
    const activeCategory = category || 'all'
    const projects = await getProjects(activeCategory)

    return (
        <div className="container mx-auto px-6 py-12">
            {/* Header */}
            <div className="mb-12">
                <h1 className="section-title gradient-text">Projects</h1>
                <p className="section-subtitle">
                    Explore my ongoing and completed projects across different domains.
                </p>
            </div>

            {/* Category Filter */}
            <ProjectsFilter
                categories={categories}
                activeCategory={activeCategory}
            />

            {/* Projects Count */}
            <div className="mb-6 text-[var(--text-secondary)]">
                Showing <span className="text-[var(--neon-cyan)] font-semibold">{projects.length}</span> project{projects.length !== 1 ? 's' : ''}
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>

            {/* Empty State */}
            {projects.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-[var(--text-muted)] text-lg">
                        No projects found in this category.
                    </p>
                </div>
            )}
        </div>
    )
}
