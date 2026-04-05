import HeroSection from '@/components/ui/HeroSection'
import ServicesBento from '@/components/ui/ServicesBento'
import HowItWorks from '@/components/ui/HowItWorks'
import WhyMe from '@/components/ui/WhyMe'
import FeaturedWork from '@/components/ui/FeaturedWork'
import FAQ from '@/components/ui/FAQ'
import CTASection from '@/components/ui/CTASection'
import StickyMobileCTA from '@/components/ui/StickyMobileCTA'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen thumb-safe">
      {/* 1. Hero — First Impression */}
      <HeroSection />

      {/* 2. Services — What I Build (Bento Grid with prices) */}
      <ServicesBento />

      {/* 3. How It Works — 3 Steps */}
      <HowItWorks />

      {/* 4. Why Me — Comparison */}
      <WhyMe />

      {/* 5. Portfolio — Recent Work */}
      <FeaturedWork />

      {/* 6. FAQ */}
      <FAQ />

      {/* 7. Final CTA — Lead Capture */}
      <CTASection />

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA />
    </div>
  )
}
