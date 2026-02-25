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
            <div className="bg-[var(--bg-card)] border border-[var(--accent-green)] p-12 text-center rounded-[2rem] shadow-[0_4px_30px_rgba(46,230,133,0.05)]">
                <div className="font-mono text-5xl text-[var(--accent-green)] mb-6">[✓]</div>
                <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)] uppercase tracking-tight">Transmission Complete</h3>
                <p className="font-mono text-[var(--text-secondary)] text-sm mb-8 leading-relaxed">
                    System payload delivered. Awaiting manual assessment. Expected latency: {'<'} 24H.
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="font-mono text-xs uppercase tracking-widest text-[var(--text-primary)] border border-[var(--border-color)] px-6 py-3 rounded-lg hover:border-[var(--accent-green)] transition-colors"
                >
                    Init New Transmission
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 md:p-10 rounded-[2rem] space-y-6">
            <div className="mb-8 border-b border-[var(--border-color)] pb-4">
                <h2 className="font-mono text-[var(--text-primary)] text-sm font-bold uppercase tracking-widest">
                    {'>'} Initialize Payload
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block font-mono text-[10px] uppercase tracking-widest font-bold mb-3 text-[var(--text-secondary)]">
                        [ID] Identity
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-4 rounded-xl text-sm font-mono text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                        placeholder="ENTER_NAME"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block font-mono text-[10px] uppercase tracking-widest font-bold mb-3 text-[var(--text-secondary)]">
                        [COMM] Routing Address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-4 rounded-xl text-sm font-mono text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                        placeholder="NAME@DOMAIN.COM"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="subject" className="block font-mono text-[10px] uppercase tracking-widest font-bold mb-3 text-[var(--text-secondary)]">
                        [REQ] Protocol Type
                    </label>
                    <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
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
                        <option value="Consulting">[CON] Strategy Consulting</option>
                        <option value="Other">[OTH] Custom Payload</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="budget" className="block font-mono text-[10px] uppercase tracking-widest font-bold mb-3 text-[var(--text-secondary)]">
                        [CAP] Capital Allocation <span className="opacity-50">(OPTIONAL)</span>
                    </label>
                    <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-4 rounded-xl text-sm font-mono text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                        <option value="">DEFINE_RANGE...</option>
                        <option value="$500-1k">$500 – $1,000</option>
                        <option value="$1k-3k">$1,000 – $3,000</option>
                        <option value="$3k-7k">$3,000 – $7,000</option>
                        <option value="$7k-15k">$7,000 – $15,000</option>
                        <option value="$15k+">$15,000+</option>
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="message" className="block font-mono text-[10px] uppercase tracking-widest font-bold mb-3 text-[var(--text-secondary)]">
                    [DATA] Specification Overview
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-4 rounded-xl text-sm font-mono text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors resize-none"
                    placeholder="DEFINE_BUSINESS_LOGIC_AND_CONSTRAINTS..."
                />
            </div>

            <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[var(--bg-primary)] border border-[var(--accent-primary)] text-[var(--text-primary)] font-mono text-sm font-bold uppercase tracking-widest p-5 rounded-xl hover:bg-[var(--bg-card)] hover:text-[var(--accent-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
                <span className="relative z-10">{status === 'loading' ? 'TRANSMITTING...' : 'EXECUTE_PAYLOAD'}</span>
            </button>

            {status === 'error' && (
                <p className="font-mono text-[var(--accent-primary)] text-[10px] uppercase tracking-widest text-center mt-4">
                    [ERROR] TRANSMISSION FAILED. PLEASE EXPORT DIRECTLY VIA EMAIL.
                </p>
            )}
        </form>
    );
}
