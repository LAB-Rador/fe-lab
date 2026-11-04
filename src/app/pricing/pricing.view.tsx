import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
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
        <section className="bg-white py-16">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <h1 className="text-4xl font-bold text-gray-900">Pricing</h1>
                    <p className="mt-4 text-lg text-gray-600">
                        One yearly price in USD for every country. Each subscription covers one laboratory.
                        A second laboratory needs its own subscription.
                    </p>
                </div>

                {error ? (
                    <p className="text-center text-sm text-red-600">{error}</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
                        {plans.map((plan) => (
                            <Card key={plan.name} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle>{plan.name}</CardTitle>
                                    <p className="text-3xl font-bold text-gray-900">{plan.priceLabel}</p>
                                    <p className="text-sm text-gray-500">per year</p>
                                    <p className="text-sm font-medium text-gray-700">{plan.userLabel}</p>
                                </CardHeader>
                                <CardContent className="flex flex-1 flex-col gap-6">
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        {plan.items.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                    {plan.free ? (
                                        <Button asChild className="mt-auto w-full bg-[#2563EB] hover:bg-[#2563EB]/90">
                                            <Link href="/signin">Start on Free</Link>
                                        </Button>
                                    ) : (
                                        <p className="mt-auto text-sm text-gray-500">Billing in the app is not open yet.</p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-gray-600">
                    For 16 or more users,{" "}
                    <a className="font-medium text-[#2563EB]" href="mailto:kolevegov@gmail.com">
                        write to us
                    </a>
                    . There is no 24/7 support plan.
                </p>
            </div>
        </section>
    )
}
