import Link from 'next/link';
import Image from 'next/image';
import { socialLinks } from '@/lib/data';

const footerLinks = [
  {
    title: 'Services',
    links: [
      { label: 'Mobile Apps', href: '/services#mobile' },
      { label: 'Websites', href: '/services#web' },
      { label: 'Bots & Automation', href: '/services#bots' },
      { label: 'SaaS Platforms', href: '/services#saas' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Projects', href: '/projects' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-[var(--bg-secondary)] border-t border-[var(--border-color)] relative z-20 rounded-t-[3rem]">
      <div className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-10">
          {/* Brand */}
          <div className="md:col-span-2 flex flex-col justify-between h-full">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--border-color)] group-hover:border-[var(--accent-primary)] transition-colors">
                  <Image
                    src="/logo.jpg"
                    alt="nzt108.dev"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <span className="font-bold text-2xl tracking-tight text-[var(--text-primary)]">
                  nzt108<span className="text-[var(--accent-primary)]">.dev</span>
                </span>
              </Link>
              <p className="text-[var(--text-secondary)] text-sm max-w-sm mb-8 leading-relaxed">
                Full-stack development studio. I build mobile apps, web platforms, and SaaS products with fixed pricing and fast delivery.
              </p>
            </div>

            {/* Social + Status */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-primary)] transition-all duration-200 border border-[var(--border-color)]"
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

              {/* System Operational */}
              <div className="flex items-center gap-2 ml-4 text-xs text-[var(--text-muted)] font-mono">
                <span className="w-2 h-2 bg-[var(--accent-green)] rounded-full" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
                System Operational
              </div>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col">
              <h4 className="text-[var(--text-primary)] text-sm font-semibold mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-6 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[var(--text-muted)] text-sm">
            © {currentYear} nzt108.dev. All rights reserved.
          </p>
          <p className="text-[var(--text-muted)] text-sm font-mono">
            Built with Next.js & TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
}
