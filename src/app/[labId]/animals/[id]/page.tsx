"use server"

import RecordContainer from "./record.container";
import { serverApiClient } from "@/src/lib/serverApiClient";
import type { PageProps } from "./types";
import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId";

export default async function RecordPage({params}: PageProps) {
    const {labId, id: animalId} = await params;
    const userId = await getServerAuthenticatedUserId()
    const rows = 10;
    const page = 1;
    const animal = await serverApiClient.get(`/api/animals/animal/${userId}/${labId}/${animalId}/${rows}/${page}`);
    return (
        <RecordContainer
            animalPagination={animal.pagination}
            animal={animal.data}
            animalId={animalId}
            userId={userId}
            labId={labId}
        />
    )
}
