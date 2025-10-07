export interface InitialMembersTypes {
    id: string;
    name: string;
    role: string;
    department: string;
    email: string;
    phone: string;
    joinDate: string;
    activeExperiments: number;
    avatar: string;
    status: string;
};

export interface NewMemberTypes {
    department: string;
    email: string;
    phone: string;
    role: string;
    name: string;
}

export enum Departments {
    ALL_DEPARTMENTS = "All Departments",
    NEUROBIOLOGY = "Neurobiology",
    BEHAVIORAL_SCIENCE = "Behavioral Science",
    GENETICS = "Genetics",
    TOXICOLOGY = "Toxicology",
    GENERAL_LAB = "General Lab",
}

export enum Roles {
    ALL_ROLES = "All Roles",
    LEAD_RESEARCHER = "Lead Researcher",
    SENIOR_RESEARCHER = "Senior Researcher",
    RESEARCH_ASSOCIATE = "Research Associate",
    LAB_TECHNICIAN = "Lab Technician",
    GRADUATE_ASSISTANT = "Graduate Assistant",
}
