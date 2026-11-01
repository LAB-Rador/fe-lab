import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import type { LabSubscription } from "@/src/app/[labId]/settings/types"
import { Progress } from "@/src/components/ui/progress"
import { Badge } from "@/src/components/ui/badge"

function formatDate(value: string | null) {
    if (!value) return "—"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "—"
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

export function SubscriptionSettings({ subscription }: { subscription: LabSubscription | null }) {
    const planName = subscription?.planName
    const maxUsers = subscription?.maxUsers
    const hasPlan = Boolean(planName && maxUsers !== null && maxUsers !== undefined)
    const memberCount = subscription?.memberCount ?? 0
    const limit = maxUsers ?? 0
    const usedPercent = limit > 0 ? Math.round((memberCount / limit) * 100) : 0

    return (
        <Card>
            <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <CardTitle className="text-lg">Subscription</CardTitle>
                        <CardDescription>
                            {hasPlan ? "The plan for this laboratory." : "This laboratory has no subscription."}
                        </CardDescription>
                    </div>
                    {hasPlan ? <Badge className="bg-blue-600">{planName}</Badge> : null}
                </div>
            </CardHeader>
            {hasPlan ? (
                <CardContent className="space-y-6 p-6">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Users</h3>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-gray-900">{memberCount} of {limit}</p>
                            <span className="text-xs text-gray-500">{usedPercent}%</span>
                        </div>
                        <Progress value={Math.min(usedPercent, 100)} className="h-2" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Started</p>
                            <p className="text-sm text-gray-900">{formatDate(subscription?.startDate ?? null)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Ends</p>
                            <p className="text-sm text-gray-900">{formatDate(subscription?.endDate ?? null)}</p>
                        </div>
                    </div>
                </CardContent>
            ) : null}
        </Card>
    )
}
