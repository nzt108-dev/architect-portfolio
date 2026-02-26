'use client'

import { useState, useEffect } from 'react'
import { Copy, Plus, Trash2, ExternalLink } from 'lucide-react'

// Common presets for quick selection
const SOURCE_PRESETS = [
    { label: 'Instagram', value: 'instagram' },
    { label: 'Facebook', value: 'facebook' },
    { label: 'Telegram', value: 'telegram' },
    { label: 'LinkedIn', value: 'linkedin' },
    { label: 'Google', value: 'google' },
]

const MEDIUM_PRESETS = [
    { label: 'CPC (Ad)', value: 'cpc' },
    { label: 'Social Profile', value: 'social_bio' },
    { label: 'Story', value: 'story' },
    { label: 'Direct Message', value: 'dm' },
    { label: 'Email', value: 'email' },
]

export default function UtmGeneratorPage() {
    const [baseUrl, setBaseUrl] = useState('https://nzt108.dev')
    const [utmSource, setUtmSource] = useState('')
    const [utmMedium, setUtmMedium] = useState('')
    const [utmCampaign, setUtmCampaign] = useState('')
    const [utmTerm, setUtmTerm] = useState('')
    const [utmContent, setUtmContent] = useState('')
    const [generatedUrl, setGeneratedUrl] = useState('')
    const [copied, setCopied] = useState(false)

    // History of generated links (local storage for convenience)
    const [history, setHistory] = useState<{ url: string; date: string }[]>([])

    // Load history on mount
    useEffect(() => {
        const saved = localStorage.getItem('utmHistory')
        if (saved) {
            try {
                setHistory(JSON.parse(saved))
            } catch {
                // Ignore parse errors
            }
        }
    }, [])

    // Update generated URL whenever inputs change
    useEffect(() => {
        try {
            if (!baseUrl) {
                setGeneratedUrl('')
                return
            }

            // Ensure base URL has protocol
            let validBaseUrl = baseUrl
            if (!validBaseUrl.startsWith('http://') && !validBaseUrl.startsWith('https://')) {
                validBaseUrl = `https://${validBaseUrl}`
            }

            const url = new URL(validBaseUrl)

            if (utmSource) url.searchParams.set('utm_source', utmSource)
            if (utmMedium) url.searchParams.set('utm_medium', utmMedium)
            if (utmCampaign) url.searchParams.set('utm_campaign', utmCampaign)
            if (utmTerm) url.searchParams.set('utm_term', utmTerm)
            if (utmContent) url.searchParams.set('utm_content', utmContent)

            // Only show URL with params if at least source/medium/campaign is present
            if (utmSource || utmMedium || utmCampaign) {
                setGeneratedUrl(url.toString())
            } else {
                setGeneratedUrl(validBaseUrl)
            }
        } catch {
            setGeneratedUrl('Invalid Base URL')
        }
    }, [baseUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent])

    const copyToClipboard = async () => {
        if (!generatedUrl || generatedUrl === 'Invalid Base URL') return

        try {
            await navigator.clipboard.writeText(generatedUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)

            // Add to history
            const newEntry = { url: generatedUrl, date: new Date().toISOString() }
            const newHistory = [newEntry, ...history.filter(h => h.url !== generatedUrl)].slice(0, 10)
            setHistory(newHistory)
            localStorage.setItem('utmHistory', JSON.stringify(newHistory))
        } catch (err) {
            console.error('Failed to copy', err)
        }
    }

    const clearHistory = () => {
        setHistory([])
        localStorage.removeItem('utmHistory')
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-mono tracking-tight text-[var(--text-primary)] uppercase flex items-center gap-3">
                    <span className="text-[var(--accent-primary)]">[+]</span> UTM Link Generator
                </h1>
                <p className="text-[var(--text-muted)] mt-2 font-mono text-xs tracking-widest uppercase">
                    Build perfectly tagged URLs for META targeting, analytics, and precise conversion attribution.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configurator Left Side */}
                <div className="col-span-1 lg:col-span-2 space-y-6">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 lg:p-8 space-y-6">
                        {/* Base URL */}
                        <div>
                            <label className="block font-mono text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] mb-2">
                                [0] Destination URL
                            </label>
                            <input
                                type="url"
                                value={baseUrl}
                                onChange={(e) => setBaseUrl(e.target.value)}
                                placeholder="https://nzt108.dev"
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-4 rounded-xl text-sm font-mono focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Campaign Source */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--text-primary)]">
                                        [1] Source (utm_source) *
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    value={utmSource}
                                    onChange={(e) => setUtmSource(e.target.value)}
                                    placeholder="e.g. instagram"
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-3 rounded-xl text-sm font-mono focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {SOURCE_PRESETS.map((p) => (
                                        <button
                                            key={p.value}
                                            onClick={() => setUtmSource(p.value)}
                                            className="text-[10px] uppercase tracking-widest font-mono bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-muted)] py-1 px-2 rounded hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors"
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Campaign Medium */}
                            <div>
                                <label className="block font-mono text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] mb-2">
                                    [2] Medium (utm_medium) *
                                </label>
                                <input
                                    type="text"
                                    value={utmMedium}
                                    onChange={(e) => setUtmMedium(e.target.value)}
                                    placeholder="e.g. cpc, social_bio"
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-3 rounded-xl text-sm font-mono focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {MEDIUM_PRESETS.map((p) => (
                                        <button
                                            key={p.value}
                                            onClick={() => setUtmMedium(p.value)}
                                            className="text-[10px] uppercase tracking-widest font-mono bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-muted)] py-1 px-2 rounded hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors"
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Campaign Name */}
                        <div>
                            <label className="block font-mono text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] mb-2">
                                [3] Campaign Name (utm_campaign) *
                            </label>
                            <input
                                type="text"
                                value={utmCampaign}
                                onChange={(e) => setUtmCampaign(e.target.value)}
                                placeholder="e.g. spring_sale, retargeting_v1"
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-3 rounded-xl text-sm font-mono focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--border-color)]/50">
                            {/* Campaign Term (Optional) */}
                            <div>
                                <label className="block font-mono text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                                    [4] Term (utm_term) <span className="opacity-50">OPT</span>
                                </label>
                                <input
                                    type="text"
                                    value={utmTerm}
                                    onChange={(e) => setUtmTerm(e.target.value)}
                                    placeholder="e.g. software+architect"
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-3 rounded-xl text-sm font-mono text-[var(--text-muted)] focus:text-[var(--text-primary)] focus:border-[var(--border-color)] focus:outline-none transition-colors"
                                />
                            </div>

                            {/* Campaign Content (Optional) */}
                            <div>
                                <label className="block font-mono text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                                    [5] Content (utm_content) <span className="opacity-50">OPT</span>
                                </label>
                                <input
                                    type="text"
                                    value={utmContent}
                                    onChange={(e) => setUtmContent(e.target.value)}
                                    placeholder="e.g. logolink, textlink"
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] p-3 rounded-xl text-sm font-mono text-[var(--text-muted)] focus:text-[var(--text-primary)] focus:border-[var(--border-color)] focus:outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Output Section */}
                    {generatedUrl && generatedUrl !== 'Invalid Base URL' && (
                        <div className="bg-[var(--bg-card)] border border-[var(--accent-primary)] rounded-2xl p-6 lg:p-8 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent-primary)]" />
                            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] mb-4">
                                {'>'} Generated Link Payload
                            </h3>
                            <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-4 break-all font-mono text-sm leading-relaxed text-[var(--text-primary)] mb-6 select-all">
                                {generatedUrl}
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={copyToClipboard}
                                    className={`flex items-center justify-center gap-2 flex-1 border font-mono text-xs font-bold uppercase tracking-widest py-4 px-6 rounded-xl transition-all ${copied
                                            ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white'
                                            : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--text-primary)]'
                                        }`}
                                >
                                    {copied ? <span className="animate-fade-in-up">COPIED [✓]</span> : <><Copy size={16} /> COPY LINK</>}
                                </button>
                                <a
                                    href={generatedUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] font-mono text-xs font-bold uppercase tracking-widest p-4 rounded-xl hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all"
                                >
                                    <ExternalLink size={16} /> TEST
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* History Right Side */}
                <div className="col-span-1">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--text-primary)]">
                                [~] Recent Links
                            </h3>
                            {history.length > 0 && (
                                <button
                                    onClick={clearHistory}
                                    className="text-[var(--text-muted)] hover:text-red-400 transition-colors p-1"
                                    title="Clear History"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>

                        {history.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="font-mono text-[var(--text-muted)] text-[10px] uppercase tracking-widest border border-dashed border-[var(--border-color)] py-6 rounded-xl">
                                    No local history found
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {history.map((item, idx) => {
                                    try {
                                        const urlObj = new URL(item.url)
                                        const dateRaw = new Date(item.date)
                                        const dateStr = dateRaw.toLocaleDateString() + ' ' + dateRaw.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                                        return (
                                            <div key={idx} className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 hover:border-[var(--text-primary)] transition-colors group">
                                                <div className="flex justify-between items-start mb-2 gap-2">
                                                    <div className="truncate text-xs font-medium text-[var(--text-primary)]">
                                                        {urlObj.pathname || '/'}
                                                    </div>
                                                    <div className="text-[10px] text-[var(--text-muted)] whitespace-nowrap">
                                                        {dateStr}
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {['utm_source', 'utm_medium', 'utm_campaign'].map(param => {
                                                        const val = urlObj.searchParams.get(param)
                                                        if (!val) return null
                                                        return (
                                                            <span key={param} className="text-[9px] font-mono tracking-wider uppercase bg-[var(--bg-card)] border border-[var(--border-color)] px-1.5 py-0.5 rounded text-[var(--text-secondary)]">
                                                                {val}
                                                            </span>
                                                        )
                                                    })}
                                                </div>
                                                <button
                                                    onClick={async () => {
                                                        await navigator.clipboard.writeText(item.url)
                                                        alert('Copied to clipboard!')
                                                    }}
                                                    className="w-full text-center text-[10px] uppercase tracking-widest font-mono font-bold text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors py-1"
                                                >
                                                    COPY URL
                                                </button>
                                            </div>
                                        )
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                    } catch (e) {
                                        return null
                                    }
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
