import SpotlightCard from "@/src/components/react-bits/spotlight-card"
import { Star } from "lucide-react"
import type { CSSProperties } from "react"

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

const spotlightSurface = { "--spotlight-card-surface": "hsl(var(--card))" } as CSSProperties

export function TestimonialsSection() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
                        Trusted by Leading Research Institutions
                    </h2>
                    <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
                        See how LabAssist is helping researchers and veterinarians worldwide improve their laboratory animal
                        management.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <SpotlightCard
                            key={testimonial.name}
                            theme="dark"
                            spotlightColor="#8B5CF6"
                            intensity={0.35}
                            borderGlow={0.8}
                            className="h-full !rounded-xl !p-6 border border-[#1E293B]"
                            style={spotlightSurface}
                        >
                            <div className="flex items-center mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 text-[#F59E0B] fill-current" />
                                ))}
                            </div>
                            <blockquote className="mb-6 leading-relaxed text-foreground/90">&ldquo;{testimonial.content}&rdquo;</blockquote>
                            <div>
                                <div className="font-semibold text-foreground">{testimonial.name}</div>
                                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                <div className="text-sm text-primary">{testimonial.institution}</div>
                            </div>
                        </SpotlightCard>
                    ))}
                </div>
            </div>
        </section>
    )
}
