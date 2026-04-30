import { Header } from "@/src/components/landing/header"
import { HeroSection } from "@/src/components/landing/hero-section"
import { FeaturesSection } from "@/src/components/landing/features-section"
import { BenefitsSection } from "@/src/components/landing/benefits-section"
import { TestimonialsSection } from "@/src/components/landing/testimonials-section"
import { CTASection } from "@/src/components/landing/cta-section"
import { Footer } from "@/src/components/landing/footer"
import type { LandingStatsPayload } from "@/src/types/landing-stats"

function getBackendBaseUrl(): string | undefined {
    const local = process.env.NEXT_PUBLIC_LOCAL_DATABASE_URL?.trim()
    const remote = process.env.NEXT_PUBLIC_DATABASE_URL?.trim()
    return local || remote
}

async function getLandingStats(): Promise<LandingStatsPayload | null> {
    const base = getBackendBaseUrl()
    if (!base) return null
    try {
        const res = await fetch(`${base.replace(/\/$/, "")}/api/public/landing-stats`, {
            next: { revalidate: 120 },
        })
        if (!res.ok) return null
        const body = await res.json()
        if (body?.success && body?.data) return body.data as LandingStatsPayload
        return null
    } catch {
        return null
    }
}

export default async function LandingPage() {
    const stats = await getLandingStats()
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main>
                <HeroSection stats={stats} />
                <FeaturesSection />
                <BenefitsSection />
                <TestimonialsSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    )
}
