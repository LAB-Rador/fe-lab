"use client"

import { Button } from "@/src/components/ui/button"
import { Microscope, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const router = useRouter();

    // const navigation = [
    //     { name: "Features", href: "#features" },
    //     { name: "Solutions", href: "#solutions" },
    //     { name: "Pricing", href: "#pricing" },
    //     { name: "Resources", href: "#resources" },
    //     { name: "About", href: "#about" },
    // ]

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-[#2563EB] rounded-lg">
                            <Microscope className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">LabAssist</span>
                    </div>

                    {/* Desktop Navigation */}
                    {/* <nav className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="text-gray-600 hover:text-[#2563EB] transition-colors duration-200 font-medium"
                        >
                            {item.name}
                        </a>
                        ))}
                    </nav> */}

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Button onClick={() => router.push("/signin")} variant="ghost" className="text-gray-600 hover:text-[#2563EB]">
                            Sign In /<span className="text-[#2563EB]">Guest Access</span>
                        </Button>
                        <Button onClick={() => router.push("/signup")} className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white">Sign Up</Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 py-4">
                    <nav className="flex flex-col space-y-4">
                        {/* {navigation.map((item) => (
                            <a
                            key={item.name}
                            href={item.href}
                            className="text-gray-600 hover:text-[#2563EB] transition-colors duration-200 font-medium px-4 py-2"
                            onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </a>
                        ))} */}
                        <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-gray-200">
                            <Button onClick={() => router.push("/signin")} variant="ghost" className="text-gray-600 hover:text-[#2563EB] justify-start">
                                Sign In /<span className="text-[#2563EB]">Guest Access</span>
                            </Button>
                            <Button onClick={() => router.push("/signup")} className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white justify-start">Sign Up</Button>
                        </div>
                    </nav>
                </div>
                )}
            </div>
        </header>
    )
}
