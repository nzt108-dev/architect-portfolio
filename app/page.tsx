import Link from 'next/link'
import { getFeaturedProjects, getSkills } from '@/lib/queries'
import ProjectCard from '@/components/ui/ProjectCard'
import GlitchText from '@/components/ui/GlitchText'
import HeroAvatar from '@/components/ui/HeroAvatar'
import WhyChooseMe from '@/components/ui/WhyChooseMe'
import ProcessSteps from '@/components/ui/ProcessSteps'
import ComparisonTable from '@/components/ui/ComparisonTable'
import FAQ from '@/components/ui/FAQ'
import LeadCaptureWidget from '@/components/ui/LeadCaptureWidget'
import GradientIcon from '@/components/ui/GradientIcon'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const featuredProjects = await getFeaturedProjects()
  const skills = await getSkills()

  const techStack = skills.slice(0, 11).map((s) => s.name)

  return (
    <div className="container mx-auto px-6">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col justify-center py-10 lg:py-20">
        {/* Mobile Avatar */}
        <div className="lg:hidden flex justify-center mb-[-80px] relative z-0">
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

            {/* Stats */}
            <div className="flex gap-8 md:gap-12 mt-16">
              <div>
                <div className="text-4xl font-bold text-[var(--accent-primary)]">5+</div>
                <div className="text-[var(--text-secondary)] text-sm">Active Projects</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[var(--accent-secondary)]">3</div>
                <div className="text-[var(--text-secondary)] text-sm">Tech Domains</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[var(--accent-blue)]">24h</div>
                <div className="text-[var(--text-secondary)] text-sm">Response Time</div>
              </div>
            </div>
          </div>

          {/* Right side - Avatar (Desktop only) */}
          <div className="hidden lg:flex justify-center items-center">
            <HeroAvatar />
          </div>
        </div>
      </section>

      {/* Why Choose Me */}
      <WhyChooseMe />

      {/* How It Works */}
      <ProcessSteps />

      {/* Services Preview */}
      <section className="py-20">
        <div className="text-center mb-14">
          <h2 className="section-title gradient-text">What I Build</h2>
          <p className="section-subtitle mx-auto">
            From mobile apps to full-stack SaaS — everything you need, under one roof.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { iconName: 'smartphone', label: 'Mobile Apps', desc: 'iOS & Android' },
            { iconName: 'globe', label: 'Websites', desc: 'Landing & Web Apps' },
            { iconName: 'bot', label: 'Telegram Bots', desc: 'Automation & Commerce' },
            { iconName: 'briefcase', label: 'SaaS Platforms', desc: 'Full-stack Products' },
            { iconName: 'server', label: 'APIs & Backends', desc: 'Scalable Infrastructure' },
          ].map((item) => (
            <Link
              key={item.label}
              href="/services"
              className="cyber-card p-5 text-center group"
            >
              <div className="flex justify-center mb-3">
                <GradientIcon name={item.iconName} size={32} />
              </div>
              <div className="font-medium text-sm group-hover:text-[var(--accent-primary)] transition-colors">
                {item.label}
              </div>
              <div className="text-[var(--text-muted)] text-xs mt-1">{item.desc}</div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/services" className="cyber-btn">
            View All Services →
          </Link>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
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

      {/* Tech Stack Preview */}
      <section className="py-20">
        <div className="cyber-card p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="section-title">Tech Stack</h2>
            <p className="section-subtitle mx-auto">
              Battle-tested technologies for reliable, scalable products
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech) => (
              <span key={tech} className="skill-badge">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

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
