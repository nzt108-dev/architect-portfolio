import Link from 'next/link'
import LeadCaptureWidget from '@/components/ui/LeadCaptureWidget'
import { Globe, Bot, Smartphone, Layers, Server, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

const services = [
    {
        id: 'mobile',
        icon: Smartphone,
        title: 'Mobile Applications',
        description: 'Cross-platform iOS & Android apps with native performance. One codebase, two platforms.',
        features: [
            'Cross-platform (iOS + Android)',
            'Push notifications & analytics',
            'Offline-first architecture',
            'App Store & Google Play deployment',
            'Backend integration',
        ],
        timeline: '~2-3 weeks',
        tech: ['Flutter', 'Dart', 'React Native', 'Firebase', 'Supabase'],
    },
    {
        id: 'web',
        icon: Globe,
        title: 'Websites & Landing Pages',
        description: 'Fast, responsive websites optimized for conversions. From landing pages to complex web apps.',
        features: [
            'Responsive mobile-first design',
            'SEO optimization',
            'Fast Core Web Vitals',
            'CMS integration',
            'Analytics & conversion tracking',
        ],
        timeline: '~3-7 days',
        tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    },
    {
        id: 'bots',
        icon: Bot,
        title: 'Telegram & Discord Bots',
        description: 'Custom bots for automation, e-commerce, community management, and more.',
        features: [
            'Payment processing (Stripe/Crypto)',
            'User management & analytics',
            'Automated workflows',
            'Admin dashboards',
            'Multi-language support',
        ],
        timeline: '~3-7 days',
        tech: ['Python', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    },
    {
        id: 'saas',
        icon: Layers,
        title: 'SaaS Platforms',
        description: 'Full-stack SaaS with auth, billing, multi-tenancy, and admin panels.',
        features: [
            'Multi-tenant architecture',
            'Authentication & authorization',
            'Stripe subscription billing',
            'Admin dashboard',
            'API & webhook system',
        ],
        timeline: '~2-4 weeks',
        tech: ['Next.js', 'Node.js', 'PostgreSQL', 'Prisma', 'Stripe', 'AWS'],
    },
    {
        id: 'api',
        icon: Server,
        title: 'APIs & Backends',
        description: 'Scalable REST and GraphQL APIs, microservices, and cloud infrastructure.',
        features: [
            'REST & GraphQL APIs',
            'Database design & optimization',
            'Cloud deployment (AWS, GCP)',
            'CI/CD pipelines',
            'Monitoring & logging',
        ],
        timeline: '~1-2 weeks',
        tech: ['Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS'],
    },
]

export default function ServicesPage() {
    return (
        <div className="container mx-auto px-6 py-20 lg:py-32 relative z-10 w-full max-w-6xl">
            {/* Header */}
            <div className="mb-16">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-[var(--text-primary)]">
                    What I Build
                </h1>
                <p className="text-[var(--text-secondary)] text-lg max-w-2xl leading-relaxed">
                    From mobile apps to cloud infrastructure — I handle the full stack so you can focus on your business.{' '}
                    <Link href="/contact" className="text-[var(--accent-primary)] hover:underline">
                        Let&apos;s discuss your project →
                    </Link>
                </p>
            </div>

            {/* Services */}
            <section className="space-y-6 mb-20">
                {services.map((service) => {
                    const Icon = service.icon
                    return (
                        <div
                            key={service.id}
                            id={service.id}
                            className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 md:p-10 rounded-2xl scroll-mt-32 transition-all duration-200 hover:border-[var(--border-hover)] hover:shadow-md group"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                {/* Left */}
                                <div className="lg:col-span-2">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-11 h-11 rounded-xl bg-[var(--accent-light)] flex items-center justify-center flex-shrink-0">
                                            <Icon size={22} className="text-[var(--accent-primary)]" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">{service.title}</h2>
                                            <span className="text-sm text-[var(--text-muted)]">{service.timeline}</span>
                                        </div>
                                    </div>

                                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6 max-w-2xl">
                                        {service.description}
                                    </p>

                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {service.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] flex-shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Right */}
                                <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[var(--border-color)] pt-6 lg:pt-0 lg:pl-10">
                                    <div className="mb-6">
                                        <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                                            Tech Stack
                                        </h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {service.tech.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="px-2.5 py-1 text-xs text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-md font-medium"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <Link
                                        href="/contact"
                                        className="btn-secondary py-3 rounded-xl text-sm text-center"
                                    >
                                        Get Estimate
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </section>

            {/* CTA */}
            <section className="max-w-md mx-auto bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-lg">
                <LeadCaptureWidget />
            </section>
        </div>
    )
}
