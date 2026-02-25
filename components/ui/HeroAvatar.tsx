'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function HeroAvatar() {
    const containerRef = useRef<HTMLDivElement>(null);
    const colorLayerRef = useRef<HTMLImageElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Slow cinematic fade-in for the container
            gsap.from(containerRef.current, {
                opacity: 0,
                scale: 1.05,
                duration: 3,
                ease: "power2.out"
            });

            // 2. "Developing Photograph" effect
            // The true color layer slowly reveals itself but stays muted
            gsap.to(colorLayerRef.current, {
                opacity: 0.35, // Just enough color to look expensive, but keeps the dark brutalist base
                duration: 8,
                ease: "power1.inOut",
                delay: 1
            });

            // 3. Elegant pulsing light leak
            gsap.to(glowRef.current, {
                opacity: 0.25,
                scale: 1.2,
                duration: 6,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut"
            });

            // 4. Subtle ambient float for the whole container
            gsap.to(containerRef.current, {
                y: "-2%",
                duration: 10,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut"
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="absolute right-0 bottom-0 w-full h-[80vh] lg:w-[60vw] lg:h-[100dvh] pointer-events-none z-0 opacity-80 mix-blend-screen overflow-hidden origin-bottom">
            {/* 
                Premium Blending Gradients
            */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/40 to-transparent z-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)] z-20" />

            {/* BASE LAYER: Deep High-Contrast Grayscale */}
            <Image
                src="/logo.jpg"
                alt="nzt108_dev base"
                fill
                className="object-cover object-right-bottom lg:object-center grayscale contrast-125 brightness-110 z-0"
                priority
            />

            {/* COLOR LAYER: Slowly develops over time (opacity manipulated by GSAP) */}
            <Image
                ref={colorLayerRef}
                src="/logo.jpg"
                alt="nzt108_dev true color"
                fill
                className="object-cover object-right-bottom lg:object-center contrast-125 brightness-110 opacity-0 z-10"
                priority
            />

            {/* Premium Light Leak (Soft Red Ambient Glow) */}
            <div
                ref={glowRef}
                className="absolute -bottom-[20%] right-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-[var(--accent-primary)] rounded-full blur-[100px] opacity-0 z-10 mix-blend-screen"
            />
        </div>
    )
}
