import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "BriefTube AI — YouTube Content Tracker with AI Summaries",
    description:
        "BriefTube AI helps you track YouTube channels and get AI-powered summaries of videos. Import your subscriptions, add channels manually, and never miss important content.",
};

export default function BriefTubeLanding() {
    return (
        <div className="min-h-screen bg-[#0A0A14] text-white">
            {/* Hero Section */}
            <header className="mx-auto max-w-4xl px-6 pt-20 pb-16 text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Available on iOS
                </div>

                <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
                    <span className="bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                        BriefTube AI
                    </span>
                </h1>

                <p className="mx-auto mb-4 max-w-2xl text-xl text-white/70 leading-relaxed">
                    Your intelligent YouTube companion. Track channels, import subscriptions,
                    and get <strong className="text-white">AI-powered summaries</strong> of any video —
                    so you never miss what matters.
                </p>

                <p className="mx-auto mb-10 max-w-xl text-sm text-white/40">
                    BriefTube AI uses your YouTube account (read-only) to import your
                    subscriptions and deliver personalized content summaries powered by
                    advanced AI models.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <a
                        href="#features"
                        className="rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-8 py-3 font-bold text-white text-lg shadow-lg shadow-red-500/20 transition hover:shadow-red-500/40 hover:scale-[1.02]"
                    >
                        Learn More
                    </a>
                    <a
                        href="mailto:nzt108@gmail.com"
                        className="rounded-xl border border-white/10 bg-white/5 px-8 py-3 font-semibold text-white/80 transition hover:bg-white/10"
                    >
                        Contact Us
                    </a>
                </div>
            </header>

            {/* Features */}
            <section id="features" className="mx-auto max-w-5xl px-6 py-16">
                <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
                    What BriefTube AI Does
                </h2>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            icon: "📺",
                            title: "Import Subscriptions",
                            desc: "Connect your YouTube account and import all your channel subscriptions in one tap. We only read your subscription list — never modify anything.",
                        },
                        {
                            icon: "➕",
                            title: "Add Channels & Videos",
                            desc: "Manually add any YouTube channel by @handle or URL. Paste a single video link to get an instant AI summary.",
                        },
                        {
                            icon: "🤖",
                            title: "AI Summaries",
                            desc: "Get intelligent summaries of YouTube videos powered by advanced language models. Key takeaways, chapters, and insights — in seconds.",
                        },
                        {
                            icon: "📊",
                            title: "Smart Feed",
                            desc: "Your personalized video feed from tracked channels, organized by recency. Never miss important content from creators you follow.",
                        },
                        {
                            icon: "🔒",
                            title: "Privacy First",
                            desc: "Your data is encrypted and isolated. Row-Level Security ensures only you can access your content. Delete everything anytime from Settings.",
                        },
                        {
                            icon: "⚡",
                            title: "Credit System",
                            desc: "Flexible credit-based pricing. Get free credits to start, then purchase more or subscribe for unlimited summaries.",
                        },
                    ].map((f) => (
                        <div
                            key={f.title}
                            className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 transition hover:border-white/10 hover:bg-white/[0.05]"
                        >
                            <div className="mb-3 text-3xl">{f.icon}</div>
                            <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                            <p className="text-sm leading-relaxed text-white/50">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* YouTube API Usage */}
            <section className="mx-auto max-w-3xl px-6 py-16">
                <h2 className="mb-6 text-2xl font-bold tracking-tight text-center">
                    How We Use YouTube Data
                </h2>
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8 text-white/60 leading-relaxed space-y-4">
                    <p>
                        BriefTube AI requests <strong className="text-white/80">read-only access</strong> to
                        your YouTube account through the{" "}
                        <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-orange-300">
                            youtube.readonly
                        </code>{" "}
                        scope. This allows us to:
                    </p>
                    <ul className="list-disc space-y-2 pl-6">
                        <li>Import your YouTube channel subscriptions</li>
                        <li>Display channels you follow within the app</li>
                        <li>Fetch publicly available video metadata for AI analysis</li>
                    </ul>
                    <p>
                        We <strong className="text-white/80">never</strong> post, delete, or modify
                        any content on your YouTube account. We only read publicly available
                        subscription and video information. You can disconnect your YouTube
                        account at any time from the app&apos;s Settings page.
                    </p>
                </div>
            </section>

            {/* Legal Footer */}
            <footer className="border-t border-white/5 py-12">
                <div className="mx-auto max-w-4xl px-6">
                    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
                        <div>
                            <p className="text-lg font-bold">BriefTube AI</p>
                            <p className="text-sm text-white/40">
                                YouTube content tracker with AI summaries
                            </p>
                        </div>

                        <div className="flex gap-6 text-sm">
                            <Link
                                href="/brieftube/privacy"
                                className="text-white/50 transition hover:text-white"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/brieftube/terms"
                                className="text-white/50 transition hover:text-white"
                            >
                                Terms of Service
                            </Link>
                            <a
                                href="mailto:nzt108@gmail.com"
                                className="text-white/50 transition hover:text-white"
                            >
                                Contact
                            </a>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-xs text-white/20">
                        © {new Date().getFullYear()} BriefTube AI. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
