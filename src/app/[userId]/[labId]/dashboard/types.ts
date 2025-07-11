import type { AnimalStatus, AnimalType, ExperimentStatus, Laboratory, Sex } from "../../types";

export interface PageProps {
    params: {
        userId: string;
        labId: string;
    }
}

export interface Animal {
    newAnimalType?: AnimalType;
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
export interface Experiment {
    status?: ExperimentStatus;
    laboratoryId: string;
    description: string;
    createdById: string;
    protocol?: string;
    startDate: string;
    endDate?: string;
    title: string;
}

export interface Task {
    laboratoryId: string;
    assignedToId: string;
    experimentId: string;
    description: string;
    dueDate: string;
    title: string;
    id: string;
}

export interface DashboardViewProps {
    experiments: Experiment[];
    animals: Animal[];
    tasks: Task[];
    previousMonthData?: {
        experiments: number;
        animals: number;
        tasks: number;
    };
}

export interface DashboardContainerProps {
    experiments: Experiment[];
    animals: Animal[];
    tasks: Task[];
    previousMonthData?: {
        experiments: number;
        animals: number;
        tasks: number;
    };
}
