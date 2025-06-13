"use client"

import { Header } from "@/src/components/landing/header"
import { HeroSection } from "@/src/components/landing/hero-section"
import { FeaturesSection } from "@/src/components/landing/features-section"
import { BenefitsSection } from "@/src/components/landing/benefits-section"
import { TestimonialsSection } from "@/src/components/landing/testimonials-section"
import { CTASection } from "@/src/components/landing/cta-section"
import { Footer } from "@/src/components/landing/footer"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main>
                <HeroSection />
                <FeaturesSection />
                <BenefitsSection />
                <TestimonialsSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    )
}
