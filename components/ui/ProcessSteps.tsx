'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Search, Code, Rocket } from 'lucide-react'

const steps = [
    {
        number: '01',
        icon: Search,
        title: 'Discovery & Planning',
        description: 'We define the scope, database schema, API contracts, and core architecture before writing code. You get a clear roadmap with milestones.',
    },
    {
        number: '02',
        icon: Code,
        title: 'Build & Iterate',
        description: 'Rapid development with daily staging deployments. You see progress in real-time and can provide feedback at every step.',
    },
    {
        number: '03',
        icon: Rocket,
        title: 'Launch & Support',
        description: 'Production deployment with CI/CD pipelines, monitoring, and documentation. Post-launch support to ensure smooth operation.',
    },
]

export default function ProcessSteps() {
    const containerRef = useRef<HTMLDivElement>(null)
    const cardsRef = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)

        const cards = cardsRef.current

        cards.forEach((card, i) => {
            if (!card) return

            ScrollTrigger.create({
                trigger: card,
                start: "top 15%",
                endTrigger: containerRef.current,
                end: "bottom 80%",
                pin: true,
                pinSpacing: false,
                id: `card-${i}`
            })

            if (i < cards.length - 1) {
                const nextCard = cards[i + 1]
                gsap.to(card, {
                    scale: 0.95,
                    opacity: 0.3,
                    filter: "blur(8px)",
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
        <section ref={containerRef} className="py-16 relative">
            <div className="mb-16 px-6 lg:px-12 max-w-7xl mx-auto">
                <h2 className="section-title text-4xl md:text-5xl">
                    How I Work
                </h2>
                <p className="section-subtitle">
                    A proven process that keeps your project on track and on budget.
                </p>
            </div>

            <div className="flex flex-col gap-24 lg:gap-0 pb-[50vh]">
                {steps.map((step, i) => {
                    const Icon = step.icon
                    return (
                        <div
                            key={step.number}
                            ref={el => { cardsRef.current[i] = el }}
                            className="w-full h-[50vh] max-h-[500px] flex items-center justify-center px-6 lg:px-12 z-10 origin-top"
                            style={{ marginTop: i === 0 ? '0' : '5vh' }}
                        >
                            <div className="w-full max-w-5xl h-full rounded-3xl p-8 md:p-14 flex flex-col justify-between shadow-xl relative overflow-hidden"
                                style={{
                                    background: `linear-gradient(135deg, #18181B 0%, ${i === 0 ? '#1E1B4B' : i === 1 ? '#1B2E4B' : '#1B1B3A'} 60%, #18181B 100%)`
                                }}
                            >
                                {/* Grid overlay */}
                                <div className="dark-grid absolute inset-0 pointer-events-none" />
                                {/* Accent blob */}
                                <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#6366F1] opacity-[0.06] rounded-full blur-[80px] pointer-events-none" />

                                <div className="flex justify-between items-start relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                        <Icon size={24} className="text-[#818CF8]" />
                                    </div>
                                    <span className="text-[#71717A] text-sm font-medium">
                                        Step {step.number}
                                    </span>
                                </div>

                                <div className="max-w-2xl relative z-10">
                                    <h3 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-white">
                                        {step.title}
                                    </h3>
                                    <p className="text-lg md:text-xl text-[#A1A1AA] leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
