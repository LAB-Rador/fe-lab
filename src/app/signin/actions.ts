"use server"

import { CONFIRMED_EMAIL } from "@/src/lib/variables"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { z } from "zod";

const BACKEND_URL =
    process.env.NEXT_PUBLIC_LOCAL_DATABASE_URL as string ||
    process.env.NEXT_PUBLIC_DATABASE_URL as string;

export type LoginState = {
    error?: string
    fieldErrors?: { email?: string[]; password?: string[] }
}

const loginSchema = z.object({
    email: z.string().trim().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function loginAction(
    _prevState: LoginState,
    formData: FormData,
): Promise<LoginState> {
    const parsed = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    })

    if (!parsed.success) {
        return { fieldErrors: parsed.error.flatten().fieldErrors }
      }

    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ email: parsed.data.email, password: parsed.data.password as string }),
    })

    const data = await response.json();

    if (!response.ok || !data.success) {
        return { error: data.message ?? data.error ?? "Login failed" };
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