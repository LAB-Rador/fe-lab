import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL =
  (process.env.NEXT_PUBLIC_LOCAL_DATABASE_URL as string) ||
  (process.env.NEXT_PUBLIC_DATABASE_URL as string)

const TOKEN_COOKIE_KEY = "auth-token"

async function proxyRequest(request: NextRequest, pathSegments: string[]) {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_COOKIE_KEY)?.value

  const backendPath = pathSegments.join("/")
  const url = `${BACKEND_URL.replace(/\/$/, "")}/${backendPath}${request.nextUrl.search}`

  const headers = new Headers()
  const contentType = request.headers.get("content-type")
  if (contentType) headers.set("content-type", contentType)
  if (token) headers.set("authorization", `Bearer ${token}`)

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text()
  }

  const backendResponse = await fetch(url, init)
  const responseBody = await backendResponse.text()

  return new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: {
      "content-type": backendResponse.headers.get("content-type") ?? "application/json",
    },
  })
}

type RouteContext = { params: Promise<{ path: string[] }> }

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxyRequest(request, path)
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxyRequest(request, path)
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxyRequest(request, path)
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxyRequest(request, path)
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxyRequest(request, path)
}
