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

enum AccessStatus {
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    REVOKED = "REVOKED",
    PENDING = "PENDING"
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
    formatDate: (date: Date | string) => string
    filteredLaboratories: Laboratory[] | [];
    handleLabClick: (labId: string) => void;
    handleCreateLab: VoidFunction;
    handleJoinLab: VoidFunction;
    userInfo: UserInfo | null;
    setSearchTerm: React.Dispatch<SetStateAction<string>>;
    isLoading: boolean;
    searchTerm: string;
}

export interface PageProps {
    params: {
        userId: string;
    }
}
