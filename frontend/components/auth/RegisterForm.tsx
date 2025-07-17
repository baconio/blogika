/**
 * Компонент формы регистрации
 * @description Микромодуль для создания нового аккаунта с валидацией и выбором роли
 */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth, useAnalytics } from '@/hooks';
import type { RegisterData } from '@/types';

/**
 * Пропсы компонента RegisterForm
 */
export interface RegisterFormProps {
  /** URL для перенаправления после успешной регистрации */
  readonly redirectTo?: string;
  /** Обработчик успешной регистрации */
  readonly onSuccess?: () => void;
  /** Компактный режим отображения */
  readonly compact?: boolean;
  /** Показать ссылку на вход */
  readonly showLoginLink?: boolean;
  /** Роль по умолчанию */
  readonly defaultRole?: 'reader' | 'author';
}

/**
 * Ошибки валидации формы
 */
interface FormErrors {
  readonly email?: string;
  readonly username?: string;
  readonly displayName?: string;
  readonly password?: string;
  readonly confirmPassword?: string;
  readonly acceptTerms?: string;
  readonly general?: string;
}

/**
 * Компонент RegisterForm
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({
  redirectTo = '/dashboard',
  onSuccess,
  compact = false,
  showLoginLink = true,
  defaultRole = 'reader'
}) => {
  const router = useRouter();
  const { register, isLoading, error } = useAuth();
  const { trackEvent } = useAnalytics();

  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    username: '',
    displayName: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    role: defaultRole
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

    // Валидация username
    if (!formData.username.trim()) {
      newErrors.username = 'Имя пользователя обязательно';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Имя пользователя должно содержать минимум 3 символа';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Имя пользователя может содержать только буквы, цифры и подчеркивания';
    }

    // Валидация displayName
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Отображаемое имя обязательно';
    } else if (formData.displayName.length < 2) {
      newErrors.displayName = 'Отображаемое имя должно содержать минимум 2 символа';
    }

    // Валидация пароля
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Пароль должен содержать минимум 8 символов';
    }

    // Валидация подтверждения пароля
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    // Валидация согласия с условиями
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Необходимо согласиться с условиями использования';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработка изменения полей
  const handleInputChange = (field: keyof RegisterData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = event.target as HTMLInputElement;
    const value = field === 'acceptTerms' ? target.checked : target.value;
    
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
      
      await register(formData);
      
      // Трекинг успешной регистрации
      trackEvent({
        name: 'user_register',
        category: 'user',
        properties: {
          role: formData.role,
          method: 'email'
        }
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
      }
    } catch (err) {
      setErrors({
        general: error?.message || 'Произошла ошибка при регистрации'
      });
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto ${compact ? 'p-4' : 'p-6'}`}>
      {!compact && (
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Создать аккаунт
          </h1>
          <p className="text-gray-600">
            Заполните форму для регистрации
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Имя пользователя
          </label>
          <Input
            id="username"
            type="text"
            value={formData.username}
            onChange={handleInputChange('username')}
            placeholder="Введите имя пользователя"
            error={errors.username}
            autoComplete="username"
          />
        </div>

        {/* Display Name */}
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
            Отображаемое имя
          </label>
          <Input
            id="displayName"
            type="text"
            value={formData.displayName}
            onChange={handleInputChange('displayName')}
            placeholder="Как вас называть?"
            error={errors.displayName}
            autoComplete="name"
          />
        </div>

        {/* Role Selection */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Роль
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={handleInputChange('role')}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="reader">Читатель</option>
            <option value="author">Автор</option>
          </select>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Пароль
          </label>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange('password')}
            placeholder="Введите пароль"
            error={errors.password}
            autoComplete="new-password"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Подтвердите пароль
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            placeholder="Повторите пароль"
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
        </div>

        {/* Accept Terms */}
        <div>
          <div className="flex items-start">
            <input
              id="acceptTerms"
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={handleInputChange('acceptTerms')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="acceptTerms" className="ml-3 text-sm text-gray-700">
              Я согласен с условиями использования
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>
          )}
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
          {isLoading ? 'Создание аккаунта...' : 'Создать аккаунт'}
        </Button>

        {/* Login Link */}
        {showLoginLink && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <Link 
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Войти
              </Link>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};