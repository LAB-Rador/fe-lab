"use client"

import type { LandingStatsPayload } from "@/src/types/landing-stats"
import { CountUp } from "@/src/components/ui/count-up"
import { BarChart3, Shield, Users } from "lucide-react"

interface HeroLandingMetricsProps {
    stats: LandingStatsPayload | null
}

export function HeroLandingMetrics({ stats }: HeroLandingMetricsProps) {
    if (!stats) {
        return (
            <div className="grid grid-cols-3 gap-8 pt-8 text-center text-sm text-gray-500">
                <div>
                    <Shield className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                    <p className="font-medium text-gray-400">—</p>
                    <p>In care</p>
                </div>
                <div>
                    <Users className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                    <p className="font-medium text-gray-400">—</p>
                    <p>Research Labs</p>
                </div>
                <div>
                    <BarChart3 className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                    <p className="font-medium text-gray-400">—</p>
                    <p>Animals</p>
                </div>
            </div>
        )
    }

    const { inCarePercent, researchLabs, animalsTracked } = stats

    return (
        <div className="grid grid-cols-3 gap-8 pt-8">
            <div className="text-center">
                <div className="flex justify-center mb-2">
                    <Shield className="h-8 w-8 text-[#10B981]" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                    <CountUp value={inCarePercent} decimals={1} suffix="%" />
                </div>
                <div className="text-sm text-gray-600">In care</div>
            </div>
            <div className="text-center">
                <div className="flex justify-center mb-2">
                    <Users className="h-8 w-8 text-[#2563EB]" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                    <CountUp value={researchLabs} decimals={0} />
                </div>
                <div className="text-sm text-gray-600">Research Labs</div>
            </div>
            <div className="text-center">
                <div className="flex justify-center mb-2">
                    <BarChart3 className="h-8 w-8 text-[#8B5CF6]" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                    <CountUp value={animalsTracked} decimals={0} />
                </div>
                <div className="text-sm text-gray-600">Animals in database</div>
            </div>
        </div>
    )
}
