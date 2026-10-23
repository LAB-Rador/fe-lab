import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import type { LaboratorySubscription } from "@/src/app/[labId]/dashboard/types"
import { Progress } from "@/src/components/ui/progress"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { ArrowUpRight } from "lucide-react"

function formatDate(value: string) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "—"
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

function formatPrice(price: number, currency: string, billingCycle: string) {
    if (price === 0) return "Free"
    const amount = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: currency || "CAD",
    }).format(price)
    const period = billingCycle === "YEARLY" ? "year" : "month"
    return `${amount} / ${period}`
}

function statusLabel(status: string) {
    switch (status) {
        case "ACTIVE":
            return "Active"
        case "TRIAL":
            return "Trial"
        case "PENDING":
            return "Pending"
        case "EXPIRED":
            return "Expired"
        case "CANCELED":
            return "Canceled"
        default:
            return status
    }
}

export function SubscriptionStatus({ laboratorySubscription }: { laboratorySubscription: LaboratorySubscription }) {
    const subscription = laboratorySubscription.subscription
    const memberCount = laboratorySubscription.memberCount
    const maxUsers = subscription?.maxUsers ?? 0
    const usedPercent = maxUsers > 0 ? Math.round((memberCount / maxUsers) * 100) : 0

    return (
        <Card className="w-[315px] md:w-full">
            <CardHeader>
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <CardTitle>Subscription Status</CardTitle>
                        <CardDescription>Your current plan and usage</CardDescription>
                    </div>
                    {subscription ? (
                        <Badge className="bg-blue-600">{subscription.plan.name}</Badge>
                    ) : null}
                </div>
            </CardHeader>
            <CardContent>
                {subscription ? (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-500">Users</h4>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold">{memberCount}/{maxUsers}</p>
                            <span className="text-xs text-gray-500">{usedPercent}%</span>
                        </div>
                        <Progress value={Math.min(usedPercent, 100)} className="h-2" />
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No subscription for this laboratory.</p>
                )}
                <div className="mt-6 flex flex-wrap gap-2 items-center justify-between">
                    <div>
                        {subscription ? (
                            <>
                                <p className="text-sm font-medium">
                                    {subscription.autoRenew ? "Next billing date: " : "Access ends: "}
                                    {formatDate(subscription.endDate)}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatPrice(subscription.plan.price, subscription.plan.currency, subscription.plan.billingCycle)}
                                    {" · "}
                                    {statusLabel(subscription.status)}
                                    {subscription.autoRenew ? " · Renews automatically" : ""}
                                </p>
                            </>
                        ) : (
                            <p className="text-sm font-medium">{memberCount} active members</p>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" type="button">Manage Subscription</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700" type="button">
                            Upgrade Plan
                            <ArrowUpRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
