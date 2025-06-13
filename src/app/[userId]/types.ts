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

export interface LaboratoriesPageProps {
    userLaboratories: Laboratory[];
}

export interface PageProps {
    params: {
        userId: string;
    }
}
