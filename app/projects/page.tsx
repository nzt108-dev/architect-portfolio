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
        <div className="container mx-auto px-6 py-20 lg:py-32 relative z-10 w-full max-w-7xl">
            {/* Header */}
            <div className="mb-20">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter text-[var(--text-primary)]">
                    Project <span className="font-[var(--font-dm-serif)] italic text-[var(--accent-primary)]">Archive.</span>
                </h1>
                <p className="font-mono text-[var(--text-secondary)] text-sm md:text-base uppercase tracking-widest">
                    {'//'} Executed protocols and production deployments.
                </p>
            </div>

            {/* Category Filter */}
            <ProjectsFilter
                categories={categories}
                activeCategory={activeCategory}
            />

            {/* Projects Count */}
            <div className="mb-8 font-mono text-[var(--text-secondary)] text-sm uppercase tracking-widest flex items-center gap-3">
                <span>Total Nodes: <span className="text-[var(--text-primary)] font-bold">[{projects.length}]</span></span>
                <span className="w-full h-[1px] bg-[var(--border-color)] flex-1"></span>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>

            {/* Empty State */}
            {projects.length === 0 && (
                <div className="text-center py-32 border border-dashed border-[var(--border-color)] rounded-[2rem] bg-[var(--bg-card)]">
                    <p className="font-mono text-[var(--text-muted)] text-sm uppercase tracking-widest">
                        {'>'} NO DEPLOYMENTS FOUND IN THIS REGION.
                    </p>
                </div>
            )}
        </div>
    )
}
