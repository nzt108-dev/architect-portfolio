'use client'

import { useState } from 'react'

export default function LeadCaptureWidget() {
    const [email, setEmail] = useState('')
    const [serviceType, setServiceType] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !serviceType) return

        setIsSubmitting(true)
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: '',
                    email,
                    subject: serviceType,
                    message: `Quick estimate request for: ${serviceType}`,
                    serviceType,
                }),
            })

            if (response.ok) {
                setStatus('success')
                setEmail('')
                setServiceType('')
            } else {
                setStatus('error')
            }
        } catch {
            setStatus('error')
        } finally {
            setIsSubmitting(false)
            setTimeout(() => setStatus('idle'), 5000)
        }
    }

    if (status === 'success') {
        return (
            <div className="bg-[var(--bg-card)] border border-[var(--accent-green)] p-12 text-center">
                <div className="font-mono text-4xl text-[var(--accent-green)] mb-6">[✓]</div>
                <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)] uppercase tracking-tight">Request Logged</h3>
                <p className="font-mono text-[var(--text-secondary)] text-sm leading-relaxed">
                    System payload delivered. I will construct an estimate within 24H.
                </p>
            </div>
        )
    }

    return (
        <div className="bg-[var(--bg-card)] p-8 md:p-10 border-t border-[var(--border-color)] lg:border-t-0">
            <div className="mb-6">
                <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] mb-2">
                    {'>'} Quick Assessment
                </h3>
                <p className="font-mono text-[var(--text-secondary)] text-[10px] uppercase tracking-widest leading-relaxed">
                    REQUIREMENTS IN, ESTIMATE OUT. {'<'} 24H LATENCY.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    required
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-4 rounded-xl text-sm font-mono text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                    <option value="">SELECT_PROTOCOL...</option>
                    <option value="Mobile App">[APP] Mobile Architecture</option>
                    <option value="Website">[WEB] Raw Platform</option>
                    <option value="Telegram Bot">[BOT] Telegram Autonomous</option>
                    <option value="Discord Bot">[BOT] Discord Automation</option>
                    <option value="SaaS Platform">[SYS] Enterprise SaaS</option>
                    <option value="API / Backend">[API] Infrastructure Data</option>
                    <option value="Other">[OTH] Custom Payload</option>
                </select>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-4 rounded-xl text-sm font-mono text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                    placeholder="ENTER_ROUTING_ADDRESS@DOMAIN.COM"
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--accent-primary)] text-[var(--text-primary)] font-mono text-sm font-bold uppercase tracking-widest p-4 rounded-xl hover:bg-[var(--bg-card)] hover:text-[var(--accent-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                    <span className="relative z-10">{isSubmitting ? 'TRANSMITTING...' : 'INITIATE_REQUEST'}</span>
                </button>

                {status === 'error' && (
                    <p className="font-mono text-[var(--accent-primary)] text-[10px] uppercase tracking-widest text-center mt-4">
                        [ERROR] REQUEST FAILED.
                    </p>
                )}
            </form>
        </div>
    )
}
