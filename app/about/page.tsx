import Link from 'next/link'
import Image from 'next/image'
import { getSkills } from '@/lib/queries'
import { ArrowRight, Zap, Target, Users, Code } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
    const skills = await getSkills()

    const skillCategories = [
        { id: 'language', name: 'Languages' },
        { id: 'frontend', name: 'Frontend' },
        { id: 'backend', name: 'Backend' },
        { id: 'database', name: 'Database' },
        { id: 'devops', name: 'DevOps' },
        { id: 'cloud', name: 'Cloud' },
        { id: 'architecture', name: 'Architecture' },
    ]

    const advantages = [
        {
            icon: Target,
            title: 'End-to-End Delivery',
            description: 'From concept to production. No handoffs, no gaps — I own the entire lifecycle.',
        },
        {
            icon: Code,
            title: 'Architecture First',
            description: 'Clean code that scales. Systems designed to grow with your user base and business.',
        },
        {
            icon: Users,
            title: 'Technical Partner',
            description: 'Not just a coder. I help refine ideas into actionable engineering roadmaps.',
        },
        {
            icon: Zap,
            title: 'Modern Stack',
            description: 'Battle-tested technologies ensuring speed, security, and long-term maintainability.',
        },
    ]

    return (
        <div className="container mx-auto px-6 py-20 lg:py-32 relative z-10 w-full max-w-6xl">
            {/* Header */}
            <div className="mb-16">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-[var(--text-primary)]">
                    About Me
                </h1>
                <p className="text-[var(--text-secondary)] text-lg">
                    Full-stack developer building digital products from idea to launch.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-16">

                    {/* Bio */}
                    <section>
                        <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Who I Am</h2>
                        <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                            <p>
                                I&apos;m a software developer who builds complete digital products from zero to launch.
                                Not just writing code — I handle architecture, tech stack selection, UX, and scalability.
                            </p>
                            <p>
                                <strong className="text-[var(--text-primary)]">Have a business idea?</strong> I&apos;ll help you
                                structure requirements, pick the right stack, and build it predictably.{' '}
                                <strong className="text-[var(--text-primary)]">Don&apos;t have a spec yet?</strong> Let&apos;s
                                create one together — great products start with clear blueprints.
                            </p>
                        </div>
                    </section>

                    {/* Advantages */}
                    <section>
                        <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)]">What Sets Me Apart</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {advantages.map((item) => {
                                const Icon = item.icon
                                return (
                                    <div key={item.title} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-xl transition-all duration-200 hover:border-[var(--border-hover)] hover:shadow-sm">
                                        <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center mb-4">
                                            <Icon size={20} className="text-[var(--accent-primary)]" />
                                        </div>
                                        <h3 className="text-base font-bold mb-2 text-[var(--text-primary)]">{item.title}</h3>
                                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </section>

                    {/* What I Build */}
                    <section>
                        <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)]">What I Build</h2>
                        <div className="flex flex-wrap gap-2">
                            {[
                                'Mobile Applications',
                                'Telegram & Discord Bots',
                                'SaaS Platforms',
                                'Microservices & Backends',
                                'Cloud Infrastructure',
                            ].map((item) => (
                                <span
                                    key={item}
                                    className="badge text-sm"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Skills */}
                    <section>
                        <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Tech Stack</h2>
                        <div className="space-y-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                            {skillCategories.map((category) => {
                                const categorySkills = skills.filter(
                                    (s) => s.category === category.id
                                )
                                if (categorySkills.length === 0) return null

                                return (
                                    <div key={category.id} className="border-b border-[var(--border-color)] pb-4 last:border-0 last:pb-0">
                                        <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                                            {category.name}
                                        </h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {categorySkills.map((skill) => (
                                                <span
                                                    key={skill.name}
                                                    className="skill-badge"
                                                >
                                                    {skill.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-5">
                    {/* Profile Card */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 text-center rounded-2xl shadow-sm">
                        <div className="w-32 h-32 mx-auto mb-5 rounded-2xl overflow-hidden border border-[var(--border-color)]">
                            <Image
                                src="/logo.jpg"
                                alt="nzt108.dev"
                                width={128}
                                height={128}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="text-xl font-bold mb-1 tracking-tight">nzt108.dev</h3>
                        <p className="text-[var(--accent-primary)] text-sm font-medium mb-5">Full-Stack Developer</p>

                        <div className="text-sm text-[var(--text-secondary)] space-y-2 text-left border-t border-[var(--border-color)] pt-4">
                            <div className="flex justify-between">
                                <span>Status</span>
                                <span className="text-[var(--accent-green)] font-medium">Available</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Location</span>
                                <span className="text-[var(--text-primary)]">Remote / Worldwide</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Response</span>
                                <span className="text-[var(--text-primary)]">Within 24h</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Facts */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Quick Facts</h3>
                        <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
                            <li className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                                Full-cycle product development
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                                React, Node.js & Flutter specialist
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                                Performance & scalability focus
                            </li>
                        </ul>
                    </div>

                    {/* CTA */}
                    <div className="bg-[var(--bg-card)] border border-[var(--accent-primary)]/30 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">Ready to Build?</h3>
                        <p className="text-[var(--text-secondary)] text-sm mb-4">
                            Have an idea or technical spec? Let&apos;s make it happen.
                        </p>
                        <Link href="/contact" className="btn-primary w-full py-3 rounded-xl text-sm text-center">
                            Get in Touch
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
