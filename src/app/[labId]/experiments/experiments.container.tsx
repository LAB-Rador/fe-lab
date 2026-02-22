"use client";

import { CreateExperimentDialog } from "@/src/components/experiments/create-experiment-dialog";
import type { AnimalEnums } from "../animals/types";
import type { CreateExperimentType } from "./types";
import ExperimentsView from "./experiments.view";
import { apiClient } from "@/src/lib/apiClient";
import { useCallback, useState } from "react";
import type { Experiment } from "./types";
import { toast } from "sonner";

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
    const [dateFilter, setDateFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");


    // Filter experiments based on search query and filters
    const filteredExperiments = experimentsData.filter((experiment) => {
        // Search filter
        const matchesSearch =
            experiment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            experiment.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
            experiment.createdBy?.email.toLowerCase().includes(searchQuery.toLowerCase());

        // Status filter
        const matchesStatus =
            statusFilter === "all" || experiment.status === statusFilter;

        // Date filter (simplified for demo)
        const matchesDate = dateFilter === "all"; // In a real app, implement proper date filtering

        return matchesSearch && matchesStatus && matchesDate;
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
                filteredExperiments={filteredExperiments}
                setStatusFilter={setStatusFilter}
                setOpen={setOpenExperimentDialog}
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
