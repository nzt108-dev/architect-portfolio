'use client'

import { useRouter } from 'next/navigation'
import { Category } from '@/types'

interface Props {
    categories: Category[]
    activeCategory: string
}

export default function ProjectsFilter({ categories, activeCategory }: Props) {
    const router = useRouter()

    const handleCategoryChange = (categoryId: string) => {
        if (categoryId === 'all') {
            router.push('/projects')
        } else {
            router.push(`/projects?category=${categoryId}`)
        }
    }

    return (
        <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${activeCategory === category.id
                            ? 'bg-[var(--neon-cyan)] text-[var(--bg-primary)] shadow-[var(--glow-cyan)]'
                            : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]'
                        }`}
                >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                </button>
            ))}
        </div>
    )
}
