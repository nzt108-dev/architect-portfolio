const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || ''

interface ContactData {
    name?: string
    email: string
    subject: string
    message: string
    budget?: string
    serviceType?: string
}

/** Send raw HTML message to Telegram */
async function sendTelegramMessage(text: string): Promise<void> {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn('[Telegram] Bot token or chat ID not configured, skipping notification')
        return
    }

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text,
                parse_mode: 'HTML',
            }),
        })

        const result = await res.json()
        if (!res.ok) {
            console.error('[Telegram] API error:', JSON.stringify(result))
        }
    } catch (error) {
        console.error('[Telegram] Failed to send notification:', error)
    }
}

/** Notify about new contact form submission */
export async function sendTelegramNotification(data: ContactData): Promise<void> {
    const lines = [
        '🔔 <b>New Lead from nzt108.dev</b>',
        '',
        `👤 <b>Name:</b> ${esc(data.name || 'Not provided')}`,
        `📧 <b>Email:</b> ${esc(data.email)}`,
        `📋 <b>Subject:</b> ${esc(data.subject)}`,
    ]

    if (data.serviceType) lines.push(`🛠 <b>Service:</b> ${esc(data.serviceType)}`)
    if (data.budget) lines.push(`💰 <b>Budget:</b> ${esc(data.budget)}`)
    lines.push('', `💬 <b>Message:</b>`, esc(data.message))

    await sendTelegramMessage(lines.join('\n'))
}

/** Notify about lead status change */
export async function notifyLeadStatusChange(name: string, email: string, oldStatus: string, newStatus: string, dealValue?: number): Promise<void> {
    const icons: Record<string, string> = {
        contacted: '📧', qualified: '⭐', proposal: '📄', won: '🎉', lost: '❌', archived: '🗄️'
    }
    const icon = icons[newStatus] || '📋'

    const lines = [
        `${icon} <b>Lead Status Changed</b>`,
        '',
        `👤 <b>${esc(name)}</b> (${esc(email)})`,
        `📊 ${esc(oldStatus)} → <b>${esc(newStatus)}</b>`,
    ]

    if (newStatus === 'won' && dealValue && dealValue > 0) {
        lines.push(`💰 <b>Deal Value:</b> $${dealValue.toLocaleString()}`)
    }

    await sendTelegramMessage(lines.join('\n'))
}

/** Notify about overdue tasks */
export async function notifyOverdueTasks(tasks: { title: string; dueDate: string; project: string }[]): Promise<void> {
    if (tasks.length === 0) return

    const lines = [
        `⚠️ <b>${tasks.length} Overdue Task${tasks.length > 1 ? 's' : ''}</b>`,
        '',
        ...tasks.map(t => `• ${esc(t.title)} (${esc(t.project)}) — due ${esc(t.dueDate)}`)
    ]

    await sendTelegramMessage(lines.join('\n'))
}

/** Escape HTML special characters */
function esc(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
}
