'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import DiagnosticShuffler from './Dashboard/DiagnosticShuffler'
import TelemetryTypewriter from './Dashboard/TelemetryTypewriter'
import CursorProtocolScheduler from './Dashboard/CursorProtocolScheduler'

export default function DashboardFeatures() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)

        const ctx = gsap.context(() => {
            gsap.from('.dashboard-card', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                }
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={containerRef} className="py-32 relative z-10">
            <div className="mb-16">
                <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter">
                    Platform <span className="font-[var(--font-dm-serif)] italic text-[var(--accent-primary)]">Capabilities.</span>
                </h2>
                <p className="text-[var(--text-secondary)] text-xl font-mono uppercase tracking-widest">
                    {'//'} Tested, predictable execution.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Diagnostic Shuffler (Value Prop 1: System Stability) */}
                <div className="dashboard-card h-[400px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden group">
                    <h3 className="text-2xl font-bold mb-2 z-10">Data-Driven Metrics</h3>
                    <p className="text-[var(--text-secondary)] font-mono text-sm mb-6 z-10">Focus on metrics that matter to your business.</p>
                    <div className="flex-1 relative">
                        <DiagnosticShuffler />
                    </div>
                </div>

                {/* 2. Telemetry Typewriter (Value Prop 2: Data Processing) */}
                <div className="dashboard-card h-[400px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-2 z-10">
                        <h3 className="text-2xl font-bold">Transparent Process</h3>
                        <div className="flex items-center gap-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-full px-3 py-1">
                            <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                            <span className="text-xs font-mono uppercase">Live Log</span>
                        </div>
                    </div>
                    <p className="text-[var(--text-secondary)] font-mono text-sm mb-6 z-10">Continuous updates & regular deliveries.</p>
                    <div className="flex-1 bg-[var(--bg-primary)]/50 rounded-xl border border-[var(--border-color)] p-4 font-mono text-sm overflow-hidden relative">
                        <TelemetryTypewriter />
                    </div>
                </div>

                {/* 3. Cursor Protocol Scheduler (Value Prop 3: Automation) */}
                <div className="dashboard-card h-[400px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden group">
                    <h3 className="text-2xl font-bold mb-2 z-10">Predictable Delivery</h3>
                    <p className="text-[var(--text-secondary)] font-mono text-sm mb-6 z-10">Strict deadlines and clear roadmaps.</p>
                    <div className="flex-1 relative">
                        <CursorProtocolScheduler />
                    </div>
                </div>
            </div>
        </section>
    )
}
