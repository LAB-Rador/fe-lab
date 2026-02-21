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
    description: string;
    dueDate: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignedToId: String;
    experimentId: String;
    assignedTo: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
}
