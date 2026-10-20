import LaboratoriesContainer from "./labs.container";
import { serverApiClient } from "@/src/lib/serverApiClient";
import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId";
import type { UserInfo } from "./types";

export default async function Page() {
    const userId = await getServerAuthenticatedUserId()
    const [laboratoriesRes, userRes] = await Promise.all([
        serverApiClient.get(`/api/laboratories/${userId}`),
        serverApiClient.get(`/api/users/${userId}`),
    ])
    const record = userRes.data
    const initialUser: UserInfo = {
        userId: record.id,
        confirmedEmail: record.confirmedEmail,
        institution: record.institution,
        contactPhone: record.contactPhone,
        createdAt: record.createdAt,
        firstName: record.firstName,
        lastName: record.lastName,
        address: record.address,
        email: record.email,
    }
    return (
        <LaboratoriesContainer
            userLaboratories={laboratoriesRes.data}
            initialUser={initialUser}
        />
    )
}
