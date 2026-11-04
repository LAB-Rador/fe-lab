import { Footer } from "@/src/components/landing/footer"
import { Header } from "@/src/components/landing/header"
import { PricingView, type PricingPlan } from "./pricing.view"

function userLabel(maxUsers: number) {
    return maxUsers === 1 ? "1 user" : `${maxUsers} users`
}

function readPricingPlan(row: unknown): PricingPlan | null {
    if (!row || typeof row !== "object") return null
    const plan = row as {
        name?: unknown
        price?: unknown
        maxUsers?: unknown
        features?: unknown
    }
    if (typeof plan.name !== "string" || typeof plan.price !== "number" || typeof plan.maxUsers !== "number") {
        return null
    }
    const features = plan.features
    const rawItems = features && typeof features === "object" && !Array.isArray(features)
        ? (features as { items?: unknown }).items
        : null
    const items = Array.isArray(rawItems)
        ? rawItems.filter((item): item is string => typeof item === "string")
        : []
    return {
        name: plan.name,
        priceLabel: `$${plan.price}`,
        userLabel: userLabel(plan.maxUsers),
        items,
        free: plan.price === 0,
    }
}

function getBackendBaseUrl(): string | undefined {
    const local = process.env.NEXT_PUBLIC_LOCAL_DATABASE_URL?.trim()
    const remote = process.env.NEXT_PUBLIC_DATABASE_URL?.trim()
    return local || remote
}

async function getPlans(): Promise<{ plans: PricingPlan[]; error: string | null }> {
    const base = getBackendBaseUrl()
    if (!base) {
        return { plans: [], error: "Plans are unavailable right now." }
    }
    try {
        const response = await fetch(`${base.replace(/\/$/, "")}/api/public/plans`, {
            cache: "no-store",
        })
        if (!response.ok) {
            return { plans: [], error: "Plans are unavailable right now." }
        }
        const body = await response.json()
        if (!body?.success || !Array.isArray(body.data)) {
            return { plans: [], error: "Plans are unavailable right now." }
        }
        const plans = body.data.map(readPricingPlan).filter((plan): plan is PricingPlan => plan !== null)
        if (plans.length === 0) {
            return { plans: [], error: "Plans are unavailable right now." }
        }
        return { plans, error: null }
    } catch {
        return { plans: [], error: "Plans are unavailable right now." }
    }
}

export default async function PricingPage() {
    const { plans, error } = await getPlans()
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main>
                <PricingView plans={plans} error={error} />
            </main>
            <Footer />
        </div>
    )
}
