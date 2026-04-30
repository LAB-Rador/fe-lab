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
    animals: ExperimentLinkedAnimal[];
    tasks: Task[];
    members?: ExperimentMemberRow[];
}