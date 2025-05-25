import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Users, Stethoscope, UserCheck, Shield } from "lucide-react"

const benefits = {
    researchers: [
        "Streamlined data collection and analysis",
        "Automated protocol compliance tracking",
        "Real-time animal health monitoring",
        "Integrated breeding management",
        "Comprehensive reporting tools",
        "Mobile access for field work",
    ],
    veterinarians: [
        "Centralized health record management",
        "Automated health alert notifications",
        "Treatment history tracking",
        "Preventive care scheduling",
        "Regulatory compliance documentation",
        "Multi-site practice management",
    ],
    administrators: [
        "Complete facility oversight",
        "Resource allocation optimization",
        "Compliance audit preparation",
        "Cost tracking and budgeting",
        "Staff performance monitoring",
        "Institutional reporting",
    ],
    technicians: [
        "Simplified daily care workflows",
        "Mobile-friendly task management",
        "Automated feeding schedules",
        "Quick health status updates",
        "Equipment maintenance tracking",
        "Training module access",
    ],
}

export function BenefitsSection() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Designed for Every Role in Your Laboratory
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        LabAssist adapts to the unique needs of each team member, from researchers to veterinarians, ensuring
                        everyone has the tools they need to excel.
                    </p>
                </div>

                <Tabs defaultValue="researchers" className="max-w-4xl mx-auto">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
                        <TabsTrigger value="researchers" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span className="hidden sm:inline">Researchers</span>
                        </TabsTrigger>
                        <TabsTrigger value="veterinarians" className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            <span className="hidden sm:inline">Veterinarians</span>
                        </TabsTrigger>
                        <TabsTrigger value="administrators" className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span className="hidden sm:inline">Administrators</span>
                        </TabsTrigger>
                        <TabsTrigger value="technicians" className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4" />
                            <span className="hidden sm:inline">Technicians</span>
                        </TabsTrigger>
                    </TabsList>

                    {Object.entries(benefits).map(([role, benefitList]) => (
                        <TabsContent key={role} value={role}>
                            <Card>
                                <CardHeader className="text-center">
                                    <CardTitle className="text-2xl capitalize">{role}</CardTitle>
                                    <CardDescription className="text-lg">
                                        Specialized tools and features designed for {role}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {benefitList.map((benefit, index) => (
                                            <div key={index} className="flex items-center space-x-3">
                                                <CheckCircle className="h-5 w-5 text-[#10B981] flex-shrink-0" />
                                                <span className="text-gray-700">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    )
}
