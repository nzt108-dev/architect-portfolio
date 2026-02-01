'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function HeroAvatar() {
    const [glitch, setGlitch] = useState(false)

    // Random glitch effect
    useEffect(() => {
        const triggerGlitch = () => {
            setGlitch(true)
            setTimeout(() => setGlitch(false), 150 + Math.random() * 100)
        }

        // Random intervals for glitch
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                triggerGlitch()
            }
        }, 2000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="relative w-[400px] h-[500px] md:w-[500px] md:h-[600px]">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-radial from-[var(--neon-cyan)]/20 via-transparent to-transparent blur-3xl" />

            {/* Main avatar container with faded edges */}
            <div
                className={`relative w-full h-full transition-all duration-75 ${glitch ? 'translate-x-1 skew-x-1' : ''
                    }`}
                style={{
                    maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 70%)',
                }}
            >
                {/* Avatar image */}
                <Image
                    src="/logo.jpg"
                    alt="nzt108_dev"
                    fill
                    className={`object-cover object-top transition-all duration-75 ${glitch ? 'hue-rotate-30 saturate-150' : ''
                        }`}
                    priority
                />

                {/* Glitch color layers */}
                {glitch && (
                    <>
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: 'url(/logo.jpg)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'top',
                                mixBlendMode: 'multiply',
                                opacity: 0.5,
                                transform: 'translateX(-3px)',
                                filter: 'hue-rotate(90deg)',
                            }}
                        />
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: 'url(/logo.jpg)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'top',
                                mixBlendMode: 'screen',
                                opacity: 0.3,
                                transform: 'translateX(3px)',
                                filter: 'hue-rotate(-90deg)',
                            }}
                        />
                    </>
                )}

                {/* Hologram scan line */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-[var(--neon-cyan)]/60 to-transparent animate-scan" />
                </div>

                {/* Noise/static overlay */}
                <div
                    className={`absolute inset-0 pointer-events-none opacity-10 mix-blend-overlay ${glitch ? 'opacity-40' : ''
                        }`}
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                />

                {/* Scanlines */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
                    }}
                />
            </div>

            {/* Floating data particles */}
            <div className="absolute top-10 right-0 text-[var(--neon-cyan)] font-mono text-xs opacity-60 animate-float">
                &lt;architect/&gt;
            </div>
            <div className="absolute bottom-20 left-0 text-[var(--neon-pink)] font-mono text-xs opacity-50 animate-float-delayed">
                systems.init()
            </div>
            <div className="absolute top-1/3 -right-4 w-2 h-2 rounded-full bg-[var(--neon-cyan)] animate-pulse opacity-80" />
            <div className="absolute bottom-1/4 -left-2 w-1.5 h-1.5 rounded-full bg-[var(--neon-purple)] animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
        </div>
    )
}
