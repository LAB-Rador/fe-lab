import LaboratoriesContainer from "./labs.container";
import { serverApiClient } from "@/src/lib/serverApiClient";
import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId";

export default async function Page() {
    const userId = await getServerAuthenticatedUserId()
    const [laboratoriesRes, userRes] = await Promise.all([
        serverApiClient.get(`/api/laboratories/${userId}`),
        serverApiClient.get(`/api/auth/validate`),
    ])
    return (
        <LaboratoriesContainer
            userLaboratories={laboratoriesRes.data}
            initialUser={userRes.user}
        />
    )
}
