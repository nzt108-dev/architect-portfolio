import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function BlogIndexPage() {
    const articles = await prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        include: { topic: true }
    })

    return (
        <div className="container mx-auto px-6 py-20 lg:py-32 relative z-10 max-w-5xl">
            <div className="mb-16">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
                    Architecture <span className="font-[var(--font-dm-serif)] italic text-[var(--accent-primary)]">Log.</span>
                </h1>
                <p className="text-[var(--text-secondary)] text-xl font-mono uppercase tracking-widest max-w-2xl leading-relaxed">
                    {'//'} Technical insights, engineering decisions, and SaaS development strategies.
                </p>
            </div>

            <div className="flex flex-col gap-8 w-full">
                {articles.length === 0 ? (
                    <div className="p-12 border border-[var(--border-color)] bg-[var(--bg-card)] rounded-3xl text-center">
                        <span className="font-mono text-[var(--text-secondary)] uppercase tracking-widest">NO_ARTIFACTS_FOUND</span>
                    </div>
                ) : (
                    articles.map((article) => (
                        <Link
                            key={article.id}
                            href={`/blog/${article.slug}`}
                            className="group block border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent-primary)] transition-colors rounded-3xl p-8 md:p-10 relative overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                                <div className="space-y-4 max-w-3xl">
                                    <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest border-b border-[var(--border-color)] pb-4 mb-4">
                                        <span className="text-[var(--accent-primary)] font-bold">
                                            {article.topic ? `[${article.topic.name}]` : '[SYSTEM]'}
                                        </span>
                                        <span className="text-[var(--text-muted)]">
                                            {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'UNDEFINED_DATE'}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl md:text-4xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors leading-tight">
                                        {article.title}
                                    </h2>
                                    <p className="text-[var(--text-secondary)] font-mono text-sm leading-relaxed line-clamp-3">
                                        {article.description}
                                    </p>
                                </div>
                                <div className="shrink-0 mt-4 md:mt-0 font-mono text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">READ_LOG {'->'}</span>
                                </div>
                            </div>

                            {/* Hover Tech Effect */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-primary)]/5 rounded-full blur-[50px] group-hover:bg-[var(--accent-primary)]/20 transition-colors pointer-events-none" />
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}
