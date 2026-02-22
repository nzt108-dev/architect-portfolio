import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Background from "@/components/layout/Background";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Background />
        <AnalyticsTracker />
        <Header />
        <main className="relative z-10 min-h-screen pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
