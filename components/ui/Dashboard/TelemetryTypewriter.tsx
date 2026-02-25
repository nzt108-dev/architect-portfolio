'use client'

import React, { useEffect, useState, useRef } from 'react'

const commands = [
    '> INIT: Analyzing project requirements...',
    '> STATUS: Scope clearly defined [OK]',
    '> TASK: Developing core architecture...',
    '> UPDATE: First milestone ready for review.',
    '> TEST: Quality assurance passed.',
    '> DEPLOY: Launching to production...',
    '> SYSTEM: Product is live.'
]

export default function TelemetryTypewriter() {
    const [currentLine, setCurrentLine] = useState(0)
    const [displayedText, setDisplayedText] = useState('')
    const [isTyping, setIsTyping] = useState(true)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isTyping) {
            const pauseTimer = setTimeout(() => {
                if (currentLine >= commands.length - 1) {
                    // Reset
                    setCurrentLine(0)
                    setDisplayedText('')
                } else {
                    setCurrentLine(prev => prev + 1)
                    setDisplayedText('')
                }
                setIsTyping(true)
            }, 1500) // Pause between lines
            return () => clearTimeout(pauseTimer)
        }

        const fullText = commands[currentLine]
        if (displayedText.length < fullText.length) {
            const typeTimer = setTimeout(() => {
                setDisplayedText(fullText.slice(0, displayedText.length + 1))
            }, 50 + Math.random() * 50) // Random varied typing speed
            return () => clearTimeout(typeTimer)
        } else {
            setIsTyping(false)
        }
    }, [currentLine, displayedText, isTyping])

    // Auto scroll to bottom
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [displayedText, currentLine])

    return (
        <div className="absolute inset-0 p-4 h-full flex flex-col justify-end">
            <div ref={containerRef} className="overflow-hidden flex flex-col gap-2">
                {/* Previous lines (keep last 3 to keep it clean) */}
                {commands.slice(Math.max(0, currentLine - 3), currentLine).map((cmd, i) => (
                    <div key={i} className="text-[var(--text-secondary)] opacity-50">
                        {cmd}
                    </div>
                ))}

                {/* Current typing line */}
                <div className="text-[var(--text-primary)]">
                    {displayedText}
                    <span className="inline-block w-2 bg-[var(--accent-primary)] animate-pulse ml-1 translate-y-[2px] h-4"></span>
                </div>
            </div>
        </div>
    )
}
