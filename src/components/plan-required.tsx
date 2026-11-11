export function PlanRequired({ feature }: { feature: string }) {
    return (
        <div className="mx-auto max-w-lg py-16 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Not included in this plan</h1>
            <p className="mt-2 text-gray-500">{feature} is available on Starter and above.</p>
        </div>
    )
}
