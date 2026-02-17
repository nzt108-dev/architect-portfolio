'use client';

export default function Background() {
    return (
        <>
            {/* Gradient mesh background */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    background: `
                        radial-gradient(ellipse 80% 50% at 20% 40%, rgba(99, 102, 241, 0.08) 0%, transparent 70%),
                        radial-gradient(ellipse 60% 40% at 80% 20%, rgba(139, 92, 246, 0.06) 0%, transparent 70%),
                        radial-gradient(ellipse 50% 60% at 60% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 70%)
                    `,
                }}
            />
            {/* Subtle grid */}
            <div className="fixed inset-0 pointer-events-none z-0 premium-grid opacity-40" />
        </>
    );
}
