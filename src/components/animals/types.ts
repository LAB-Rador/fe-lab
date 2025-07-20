export enum Sex {
    MALE = "MALE",
    FEMALE = "FEMALE",
    UNKNOWN = "UNKNOWN",
}
  
export enum AnimalStatus {
    ACTIVE = "ACTIVE",
    QUARANTINE = "QUARANTINE",
    EXPERIMENT = "EXPERIMENT",
    BREEDING = "BREEDING",
    DECEASED = "DECEASED",
    TRANSFERRED = "TRANSFERRED",
    RETIRED = "RETIRED",
}

export enum AgeGroup {
    JUVENILE = "JUVENILE",
    YOUNG_ADULT = "YOUNG_ADULT",
    ADULT = "ADULT",
    SENIOR = "SENIOR",
}
  
export interface Animal {
    animalType: AnimalType;
    laboratory: Laboratory;
    acquisitionDate: string;
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
    sex?: Sex;
    id?: string;
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
  
export interface CreateAnimalData {
    acquisitionDate?: Date;
    status?: AnimalStatus;
    animalTypeId: string;
    laboratoryId: string;
    identifier: string;
    genotype?: string;
    location?: string;
    birthDate?: Date;
    strain?: string;
    origin?: string;
    name?: string;
    id?: string;
    sex?: Sex;
}
