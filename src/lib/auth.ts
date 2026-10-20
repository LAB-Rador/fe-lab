import Cookies from 'js-cookie';

const BACKEND_URL = process.env.NEXT_PUBLIC_LOCAL_DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;

const USER_ID_COOKIE = 'USER_ID';

export class AuthService {
  static TOKEN_KEY = 'auth-token';

  static getToken() {
    return Cookies.get(this.TOKEN_KEY);
  }
  
  // Удаление токена
  static removeToken() {
    Cookies.remove(this.TOKEN_KEY);
  }
  
  static logout() {
    this.removeToken();
    Cookies.remove(USER_ID_COOKIE, { path: '/' });
    window.location.href = '/signin';
  }
  
  // Получение данных пользователя с бекенда
  static async getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/validate`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Token validation failed');
      }
      
      const data = await response.json();
      return data.user;
    } catch (error) {
      this.removeToken();
      return null;
    }
  }
}