import { cookies } from "next/headers"

export async function setAuthSessionCookies(accessToken: string, userId: string) {
    const cookieStore = await cookies()

    cookieStore.set("auth-token", accessToken, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24,
    })

    cookieStore.set("USER_ID", userId, { path: "/", sameSite: "strict" })
}
