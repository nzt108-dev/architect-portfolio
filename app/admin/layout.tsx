'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

/* ───── Nav Config ───── */
const BOTTOM_NAV = [
    { href: '/admin', icon: '📊', label: 'Dashboard' },
    { href: '/admin/workspaces', icon: '🖥️', label: 'Workspaces' },
    { href: '/admin/agent-hub', icon: '🤖', label: 'Agent Hub' },
    { href: '/admin/messages', icon: '🔥', label: 'Leads' },
]

const ALL_NAV = [
    { section: null, items: [{ href: '/admin', icon: '📊', label: 'Dashboard' }] },
    {
        section: 'Portfolio',
        items: [
            { href: '/admin/projects', icon: '📁', label: 'Projects' },
            { href: '/admin/skills', icon: '⚡', label: 'Skills' },
        ],
    },
    {
        section: 'Business',
        items: [
            { href: '/admin/messages', icon: '🔥', label: 'Leads' },
            { href: '/admin/crm', icon: '🎯', label: 'CRM' },
            { href: '/admin/calendar', icon: '📅', label: 'Calendar' },
            { href: '/admin/finance', icon: '💰', label: 'Finance' },
        ],
    },
    {
        section: 'AI',
        items: [
            { href: '/admin/agent-hub', icon: '🤖', label: 'Agent Hub' },
        ],
    },
    {
        section: 'Site',
        items: [
            { href: '/admin/analytics', icon: '📈', label: 'Analytics' },
            { href: '/admin/analytics/utm', icon: '🔗', label: 'UTM Generator' },
            { href: '/admin/content', icon: '📝', label: 'Content' },
            { href: '/admin/blog', icon: '🤖', label: 'AI Blog' },
            { href: '/admin/contacts', icon: '📇', label: 'Contacts' },
            { href: '/admin/workspaces', icon: '🖥️', label: 'Workspaces' },
            { href: '/admin/settings', icon: '⚙️', label: 'Settings' },
        ],
    },
]

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const [moreSheetOpen, setMoreSheetOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (pathname === '/admin/login') {
            setTimeout(() => setIsAuthenticated(true), 0)
            return
        }

        fetch('/api/admin/auth')
            .then((res) => {
                if (res.ok) {
                    setIsAuthenticated(true)
                } else {
                    router.push('/admin/login')
                }
            })
            .catch(() => router.push('/admin/login'))
    }, [pathname, router])

    // Close more sheet on navigate
    useEffect(() => {
        setMoreSheetOpen(false)
    }, [pathname])

    const handleLogout = async () => {
        await fetch('/api/admin/auth', { method: 'DELETE' })
        router.push('/admin/login')
    }

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-[var(--neon-cyan)] animate-pulse">Loading...</div>
            </div>
        )
    }

    if (pathname === '/admin/login') {
        return <>{children}</>
    }

    return (
        <>
            <style>{mobileStyles}</style>
            <div className="min-h-screen flex">
                {/* Desktop Sidebar */}
                <aside className="admin-sidebar">
                    <div className="mb-8">
                        <Link href="/admin" className="text-xl font-bold gradient-text">
                            Admin Panel
                        </Link>
                    </div>

                    <nav className="flex-grow space-y-1 overflow-y-auto">
                        {ALL_NAV.map((group, i) => (
                            <div key={i}>
                                {group.section && <SectionLabel>{group.section}</SectionLabel>}
                                {group.items.map(item => (
                                    <NavLink key={item.href} href={item.href} icon={item.icon}>
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>
                        ))}
                    </nav>

                    <div className="pt-6 border-t border-[var(--border-color)] space-y-3">
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] transition-colors text-sm"
                        >
                            🌐 View Site
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-red-400 transition-colors text-sm w-full"
                        >
                            🚪 Logout
                        </button>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-grow p-4 md:p-8 overflow-auto admin-main">
                    {children}
                </main>

                {/* Mobile Bottom Navigation */}
                <nav className="admin-bottom-nav">
                    {BOTTOM_NAV.map(item => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`admin-bnav-item ${isActive ? 'admin-bnav-item--active' : ''}`}
                            >
                                <span className="admin-bnav-icon">{item.icon}</span>
                                <span className="admin-bnav-label">{item.label}</span>
                            </Link>
                        )
                    })}
                    <button
                        className={`admin-bnav-item ${moreSheetOpen ? 'admin-bnav-item--active' : ''}`}
                        onClick={() => setMoreSheetOpen(!moreSheetOpen)}
                    >
                        <span className="admin-bnav-icon">⚙️</span>
                        <span className="admin-bnav-label">More</span>
                    </button>
                </nav>

                {/* More Sheet Overlay */}
                {moreSheetOpen && (
                    <div className="admin-more-overlay" onClick={() => setMoreSheetOpen(false)}>
                        <div className="admin-more-sheet" onClick={e => e.stopPropagation()}>
                            <div className="admin-more-header">
                                <span className="text-lg font-bold gradient-text">Menu</span>
                                <button
                                    className="admin-more-close"
                                    onClick={() => setMoreSheetOpen(false)}
                                >
                                    ✕
                                </button>
                            </div>
                            <nav className="admin-more-nav">
                                {ALL_NAV.map((group, i) => (
                                    <div key={i}>
                                        {group.section && (
                                            <div className="admin-more-section">{group.section}</div>
                                        )}
                                        {group.items.map(item => {
                                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={`admin-more-link ${isActive ? 'admin-more-link--active' : ''}`}
                                                    onClick={() => setMoreSheetOpen(false)}
                                                >
                                                    <span>{item.icon}</span>
                                                    <span>{item.label}</span>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                ))}
                                <div className="admin-more-footer">
                                    <Link
                                        href="/"
                                        target="_blank"
                                        className="admin-more-link"
                                        onClick={() => setMoreSheetOpen(false)}
                                    >
                                        <span>🌐</span>
                                        <span>View Site</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="admin-more-link admin-more-link--danger"
                                    >
                                        <span>🚪</span>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

function NavLink({
    href,
    icon,
    children,
}: {
    href: string
    icon: string
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isActive = pathname === href || (href !== '/admin' && pathname?.startsWith(href))

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${isActive
                ? 'bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/30'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
                }`}
        >
            <span>{icon}</span>
            <span className="font-medium">{children}</span>
        </Link>
    )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="pt-4 pb-1 px-4">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]/60">
                {children}
            </span>
        </div>
    )
}

/* ───── Mobile Styles ───── */
const mobileStyles = `
/* Desktop sidebar — visible on md+ */
.admin-sidebar {
    width: 264px;
    flex-shrink: 0;
    background: var(--bg-card);
    border-right: 1px solid var(--border-color);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
}

/* Bottom nav — hidden by default */
.admin-bottom-nav { display: none; }
.admin-more-overlay { display: none; }

/* Main content */
.admin-main {
    padding-bottom: 1rem;
}

@media (max-width: 767px) {
    /* Hide sidebar on mobile */
    .admin-sidebar { display: none; }
    
    /* Main content needs bottom padding for nav bar */
    .admin-main {
        padding-bottom: calc(64px + env(safe-area-inset-bottom, 0px) + 1rem);
    }

    /* Bottom navigation bar */
    .admin-bottom-nav {
        display: flex;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 50;
        height: calc(64px + env(safe-area-inset-bottom, 0px));
        padding-bottom: env(safe-area-inset-bottom, 0px);
        background: rgba(10, 14, 23, 0.85);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-top: 1px solid rgba(99, 119, 150, 0.15);
        align-items: center;
        justify-content: space-around;
    }

    .admin-bnav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        padding: 8px 12px;
        border-radius: 10px;
        transition: all 0.2s ease;
        color: var(--text-muted);
        text-decoration: none;
        border: none;
        background: none;
        cursor: pointer;
        font-family: inherit;
    }
    .admin-bnav-item--active {
        color: #22d3ee;
    }
    .admin-bnav-icon { font-size: 1.25rem; }
    .admin-bnav-label { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.02em; }

    /* More Sheet Overlay */
    .admin-more-overlay {
        display: flex;
        position: fixed;
        inset: 0;
        z-index: 60;
        background: rgba(0, 0, 0, 0.6);
        align-items: flex-end;
        animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .admin-more-sheet {
        width: 100%;
        max-height: 80vh;
        background: var(--bg-card);
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        padding: 1.25rem;
        padding-bottom: calc(1.25rem + env(safe-area-inset-bottom, 0px));
        overflow-y: auto;
        animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    @keyframes slideUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
    }

    .admin-more-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 0.75rem;
    }
    .admin-more-close {
        width: 32px; height: 32px;
        display: flex; align-items: center; justify-content: center;
        border-radius: 8px; background: var(--bg-secondary);
        border: 1px solid var(--border-color); color: var(--text-muted);
        cursor: pointer; font-size: 0.9rem;
    }

    .admin-more-nav { display: flex; flex-direction: column; gap: 2px; }
    .admin-more-section {
        font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.1em; color: var(--text-muted);
        padding: 12px 12px 4px; opacity: 0.6;
    }
    .admin-more-link {
        display: flex; align-items: center; gap: 12px;
        padding: 12px; border-radius: 10px;
        color: var(--text-secondary); text-decoration: none;
        font-size: 0.9rem; font-weight: 500;
        transition: all 0.15s ease;
        border: none; background: none; width: 100%;
        cursor: pointer; font-family: inherit; text-align: left;
    }
    .admin-more-link:hover,
    .admin-more-link--active {
        background: rgba(34,211,238,0.08);
        color: #22d3ee;
    }
    .admin-more-link--danger { color: #ef4444; }
    .admin-more-link--danger:hover { background: rgba(239,68,68,0.08); }

    .admin-more-footer {
        margin-top: 0.5rem;
        padding-top: 0.5rem;
        border-top: 1px solid var(--border-color);
    }
}

/* Tablet — show sidebar, hide bottom nav */
@media (min-width: 768px) {
    .admin-bottom-nav { display: none !important; }
    .admin-more-overlay { display: none !important; }
}
`
