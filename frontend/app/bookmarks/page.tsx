/**
 * Страница закладок пользователя
 * Server Component со списком сохраненных статей
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ArticleCard } from '@/components/features/ArticleCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';
import type { Article } from '@/types';

/**
 * Метаданные страницы
 */
export const metadata: Metadata = {
  title: 'Мои закладки - Новое поколение',
  description: 'Ваши сохраненные статьи на платформе "Новое поколение". Читайте позже интересные материалы.',
  robots: 'noindex,nofollow', // Приватная страница пользователя
};

/**
 * Моковые данные закладок для демонстрации
 */
const mockBookmarks: Article[] = [
  {
    id: '1',
    title: 'Микромодульная архитектура в React: Полное руководство',
    slug: 'micromodular-react-guide',
    excerpt: 'Изучаем принципы создания масштабируемых React приложений с помощью микромодульной архитектуры.',
    content: '',
    coverImage: undefined,
    status: 'published',
    accessLevel: 'free',
    price: 0,
    isFeatured: true,
    readingTime: 12,
    viewsCount: 15420,
    likesCount: 342,
    commentsCount: 89,
    sharesCount: 156,
    publishedAt: '2024-01-15T10:00:00Z',
    scheduledAt: undefined,
    author: {
      id: '1',
      displayName: 'Анна Смирнова',
      username: 'anna-smirnova',
      bio: '',
      avatar: undefined,
      coverImage: undefined,
      isVerified: true,
      subscriberCount: 1245,
      totalEarnings: 0,
      subscriptionPrice: 990,
      contentAccessLevel: 'free',
      socialLinks: []
    },
    category: {
      id: '1',
      name: 'Технологии',
      slug: 'tech',
      description: '',
      color: '#3B82F6',
      icon: undefined,
      isActive: true
    },
    tags: [
      { id: '1', name: 'React', slug: 'react', description: '', color: '#61DAFB', usageCount: 45 },
      { id: '2', name: 'TypeScript', slug: 'typescript', description: '', color: '#3178C6', usageCount: 38 }
    ],
    seoMeta: undefined
  },
  {
    id: '2',
    title: 'UX/UI Тренды 2024: Что нужно знать дизайнеру',
    slug: 'ux-ui-trends-2024-guide',
    excerpt: 'Разбираем главные тренды в UX/UI дизайне и их практическое применение.',
    content: '',
    coverImage: undefined,
    status: 'published',
    accessLevel: 'premium',
    price: 299,
    isFeatured: false,
    readingTime: 8,
    viewsCount: 8543,
    likesCount: 187,
    commentsCount: 34,
    sharesCount: 67,
    publishedAt: '2024-01-10T14:30:00Z',
    scheduledAt: undefined,
    author: {
      id: '2',
      displayName: 'Максим Петров',
      username: 'maxim-petrov',
      bio: '',
      avatar: undefined,
      coverImage: undefined,
      isVerified: true,
      subscriberCount: 892,
      totalEarnings: 0,
      subscriptionPrice: 690,
      contentAccessLevel: 'premium',
      socialLinks: []
    },
    category: {
      id: '2',
      name: 'Дизайн',
      slug: 'design',
      description: '',
      color: '#8B5CF6',
      icon: undefined,
      isActive: true
    },
    tags: [
      { id: '3', name: 'UX', slug: 'ux', description: '', color: '#F59E0B', usageCount: 29 },
      { id: '4', name: 'Дизайн', slug: 'design', description: '', color: '#8B5CF6', usageCount: 31 }
    ],
    seoMeta: undefined
  }
];

/**
 * Компонент фильтров закладок
 */
const BookmarksFilters = () => (
  <div className="flex flex-wrap gap-4 mb-6">
    <Badge variant="default" className="cursor-pointer">
      Все закладки
    </Badge>
    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-content">
      Непрочитанные
    </Badge>
    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-content">
      Избранные
    </Badge>
    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-content">
      Технологии
    </Badge>
    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-content">
      Дизайн
    </Badge>
  </div>
);

/**
 * Компонент пустого состояния
 */
const EmptyBookmarks = () => (
  <div className="text-center py-16">
    <div className="text-6xl mb-4">📖</div>
    <h2 className="text-2xl font-bold text-base-content mb-4">
      Пока что закладок нет
    </h2>
    <p className="text-base-content/70 mb-8 max-w-md mx-auto">
      Начните сохранять интересные статьи, чтобы прочитать их позже. 
      Нажмите на значок закладки рядом с любой статьей.
    </p>
    <a href="/articles" className="btn btn-primary">
      Найти статьи
    </a>
  </div>
);

/**
 * Основной компонент страницы закладок
 */
export default function BookmarksPage() {
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Мои закладки', isActive: true }
  ];

  const hasBookmarks = mockBookmarks.length > 0;

  return (
    <PageLayout 
      showBreadcrumbs={true}
      breadcrumbs={breadcrumbs}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-base-content mb-2">
              Мои закладки
            </h1>
            <p className="text-base-content/70">
              {hasBookmarks ? `${mockBookmarks.length} сохраненных статей` : 'Здесь будут ваши сохраненные статьи'}
            </p>
          </div>
          
          {hasBookmarks && (
            <div className="flex gap-2">
              <button className="btn btn-outline btn-sm">
                Экспорт
              </button>
              <button className="btn btn-outline btn-sm">
                Очистить все
              </button>
            </div>
          )}
        </div>

        {hasBookmarks ? (
          <>
            {/* Фильтры */}
            <BookmarksFilters />

            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-base-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">{mockBookmarks.length}</div>
                <div className="text-sm text-base-content/70">Всего закладок</div>
              </div>
              <div className="bg-base-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-info">
                  {Math.round(mockBookmarks.reduce((sum, article) => sum + article.readingTime, 0))} мин
                </div>
                <div className="text-sm text-base-content/70">Время чтения</div>
              </div>
              <div className="bg-base-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-success">
                  {mockBookmarks.filter(article => article.accessLevel === 'free').length}
                </div>
                <div className="text-sm text-base-content/70">Бесплатных</div>
              </div>
            </div>

            {/* Список закладок */}
            <Suspense fallback={<LoadingSpinner />}>
              <div className="space-y-6">
                {mockBookmarks.map((article) => (
                  <div key={article.id} className="relative">
                    <div className="absolute top-4 right-4 z-10">
                      <button className="btn btn-circle btn-sm btn-ghost text-red-500 hover:bg-red-100">
                        🗑️
                      </button>
                    </div>
                    <ArticleCard
                      article={article}
                      variant="horizontal"
                      showStats={true}
                    />
                  </div>
                ))}
              </div>
            </Suspense>

            {/* Пагинация */}
            <div className="flex justify-center mt-12">
              <div className="join">
                <button className="join-item btn">«</button>
                <button className="join-item btn btn-active">1</button>
                <button className="join-item btn">2</button>
                <button className="join-item btn">»</button>
              </div>
            </div>
          </>
        ) : (
          <EmptyBookmarks />
        )}

        {/* Советы */}
        <div className="mt-16 bg-base-200 rounded-lg p-8">
          <h2 className="text-xl font-bold text-base-content mb-4">
            💡 Полезные советы
          </h2>
          <ul className="space-y-2 text-base-content/70">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Добавляйте статьи в закладки, чтобы прочитать их позже
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Используйте фильтры для быстрого поиска нужных статей
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Закладки синхронизируются между всеми вашими устройствами
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Экспортируйте закладки для резервного копирования
            </li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
} 