/**
 * Базовый тип пользователя системы
 * Используется для аутентификации и авторизации
 */
export interface User {
  readonly id: string;
  readonly email: string;
  readonly username: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly avatar?: string;
  readonly emailVerified: boolean;
  readonly role: UserRole;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Роли пользователей в системе
 */
export type UserRole = 'reader' | 'author' | 'moderator' | 'admin';

/**
 * Данные для регистрации пользователя
 */
export interface UserRegistrationData {
  readonly email: string;
  readonly username: string;
  readonly password: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly role: 'reader' | 'author';
}

/**
 * Данные для входа в систему
 */
export interface UserLoginData {
  readonly email: string;
  readonly password: string;
}

/**
 * Данные для обновления профиля
 */
export interface UserProfileUpdate {
  readonly username?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly avatar?: string;
}

/**
 * Сессия пользователя
 */
export interface UserSession {
  readonly user: User;
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresAt: Date;
} 