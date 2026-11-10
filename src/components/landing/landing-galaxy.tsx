"use client"

import Galaxy from "@/src/components/react-bits/galaxy"
import { useTheme } from "next-themes"

export function LandingGalaxy() {
    const { resolvedTheme } = useTheme()
    const light = resolvedTheme === "light"

    return (
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
            <Galaxy
                className="h-full w-full"
                transparent
                lightMode={light}
                clickWarp={false}
                mouseRepulsion={false}
                intro={false}
                density={0.7}
                glowIntensity={0.4}
                speed={0.55}
                starSpeed={0.3}
                rotationSpeed={0.06}
                opacity={light ? 0.7 : 1}
                starColors={["#3B82F6", "#8B5CF6", "#93C5FD"]}
            />
        </div>
    )
}
