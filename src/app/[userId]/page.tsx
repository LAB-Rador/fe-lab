"use server"

import { apiClient } from "@/src/lib/apiClient";
import LaboratoriesPage from "./labs.view";
import type { PageProps } from "./types";

export default async function Page({params}: PageProps) {
    const { userId } = await params;
    const laboratories = await apiClient.get(`/api/laboratories/${userId}`);
    return (
        <LaboratoriesPage
            userLaboratories={laboratories.data}
        />
    )
}
