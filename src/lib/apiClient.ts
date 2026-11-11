import { AuthService } from "./auth";

class ApiClient {
  async request(endpoint: string, options: RequestInit = {}) {
    if (!endpoint.startsWith("/api/")) {
      throw new Error("Unexpected API path")
    }

    const headers = new Headers(options.headers)
    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json")
    }

    const response = await fetch(`/api/backend/${endpoint.slice("/api/".length)}`, {
      ...options,
      headers,
      credentials: "include",
    })

    if (response.status === 401) {
      await AuthService.logout()
      return
    }

    if (!response.ok) {
      let detail = ""
      try {
        const body = await response.json()
        if (body && typeof body.message === "string") detail = body.message
      } catch {
        /* ignore */
      }
      const error = new Error(`HTTP error! status: ${response.status}`)
      if (detail) (error as Error & { detail?: string }).detail = detail
      throw error
    }

    return await response.json()
  }

  get(endpoint: string) {
    return this.request(endpoint)
  }

  post(endpoint: string, data: unknown) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  put(endpoint: string, data: unknown) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  patch(endpoint: string, data: unknown) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  delete(endpoint: string) {
    return this.request(endpoint, {
      method: "DELETE",
    })
  }
}

export const apiClient = new ApiClient()
