"use server"

import { z } from "zod"

const BACKEND_URL =
    process.env.NEXT_PUBLIC_LOCAL_DATABASE_URL as string ||
    process.env.NEXT_PUBLIC_DATABASE_URL as string

export type MagicLinkState = {
    success?: boolean
    message?: string
    error?: string
    fieldErrors?: { email?: string[] }
}

const magicLinkSchema = z.object({
    email: z.string().trim().min(1, "Email is required").email("Invalid email"),
})

export async function requestMagicLinkAction(
    _prevState: MagicLinkState,
    formData: FormData,
): Promise<MagicLinkState> {
    const parsed = magicLinkSchema.safeParse({
        email: formData.get("email"),
    })

    if (!parsed.success) {
        return { fieldErrors: parsed.error.flatten().fieldErrors }
    }

    const response = await fetch(`${BACKEND_URL}/api/auth/magic-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data.email }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
        return { error: data.message ?? data.error ?? "Could not send the sign-in link" }
    }

    return {
        success: true,
        message: data.message ?? "If the address can receive mail, a sign-in link is on its way.",
    }
}
