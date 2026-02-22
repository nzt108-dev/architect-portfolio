import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTelegramNotification } from '@/lib/telegram'

// POST /api/contact - Handle contact form submission
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, subject, message, budget, serviceType, utmSource, utmMedium, utmCampaign } = body

        // Validate required fields
        if (!email || !subject || !message) {
            return NextResponse.json(
                { error: 'Email, subject, and message are required' },
                { status: 400 }
            )
        }

        // Save to database
        const submission = await prisma.contactSubmission.create({
            data: {
                name: name || '',
                email,
                subject,
                message,
                budget: budget || '',
                serviceType: serviceType || '',
                utmSource: utmSource || '',
                utmMedium: utmMedium || '',
                utmCampaign: utmCampaign || '',
            },
        })

        // Send Telegram notification
        await sendTelegramNotification({ name, email, subject, message, budget, serviceType })

        return NextResponse.json(
            { message: 'Message sent successfully', id: submission.id },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error saving contact submission:', error)
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        )
    }
}

// GET /api/contact - Get all contact submissions (for admin)
export async function GET() {
    try {
        const submissions = await prisma.contactSubmission.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(submissions)
    } catch (error) {
        console.error('Error fetching submissions:', error)
        return NextResponse.json(
            { error: 'Failed to fetch submissions' },
            { status: 500 }
        )
    }
}
