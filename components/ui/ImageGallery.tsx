'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface ImageGalleryProps {
    images: string[]
    title: string
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {images.map((url, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedImage(url)}
                        className="block w-full rounded-2xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-primary)] p-4 hover:border-[var(--accent-primary)] transition-colors group flex items-center justify-center cursor-zoom-in"
                        aria-label={`View enlarged screenshot ${i + 1}`}
                    >
                        <img
                            src={url}
                            alt={`${title} Interface ${i + 1}`}
                            className="w-full h-auto max-h-[50vh] object-contain grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
                        />
                    </button>
                ))}
            </div>

            {/* Lightbox / Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-sm"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white hover:text-[var(--accent-primary)] transition-colors p-2 bg-black/50 rounded-full"
                        onClick={(e) => {
                            e.stopPropagation()
                            setSelectedImage(null)
                        }}
                    >
                        <X size={24} />
                    </button>

                    <img
                        src={selectedImage}
                        alt="Enlarged screenshot"
                        className="w-auto h-auto max-w-full max-h-[90vh] object-contain rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    )
}
