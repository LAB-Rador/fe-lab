import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL =
    process.env.NEXT_PUBLIC_LOCAL_DATABASE_URL ||
    process.env.NEXT_PUBLIC_DATABASE_URL

type RouteContext = { params: Promise<{ path: string[] }> }

async function forward(request: NextRequest, context: RouteContext) {
    if (!BACKEND_URL) {
        return NextResponse.json(
            { success: false, message: "API URL is not configured" },
            { status: 500 },
        )
    }

    const { path } = await context.params
    if (path.some((segment) => segment === "" || segment === "." || segment === "..")) {
        return NextResponse.json({ success: false, message: "Invalid path" }, { status: 400 })
    }

    const token = (await cookies()).get("auth-token")?.value
    const target = new URL(`${BACKEND_URL}/api/${path.join("/")}`)
    target.search = request.nextUrl.search

    const headers = new Headers()
    const contentType = request.headers.get("content-type")
    if (contentType) headers.set("Content-Type", contentType)
    if (token) headers.set("Authorization", `Bearer ${token}`)

    const hasBody = request.method !== "GET" && request.method !== "HEAD"
    const rawBody = hasBody ? await request.text() : ""
    const response = await fetch(target, {
        method: request.method,
        headers,
        body: rawBody.length > 0 ? rawBody : undefined,
    })

    return new NextResponse(await response.text(), {
        status: response.status,
        headers: {
            "Content-Type": response.headers.get("content-type") ?? "application/json",
        },
    })
}

export const GET = forward
export const POST = forward
export const PUT = forward
export const PATCH = forward
export const DELETE = forward
