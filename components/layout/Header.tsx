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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 md:px-6 pt-4 pointer-events-none">
      <div
        className={`pointer-events-auto flex w-full max-w-5xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 will-change-transform ${
          isScrolled
            ? 'bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-color)] shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
            : 'bg-transparent border border-transparent'
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group px-2 relative z-50"
          aria-label="Go to homepage"
        >
          <div className="w-8 h-8 overflow-hidden rounded-full border border-[var(--border-color)] transition-transform duration-300 group-hover:scale-105 flex-shrink-0">
            <Image
              src="/logo.jpg"
              alt="nzt108_dev"
              width={32}
              height={32}
              className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
            />
          </div>
          <span className="font-bold text-lg tracking-tight text-[var(--text-primary)]">
            nzt108<span className="text-[var(--accent-primary)]">.dev</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                  isActive
                    ? 'text-[var(--accent-primary)] bg-[var(--accent-light)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center pl-4">
          <Link
            href="/contact"
            className="btn-primary text-sm px-5 py-2.5 rounded-full"
          >
            Get in Touch
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center p-2 text-[var(--text-primary)] transition-transform active:scale-95 relative z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu — Full screen */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 pointer-events-auto md:hidden bg-[var(--bg-primary)]/95 backdrop-blur-xl z-40 animate-fade-in">
          <nav className="flex flex-col items-center justify-center h-full gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-2xl font-semibold transition-colors ${
                    isActive
                      ? 'text-[var(--accent-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-6">
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-primary text-base px-8 py-3.5 rounded-2xl"
              >
                Get in Touch
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
