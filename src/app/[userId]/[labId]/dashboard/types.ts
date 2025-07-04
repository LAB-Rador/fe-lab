export interface PageProps {
    params: {
        userId: string;
        labId: string;
    }
}

export interface Animal {
    acquisitionDate: string;
    status: AnimalStatus;
    animalTypeId: string;
    laboratoryId: string;
    birthDate?: string;
    identifier: string;
    genotype?: string;
    location?: string;
    createdAt: string;
    updatedAt: string;
    strain?: string;
    origin?: string;
    name?: string;
    sex?: string;
    id: string;
}

export interface Experiment {
    title: string;
    description: string;
    laboratoryId: string;
    startDate: string;
    endDate?: string;
    status?: ExperimentStatus;
    createdById: string;
    protocol?: string;
}

export interface DashboardViewProps {
    animals: Animal[];
    experiments: number;
    tasks: number;
}

export interface DashboardContainerProps {
    animals: Animal[];
    experiments: number;
    tasks: number;
}

enum ExperimentStatus {
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    PLANNED = "PLANNED",
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
}

enum AnimalStatus {
    TRANSFERRED = "TRANSFERRED",
    QUARANTINE = "QUARANTINE",
    EXPERIMENT = "EXPERIMENT",
    BREEDING = "BREEDING",
    DECEASED = "DECEASED",
    RETIRED = "RETIRED",
    ACTIVE = "ACTIVE",
  }