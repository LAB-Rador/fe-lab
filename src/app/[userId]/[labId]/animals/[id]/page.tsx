"use server"

import RecordContainer from "./record.container";
import { apiClient } from "@/src/lib/apiClient";

export default async function RecordPage({params}: {params: {userId: string, labId: string, id: string}}) {
    const {userId, labId, id: animalId} = await params;
    const rows = 10;
    const page = 1;
    const animal = await apiClient.get(`/api/animals/animal/${userId}/${labId}/${animalId}/${rows}/${page}`);
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
