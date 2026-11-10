"use client"

import { ctaGlowClass } from "@/src/components/landing/cta-glow"
import Magnet from "@/src/components/react-bits/magnet"
import { Button } from "@/src/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function CTASection() {
    const router = useRouter();
    return (
        <section className="relative overflow-hidden py-20">
            <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/25 via-background to-[#8B5CF6]/30" />
            <div className="container relative mx-auto px-4 lg:px-8">
                <div className="mx-auto max-w-4xl text-center text-foreground">
                    <h2 className="mb-6 text-3xl font-bold lg:text-4xl">Ready to Transform Your Laboratory Management?</h2>
                    <p className="mb-8 text-xl text-muted-foreground">
                        Join hundreds of research institutions already using LabAssist to improve their animal care and research
                        outcomes.
                    </p>

                    <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="flex items-center justify-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-[#10B981]" />
                            <span>30-day free trial</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-[#10B981]" />
                            <span>No setup fees</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-[#10B981]" />
                            <span>24/7 support</span>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Magnet padding={80} magnetStrength={5}>
                            <Button
                                onClick={() => {
                                    router.push('/signin');
                                }}
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
                            className="rounded-xl border-border bg-transparent px-8 text-foreground hover:bg-white/10"
                        >
                            Schedule Demo
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
