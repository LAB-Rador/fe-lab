"use client";

import { CreateExperimentDialog } from "@/src/components/experiments/create-experiment-dialog";
import type { AnimalEnums } from "../animals/types";
import type { CreateExperimentType } from "./types";
import ExperimentsView from "./experiments.view";
import { apiClient } from "@/src/lib/apiClient";
import { useCallback, useState } from "react";
import type { Experiment } from "./types";
import { toast } from "sonner";

function localDateKey(date: Date) {
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${date.getFullYear()}-${month}-${day}`
}

function shiftDays(date: Date, days: number) {
    const next = new Date(date)
    next.setDate(next.getDate() + days)
    return next
}

function dateWindow(filter: string) {
    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    if (filter === "today") {
        const key = localDateKey(startOfToday)
        return { start: key, end: key }
    }
    if (filter === "this-week") {
        const weekday = startOfToday.getDay()
        const monday = shiftDays(startOfToday, weekday === 0 ? -6 : 1 - weekday)
        return { start: localDateKey(monday), end: localDateKey(shiftDays(monday, 6)) }
    }
    if (filter === "this-month") {
        const start = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1)
        const end = new Date(startOfToday.getFullYear(), startOfToday.getMonth() + 1, 0)
        return { start: localDateKey(start), end: localDateKey(end) }
    }
    if (filter === "this-year") {
        const year = startOfToday.getFullYear()
        return { start: `${year}-01-01`, end: `${year}-12-31` }
    }
    return null
}

function experimentDateKey(value: string | undefined) {
    if (!value) return ""
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ""
    return localDateKey(date)
}

function matchesDate(experiment: Experiment, filter: string) {
    const window = dateWindow(filter)
    if (!window) return true
    const start = experimentDateKey(experiment.startDate)
    if (!start) return false
    const end = experimentDateKey(experiment.endDate) || "9999-12-31"
    return start <= window.end && end >= window.start
}

interface ExperimentProps {
    experiments: Experiment[];
    animalEnums: AnimalEnums;
    userId: string;
    labId: string;
}

export default function ExperimentsContainer(props: ExperimentProps) {
    const { experiments, animalEnums, labId, userId } = props;
    const [experimentsData, setExperimentsData] = useState<Experiment[]>(experiments);
    const [openExperimentDialog, setOpenExperimentDialog] = useState(false)
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [includeArchived, setIncludeArchived] = useState(false);
    const [dateFilter, setDateFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const onIncludeArchivedChange = useCallback(
        (value: boolean) => {
            setIncludeArchived(value);
            void (async () => {
                const res = await apiClient.get(
                    `/api/experiments/${userId}/${labId}?includeArchived=${value}`,
                );
                if (res?.success && Array.isArray(res.data)) {
                    setExperimentsData(res.data);
                }
            })();
        },
        [userId, labId],
    );


    // Filter experiments based on search query and filters
    const filteredExperiments = experimentsData.filter((experiment) => {
        // Search filter
        const query = searchQuery.trim().toLowerCase()
        const haystack = [experiment.title, experiment.description, experiment.createdBy?.email]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
        const matchesSearch = haystack.includes(query)
        const matchesStatus = statusFilter === "all" || experiment.status === statusFilter

        return matchesSearch && matchesStatus && matchesDate(experiment, dateFilter)
    });

    const handleCreateExperiment = useCallback(async (data: CreateExperimentType) => {
        try {
            const newExperiment: CreateExperimentType = {
                description: data.description,
                startDate: data.startDate,
                protocol: data.protocol,
                endDate: data.endDate,
                status: data.status,
                createdById: userId,
                laboratoryId: labId,
                title: data.title,
            }

            const response = await apiClient.post(`/api/experiments/experiment`, newExperiment);
            toast(response.message || response.error, {
                description: `${newExperiment.title}`
            });
            if(response.success && response.data) {
                // Предполагаем, что сервер возвращает полный объект Animal в response.data
                setExperimentsData((prev) => [...prev, response.data as Experiment])
            }
        } catch (error) {
            console.error("Error adding animal:", error)
        }  
    }, [userId, labId])

    return (
        <>
            <ExperimentsView
                onIncludeArchivedChange={onIncludeArchivedChange}
                filteredExperiments={filteredExperiments}
                setStatusFilter={setStatusFilter}
                setOpen={setOpenExperimentDialog}
                includeArchived={includeArchived}
                setSearchQuery={setSearchQuery}
                setDateFilter={setDateFilter}
                statusFilter={statusFilter}
                searchQuery={searchQuery}
                dateFilter={dateFilter}
                labId={labId}
            />
            <CreateExperimentDialog
                submitButtonText={"Create Experiment"}
                onSubmit={handleCreateExperiment}
                setOpen={setOpenExperimentDialog}
                loadingButtonText={"Adding"}
                open={openExperimentDialog}
                animalEnums={animalEnums}
                userId={userId}
                labId={labId}
            />
        </>
    )
}
