/**
 * Компонент защиты маршрутов и контроля доступа
 * @description Микромодуль для проверки аутентификации и прав доступа
 */
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { LoginForm } from './LoginForm';
import { useAuth } from '@/hooks';
import type { UserRole } from '@/types';

/**
 * Пропсы компонента AuthGuard
 */
export interface AuthGuardProps {
  /** Дочерние компоненты для отображения */
  readonly children: React.ReactNode;
  /** Требуемые роли для доступа */
  readonly requiredRoles?: readonly UserRole[];
  /** Уровень доступа к контенту */
  readonly contentAccess?: 'free' | 'premium' | 'subscription';
  /** URL для перенаправления неаутентифицированных пользователей */
  readonly redirectTo?: string;
  /** Показать форму входа вместо перенаправления */
  readonly showLoginForm?: boolean;
  /** Сообщение при отсутствии доступа */
  readonly accessDeniedMessage?: string;
  /** Fallback компонент при загрузке */
  readonly loadingComponent?: React.ReactNode;
}

/**
 * Компонент сообщения об отказе в доступе
 */
const AccessDenied: React.FC<{
  readonly message: string;
  readonly showUpgrade?: boolean;
  readonly onUpgrade?: () => void;
}> = ({ message, showUpgrade = false, onUpgrade }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Доступ ограничен
      </h2>
      <p className="text-gray-600 mb-6">
        {message}
      </p>
      {showUpgrade && (
        <button
          onClick={onUpgrade}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Получить доступ
        </button>
      )}
    </div>
  </div>
);

/**
 * Компонент AuthGuard
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRoles = [],
  contentAccess = 'free',
  redirectTo = '/login',
  showLoginForm = false,
  accessDeniedMessage = 'У вас нет доступа к этой странице',
  loadingComponent
}) => {
  const router = useRouter();
  const { authState, session, permissions, isLoading } = useAuth();

  // Состояние загрузки
  if (isLoading || authState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {loadingComponent || (
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Проверка доступа...</p>
          </div>
        )}
      </div>
    );
  }

  // Пользователь не аутентифицирован
  if (authState === 'unauthenticated' || !session?.isAuthenticated) {
    if (showLoginForm) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full">
            <LoginForm redirectTo={redirectTo} />
          </div>
        </div>
      );
    } else {
      router.push(redirectTo);
      return null;
    }
  }

  // Проверка ролей пользователя
  if (requiredRoles.length > 0 && session.user.role) {
    const hasRequiredRole = requiredRoles.includes(session.user.role);
    if (!hasRequiredRole) {
      return (
        <AccessDenied 
          message={`Эта страница доступна только для: ${requiredRoles.join(', ')}`}
        />
      );
    }
  }

  // Проверка доступа к контенту
  if (contentAccess !== 'free' && permissions) {
    let hasContentAccess = false;
    
    switch (contentAccess) {
      case 'premium':
        hasContentAccess = permissions.canReadPremium;
        break;
      case 'subscription':
        hasContentAccess = permissions.canReadSubscription;
        break;
      default:
        hasContentAccess = true;
    }

    if (!hasContentAccess) {
      const upgradeMessage = contentAccess === 'premium' 
        ? 'Этот контент доступен только для премиум пользователей'
        : 'Этот контент доступен только по подписке';

      return (
        <AccessDenied 
          message={upgradeMessage}
          showUpgrade={true}
          onUpgrade={() => router.push('/pricing')}
        />
      );
    }
  }

  // Проверки пройдены, отображаем контент
  return <>{children}</>;
};

/**
 * HOC для защиты компонентов
 */
export const withAuthGuard = <P extends object>(
  Component: React.ComponentType<P>,
  guardProps: Omit<AuthGuardProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <AuthGuard {...guardProps}>
      <Component {...props} />
    </AuthGuard>
  );
  
  WrappedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

/**
 * Хук для условного рендеринга на основе прав доступа
 */
export const useAccessControl = () => {
  const { session, permissions } = useAuth();

  const hasRole = (role: UserRole): boolean => {
    return session?.user.role === role;
  };

  const canAccess = (contentAccess: 'free' | 'premium' | 'subscription'): boolean => {
    if (!permissions) return false;
    
    switch (contentAccess) {
      case 'free':
        return permissions.canReadFree;
      case 'premium':
        return permissions.canReadPremium;
      case 'subscription':
        return permissions.canReadSubscription;
      default:
        return false;
    }
  };

  const canPerform = (action: keyof Omit<typeof permissions, 'canReadFree' | 'canReadPremium' | 'canReadSubscription'>): boolean => {
    if (!permissions) return false;
    return permissions[action];
  };

  return {
    isAuthenticated: !!session?.isAuthenticated,
    currentUser: session?.user,
    hasRole,
    canAccess,
    canPerform,
    permissions
  };
}; 