"use client"

import { useCallback, useEffect, useRef, useState } from "react";
import AnimalDetailPage from "./animal.record.view";
import type { AnimalPagination } from "../types";
import { apiClient } from "@/src/lib/apiClient";
import type { Animal } from "./types";
import { toast } from "sonner";

export interface RecordContainerProps {
    animalPagination: AnimalPagination;
    animalId: string;
    userId: string;
    animal: Animal;
    labId: string;
}

export default function RecordContainer({userId, labId, animalId, animal, animalPagination}: RecordContainerProps) {
    const [pagination, setPagination] = useState<AnimalPagination>(animalPagination);
    const [animalData, setAnimalData] = useState(animal);

    const paginationRef = useRef(pagination)
    paginationRef.current = pagination

    useEffect(() => {
        let cancelled = false
        async function loadAnimalFromApi() {
            try {
                const pg = paginationRef.current
                const response = await apiClient.get(
                    `/api/animals/animal/${userId}/${labId}/${animalId}/${pg.pageSize}/${pg.currentPage}`,
                )
                if (cancelled) return
                setPagination(response.pagination)
                setAnimalData(response.data)
            } catch {
                /* keep SSR snapshot */
            }
        }
        void loadAnimalFromApi()
        return () => {
            cancelled = true
        }
    }, [userId, labId, animalId])

    const handleUpdateDataPagination = useCallback(async (data: {page?: number, pageSize?: number}) => {
        const response = await apiClient.get(`/api/animals/animal/${userId}/${labId}/${animalId}/${data.pageSize || pagination.pageSize}/${data.page || pagination.currentPage}`)
        setPagination(response.pagination)
        setAnimalData(response.data)
    }, [userId, labId, animalId, pagination])

    const reloadAnimal = useCallback(async () => {
        const response = await apiClient.get(
            `/api/animals/animal/${userId}/${labId}/${animalId}/${pagination.pageSize}/${pagination.currentPage}`,
        )
        setPagination(response.pagination)
        setAnimalData(response.data)
    }, [userId, labId, animalId, pagination.pageSize, pagination.currentPage])

    const handleArchiveAnimal = useCallback(async () => {
        try {
            const res = await apiClient.post(`/api/animals/animal/${userId}/${labId}/${animalId}/archive`, {})
            if (res?.success) {
                toast.success("Animal archived")
                await reloadAnimal()
            } else {
                toast.error((res as { message?: string })?.message ?? "Failed to archive")
            }
        } catch {
            toast.error("Failed to archive")
        }
    }, [userId, labId, animalId, reloadAnimal])

    const handleUnarchiveAnimal = useCallback(async () => {
        try {
            const res = await apiClient.post(`/api/animals/animal/${userId}/${labId}/${animalId}/unarchive`, {})
            if (res?.success) {
                toast.success("Animal unarchived")
                await reloadAnimal()
            } else {
                toast.error((res as { message?: string })?.message ?? "Failed to unarchive")
            }
        } catch {
            toast.error("Failed to unarchive")
        }
    }, [userId, labId, animalId, reloadAnimal])

    return (
        <AnimalDetailPage
            handleUpdateDataPagination={handleUpdateDataPagination}
            handleUnarchiveAnimal={handleUnarchiveAnimal}
            handleArchiveAnimal={handleArchiveAnimal}
            pagination={pagination}
            animalId={animalId}
            animal={animalData}
            userId={userId}
            labId={labId}
        />
    )
}