'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Skip auth check on login page
        if (pathname === '/admin/login') {
            setTimeout(() => setIsAuthenticated(true), 0)
            return
        }

        // Check authentication
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

    const handleLogout = async () => {
        await fetch('/api/admin/auth', { method: 'DELETE' })
        router.push('/admin/login')
    }

    // Show loading while checking auth
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-[var(--neon-cyan)] animate-pulse">Loading...</div>
            </div>
        )
    }

    // Login page doesn't need the admin wrapper
    if (pathname === '/admin/login') {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[var(--bg-card)] border-r border-[var(--border-color)] p-6 flex flex-col">
                <div className="mb-8">
                    <Link href="/admin" className="text-xl font-bold gradient-text">
                        Admin Panel
                    </Link>
                </div>

                <nav className="flex-grow space-y-2">
                    <NavLink href="/admin" icon="📊">
                        Dashboard
                    </NavLink>
                    <NavLink href="/admin/projects" icon="📁">
                        Projects
                    </NavLink>
                    <NavLink href="/admin/skills" icon="⚡">
                        Skills
                    </NavLink>
                    <NavLink href="/admin/contacts" icon="📇">
                        Contacts
                    </NavLink>
                    <NavLink href="/admin/messages" icon="✉️">
                        Messages
                    </NavLink>
                    <NavLink href="/admin/activity" icon="📋">
                        Activity
                    </NavLink>
                    <NavLink href="/admin/workspaces" icon="🖥️">
                        Workspaces
                    </NavLink>
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
            <main className="flex-grow p-8 overflow-auto">
                {children}
            </main>
        </div>
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
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                ? 'bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/30'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
                }`}
        >
            <span>{icon}</span>
            <span className="font-medium">{children}</span>
        </Link>
    )
}
