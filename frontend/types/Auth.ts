/**
 * Типы для системы аутентификации и авторизации
 * Поддерживает JWT токены, роли пользователей и сессии
 */

import type { User } from './User'

/**
 * Данные для входа в систему
 */
export interface LoginCredentials {
  /** Email пользователя */
  readonly email: string
  /** Пароль */
  readonly password: string
  /** Запомнить пользователя */
  readonly rememberMe?: boolean
}

/**
 * Данные для регистрации
 */
export interface RegisterData {
  /** Email пользователя */
  readonly email: string
  /** Имя пользователя */
  readonly username: string
  /** Отображаемое имя */
  readonly displayName: string
  /** Пароль */
  readonly password: string
  /** Подтверждение пароля */
  readonly confirmPassword: string
  /** Согласие с условиями */
  readonly acceptTerms: boolean
  /** Роль пользователя */
  readonly role?: 'reader' | 'author'
}

/**
 * Ответ аутентификации с токенами
 */
export interface AuthResponse {
  /** Пользователь */
  readonly user: User
  /** JWT access токен */
  readonly accessToken: string
  /** JWT refresh токен */
  readonly refreshToken: string
  /** Время истечения access токена */
  readonly expiresAt: Date
}

/**
 * Данные сессии пользователя
 */
export interface UserSession {
  /** Пользователь */
  readonly user: User
  /** Access токен */
  readonly accessToken: string
  /** Время истечения токена */
  readonly expiresAt: Date
  /** Аутентифицирован ли пользователь */
  readonly isAuthenticated: boolean
  /** Загружается ли сессия */
  readonly isLoading: boolean
}

/**
 * Данные для сброса пароля
 */
export interface ResetPasswordData {
  /** Email для сброса */
  readonly email: string
}

/**
 * Данные для подтверждения сброса пароля
 */
export interface ConfirmResetPasswordData {
  /** Токен сброса */
  readonly token: string
  /** Новый пароль */
  readonly password: string
  /** Подтверждение нового пароля */
  readonly confirmPassword: string
}

/**
 * Данные для смены пароля
 */
export interface ChangePasswordData {
  /** Текущий пароль */
  readonly currentPassword: string
  /** Новый пароль */
  readonly newPassword: string
  /** Подтверждение нового пароля */
  readonly confirmPassword: string
}

/**
 * Данные верификации email
 */
export interface EmailVerificationData {
  /** Токен верификации */
  readonly token: string
}

/**
 * Ошибка аутентификации
 */
export interface AuthError {
  /** Код ошибки */
  readonly code: AuthErrorCode
  /** Сообщение ошибки */
  readonly message: string
  /** Поле с ошибкой (для валидации форм) */
  readonly field?: string
}

/**
 * Коды ошибок аутентификации
 */
export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'USER_NOT_FOUND'
  | 'EMAIL_ALREADY_EXISTS'
  | 'USERNAME_ALREADY_EXISTS'
  | 'WEAK_PASSWORD'
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED'
  | 'EMAIL_NOT_VERIFIED'
  | 'ACCOUNT_SUSPENDED'
  | 'TOO_MANY_ATTEMPTS'
  | 'UNKNOWN_ERROR'

/**
 * Состояние аутентификации
 */
export type AuthState = 
  | 'loading'           // Загрузка сессии
  | 'authenticated'     // Пользователь аутентифицирован
  | 'unauthenticated'   // Пользователь не аутентифицирован
  | 'error'             // Ошибка аутентификации

/**
 * Права доступа к контенту
 */
export interface ContentPermissions {
  /** Может читать бесплатный контент */
  readonly canReadFree: boolean
  /** Может читать премиум контент */
  readonly canReadPremium: boolean
  /** Может читать контент по подписке */
  readonly canReadSubscription: boolean
  /** Может создавать статьи */
  readonly canCreateArticles: boolean
  /** Может редактировать статьи */
  readonly canEditArticles: boolean
  /** Может модерировать комментарии */
  readonly canModerateComments: boolean
  /** Может управлять пользователями */
  readonly canManageUsers: boolean
}

/**
 * Настройки аутентификации
 */
export interface AuthSettings {
  /** Включена ли двухфакторная аутентификация */
  readonly twoFactorEnabled: boolean
  /** Уведомления о входе */
  readonly loginNotifications: boolean
  /** Автоматический выход через N дней */
  readonly autoLogoutDays: number
  /** Разрешить вход с нескольких устройств */
  readonly allowMultipleDevices: boolean
} 