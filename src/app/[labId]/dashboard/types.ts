import type { AppNotification } from "@/src/components/tasks/notifications"
import type { AnimalStatus, ExperimentStatus } from "../../account/types";

export interface PageProps {
    params: {
        userId: string;
        labId: string;
    }
}

export interface AnimalPopulationPoint {
    date: string;
    animalType: string;
    count: number;
}

export interface AnimalStatusCount {
    status: AnimalStatus;
    count: number;
}

export interface AnimalSummary {
    total: number;
    acquiredPreviousMonth: number;
    byStatus: AnimalStatusCount[];
    population: AnimalPopulationPoint[];
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
    animalSummary: AnimalSummary;
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
    animalSummary: AnimalSummary;
    tasks: Task[];
    previousMonthData?: {
        experiments: number;
        animals: number;
        tasks: number;
    };
}
