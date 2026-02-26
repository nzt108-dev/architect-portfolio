import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'

// Dynamic generation for new AI articles
export const dynamic = 'force-dynamic'

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const article = await prisma.article.findUnique({
        where: { slug }
    })

    if (!article) {
        return { title: 'Not Found' }
    }

    return {
        title: article.metaTitle || article.title,
        description: article.metaDescription || article.description,
        keywords: article.keywords,
        openGraph: {
            title: article.metaTitle || article.title,
            description: article.metaDescription || article.description,
            type: 'article',
            publishedTime: article.publishedAt?.toISOString(),
        }
    }
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params
    const article = await prisma.article.findUnique({
        where: { slug },
        include: { topic: true }
    })

    if (!article) {
        notFound()
    }

    // JSON-LD structured data for Google structured data indexing (SEO Standard)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        image: article.imageUrl || 'https://nzt108.dev/logo.jpg',
        datePublished: article.publishedAt?.toISOString(),
        dateModified: article.updatedAt.toISOString(),
        author: [{
            '@type': 'Person',
            name: 'nzt108_dev',
            url: 'https://nzt108.dev/about'
        }]
    }

    return (
        <article className="container mx-auto px-6 py-20 lg:py-32 relative z-10 max-w-4xl">
            {/* Schema.org injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Breadcrumbs */}
            <nav className="flex items-center gap-3 font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-12 border-b border-[var(--border-color)] pb-4">
                <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">ROOT</Link>
                <span className="text-[var(--text-secondary)]">/</span>
                <Link href="/blog" className="hover:text-[var(--text-primary)] transition-colors">ARCHIVE_LOGS</Link>
                <span className="text-[var(--accent-primary)]">/</span>
                <span className="text-[var(--text-primary)] font-bold truncate max-w-[200px] sm:max-w-xs block">
                    {article.slug}
                </span>
            </nav>

            {/* Article Header */}
            <header className="mb-16">
                <div className="flex items-center gap-4 mb-8">
                    <span className="bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--accent-primary)] text-xs font-bold px-3 py-1.5 rounded uppercase tracking-widest">
                        [{article.topic?.name || 'SYSTEM_LOG'}]
                    </span>
                    <time className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">
                        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                    </time>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-[var(--text-primary)] leading-[1.1] mb-8">
                    {article.title}
                </h1>

                <div className="border-l-[3px] border-[var(--accent-primary)] pl-6 py-1">
                    <p className="font-mono text-[var(--text-secondary)] text-lg leading-relaxed">
                        {article.description}
                    </p>
                </div>
            </header>

            {/* Article Content (Rendered HTML from LLM) */}
            <div
                className="prose prose-invert prose-lg max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[var(--text-primary)]
                prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-b prose-h2:border-[var(--border-color)] prose-h2:pb-4
                prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
                prose-p:text-[var(--text-secondary)] prose-p:leading-loose prose-p:font-mono prose-p:text-base
                prose-a:text-[var(--accent-primary)] prose-a:no-underline hover:prose-a:underline
                prose-li:text-[var(--text-secondary)] prose-li:font-mono prose-li:text-base
                prose-strong:text-[var(--text-primary)]
                prose-code:text-[var(--accent-primary)] prose-code:bg-[var(--bg-card)] prose-code:px-2 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-[var(--border-color)]"
                dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Footer / Back Link */}
            <div className="mt-24 pt-8 border-t border-[var(--border-color)] flex justify-between items-center">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-3 font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent-primary)] uppercase tracking-widest transition-colors"
                >
                    <span>{'<'}</span> Return to Archive Logs
                </Link>
                <div className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
                    EOF
                </div>
            </div>
        </article>
    )
}
