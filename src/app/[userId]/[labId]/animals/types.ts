import type { AgeGroup } from "@/src/components/animals/types";
import type { AnimalStatus, Sex } from "../../types";

export interface Animal {
    acquisitionDate: string;
    animalType: AnimalType;
    laboratory: Laboratory;
    status: AnimalStatus;
    animalTypeId: string;
    laboratoryId: string;
    birthDate?: string;
    identifier: string;
    genotype?: string;
    location?: string;
    strain?: string;
    origin?: string;
    name?: string;
    id?: string;
    sex?: Sex;
}

export interface AnimalType {
    description: string | null;
    laboratoryId: string;
    createdAt?: string;
    updatedAt?: string;
    name: string;
    id?: string;
}

export interface Laboratory {
    id?: string
    name?: string
    code?: string
}

export interface NewAnimalType {
    name: string;
    description: string;
}

export interface NewAnimal {
    newAnimalType: NewAnimalType;
    acquisitionDate: string;
    status: AnimalStatus;
    animalTypeId: string;
    laboratoryId: string;
    birthDate?: string;
    identifier: string;
    genotype?: string;
    location?: string;
    customFields: [];
    strain?: string;
    origin?: string;
    userId: string;
    name?: string;
    id?: string;
    sex?: Sex;
}

export interface AnimalPagination {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    currentPage: number;
    totalCount: number;
    totalPages: number;
    pageSize: number;
}

export interface AnimalEnums {
    status: AnimalStatus[];
    sex: Sex[];
}

export interface AnimalTypes {
    animalPagination: AnimalPagination;
    animalTypes: AnimalType[];
    animalEnums: AnimalEnums;
    animals: Animal[];
    userId: string;
    labId: string;
}

export interface FiltersType {
    statuses?: AnimalStatus[];
    animalTypes?: string[];
    ageGroups?: AgeGroup[];
    sex?: Sex | null;
  }