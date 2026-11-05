import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId"
import { serverApiClient } from "@/src/lib/serverApiClient"
import CagesContainer from "./cages.container"
import type { Cage, CageListAnimal } from "./types"

export default async function CagesPage({ params }: { params: Promise<{ labId: string }> }) {
    const { labId } = await params
    const userId = await getServerAuthenticatedUserId()
    const response = await serverApiClient.get(`/api/cages/${userId}/${labId}`)
    const data = response.data as { cages?: Cage[]; animals?: CageListAnimal[] } | undefined

    return (
        <CagesContainer
            cages={data?.cages ?? []}
            animals={data?.animals ?? []}
            labId={labId}
            userId={userId}
        />
    )
}
