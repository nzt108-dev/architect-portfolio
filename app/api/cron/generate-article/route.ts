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
const AI_MODEL = 'anthropic/claude-haiku-4.5'

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

STRICT FORMATTING RULES — FOLLOW EXACTLY:

1. The "content" field MUST be rich semantic HTML. You MUST use these HTML tags:
   - <h2> for major section headings (use 4-6 of these throughout the article)
   - <h3> for subsection headings within a section
   - <p> for every paragraph (NEVER write text outside of tags)
   - <ul> and <li> for bulleted lists (use at least 2-3 lists)
   - <strong> for emphasis on key terms
   - <blockquote> for notable quotes or key takeaways

2. NEVER write plain text without HTML tags. Every piece of text must be inside <p>, <li>, <h2>, <h3>, or <blockquote>.

3. Use short paragraphs (max 3-4 sentences per <p> tag).

4. Write in a precise, professional tone — no generic fluff, focus on data, architecture, or business impact.

5. CRITICAL: The content field must be a single-line JSON string. Escape all newlines as \\n. Escape all internal double quotes as \\".

6. Generate compelling SEO Metadata (Title max 60 chars, Description max 160 chars).

EXAMPLE of what the "content" field should look like (structure, not topic):
"<p>Opening paragraph introducing the topic with a compelling hook.</p><h2>Why This Matters</h2><p>Explanation paragraph with context and data points.</p><ul><li><strong>Key Point 1:</strong> Description of the first important aspect.</li><li><strong>Key Point 2:</strong> Description of the second important aspect.</li><li><strong>Key Point 3:</strong> Description of the third important aspect.</li></ul><h2>Technical Architecture</h2><p>Deep dive paragraph.</p><h3>Core Components</h3><p>Details about the system.</p><h2>Business Impact</h2><p>Metrics and outcomes.</p><blockquote><p>A key takeaway or notable insight.</p></blockquote><h2>Looking Ahead</h2><p>Conclusion with forward-looking perspective.</p>"

You MUST return the output ONLY as a raw JSON object (no markdown code blocks, no other text):
{
  "title": "Engaging, SEO-optimized H1 Title",
  "slug": "url-friendly-slug-format",
  "metaTitle": "SEO Title | Max 60 chars",
  "metaDescription": "Compelling meta description | Max 160 chars",
  "keywords": "comma, separated, list, of, keywords",
  "content": "<p>FULL HTML article here with <h2>, <h3>, <p>, <ul>, <li>, <strong>, <blockquote> tags as shown above.</p>"
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
