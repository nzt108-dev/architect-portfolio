# NZT108 | High-Performance Architecture

The `nzt108.dev` portfolio is a cinematic, highly-optimized digital instrument built for lead generation, performance tracking, and autonomous SEO growth.

## Architecture & Stack
- **Framework**: Next.js 15 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4, GSAP 3 (ScrollTrigger), custom inline SVG Noise (`<feTurbulence>`)
- **Database**: Turso (LibSQL) + Prisma ORM
- **Aesthetic**: **Dark Brutalist Signal** (Raw precision, heavy contrast, monospace data)

## Core Capabilities

### 1. Global Performance UI
- 100dvh cinematic Hero section with immersive scrolling.
- Global SVG noise filter at `0.05` opacity to remove flat digital gradients.
- GSAP-powered micro-interactions and scroll-linked reveals.

### 2. Marketing & Tracking Infrastructure
- **Meta Pixel**: Integrated globally for raw conversion tracking (`PageView`, `Lead`, `Contact`).
- **UTM Engine**: Custom admin `/admin/analytics/utm` link generator for tracking ad campaign efficacy.

### 3. AI SEO Autopilot Engine
An autonomous content pipeline deployed via Vercel Cron Jobs.
- Parses tech news via RSS natively at the Edge.
- Triggers **Claude 3.5 Haiku** via `OpenRouter` to generate 100% unique, Dark Brutalist SEO articles.
- Formats and injects data directly into the SQLite database.
- Renders highly structured Semantic HTML at `/blog/[slug]`, injecting Google-friendly Schema.org JSON-LD definitions.

### 4. Admin Command Center
A secure dashboard (`/admin`) to manage Projects, Services, Content, and review the autonomous Blog generation telemetry.

---
*Built for extreme reliability, deep analytics, and uncompromising aesthetics.*
