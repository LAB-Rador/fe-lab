export type ReportTemplateId =
    | "animal-health"
    | "experiment-progress"
    | "task-completion"
    | "lab-activity"
    | "staff-performance"
    | "breeding"

export interface AnimalHealthRow {
    name: string
    healthy: number
    attention: number
}

export interface TaskCompletionRow {
    name: string
    day: string
    completed: number
    pending: number
}

export interface ExperimentProgressRow {
    id: string
    name: string
    status: string
    progress: number
    startDate: string
    endDate: string | null
}

export interface LabActivityRow {
    name: string
    value: number
}

export interface StaffPerformanceRow {
    name: string
    completed: number
    total: number
}

export interface LaboratoryReports {
    generatedAt: string
    summary: {
        animalCount: number
        experimentCount: number
        taskCount: number
        breedingCount: number
        memberCount: number
        recordCount: number
        completedTasks: number
        openTasks: number
        activeExperiments: number
        healthyAnimals: number
        attentionAnimals: number
    }
    animalHealth: AnimalHealthRow[]
    taskCompletion: TaskCompletionRow[]
    experimentProgress: ExperimentProgressRow[]
    labActivity: LabActivityRow[]
    staffPerformance: StaffPerformanceRow[]
    activityDates: {
        animalHealth: string | null
        experimentProgress: string | null
        taskCompletion: string | null
        breeding: string | null
        records: string | null
        staff: string | null
    }
}

export interface GeneratedReport {
    id: ReportTemplateId | "custom"
    title: string
    generatedAt: string
    summaryLines: string[]
    sections: Array<{
        heading: string
        rows: string[]
    }>
}

export function emptyLaboratoryReports(): LaboratoryReports {
    return {
        generatedAt: new Date().toISOString(),
        summary: {
            animalCount: 0,
            experimentCount: 0,
            taskCount: 0,
            breedingCount: 0,
            memberCount: 0,
            recordCount: 0,
            completedTasks: 0,
            openTasks: 0,
            activeExperiments: 0,
            healthyAnimals: 0,
            attentionAnimals: 0,
        },
        animalHealth: [],
        taskCompletion: [],
        experimentProgress: [],
        labActivity: [],
        staffPerformance: [],
        activityDates: {
            animalHealth: null,
            experimentProgress: null,
            taskCompletion: null,
            breeding: null,
            records: null,
            staff: null,
        },
    }
}
