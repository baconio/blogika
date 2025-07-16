/**
 * Главная страница блоговой платформы "Новое поколение"
 * Server Component с лентой статей и рекомендациями
 */

import type { Metadata } from 'next';
import { BlogLayout } from '@/components/layout/BlogLayout';

/**
 * Метаданные главной страницы
 */
export const metadata: Metadata = {
  title: 'Главная',
  description: 'Читайте интересные статьи от лучших авторов. Новое поколение - платформа для создателей качественного контента.',
  openGraph: {
    title: 'Новое поколение - Платформа для авторов и читателей',
    description: 'Читайте интересные статьи от лучших авторов',
    type: 'website',
  },
};

/**
 * Секция Hero с приветствием
 */
const HeroSection = () => (
  <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-lg p-8 mb-8">
    <div className="max-w-3xl">
      <h1 className="text-4xl font-bold text-base-content mb-4">
        Добро пожаловать в{' '}
        <span className="text-primary">Новое поколение</span>
      </h1>
      <p className="text-lg text-base-content/70 mb-6">
        Платформа для авторов и читателей качественного контента. 
        Создавайте статьи, монетизируйте знания и находите единомышленников.
      </p>
      <div className="flex flex-wrap gap-4">
        <button className="btn btn-primary">
          Начать читать
        </button>
        <button className="btn btn-outline">
          Стать автором
        </button>
      </div>
    </div>
  </section>
);

/**
 * Секция с рекомендуемыми статьями
 */
const FeaturedArticlesSection = () => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold text-base-content mb-6">
      Рекомендуемые статьи
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Заглушки для статей - будут заменены на реальные компоненты */}
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <div className="h-4 bg-base-300 rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-base-300 rounded animate-pulse mb-4 w-3/4"></div>
            <div className="space-y-2">
              <div className="h-2 bg-base-300 rounded animate-pulse"></div>
              <div className="h-2 bg-base-300 rounded animate-pulse w-5/6"></div>
            </div>
            <div className="card-actions justify-between items-center mt-4">
              <div className="h-3 bg-base-300 rounded animate-pulse w-24"></div>
              <div className="h-3 bg-base-300 rounded animate-pulse w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

/**
 * Секция с последними статьями
 */
const RecentArticlesSection = () => (
  <section className="mb-8">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-base-content">
        Последние статьи
      </h2>
      <button className="btn btn-ghost btn-sm">
        Все статьи →
      </button>
    </div>
    <div className="space-y-4">
      {/* Заглушки для списка статей */}
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="h-5 bg-base-300 rounded animate-pulse mb-2 w-3/4"></div>
                <div className="h-3 bg-base-300 rounded animate-pulse mb-3 w-full"></div>
                <div className="h-3 bg-base-300 rounded animate-pulse w-2/3"></div>
              </div>
              <div className="ml-4 w-20 h-16 bg-base-300 rounded animate-pulse"></div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-base-300">
              <div className="h-3 bg-base-300 rounded animate-pulse w-24"></div>
              <div className="flex space-x-4">
                <div className="h-3 bg-base-300 rounded animate-pulse w-12"></div>
                <div className="h-3 bg-base-300 rounded animate-pulse w-16"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

/**
 * Главная страница блога
 */
export default function HomePage() {
  return (
    <BlogLayout
      variant="list"
      showBreadcrumbs={false}
      sidebarContent={{
        showCategories: true,
        showTags: true,
        showPopularArticles: true,
        showRecentArticles: false,
      }}
    >
      <HeroSection />
      <FeaturedArticlesSection />
      <RecentArticlesSection />
    </BlogLayout>
  );
} 