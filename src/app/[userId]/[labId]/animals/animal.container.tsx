"use client";

import type { CreateAnimalData } from "@/src/components/animals/types";
import { AddAnimalDialog } from "@/src/components/animals/add-animal-dialog";
import { AnimalsFilter } from "@/src/components/animals/animals-filter";
import { AnimalsHeader } from "@/src/components/animals/animals-header";
import { AnimalsList } from "@/src/components/animals/animals-list";
import type { AnimalType, AnimalTypes, NewAnimal } from "./types";
import { Button } from "@/src/components/ui/button";
import { apiClient } from "@/src/lib/apiClient";
import { AnimalStatus } from "../../types";
import type { Animal } from "./types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AnimalContainer = ({animals, animalEnums, userId, labId, animalTypes}: AnimalTypes) => {
    const [animalsData, setAnimalsData] = useState<Animal[]>(animals)
    const [animalTypesData, setAnimalTypesData] = useState<AnimalType[]>(animalTypes)
    const [newAnimalType, setNewAnimalType] = useState<AnimalType | null>(null)
    
    const handleAddAnimal = async (data: CreateAnimalData) => {
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
        
    }

    const handleAddAnimalType = async (typeName: string): Promise<string> => {
        
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
    }
    
    const addAnimalTrigger = (
        <AddAnimalDialog 
            onAddAnimalType={handleAddAnimalType}
            animalTypes={animalTypesData}
            onSubmit={handleAddAnimal}
            animalEnums={animalEnums}
            userId={userId}
            labId={labId}
            trigger={
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-1 h-4 w-4" />
                    Add Animal
                </Button>
            }
        />
    )
    
    return (
        <div className="space-y-6">
            <AnimalsHeader addAnimalTrigger={addAnimalTrigger} />
            <div className="grid gap-6 md:grid-cols-[240px_1fr]">
                <AnimalsFilter />
                <AnimalsList animals={animalsData} />
            </div>
        </div>
    )
}

export default AnimalContainer;