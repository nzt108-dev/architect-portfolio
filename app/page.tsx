import Link from 'next/link'
import { getFeaturedProjects } from '@/lib/queries'
import ProjectCard from '@/components/ui/ProjectCard'
import GlitchText from '@/components/ui/GlitchText'
import HeroAvatar from '@/components/ui/HeroAvatar'
import QuickPricing from '@/components/ui/QuickPricing'
import ProcessSteps from '@/components/ui/ProcessSteps'
import ComparisonTable from '@/components/ui/ComparisonTable'
import FAQ from '@/components/ui/FAQ'
import LeadCaptureWidget from '@/components/ui/LeadCaptureWidget'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const featuredProjects = await getFeaturedProjects()

  return (
    <div className="container mx-auto px-6">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col justify-center py-10 lg:py-20">
        {/* Background Grid & ambient glow */}
        <div className="absolute inset-0 premium-grid opacity-30 z-0 pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[15rem] h-[15rem] md:w-[30rem] md:h-[30rem] bg-white opacity-[0.02] blur-[100px] rounded-full pointer-events-none z-0" />

        {/* Mobile Avatar */}
        <div className="lg:hidden flex justify-center mb-[-80px] relative z-10">
          <HeroAvatar />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="max-w-xl relative z-10 lg:z-0">
            <p className="text-[var(--accent-primary)] font-mono text-lg mb-4">
              {'>'} Hello, I&apos;m
            </p>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <GlitchText text="nzt108" className="text-[var(--text-primary)]" />
              <span className="text-[var(--accent-secondary)]">_</span>
              <span className="text-[var(--text-secondary)]">dev</span>
            </h1>

            <h2 className="text-xl md:text-2xl font-medium mb-8 text-[var(--text-secondary)] leading-relaxed">
              Apps, Bots, SaaS & Websites —{' '}
              <span className="gradient-text font-semibold">Built Fast, Priced Fair</span>
            </h2>

            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mb-10 leading-relaxed">
              I design and build complete digital products from idea to launch.
              One developer, no overhead, no surprises — just results.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="btn-filled text-base px-8 py-3">
                Get Free Estimate
              </Link>
              <Link href="/services" className="cyber-btn">
                View Services
              </Link>
            </div>

            {/* Availability Status */}
            <div className="mt-12 flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full py-2 px-4 w-fit">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-[var(--text-primary)]">
                Available for new projects
              </span>
            </div>
          </div>

          {/* Right side - Avatar (Desktop only) */}
          <div className="hidden lg:flex justify-center items-center">
            <HeroAvatar />
          </div>
        </div>
      </section>

      {/* Quick Pricing Infographic */}
      <QuickPricing />

      {/* Featured Projects */}
      <section className="py-20 z-10 relative">
        <div className="mb-12">
          <h2 className="section-title gradient-text">Featured Projects</h2>
          <p className="section-subtitle">
            Real solutions built for real clients. Explore my recent work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/projects" className="cyber-btn">
            View All Projects →
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <ProcessSteps />

      {/* Comparison */}
      <ComparisonTable />

      {/* FAQ */}
      <FAQ />

      {/* CTA Section with Lead Capture */}
      <section className="py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Ready to bring your
              <span className="gradient-text"> idea to life</span>?
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-6">
              Whether it&apos;s a mobile app, a Telegram bot, or a full SaaS platform —
              let&apos;s discuss your project. First consultation is always free.
            </p>
            <ul className="space-y-3 text-[var(--text-secondary)]">
              <li className="flex items-center gap-3">
                <span className="text-[var(--accent-green)]">✓</span>
                Free estimate within 24 hours
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[var(--accent-green)]">✓</span>
                No upfront commitment
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[var(--accent-green)]">✓</span>
                Transparent pricing, no hidden fees
              </li>
            </ul>
          </div>

          <LeadCaptureWidget />
        </div>
      </section>
    </div>
  )
}
