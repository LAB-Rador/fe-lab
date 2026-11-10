import { CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import SpotlightCard from "@/src/components/react-bits/spotlight-card"
import BlurText from "@/src/components/react-bits/blur-text"
import {
    Activity,
    Calendar,
    FileText,
    Heart,
    Shield,
    Users,
    BarChart3,
    Bell,
    Database,
    Microscope,
    ClipboardList,
    Settings,
} from "lucide-react"
import type { CSSProperties } from "react"

const features = [
    {
        icon: Activity,
        title: "Real-time Monitoring",
        description: "Track animal health, behavior, and vital signs with continuous monitoring and automated alerts.",
        color: "#10B981",
    },
    {
        icon: Calendar,
        title: "Breeding Management",
        description: "Comprehensive breeding protocols, genealogy tracking, and reproductive cycle management.",
        color: "#3B82F6",
    },
    {
        icon: FileText,
        title: "Compliance Reporting",
        description: "Automated regulatory compliance reports and documentation for IACUC and institutional requirements.",
        color: "#8B5CF6",
    },
    {
        icon: Heart,
        title: "Health Tracking",
        description: "Monitor animal welfare, medical treatments, and veterinary care with detailed health records.",
        color: "#EF4444",
    },
    {
        icon: Shield,
        title: "Data Security",
        description: "Enterprise-grade security with encrypted data storage and role-based access controls.",
        color: "#64748B",
    },
    {
        icon: Users,
        title: "Team Collaboration",
        description: "Multi-user access with customizable permissions for researchers, technicians, and veterinarians.",
        color: "#F59E0B",
    },
    {
        icon: BarChart3,
        title: "Analytics Dashboard",
        description: "Comprehensive analytics and insights to optimize research outcomes and animal welfare.",
        color: "#3B82F6",
    },
    {
        icon: Bell,
        title: "Smart Notifications",
        description: "Intelligent alerts for feeding schedules, health concerns, and protocol milestones.",
        color: "#10B981",
    },
    {
        icon: Database,
        title: "Data Integration",
        description: "Seamless integration with laboratory equipment and existing research management systems.",
        color: "#8B5CF6",
    },
    {
        icon: Microscope,
        title: "Research Protocols",
        description: "Standardized protocols for different animal types with customizable experimental procedures.",
        color: "#EF4444",
    },
    {
        icon: ClipboardList,
        title: "Inventory Management",
        description: "Track supplies, medications, and equipment with automated reorder notifications.",
        color: "#F59E0B",
    },
    {
        icon: Settings,
        title: "Customizable Workflows",
        description: "Adapt the system to your laboratory's specific needs with flexible configuration options.",
        color: "#64748B",
    },
]

const spotlightSurface = { "--spotlight-card-surface": "hsl(var(--card))" } as CSSProperties

export function FeaturesSection() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
                        Everything You Need for Laboratory Animal Management
                    </h2>
                    <BlurText
                        text="LabAssist provides comprehensive tools to streamline your research workflow while ensuring the highest standards of animal care and regulatory compliance."
                        className="mx-auto max-w-3xl justify-center text-xl text-muted-foreground"
                        animateBy="words"
                        direction="bottom"
                        delay={24}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <SpotlightCard
                            key={feature.title}
                            theme="dark"
                            spotlightColor={index % 2 === 0 ? "#3B82F6" : "#8B5CF6"}
                            intensity={0.4}
                            borderGlow={0.85}
                            ambient
                            className="h-full !rounded-xl !p-0 border border-[#1E293B]"
                            style={spotlightSurface}
                        >
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 rounded-xl" style={{ backgroundColor: `${feature.color}22` }}>
                                        <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
                                    </div>
                                    <CardTitle className="text-lg text-foreground">{feature.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
                            </CardContent>
                        </SpotlightCard>
                    ))}
                </div>
            </div>
        </section>
    )
}
