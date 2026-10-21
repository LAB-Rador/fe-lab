import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId"
import { serverApiClient } from "@/src/lib/serverApiClient"
import BreedingContainer from "./breeding.container"
import type { BreedingPair } from "./types"

export default async function BreedingPage({ params }: { params: Promise<{ labId: string }> }) {
    const { labId } = await params
    const userId = await getServerAuthenticatedUserId()
    const response = await serverApiClient.get(`/api/breedings/${userId}/${labId}`)

    return (
        <BreedingContainer
            breedings={(response.data ?? []) as BreedingPair[]}
            labId={labId}
            userId={userId}
        />
    )
}
