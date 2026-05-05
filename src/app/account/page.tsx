"use server";

import LaboratoriesContainer from "./labs.container";
import { serverApiClient } from "@/src/lib/serverApiClient";
import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId";

export default async function Page() {
    const userId = await getServerAuthenticatedUserId()
    const laboratories = await serverApiClient.get(`/api/laboratories/${userId}`);
    return (
        <LaboratoriesContainer
            userLaboratories={laboratories.data}
        />
    )
}
