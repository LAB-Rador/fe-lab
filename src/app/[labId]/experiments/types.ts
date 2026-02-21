import type { Animal, ExperimentStatus } from "../animals/types";
import type { Task } from "../tasks/types";

export interface CreateExperimentType {
    status?: ExperimentStatus;
    description?: string;
    laboratoryId: string;
    createdById?: string;
    protocol?: string;
    startDate: Date;
    endDate?: Date;
    title: string;
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
    createdBy?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
    id: string;
    animals: Animal[];
    tasks: Task[];
}