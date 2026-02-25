import Link from 'next/link'
import HeroAvatar from '@/components/ui/HeroAvatar'

export default function HeroV1() {
    return (
        <section className="relative h-[100dvh] w-full flex flex-col justify-end pb-20 px-6 lg:px-12 overflow-hidden">
            {/* Cinematic Background Avatar */}
            <HeroAvatar />

            {/* Background Gradient Overlay (Moss-to-Black equivalent for Brutalist -> Red-to-Black) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-[var(--bg-primary)]/20 z-0 pointer-events-none" />

            {/* Brutalist Grid Texture */}
            <div className="absolute inset-0 premium-grid opacity-20 z-0 pointer-events-none" />

            {/* Ambient Glow */}
            <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-[var(--accent-primary)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-end justify-between gap-12">
                {/* Bottom-left third content */}
                <div className="max-w-3xl flex flex-col justify-end">
                    {/* Monospace System Status */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full py-1.5 px-3">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-primary)]"></span>
                            </span>
                            <span className="text-xs font-mono text-[var(--text-primary)] tracking-widest uppercase">
                                System.Status: Online
                            </span>
                        </div>
                        <p className="text-[var(--text-secondary)] font-mono text-sm tracking-widest uppercase">
                            {'>'} Architect.nzt108
                        </p>
                    </div>

                    {/* Massive Typography Contrast */}
                    <h1 className="flex flex-col mb-8 leading-[0.9]">
                        <span className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-[var(--text-primary)]">
                            Engineer the
                        </span>
                        <span className="text-6xl md:text-8xl lg:text-[9rem] font-[var(--font-dm-serif)] italic text-[var(--accent-primary)] -mt-2">
                            Architecture.
                        </span>
                    </h1>

                    <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-mono">
                        [INIT] Building complete digital products from idea to launch. Mobile apps, Telegram bots, SaaS. Zero overhead. Pure execution.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4">
                        <Link href="/contact" className="btn-filled text-sm md:text-base px-10 py-4 uppercase tracking-widest">
                            Deploy Project
                        </Link>
                        <Link href="/services" className="cyber-btn flex items-center gap-2 uppercase tracking-widest text-sm px-8 py-4">
                            View Protocols
                        </Link>
                    </div>
                </div>

                {/* Right side - empty to allow background photo to show */}
                <div className="hidden lg:flex w-full lg:w-[40%]"></div>
            </div>
        </section>
    )
}
