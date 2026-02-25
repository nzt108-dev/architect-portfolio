'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const steps = [
    {
        number: '01',
        title: 'Architectural Blueprint',
        description: 'Deep technical discovery. We define the database schema, API contracts, and core infrastructure before writing a single line of code.',
        accentTitle: 'Phase One.'
    },
    {
        number: '02',
        title: 'System Construction',
        description: 'Rapid execution using Next.js, Node, and specialized tools. Daily deployments to staging so you see the system come alive in real-time.',
        accentTitle: 'Phase Two.'
    },
    {
        number: '03',
        title: 'Deployment Protocol',
        description: 'Production launch with zero downtime. Setup of CI/CD pipelines, telemetry, and automated uptime monitoring.',
        accentTitle: 'Phase Three.'
    },
]

export default function ProcessSteps() {
    const containerRef = useRef<HTMLDivElement>(null)
    const cardsRef = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)

        // Stacking Cards Logic
        const cards = cardsRef.current

        cards.forEach((card, i) => {
            if (!card) return

            // The card becomes sticky
            ScrollTrigger.create({
                trigger: card,
                start: "top 15%",
                endTrigger: containerRef.current,
                end: "bottom 80%",
                pin: true,
                pinSpacing: false,
                id: `card-${i}`
            })

            // As the NEXT card comes up, this card scales down, blurs, and fades
            if (i < cards.length - 1) {
                const nextCard = cards[i + 1]
                gsap.to(card, {
                    scale: 0.9,
                    opacity: 0.3,
                    filter: "blur(10px)",
                    scrollTrigger: {
                        trigger: nextCard,
                        start: "top 60%",
                        end: "top 15%",
                        scrub: true,
                    }
                })
            }
        })

        return () => {
            ScrollTrigger.getAll().forEach(st => {
                if (st.vars.id?.startsWith('card-')) st.kill()
            })
        }
    }, [])

    return (
        <section ref={containerRef} className="py-32 relative bg-[var(--bg-primary)]">
            <div className="mb-24 px-6 lg:px-12 max-w-7xl mx-auto">
                <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter">
                    Standard <span className="font-[var(--font-dm-serif)] italic text-[var(--accent-primary)]">Protocol.</span>
                </h2>
                <p className="text-[var(--text-secondary)] text-xl font-mono uppercase tracking-widest">
                    {'//'} The methodology behind the architecture.
                </p>
            </div>

            <div className="flex flex-col gap-24 lg:gap-0 pb-[50vh]">
                {steps.map((step, i) => (
                    <div
                        key={step.number}
                        ref={el => { cardsRef.current[i] = el }}
                        className="w-full h-[60vh] max-h-[600px] flex items-center justify-center px-6 lg:px-12 z-10 origin-top"
                        style={{ marginTop: i === 0 ? '0' : '5vh' }}
                    >
                        <div className="w-full max-w-6xl h-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[3rem] p-8 md:p-16 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">

                            {/* Abstract Geometric Background for each card */}
                            <div className="absolute top-0 right-0 w-[50%] h-full opacity-[0.03] flex items-center justify-center pointer-events-none">
                                {i === 0 && <div className="w-[40vw] h-[40vw] rounded-full border-[10px] border-[var(--text-primary)] animate-[spin_60s_linear_infinite]" />}
                                {i === 1 && <div className="w-[30vw] h-[30vw] border-[10px] border-[var(--text-primary)] rotate-45" />}
                                {i === 2 && <div className="w-full flex flex-col gap-8">
                                    {[1, 2, 3, 4, 5].map(j => <div key={j} className="h-[10px] bg-[var(--text-primary)] w-full" />)}
                                </div>}
                            </div>

                            <div className="flex justify-between items-start relative z-10">
                                <span className="text-[var(--text-secondary)] font-mono text-sm uppercase tracking-widest">
                                    [Step_{step.number}]
                                </span>
                                <span className="text-[var(--accent-primary)] font-mono text-xs uppercase tracking-widest bg-[var(--accent-primary)]/10 px-3 py-1 rounded-full border border-[var(--accent-primary)]/20">
                                    {step.accentTitle}
                                </span>
                            </div>

                            <div className="relative z-10 max-w-3xl">
                                <h3 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter text-[var(--text-primary)]">
                                    {step.title}
                                </h3>
                                <p className="text-xl md:text-2xl text-[var(--text-secondary)] font-mono leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
