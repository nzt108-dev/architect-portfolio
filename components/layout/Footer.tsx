import Link from 'next/link';
import Image from 'next/image';
import { socialLinks } from '@/lib/data';

const footerLinks = [
    {
        title: 'Navigation',
        links: [
            { label: 'Home', href: '/' },
            { label: 'Services', href: '/services' },
            { label: 'Projects', href: '/projects' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
        ],
    },
    {
        title: 'Services',
        links: [
            { label: 'Mobile Apps', href: '/services#mobile' },
            { label: 'Websites', href: '/services#web' },
            { label: 'Telegram & Discord Bots', href: '/services#bots' },
            { label: 'SaaS Platforms', href: '/services#saas' },
            { label: 'APIs & Backends', href: '/services#api' },
        ],
    },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-32 bg-[var(--bg-card)] rounded-t-[4rem] border-t border-[var(--border-color)] relative z-20 overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
            <div className="container mx-auto px-6 py-20 lg:py-24">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 lg:gap-10">

                    {/* Brand & System Status */}
                    <div className="md:col-span-2 flex flex-col justify-between h-full">
                        <div>
                            <Link href="/" className="inline-flex items-center gap-4 mb-6 group">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-[var(--border-color)] group-hover:border-[var(--accent-primary)] transition-colors">
                                    <Image
                                        src="/logo.jpg"
                                        alt="nzt108_dev"
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover grayscale contrast-125 brightness-110 group-hover:grayscale-0 transition-all duration-500"
                                    />
                                </div>
                                <span className="font-bold text-3xl tracking-tighter">
                                    nzt108<span className="text-[var(--accent-primary)] font-[var(--font-dm-serif)] italic">_dev</span>
                                </span>
                            </Link>
                            <p className="text-[var(--text-secondary)] font-mono text-sm max-w-sm mb-10 leading-relaxed uppercase tracking-widest">
                                {'//'} Engineered solutions for complex problems. Architect-level code execution.
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] hover:-translate-y-1 transition-all duration-300 shadow-md"
                                    aria-label={social.name}
                                >
                                    {social.icon === 'github' && (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                    )}
                                    {social.icon === 'telegram' && (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                        </svg>
                                    )}
                                    {social.icon === 'linkedin' && (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {footerLinks.map((section) => (
                        <div key={section.title} className="flex flex-col">
                            <h4 className="font-mono text-[var(--text-secondary)] text-sm uppercase tracking-widest mb-6">
                                {section.title}
                            </h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] font-medium transition-colors relative inline-block group"
                                        >
                                            {link.label}
                                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--accent-primary)] transition-all duration-300 group-hover:w-full" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom - System Status & Copyright */}
                <div className="mt-20 pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[var(--text-secondary)] font-mono text-sm tracking-widest">
                        © {currentYear} NZT108_DEV.
                    </p>

                    {/* Pulsing System Status */}
                    <div className="flex items-center gap-3 bg-[var(--bg-primary)] border border-[var(--border-color)] px-4 py-2 rounded-full">
                        <div className="relative flex items-center justify-center w-3 h-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </div>
                        <span className="font-mono text-xs text-[var(--accent-green)] uppercase tracking-widest">
                            System Operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
