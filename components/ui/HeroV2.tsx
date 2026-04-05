'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { ArrowRight } from 'lucide-react'

export default function HeroV2() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Staggered entrance
            gsap.from('.hero-animate', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: 'power3.out',
                delay: 0.2
            })

            // Gentle float for the avatar
            gsap.to('.hero-avatar', {
                y: -8,
                duration: 6,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut'
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={containerRef} className="relative min-h-[100dvh] w-full flex items-center px-6 lg:px-12 overflow-hidden">

            {/* Subtle gradient blob */}
            <div className="absolute top-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-[var(--accent-primary)] opacity-[0.04] blur-[150px] rounded-full pointer-events-none z-0" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-purple-500 opacity-[0.03] blur-[150px] rounded-full pointer-events-none z-0" />

            <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 py-32">

                {/* Left — Content */}
                <div className="w-full lg:w-[55%] flex flex-col">

                    {/* Badge */}
                    <div className="hero-animate mb-6">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--accent-light)] text-[var(--accent-primary)] text-sm font-medium rounded-full">
                            <span className="w-2 h-2 bg-[var(--accent-green)] rounded-full" />
                            Available for new projects
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="hero-animate text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.1] mb-6">
                        I build software{' '}
                        <span className="gradient-text">that ships.</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="hero-animate text-lg md:text-xl text-[var(--text-secondary)] max-w-lg mb-10 leading-relaxed">
                        Full-stack developer specializing in mobile apps, web platforms, and SaaS architecture. From first commit to production.
                    </p>

                    {/* CTA Buttons */}
                    <div className="hero-animate flex flex-col sm:flex-row gap-3">
                        <Link href="/projects" className="btn-primary px-6 py-3.5 text-[15px] rounded-xl">
                            View My Work
                            <ArrowRight size={18} />
                        </Link>
                        <Link href="/contact" className="btn-secondary px-6 py-3.5 text-[15px] rounded-xl">
                            Get in Touch
                        </Link>
                    </div>

                    {/* Tech stack mini */}
                    <div className="hero-animate mt-12 flex items-center gap-4">
                        <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Built with</span>
                        <div className="flex gap-2 flex-wrap">
                            {['React', 'Next.js', 'Flutter', 'Node.js', 'TypeScript'].map((tech) => (
                                <span key={tech} className="px-2.5 py-1 text-xs text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-md font-medium">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right — Avatar */}
                <div className="hero-avatar w-full lg:w-[40%] flex justify-center lg:justify-end">
                    <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                        {/* Gradient ring */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--accent-primary)]/20 via-purple-500/10 to-transparent blur-xl" />

                        {/* Photo */}
                        <div className="relative w-full h-full rounded-3xl overflow-hidden border border-[var(--border-color)] shadow-xl">
                            <Image
                                src="/logo.jpg"
                                alt="nzt108.dev"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Floating badges */}
                        <div className="absolute -bottom-3 -left-3 bg-white border border-[var(--border-color)] rounded-xl px-3 py-2 shadow-lg">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🚀</span>
                                <div>
                                    <p className="text-xs font-semibold text-[var(--text-primary)]">10+ Projects</p>
                                    <p className="text-[10px] text-[var(--text-muted)]">Shipped</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -top-3 -right-3 bg-white border border-[var(--border-color)] rounded-xl px-3 py-2 shadow-lg">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">⚡</span>
                                <div>
                                    <p className="text-xs font-semibold text-[var(--text-primary)]">Fast Delivery</p>
                                    <p className="text-[10px] text-[var(--text-muted)]">On time, every time</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}
