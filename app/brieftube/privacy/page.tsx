import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy — BriefTube AI",
    description: "Privacy Policy for BriefTube AI - YouTube content tracker with AI summaries",
};

export default function PrivacyPolicy() {
    return (
        <div className="mx-auto max-w-3xl px-6 py-16">
            <h1 className="mb-2 font-sans text-4xl font-bold tracking-tight text-[var(--color-text)]">
                Privacy Policy
            </h1>
            <p className="mb-10 font-mono text-sm text-[var(--color-text-secondary)]">
                BriefTube AI · Last updated: March 2026
            </p>

            <div className="space-y-8 text-[var(--color-text-secondary)] leading-relaxed">
                <section>
                    <h2 className="mb-3 font-sans text-xl font-semibold text-[var(--color-text)]">1. Information We Collect</h2>
                    <p>When you use BriefTube AI, we collect:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-6">
                        <li><strong>Account information:</strong> Your name and email address (via Apple or Google Sign-In).</li>
                        <li><strong>YouTube channel data:</strong> Your subscribed channels and publicly available video metadata (titles, descriptions, publish dates).</li>
                        <li><strong>Usage data:</strong> Credit usage, app interactions, and purchase history.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-3 font-sans text-xl font-semibold text-[var(--color-text)]">2. How We Use Your Information</h2>
                    <ul className="list-disc space-y-1 pl-6">
                        <li>To provide AI-powered video summaries using third-party language models.</li>
                        <li>To manage your account, credits, and subscription.</li>
                        <li>To improve the app experience and fix bugs.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-3 font-sans text-xl font-semibold text-[var(--color-text)]">3. AI Processing</h2>
                    <p>
                        Video descriptions and metadata are sent to AI services (via OpenRouter) to generate summaries.
                        We do not send your personal information to AI providers — only publicly available video metadata.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 font-sans text-xl font-semibold text-[var(--color-text)]">4. Third-Party Services</h2>
                    <p>We use the following services:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-6">
                        <li><strong>Supabase</strong> — Database and authentication</li>
                        <li><strong>Google</strong> — OAuth sign-in and YouTube API</li>
                        <li><strong>Apple</strong> — Sign-in and in-app purchases</li>
                        <li><strong>OpenRouter</strong> — AI model access for summaries</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-3 font-sans text-xl font-semibold text-[var(--color-text)]">5. Data Storage &amp; Security</h2>
                    <p>
                        Your data is stored securely on Supabase servers with encryption at rest and in transit.
                        We use Row Level Security to ensure users can only access their own data.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 font-sans text-xl font-semibold text-[var(--color-text)]">6. Data Retention &amp; Deletion</h2>
                    <p>
                        You can delete your account at any time from Settings. This permanently removes all your data,
                        including profile, channels, transactions, and summaries.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 font-sans text-xl font-semibold text-[var(--color-text)]">7. Children&apos;s Privacy</h2>
                    <p>
                        BriefTube AI is not intended for children under 13. We do not knowingly collect personal information from children.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 font-sans text-xl font-semibold text-[var(--color-text)]">8. Changes</h2>
                    <p>We may update this policy. Continued use of the app after changes constitutes acceptance.</p>
                </section>

                <section>
                    <h2 className="mb-3 font-sans text-xl font-semibold text-[var(--color-text)]">9. Contact</h2>
                    <p>
                        For privacy questions, contact us at{" "}
                        <a href="mailto:nzt108@gmail.com" className="text-[var(--color-accent)] hover:underline">
                            nzt108@gmail.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}
