import { AuthService } from "./auth";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_DATABASE_URL || "http://localhost:3001";

class ApiClient {
  baseURL: string; // Объявите свойство baseURL

  constructor() {
    this.baseURL = BACKEND_URL;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const token = AuthService.getToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include' as RequestCredentials,
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (response.status === 401) {
        AuthService.logout();
        return;
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

  delete(endpoint: string) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
