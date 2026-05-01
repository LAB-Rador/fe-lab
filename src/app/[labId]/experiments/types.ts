import type { Role } from "@/src/app/account/types";
import type { Animal, ExperimentStatus } from "../animals/types";
import type { Task } from "../tasks/types";

/** Animal row on experiment detail: same as lab Animal plus link id from ExperimentAnimal */
export interface ExperimentLinkedAnimal extends Animal {
  id: string;
  experimentAnimalId: string;
  experimentNotes?: string | null;
}

export interface ExperimentMemberRow {
    id: string;
    userId: string;
    experimentId: string;
    createdAt: string;
    user: {
        id: string;
        email: string;
        firstName?: string | null;
        lastName?: string | null;
        laboratories: { role: Role }[];
    };
}

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

/** Daily aggregates for animals linked to an experiment (from AnimalRecord). */
export interface ExperimentMetricsDayPoint {
    day: string
    temperature: number | null
    activity: number | null
    weight: number | null
}

export interface ExperimentMetricsData {
    series: ExperimentMetricsDayPoint[]
    averages: {
        temperature: number | null
        activity: number | null
        weight: number | null
    }
    recordCount: number
    animalCount: number
}

/** Row from GET /api/experiments/unique/.../records (AnimalRecord for this experiment). */
export interface ExperimentAnimalRecordMeasurement {
    parameter: string
    value: number
    unit: string | null
}

export interface ExperimentAnimalRecordRow {
    id: string
    animalId: string
    experimentId: string | null
    recordType: string
    date: string
    createdById: string
    temperature: number | null
    weight: number | null
    feedIntake: number | null
    waterIntake: number | null
    activityLevel: string | null
    notes: string | null
    animal: {
        id: string
        name: string | null
        identifier: string
    }
    measurements: ExperimentAnimalRecordMeasurement[]
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
    archivedAt?: string | null;
    createdBy?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
    id: string;
    /** Present on list responses from GET experiments; detail loads full `animals`. */
    animalCount?: number;
    animals?: ExperimentLinkedAnimal[];
    tasks?: Task[];
    members?: ExperimentMemberRow[];
}