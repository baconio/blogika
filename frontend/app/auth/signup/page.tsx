/**
 * Страница регистрации
 * Server Component с Client Component формой регистрации
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

/**
 * Метаданные страницы
 */
export const metadata: Metadata = {
  title: 'Регистрация - Новое поколение',
  description: 'Создайте аккаунт на блоговой платформе "Новое поколение". Присоединяйтесь к сообществу авторов и читателей.',
  robots: 'noindex,nofollow', // Не индексируем страницы аутентификации
};

/**
 * Страница регистрации
 */
export default function SignUpPage() {
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Регистрация', isActive: true }
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
              Присоединяйтесь к нам!
            </h1>
            <p className="mt-2 text-base-content/70">
              Создайте аккаунт и станьте частью сообщества
            </p>
          </div>

          {/* Форма регистрации */}
          <div className="bg-base-200 rounded-lg p-8 shadow-sm">
            <RegisterForm />
          </div>

          {/* Дополнительные ссылки */}
          <div className="text-center space-y-4">
            <p className="text-base-content/70">
              Уже есть аккаунт?{' '}
              <Link 
                href="/auth/signin" 
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Войти
              </Link>
            </p>
            
            <div className="flex items-center justify-center space-x-4 text-sm">
              <Link 
                href="/rules" 
                className="text-base-content/70 hover:text-base-content transition-colors"
              >
                Правила
              </Link>
              <span className="text-base-content/40">•</span>
              <Link 
                href="/privacy" 
                className="text-base-content/70 hover:text-base-content transition-colors"
              >
                Конфиденциальность
              </Link>
            </div>
          </div>

          {/* Типы аккаунтов */}
          <div className="bg-base-100 rounded-lg p-6 border">
            <h3 className="font-semibold text-base-content mb-4">
              Выберите тип аккаунта:
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-base-200 rounded-lg">
                <span className="text-2xl">📖</span>
                <div>
                  <div className="font-medium text-base-content">Читатель</div>
                  <div className="text-sm text-base-content/70">
                    Читайте статьи, комментируйте, подписывайтесь на авторов
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <span className="text-2xl">✍️</span>
                <div>
                  <div className="font-medium text-base-content flex items-center gap-2">
                    Автор
                    <span className="badge badge-primary badge-sm">Популярно</span>
                  </div>
                  <div className="text-sm text-base-content/70">
                    Создавайте контент, монетизируйте знания, находите аудиторию
                  </div>
                  <Link 
                    href="/become-author" 
                    className="text-xs text-primary hover:underline mt-1 inline-block"
                  >
                    Узнать больше →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Социальная регистрация */}
          <div className="bg-base-100 rounded-lg p-6 border">
            <h3 className="font-semibold text-base-content mb-4 text-center">
              Или войдите через:
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="btn btn-outline btn-sm flex items-center gap-2">
                <span>🔵</span>
                Google
              </button>
              <button className="btn btn-outline btn-sm flex items-center gap-2">
                <span>⚫</span>
                GitHub
              </button>
            </div>
            <p className="text-xs text-base-content/60 text-center mt-3">
              Быстрая регистрация через социальные сети
            </p>
          </div>

          {/* Согласие с условиями */}
          <div className="text-center">
            <p className="text-xs text-base-content/60">
              Регистрируясь, вы соглашаетесь с{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Условиями использования
              </Link>{' '}
              и{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Политикой конфиденциальности
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 