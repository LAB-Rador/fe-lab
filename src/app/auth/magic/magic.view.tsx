import { AuthParticles } from "@/src/components/landing/auth-particles"
import { ctaGlowClass } from "@/src/components/landing/cta-glow"
import BorderGlow from "@/src/components/react-bits/border-glow"
import Magnet from "@/src/components/react-bits/magnet"
import { ThemeToggle } from "@/src/components/theme-toggle"
import { Button } from "@/src/components/ui/button"
import Link from "next/link"

interface MagicLinkViewProps {
    error?: string
}

export default function MagicLinkView({ error }: MagicLinkViewProps) {
    return (
        <div className="relative flex min-h-dvh w-full flex-col items-center justify-center bg-background px-4">
            <div className="absolute left-4 top-4 z-20">
                <ThemeToggle />
            </div>
            <AuthParticles />
            <BorderGlow
                className="relative z-10 w-full max-w-md"
                backgroundColor="hsl(var(--card))"
                borderRadius={12}
                glowColor="217 91 60"
                colors={["#3B82F6", "#8B5CF6", "#93C5FD"]}
            >
                <div className="space-y-4 p-8 text-center">
                    <h1 className="text-2xl font-bold text-foreground">
                        {error ? "Sign-in link" : "Signing you in"}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {error ?? "Please wait while we open your account."}
                    </p>
                    {error ? (
                        <Magnet wrapperClassName="w-full" innerClassName="w-full" padding={70} magnetStrength={5}>
                            <Button asChild className={`w-full ${ctaGlowClass}`}>
                                <Link href="/signin">Request a new link</Link>
                            </Button>
                        </Magnet>
                    ) : null}
                </div>
            </BorderGlow>
        </div>
    )
}
