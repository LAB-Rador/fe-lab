"use client";

import type { AnimalPagination, AnimalType, AnimalTypes, FiltersType, NewAnimal } from "./types";
import { EditAnimalDialog } from "@/src/components/animals/edit-animal-dialog";
import { AddAnimalDialog } from "@/src/components/animals/add-animal-dialog";
import { AnimalsFilter } from "@/src/components/animals/animals-filter";
import { AnimalsHeader } from "@/src/components/animals/animals-header";
import type { CreateAnimalData } from "@/src/components/animals/types";
import { AnimalsList } from "@/src/components/animals/animals-list";
import { AnimalStatus } from "../../account/types";
import { apiClient } from "@/src/lib/apiClient";
import { useCallback, useState } from "react";
import type { Animal } from "./types";
import { toast } from "sonner";

const AnimalContainer = ({animals, animalEnums, userId, labId, animalTypes, animalPagination}: AnimalTypes) => {
    const [animalTypesData, setAnimalTypesData] = useState<AnimalType[]>(animalTypes)
    const [pagination, setPagination] = useState<AnimalPagination>(animalPagination)
    const [newAnimalType, setNewAnimalType] = useState<AnimalType | null>(null)
    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null)
    const [openEditAnimalDialog, setOpenEditAnimalDialog] = useState(false)
    const [openAddAnimalDialog, setOpenAddAnimalDialog] = useState(false)
    const [animalsData, setAnimalsData] = useState<Animal[]>(animals)
    const [animalSearch, setAnimalSearch] = useState<string>("")
    const [filters, setFilters] = useState<FiltersType>({})

    const handleUpdateDataPagination = useCallback(async (data: {page?: number, pageSize?: number, filters?: any}) => {
        const response = await apiClient.get(`/api/animals/${userId}/${labId}/${data.pageSize || pagination.pageSize}/${data.page || pagination.currentPage}/${JSON.stringify(data.filters) || JSON.stringify(filters)}`)
        setPagination(response.pagination)
        setAnimalsData(response.data)
    }, [userId, labId, pagination, filters])

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
                // Предполагаем, что сервер возвращает полный объект Animal в response.data
                setAnimalsData((prev) => [...prev, response.data as Animal])
            }
        } catch (error) {
            console.error("Error adding animal:", error)
        }  
    }, [userId, labId, newAnimalType, animalsData])

    const handleEditAnimal = useCallback(async (data: CreateAnimalData) => {
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
                birthDate: data.birthDate?.toISOString().split('T')[0], // Конвертируем в строку формата YYYY-MM-DD
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
                // Предполагаем, что сервер возвращает полный объект Animal в response.data
                const updatedAnimals = animalsData.filter((animal) => {
                    return animal.id !== newAnimal.id
                });
                setAnimalsData((prev) => [...updatedAnimals, response.data as Animal])
            }
        } catch (error) {
            console.error("Error adding animal:", error)
        }
    }, [userId, labId, newAnimalType, animalsData])

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
                handleSearch={handleSearch}
                animalSearch={animalSearch}
            />
            <div className="grid gap-6 md:grid-cols-[240px_1fr]">
                <AnimalsFilter
                    handleUpdateDataPagination={handleUpdateDataPagination}
                    animalTypes={animalTypesData}
                    animalEnums={animalEnums}
                    setFilters={setFilters}
                />
                <AnimalsList
                    handleUpdateDataPagination={handleUpdateDataPagination}
                    setSelectedAnimal={setSelectedAnimal}
                    setOpen={setOpenEditAnimalDialog}
                    setPagination={setPagination}
                    animalPagination={pagination}
                    animals={animalsData}
                />
            </div>
        </div>
    )
}

export default AnimalContainer;