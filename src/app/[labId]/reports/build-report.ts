import type { GeneratedReport, LaboratoryReports, ReportTemplateId } from "./types"

function formatWhen(value: string | null | undefined) {
    if (!value) return "No recent activity"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "No recent activity"
    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    })
}

export const REPORT_TEMPLATE_META: Array<{
    id: ReportTemplateId
    title: string
    description: string
    popular: boolean
    activityKey: keyof LaboratoryReports["activityDates"]
}> = [
    {
        id: "animal-health",
        title: "Animal Health Status",
        description: "Overview of health metrics for all laboratory animals",
        popular: true,
        activityKey: "animalHealth",
    },
    {
        id: "experiment-progress",
        title: "Experiment Progress",
        description: "Track the progress of ongoing experiments",
        popular: true,
        activityKey: "experimentProgress",
    },
    {
        id: "task-completion",
        title: "Task Completion",
        description: "Summary of completed and pending tasks",
        popular: true,
        activityKey: "taskCompletion",
    },
    {
        id: "lab-activity",
        title: "Laboratory Activity",
        description: "Distribution of animals, experiments, tasks, breedings, and records",
        popular: false,
        activityKey: "records",
    },
    {
        id: "staff-performance",
        title: "Staff Performance",
        description: "Metrics on staff productivity and task completion",
        popular: false,
        activityKey: "staff",
    },
    {
        id: "breeding",
        title: "Breeding Summary",
        description: "Current breeding pair count and related laboratory activity",
        popular: false,
        activityKey: "breeding",
    },
]

export function buildReportFromTemplate(
    templateId: ReportTemplateId | "custom",
    reports: LaboratoryReports,
    customTitle?: string,
): GeneratedReport {
    const generatedAt = new Date().toISOString()
    const { summary } = reports
    const meta = REPORT_TEMPLATE_META.find((item) => item.id === templateId)

    if (templateId === "animal-health") {
        return {
            id: templateId,
            title: meta?.title ?? "Animal Health Status",
            generatedAt,
            summaryLines: [
                `${summary.animalCount} animals in the laboratory`,
                `${summary.healthyAnimals} in healthy statuses`,
                `${summary.attentionAnimals} need attention (quarantine or deceased)`,
                `Last animal update: ${formatWhen(reports.activityDates.animalHealth)}`,
            ],
            sections: [
                {
                    heading: "By animal type",
                    rows:
                        reports.animalHealth.length > 0
                            ? reports.animalHealth.map(
                                  (row) =>
                                      `${row.name}: ${row.healthy} healthy, ${row.attention} attention`,
                              )
                            : ["No animals to report."],
                },
            ],
        }
    }

    if (templateId === "experiment-progress") {
        return {
            id: templateId,
            title: meta?.title ?? "Experiment Progress",
            generatedAt,
            summaryLines: [
                `${summary.experimentCount} experiments`,
                `${summary.activeExperiments} currently active`,
                `Last experiment update: ${formatWhen(reports.activityDates.experimentProgress)}`,
            ],
            sections: [
                {
                    heading: "Experiments",
                    rows:
                        reports.experimentProgress.length > 0
                            ? reports.experimentProgress.map(
                                  (row) => `${row.name}: ${row.status} (${row.progress}%)`,
                              )
                            : ["No experiments to report."],
                },
            ],
        }
    }

    if (templateId === "task-completion") {
        return {
            id: templateId,
            title: meta?.title ?? "Task Completion",
            generatedAt,
            summaryLines: [
                `${summary.taskCount} tasks total`,
                `${summary.completedTasks} completed`,
                `${summary.openTasks} open`,
                `Last task update: ${formatWhen(reports.activityDates.taskCompletion)}`,
            ],
            sections: [
                {
                    heading: "Last 7 days",
                    rows: reports.taskCompletion.map(
                        (row) =>
                            `${row.name} (${row.day}): ${row.completed} completed, ${row.pending} pending`,
                    ),
                },
            ],
        }
    }

    if (templateId === "lab-activity") {
        return {
            id: templateId,
            title: meta?.title ?? "Laboratory Activity",
            generatedAt,
            summaryLines: [
                `${summary.memberCount} active members`,
                `${summary.recordCount} animal records`,
                `Last record: ${formatWhen(reports.activityDates.records)}`,
            ],
            sections: [
                {
                    heading: "Activity mix",
                    rows:
                        reports.labActivity.length > 0
                            ? reports.labActivity.map((row) => `${row.name}: ${row.value}`)
                            : ["No laboratory activity to report."],
                },
            ],
        }
    }

    if (templateId === "staff-performance") {
        return {
            id: templateId,
            title: meta?.title ?? "Staff Performance",
            generatedAt,
            summaryLines: [
                `${reports.staffPerformance.length} assignees with tasks`,
                `${summary.completedTasks} completed of ${summary.taskCount} tasks`,
            ],
            sections: [
                {
                    heading: "By assignee",
                    rows:
                        reports.staffPerformance.length > 0
                            ? reports.staffPerformance.map(
                                  (row) =>
                                      `${row.name}: ${row.completed}/${row.total} completed`,
                              )
                            : ["No assigned tasks to report."],
                },
            ],
        }
    }

    if (templateId === "breeding") {
        return {
            id: templateId,
            title: meta?.title ?? "Breeding Summary",
            generatedAt,
            summaryLines: [
                `${summary.breedingCount} breeding pairs`,
                `${summary.animalCount} animals in the laboratory`,
                `Last breeding update: ${formatWhen(reports.activityDates.breeding)}`,
            ],
            sections: [
                {
                    heading: "Related counts",
                    rows: [
                        `Breedings: ${summary.breedingCount}`,
                        `Animals: ${summary.animalCount}`,
                        `Active experiments: ${summary.activeExperiments}`,
                    ],
                },
            ],
        }
    }

    return {
        id: "custom",
        title: customTitle?.trim() || "Custom Laboratory Report",
        generatedAt,
        summaryLines: [
            `${summary.animalCount} animals`,
            `${summary.experimentCount} experiments`,
            `${summary.taskCount} tasks`,
            `${summary.breedingCount} breedings`,
            `${summary.memberCount} active members`,
        ],
        sections: [
            {
                heading: "Key metrics",
                rows: [
                    `Healthy animals: ${summary.healthyAnimals}`,
                    `Attention animals: ${summary.attentionAnimals}`,
                    `Completed tasks: ${summary.completedTasks}`,
                    `Open tasks: ${summary.openTasks}`,
                    `Active experiments: ${summary.activeExperiments}`,
                    `Animal records: ${summary.recordCount}`,
                ],
            },
            {
                heading: "Laboratory activity",
                rows:
                    reports.labActivity.length > 0
                        ? reports.labActivity.map((row) => `${row.name}: ${row.value}`)
                        : ["No laboratory activity to report."],
            },
        ],
    }
}

export function reportsToExportText(report: GeneratedReport) {
    const lines = [
        report.title,
        `Generated: ${formatWhen(report.generatedAt)}`,
        "",
        "Summary",
        ...report.summaryLines.map((line) => `- ${line}`),
    ]
    for (const section of report.sections) {
        lines.push("", section.heading, ...section.rows.map((row) => `- ${row}`))
    }
    return lines.join("\n")
}
