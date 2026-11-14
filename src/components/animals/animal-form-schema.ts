import { z } from "zod"
import { AnimalStatus, Sex } from "./types"

export const addAnimalFormSchema = z.object({
    identifier: z.string().min(1, "Identifier is required").max(50, "Identifier must be less than 50 characters"),
    name: z.string().optional(),
    animalTypeId: z.string().min(1, "Animal type is required"),
    laboratoryId: z.string().min(1, "Laboratory is required"),
    birthDate: z.date().optional(),
    acquisitionDate: z.date().optional(),
    sex: z.nativeEnum(Sex).optional(),
    strain: z.string().optional(),
    genotype: z.string().optional(),
    status: z.nativeEnum(AnimalStatus).optional(),
    location: z.string().optional(),
    origin: z.string().optional(),
})

export type AddAnimalFormValues = z.infer<typeof addAnimalFormSchema>

export const editAnimalFormSchema = addAnimalFormSchema.extend({
    id: z.string(),
})

export type EditAnimalFormValues = z.infer<typeof editAnimalFormSchema>
