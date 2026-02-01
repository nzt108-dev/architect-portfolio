import { prisma } from '@/lib/prisma'
import { MarkAsReadButton } from './MarkAsReadButton'

export const dynamic = 'force-dynamic'

export default async function AdminMessagesPage() {
    const messages = await prisma.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Messages ({messages.length})</h1>

            {messages.length === 0 ? (
                <div className="cyber-card p-12 text-center text-[var(--text-muted)]">
                    No messages received yet
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`cyber-card p-6 ${!msg.read ? 'border-[var(--neon-cyan)]/50' : ''}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        {!msg.read && (
                                            <span className="px-2 py-0.5 rounded text-xs bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)]">
                                                New
                                            </span>
                                        )}
                                        <h3 className="font-semibold">{msg.name}</h3>
                                    </div>
                                    <p className="text-[var(--text-muted)] text-sm">{msg.email}</p>
                                </div>
                                <div className="text-[var(--text-muted)] text-sm">
                                    {new Date(msg.createdAt).toLocaleString()}
                                </div>
                            </div>

                            <div className="mb-4">
                                <span className="text-[var(--text-secondary)] text-sm">Subject: </span>
                                <span className="font-medium">{msg.subject}</span>
                            </div>

                            <p className="text-[var(--text-secondary)] whitespace-pre-wrap">
                                {msg.message}
                            </p>

                            <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex gap-4">
                                <a
                                    href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                    className="text-[var(--neon-cyan)] text-sm hover:underline"
                                >
                                    ↗ Reply via Email
                                </a>
                                <MarkAsReadButton id={msg.id} read={msg.read} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
