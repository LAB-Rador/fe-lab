import { ctaGlowClass } from "@/src/components/landing/cta-glow"
import BorderGlow from "@/src/components/react-bits/border-glow"
import BlurText from "@/src/components/react-bits/blur-text"
import Magnet from "@/src/components/react-bits/magnet"
import { Button } from "@/src/components/ui/button"
import Link from "next/link"

export type PricingPlan = {
    name: string
    priceLabel: string
    userLabel: string
    items: string[]
    free: boolean
}

export function PricingView({ plans, error }: { plans: PricingPlan[]; error: string | null }) {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <h1 className="text-4xl font-bold text-foreground">Pricing</h1>
                    <BlurText
                        text="One yearly price in USD for every country. Each subscription covers one laboratory. A second laboratory needs its own subscription."
                        className="mt-4 justify-center text-lg text-muted-foreground"
                        animateBy="words"
                        direction="bottom"
                        delay={28}
                    />
                </div>

                {error ? (
                    <p className="text-center text-sm text-destructive">{error}</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
                        {plans.map((plan) => (
                            <BorderGlow
                                key={plan.name}
                                className="h-full"
                                backgroundColor="hsl(var(--card))"
                                borderRadius={12}
                                glowColor="217 91 60"
                                colors={["#3B82F6", "#8B5CF6", "#93C5FD"]}
                                glowIntensity={0.8}
                            >
                                <div className="flex h-full flex-col gap-6 p-6">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-foreground">{plan.name}</h2>
                                        <p className="mt-2 text-3xl font-bold text-foreground">{plan.priceLabel}</p>
                                        <p className="text-sm text-muted-foreground">per year</p>
                                        <p className="mt-2 text-sm font-medium text-foreground">{plan.userLabel}</p>
                                    </div>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        {plan.items.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                    {plan.free ? (
                                        <Magnet wrapperClassName="mt-auto w-full" innerClassName="w-full" padding={70} magnetStrength={5}>
                                            <Button asChild className={`w-full ${ctaGlowClass}`}>
                                                <Link href="/signin">Start on Free</Link>
                                            </Button>
                                        </Magnet>
                                    ) : (
                                        <p className="mt-auto text-sm text-muted-foreground">Billing in the app is not open yet.</p>
                                    )}
                                </div>
                            </BorderGlow>
                        ))}
                    </div>
                )}

                <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground">
                    For 16 or more users,{" "}
                    <a className="font-medium text-primary" href="mailto:kolevegov@gmail.com">
                        write to us
                    </a>
                    . There is no 24/7 support plan.
                </p>
            </div>
        </section>
    )
}
