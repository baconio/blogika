/**
 * Next.js Middleware для аутентификации и авторизации
 * @description Проверяет JWT токены и перенаправляет пользователей
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

/**
 * Интерфейс JWT payload
 */
interface JWTPayload {
  readonly userId: string;
  readonly email: string;
  readonly role: string;
  readonly exp: number;
}

/**
 * Защищенные маршруты, требующие аутентификации
 */
const PROTECTED_ROUTES = [
  '/dashboard',
  '/write',
  '/settings',
  '/profile'
];

/**
 * Маршруты только для гостей (не аутентифицированных пользователей)
 */
const GUEST_ONLY_ROUTES = [
  '/login',
  '/register',
  '/reset-password'
];

/**
 * Маршруты для конкретных ролей
 */
const ROLE_PROTECTED_ROUTES = {
  '/admin': ['admin'],
  '/dashboard/analytics': ['author', 'admin'],
  '/dashboard/moderation': ['moderator', 'admin']
};

/**
 * Проверка валидности JWT токена
 */
const verifyToken = (token: string): JWTPayload | null => {
  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const payload = jwt.verify(token, secret) as JWTPayload;
    
    // Проверяем срок действия токена
    if (payload.exp * 1000 < Date.now()) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
};

/**
 * Получение токена из запроса
 */
const getTokenFromRequest = (request: NextRequest): string | null => {
  // Проверяем заголовок Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Проверяем cookie
  const cookieToken = request.cookies.get('accessToken')?.value;
  if (cookieToken) {
    return cookieToken;
  }
  
  return null;
};

/**
 * Проверка, является ли маршрут защищенным
 */
const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
};

/**
 * Проверка, является ли маршрут только для гостей
 */
const isGuestOnlyRoute = (pathname: string): boolean => {
  return GUEST_ONLY_ROUTES.some(route => pathname.startsWith(route));
};

/**
 * Проверка доступа по роли
 */
const hasRoleAccess = (pathname: string, userRole: string): boolean => {
  for (const [route, allowedRoles] of Object.entries(ROLE_PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      return allowedRoles.includes(userRole);
    }
  }
  return true; // Если маршрут не защищен по ролям
};

/**
 * Основная функция middleware
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Пропускаем API маршруты и статические файлы
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const token = getTokenFromRequest(request);
  const user = token ? verifyToken(token) : null;
  const isAuthenticated = !!user;

  // Для аутентифицированных пользователей на guest-only страницах
  if (isAuthenticated && isGuestOnlyRoute(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Для защищенных маршрутов
  if (isProtectedRoute(pathname)) {
    // Пользователь не аутентифицирован
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Проверка доступа по роли
    if (!hasRoleAccess(pathname, user.role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Добавляем заголовки с информацией о пользователе для Server Components
  if (isAuthenticated && user) {
    const response = NextResponse.next();
    response.headers.set('x-user-id', user.userId);
    response.headers.set('x-user-role', user.role);
    response.headers.set('x-user-email', user.email);
    return response;
  }

  return NextResponse.next();
}

/**
 * Конфигурация маршрутов для применения middleware
 */
export const config = {
  matcher: [
    /*
     * Применять middleware ко всем маршрутам кроме:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 