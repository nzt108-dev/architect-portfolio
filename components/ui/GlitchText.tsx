'use client';

import { useEffect, useState } from 'react';

interface GlitchTextProps {
    text: string;
    className?: string;
    glitchOnHover?: boolean;
}

export default function GlitchText({
    text,
    className = '',
    glitchOnHover = false,
}: GlitchTextProps) {
    const [isGlitching, setIsGlitching] = useState(!glitchOnHover);

    useEffect(() => {
        if (!glitchOnHover) {
            // Random glitch intervals
            const interval = setInterval(() => {
                setIsGlitching(true);
                setTimeout(() => setIsGlitching(false), 200);
            }, 3000 + Math.random() * 2000);

            return () => clearInterval(interval);
        }
    }, [glitchOnHover]);

    return (
        <span
            className={`relative inline-block ${className}`}
            onMouseEnter={() => glitchOnHover && setIsGlitching(true)}
            onMouseLeave={() => glitchOnHover && setIsGlitching(false)}
        >
            <span
                className={`relative z-10 ${isGlitching ? 'glitch-text' : ''}`}
                data-text={text}
            >
                {text}
            </span>
            {isGlitching && (
                <>
                    <span
                        className="absolute inset-0 text-[var(--neon-pink)] opacity-70"
                        style={{ clipPath: 'inset(10% 0 60% 0)', transform: 'translate(-2px, 0)' }}
                        aria-hidden
                    >
                        {text}
                    </span>
                    <span
                        className="absolute inset-0 text-[var(--neon-cyan)] opacity-70"
                        style={{ clipPath: 'inset(50% 0 20% 0)', transform: 'translate(2px, 0)' }}
                        aria-hidden
                    >
                        {text}
                    </span>
                </>
            )}
        </span>
    );
}
