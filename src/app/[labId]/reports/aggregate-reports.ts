import { emptyLaboratoryReports, type LaboratoryReports } from "./types"

type AnimalLike = {
    status?: string
    animalType?: { name?: string } | null
}

type ExperimentLike = {
    id: string
    title: string
    status?: string
    startDate?: string
    endDate?: string | null
    updatedAt?: string
}

type TaskLike = {
    status?: string
    dueDate?: string | null
    createdAt?: string
    updatedAt?: string
    assignedTo?: {
        id?: string
        email?: string
        firstName?: string | null
        lastName?: string | null
    } | null
}

const HEALTHY = new Set(["ACTIVE", "BREEDING", "EXPERIMENT", "RETIRED", "TRANSFERRED"])
const ATTENTION = new Set(["QUARANTINE", "DECEASED"])
const PROGRESS: Record<string, number> = {
    PLANNED: 10,
    ACTIVE: 55,
    PAUSED: 40,
    COMPLETED: 100,
    CANCELLED: 0,
}
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const

function localDay(value: string | Date | null | undefined) {
    if (!value) return null
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) return null
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

function displayName(user: NonNullable<TaskLike["assignedTo"]>) {
    const first = user.firstName?.trim()
    const last = user.lastName?.trim()
    if (first || last) return [first, last].filter(Boolean).join(" ")
    return user.email || "Unknown"
}

export function aggregateLaboratoryReports({
    animals = [],
    experiments = [],
    tasks = [],
    breedingCount = 0,
    memberCount = 0,
    recordCount = 0,
}: {
    animals?: AnimalLike[]
    experiments?: ExperimentLike[]
    tasks?: TaskLike[]
    breedingCount?: number
    memberCount?: number
    recordCount?: number
}): LaboratoryReports {
    const reports = emptyLaboratoryReports()
    const now = new Date()
    reports.generatedAt = now.toISOString()

    const healthMap = new Map<string, { healthy: number; attention: number }>()
    for (const animal of animals) {
        const typeName = animal.animalType?.name || "Unknown"
        const bucket = healthMap.get(typeName) ?? { healthy: 0, attention: 0 }
        const status = animal.status || "ACTIVE"
        if (ATTENTION.has(status)) bucket.attention += 1
        else if (HEALTHY.has(status)) bucket.healthy += 1
        else bucket.attention += 1
        healthMap.set(typeName, bucket)
    }
    reports.animalHealth = [...healthMap.entries()]
        .map(([name, counts]) => ({ name, ...counts }))
        .sort((a, b) => a.name.localeCompare(b.name))

    const weekStart = new Date(now)
    weekStart.setHours(0, 0, 0, 0)
    weekStart.setDate(weekStart.getDate() - 6)

    reports.taskCompletion = Array.from({ length: 7 }, (_, index) => {
        const day = new Date(weekStart.getTime() + index * 24 * 60 * 60 * 1000)
        const key = localDay(day)!
        let completed = 0
        let pending = 0
        for (const task of tasks) {
            if (task.status === "COMPLETED") {
                if (localDay(task.updatedAt) === key) completed += 1
                continue
            }
            if (task.status === "CANCELLED") continue
            if (localDay(task.dueDate || task.createdAt) === key) pending += 1
        }
        return {
            name: DAY_LABELS[day.getDay()],
            day: key,
            completed,
            pending,
        }
    })

    reports.experimentProgress = experiments
        .filter((experiment) => experiment.status !== "CANCELLED")
        .slice(-8)
        .map((experiment) => ({
            id: experiment.id,
            name: experiment.title,
            status: experiment.status || "PLANNED",
            progress: PROGRESS[experiment.status || "PLANNED"] ?? 0,
            startDate: experiment.startDate || now.toISOString(),
            endDate: experiment.endDate ?? null,
        }))

    const labActivity = [
        { name: "Animals", value: animals.length },
        { name: "Experiments", value: experiments.length },
        { name: "Tasks", value: tasks.length },
        { name: "Breedings", value: breedingCount },
        { name: "Records", value: recordCount },
    ].filter((row) => row.value > 0)
    reports.labActivity = labActivity

    const staffMap = new Map<string, { name: string; completed: number; total: number }>()
    for (const task of tasks) {
        const assignee = task.assignedTo
        if (!assignee?.id) continue
        const existing = staffMap.get(assignee.id) ?? {
            name: displayName(assignee),
            completed: 0,
            total: 0,
        }
        existing.total += 1
        if (task.status === "COMPLETED") existing.completed += 1
        staffMap.set(assignee.id, existing)
    }
    reports.staffPerformance = [...staffMap.values()]
        .sort((a, b) => b.completed - a.completed || b.total - a.total)
        .slice(0, 12)

    const completedTasks = tasks.filter((task) => task.status === "COMPLETED").length
    const openTasks = tasks.filter(
        (task) => task.status === "PENDING" || task.status === "IN_PROGRESS",
    ).length
    const activeExperiments = experiments.filter((experiment) => experiment.status === "ACTIVE").length
    const healthyAnimals = animals.filter((animal) => HEALTHY.has(animal.status || "")).length
    const attentionAnimals = animals.filter((animal) => ATTENTION.has(animal.status || "")).length

    reports.summary = {
        animalCount: animals.length,
        experimentCount: experiments.length,
        taskCount: tasks.length,
        breedingCount,
        memberCount,
        recordCount,
        completedTasks,
        openTasks,
        activeExperiments,
        healthyAnimals,
        attentionAnimals,
    }

    const latestTask = tasks
        .map((task) => task.updatedAt)
        .filter(Boolean)
        .sort()
        .at(-1) as string | undefined
    const latestExperiment = experiments
        .map((experiment) => experiment.updatedAt)
        .filter(Boolean)
        .sort()
        .at(-1) as string | undefined

    reports.activityDates = {
        animalHealth: animals.length > 0 ? now.toISOString() : null,
        experimentProgress: latestExperiment ?? null,
        taskCompletion: latestTask ?? null,
        breeding: breedingCount > 0 ? now.toISOString() : null,
        records: recordCount > 0 ? now.toISOString() : null,
        staff: latestTask ?? null,
    }

    return reports
}
