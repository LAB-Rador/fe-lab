import type { AnimalStatus, AnimalType, Laboratory, Sex } from "@/src/components/animals/types";

export interface PageProps {
    params: {
        labId: string;
        id: string
    }
}

export interface AnimalExperimentParticipation {
    id: string;
    experimentId: string;
    animalId: string;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    experiment: {
        id: string;
        title: string;
        status: string;
        startDate: string;
        endDate: string | null;
        createdBy: {
            firstName: string | null;
            lastName: string | null;
        };
    };
}

export interface Animal {
    acquisitionDate: string;
    animalType: AnimalType;
    laboratory: Laboratory;
    records: AnimalRecord[];
    status: AnimalStatus;
    animalTypeId: string;
    laboratoryId: string;
    experimentAnimals?: AnimalExperimentParticipation[];
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

export interface AnimalRecord {
    activityLevel: string;
    animalId: string;
    createdAt: string;
    createdById: string;
    date: string;
    feedIntake: number;
    id: string;
    measurements: AnimalRecordMeasurement[];
    notes: string;
    recordType: string;
    temperature: number;
    updatedAt: string;
    waterIntake: number;
    weight: number;
}

export interface AnimalRecordMeasurement {
    createdAt: string;
    id: string;
    parameter: string;
    recordId: string;
    unit: string;
    value: number;
}