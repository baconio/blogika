/**
 * Страница популярных/трендовых статей
 * Server Component с фильтрацией по периодам и метрикам
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';
import { ArticleCard } from '@/components/features/ArticleCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';
import type { Article } from '@/types';

/**
 * Метаданные страницы
 */
export const metadata: Metadata = {
  title: 'Популярные статьи - Новое поколение',
  description: 'Самые популярные и трендовые статьи на блоговой платформе "Новое поколение". Читайте лучший контент от ведущих авторов.',
  keywords: 'популярные статьи, тренды, лучшие статьи, топ контент',
  openGraph: {
    title: 'Популярные статьи - Новое поколение',
    description: 'Самые популярные и трендовые статьи на блоговой платформе "Новое поколение"',
    type: 'website',
  },
};

/**
 * Моковые данные популярных статей
 */
const mockTrendingArticles: Article[] = [
  {
    id: '1',
    title: 'Микромодульная архитектура в React: Руководство для 2024',
    slug: 'micromodular-react-architecture-2024',
    excerpt: 'Изучаем принципы создания масштабируемых React приложений с помощью микромодульной архитектуры. Практические примеры и лучшие практики.',
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
    title: 'UX/UI Тренды 2024: Что будет популярно в дизайне',
    slug: 'ux-ui-trends-2024',
    excerpt: 'Обзор главных трендов в UX/UI дизайне на 2024 год. Нейроморфизм, AI-интерфейсы, sustainability дизайн и другие направления.',
    content: '',
    coverImage: undefined,
    status: 'published',
    accessLevel: 'premium',
    price: 299,
    isFeatured: true,
    readingTime: 8,
    viewsCount: 12330,
    likesCount: 287,
    commentsCount: 45,
    sharesCount: 98,
    publishedAt: '2024-01-14T14:30:00Z',
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
      { id: '4', name: 'UI', slug: 'ui', description: '', color: '#10B981', usageCount: 31 }
    ],
    seoMeta: undefined
  },
  {
    id: '3',
    title: 'Монетизация контента: 7 проверенных стратегий',
    slug: 'content-monetization-strategies',
    excerpt: 'Подробный гид по монетизации авторского контента. От подписок до спонсорства - все способы заработка для контент-криейторов.',
    content: '',
    coverImage: undefined,
    status: 'published',
    accessLevel: 'free',
    price: 0,
    isFeatured: false,
    readingTime: 15,
    viewsCount: 9876,
    likesCount: 234,
    commentsCount: 67,
    sharesCount: 145,
    publishedAt: '2024-01-13T09:15:00Z',
    scheduledAt: undefined,
    author: {
      id: '3',
      displayName: 'Елена Козлова',
      username: 'elena-kozlova',
      bio: '',
      avatar: undefined,
      coverImage: undefined,
      isVerified: false,
      subscriberCount: 567,
      totalEarnings: 0,
      subscriptionPrice: 490,
      contentAccessLevel: 'free',
      socialLinks: []
    },
    category: {
      id: '3',
      name: 'Бизнес',
      slug: 'business',
      description: '',
      color: '#10B981',
      icon: undefined,
      isActive: true
    },
    tags: [
      { id: '5', name: 'Монетизация', slug: 'monetization', description: '', color: '#EF4444', usageCount: 18 },
      { id: '6', name: 'Маркетинг', slug: 'marketing', description: '', color: '#8B5CF6', usageCount: 23 }
    ],
    seoMeta: undefined
  }
];

/**
 * Компонент фильтров по периодам
 */
const TrendingFilters = () => (
  <div className="flex flex-wrap gap-4 mb-8">
    <Badge variant="default" className="cursor-pointer">
      Сегодня
    </Badge>
    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-content">
      Неделя
    </Badge>
    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-content">
      Месяц
    </Badge>
    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-content">
      Год
    </Badge>
    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-content">
      Все время
    </Badge>
  </div>
);

/**
 * Компонент статистики трендов
 */
const TrendingStats = ({ articles }: { readonly articles: Article[] }) => {
  const totalViews = articles.reduce((sum, article) => sum + article.viewsCount, 0);
  const totalLikes = articles.reduce((sum, article) => sum + article.likesCount, 0);
  const avgReadingTime = Math.round(articles.reduce((sum, article) => sum + article.readingTime, 0) / articles.length);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 text-center">
        <div className="text-3xl font-bold">{totalViews.toLocaleString()}</div>
        <div className="text-sm opacity-90">Всего просмотров</div>
      </div>
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-6 text-center">
        <div className="text-3xl font-bold">{totalLikes.toLocaleString()}</div>
        <div className="text-sm opacity-90">Всего лайков</div>
      </div>
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 text-center">
        <div className="text-3xl font-bold">{avgReadingTime} мин</div>
        <div className="text-sm opacity-90">Среднее время чтения</div>
      </div>
    </div>
  );
};

