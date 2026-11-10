"use client"

import { HeroLandingMetrics } from "@/src/components/landing/hero-landing-metrics"
import { ctaGlowClass } from "@/src/components/landing/cta-glow"
import type { LandingStatsPayload } from "@/src/types/landing-stats"
import { CountUp } from "@/src/components/ui/count-up"
import BlurText from "@/src/components/react-bits/blur-text"
import Magnet from "@/src/components/react-bits/magnet"
import { Button } from "@/src/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

const ROW_DOT_COLORS = ["bg-[#10B981]", "bg-[#3B82F6]", "bg-[#8B5CF6]"] as const

interface HeroSectionProps {
    stats: LandingStatsPayload | null
}

export function HeroSection({ stats }: HeroSectionProps) {
    const router = useRouter()
    const rows = stats?.topAnimalTypes ?? []
    const activePercent = stats?.activePercent

    return (
        <section className="relative py-20 lg:py-32">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-foreground">
                                Advanced Laboratory Animal Management
                            </h1>
                            <BlurText
                                text="Streamline your research with LabAssist — the comprehensive platform for monitoring, tracking, and managing laboratory animals with precision and compliance."
                                className="max-w-xl text-xl leading-relaxed text-muted-foreground"
                                animateBy="words"
                                direction="bottom"
                                delay={40}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Magnet padding={80} magnetStrength={5}>
                                <Button
                                    onClick={() => router.push("/signin")}
                                    size="lg"
                                    className={`px-8 ${ctaGlowClass}`}
                                >
                                    Start Free Trial
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Magnet>
                            <Button
                                disabled
                                size="lg"
                                variant="outline"
                                className="rounded-xl border-primary px-8 text-primary hover:bg-primary/10"
                            >
                                Watch Demo
                            </Button>
                        </div>

                        <HeroLandingMetrics stats={stats} />
                    </div>

                    <div className="relative">
                        <div className="rounded-xl border border-border bg-card p-8 shadow-2xl">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-foreground">Animal Overview</h3>
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 bg-[#10B981] rounded-full"></div>
                                        <div className="w-3 h-3 bg-[#F59E0B] rounded-full"></div>
                                        <div className="w-3 h-3 bg-[#EF4444] rounded-full"></div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {rows.length === 0 ? (
                                        <p className="py-4 text-center text-sm text-muted-foreground">
                                            No animal types in the database yet.
                                        </p>
                                    ) : (
                                        rows.map((row, i) => (
                                            <div
                                                key={`${row.name}-${i}`}
                                                className="flex items-center justify-between rounded-xl bg-muted p-3"
                                            >
                                                <div className="flex items-center space-x-3 min-w-0">
                                                    <div
                                                        className={`w-2 h-2 rounded-full shrink-0 ${ROW_DOT_COLORS[i % ROW_DOT_COLORS.length]}`}
                                                    />
                                                    <span className="text-sm font-medium truncate text-foreground">{row.name}</span>
                                                </div>
                                                <span className="ml-2 shrink-0 text-sm tabular-nums text-muted-foreground">
                                                    <CountUp value={row.count} /> total
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="border-t border-border pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Active status (share)</span>
                                        <span className="font-medium text-[#10B981] tabular-nums">
                                            {activePercent === undefined ? (
                                                "—"
                                            ) : (
                                                <CountUp value={activePercent} decimals={1} suffix="%" />
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
