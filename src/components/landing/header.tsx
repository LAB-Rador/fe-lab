"use client"

import { ctaGlowClass } from "@/src/components/landing/cta-glow"
import Magnet from "@/src/components/react-bits/magnet"
import { ThemeToggle } from "@/src/components/theme-toggle"
import { Button } from "@/src/components/ui/button"
import { Microscope, Menu, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const router = useRouter();

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center space-x-3" onClick={() => setIsMenuOpen(false)}>
                        <div className="rounded-xl bg-primary p-2">
                            <Microscope className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="text-2xl font-bold text-foreground">LabAssist</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-4">
                        <ThemeToggle />
                        <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                            Pricing
                        </Link>
                        <Magnet padding={70} magnetStrength={5}>
                            <Button onClick={() => router.push("/signin")} className={ctaGlowClass}>
                                Sign in
                            </Button>
                        </Magnet>
                    </div>

                    <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open menu">
                        {isMenuOpen ? <X className="h-6 w-6 text-muted-foreground" /> : <Menu className="h-6 w-6 text-muted-foreground" />}
                    </button>
                </div>

                {isMenuOpen && (
                <div className="md:hidden border-t border-border py-4">
                    <nav className="flex flex-col space-y-4">
                        <div className="flex flex-col space-y-2 px-4">
                            <ThemeToggle />
                            <Link href="/pricing" className="text-sm font-medium text-muted-foreground" onClick={() => setIsMenuOpen(false)}>
                                Pricing
                            </Link>
                            <Magnet padding={40} magnetStrength={5} wrapperClassName="w-full" innerClassName="w-full">
                                <Button onClick={() => router.push("/signin")} className={`w-full justify-start ${ctaGlowClass}`}>
                                    Sign in
                                </Button>
                            </Magnet>
                        </div>
                    </nav>
                </div>
                )}
            </div>
        </header>
    )
}