/**
 * Компонент топ-статьи дня
 */
const TopArticleOfDay = ({ article }: { readonly article: Article }) => (
  <div className="bg-gradient-to-r from-primary to-secondary text-primary-content rounded-lg p-8 mb-8">
    <div className="flex items-center gap-2 mb-4">
      <span className="text-2xl">🏆</span>
      <span className="font-bold text-lg">Статья дня</span>
    </div>
    <Link href={`/article/${article.slug}`} className="block hover:opacity-90 transition-opacity">
      <h2 className="text-2xl font-bold mb-3">{article.title}</h2>
      <p className="text-primary-content/90 mb-4">{article.excerpt}</p>
      <div className="flex items-center gap-4 text-sm">
        <span>👁️ {article.viewsCount.toLocaleString()}</span>
        <span>❤️ {article.likesCount}</span>
        <span>⏱️ {article.readingTime} мин</span>
        <span>Автор: {article.author.displayName}</span>
      </div>
    </Link>
  </div>
);

/**
 * Основной компонент страницы популярных статей
 */
export default function TrendingPage() {
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Популярные', isActive: true }
  ];

  const topArticle = mockTrendingArticles[0];
  const otherArticles = mockTrendingArticles.slice(1);

  return (
    <PageLayout 
      showBreadcrumbs={true}
      breadcrumbs={breadcrumbs}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            🔥 Популярные статьи
          </h1>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Самые читаемые и обсуждаемые статьи нашего сообщества. 
            Откройте для себя лучший контент от талантливых авторов.
          </p>
        </div>

        {/* Фильтры по периодам */}
        <div className="flex justify-center mb-8">
          <TrendingFilters />
        </div>

        {/* Статистика */}
        <TrendingStats articles={mockTrendingArticles} />

        {/* Топ статья дня */}
        <TopArticleOfDay article={topArticle} />

        {/* Остальные популярные статьи */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-base-content mb-6">
            Также популярны
          </h2>
          <Suspense fallback={<LoadingSpinner />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherArticles.map((article, index) => (
                <div key={article.id} className="relative">
                  <div className="absolute -top-2 -left-2 bg-warning text-warning-content w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10">
                    {index + 2}
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
        </div>

        {/* Категории трендов */}
        <div className="bg-base-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-base-content mb-6 text-center">
            Популярные категории
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/category/tech" className="text-center p-4 bg-base-100 rounded-lg hover:bg-primary hover:text-primary-content transition-colors">
              <div className="text-3xl mb-2">💻</div>
              <div className="font-medium">Технологии</div>
              <div className="text-sm opacity-70">1,234 статьи</div>
            </Link>
            <Link href="/category/design" className="text-center p-4 bg-base-100 rounded-lg hover:bg-primary hover:text-primary-content transition-colors">
              <div className="text-3xl mb-2">🎨</div>
              <div className="font-medium">Дизайн</div>
              <div className="text-sm opacity-70">867 статей</div>
            </Link>
            <Link href="/category/business" className="text-center p-4 bg-base-100 rounded-lg hover:bg-primary hover:text-primary-content transition-colors">
              <div className="text-3xl mb-2">💼</div>
              <div className="font-medium">Бизнес</div>
              <div className="text-sm opacity-70">592 статьи</div>
            </Link>
            <Link href="/category/self-development" className="text-center p-4 bg-base-100 rounded-lg hover:bg-primary hover:text-primary-content transition-colors">
              <div className="text-3xl mb-2">🚀</div>
              <div className="font-medium">Саморазвитие</div>
              <div className="text-sm opacity-70">423 статьи</div>
            </Link>
          </div>
        </div>

        {/* Призыв к действию */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-base-content mb-4">
            Не пропустите новые тренды!
          </h2>
          <p className="text-base-content/70 mb-6">
            Подпишитесь на лучших авторов и будьте первыми в курсе популярного контента
          </p>
          <Link href="/authors" className="btn btn-primary btn-lg">
            Найти авторов
          </Link>
        </div>
      </div>
    </PageLayout>
  );
} 