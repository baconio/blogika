/**
 * API модуль для аутентификации и авторизации
 * Поддерживает JWT токены, регистрацию, вход и управление сессией
 */

import { apiClient } from './client'
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ResetPasswordData,
  ConfirmResetPasswordData,
  ChangePasswordData,
  EmailVerificationData,
  ContentPermissions,
  AuthSettings
} from '@/types'

/**
 * Вход в систему
 * @param credentials - данные для входа
 * @returns данные аутентификации с токенами
 */
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
  
  // Сохраняем токены в localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', response.accessToken)
    localStorage.setItem('refreshToken', response.refreshToken)
    localStorage.setItem('tokenExpiresAt', response.expiresAt.toISOString())
  }
  
  return response
}

/**
 * Регистрация нового пользователя
 * @param userData - данные для регистрации
 * @returns данные аутентификации
 */
export const register = async (
  userData: RegisterData
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', userData)
  
  // Сохраняем токены после успешной регистрации
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', response.accessToken)
    localStorage.setItem('refreshToken', response.refreshToken)
    localStorage.setItem('tokenExpiresAt', response.expiresAt.toISOString())
  }
  
  return response
}

/**
 * Выход из системы
 * @returns подтверждение выхода
 */
export const logout = async (): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.post<{ success: boolean }>('/auth/logout')
    
    // Очищаем токены из localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('tokenExpiresAt')
    }
    
    return response
  } catch (error) {
    // Даже при ошибке очищаем локальные токены
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('tokenExpiresAt')
    }
    throw error
  }
}

/**
 * Обновление access токена через refresh токен
 * @returns новые токены
 */
export const refreshToken = async (): Promise<AuthResponse> => {
  const refreshToken = typeof window !== 'undefined' 
    ? localStorage.getItem('refreshToken') 
    : null
    
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await apiClient.post<AuthResponse>('/auth/refresh', {
    refreshToken
  })
  
  // Обновляем токены в localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', response.accessToken)
    localStorage.setItem('refreshToken', response.refreshToken)
    localStorage.setItem('tokenExpiresAt', response.expiresAt.toISOString())
  }
  
  return response
}

/**
 * Получение текущего пользователя
 * @returns данные пользователя
 */
export const getCurrentUser = async (): Promise<AuthResponse['user']> => {
  const response = await apiClient.get<AuthResponse['user']>('/auth/me')
  return response
}

/**
 * Запрос сброса пароля
 * @param data - email для сброса
 * @returns подтверждение отправки
 */
export const requestPasswordReset = async (
  data: ResetPasswordData
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post<{ success: boolean; message: string }>(
    '/auth/reset-password', 
    data
  )
  return response
}

/**
 * Подтверждение сброса пароля
 * @param data - токен и новый пароль
 * @returns подтверждение смены пароля
 */
export const confirmPasswordReset = async (
  data: ConfirmResetPasswordData
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post<{ success: boolean; message: string }>(
    '/auth/reset-password/confirm',
    data
  )
  return response
}

/**
 * Смена пароля для аутентифицированного пользователя
 * @param data - текущий и новый пароли
 * @returns подтверждение смены
 */
export const changePassword = async (
  data: ChangePasswordData
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post<{ success: boolean; message: string }>(
    '/auth/change-password',
    data
  )
  return response
}

/**
 * Верификация email адреса
 * @param data - токен верификации
 * @returns подтверждение верификации
 */
export const verifyEmail = async (
  data: EmailVerificationData
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post<{ success: boolean; message: string }>(
    '/auth/verify-email',
    data
  )
  return response
}

/**
 * Повторная отправка email верификации
 * @returns подтверждение отправки
 */
export const resendVerificationEmail = async (): Promise<{ 
  success: boolean; 
  message: string 
}> => {
  const response = await apiClient.post<{ success: boolean; message: string }>(
    '/auth/verify-email/resend'
  )
  return response
}

/**
 * Получение прав доступа пользователя
 * @returns права доступа к контенту
 */
export const getUserPermissions = async (): Promise<ContentPermissions> => {
  const response = await apiClient.get<ContentPermissions>('/auth/permissions')
  return response
}

/**
 * Получение настроек аутентификации
 * @returns настройки безопасности
 */
export const getAuthSettings = async (): Promise<AuthSettings> => {
  const response = await apiClient.get<AuthSettings>('/auth/settings')
  return response
}

/**
 * Обновление настроек аутентификации
 * @param settings - новые настройки
 * @returns обновленные настройки
 */
export const updateAuthSettings = async (
  settings: Partial<AuthSettings>
): Promise<AuthSettings> => {
  const response = await apiClient.put<AuthSettings>('/auth/settings', settings)
  return response
} 