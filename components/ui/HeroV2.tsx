'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import HeroAvatar from '@/components/ui/HeroAvatar'

function GlitchLine({ text, delay }: { text: string; delay: number }) {
    const [displayText, setDisplayText] = useState('')

    useEffect(() => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_/\\'
        let iteration = 0
        let interval: NodeJS.Timeout

        const timeout = setTimeout(() => {
            interval = setInterval(() => {
                setDisplayText(text.split('').map((char, index) => {
                    if (char === ' ') return ' '
                    if (index < iteration) {
                        return text[index]
                    }
                    return chars[Math.floor(Math.random() * chars.length)]
                }).join(''))

                if (iteration >= text.length) {
                    clearInterval(interval)
                }
                iteration += 1 / 2
            }, 30)
        }, delay)

        return () => {
            clearTimeout(timeout)
            clearInterval(interval)
        }
    }, [text, delay])

    return <span>{displayText || ' '}</span>
}

export default function HeroV2() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.hud-element', {
                y: 20,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: 'power3.out',
                delay: 0.5
            })

            gsap.to('.scan-line', {
                y: '100dvh',
                duration: 4,
                ease: 'none',
                repeat: -1
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={containerRef} className="relative h-[100dvh] w-full flex flex-col justify-center px-6 lg:px-12 overflow-hidden bg-[var(--bg-primary)]">

            {/* Cinematic Background Avatar (Keeps the same photo) */}
            <HeroAvatar />

            {/* Heavy Vignette & Dark Overlay for Brutalist Feel */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--bg-primary)_100%)] opacity-90 z-0 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-[var(--bg-primary)]/10 z-0 pointer-events-none" />

            {/* Brutalist Grid Texture */}
            <div className="absolute inset-0 premium-grid opacity-30 z-0 pointer-events-none" />

            {/* Animated Scanline */}
            <div className="scan-line absolute top-0 left-0 w-full h-[2px] bg-[var(--accent-primary)]/20 shadow-[0_0_20px_var(--accent-primary)] z-10 pointer-events-none" />

            {/* Ambient Red Glow */}
            <div className="absolute top-[20%] left-[-10%] w-[40rem] h-[40rem] bg-[var(--accent-primary)] opacity-[0.05] blur-[150px] rounded-full pointer-events-none z-0 animate-pulse" />

            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 h-full py-20">

                {/* Left Content - Pure Terminal Vibe */}
                <div className="w-full lg:w-[60%] flex flex-col justify-center h-full">

                    {/* Top HUD bar removed to prevent user confusion */}

                    {/* Massive Typography - Brutalist Stencil Look */}
                    <h1 className="hud-element flex flex-col mb-8 pointer-events-none">
                        <span className="text-[var(--text-secondary)] font-mono text-xl md:text-2xl tracking-widest uppercase mb-4 h-8">
                            <GlitchLine text="> TECHNICAL_PARTNER_" delay={500} />
                        </span>
                        <span className="text-[3.5rem] md:text-[6rem] lg:text-[7.5rem] font-bold tracking-tighter text-[var(--text-primary)] leading-[0.85] uppercase">
                            Digital
                        </span>
                        <span className="text-[4rem] md:text-[6.5rem] lg:text-[8rem] font-[var(--font-dm-serif)] italic text-[var(--accent-primary)] leading-[0.85] -ml-2">
                            Instrument.
                        </span>
                    </h1>

                    <div className="hud-element text-[var(--text-secondary)] text-sm md:text-base max-w-lg mb-12 font-mono leading-relaxed border-l-2 border-[var(--accent-primary)] pl-6 min-h-[80px]">
                        <GlitchLine text="I build scalable digital products for your business." delay={1500} /><br />
                        <GlitchLine text="From custom mobile apps and Telegram bots," delay={2500} /><br />
                        <GlitchLine text="to high-performance SaaS architecture." delay={3000} />
                    </div>

                    {/* Interactive Terminal CTA */}
                    <div className="hud-element flex flex-col sm:flex-row gap-4 mt-auto lg:mt-0">
                        <Link href="/contact" className="group relative bg-[var(--bg-card)] border border-[var(--accent-primary)] px-8 py-5 flex items-center justify-center gap-4 hover:bg-[var(--accent-primary)]/10 transition-colors">
                            <span className="font-mono text-[var(--text-secondary)] text-sm group-hover:text-[var(--text-primary)] transition-colors">{'>'} request_assessment</span>
                            <div className="w-2 h-4 bg-[var(--accent-primary)] animate-pulse" />
                        </Link>

                        <Link href="/projects" className="group flex items-center justify-center border border-[var(--border-color)] bg-[var(--bg-primary)] px-8 py-5 hover:border-[var(--text-secondary)] transition-colors">
                            <span className="font-mono text-[var(--text-secondary)] text-sm group-hover:text-[var(--text-primary)] transition-colors uppercase tracking-widest">
                                [ View Portfolio ]
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Right Side - Floating Telemetry Data over the image */}
                <div className="hidden lg:flex w-[40%] flex-col gap-6 items-end justify-center perspective-[1000px]">
                    <div className="hud-element bg-[var(--bg-card)]/80 backdrop-blur-md border border-[var(--border-color)] p-6 w-full max-w-[300px] transform hover:rotate-y-0 hover:rotate-x-0 rotate-y-[-15deg] rotate-x-[5deg] transition-transform duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2 mb-4">
                            <span className="font-mono text-xs text-[var(--text-secondary)] uppercase">System Load</span>
                            <span className="font-mono text-xs text-[var(--accent-primary)] animate-pulse">32.4%</span>
                        </div>
                        <div className="w-full bg-[var(--bg-primary)] h-1 mb-2">
                            <div className="bg-[var(--text-primary)] h-full w-[32.4%]" />
                        </div>
                        <div className="w-full bg-[var(--bg-primary)] h-1 mb-2">
                            <div className="bg-[var(--text-secondary)] h-full w-[15%]" />
                        </div>
                        <div className="w-full bg-[var(--bg-primary)] h-1 mb-2">
                            <div className="bg-[var(--accent-primary)] h-full w-[8%]" />
                        </div>
                    </div>

                    <div className="hud-element bg-[var(--bg-card)]/80 backdrop-blur-md border border-[var(--border-color)] p-6 w-full max-w-[250px] transform hover:rotate-y-0 hover:rotate-x-0 rotate-y-[-15deg] rotate-x-[5deg] transition-transform duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2 mb-4">
                            <span className="font-mono text-xs text-[var(--text-secondary)] uppercase">Active Modules</span>
                        </div>
                        <ul className="font-mono text-xs flex flex-col gap-2 text-[var(--text-primary)]">
                            <li className="flex justify-between group"><span className="group-hover:text-[var(--accent-primary)] transition-colors">Next.js/React</span> <span className="text-[var(--accent-green)]">[OK]</span></li>
                            <li className="flex justify-between group"><span className="group-hover:text-[var(--accent-primary)] transition-colors">Prisma_ORM</span> <span className="text-[var(--accent-green)]">[OK]</span></li>
                            <li className="flex justify-between group"><span className="group-hover:text-[var(--accent-primary)] transition-colors">Tailwind.css</span> <span className="text-[var(--accent-green)]">[OK]</span></li>
                            <li className="flex justify-between group"><span className="group-hover:text-[var(--accent-primary)] transition-colors">GSAP_Core</span> <span className="text-[var(--accent-green)]">[OK]</span></li>
                        </ul>
                    </div>

                    {/* Stylized Crosshair */}
                    <div className="hud-element absolute top-[50%] right-[30%] w-16 h-16 border border-[var(--accent-primary)]/50 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite] pointer-events-none">
                        <div className="w-1 h-1 bg-[var(--accent-primary)] rounded-full" />
                        <div className="absolute top-[-5px] left-[50%] w-[1px] h-3 bg-[var(--accent-primary)]" />
                        <div className="absolute bottom-[-5px] left-[50%] w-[1px] h-3 bg-[var(--accent-primary)]" />
                        <div className="absolute left-[-5px] top-[50%] w-3 h-[1px] bg-[var(--accent-primary)]" />
                        <div className="absolute right-[-5px] top-[50%] w-3 h-[1px] bg-[var(--accent-primary)]" />
                    </div>
                </div>

            </div>

            {/* Bottom HUD bar */}
            <div className="hud-element absolute bottom-6 left-6 right-6 lg:left-12 lg:right-12 flex justify-between items-end font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-widest border-t border-[var(--border-color)] pt-4 z-10 pointer-events-none">
                <div className="flex flex-wrap gap-4 sm:gap-8">
                    <span>Uptime: 99.99%</span>
                    <span className="hidden sm:inline-block">/</span>
                    <span className="hidden sm:inline-block">Mem: 16.0 GB</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span>Status: Nominal</span>
                    <span className="text-[var(--accent-primary)]">Awaiting Input...</span>
                </div>
            </div>
        </section>
    )
}
