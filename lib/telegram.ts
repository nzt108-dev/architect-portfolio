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

export async function sendTelegramNotification(data: ContactData): Promise<void> {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn('[Telegram] Bot token or chat ID not configured, skipping notification')
        return
    }

    const lines = [
        '🔔 <b>New Lead from nzt108.dev</b>',
        '',
        `👤 <b>Name:</b> ${esc(data.name || 'Not provided')}`,
        `📧 <b>Email:</b> ${esc(data.email)}`,
        `📋 <b>Subject:</b> ${esc(data.subject)}`,
    ]

    if (data.serviceType) {
        lines.push(`🛠 <b>Service:</b> ${esc(data.serviceType)}`)
    }

    if (data.budget) {
        lines.push(`💰 <b>Budget:</b> ${esc(data.budget)}`)
    }

    lines.push('', `💬 <b>Message:</b>`, esc(data.message))

    const text = lines.join('\n')

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
        } else {
            console.log('[Telegram] Notification sent successfully')
        }
    } catch (error) {
        console.error('[Telegram] Failed to send notification:', error)
    }
}

/** Escape HTML special characters */
function esc(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
}
