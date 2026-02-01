import Link from 'next/link'
import Image from 'next/image'
import { getSkills } from '@/lib/queries'

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

    return (
        <div className="container mx-auto px-6 py-12">
            {/* Header */}
            <div className="mb-16">
                <h1 className="section-title gradient-text">About Me</h1>
                <p className="section-subtitle">
                    From idea to production — architecting digital solutions end-to-end.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Bio */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="text-[var(--neon-cyan)]">{'>'}</span>
                            Who I Am
                        </h2>
                        <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                            <p>
                                I&apos;m <span className="text-[var(--neon-cyan)]">nzt108_dev</span> —
                                a software architect who builds complete digital solutions from zero to launch.
                                Not just a developer who codes, but a partner who thinks through every aspect
                                of your project: architecture, technology stack, user experience, and scalability.
                            </p>
                            <p>
                                <span className="text-[var(--text-primary)]">Have an idea?</span> I&apos;ll help you
                                structure it, choose the right technologies, and build it step by step.
                                <span className="text-[var(--text-primary)]"> Don&apos;t have one yet?</span> Let&apos;s
                                brainstorm together — some of the best projects start as rough concepts.
                            </p>
                        </div>
                    </section>

                    {/* What Makes Me Different */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="text-[var(--neon-pink)]">{'>'}</span>
                            Why Work With Me
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="cyber-card p-6">
                                <div className="text-2xl mb-3">🏗️</div>
                                <h3 className="text-lg font-semibold mb-2">End-to-End Delivery</h3>
                                <p className="text-[var(--text-secondary)] text-sm">
                                    From initial concept to deployed product. No handoffs, no gaps —
                                    I own the entire journey.
                                </p>
                            </div>
                            <div className="cyber-card p-6">
                                <div className="text-2xl mb-3">🎯</div>
                                <h3 className="text-lg font-semibold mb-2">Architecture First</h3>
                                <p className="text-[var(--text-secondary)] text-sm">
                                    Clean foundations that scale. I design systems that grow
                                    with your business, not against it.
                                </p>
                            </div>
                            <div className="cyber-card p-6">
                                <div className="text-2xl mb-3">💡</div>
                                <h3 className="text-lg font-semibold mb-2">Idea Partner</h3>
                                <p className="text-[var(--text-secondary)] text-sm">
                                    Stuck on what to build? I help refine vague ideas into
                                    concrete, actionable plans.
                                </p>
                            </div>
                            <div className="cyber-card p-6">
                                <div className="text-2xl mb-3">🚀</div>
                                <h3 className="text-lg font-semibold mb-2">Modern Stack</h3>
                                <p className="text-[var(--text-secondary)] text-sm">
                                    Using battle-tested technologies that ensure performance,
                                    security, and maintainability.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Skills as Badges */}
                    <section>
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <span className="text-[var(--neon-purple)]">{'>'}</span>
                            Technologies
                        </h2>

                        <div className="space-y-6">
                            {skillCategories.map((category) => {
                                const categorySkills = skills.filter(
                                    (s) => s.category === category.id
                                )
                                if (categorySkills.length === 0) return null

                                return (
                                    <div key={category.id}>
                                        <h3 className="text-sm font-medium mb-3 text-[var(--text-muted)] uppercase tracking-wider">
                                            {category.name}
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {categorySkills.map((skill) => (
                                                <span key={skill.name} className="skill-badge">
                                                    {skill.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>

                    {/* What I Build */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="text-[var(--neon-cyan)]">{'>'}</span>
                            What I Build
                        </h2>
                        <div className="flex flex-wrap gap-4">
                            {[
                                { icon: '📱', label: 'Mobile Apps' },
                                { icon: '🤖', label: 'Telegram Bots' },
                                { icon: '🌐', label: 'Web Platforms' },
                                { icon: '⚙️', label: 'APIs & Microservices' },
                                { icon: '☁️', label: 'Cloud Infrastructure' },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]"
                                >
                                    <span>{item.icon}</span>
                                    <span className="text-[var(--text-secondary)]">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Profile Card */}
                    <div className="cyber-card p-8 text-center neon-border">
                        <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-2 border-[var(--neon-cyan)] shadow-[var(--glow-cyan)]">
                            <Image
                                src="/logo.jpg"
                                alt="nzt108_dev"
                                width={128}
                                height={128}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="text-xl font-bold mb-1">nzt108_dev</h3>
                        <p className="text-[var(--neon-cyan)]">Software Architect</p>
                        <p className="text-[var(--text-muted)] text-sm mt-4 italic">
                            &quot;From zero to launch, I&apos;ve got you covered&quot;
                        </p>
                    </div>

                    {/* Quick Facts */}
                    <div className="cyber-card p-6">
                        <h3 className="text-lg font-semibold mb-4">Quick Facts</h3>
                        <ul className="space-y-3 text-[var(--text-secondary)]">
                            <li className="flex items-center gap-3">
                                <span className="text-[var(--neon-cyan)]">📍</span>
                                Remote / Worldwide
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-[var(--neon-cyan)]">💼</span>
                                Open for projects
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-[var(--neon-cyan)]">🔑</span>
                                Full-cycle development
                            </li>
                        </ul>
                    </div>

                    {/* CTA */}
                    <div className="cyber-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Ready to Build?</h3>
                        <p className="text-[var(--text-secondary)] text-sm mb-4">
                            Whether you have a clear vision or just a spark of an idea —
                            let&apos;s talk.
                        </p>
                        <Link href="/contact" className="cyber-btn w-full text-center block">
                            Start a Conversation
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
