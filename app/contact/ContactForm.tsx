'use client';

import { useState } from 'react';
import { getUtmParams } from '@/components/analytics/AnalyticsTracker';
import { Send, CheckCircle } from 'lucide-react';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        budget: '',
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const utm = getUtmParams()
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    serviceType: formData.subject,
                    ...utm,
                }),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '', budget: '' });
                if (typeof window !== 'undefined' && (window as any).fbq) {
                    (window as any).fbq('track', 'Lead');
                    (window as any).fbq('track', 'Contact');
                }
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-[var(--bg-card)] border border-[var(--accent-green)] p-10 text-center rounded-2xl">
                <CheckCircle size={48} className="text-[var(--accent-green)] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">Message Sent!</h3>
                <p className="text-[var(--text-secondary)] text-sm mb-6">
                    Thanks for reaching out. I&apos;ll get back to you within 24 hours.
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="btn-secondary text-sm py-2.5 rounded-xl"
                >
                    Send Another Message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 md:p-8 rounded-2xl space-y-5">
            <div className="mb-2">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                    Send a Message
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                    Tell me about your project and I&apos;ll reply with an estimate.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                        Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input"
                        placeholder="Your name"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input"
                        placeholder="your@email.com"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                        Service
                    </label>
                    <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="input appearance-none cursor-pointer"
                    >
                        <option value="">Select a service...</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="Website">Website</option>
                        <option value="Telegram Bot">Telegram Bot</option>
                        <option value="Discord Bot">Discord Bot</option>
                        <option value="SaaS Platform">SaaS Platform</option>
                        <option value="API / Backend">API / Backend</option>
                        <option value="Consulting">Consulting</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                        Budget <span className="text-[var(--text-muted)]">(optional)</span>
                    </label>
                    <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="input appearance-none cursor-pointer"
                    >
                        <option value="">Select range...</option>
                        <option value="$500-1k">$500 – $1,000</option>
                        <option value="$1k-3k">$1,000 – $3,000</option>
                        <option value="$3k-7k">$3,000 – $7,000</option>
                        <option value="$7k-15k">$7,000 – $15,000</option>
                        <option value="$15k+">$15,000+</option>
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                    Project Details
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="input resize-none"
                    placeholder="Describe your project, goals, and any specific requirements..."
                />
            </div>

            <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary w-full py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
                {status !== 'loading' && <Send size={16} />}
            </button>

            {status === 'error' && (
                <p className="text-red-500 text-sm text-center">
                    Something went wrong. Please try again or email me directly.
                </p>
            )}
        </form>
    );
}
