import type { AccessStatus, AnimalStatus, Role, Sex } from "../../account/types";
import type { ActivityLevel, RecordType } from "../animals/types";

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
    email: string;
    role: string;
}
export interface AnimalEnums {
    activityLevel: ActivityLevel[];
    accessStatus: AccessStatus[]
    recordType: RecordType[];
    status: AnimalStatus[];
    role: Role[];
    sex: Sex[];
}
