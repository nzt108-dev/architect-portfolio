'use client'

import Image from 'next/image'

export default function HeroAvatar() {
    return (
        <div className="relative">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-purple)] to-[var(--neon-pink)] blur-xl opacity-50 animate-pulse" />

            {/* Scanning effect container */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-[var(--neon-cyan)] shadow-[var(--glow-cyan)]">
                {/* Avatar image */}
                <Image
                    src="/logo.jpg"
                    alt="nzt108_dev"
                    fill
                    className="object-cover"
                    priority
                />

                {/* Hologram scan line effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-[var(--neon-cyan)] to-transparent opacity-70 animate-scan" />
                </div>

                {/* Hologram overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--neon-cyan)]/10 via-transparent to-[var(--neon-purple)]/10 pointer-events-none" />

                {/* Grid lines overlay */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(0,196,196,0.3) 25%, rgba(0,196,196,0.3) 26%, transparent 27%, transparent 74%, rgba(0,196,196,0.3) 75%, rgba(0,196,196,0.3) 76%, transparent 77%),
              linear-gradient(90deg, transparent 24%, rgba(0,196,196,0.3) 25%, rgba(0,196,196,0.3) 26%, transparent 27%, transparent 74%, rgba(0,196,196,0.3) 75%, rgba(0,196,196,0.3) 76%, transparent 77%)
            `,
                        backgroundSize: '20px 20px',
                    }}
                />
            </div>

            {/* Floating particles */}
            <div className="absolute -top-4 -right-4 w-2 h-2 rounded-full bg-[var(--neon-cyan)] animate-float opacity-80" />
            <div className="absolute -bottom-2 -left-6 w-3 h-3 rounded-full bg-[var(--neon-pink)] animate-float-delayed opacity-60" />
            <div className="absolute top-1/4 -right-8 w-1.5 h-1.5 rounded-full bg-[var(--neon-purple)] animate-float opacity-70" />
        </div>
    )
}
