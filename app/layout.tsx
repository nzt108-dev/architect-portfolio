import type { Metadata } from "next";
import { Space_Grotesk, DM_Serif_Display, Space_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Background from "@/components/layout/Background";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  style: "italic",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "nzt108_dev | Software Architect",
  description: "Building digital futures, one architecture at a time. Portfolio of software architecture projects including mobile apps, Telegram bots, and web services.",
  keywords: ["software architect", "portfolio", "next.js", "flutter", "telegram bot", "web development"],
  authors: [{ name: "nzt108_dev" }],
  icons: {
    icon: "/favicon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "nzt108_dev | Software Architect",
    description: "Building digital futures, one architecture at a time.",
    type: "website",
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${dmSerifDisplay.variable} ${spaceMono.variable} antialiased`}
      >
        {/* Global Noise Overlay */}
        <svg
          className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.05]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>

        <Background />
        <AnalyticsTracker />
        <Header />
        <main className="relative z-10 min-h-screen pt-24 font-sans">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
