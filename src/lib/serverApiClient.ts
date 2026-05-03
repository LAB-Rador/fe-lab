import { cookies } from "next/headers"

const BACKEND_URL =
  (process.env.NEXT_PUBLIC_LOCAL_DATABASE_URL as string) ||
  (process.env.NEXT_PUBLIC_DATABASE_URL as string)

const TOKEN_COOKIE_KEY = "auth-token"

class ServerApiClient {
  baseURL: string

  constructor() {
    this.baseURL = BACKEND_URL
  }

  private async buildHeaders(initHeaders?: HeadersInit): Promise<HeadersInit> {
    const store = await cookies()
    const token = store.get(TOKEN_COOKIE_KEY)?.value
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    if (token) headers.Authorization = `Bearer ${token}`
    if (initHeaders) {
      // Merge user headers last to allow explicit overrides
      return { ...headers, ...(initHeaders as Record<string, string>) }
    }
    return headers
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      credentials: "include",
      ...options,
      headers: await this.buildHeaders(options.headers),
    })

    if (!response.ok) {
      // Surface server error details if possible
      let body: unknown
      try {
        body = await response.json()
      } catch {
        /* no-op */
      }
      const message =
        typeof body === "object" && body && "message" in (body as any)
          ? (body as any).message
          : `HTTP error! status: ${response.status}`
      throw new Error(message)
    }

    try {
      return await response.json()
    } catch {
      return undefined
    }
  }

  get(endpoint: string) {
    return this.request(endpoint)
  }

  post(endpoint: string, data: any) {
    return this.request(endpoint, { method: "POST", body: JSON.stringify(data) })
  }

  put(endpoint: string, data: any) {
    return this.request(endpoint, { method: "PUT", body: JSON.stringify(data) })
  }

  patch(endpoint: string, data: any) {
    return this.request(endpoint, { method: "PATCH", body: JSON.stringify(data) })
  }

  delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" })
  }
}

export const serverApiClient = new ServerApiClient()

