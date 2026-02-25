'use client'

import React, { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'

type MetricCard = {
    id: number
    label: string
    value: string
    status: 'optimal' | 'warning'
}

const initialCards: MetricCard[] = [
    { id: 1, label: 'Conversion Rate', value: '+24.5%', status: 'optimal' },
    { id: 2, label: 'User Retention', value: '89%', status: 'optimal' },
    { id: 3, label: 'Active Users', value: '14.2k', status: 'optimal' },
]

export default function DiagnosticShuffler() {
    const [cards, setCards] = useState<MetricCard[]>(initialCards)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const interval = setInterval(() => {
            setCards(prev => {
                const newCards = [...prev]
                const last = newCards.pop()
                if (last) newCards.unshift(last)
                return newCards
            })
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div ref={containerRef} className="relative w-full h-[200px] mt-8 flex justify-center perspective-[1000px]">
            {cards.map((card, index) => {
                // Determine stacking order and visual transform based on current index
                const isFront = index === 0
                const isMiddle = index === 1
                const isBack = index === 2

                return (
                    <div
                        key={card.id}
                        className={`absolute w-[80%] origin-bottom transition-all duration-700 rounded-2xl border p-4 shadow-xl flex flex-col justify-between ${isFront
                            ? 'bg-[var(--bg-primary)] border-[var(--border-color)] z-30 scale-100 translate-y-0 opacity-100'
                            : isMiddle
                                ? 'bg-[var(--bg-primary)]/80 border-[var(--border-color)]/60 z-20 scale-[0.9] -translate-y-[20px] opacity-60'
                                : 'bg-[var(--bg-primary)]/50 border-[var(--border-color)]/30 z-10 scale-[0.8] -translate-y-[40px] opacity-30'
                            }`}
                        style={{
                            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // Spring bounce
                        }}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                                {card.label}
                            </span>
                            <span className={`w-2 h-2 rounded-full ${card.status === 'optimal' ? 'bg-[var(--accent-green)]' : 'bg-[var(--accent-amber)]'}`} />
                        </div>
                        <div className="text-3xl font-bold font-mono text-[var(--text-primary)] tracking-tighter">
                            {card.value}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
