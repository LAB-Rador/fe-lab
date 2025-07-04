"use server"

import LaboratoriesContainer from "./labs.container";
import { apiClient } from "@/src/lib/apiClient";
import type { PageProps } from "./types";

export default async function Page({params}: PageProps) {
    const { userId } = await params;
    const laboratories = await apiClient.get(`/api/laboratories/${userId}`);
    return (
        <LaboratoriesContainer
            userLaboratories={laboratories.data}
        />
    )
}
