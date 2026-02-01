import Link from 'next/link'
import { getFeaturedProjects, getSkills } from '@/lib/queries'
import ProjectCard from '@/components/ui/ProjectCard'
import GlitchText from '@/components/ui/GlitchText'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const featuredProjects = await getFeaturedProjects()
  const skills = await getSkills()

  // Get unique technologies from skills
  const techStack = skills.slice(0, 11).map((s) => s.name)

  return (
    <div className="container mx-auto px-6">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col justify-center py-20">
        <div className="max-w-4xl">
          {/* Greeting */}
          <p className="text-[var(--neon-cyan)] font-mono text-lg mb-4 animate-pulse">
            {'>'} Hello, I&apos;m
          </p>

          {/* Name */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <GlitchText text="nzt108" className="text-[var(--text-primary)]" />
            <span className="text-[var(--neon-pink)]">_</span>
            <span className="text-[var(--text-secondary)]">dev</span>
          </h1>

          {/* Tagline */}
          <h2 className="text-2xl md:text-4xl font-semibold mb-8 gradient-text">
            Software Architect
          </h2>

          {/* Description */}
          <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            I design and build complete digital solutions from idea to launch.
            Whether you have a vision or just a spark — let&apos;s turn it into reality.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link href="/projects" className="cyber-btn">
              View Projects
            </Link>
            <Link href="/contact" className="cyber-btn cyber-btn-pink">
              Get in Touch
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-12 mt-16">
            <div>
              <div className="text-4xl font-bold text-[var(--neon-cyan)]">5+</div>
              <div className="text-[var(--text-secondary)] text-sm">Active Projects</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--neon-pink)]">3</div>
              <div className="text-[var(--text-secondary)] text-sm">Tech Domains</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--neon-purple)]">∞</div>
              <div className="text-[var(--text-secondary)] text-sm">Ideas to Build</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block">
          <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-[var(--neon-cyan)] to-transparent animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <div className="mb-12">
          <h2 className="section-title gradient-text">Featured Projects</h2>
          <p className="section-subtitle">
            Explore my latest work across mobile apps, Telegram bots, and web services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/projects" className="cyber-btn cyber-btn-pink">
            View All Projects →
          </Link>
        </div>
      </section>

      {/* Tech Stack Preview */}
      <section className="py-20">
        <div className="cyber-card p-8 md:p-12 neon-border">
          <div className="text-center mb-10">
            <h2 className="section-title">Tech Stack</h2>
            <p className="section-subtitle mx-auto">
              Technologies I use to bring ideas to life
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech) => (
              <span key={tech} className="skill-badge">
                {tech}
              </span>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/about" className="cyber-btn">
              Learn More About Me
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Got an idea? Or looking for one?
        </h2>
        <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto mb-10">
          I help turn concepts into products — and if you&apos;re still exploring,
          we can brainstorm together.
        </p>
        <Link href="/contact" className="cyber-btn text-lg px-10 py-4">
          Let&apos;s Talk
        </Link>
      </section>
    </div>
  )
}
