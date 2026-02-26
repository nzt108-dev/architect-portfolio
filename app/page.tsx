import Link from 'next/link'
import { getFeaturedProjects } from '@/lib/queries'
import ProjectCard from '@/components/ui/ProjectCard'
import GlitchText from '@/components/ui/GlitchText'
import HeroV2 from '@/components/ui/HeroV2'
import QuickPricing from '@/components/ui/QuickPricing'
import ProcessSteps from '@/components/ui/ProcessSteps'
import ComparisonTable from '@/components/ui/ComparisonTable'
import FAQ from '@/components/ui/FAQ'
import LeadCaptureWidget from '@/components/ui/LeadCaptureWidget'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const featuredProjects = await getFeaturedProjects()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Cinematic Hero Section Variant 2 - 100dvh */}
      <HeroV2 />

      {/* Main Content Container */}
      <div className="container mx-auto px-6 relative z-10 bg-[var(--bg-primary)] pt-20">

        {/* Quick Pricing Infographic */}
        <QuickPricing />

        {/* Featured Projects - Restored and Brutalist */}
        <section className="py-16 border-t border-[var(--border-color)] mt-12">
          <div className="mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter">
              Featured <span className="font-[var(--font-dm-serif)] italic text-[var(--accent-primary)]">Artifacts.</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-xl font-mono uppercase tracking-widest">
              {'//'} Deployed systems & case studies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/projects" className="cyber-btn flex inline-flex items-center justify-center uppercase tracking-widest text-sm px-8 py-4">
              View All Case Studies →
            </Link>
          </div>
        </section>

        {/* How It Works */}
        <ProcessSteps />

        {/* Comparison */}
        <div className="py-20">
          <ComparisonTable />
        </div>

        {/* FAQ */}
        <FAQ />

        {/* CTA Section with Lead Capture */}
        <section className="py-32 border-t border-[var(--border-color)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-6xl md:text-7xl font-bold mb-8 leading-[0.9] tracking-tighter">
                Execute <br />
                <span className="font-[var(--font-dm-serif)] italic text-[var(--accent-primary)]">Launch.</span>
              </h2>
              <p className="text-[var(--text-secondary)] text-xl mb-10 font-mono">
                {'>'} Whether it&apos;s a mobile app, bot, or SaaS — let&apos;s architect your system.
              </p>
              <ul className="space-y-4 text-[var(--text-primary)] font-mono">
                <li className="flex items-center gap-4">
                  <span className="text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 p-1 rounded">✓</span>
                  [01] Free architectural estimate
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 p-1 rounded">✓</span>
                  [02] Zero upfront telemetry
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 p-1 rounded">✓</span>
                  [03] Transparent resource allocation
                </li>
              </ul>
            </div>

            <div className="bg-[var(--bg-card)] p-8 rounded-[2rem] border border-[var(--border-color)] shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
              <LeadCaptureWidget />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
