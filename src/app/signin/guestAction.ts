"use server"

import { CONFIRMED_EMAIL } from "@/src/lib/variables"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

const BACKEND_URL =
    process.env.NEXT_PUBLIC_LOCAL_DATABASE_URL as string ||
    process.env.NEXT_PUBLIC_DATABASE_URL as string;

export type GuestState = {
    error?: string;
    success?: boolean;
}

export async function guestAction(
    _prevState: GuestState,
    formData: FormData,
): Promise<GuestState> {
    const email =
        process.env.GUEST_EMAIL ?? process.env.NEXT_PUBLIC_GUEST_EMAIL ?? "";
    const password =
        process.env.GUEST_PASSWORD ?? process.env.NEXT_PUBLIC_GUEST_PASSWORD ?? "";

    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password}),
        headers: {
            "Content-type": "application/json",
        },
    })

    const data = await response.json();

    if (!response.ok || !data.success) {
        return { error: data.message ?? data.error ?? "Guest access failed" };
    }

    const cookieStore = await cookies();

    // Not httpOnly: client apiClient/AuthService read the token via js-cookie for Bearer auth to the backend API.
    cookieStore.set("auth-token", data.accessToken, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24,
    })

    cookieStore.set("USER_ID", data.user.userId, { path: "/", sameSite: "strict" });
    cookieStore.set(CONFIRMED_EMAIL, String(data.user.confirmedEmail), {
        path: "/",
        maxAge: 3600,
    });

    redirect(data.laboratory ? "/account" : "/laboratory-setup");
}