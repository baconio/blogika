/**
 * Страница входа в систему
 * Server Component с Client Component формой аутентификации
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';
import { LoginForm } from '@/components/auth/LoginForm';

/**
 * Метаданные страницы
 */
export const metadata: Metadata = {
  title: 'Вход - Новое поколение',
  description: 'Войдите в свой аккаунт на блоговой платформе "Новое поколение". Читайте и создавайте контент.',
  robots: 'noindex,nofollow', // Не индексируем страницы аутентификации
};

/**
 * Страница входа в систему
 */
export default function SignInPage() {
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Вход', isActive: true }
  ];

  return (
    <PageLayout 
      showBreadcrumbs={true}
      breadcrumbs={breadcrumbs}
      headerProps={{ variant: 'minimal' }}
    >
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Заголовок */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6">
              <span className="text-primary-content font-bold text-xl">НП</span>
            </div>
            <h1 className="text-3xl font-bold text-base-content">
              Добро пожаловать!
            </h1>
            <p className="mt-2 text-base-content/70">
              Войдите в свой аккаунт, чтобы продолжить
            </p>
          </div>

          {/* Форма входа */}
          <div className="bg-base-200 rounded-lg p-8 shadow-sm">
            <LoginForm />
          </div>

          {/* Дополнительные ссылки */}
          <div className="text-center space-y-4">
            <p className="text-base-content/70">
              Еще нет аккаунта?{' '}
              <Link 
                href="/auth/signup" 
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Зарегистрироваться
              </Link>
            </p>
            
            <div className="flex items-center justify-center space-x-4 text-sm">
              <Link 
                href="/help" 
                className="text-base-content/70 hover:text-base-content transition-colors"
              >
                Помощь
              </Link>
              <span className="text-base-content/40">•</span>
              <Link 
                href="/contact" 
                className="text-base-content/70 hover:text-base-content transition-colors"
              >
                Поддержка
              </Link>
            </div>
          </div>

          {/* Преимущества регистрации */}
          <div className="bg-base-100 rounded-lg p-6 border">
            <h3 className="font-semibold text-base-content mb-4">
              Что вы получаете:
            </h3>
            <ul className="space-y-2 text-sm text-base-content/70">
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                Доступ к премиум контенту
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                Персональные рекомендации
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                Возможность комментировать
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                Сохранение закладок
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                Подписки на авторов
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 