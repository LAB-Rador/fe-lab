"use server";

import LaboratoriesContainer from "./labs.container";
import { createServerApiClient } from "@/src/lib/serverApiClient";
import { cookies } from 'next/headers';

export default async function Page() {
    const cookieStore = await cookies();
    const api = createServerApiClient(cookieStore);
    const userId = await cookieStore.get('USER_ID')?.value || 'default';
    const laboratories = await api.get(`/api/laboratories/${userId}`);
    return (
        <LaboratoriesContainer
            userLaboratories={laboratories.data}
        />
    )
}
