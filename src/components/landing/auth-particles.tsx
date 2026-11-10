"use client"

import Particles from "@/src/components/react-bits/particles"

export function AuthParticles() {
    return (
        <div className="pointer-events-none absolute inset-0">
            <Particles
                particleCount={80}
                particleSpread={12}
                speed={0.28}
                particleColors={["#60A5FA", "#A78BFA", "#E5E7EB"]}
                alphaParticles
                particleBaseSize={70}
                sizeRandomness={0.45}
                cameraDistance={16}
                disableRotation
                connections
                connectionDistance={180}
                moveParticlesOnHover
                particleHoverFactor={0.4}
                glow={0.85}
                opacity={0.9}
                intro={false}
            />
        </div>
    )
}
