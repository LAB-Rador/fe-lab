import { cookies } from "next/headers"

export async function setAuthSessionCookies(accessToken: string) {
    const cookieStore = await cookies()
    cookieStore.set("auth-token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24,
    })
}
