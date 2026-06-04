"use client"

import { useCallback, useEffect, useRef, useState } from "react";
import { type Animal, AnimalTabsName } from "./types";
import AnimalDetailPage from "./animal.record.view";
import type { AnimalPagination } from "../types";
import { apiClient } from "@/src/lib/apiClient";
import { toast } from "sonner";

export interface RecordContainerProps {
    animalPagination: AnimalPagination;
    animalId: string;
    userId: string;
    animal: Animal;
    labId: string;
}

export default function RecordContainer({userId, labId, animalId, animal, animalPagination}: RecordContainerProps) {
    const [activeTab, setActiveTab] = useState<AnimalTabsName>(AnimalTabsName.BASIC_INFO);
    const [pagination, setPagination] = useState<AnimalPagination>(animalPagination);
    const [animalData, setAnimalData] = useState(animal);

    const paginationRef = useRef(pagination)
    paginationRef.current = pagination

    useEffect(() => {
        setPagination(animalPagination)
        setAnimalData(animal)
    }, [animalPagination, animal])

    const fetchAnimalPage = useCallback(
        async(page?: number, pageSize?: number) => {
            const response = await apiClient.get(
                `/api/animals/animal/${userId}/${labId}/${animalId}/${pageSize}/${page}`,
            )
            setPagination(response.pagination)
            setAnimalData(response.data)
            return response
        },
        [userId, labId, animalId]
    )

    const handleUpdateDataPagination = useCallback(async (data: {page?: number, pageSize?: number}) => {
        const page = data.page ?? paginationRef.current.currentPage
        const pageSize = data.pageSize ?? paginationRef.current.pageSize
        await fetchAnimalPage(page, pageSize)
    }, [fetchAnimalPage])

    const reloadAnimal = useCallback(async () => {
        const pg = paginationRef.current
        await fetchAnimalPage(pg.currentPage, pg.pageSize)
    }, [fetchAnimalPage])

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
            setActiveTab={setActiveTab}
            pagination={pagination}
            activeTab={activeTab}
            animalId={animalId}
            animal={animalData}
            userId={userId}
            labId={labId}
        />
    )
}