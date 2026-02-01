'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

export default function Header() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--neon-cyan)] group-hover:shadow-[var(--glow-cyan)] transition-shadow">
                        <Image
                            src="/logo.jpg"
                            alt="nzt108_dev"
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="font-bold text-xl tracking-tight">
                        <span className="text-[var(--neon-cyan)]">nzt108</span>
                        <span className="text-[var(--text-secondary)]">_dev</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative text-sm uppercase tracking-widest font-medium transition-all hover:text-[var(--neon-cyan)] ${pathname === link.href
                                ? 'text-[var(--neon-cyan)]'
                                : 'text-[var(--text-secondary)]'
                                }`}
                        >
                            {link.label}
                            {pathname === link.href && (
                                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[var(--neon-cyan)] shadow-[0_0_10px_var(--neon-cyan)]" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* CTA Button */}
                <div className="hidden md:block">
                    <Link href="/contact" className="cyber-btn text-xs">
                        Hire Me
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span
                        className={`w-6 h-0.5 bg-[var(--neon-cyan)] transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                            }`}
                    />
                    <span
                        className={`w-6 h-0.5 bg-[var(--neon-cyan)] transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''
                            }`}
                    />
                    <span
                        className={`w-6 h-0.5 bg-[var(--neon-cyan)] transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                            }`}
                    />
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden glass mt-4 mx-6 rounded-lg p-6">
                    <nav className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-lg font-medium transition-colors ${pathname === link.href
                                    ? 'text-[var(--neon-cyan)]'
                                    : 'text-[var(--text-secondary)]'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/contact"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="cyber-btn text-center text-sm mt-4"
                        >
                            Hire Me
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
