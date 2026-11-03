import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId"
import { serverApiClient } from "@/src/lib/serverApiClient"
import { readAnimalType, readBreedingProtocol, readLabSubscription, type LabAnimalType, type LabBreedingProtocol, type LabSubscription } from "./types"
import SettingsContainer from "./settings.container"
import { Suspense } from "react"

function readList<T>(response: unknown, read: (row: unknown) => T | null): T[] {
    if (!response || typeof response !== "object" || !("data" in response)) return []
    const data = (response as { data?: unknown }).data
    if (!Array.isArray(data)) return []
    return data.map(read).filter((row): row is T => row !== null)
}

export default async function SettingsPage({ params }: { params: Promise<{ labId: string }> }) {
    const { labId } = await params
    const userId = await getServerAuthenticatedUserId()

    let animalTypes: LabAnimalType[] = []
    let protocols: LabBreedingProtocol[] = []
    let subscription: LabSubscription | null = null
    let error: string | null = null

    try {
        const typesResponse = await serverApiClient.get(`/api/animals/types/${userId}/${labId}`)
        animalTypes = readList(typesResponse, readAnimalType)
    } catch (cause) {
        error = cause instanceof Error ? cause.message : "Could not load animal types."
    }

    try {
        const protocolsResponse = await serverApiClient.get(`/api/breedings/${userId}/${labId}/protocols`)
        protocols = readList(protocolsResponse, readBreedingProtocol)
    } catch (cause) {
        error = error ?? (cause instanceof Error ? cause.message : "Could not load breeding protocols.")
    }

    try {
        const subscriptionResponse = await serverApiClient.get(`/api/subscriptions/${userId}/${labId}`)
        subscription = readLabSubscription(subscriptionResponse)
    } catch (cause) {
        error = error ?? (cause instanceof Error ? cause.message : "Could not load the subscription.")
    }

    return (
        <Suspense>
            <SettingsContainer
                userId={userId}
                labId={labId}
                animalTypes={animalTypes}
                protocols={protocols}
                subscription={subscription}
                error={error}
            />
        </Suspense>
    )
}
