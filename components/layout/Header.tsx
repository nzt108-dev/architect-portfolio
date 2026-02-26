'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/projects', label: 'Projects' },
    { href: '/blog', label: 'Blog' },
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
        <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 md:px-6 pointer-events-none">
            {/* The Floating Island Container */}
            <div
                className={`pointer-events-auto flex w-full max-w-5xl items-center justify-between rounded-full px-4 py-3 transition-all duration-500 will-change-transform ${isScrolled
                    ? 'bg-[#141414]/80 backdrop-blur-xl border border-[#E8E4DD]/10 shadow-[0_8px_30px_rgba(0,0,0,0.8)]'
                    : 'bg-transparent border border-transparent'
                    }`}
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group px-2 relative z-50 cursor-pointer pointer-events-auto" aria-label="Go to homepage">
                    <div className="w-9 h-9 overflow-hidden rounded-full border border-[var(--accent-primary)] transition-transform duration-300 group-hover:scale-105 flex-shrink-0">
                        <Image
                            src="/logo.jpg"
                            alt="nzt108_dev"
                            width={36}
                            height={36}
                            className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                        />
                    </div>
                    <span className="font-bold text-lg tracking-tight">
                        <span className="text-[var(--text-primary)]">nzt108</span>
                        <span className="text-[var(--accent-primary)]">_dev</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1 xl:gap-2">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative px-4 py-2 text-sm uppercase tracking-wider font-semibold transition-all duration-300 rounded-full overflow-hidden group ${isActive
                                    ? 'text-[var(--bg-primary)] bg-[var(--text-primary)]'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                <span className="relative z-10">{link.label}</span>
                                {!isActive && (
                                    <span className="absolute inset-0 bg-[var(--text-primary)]/5 translate-y-[100%] rounded-full transition-transform duration-300 group-hover:translate-y-0" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* CTA Button */}
                <div className="hidden md:flex items-center pl-4">
                    <Link
                        href="/contact"
                        className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] border border-[var(--accent-primary)] bg-[var(--bg-primary)] px-5 py-2.5 rounded-full hover:bg-[var(--accent-primary)] hover:text-white transition-colors"
                    >
                        Initiate
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden flex items-center justify-center p-2 text-[var(--text-primary)] transition-transform active:scale-95"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="absolute top-20 left-4 right-4 pointer-events-auto md:hidden bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-2xl origin-top animate-fade-in-up">
                    <nav className="flex flex-col gap-2">
                        {navLinks.map((link, i) => {
                            const isActive = pathname === link.href;
                            const numStr = (i + 1).toString().padStart(2, '0');
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-2 py-4 border-b border-[var(--border-color)] last:border-0 font-mono text-sm tracking-widest uppercase transition-colors flex items-center justify-between ${isActive
                                        ? 'text-[var(--text-primary)] font-bold'
                                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    <span>{link.label}</span>
                                    {isActive ? (
                                        <span className="text-[var(--accent-primary)]">[ACTIVE]</span>
                                    ) : (
                                        <span className="text-[var(--text-muted)] text-[10px]">[{numStr}]</span>
                                    )}
                                </Link>
                            );
                        })}
                        <div className="pt-6 mt-2">
                            <Link
                                href="/contact"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full flex justify-center items-center bg-[var(--bg-primary)] border border-[var(--accent-primary)] text-[var(--text-primary)] font-mono text-sm font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-[var(--bg-card)] hover:text-[var(--accent-primary)] transition-colors"
                            >
                                [INITIATE SEQUENCE]
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
