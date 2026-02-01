'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Skill {
    id: string
    name: string
    category: string
    order: number
}

const categories = [
    { id: 'language', name: 'Languages' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'database', name: 'Database' },
    { id: 'devops', name: 'DevOps' },
    { id: 'cloud', name: 'Cloud' },
    { id: 'architecture', name: 'Architecture' },
]

export default function AdminSkillsPage() {
    const [skills, setSkills] = useState<Skill[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [newSkillName, setNewSkillName] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('language')
    const router = useRouter()

    useEffect(() => {
        fetchSkills()
    }, [])

    const fetchSkills = async () => {
        const res = await fetch('/api/skills')
        const data = await res.json()
        setSkills(data)
        setIsLoading(false)
    }

    const addSkill = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newSkillName.trim()) return

        await fetch('/api/skills', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: newSkillName,
                category: selectedCategory,
                level: 80,
            }),
        })

        setNewSkillName('')
        fetchSkills()
        router.refresh()
    }

    const deleteSkill = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"?`)) return

        await fetch(`/api/skills/${id}`, { method: 'DELETE' })
        fetchSkills()
        router.refresh()
    }

    // Group skills by category
    const groupedSkills = categories.reduce((acc, cat) => {
        acc[cat.id] = skills.filter((s) => s.category === cat.id)
        return acc
    }, {} as Record<string, Skill[]>)

    if (isLoading) {
        return <div className="animate-pulse">Loading skills...</div>
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Skills Management</h1>

            {/* Add new skill */}
            <form onSubmit={addSkill} className="cyber-card p-6 mb-8 flex gap-4 items-end">
                <div className="flex-grow">
                    <label className="block text-sm font-medium mb-2">Skill Name</label>
                    <input
                        type="text"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        className="cyber-input"
                        placeholder="e.g. TypeScript"
                    />
                </div>
                <div className="w-48">
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="cyber-input"
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="cyber-btn">
                    Add Skill
                </button>
            </form>

            {/* Skills by category */}
            <div className="space-y-6">
                {categories.map((cat) => {
                    const catSkills = groupedSkills[cat.id]
                    if (catSkills.length === 0) return null

                    return (
                        <div key={cat.id} className="cyber-card p-6">
                            <h3 className="text-lg font-semibold mb-4">{cat.name}</h3>
                            <div className="flex flex-wrap gap-3">
                                {catSkills.map((skill) => (
                                    <div
                                        key={skill.id}
                                        className="skill-badge group flex items-center gap-2"
                                    >
                                        {skill.name}
                                        <button
                                            onClick={() => deleteSkill(skill.id, skill.name)}
                                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
