import type { ReactNode } from "react"
import { Beaker, Shield, Users, BarChart3 } from "lucide-react"

interface AuthLayoutProps {
    children: ReactNode
    title: string
    subtitle: string
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
        {/* Left Panel - Branding and Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-primary-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700"></div>
            <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-8">
                <div className="flex items-center mb-6">
                <div className="bg-white/20 p-3 rounded-xl mr-4">
                    <Beaker className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">LabAssist</h1>
                    <p className="text-primary-100">Laboratory Management System</p>
                </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-2 rounded-lg">
                    <Shield className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-semibold mb-1">Secure & Compliant</h3>
                    <p className="text-primary-100 text-sm">
                    HIPAA compliant with enterprise-grade security for sensitive laboratory data
                    </p>
                </div>
                </div>

                <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-2 rounded-lg">
                    <Users className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-semibold mb-1">Animal Welfare Management</h3>
                    <p className="text-primary-100 text-sm">
                    Comprehensive tracking and care management for laboratory animals
                    </p>
                </div>
                </div>

                <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-2 rounded-lg">
                    <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-semibold mb-1">Advanced Analytics</h3>
                    <p className="text-primary-100 text-sm">
                    Real-time monitoring and detailed reporting for research insights
                    </p>
                </div>
                </div>
            </div>

            <div className="mt-12 text-primary-100 text-sm">
                <p>Trusted by 500+ research institutions worldwide</p>
            </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center mb-8">
                <div className="bg-primary-500 p-3 rounded-xl mr-3">
                <Beaker className="h-6 w-6 text-white" />
                </div>
                <div>
                <h1 className="text-2xl font-bold text-gray-900">LabAssist</h1>
                <p className="text-secondary-500 text-sm">Laboratory Management</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-secondary-500">{subtitle}</p>
                </div>

                {children}
            </div>
            </div>
        </div>
        </div>
    )
}
