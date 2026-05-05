"use server";

import LaboratoriesContainer from "./labs.container";
import { apiClient } from "@/src/lib/apiClient";
import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId";

export default async function Page() {
    const userId = await getServerAuthenticatedUserId()
    const laboratories = await apiClient.get(`/api/laboratories/${userId}`);
    return (
        <LaboratoriesContainer
            userLaboratories={laboratories.data}
        />
    )
}
