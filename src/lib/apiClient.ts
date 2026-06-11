class ApiClient {
  baseURL: string

  constructor() {
    this.baseURL = "/api/backend"
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include" as RequestCredentials,
      ...options,
    }

    try {
      const response = await fetch(`${this.baseURL}/${normalizedEndpoint}`, config)

      if (response.status === 401) {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
        window.location.href = "/signin"
        return
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  get(endpoint: string) {
    return this.request(endpoint);
  }

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  patch(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  delete(endpoint: string) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
