'use client';

export default function Background() {
    return (
        <>
            {/* Soft gradient blobs — tech premium feel */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    background: `
                        radial-gradient(ellipse 60% 40% at 10% 0%, rgba(99, 102, 241, 0.12) 0%, transparent 60%),
                        radial-gradient(ellipse 40% 50% at 90% 20%, rgba(139, 92, 246, 0.08) 0%, transparent 60%),
                        radial-gradient(ellipse 50% 40% at 50% 100%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
                        radial-gradient(ellipse 30% 30% at 70% 60%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
                    `,
                }}
            />
        </>
    );
}
