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
        <div className="container mx-auto px-6 py-20 lg:py-32 relative z-10 w-full max-w-7xl">
            {/* Header */}
            <div className="mb-20">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter text-[var(--text-primary)]">
                    System <span className="font-[var(--font-dm-serif)] italic text-[var(--accent-primary)]">Architect.</span>
                </h1>
                <p className="font-mono text-[var(--text-secondary)] text-sm md:text-base uppercase tracking-widest">
                    {'//'} From idea to production — architecting digital solutions end-to-end.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-20">

                    {/* Bio */}
                    <section>
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-4 text-[var(--text-primary)]">
                            <span className="font-mono text-[var(--accent-primary)] text-sm tracking-widest">[ IDENTITY ]</span>
                            Who I Am
                        </h2>
                        <div className="space-y-6 text-[var(--text-secondary)] leading-relaxed text-lg font-mono">
                            <p>
                                I&apos;m <span className="text-[var(--text-primary)] font-bold">nzt108_dev</span> —
                                a software architect who builds complete digital solutions from zero to launch.
                                Not just a developer who writes code, but a technical partner who engineers every aspect
                                of your business product: application architecture, technology stack, user experience, and scalability.
                            </p>
                            <p>
                                <span className="text-[var(--text-primary)] font-bold">Have a business idea?</span> I&apos;ll help you
                                structure the requirements, select the optimal tech stack, and build it predictably.
                                <span className="text-[var(--text-primary)] font-bold"> Don&apos;t have a spec yet?</span> Let&apos;s
                                engineer one together — scalable platforms begin with precise blueprints.
                            </p>
                        </div>
                    </section>

                    {/* What Makes Me Different */}
                    <section>
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-4 text-[var(--text-primary)]">
                            <span className="font-mono text-[var(--accent-primary)] text-sm tracking-widest">[ ADVANTAGE ]</span>
                            Execution Protocols
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-[2rem] shadow-md transition-colors hover:border-[var(--accent-primary)]">
                                <div className="font-mono text-[var(--accent-primary)] text-sm mb-4 font-bold tracking-widest">[01]</div>
                                <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">End-to-End Delivery</h3>
                                <p className="text-[var(--text-secondary)] font-mono text-sm leading-relaxed">
                                    From initial systems concept to deployed production environment. No handoffs, no gaps — I own the entire development lifecycle.
                                </p>
                            </div>

                            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-[2rem] shadow-md transition-colors hover:border-[var(--accent-primary)]">
                                <div className="font-mono text-[var(--accent-primary)] text-sm mb-4 font-bold tracking-widest">[02]</div>
                                <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">Architecture First</h3>
                                <p className="text-[var(--text-secondary)] font-mono text-sm leading-relaxed">
                                    Clean foundational code that scales. I design system logic that grows alongside your user base and business requirements.
                                </p>
                            </div>

                            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-[2rem] shadow-md transition-colors hover:border-[var(--accent-primary)]">
                                <div className="font-mono text-[var(--accent-primary)] text-sm mb-4 font-bold tracking-widest">[03]</div>
                                <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">Technical Partner</h3>
                                <p className="text-[var(--text-secondary)] font-mono text-sm leading-relaxed">
                                    Stuck on what to build? I help refine vague business ideas into concrete, actionable engineering roadmaps.
                                </p>
                            </div>

                            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-[2rem] shadow-md transition-colors hover:border-[var(--accent-primary)]">
                                <div className="font-mono text-[var(--accent-primary)] text-sm mb-4 font-bold tracking-widest">[04]</div>
                                <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">Modern Stack</h3>
                                <p className="text-[var(--text-secondary)] font-mono text-sm leading-relaxed">
                                    Utilizing battle-tested, high-performance technologies that ensure application speed, security, and long-term maintainability.
                                </p>
                            </div>

                        </div>
                    </section>

                    {/* What I Build */}
                    <section>
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-4 text-[var(--text-primary)]">
                            <span className="font-mono text-[var(--accent-primary)] text-sm tracking-widest">[ OUTPUTS ]</span>
                            Deliverables
                        </h2>
                        <div className="flex flex-wrap gap-4">
                            {[
                                { id: 'APP', label: 'Mobile Applications' },
                                { id: 'BOT', label: 'Telegram & Discord Bots' },
                                { id: 'WEB', label: 'SaaS Platforms' },
                                { id: 'API', label: 'Microservices & Backends' },
                                { id: 'SYS', label: 'Cloud Infrastructure' },
                            ].map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 px-6 py-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--text-secondary)] transition-colors"
                                >
                                    <span className="font-mono text-[var(--accent-primary)] text-xs font-bold tracking-widest">[{item.id}]</span>
                                    <span className="text-[var(--text-primary)] font-bold text-sm tracking-wide">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Skills as Badges */}
                    <section>
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-4 text-[var(--text-primary)]">
                            <span className="font-mono text-[var(--accent-primary)] text-sm tracking-widest">[ STACK ]</span>
                            Technologies
                        </h2>

                        <div className="space-y-8 p-8 border border-[var(--border-color)] bg-[var(--bg-card)] rounded-[2rem]">
                            {skillCategories.map((category) => {
                                const categorySkills = skills.filter(
                                    (s) => s.category === category.id
                                )
                                if (categorySkills.length === 0) return null

                                return (
                                    <div key={category.id} className="border-b border-[var(--border-color)] pb-6 last:border-0 last:pb-0">
                                        <h3 className="text-xs font-bold mb-4 text-[var(--text-secondary)] font-mono uppercase tracking-widest">
                                            {'>'} {category.name}
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {categorySkills.map((skill) => (
                                                <span
                                                    key={skill.name}
                                                    className="px-3 py-1.5 font-mono text-xs text-[var(--text-primary)] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md hover:border-[var(--accent-primary)] transition-colors"
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
                <div className="space-y-6">

                    {/* Profile Card */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 text-center rounded-[2rem] shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[var(--accent-primary)]" />
                        <div className="w-40 h-40 mx-auto mb-8 rounded-full overflow-hidden border border-[var(--border-color)] group-hover:border-[var(--accent-primary)] transition-colors duration-500">
                            <Image
                                src="/logo.jpg"
                                alt="nzt108_dev"
                                width={160}
                                height={160}
                                className="w-full h-full object-cover grayscale contrast-125 brightness-110 group-hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 tracking-tight">nzt108_dev</h3>
                        <p className="font-mono text-[var(--accent-primary)] text-sm uppercase tracking-widest mb-6">Software Architect</p>

                        <div className="pt-6 border-t border-[var(--border-color)] font-mono text-xs text-[var(--text-secondary)] text-left space-y-3">
                            <div className="flex justify-between">
                                <span className="uppercase tracking-widest">Status:</span>
                                <span className="text-[var(--accent-green)]">Online</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="uppercase tracking-widest">Location:</span>
                                <span>Worldwide</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="uppercase tracking-widest">Availability:</span>
                                <span>Accepting Projects</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Facts */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-[2rem] shadow-lg">
                        <h3 className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-widest mb-6">{'>'} Telemetry</h3>
                        <ul className="space-y-4 font-mono text-[var(--text-primary)] text-sm">
                            <li className="flex items-start gap-4">
                                <span className="text-[var(--accent-primary)] font-bold mt-0.5">[+]</span>
                                Full-cycle product development
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="text-[var(--accent-primary)] font-bold mt-0.5">[+]</span>
                                Specialized in React & Node ecosystems
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="text-[var(--accent-primary)] font-bold mt-0.5">[+]</span>
                                Focus on low-latency and scalability
                            </li>
                        </ul>
                    </div>

                    {/* CTA */}
                    <div className="bg-[var(--bg-card)] border border-[var(--accent-primary)] p-8 rounded-[2rem] shadow-[0_0_20px_rgba(230,59,46,0.1)] hover:bg-[var(--bg-card)] transition-colors">
                        <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">Ready to Build?</h3>
                        <p className="text-[var(--text-secondary)] font-mono text-xs leading-relaxed mb-6">
                            Whether you have a confirmed technical spec or just a spark of an idea — let&apos;s start engineering.
                        </p>
                        <Link href="/contact" className="group relative bg-[var(--bg-primary)] border border-[var(--border-color)] px-6 py-4 flex items-center justify-center gap-3 hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 transition-colors rounded-xl w-full">
                            <span className="font-mono text-[var(--text-primary)] text-xs uppercase tracking-widest">Init Payload</span>
                            <div className="w-1 h-3 bg-[var(--accent-primary)] animate-pulse" />
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}
