// frontend/middleware.js (в корне проекта Next.js)
import { AUTH_NEXT_COOKIE, safeNextPath } from '@/src/lib/auth-next';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_DATABASE_URL || 'http://localhost:3001';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Публичные страницы, которые не требуют авторизации
  const publicPaths = ['/signin', '/auth/magic', '/', '/pricing', '/privacy'];
  
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Получаем токен из cookies или headers
  const token = request.cookies.get('auth-token')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return redirectToSignIn(request);
  }
  
  try {
    // Проверяем токен на бекенде
    const response = await fetch(`${BACKEND_URL}/api/auth/validate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Token validation failed');
    }
    
    const data = await response.json();
    
    // Добавляем информацию о пользователе в headers для использования в страницах
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', data.user.userId);
    requestHeaders.set('x-user-email', data.user.email);
    requestHeaders.set('x-user-role', data.user.role);
    requestHeaders.set('x-user-confirmed-email', data.user.confirmedEmail);
    requestHeaders.set('x-user-created-at', data.user.createdAt);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    
  } catch (error) {
    console.error('Token validation error:', error);
    return redirectToSignIn(request);
  }
}

function redirectToSignIn(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/signin', request.url));
  const next = safeNextPath(`${request.nextUrl.pathname}${request.nextUrl.search}`);
  if (next) {
    response.cookies.set(AUTH_NEXT_COOKIE, encodeURIComponent(next), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 30,
    });
  }
  return response;
}

export const config = {
  matcher: [
    /*
     * Применяем middleware ко всем путям кроме:
     * - api routes
     * - _next/static (статические файлы)
     * - _next/image (оптимизация изображений)
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};