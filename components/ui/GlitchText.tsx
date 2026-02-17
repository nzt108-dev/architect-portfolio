interface GlitchTextProps {
    text: string;
    className?: string;
    glitchOnHover?: boolean;
}

export default function GlitchText({
    text,
    className = '',
}: GlitchTextProps) {
    return (
        <span className={`relative inline-block gradient-text ${className}`}>
            {text}
        </span>
    );
}
