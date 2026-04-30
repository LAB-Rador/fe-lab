"use client"

import { Button } from "@/src/components/ui/button"
import { HeroLandingMetrics } from "@/src/components/landing/hero-landing-metrics"
import type { LandingStatsPayload } from "@/src/types/landing-stats"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

const ROW_DOT_COLORS = ["bg-[#10B981]", "bg-[#2563EB]", "bg-[#8B5CF6]"] as const

interface HeroSectionProps {
    stats: LandingStatsPayload | null
}

export function HeroSection({ stats }: HeroSectionProps) {
    const router = useRouter()
    const rows = stats?.topAnimalTypes ?? []
    const activePercent = stats?.activePercent

    return (
        <section className="relative bg-gradient-to-br from-[#2563EB]/5 to-[#8B5CF6]/5 py-20 lg:py-32">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-gray-900">
                                Advanced Laboratory Animal Management
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                Streamline your research with LabAssist - the comprehensive platform for monitoring, tracking, and
                                managing laboratory animals with precision and compliance.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                onClick={() => router.push("/signup")}
                                size="lg"
                                className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white px-8 py-3"
                            >
                                Start Free Trial
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                disabled
                                size="lg"
                                variant="outline"
                                className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/5 px-8 py-3"
                            >
                                Watch Demo
                            </Button>
                        </div>

                        <HeroLandingMetrics stats={stats} />
                    </div>

                    <div className="relative">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Animal Overview</h3>
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 bg-[#10B981] rounded-full"></div>
                                        <div className="w-3 h-3 bg-[#F59E0B] rounded-full"></div>
                                        <div className="w-3 h-3 bg-[#EF4444] rounded-full"></div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {rows.length === 0 ? (
                                        <p className="text-sm text-gray-500 py-4 text-center">
                                            No animal types in the database yet.
                                        </p>
                                    ) : (
                                        rows.map((row, i) => (
                                            <div
                                                key={`${row.name}-${i}`}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex items-center space-x-3 min-w-0">
                                                    <div
                                                        className={`w-2 h-2 rounded-full shrink-0 ${ROW_DOT_COLORS[i % ROW_DOT_COLORS.length]}`}
                                                    />
                                                    <span className="text-sm font-medium truncate">{row.name}</span>
                                                </div>
                                                <span className="text-sm text-gray-600 shrink-0 ml-2">
                                                    {row.count.toLocaleString()} total
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Active status (share)</span>
                                        <span className="font-medium text-[#10B981]">
                                            {activePercent === undefined ? "—" : `${activePercent.toFixed(1)}%`}
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
