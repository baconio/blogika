/**
 * Компонент формы входа в систему
 * @description Микромодуль для аутентификации с валидацией и обработкой ошибок
 */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth, useAnalytics } from '@/hooks';
import type { LoginCredentials } from '@/types';

/**
 * Пропсы компонента LoginForm
 */
export interface LoginFormProps {
  /** URL для перенаправления после успешного входа */
  readonly redirectTo?: string;
  /** Обработчик успешного входа */
  readonly onSuccess?: () => void;
  /** Компактный режим отображения */
  readonly compact?: boolean;
  /** Показать ссылку на регистрацию */
  readonly showRegisterLink?: boolean;
}

/**
 * Ошибки валидации формы
 */
interface FormErrors {
  readonly email?: string;
  readonly password?: string;
  readonly general?: string;
}

/**
 * Компонент LoginForm
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  redirectTo = '/dashboard',
  onSuccess,
  compact = false,
  showRegisterLink = true
}) => {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const { trackEvent } = useAnalytics();

  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Валидация email
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    // Валидация пароля
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработка изменения полей
  const handleInputChange = (field: keyof LoginCredentials) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'rememberMe' ? event.target.checked : event.target.value;
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Очищаем ошибку для данного поля
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Обработка отправки формы
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) return;

    try {
      setErrors({});
      
      await login(formData);
      
      // Трекинг успешного входа
      trackEvent({
        name: 'user_login',
        category: 'user',
        properties: {
          method: 'email',
          rememberMe: formData.rememberMe
        }
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
      }
    } catch (err) {
      // Трекинг ошибки входа
      trackEvent({
        name: 'login_error',
        category: 'user',
        properties: {
          error: err instanceof Error ? err.message : 'Unknown error'
        }
      });

      setErrors({
        general: error?.message || 'Произошла ошибка при входе'
      });
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto ${compact ? 'p-4' : 'p-6'}`}>
      {!compact && (
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Вход в систему
          </h1>
          <p className="text-gray-600">
            Введите свои данные для входа
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Общая ошибка */}
        {(errors.general || error) && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">
                  {errors.general || error?.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email адрес
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            placeholder="Введите ваш email"
            error={errors.email}
            autoComplete="email"
            autoFocus
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Пароль
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange('password')}
              placeholder="Введите ваш пароль"
              error={errors.password}
              autoComplete="current-password"
              className="pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              <svg 
                className="h-5 w-5 text-gray-400 hover:text-gray-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {showPassword ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleInputChange('rememberMe')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
              Запомнить меня
            </label>
          </div>

          <Link 
            href="/reset-password"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Забыли пароль?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </Button>

        {/* Register Link */}
        {showRegisterLink && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Нет аккаунта?{' '}
              <Link 
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Зарегистрироваться
              </Link>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}; 