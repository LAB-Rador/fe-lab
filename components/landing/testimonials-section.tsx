import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
    {
        name: "Dr. Sarah Chen",
        role: "Principal Investigator",
        institution: "Stanford University",
        content:
        "LabAssist has revolutionized how we manage our mouse colonies. The breeding tracking and health monitoring features have improved our research efficiency by 40%.",
        rating: 5,
    },
    {
        name: "Dr. Michael Rodriguez",
        role: "Laboratory Director",
        institution: "Johns Hopkins University",
        content:
        "The compliance reporting features are outstanding. We've reduced our audit preparation time from weeks to days, and the automated documentation is incredibly thorough.",
        rating: 5,
    },
    {
        name: "Dr. Emily Watson",
        role: "Research Veterinarian",
        institution: "MIT",
        content:
        "As a veterinarian overseeing multiple labs, LabAssist gives me the centralized view I need. The health alerts have helped us catch issues early and improve animal welfare.",
        rating: 5,
    },
]

export function TestimonialsSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Trusted by Leading Research Institutions
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        See how LabAssist is helping researchers and veterinarians worldwide improve their laboratory animal
                        management.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="border border-gray-200">
                            <CardContent className="p-6">
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 text-[#F59E0B] fill-current" />
                                    ))}
                                </div>
                                <blockquote className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</blockquote>
                                <div>
                                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                                    <div className="text-sm text-[#2563EB]">{testimonial.institution}</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
