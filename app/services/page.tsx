import Link from 'next/link'
import LeadCaptureWidget from '@/components/ui/LeadCaptureWidget'
import GradientIcon from '@/components/ui/GradientIcon'

export const dynamic = 'force-dynamic'

const services = [
    {
        id: 'mobile',
        iconName: 'smartphone',
        title: 'Mobile Apps',
        description: 'Cross-platform iOS & Android apps built with Flutter. One codebase, two platforms, native performance.',
        features: [
            'Cross-platform (iOS + Android)',
            'Push notifications & analytics',
            'Offline-first architecture',
            'App Store & Google Play deployment',
            'Backend API integration',
        ],
        timeline: 'From 2 weeks',
        tech: ['Flutter', 'Dart', 'Firebase', 'Supabase'],
        accent: 'var(--accent-primary)',
    },
    {
        id: 'web',
        iconName: 'globe',
        title: 'Websites & Landing Pages',
        description: 'Fast, responsive, SEO-optimized websites. From simple landing pages to complex web applications.',
        features: [
            'Responsive design (mobile-first)',
            'SEO optimization',
            'Performance tuning (Core Web Vitals)',
            'CMS integration',
            'Analytics & conversion tracking',
        ],
        timeline: 'From 3 days',
        tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
        accent: 'var(--accent-blue)',
    },
    {
        id: 'bots',
        iconName: 'bot',
        title: 'Telegram & Discord Bots',
        description: 'Automation bots, e-commerce bots, community management, and custom integrations.',
        features: [
            'Payment processing',
            'User management & analytics',
            'Automated workflows',
            'Admin dashboards',
            'Multi-language support',
        ],
        timeline: 'From 3 days',
        tech: ['Python', 'Node.js', 'PostgreSQL', 'Redis'],
        accent: 'var(--accent-secondary)',
    },
    {
        id: 'saas',
        iconName: 'briefcase',
        title: 'SaaS Platforms',
        description: 'Full-stack Software-as-a-Service products with authentication, billing, dashboards, and multi-tenant architecture.',
        features: [
            'Multi-tenant architecture',
            'Authentication & authorization',
            'Stripe/payment integration',
            'Admin panel & analytics',
            'API & webhook support',
        ],
        timeline: 'From 2 weeks',
        tech: ['Next.js', 'Supabase', 'Stripe', 'Vercel'],
        accent: 'var(--accent-green)',
    },
    {
        id: 'api',
        iconName: 'server',
        title: 'APIs & Backends',
        description: 'Scalable REST/GraphQL APIs, microservices, data pipelines, and cloud infrastructure.',
        features: [
            'REST & GraphQL APIs',
            'Database design & optimization',
            'Cloud deployment (AWS, Railway)',
            'CI/CD pipelines',
            'Monitoring & logging',
        ],
        timeline: 'From 1 week',
        tech: ['Node.js', 'Python', 'PostgreSQL', 'Docker'],
        accent: 'var(--accent-amber)',
    },
]

export default function ServicesPage() {
    return (
        <div className="container mx-auto px-6 pt-32 pb-20">
            {/* Hero */}
            <section className="text-center mb-20">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    <span className="gradient-text">What I Build</span>
                </h1>
                <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto leading-relaxed">
                    Digital products from idea to launch. Pick a service below or{' '}
                    <Link href="/contact" className="text-[var(--accent-primary)] underline">
                        tell me what you need
                    </Link>{' '}
                    — every project gets a custom approach.
                </p>
            </section>

            {/* Services Grid */}
            <section className="space-y-8 mb-20">
                {services.map((service) => (
                    <div
                        key={service.id}
                        id={service.id}
                        className="cyber-card p-8 md:p-10 scroll-mt-32"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left - Main info */}
                            <div className="lg:col-span-2">
                                <div className="flex items-center gap-4 mb-4">
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                        style={{ background: `color-mix(in srgb, ${service.accent} 15%, transparent)` }}
                                    >
                                        <GradientIcon name={service.iconName} size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{service.title}</h2>
                                        <span className="text-[var(--accent-primary)] text-sm font-medium">
                                            {service.timeline}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                                    {service.description}
                                </p>

                                {/* Features */}
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {service.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                            <span className="text-[var(--accent-green)]">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Right - Tech & CTA */}
                            <div className="flex flex-col justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">
                                        Technologies
                                    </h4>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {service.tech.map((tech) => (
                                            <span key={tech} className="skill-badge text-xs">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <Link
                                    href="/contact"
                                    className="btn-filled text-center text-sm"
                                >
                                    Get Estimate for {service.title} →
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* CTA Bottom */}
            <section className="max-w-xl mx-auto">
                <LeadCaptureWidget />
            </section>
        </div>
    )
}
