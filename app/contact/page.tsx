import { getSocialLinks } from '@/lib/queries'
import ContactForm from './ContactForm'

export const dynamic = 'force-dynamic'

const FAQ_ITEMS = [
    {
        q: 'How does the process work?',
        a: 'You push requirements via form or email → I return an assessment with questions and scope constraints within 24H → We lock scope and timeline → Execution begins. Async email communication utilized primarily.',
    },
    {
        q: 'What are your typical rates?',
        a: 'Deployments begin at $500 for high-conversion statics, scaling to $15,000+ for enterprise SaaS infrastructure. Pricing is modular and strictly scoped.',
    },
    {
        q: 'How long does a deployment take?',
        a: 'Statics: 3–7 days. Mobile: 2–6 weeks. Complex infrastructure: 1–3 months. A precise ETA is provided post-assessment.',
    },
    {
        q: 'What stack do you operate on?',
        a: 'Next.js, React, Flutter, Node.js, PostgreSQL, and raw cloud infrastructure. Tech is selected strictly based on load requirements and domain constraints.',
    },
    {
        q: 'Do you offer iterations?',
        a: 'Yes. Milestones include structured iteration blocks. Progress is transparent and continuous; you observe the build at every stage.',
    },
    {
        q: 'Can we communicate async only?',
        a: 'Preferred. Asynchronous text protocols result in highly documented, precise decision-making. You will receive structured logs, captures, and system updates.',
    },
]

export default async function ContactPage() {
    const socialLinks = await getSocialLinks()

    return (
        <div className="container mx-auto px-6 py-20 lg:py-32 relative z-10 w-full max-w-7xl">
            {/* Header */}
            <div className="mb-20">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter text-[var(--text-primary)]">
                    Communication <span className="font-[var(--font-dm-serif)] italic text-[var(--accent-primary)]">Protocol.</span>
                </h1>
                <p className="font-mono text-[var(--text-secondary)] text-sm md:text-base uppercase tracking-widest max-w-2xl leading-relaxed mt-6">
                    {'//'} Initiate contact for system architecture, project inquiries, or infrastructure consulting.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-6xl">
                {/* Contact Form */}
                <div className="lg:col-span-3">
                    <ContactForm />
                </div>

                {/* Contact Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Direct Contact */}
                    <div className="bg-[var(--bg-card)] border border-[var(--accent-primary)] p-8 rounded-[2rem] shadow-[0_4px_30px_rgba(230,59,46,0.05)]">
                        <h3 className="font-mono text-[var(--text-primary)] text-xs font-bold uppercase tracking-widest mb-6">
                            [+] Direct Channels
                        </h3>
                        <div className="space-y-3">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--text-primary)] transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                                        <SocialIcon icon={link.icon} />
                                    </div>
                                    <div>
                                        <div className="font-mono text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors uppercase tracking-widest">
                                            {link.name}
                                        </div>
                                        <div className="font-mono text-[var(--text-muted)] text-[10px] uppercase tracking-widest mt-1">
                                            {getDisplayUrl(link.url)}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Response Time */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-[2rem]">
                        <h3 className="font-mono text-[var(--text-primary)] text-xs font-bold uppercase tracking-widest mb-4">
                            [{'>'}] Global Latency
                        </h3>
                        <p className="text-[var(--text-secondary)] font-mono text-xs leading-relaxed">
                            System SLA guarantees response within <span className="text-[var(--accent-primary)] font-bold block mt-1">24 HOURS (Business Days)</span>.
                            <br /><br />
                            Primary communications routed through email for strict documentation and parsing efficiency.
                        </p>
                    </div>

                    {/* How It Works Mini */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-[2rem]">
                        <h3 className="font-mono text-[var(--text-primary)] text-xs font-bold uppercase tracking-widest mb-6">
                            [~] Operation Sequence
                        </h3>
                        <div className="space-y-4">
                            {[
                                { step: '01', text: 'INITIATE REQUEST VIA FORM' },
                                { step: '02', text: 'ASSESSMENT + ESTIMATE RETURNED' },
                                { step: '03', text: 'SCOPE LOCKED & DEPLOYMENT STARTS' },
                                { step: '04', text: 'CONTINUOUS TELEMETRY UNTIL LAUNCH' },
                            ].map(({ step, text }) => (
                                <div key={step} className="flex items-start gap-4">
                                    <span className="font-mono text-[var(--accent-primary)] font-bold text-xs mt-0.5">{step}</span>
                                    <span className="font-mono text-[var(--text-secondary)] text-xs leading-relaxed">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto mt-32 border-t border-[var(--border-color)] pt-20">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tighter mb-4">
                        Frequently Asked <span className="font-[var(--font-dm-serif)] italic text-[var(--text-secondary)]">Queries</span>.
                    </h2>
                    <p className="font-mono text-[var(--text-muted)] text-xs uppercase tracking-widest">
                        {'>'} INDEXED SYSTEM KNOWLEDGE
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {FAQ_ITEMS.map((item, i) => {
                        const countStr = (i + 1).toString().padStart(2, '0')
                        return (
                            <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-2xl group hover:border-[var(--accent-primary)] transition-colors">
                                <div className="font-mono text-[var(--text-muted)] text-[10px] mb-4 group-hover:text-[var(--accent-primary)] transition-colors">Q_{countStr}</div>
                                <h3 className="font-bold text-sm mb-4 text-[var(--text-primary)] uppercase tracking-tight">{item.q}</h3>
                                <p className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed border-l-2 border-[var(--border-color)] pl-4 group-hover:border-[var(--text-primary)] transition-colors">{item.a}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

function getIconBg(icon: string): string {
    const colors: Record<string, string> = {
        github: 'bg-gray-500/20',
        telegram: 'bg-blue-500/20',
        linkedin: 'bg-blue-600/20',
        email: 'bg-green-500/20',
        twitter: 'bg-sky-500/20',
        instagram: 'bg-pink-500/20',
        youtube: 'bg-red-500/20',
        discord: 'bg-indigo-500/20',
        website: 'bg-purple-500/20',
    }
    return colors[icon] || 'bg-gray-500/20'
}

function getDisplayUrl(url: string): string {
    if (url.startsWith('mailto:')) return url.replace('mailto:', '')
    if (url.startsWith('https://t.me/')) return '@' + url.replace('https://t.me/', '')
    if (url.includes('github.com/')) return '@' + url.split('github.com/')[1]
    if (url.includes('linkedin.com/in/')) return url.split('linkedin.com/in/')[1]
    return url.replace(/^https?:\/\//, '').split('/')[0]
}

function SocialIcon({ icon }: { icon: string }) {
    const className = "w-6 h-6"

    switch (icon) {
        case 'github':
            return (
                <svg className={`${className} text-gray-400`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
            )
        case 'telegram':
            return (
                <svg className={`${className} text-blue-400`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
            )
        case 'linkedin':
            return (
                <svg className={`${className} text-blue-500`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            )
        case 'email':
            return (
                <svg className={`${className} text-green-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        case 'twitter':
            return (
                <svg className={`${className} text-sky-400`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            )
        case 'instagram':
            return (
                <svg className={`${className} text-pink-400`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            )
        case 'discord':
            return (
                <svg className={`${className} text-indigo-400`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
                </svg>
            )
        default:
            return (
                <svg className={`${className} text-purple-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
            )
    }
}
