/**
 * Страница всех статей блога
 * Показывает полный каталог статей с фильтрацией и пагинацией
 */

import type { Metadata } from 'next';
import { BlogLayout } from '@/components/layout/BlogLayout';
import { ArticleList } from '@/components/reader/ArticleList';
import { CategoryFilter } from '@/components/reader/CategoryFilter';

/**
 * Метаданные страницы всех статей
 */
export const metadata: Metadata = {
  title: 'Все статьи - Новое поколение',
  description: 'Полный каталог статей от наших авторов. Находите интересные материалы по технологиям, дизайну, бизнесу и другим темам.',
  openGraph: {
    title: 'Все статьи - Новое поколение',
    description: 'Полный каталог статей от наших авторов',
    type: 'website',
  },
};

/**
 * Страница всех статей с фильтрами
 */
export default function ArticlesPage() {
  return (
    <BlogLayout
      variant="list"
      showBreadcrumbs={true}
      breadcrumbs={[
        { label: 'Главная', href: '/' },
        { label: 'Статьи', href: '/articles' }
      ]}
      sidebarContent={{
        showCategories: true,
        showTags: true,
        showPopularArticles: true
      }}
    >
      <div className="space-y-6">
        {/* Заголовок страницы */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-base-content">
            Все статьи
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Исследуйте полную коллекцию статей от наших талантливых авторов. 
            Найдите именно то, что вас интересует.
          </p>
        </div>

        {/* Фильтр по категориям */}
        <CategoryFilter />

        {/* Список статей */}
        <ArticleList 
          variant="grid"
          showPagination={true}
          emptyStateMessage="Статьи скоро появятся! Следите за обновлениями."
        />
      </div>
    </BlogLayout>
  );
} 