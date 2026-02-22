'use client';

import { useState } from 'react';
import { getUtmParams } from '@/components/analytics/AnalyticsTracker';

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
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="cyber-card p-10 text-center neon-border">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-bold mb-3">Message Sent!</h3>
                <p className="text-[var(--text-secondary)] mb-6">
                    Thanks for reaching out. I&apos;ll get back to you within 24 hours with a detailed response.
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="cyber-btn"
                >
                    Send Another Message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="cyber-card p-8 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                        Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="cyber-input"
                        placeholder="Your name"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="cyber-input"
                        placeholder="your@email.com"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                        Service Type
                    </label>
                    <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
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
                        <option value="Consulting">💡 Consulting</option>
                        <option value="Other">📦 Other</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="budget" className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                        Budget Range <span className="text-[var(--text-muted)]">(optional)</span>
                    </label>
                    <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="cyber-input"
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
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                    Tell Me About Your Project
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="cyber-input resize-none"
                    placeholder="Describe your idea, goals, and any specific requirements..."
                />
            </div>

            <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-filled w-full py-3.5 text-base"
            >
                {status === 'loading' ? 'Sending...' : 'Send Message →'}
            </button>

            {status === 'error' && (
                <p className="text-red-400 text-sm text-center">
                    Something went wrong. Please try again or email me directly.
                </p>
            )}
        </form>
    );
}
