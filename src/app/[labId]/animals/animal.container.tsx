"use client";

import type { AnimalPagination, AnimalType, AnimalTypes, FiltersType, NewAnimal } from "./types";
import { EditAnimalDialog } from "@/src/components/animals/edit-animal-dialog";
import { AddAnimalDialog } from "@/src/components/animals/add-animal-dialog";
import { AnimalsFilter } from "@/src/components/animals/animals-filter";
import { AnimalsHeader } from "@/src/components/animals/animals-header";
import { useCallback, useEffect, useOptimistic, useState, startTransition } from "react";
import type { CreateAnimalData } from "@/src/components/animals/types";
import { AnimalsList } from "@/src/components/animals/animals-list";
import { useMediaQuery } from "@/src/components/sidebar-provider";
import { AnimalStatus } from "../../account/types";
import { apiClient } from "@/src/lib/apiClient";
import type { Animal } from "./types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

type OptimisticAnimalAction = 
| { type: "add", animal: Animal }
| { type: "update", animal: Animal }
| { type: "remove", id: string }

const AnimalContainer = ({animals, animalEnums, userId, labId, animalTypes, animalPagination}: AnimalTypes) => {
    const [animalTypesData, setAnimalTypesData] = useState<AnimalType[]>(animalTypes)
    const [pagination, setPagination] = useState<AnimalPagination>(animalPagination)
    const [newAnimalType, setNewAnimalType] = useState<AnimalType | null>(null)
    const [includeArchivedAnimals, setIncludeArchivedAnimals] = useState(false)
    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null)
    const [openEditAnimalDialog, setOpenEditAnimalDialog] = useState(false)
    const [openAddAnimalDialog, setOpenAddAnimalDialog] = useState(false)
    const [animalsData, setAnimalsData] = useState<Animal[]>(animals)
    const [animalSearch, setAnimalSearch] = useState<string>("")
    const [filterView, setFilterView] = useState<boolean>(false)
    const [filters, setFilters] = useState<FiltersType>({})
    const isMobile = useMediaQuery("(max-width: 768px)");

    const [optimisticAnimals, applyOptimisticAnimal] = useOptimistic(
        animalsData,
        (state, action: OptimisticAnimalAction) => {
            switch (action.type) {
                case "add":
                    return [...state, action.animal]
                case "update":
                    return state.map((animal) => animal.id === action.animal.id ? action.animal : animal)
                case "remove":
                    return state.filter((animal) => animal.id !== action.id)
                default:
                    return state
            }
        }
    )

    useEffect(() => {
        if (isMobile) {
          setFilterView(false)
        } else {
          setFilterView(true)
        }
      }, [isMobile]);

    const handleUpdateDataPagination = useCallback(async (data: {page?: number, pageSize?: number, filters?: any}) => {
        const baseFilters =
            data.filters !== undefined ? { ...filters, ...data.filters } : { ...filters }
        const mergedForRequest: FiltersType = { ...baseFilters }
        if (includeArchivedAnimals) {
            mergedForRequest.includeArchived = true
        } else {
            delete mergedForRequest.includeArchived
        }
        const response = await apiClient.get(`/api/animals/${userId}/${labId}/${data.pageSize || pagination.pageSize}/${data.page || pagination.currentPage}/${JSON.stringify(mergedForRequest)}`)
        setPagination(response.pagination)
        setAnimalsData(response.data)
        if (data.filters !== undefined) {
            setFilters({ ...filters, ...data.filters })
        }
    }, [userId, labId, pagination, filters, includeArchivedAnimals])

    const onIncludeArchivedAnimalsChange = useCallback(
        (value: boolean) => {
            setIncludeArchivedAnimals(value)
            void (async () => {
                const mergedForRequest: FiltersType = { ...filters }
                if (value) {
                    mergedForRequest.includeArchived = true
                } else {
                    delete mergedForRequest.includeArchived
                }
                const response = await apiClient.get(
                    `/api/animals/${userId}/${labId}/${pagination.pageSize}/1/${JSON.stringify(mergedForRequest)}`,
                )
                setPagination(response.pagination)
                setAnimalsData(response.data)
            })()
        },
        [userId, labId, pagination.pageSize, filters],
    )

    const handleSearch = useCallback((search: string) => {
        setAnimalSearch(search)

        const filteredAnimals = animals.filter((animal) => {
            return animal.sex?.toLowerCase().includes(search.toLowerCase()) || animal.sex === null
            || animal.animalType?.name?.toLowerCase().includes(search.toLowerCase())
            || animal.identifier.toLowerCase().includes(search.toLowerCase())
            || animal.genotype?.toLowerCase().includes(search.toLowerCase())
            || animal.location?.toLowerCase().includes(search.toLowerCase())
            || animal.status?.toLowerCase().includes(search.toLowerCase())
            || animal.strain?.toLowerCase().includes(search.toLowerCase())
            || animal.name?.toLowerCase().includes(search.toLowerCase()) 
        })

        setAnimalsData(filteredAnimals)
    }, [animals])

    const handleAddAnimal = useCallback(async (data: CreateAnimalData) => {
        const tempId = uuidv4();
        
        const optimisticRow: Animal = {
            id: tempId,
            animalType: {
                description: "",
                laboratoryId: labId,
                name: "",
            },
            laboratory: {
                id: data.laboratoryId,
                name: labId,
            },
            identifier: data.identifier,
            laboratoryId: data.laboratoryId,
            animalTypeId: data.animalTypeId === "null" ? "" : data.animalTypeId,
            name: data.name,
            birthDate: data.birthDate?.toISOString().split('T')[0], // Конвертируем в строку формата YYYY-MM-DD
            acquisitionDate: data.acquisitionDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
            sex: data.sex,
            strain: data.strain,
            genotype: data.genotype,
            status: (data.status as any) || AnimalStatus.ACTIVE,
            location: data.location,
            origin: data.origin,
        }

        const previousSnapshot = animalsData

        startTransition(() => {
            applyOptimisticAnimal({ type: "add", animal: optimisticRow })
            setAnimalsData((prev) => [...prev, optimisticRow])
        })

        try {
            const newAnimal: NewAnimal = {
                userId: userId,
                identifier: data.identifier,
                laboratoryId: data.laboratoryId,
                newAnimalType: {
                    name: newAnimalType?.name || "",
                    description: newAnimalType?.description || ""
                },
                customFields: [],
                animalTypeId: data.animalTypeId === "null" ? "" : data.animalTypeId,
                name: data.name,
                birthDate: data.birthDate?.toISOString().split('T')[0], // Конвертируем в строку формата YYYY-MM-DD
                acquisitionDate: data.acquisitionDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
                sex: data.sex,
                strain: data.strain,
                genotype: data.genotype,
                status: (data.status as any) || AnimalStatus.ACTIVE,
                location: data.location,
                origin: data.origin,
            }

            const response = await apiClient.post(`/api/animals`, newAnimal);
            toast(response.message || response.error, {
                description: `${newAnimal.identifier} - ${newAnimal.name}`
            });
            if(response.success && response.data) {
                setAnimalsData((prev) => [
                    ...prev.filter((animal) => animal.id !== tempId),
                    response.data as Animal
                ])
            } else {
                setAnimalsData(previousSnapshot)
            }
        } catch (error) {
            console.error("Error adding animal:", error)
            setAnimalsData(previousSnapshot)
        }  
    }, [userId, labId, newAnimalType, applyOptimisticAnimal, animalsData])

    const handleEditAnimal = useCallback(async (data: CreateAnimalData) => {
        if(!data.id) return;

        const previous = animalsData.find((animal) => animal.id === data.id);

        if(!previous) return;

        const previousSnapshot = animalsData

        const optimisticUpdated: Animal = {
            ...previous,
            identifier: data.identifier,
            name: data.name,
            strain: data.strain,
            genotype: data.genotype,
            location: data.location,
            origin: data.origin,
            sex: data.sex,
            status: (data.status as AnimalStatus) ?? previous.status,
        }

        startTransition(() => {
            applyOptimisticAnimal({ type: "update", animal: optimisticUpdated })
            setAnimalsData((prev) =>
                prev.map((animal) => (animal.id === data.id ? optimisticUpdated : animal)),
            )
        })

        try {
            const newAnimal: NewAnimal = {
                id: data.id,
                userId: userId,
                identifier: data.identifier,
                laboratoryId: data.laboratoryId,
                newAnimalType: {
                    name: newAnimalType?.name || "",
                    description: newAnimalType?.description || ""
                },
                customFields: [],
                animalTypeId: data.animalTypeId === "null" ? "" : data.animalTypeId,
                name: data.name,
                birthDate: data.birthDate?.toISOString().split('T')[0],
                acquisitionDate: data.acquisitionDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
                sex: data.sex,
                strain: data.strain,
                genotype: data.genotype,
                status: (data.status as any) || AnimalStatus.ACTIVE,
                location: data.location,
                origin: data.origin,
            }

            const response = await apiClient.put(`/api/animals`, newAnimal);
            toast(response.message || response.error, {
                description: `${newAnimal.identifier} - ${newAnimal.name}`
            });
            if(response.success && response.data) {
                setAnimalsData((prev) => 
                    prev.map((animal) => animal.id === data.id ? (response.data as Animal) : animal)
                )
            } else {
                setAnimalsData(previousSnapshot)
            }
        } catch (error) {
            console.error("Error editing animal:", error)
            setAnimalsData(previousSnapshot)
        }
    }, [userId, labId, newAnimalType, animalsData, applyOptimisticAnimal])

    const handleArchiveAnimalRow = useCallback(
        async (animalId: string) => {
            startTransition(() => {
                applyOptimisticAnimal({ type: "remove", id: animalId })
                setAnimalsData((prev) => prev.filter((animal) => animal.id !== animalId))
            })
            
            try {
                const res = await apiClient.post(`/api/animals/animal/${userId}/${labId}/${animalId}/archive`, {})
                if (res?.success) {
                    toast.success("Animal archived")
                    await handleUpdateDataPagination({})
                } else {
                    toast.error((res as { message?: string })?.message ?? "Failed to archive")
                }
            } catch {
                toast.error("Failed to archive")
            }
        },
        [userId, labId, handleUpdateDataPagination, applyOptimisticAnimal],
    )

    const handleUnarchiveAnimalRow = useCallback(
        async (animalId: string) => {
            try {
                const res = await apiClient.post(`/api/animals/animal/${userId}/${labId}/${animalId}/unarchive`, {})
                if (res?.success) {
                    toast.success("Animal unarchived")
                    await handleUpdateDataPagination({})
                } else {
                    toast.error((res as { message?: string })?.message ?? "Failed to unarchive")
                }
            } catch {
                toast.error("Failed to unarchive")
            }
        },
        [userId, labId, handleUpdateDataPagination],
    )

    const handleAddAnimalType = useCallback(async (typeName: string): Promise<string> => {
        
        const newAnimalType: AnimalType = {
            id: "",
            name: typeName,
            description: `New animal type: ${typeName}`,
            laboratoryId: labId,
        }

        setAnimalTypesData((prev) => [...prev, newAnimalType])
        setNewAnimalType(newAnimalType)
        console.log("Creating new animal type:", newAnimalType)

        return typeName
    }, [labId, animalTypesData])

    return (
        <div className="space-y-6">
            <EditAnimalDialog 
                onAddAnimalType={handleAddAnimalType}
                setOpen={setOpenEditAnimalDialog}
                submitButtonText={"Edit Animal"}
                selectedAnimal={selectedAnimal}
                animalTypes={animalTypesData}
                loadingButtonText={"Editing"}
                onSubmit={handleEditAnimal}
                open={openEditAnimalDialog}
                animalEnums={animalEnums}
                userId={userId}
                labId={labId}
            />
            <AddAnimalDialog 
                onAddAnimalType={handleAddAnimalType}
                setOpen={setOpenAddAnimalDialog}
                submitButtonText={"Add Animal"}
                animalTypes={animalTypesData}
                loadingButtonText={"Adding"}
                open={openAddAnimalDialog}
                onSubmit={handleAddAnimal}
                animalEnums={animalEnums}
                userId={userId}
                labId={labId}
            />
            <AnimalsHeader
                setOpen={setOpenAddAnimalDialog}
                setFilterView={setFilterView}
                handleSearch={handleSearch}
                animalSearch={animalSearch}
            />
            <div className="grid gap-6 md:grid-cols-[240px_1fr]">
                {filterView && 
                    <AnimalsFilter
                        handleUpdateDataPagination={handleUpdateDataPagination}
                        animalTypes={animalTypesData}
                        animalEnums={animalEnums}
                        setFilters={setFilters}
                        includeArchived={includeArchivedAnimals}
                        onIncludeArchivedChange={onIncludeArchivedAnimalsChange}
                    />
                }
                <AnimalsList
                    handleArchiveAnimalRow={handleArchiveAnimalRow}
                    handleUnarchiveAnimalRow={handleUnarchiveAnimalRow}
                    handleUpdateDataPagination={handleUpdateDataPagination}
                    setSelectedAnimal={setSelectedAnimal}
                    setOpen={setOpenEditAnimalDialog}
                    setPagination={setPagination}
                    animalPagination={pagination}
                    animals={optimisticAnimals}
                />
            </div>
        </div>
    )
}

export default AnimalContainer;