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
        <div className="flex flex-wrap gap-4 mb-12">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-widest transition-all border ${activeCategory === category.id
                        ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white shadow-[4px_4px_0_0_var(--text-primary)] translate-y-[-2px] translate-x-[-2px]'
                        : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]'
                        }`}
                >
                    <span className="mr-2 opacity-50">{category.icon}</span>
                    [{category.name}]
                </button>
            ))}
        </div>
    )
}
