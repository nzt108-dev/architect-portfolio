'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CursorProtocolScheduler() {
    const cursorRef = useRef<SVGSVGElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Day nodes
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 })

            // Hide cursor initially
            gsap.set(cursorRef.current, { x: 50, y: 150, opacity: 0 })
            gsap.set('.day-cell', { backgroundColor: 'transparent', color: 'var(--text-secondary)' })
            gsap.set('.save-btn', { scale: 1, backgroundColor: 'transparent' })

            // Entry
            tl.to(cursorRef.current, { opacity: 1, duration: 0.5, ease: 'power2.inOut' })
                // Move to Wednesday (index 3)
                .to(cursorRef.current, { x: 120, y: 20, duration: 1, ease: 'power2.inOut' })
                // Click press
                .to(cursorRef.current, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
                // Highlight Wednesday
                .to('.day-cell-3', { backgroundColor: 'var(--accent-primary)', color: 'var(--bg-primary)', duration: 0.2 }, '<')

                // Move to Friday (index 5)
                .to(cursorRef.current, { x: 180, y: 20, duration: 0.8, ease: 'power2.inOut', delay: 0.2 })
                // Click press
                .to(cursorRef.current, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
                // Highlight Friday
                .to('.day-cell-5', { backgroundColor: 'var(--accent-primary)', color: 'var(--bg-primary)', duration: 0.2 }, '<')

                // Move to Save Button
                .to(cursorRef.current, { x: 150, y: 80, duration: 1, ease: 'power2.inOut', delay: 0.5 })
                // Click press
                .to(cursorRef.current, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
                // Button flash
                .to('.save-btn', { backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', duration: 0.2 }, '<')
                .to('.save-btn', { backgroundColor: 'transparent', color: 'var(--text-primary)', duration: 0.5 }, '+=0.3')

                // Exit
                .to(cursorRef.current, { opacity: 0, y: 150, duration: 0.5, ease: 'power2.in' })

        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <div ref={containerRef} className="relative w-full h-full flex flex-col justify-center items-center p-4">

            {/* Calendar Grid */}
            <div className="flex gap-2 mb-8 relative z-10 w-full justify-between">
                {days.map((day, i) => (
                    <div
                        key={i}
                        className={`day-cell day-cell-${i} w-8 h-8 rounded-md flex items-center justify-center border border-[var(--border-color)] font-mono text-xs transition-colors`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Action Button */}
            <div className="save-btn border border-[var(--text-primary)] rounded-full px-6 py-2 font-mono text-xs tracking-widest uppercase transition-colors relative z-10">
                Approve Milestone
            </div>

            {/* Simulated Cursor (SVG) */}
            <svg
                ref={cursorRef}
                className="absolute z-20 w-6 h-6 text-white drop-shadow-md pointer-events-none"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                style={{ top: 0, left: 0 }}
            >
                <path d="M4 0L24 10L14 13L10 24L4 0Z" stroke="black" strokeWidth="1" strokeLinejoin="round" />
            </svg>
        </div>
    )
}
