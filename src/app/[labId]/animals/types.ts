import type { AccessStatus, AnimalStatus, Role, Sex } from "../../account/types";
import type { AgeGroup } from "@/src/components/animals/types";
import type { TaskStatus } from "../tasks/types";

export interface PageProps {
    params: {
        userId: string;
        labId: string;
    }
}

export interface Animal {
    archivedAt?: string | null;
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
    cage?: { id: string; name: string } | null;
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
    experimentStatus: ExperimentStatus[];
    activityLevel: ActivityLevel[];
    accessStatus: AccessStatus[]
    recordType: RecordType[];
    taskStatus: TaskStatus[];
    status: AnimalStatus[];
    role: Role[];
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
    includeArchived?: boolean;
}

export enum RecordType {
    ROUTINE_CHECK = "ROUTINE_CHECK",
    OBSERVATION = "OBSERVATION",
    MEDICATION = "MEDICATION",
    TREATMENT = "TREATMENT",
    EMERGENCY = "EMERGENCY",
    SAMPLING = "SAMPLING",
}

export function recordTypeFromQuery(value: string | undefined): RecordType {
    if (value && (Object.values(RecordType) as string[]).includes(value)) {
        return value as RecordType
    }
    return RecordType.ROUTINE_CHECK
}

export function newAnimalRecordPath(labId: string, animalId: string, recordType?: RecordType) {
    const path = `/${labId}/animals/${animalId}/measurements/new`
    return recordType ? `${path}?recordType=${recordType}` : path
}

export enum ActivityLevel {
    VERY_HIGH = "VERY_HIGH",
    VERY_LOW = "VERY_LOW",
    NORMAL = "NORMAL",
    HIGH = "HIGH",
    LOW = "LOW",
}

export enum ExperimentStatus {
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    PLANNED = "PLANNED",
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
}
