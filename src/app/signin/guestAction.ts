"use server"

import { setAuthSessionCookies } from "@/src/lib/set-auth-cookies"
import { redirect } from "next/navigation"

const BACKEND_URL =
    process.env.NEXT_PUBLIC_LOCAL_DATABASE_URL as string ||
    process.env.NEXT_PUBLIC_DATABASE_URL as string

export type GuestState = {
    error?: string
}

export async function guestAction(
    _prevState: GuestState,
    _formData: FormData,
): Promise<GuestState> {
    const email = process.env.GUEST_EMAIL ?? process.env.NEXT_PUBLIC_GUEST_EMAIL ?? ""
    const password = process.env.GUEST_PASSWORD ?? process.env.NEXT_PUBLIC_GUEST_PASSWORD ?? ""

    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
        return { error: data.message ?? data.error ?? "Guest access failed" }
    }

    await setAuthSessionCookies(data.accessToken, data.user.userId)
    redirect(data.laboratory ? "/account" : "/laboratory-setup")
}
