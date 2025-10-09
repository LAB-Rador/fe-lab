import type { SetStateAction } from "react"

export enum Role {
    VETERINARIAN = "VETERINARIAN",
    RESEARCHER = "RESEARCHER", 
    TECHNICIAN = "TECHNICIAN",
    DIRECTOR = "DIRECTOR",
    STUDENT = "STUDENT",
    MEMBER = "MEMBER",
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    GUEST = "GUEST"
}

export enum AccessStatus {
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    REVOKED = "REVOKED",
    PENDING = "PENDING"
  }

export enum ExperimentStatus {
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    PLANNED = "PLANNED",
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
}

export enum AnimalStatus {
    TRANSFERRED = "TRANSFERRED",
    QUARANTINE = "QUARANTINE",
    EXPERIMENT = "EXPERIMENT",
    BREEDING = "BREEDING",
    DECEASED = "DECEASED",
    RETIRED = "RETIRED",
    ACTIVE = "ACTIVE",
}

export enum Sex {
    MALE = "MALE",
    FEMALE = "FEMALE",
    UNKNOWN = "UNKNOWN"
}
export interface Laboratory {
    id: string
    createdAt: Date
    updatedAt: Date | null
    joinedAt: Date
    accessStartDate: Date
    accessEndDate: Date | null
    accessStatus: AccessStatus
    name: string
    username: string
    position: string
    description: string | null
    userRole: Role
}

export interface AnimalType {
    id: string
    name: string
    laboratoryId: string
    description: string | null
    createdAt: Date
    updatedAt: Date
}

export interface UserInfo {
    userId: string
    confirmedEmail: boolean
    institution: string | null
    contactPhone: string | null
    createdAt: Date
    firstName: string | null
    lastName: string | null
    address: string | null
    email: string
}

export interface LaboratoriesContainerProps {
    userLaboratories: Laboratory[];
}

export interface LaboratoriesViewProps {
    getInitials: (firstName: string, lastName: string) => string;
    setSearchTerm: React.Dispatch<SetStateAction<string>>;
    formatDate: (date: Date | string) => string
    filteredLaboratories: Laboratory[] | [];
    handleLabClick: (labId: string) => void;
    handleCreateLab: VoidFunction;
    handleJoinLab: VoidFunction;
    userInfo: UserInfo | null;
    isLoading: boolean;
    searchTerm: string;
}

export interface PageProps {
    params: {
        userId: string;
    }
}
