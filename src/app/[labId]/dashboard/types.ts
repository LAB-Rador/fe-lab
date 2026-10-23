import type { AppNotification } from "@/src/components/tasks/notifications"
import type { AnimalStatus, AnimalType, ExperimentStatus, Laboratory, Sex } from "../../account/types";

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
    createdBy?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
    id: string;
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

export interface UpcomingEvent {
    id: string;
    title: string;
    type: "experiment" | "task";
    date: string;
}

export interface LaboratorySubscription {
    memberCount: number;
    subscription: {
        id: string;
        status: string;
        startDate: string;
        endDate: string;
        maxUsers: number;
        autoRenew: boolean;
        plan: {
            name: string;
            price: number;
            currency: string;
            billingCycle: string;
        };
    } | null;
}

export interface DashboardViewProps {
    laboratorySubscription: LaboratorySubscription;
    notifications: AppNotification[];
    upcomingEvents: UpcomingEvent[];
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
    laboratorySubscription: LaboratorySubscription;
    notifications: AppNotification[];
    experiments: Experiment[];
    animals: Animal[];
    tasks: Task[];
    previousMonthData?: {
        experiments: number;
        animals: number;
        tasks: number;
    };
}
