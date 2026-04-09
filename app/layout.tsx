import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "nzt108.dev — Apps, Websites & Bots That Ship Fast",
  description:
    "Full-stack development from idea to launch. Mobile apps, websites, Telegram bots, and SaaS platforms. Fixed pricing, fast delivery, direct communication.",
  keywords: [
    "mobile app developer",
    "web developer",
    "telegram bot developer",
    "saas development",
    "flutter developer",
    "react developer",
    "freelance developer",
    "app development",
  ],
  authors: [{ name: "nzt108.dev" }],
  icons: {
    icon: "/favicon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "nzt108.dev — Apps, Websites & Bots That Ship Fast",
    description:
      "Full-stack development from idea to launch. Fixed pricing, fast delivery.",
    type: "website",
    url: "https://nzt108.dev",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "nzt108.dev — I Build Apps That Make Money",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "nzt108.dev — Apps, Websites & Bots That Ship Fast",
    description: "Full-stack development from idea to launch. Fixed pricing, fast delivery.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0a0e17" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} antialiased`}
      >
        {/* Global Noise Overlay — subtle texture */}
        <svg
          className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.03]"
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

        <AnalyticsTracker />
        <Header />
        <main className="relative z-10 min-h-screen font-sans">
          {children}
        </main>
        <Footer />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
