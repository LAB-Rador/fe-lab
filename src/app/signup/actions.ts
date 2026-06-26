"use server"

import { CONFIRMED_EMAIL } from "@/src/lib/variables"
import { cookies } from "next/headers"
import { z } from "zod";

const BACKEND_URL =
    process.env.NEXT_PUBLIC_LOCAL_DATABASE_URL as string ||
    process.env.NEXT_PUBLIC_DATABASE_URL as string;

export type SignUpUser = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    institution: string;
    contactPhone: string;
    confirmedEmail: boolean;
    createdAt: string;
};

export type SignUpState = {
    success?: boolean;
    user?: SignUpUser;
    error?: string;
    fieldErrors?: {
        firstName?: string[];
        lastName?: string[];
        email?: string[];
        address?: string[];
        institution?: string[];
        contactPhone?: string[];
        password?: string[];
        confirmPassword?: string[];
        agreeToTerms?: string[];
    }
}

const signUpSchema = z
    .object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z.string().email("Invalid email address"),
        address: z.string().min(1, "Address is required"),
        institution: z.string().min(1, "Institution is required"),
        contactPhone: z.string().min(1, "Contact phone is required"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Confirm password is required"),
        agreeToTerms: z.boolean().refine((val) => val, "You must agree to the terms and conditions"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

export async function signUpAction(
    _prevState: SignUpState,
    formData: FormData,
): Promise<SignUpState> {
    const parsed = signUpSchema.safeParse({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        address: formData.get("address"),
        institution: formData.get("institution"),
        contactPhone: formData.get("contactPhone"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
        agreeToTerms: formData.get("agreeToTerms") === "on",
    })

    if (!parsed.success) {
        return { fieldErrors: parsed.error.flatten().fieldErrors }
    }

    const { confirmPassword: _confirmPassword, agreeToTerms: _agreeToTerms, ...submitData } = parsed.data;

    const response = await fetch(`${BACKEND_URL}/api/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        return { error: data.message ?? data.error ?? "Sign up failed" };
    }

    const cookieStore = await cookies();

    cookieStore.set(CONFIRMED_EMAIL, String(data.data.confirmedEmail), {
        path: "/",
        maxAge: 3600,
    });

    return { success: true, user: data.data };
}