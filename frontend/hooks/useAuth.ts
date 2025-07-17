/**
 * React хук для аутентификации и управления сессией
 * @description Микромодуль для управления состоянием пользователя и JWT токенами
 */
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as authApi from '@/lib/api/auth';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UserSession,
  AuthState,
  AuthError,
  ContentPermissions
} from '@/types';

export type Maybe<T> = T | undefined;

/**
 * Параметры хука useAuth
 */
export interface UseAuthParams {
  /** Автоматически перенаправлять неаутентифицированных пользователей */
  readonly redirectOnLogout?: string;
  /** Проверять токены при инициализации */
  readonly validateTokens?: boolean;
}

/**
 * Результат хука useAuth
 */
export interface UseAuthResult {
  /** Состояние аутентификации */
  readonly authState: AuthState;
  /** Сессия пользователя */
  readonly session: Maybe<UserSession>;
  /** Права доступа пользователя */
  readonly permissions: Maybe<ContentPermissions>;
  /** Ошибка аутентификации */
  readonly error: Maybe<AuthError>;
  /** Вход в систему */
  readonly login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  /** Регистрация */
  readonly register: (userData: RegisterData) => Promise<AuthResponse>;
  /** Выход из системы */
  readonly logout: () => Promise<void>;
  /** Обновление токена */
  readonly refreshToken: () => Promise<AuthResponse>;
  /** Загружается ли операция */
  readonly isLoading: boolean;
  /** Аутентифицирован ли пользователь */
  readonly isAuthenticated: boolean;
}

/**
 * Получение токенов из localStorage
 */
const getStoredTokens = (): {
  accessToken: Maybe<string>;
  refreshToken: Maybe<string>;
  expiresAt: Maybe<Date>;
} => {
  if (typeof window === 'undefined') {
    return { accessToken: undefined, refreshToken: undefined, expiresAt: undefined };
  }

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const expiresAtStr = localStorage.getItem('tokenExpiresAt');
  
  const expiresAt = expiresAtStr ? new Date(expiresAtStr) : undefined;

  return { accessToken, refreshToken, expiresAt };
};

/**
 * Проверка валидности токена
 */
const isTokenValid = (expiresAt: Maybe<Date>): boolean => {
  if (!expiresAt) return false;
  return new Date() < expiresAt;
};

/**
 * Хук для работы с аутентификацией
 * @param params - параметры хука
 * @returns функции и состояние аутентификации
 */
export const useAuth = (params: UseAuthParams = {}): UseAuthResult => {
  const {
    redirectOnLogout = '/login',
    validateTokens = true
  } = params;

  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [session, setSession] = useState<Maybe<UserSession>>(undefined);
  const [error, setError] = useState<Maybe<AuthError>>(undefined);

  // Получение текущего пользователя
  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError
  } = useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: authApi.getCurrentUser,
    enabled: false, // Включаем только при наличии валидного токена
    retry: false,
    staleTime: 5 * 60 * 1000 // 5 минут
  });

  // Получение прав доступа
  const { data: permissions } = useQuery({
    queryKey: ['auth', 'permissions'],
    queryFn: authApi.getUserPermissions,
    enabled: !!session?.isAuthenticated,
    staleTime: 10 * 60 * 1000 // 10 минут
  });

  // Мутация входа
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      updateSession(response);
      setError(undefined);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (err) => {
      setError({
        code: 'INVALID_CREDENTIALS',
        message: err instanceof Error ? err.message : 'Login failed'
      });
    }
  });

  // Мутация регистрации
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      updateSession(response);
      setError(undefined);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (err) => {
      setError({
        code: 'UNKNOWN_ERROR',
        message: err instanceof Error ? err.message : 'Registration failed'
      });
    }
  });

  // Мутация выхода
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearSession();
      queryClient.clear();
      router.push(redirectOnLogout);
    },
    onError: () => {
      // Даже при ошибке очищаем сессию
      clearSession();
      queryClient.clear();
      router.push(redirectOnLogout);
    }
  });

  // Мутация обновления токена
  const refreshMutation = useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: (response) => {
      updateSession(response);
      setError(undefined);
    },
    onError: () => {
      clearSession();
      router.push(redirectOnLogout);
    }
  });

  // Обновление сессии
  const updateSession = useCallback((authResponse: AuthResponse) => {
    const newSession: UserSession = {
      user: authResponse.user,
      accessToken: authResponse.accessToken,
      expiresAt: authResponse.expiresAt,
      isAuthenticated: true,
      isLoading: false
    };

    setSession(newSession);
    setAuthState('authenticated');
  }, []);

  // Очистка сессии
  const clearSession = useCallback(() => {
    setSession(undefined);
    setAuthState('unauthenticated');
    setError(undefined);

    // Очищаем localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiresAt');
    }
  }, []);

  // Инициализация сессии при загрузке
  useEffect(() => {
    if (!validateTokens) {
      setAuthState('unauthenticated');
      return;
    }

    const { accessToken, refreshToken, expiresAt } = getStoredTokens();

    if (!accessToken || !refreshToken) {
      setAuthState('unauthenticated');
      return;
    }

    if (isTokenValid(expiresAt)) {
      // Токен валидный, получаем данные пользователя
      queryClient.refetchQueries({ queryKey: ['auth', 'currentUser'] });
    } else if (refreshToken) {
      // Токен истек, пытаемся обновить
      refreshMutation.mutate();
    } else {
      clearSession();
    }
  }, [validateTokens, refreshMutation, queryClient, clearSession]);

  // Обновляем сессию при получении данных пользователя
  useEffect(() => {
    if (currentUser && !session?.isAuthenticated) {
      const { accessToken, expiresAt } = getStoredTokens();
      
      if (accessToken && expiresAt) {
        updateSession({
          user: currentUser,
          accessToken,
          refreshToken: '', // Не нужен для отображения
          expiresAt
        });
      }
    }
  }, [currentUser, session, updateSession]);

  // Обработка ошибок пользователя
  useEffect(() => {
    if (userError) {
      clearSession();
    }
  }, [userError, clearSession]);

  // Функции управления
  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setError(undefined);
    return loginMutation.mutateAsync(credentials);
  }, [loginMutation]);

  const register = useCallback(async (userData: RegisterData): Promise<AuthResponse> => {
    setError(undefined);
    return registerMutation.mutateAsync(userData);
  }, [registerMutation]);

  const logout = useCallback(async (): Promise<void> => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const refreshToken = useCallback(async (): Promise<AuthResponse> => {
    return refreshMutation.mutateAsync();
  }, [refreshMutation]);

  const isLoading = useMemo(() => {
    return authState === 'loading' || 
           loginMutation.isPending || 
           registerMutation.isPending || 
           logoutMutation.isPending ||
           refreshMutation.isPending ||
           isUserLoading;
  }, [
    authState,
    loginMutation.isPending,
    registerMutation.isPending,
    logoutMutation.isPending,
    refreshMutation.isPending,
    isUserLoading
  ]);

  const isAuthenticated = useMemo(() => {
    return authState === 'authenticated' && !!session?.isAuthenticated;
  }, [authState, session]);

  return useMemo(() => ({
    authState,
    session,
    permissions,
    error,
    login,
    register,
    logout,
    refreshToken,
    isLoading,
    isAuthenticated
  }), [
    authState,
    session,
    permissions,
    error,
    login,
    register,
    logout,
    refreshToken,
    isLoading,
    isAuthenticated
  ]);
}; 