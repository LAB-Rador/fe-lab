"use server"

import { setAuthSessionCookies } from "@/src/lib/set-auth-cookies"
import { redirect } from "next/navigation"

const BACKEND_URL =
    process.env.NEXT_PUBLIC_LOCAL_DATABASE_URL as string ||
    process.env.NEXT_PUBLIC_DATABASE_URL as string

type ConsumeResult = {
    success?: boolean
    message?: string
    error?: string
    accessToken?: string
    user?: { userId: string }
    laboratory?: unknown
    joinedLaboratory?: { id: string; name: string } | null
}

export async function consumeMagicLinkFormAction(
    _prevState: { error?: string },
    formData: FormData,
): Promise<{ error?: string }> {
    const token = typeof formData.get("token") === "string" ? formData.get("token") as string : ""
    if (!token) {
        return { error: "This link is invalid or has expired." }
    }

    const response = await fetch(`${BACKEND_URL}/api/auth/magic-link/consume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
    })

    const data = (await response.json()) as ConsumeResult

    if (!response.ok || !data.success || !data.accessToken || !data.user?.userId) {
        return { error: data.message ?? data.error ?? "This link is invalid or has expired." }
    }

    await setAuthSessionCookies(data.accessToken, data.user.userId)

    if (data.joinedLaboratory?.name) {
        redirect(`/${encodeURIComponent(data.joinedLaboratory.name)}/dashboard`)
    }

    redirect(data.laboratory ? "/account" : "/laboratory-setup")
}
