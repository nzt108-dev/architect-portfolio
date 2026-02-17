/**
 * Gradient SVG Icons — Lucide-inspired, with indigo→purple gradient fills.
 * Used across WhyChooseMe, ProcessSteps, Services preview, and other sections.
 */

interface GradientIconProps {
    name: string
    size?: number
    className?: string
    gradientId?: string
}

export default function GradientIcon({ name, size = 28, className = '' }: GradientIconProps) {
    const id = `grad-${name}`

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <defs>
                <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent-primary)" />
                    <stop offset="100%" stopColor="var(--accent-secondary)" />
                </linearGradient>
            </defs>
            <g stroke={`url(#${id})`}>
                {getIconPath(name)}
            </g>
        </svg>
    )
}

function getIconPath(name: string) {
    switch (name) {
        // ── WhyChooseMe icons ──
        case 'zap':
            return <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        case 'piggy-bank':
            return (
                <>
                    <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.4-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2" />
                    <path d="M2 9v1c0 1.1.9 2 2 2h1" />
                    <path d="M16 11h.01" />
                </>
            )
        case 'message-circle':
            return <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
        case 'search':
            return (
                <>
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </>
            )

        // ── ProcessSteps icons ──
        case 'phone':
            return (
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            )
        case 'clipboard-list':
            return (
                <>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <path d="M12 11h4" />
                    <path d="M12 16h4" />
                    <path d="M8 11h.01" />
                    <path d="M8 16h.01" />
                </>
            )
        case 'code':
            return (
                <>
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                </>
            )
        case 'rocket':
            return (
                <>
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                </>
            )

        // ── Services icons ──
        case 'smartphone':
            return (
                <>
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <path d="M12 18h.01" />
                </>
            )
        case 'globe':
            return (
                <>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </>
            )
        case 'bot':
            return (
                <>
                    <path d="M12 8V4H8" />
                    <rect x="4" y="8" width="16" height="12" rx="2" />
                    <path d="M2 14h2" />
                    <path d="M20 14h2" />
                    <path d="M15 13v2" />
                    <path d="M9 13v2" />
                </>
            )
        case 'briefcase':
            return (
                <>
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </>
            )
        case 'server':
            return (
                <>
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                    <path d="M6 6h.01" />
                    <path d="M6 18h.01" />
                </>
            )

        // ── FAQ / other icons ──
        case 'help-circle':
            return (
                <>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                </>
            )
        case 'chevron-down':
            return <polyline points="6 9 12 15 18 9" />

        default:
            // Fallback — generic circle
            return <circle cx="12" cy="12" r="10" />
    }
}
