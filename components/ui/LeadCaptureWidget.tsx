'use client'

import { useState } from 'react'
import { Send, CheckCircle, MessageCircle } from 'lucide-react'

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
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Lead');
        }
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
      <div className="p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--accent-green)]/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-[var(--accent-green)]" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">Request Received!</h3>
        <p className="text-[var(--text-secondary)] text-sm">
          I&apos;ll get back to you with an estimate within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
          Get a Free Estimate
        </h3>
        <p className="text-[var(--text-secondary)] text-sm">
          Tell me what you need — I&apos;ll reply within 24 hours with a clear proposal.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <select
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          required
          className="input"
        >
          <option value="">What do you need?</option>
          <option value="Mobile App">Mobile App</option>
          <option value="Website">Website / Landing Page</option>
          <option value="Telegram Bot">Telegram Bot</option>
          <option value="Discord Bot">Discord Bot</option>
          <option value="SaaS Platform">SaaS Platform</option>
          <option value="API / Backend">API / Backend</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
          placeholder="your@email.com"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Get Free Estimate'}
          {!isSubmitting && <Send size={16} />}
        </button>

        {status === 'error' && (
          <p className="text-[var(--accent-red)] text-sm text-center mt-2">
            Something went wrong. Please try again.
          </p>
        )}
      </form>

      {/* Alternative — Messenger */}
      <div className="flex items-center gap-3 mt-5 pt-5 border-t border-[var(--border-color)]">
        <span className="text-xs text-[var(--text-muted)]">Or chat directly:</span>
        <div className="flex gap-2">
          <a
            href="https://t.me/nzt108_dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors font-medium"
          >
            <MessageCircle size={14} />
            Telegram
          </a>
          <span className="text-[var(--text-muted)]">·</span>
          <a
            href="https://wa.me/message"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[var(--accent-green)] hover:text-[var(--accent-green)]/80 transition-colors font-medium"
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
