import { NextResponse } from 'next/server'
import Parser from 'rss-parser'
import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'

// Configuration for serverless (allow up to 5 mins for LLM generation)
export const dynamic = 'force-dynamic'
export const maxDuration = 300

// RSS Feeds to monitor
const RSS_FEEDS = [
    'https://techcrunch.com/feed/',
    'https://news.ycombinator.com/rss',
]

// Initialize OpenAI client for OpenRouter
// We use a fallback dummy key during build time to prevent Vercel build failures
const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY || 'dummy-key-for-build',
})

// Default AI Model (Claude 3.5 Haiku is excellent for fast, cheap, high-quality text)
const AI_MODEL = 'anthropic/claude-3-haiku'

export async function GET(req: Request) {
    try {
        // Recommended Security Check for Vercel Cron Jobs
        const authHeader = req.headers.get('authorization')
        if (
            process.env.CRON_SECRET &&
            authHeader !== `Bearer ${process.env.CRON_SECRET}`
        ) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!process.env.OPENROUTER_API_KEY) {
            return NextResponse.json({ error: 'OPENROUTER_API_KEY is missing' }, { status: 500 })
        }

        // 1. Parse RSS
        const parser = new Parser()
        const feedUrl = RSS_FEEDS[Math.floor(Math.random() * RSS_FEEDS.length)]
        const feed = await parser.parseURL(feedUrl)

        if (!feed.items || feed.items.length === 0) {
            return NextResponse.json({ error: 'No items found in RSS feed' }, { status: 404 })
        }

        // 2. Select a news item we haven't covered yet
        // For simplicity, we just take the first 5 and pick a random one
        const recentItems = feed.items.slice(0, 5)
        const selectedNews = recentItems[Math.floor(Math.random() * recentItems.length)]

        // 3. Generate Article using OpenRouter
        const systemPrompt = `
You are a World-Class SEO Expert and Senior Technology Copywriter.
Your task is to write a highly-optimized, engaging, and structured technical blog post based on recent tech news.

The article MUST follow these STRICT SEO guidelines:
1. Start with an engaging H1 Title (Do not include markdown # formatting in the title field, I will ask for JSON).
2. Use short paragraphs (max 3-4 sentences) for readability.
3. Use proper Semantic HTML structure (H2, H3 tags).
4. Include bulleted lists for scannability.
5. Write in a precise, "Dark Brutalist Signal" professional tone—no generic fluff, focus on data, architecture, or business impact.
6. Generate compelling SEO Metadata (Title max 60 chars, Description max 160 chars).
7. CRITICAL: The \`content\` field must be a valid JSON string. You MUST NOT use raw unescaped newlines. Either escape them as \`\\n\` or write the entire HTML on a single line.
8. CRITICAL: You MUST escape all internal double quotes inside the JSON values using a backslash, e.g. \\". Do NOT use unescaped double quotes in the HTML attributes or text.

You MUST return the output ONLY as a raw JSON object with the following structure (no markdown code blocks, no other text):
{
  "title": "Engaging, SEO-optimized H1 Title",
  "slug": "url-friendly-slug-format",
  "metaTitle": "SEO Title | Max 60 chars",
  "metaDescription": "Compelling meta description | Max 160 chars",
  "keywords": "comma, separated, list, of, keywords",
  "content": "<p>Your full HTML formatted article content here, using <h2>, <h3>, <ul>, <li>, <p>, <strong> tags. EXACTLY ONE LINE OF STRING.</p>"
}
`
        const userPrompt = `News Source Title: ${selectedNews.title}\nNews Source Snippet/Link: ${selectedNews.contentSnippet || selectedNews.link}\n\nPlease write a comprehensive article based on this news. If it's just a link, infer the general tech topic or write a thought-leadership piece on that subject.`

        console.log(`🤖 Requesting LLM Generation for: ${selectedNews.title}...`)

        const completion = await openai.chat.completions.create({
            model: AI_MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            response_format: { type: 'json_object' }
        })

        let resultContent = completion.choices[0].message.content
        if (!resultContent) {
            throw new Error("No content received from OpenRouter")
        }

        // Clean potentially invalid JSON (remove markdown blocks if present)
        let jsonStr = resultContent.replace(/```json/g, '').replace(/```/g, '').trim()

        // Robust extraction
        const startIdx = jsonStr.indexOf('{')
        const endIdx = jsonStr.lastIndexOf('}')
        if (startIdx !== -1 && endIdx !== -1) {
            jsonStr = jsonStr.substring(startIdx, endIdx + 1)
        }

        let generatedData;
        try {
            generatedData = JSON.parse(jsonStr)
        } catch (e) {
            console.error("Failed to parse JSON:", jsonStr)
            return NextResponse.json({ error: "LLM did not return valid JSON", rawOutput: jsonStr }, { status: 500 })
        }

        // 4. Save to Database
        // Check if slug already exists to prevent duplicates
        const existingArticle = await prisma.article.findUnique({
            where: { slug: generatedData.slug }
        })

        if (existingArticle) {
            // Append a random string to make it unique
            generatedData.slug = `${generatedData.slug}-${Math.floor(Math.random() * 1000)}`
        }

        const article = await prisma.article.create({
            data: {
                title: generatedData.title,
                slug: generatedData.slug,
                description: generatedData.metaDescription || "News analysis",
                content: generatedData.content,
                metaTitle: generatedData.metaTitle,
                metaDescription: generatedData.metaDescription,
                keywords: generatedData.keywords,
                status: 'PUBLISHED',
                publishedAt: new Date(),
            }
        })

        return NextResponse.json({
            success: true,
            sourceNews: selectedNews.title,
            article: article.slug
        })

    } catch (error: any) {
        console.error("AI Generation Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
