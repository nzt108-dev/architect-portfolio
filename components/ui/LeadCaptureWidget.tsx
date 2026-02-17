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
            <div className="cyber-card p-8 neon-border text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-semibold mb-2">Request Received!</h3>
                <p className="text-[var(--text-secondary)]">
                    I&apos;ll get back to you within 24 hours with a detailed estimate.
                </p>
            </div>
        )
    }

    return (
        <div className="cyber-card p-8 neon-border">
            <h3 className="text-xl font-semibold mb-2 text-center">Get a Free Estimate</h3>
            <p className="text-[var(--text-secondary)] text-sm text-center mb-6">
                Tell me what you need — I&apos;ll respond within 24 hours
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    required
                    className="cyber-input"
                >
                    <option value="">What do you need?</option>
                    <option value="Mobile App">📱 Mobile App</option>
                    <option value="Website">🌐 Website / Landing Page</option>
                    <option value="Telegram Bot">🤖 Telegram Bot</option>
                    <option value="Discord Bot">🎮 Discord Bot</option>
                    <option value="SaaS Platform">💼 SaaS Platform</option>
                    <option value="API / Backend">⚙️ API / Backend</option>
                    <option value="Other">📦 Other</option>
                </select>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="cyber-input"
                    placeholder="Your email address"
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-filled w-full py-3"
                >
                    {isSubmitting ? 'Sending...' : 'Get Free Estimate →'}
                </button>

                {status === 'error' && (
                    <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
                )}
            </form>
        </div>
    )
}
