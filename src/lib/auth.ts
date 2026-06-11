import Cookies from 'js-cookie';
import { CONFIRMED_EMAIL } from './variables';

const BACKEND_URL = process.env.NEXT_PUBLIC_LOCAL_DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;

const USER_ID_COOKIE = 'USER_ID';

export class AuthService {
  static TOKEN_KEY = 'auth-token';
  
  // Сохранение токена в cookies (безопаснее чем localStorage)
  static setToken(token: string) {
    Cookies.set(this.TOKEN_KEY, token, {
      expires: 1, // 1 день
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  }
  
  // Получение токена
  static getToken() {

    return Cookies.get(this.TOKEN_KEY);
  }
  
  // Удаление токена
  static removeToken() {
    Cookies.remove(this.TOKEN_KEY);
  }
  
  // Логин
  static async login(email: string, password: string) {
    try {
      const dataSuccess = {email, password}
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dataSuccess),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      this.setToken(data.accessToken);
      
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  // Логаут
  static async logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    } catch {
      /* no-op */
    }
    this.removeToken()
    Cookies.remove(USER_ID_COOKIE, { path: "/" })
    Cookies.remove(CONFIRMED_EMAIL, { path: "/" })
    window.location.href = "/signin"
  }
  
  // Получение данных пользователя с бекенда
  static async getCurrentUser() {
    try {
      const response = await fetch("/api/backend/api/auth/validate", {
        credentials: "include",
      })
      
      if (!response.ok) {
        throw new Error("Token validation failed")
      }
      
      const data = await response.json()
      return data.user
    } catch (error) {
      this.removeToken()
      return null
    }
  }
}