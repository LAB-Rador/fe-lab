import { AuthParticles } from "@/src/components/landing/auth-particles"
import { LoginForm } from "@/src/components/login-form"
import BorderGlow from "@/src/components/react-bits/border-glow"
import BlurText from "@/src/components/react-bits/blur-text"
import { ThemeToggle } from "@/src/components/theme-toggle"
import { Button } from "@/src/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
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
                glowIntensity={0.7}
            >
                <div className="space-y-8 p-8">
                    <div className="flex justify-start">
                        <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                            <Link href="/" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-primary"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">LabAssist</h2>
                        <BlurText
                            text="Laboratory Animal Management System"
                            className="justify-center text-sm text-muted-foreground"
                            animateBy="words"
                            direction="bottom"
                            delay={50}
                        />
                    </div>
                    <LoginForm />
                </div>
            </BorderGlow>
        </div>
    )
}
