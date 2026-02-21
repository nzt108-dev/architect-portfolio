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
        console.warn('Telegram bot token or chat ID not configured, skipping notification')
        return
    }

    const lines = [
        '🔔 *New Lead from nzt108.dev*',
        '',
        `👤 *Name:* ${escapeMarkdown(data.name || 'Not provided')}`,
        `📧 *Email:* ${escapeMarkdown(data.email)}`,
        `📋 *Subject:* ${escapeMarkdown(data.subject)}`,
    ]

    if (data.serviceType) {
        lines.push(`🛠 *Service:* ${escapeMarkdown(data.serviceType)}`)
    }

    if (data.budget) {
        lines.push(`💰 *Budget:* ${escapeMarkdown(data.budget)}`)
    }

    lines.push('', `💬 *Message:*`, escapeMarkdown(data.message))

    const text = lines.join('\n')

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text,
                parse_mode: 'MarkdownV2',
            }),
        })

        if (!res.ok) {
            const err = await res.text()
            console.error('Telegram API error:', err)
        }
    } catch (error) {
        console.error('Failed to send Telegram notification:', error)
    }
}

function escapeMarkdown(text: string): string {
    return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1')
}
