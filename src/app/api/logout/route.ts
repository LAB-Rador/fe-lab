import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
    const store = await cookies()
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
        path: "/",
        maxAge: 0,
    }
    store.set("auth-token", "", options)
    store.set("USER_ID", "", options)
    return NextResponse.json({ success: true })
}
