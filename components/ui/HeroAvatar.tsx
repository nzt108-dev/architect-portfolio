'use client'

import Image from 'next/image'

export default function HeroAvatar() {
    return (
        <div className="relative w-[400px] h-[500px] md:w-[500px] md:h-[600px]">
            {/* Background glow — subtle indigo */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/15 via-transparent to-[var(--accent-secondary)]/10 blur-3xl rounded-full" />

            {/* Main avatar container with faded edges — keeps cyberpunk photo */}
            <div
                className="relative w-full h-full"
                style={{
                    maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 70%)',
                }}
            >
                {/* Avatar image — cyberpunk photo stays as-is */}
                <Image
                    src="/logo.jpg"
                    alt="nzt108_dev"
                    fill
                    className="object-cover object-top"
                    priority
                />
            </div>

            {/* Subtle floating accent dots */}
            <div className="absolute top-1/4 -right-2 w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse opacity-50" />
            <div className="absolute bottom-1/3 -left-1 w-1.5 h-1.5 rounded-full bg-[var(--accent-secondary)] animate-pulse opacity-40" style={{ animationDelay: '1.5s' }} />
        </div>
    )
}
