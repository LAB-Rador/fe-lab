export enum TaskStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export enum TaskPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT",
}

export interface Task {
    id: string;
    title: string;
    description?: string | null;
    dueDate?: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    createdById: string;
    assignedToId: string;
    experimentId?: string | null;
    createdBy: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
    assignedTo: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
}

export interface LaboratoryTasksPagination {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface LaboratoryTasksPagePayload {
    items: Task[];
    pagination: LaboratoryTasksPagination;
}

export type AssigneeScopeFilter = "all" | "mine";
export type TaskStatusFilterValue = TaskStatus | "all";
export type TaskPriorityFilterValue = TaskPriority | "all";
