export interface LandingAnimalTypeRow {
    name: string;
    count: number;
}

export interface LandingStatsPayload {
    /** Share of animals still in lab (not deceased / transferred), % */
    inCarePercent: number;
    /** Share of animals with status ACTIVE, % */
    activePercent: number;
    researchLabs: number;
    animalsTracked: number;
    registeredUsers: number;
    topAnimalTypes: LandingAnimalTypeRow[];
}
