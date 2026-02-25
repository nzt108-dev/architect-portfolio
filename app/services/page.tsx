import Link from 'next/link'
import LeadCaptureWidget from '@/components/ui/LeadCaptureWidget'

export const dynamic = 'force-dynamic'

const services = [
    {
        id: 'mobile',
        code: 'APP',
        title: 'Mobile Applications',
        description: 'Cross-platform iOS & Android mobile architectures. One unified codebase, dual platforms, uncompromising native performance.',
        features: [
            'Cross-platform (iOS + Android)',
            'Push notifications & precise telemetry',
            'Offline-first data architecture',
            'App Store & Google Play deployment',
            'Low-latency backend integration',
        ],
        timeline: 'ETA: 14+ Days',
        tech: ['Flutter', 'Dart', 'React Native', 'Swift', 'Kotlin', 'Firebase', 'Supabase', 'SQLite'],
    },
    {
        id: 'web',
        code: 'WEB',
        title: 'Websites & Landing Pages',
        description: 'High-performance, brutalist responsive web properties. From high-conversion landing pages to complex, interactive web applications.',
        features: [
            'Responsive layouts (Mobile-First)',
            'Aggressive SEO optimization',
            'Sub-second Core Web Vitals',
            'Headless CMS integration',
            'Advanced conversion tracking & analytics',
        ],
        timeline: 'ETA: 3+ Days',
        tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'GSAP', 'Vercel'],
    },
    {
        id: 'bots',
        code: 'BOT',
        title: 'Telegram & Discord Bots',
        description: 'Autonomous agents, e-commerce automation, community management protocols, and custom webhook integrations.',
        features: [
            'Stripe/Crypto payment processing',
            'User cohort management & analytics',
            'Self-executing cron workflows',
            'System admin dashboards',
            'Multi-language localization',
        ],
        timeline: 'ETA: 3+ Days',
        tech: ['Python', 'Node.js', 'Aiogram', 'Telegraf', 'PostgreSQL', 'Redis', 'Docker', 'Webhooks'],
    },
    {
        id: 'saas',
        code: 'SYS',
        title: 'SaaS Platforms',
        description: 'Full-stack Software-as-a-Service infrastructure featuring strict authentication, automated billing, and secure multi-tenant architecture.',
        features: [
            'Multi-tenant data isolation',
            'JWT/OAuth authentication & authorization',
            'Stripe subscription integration',
            'Admin control panel & core telemetry',
            'Extensible API & webhook architecture',
        ],
        timeline: 'ETA: 14+ Days',
        tech: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'Prisma', 'Supabase', 'Stripe', 'AWS', 'Vercel'],
    },
    {
        id: 'api',
        code: 'API',
        title: 'APIs & Backends',
        description: 'Scalable REST and GraphQL endpoints, microservice networks, distributed data pipelines, and raw cloud infrastructure.',
        features: [
            'RESTful & GraphQL architectures',
            'Relational database design & indexing',
            'Raw cloud deployment (AWS, GCP, Railway)',
            'Automated CI/CD deployment pipelines',
            'Real-time system monitoring & logging',
        ],
        timeline: 'ETA: 7+ Days',
        tech: ['Node.js', 'Python', 'FastAPI', 'Express', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'AWS'],
    },
]

export default function ServicesPage() {
    return (
        <div className="container mx-auto px-6 py-20 lg:py-32 relative z-10 w-full max-w-7xl">
            {/* Header */}
            <div className="mb-20">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter text-[var(--text-primary)]">
                    Execution <span className="font-[var(--font-dm-serif)] italic text-[var(--accent-primary)]">Protocols.</span>
                </h1>
                <p className="font-mono text-[var(--text-secondary)] text-sm md:text-base uppercase tracking-widest max-w-2xl leading-relaxed mt-6">
                    {'//'} Digital infrastructure from initial concept to live production. Select a specific protocol below or{' '}
                    <Link href="/contact" className="text-[var(--text-primary)] border-b border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors inline-block">
                        initiate a custom requirement
                    </Link>{' '}
                    — every deployment is architected precisely for your business logic.
                </p>
            </div>

            {/* Services Grid */}
            <section className="space-y-12 mb-24">
                {services.map((service, index) => {
                    const numberStr = (index + 1).toString().padStart(2, '0')

                    return (
                        <div
                            key={service.id}
                            id={service.id}
                            className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 md:p-12 rounded-[2rem] scroll-mt-32 transition-colors hover:border-[var(--accent-primary)] group shadow-md"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                                {/* Left - Main info */}
                                <div className="lg:col-span-2">
                                    <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6">
                                        <div className="font-mono text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] text-3xl font-bold transition-colors">
                                            [{numberStr}]
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h2 className="text-3xl font-bold text-[var(--text-primary)]">{service.title}</h2>
                                                <span className="font-mono bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--accent-primary)] text-xs px-2 py-1 rounded">
                                                    {service.code}
                                                </span>
                                            </div>
                                            <div className="font-mono text-[var(--text-muted)] text-xs uppercase tracking-widest mb-4 border-b border-[var(--border-color)] pb-4 inline-block">
                                                {service.timeline}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-[var(--text-secondary)] font-mono text-sm leading-relaxed mb-8 max-w-3xl">
                                        {service.description}
                                    </p>

                                    {/* Features */}
                                    <div className="mb-6 border border-[var(--border-color)] bg-[var(--bg-primary)] p-6 rounded-xl">
                                        <h4 className="font-mono text-[var(--text-primary)] text-xs font-bold uppercase tracking-widest mb-4">
                                            {'>'} Technical Scope
                                        </h4>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                            {service.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-3 font-mono text-xs text-[var(--text-secondary)]">
                                                    <span className="text-[var(--accent-primary)] font-bold mt-0.5">[+]</span>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Right - Tech & CTA */}
                                <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[var(--border-color)] pt-8 lg:pt-0 lg:pl-12">
                                    <div className="mb-8 lg:mb-0">
                                        <h4 className="font-mono text-[var(--text-primary)] text-xs font-bold uppercase tracking-widest mb-4">
                                            {'>'} Stack Requirements
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {service.tech.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="px-3 py-1.5 font-mono text-xs text-[var(--text-primary)] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <Link
                                        href="/contact"
                                        className="mt-8 relative group/btn flex items-center justify-between border border-[var(--accent-primary)] bg-[var(--bg-primary)] px-6 py-4 rounded-xl hover:bg-[var(--bg-card)] transition-colors w-full"
                                    >
                                        <span className="font-mono text-[var(--text-primary)] text-xs font-bold uppercase tracking-widest">
                                            Deploy Protocol
                                        </span>
                                        <span className="text-[var(--accent-primary)] group-hover/btn:translate-x-1 transition-transform">
                                            →
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </section>

            {/* CTA Bottom */}
            <section className="max-w-xl mx-auto border border-[var(--border-color)] rounded-[2rem] overflow-hidden">
                <LeadCaptureWidget />
            </section>
        </div>
    )
}
