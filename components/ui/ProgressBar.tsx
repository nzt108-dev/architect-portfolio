interface ProgressBarProps {
    progress: number;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
    color?: 'cyan' | 'pink' | 'purple' | 'gradient';
}

export default function ProgressBar({
    progress,
    showLabel = false,
    size = 'md',
    color = 'gradient',
}: ProgressBarProps) {
    const heights = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
    };

    const colors = {
        cyan: 'bg-[var(--neon-cyan)] shadow-[0_0_10px_var(--neon-cyan)]',
        pink: 'bg-[var(--neon-pink)] shadow-[0_0_10px_var(--neon-pink)]',
        purple: 'bg-[var(--neon-purple)] shadow-[0_0_10px_var(--neon-purple)]',
        gradient:
            'bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] shadow-[0_0_10px_var(--neon-cyan)]',
    };

    return (
        <div className="w-full">
            {showLabel && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[var(--text-secondary)]">Progress</span>
                    <span className="text-sm font-semibold text-[var(--neon-cyan)]">
                        {progress}%
                    </span>
                </div>
            )}
            <div className={`w-full bg-[var(--bg-secondary)] rounded-full ${heights[size]} overflow-hidden`}>
                <div
                    className={`${heights[size]} rounded-full ${colors[color]} transition-all duration-1000 ease-out`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
