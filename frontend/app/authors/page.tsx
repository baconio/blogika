/**
 * Страница каталога всех авторов
 * Server Component с фильтрацией и поиском
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AuthorCard } from '@/components/author/AuthorCard';
import { SearchBar } from '@/components/navigation/SearchBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';

/**
 * Метаданные страницы
 */
export const metadata: Metadata = {
  title: 'Авторы - Новое поколение',
  description: 'Познакомьтесь с талантливыми авторами блоговой платформы "Новое поколение". Читайте статьи лучших экспертов в различных областях.',
  keywords: 'авторы, блогеры, эксперты, писатели, контент',
  openGraph: {
    title: 'Авторы - Новое поколение',
    description: 'Познакомьтесь с талантливыми авторами блоговой платформы "Новое поколение"',
    type: 'website',
  },
};

/**
 * Моковые данные авторов для демонстрации
 */
const mockAuthors = [
  {
    id: '1',
    displayName: 'Анна Смирнова',
    username: 'anna-smirnova',
    bio: 'Frontend разработчик с 8-летним опытом. Специализируюсь на React, TypeScript и современных веб-технологиях.',
    avatar: undefined,
    coverImage: undefined,
    isVerified: true,
    subscriberCount: 1245,
    totalEarnings: 125000,
    subscriptionPrice: 990,
    contentAccessLevel: 'premium' as const,
    socialLinks: [
      { platform: 'github' as const, url: 'https://github.com/anna-smirnova', handle: 'anna-smirnova' },
      { platform: 'telegram' as const, url: 'https://t.me/anna_dev', handle: 'anna_dev' }
    ],
    articlesCount: 45,
    joinedAt: '2023-01-15'
  },
  {
    id: '2',
    displayName: 'Максим Петров',
    username: 'maxim-petrov',
    bio: 'UX/UI дизайнер и продакт-менеджер. Помогаю создавать пользовательские интерфейсы, которые решают реальные проблемы.',
    avatar: undefined,
    coverImage: undefined,
    isVerified: true,
    subscriberCount: 892,
    totalEarnings: 67500,
    subscriptionPrice: 690,
    contentAccessLevel: 'subscription' as const,
    socialLinks: [
      { platform: 'linkedin' as const, url: 'https://linkedin.com/in/maxim-petrov', handle: 'maxim-petrov' },
      { platform: 'instagram' as const, url: 'https://instagram.com/maxim_design', handle: 'maxim_design' }
    ],
    articlesCount: 32,
    joinedAt: '2023-03-22'
  },
  {
    id: '3',
    displayName: 'Елена Козлова',
    username: 'elena-kozlova',
    bio: 'Маркетолог и SMM-специалист. Делюсь опытом продвижения в социальных сетях и контент-маркетинга.',
    avatar: undefined,
    coverImage: undefined,
    isVerified: false,
    subscriberCount: 567,
    totalEarnings: 34200,
    subscriptionPrice: 490,
    contentAccessLevel: 'free' as const,
    socialLinks: [
      { platform: 'telegram' as const, url: 'https://t.me/elena_marketing', handle: 'elena_marketing' },
      { platform: 'youtube' as const, url: 'https://youtube.com/@elena_kozlova', handle: 'elena_kozlova' }
    ],
    articlesCount: 28,
    joinedAt: '2023-06-10'
  }
];

/**
 * Компонент статистики авторов
 */
const AuthorsStats = ({ authors }: { readonly authors: typeof mockAuthors }) => {
  const totalAuthors = authors.length;
  const verifiedAuthors = authors.filter(author => author.isVerified).length;
  const avgSubscribers = Math.round(authors.reduce((sum, author) => sum + author.subscriberCount, 0) / totalAuthors);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-base-200 rounded-lg p-6 text-center">
        <div className="text-3xl font-bold text-primary">{totalAuthors}</div>
        <div className="text-sm text-base-content/70">Всего авторов</div>
      </div>
      <div className="bg-base-200 rounded-lg p-6 text-center">
        <div className="text-3xl font-bold text-success">{verifiedAuthors}</div>
        <div className="text-sm text-base-content/70">Верифицированных</div>
      </div>
      <div className="bg-base-200 rounded-lg p-6 text-center">
        <div className="text-3xl font-bold text-info">{avgSubscribers}</div>
        <div className="text-sm text-base-content/70">Среднее подписчиков</div>
      </div>
    </div>
  );
};

/**
 * Компонент фильтров авторов
 */
const AuthorsFilters = () => (
  <div className="flex flex-wrap gap-4 mb-6">
    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-content">
      Все авторы
    </Badge>
    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-content">
      Верифицированные
    </Badge>
    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-content">
      Технологии
    </Badge>
    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-content">
      Дизайн
    </Badge>
    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-content">
      Бизнес
    </Badge>
    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-content">
      Маркетинг
    </Badge>
  </div>
);

/**
 * Основной компонент страницы авторов
 */
export default function AuthorsPage() {
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Авторы', isActive: true }
  ];

  return (
    <PageLayout 
      showBreadcrumbs={true}
      breadcrumbs={breadcrumbs}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок и описание */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Наши авторы
          </h1>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto mb-8">
            Познакомьтесь с талантливыми авторами, которые делятся своими знаниями 
            и опытом на платформе "Новое поколение"
          </p>

          {/* Поиск */}
          <div className="max-w-md mx-auto">
            <SearchBar 
              placeholder="Поиск авторов..."
              variant="full"
            />
          </div>
        </div>

        {/* Статистика */}
        <AuthorsStats authors={mockAuthors} />

        {/* Фильтры */}
        <AuthorsFilters />

        {/* Сетка авторов */}
        <Suspense fallback={<LoadingSpinner />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAuthors.map((author) => (
              <AuthorCard
                key={author.id}
                author={author}
                showStats={true}
                variant="card"
              />
            ))}
          </div>
        </Suspense>

        {/* Пагинация */}
        <div className="flex justify-center mt-12">
          <div className="join">
            <button className="join-item btn">«</button>
            <button className="join-item btn btn-active">1</button>
            <button className="join-item btn">2</button>
            <button className="join-item btn">3</button>
            <button className="join-item btn">»</button>
          </div>
        </div>

        {/* Призыв к действию */}
        <div className="text-center mt-16 bg-base-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-base-content mb-4">
            Хотите стать автором?
          </h2>
          <p className="text-base-content/70 mb-6">
            Присоединяйтесь к нашему сообществу и начните делиться своими знаниями
          </p>
          <a 
            href="/become-author" 
            className="btn btn-primary btn-lg"
          >
            Стать автором
          </a>
        </div>
      </div>
    </PageLayout>
  );
} 