"use server";

import LaboratoriesContainer from "./labs.container";
import { apiClient } from "@/src/lib/apiClient";
import { cookies } from 'next/headers';

export default async function Page() {
    const cookieStore = await cookies();
    const userId = await cookieStore.get('USER_ID')?.value || 'default';
    const laboratories = await apiClient.get(`/api/laboratories/${userId}`);
    return (
        <LaboratoriesContainer
            userLaboratories={laboratories.data}
        />
    )
}
