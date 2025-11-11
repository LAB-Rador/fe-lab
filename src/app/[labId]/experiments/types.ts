import type { ExperimentStatus } from "../animals/types";

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
}