/**
 * Страница всех категорий блога
 * Показывает каталог категорий с количеством статей в каждой
 */

import type { Metadata } from 'next';
import { BlogLayout } from '@/components/layout/BlogLayout';
import { TagCloud } from '@/components/reader/TagCloud';

/**
 * Метаданные страницы категорий
 */
export const metadata: Metadata = {
  title: 'Категории - Новое поколение',
  description: 'Исследуйте статьи по категориям: технологии, дизайн, бизнес и многое другое. Найдите контент, который вас интересует.',
  openGraph: {
    title: 'Категории - Новое поколение',
    description: 'Исследуйте статьи по категориям',
    type: 'website',
  },
};

/**
 * Компонент карточки категории
 */
const CategoryCard = ({ 
  name, 
  description, 
  slug, 
  articlesCount = 0 
}: {
  readonly name: string;
  readonly description?: string;
  readonly slug: string;
  readonly articlesCount?: number;
}) => (
  <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
    <div className="card-body">
      <h3 className="card-title text-primary">{name}</h3>
      {description && (
        <p className="text-base-content/70 text-sm">
          {description}
        </p>
      )}
      <div className="card-actions justify-between items-center mt-4">
        <span className="text-xs text-base-content/50">
          {articlesCount} статей
        </span>
        <a 
          href={`/category/${slug}`}
          className="btn btn-primary btn-sm"
        >
          Читать
        </a>
      </div>
    </div>
  </div>
);

/**
 * Заглушка категорий (будут заменены на данные из Strapi)
 */
const mockCategories = [
  {
    name: 'Технологии',
    slug: 'tehnologii',
    description: 'Новости IT, программирование, разработка',
    articlesCount: 0
  },
  {
    name: 'Дизайн',
    slug: 'dizayn', 
    description: 'UI/UX дизайн, веб-дизайн, творчество',
    articlesCount: 0
  },
  {
    name: 'Бизнес',
    slug: 'biznes',
    description: 'Предпринимательство, маркетинг, стартапы',
    articlesCount: 0
  }
];

/**
 * Страница всех категорий
 */
export default function CategoriesPage() {
  return (
    <BlogLayout
      variant="list"
      showBreadcrumbs={true}
      breadcrumbs={[
        { label: 'Главная', href: '/' },
        { label: 'Категории', href: '/categories' }
      ]}
      sidebarContent={{
        showTags: true,
        showPopularArticles: true
      }}
    >
      <div className="space-y-8">
        {/* Заголовок страницы */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-base-content">
            Категории
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Выберите интересующую вас тему и погрузитесь в мир качественного контента
            от наших авторов.
          </p>
        </div>

        {/* Сетка категорий */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCategories.map((category) => (
            <CategoryCard
              key={category.slug}
              name={category.name}
              description={category.description}
              slug={category.slug}
              articlesCount={category.articlesCount}
            />
          ))}
        </div>

        {/* Облако тегов */}
        <div className="bg-base-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-base-content mb-4">
            Популярные теги
          </h2>
          <TagCloud limit={20} />
        </div>
      </div>
    </BlogLayout>
  );
} 