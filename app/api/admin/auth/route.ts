import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret'

// Simple hash for session token
function createSessionToken(): string {
    const timestamp = Date.now().toString()
    const data = `${SESSION_SECRET}-${timestamp}`
    // Simple base64 encoding for demo (use proper crypto in production)
    return Buffer.from(data).toString('base64')
}

export function validateSession(token: string): boolean {
    try {
        const decoded = Buffer.from(token, 'base64').toString()
        return decoded.startsWith(SESSION_SECRET)
    } catch {
        return false
    }
}

// POST /api/admin/auth - Login
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { password } = body

        if (password !== ADMIN_PASSWORD) {
            return NextResponse.json(
                { error: 'Invalid password' },
                { status: 401 }
            )
        }

        const token = createSessionToken()
        const cookieStore = await cookies()

        cookieStore.set('admin_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Auth error:', error)
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        )
    }
}

// DELETE /api/admin/auth - Logout
export async function DELETE() {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    return NextResponse.json({ success: true })
}

// GET /api/admin/auth - Check session
export async function GET() {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_session')?.value

    if (!token || !validateSession(token)) {
        return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true })
}
