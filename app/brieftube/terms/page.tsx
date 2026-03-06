import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service — BriefTube AI",
    description: "Terms of Service for BriefTube AI - YouTube content tracker with AI summaries",
};

export default function TermsOfService() {
    return (
        <div className="mx-auto max-w-3xl px-6 py-16">
            <h1 className="mb-2 font-sans text-4xl font-bold tracking-tight text-[var(--color-text)]">
                Terms of Service
            </h1>
            <p className="mb-10 font-mono text-sm text-[var(--color-text-secondary)]">
                BriefTube AI · Last updated: March 2026
            </p>

            <div className="space-y-8 text-[var(--color-text-secondary)] leading-relaxed">
                <section>
                    <h2 className="mb-3 font-sans text-xl font-semibold text-[var(--color-text)]">1. Acceptance</h2>
                    <p>By using BriefTube AI, you agree to these Terms of Service.</p>
                </section>

                <section>
                    <h2 className="mb-3 font-sans text-xl font-semibold text-[var(--color-text)]">2. Account</h2>
                    <p>
                        You must sign in with Apple or Google to use the app. You are responsible for maintaining the security of your account.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 font-sans text-xl font-semibold text-[var(--color-text)]">3. Credits &amp; Subscriptions</h2>
                    <ul className="list-disc space-y-1 pl-6">
                        <li>Free accounts receive 50 credits.</li>
                        <li>Pro and Power subscriptions provide monthly credits and additional features.</li>
                        <li>Credits are used for AI video analysis. Costs vary by video length.</li>
                        <li>Credit packs are available for subscribers only.</li>
                        <li>Unused credits carry over month to month.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-3 font-sans text-xl font-semibold text-[var(--color-text)]">4. Subscriptions</h2>
                    <ul className="list-disc space-y-1 pl-6">
                        <li>Subscriptions auto-renew monthly or yearly.</li>
                        <li>You can cancel anytime via iPhone Settings → Apple ID → Subscriptions.</li>
                        <li>No partial refunds for the current billing period.</li>
                        <li>Refunds are handled by Apple at reportaproblem.apple.com.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-3 font-sans text-xl font-semibold text-[var(--color-text)]">5. Acceptable Use</h2>
                    <p>You agree not to:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-6">
                        <li>Use the app for illegal purposes.</li>
                        <li>Attempt to reverse-engineer or exploit the service.</li>
                        <li>Create multiple accounts to abuse free credits.</li>
                        <li>Scrape or redistribute AI-generated summaries at scale.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-3 font-sans text-xl font-semibold text-[var(--color-text)]">6. Intellectual Property</h2>
                    <p>
                        AI summaries are generated for your personal use. The original video content belongs to its creators.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 font-sans text-xl font-semibold text-[var(--color-text)]">7. Limitation of Liability</h2>
                    <p>
                        BriefTube AI is provided &quot;as is&quot;. We are not responsible for the accuracy of AI-generated summaries
                        or for any decisions made based on them.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 font-sans text-xl font-semibold text-[var(--color-text)]">8. Account Deletion</h2>
                    <p>
                        You may delete your account at any time from Settings. All data will be permanently removed.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 font-sans text-xl font-semibold text-[var(--color-text)]">9. Changes</h2>
                    <p>We may update these terms. Continued use constitutes acceptance.</p>
                </section>

                <section>
                    <h2 className="mb-3 font-sans text-xl font-semibold text-[var(--color-text)]">10. Contact</h2>
                    <p>
                        For questions, contact us at{" "}
                        <a href="mailto:nzt108@gmail.com" className="text-[var(--color-accent)] hover:underline">
                            nzt108@gmail.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}
