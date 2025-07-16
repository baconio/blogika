/**
 * BlogLayout компонент - специализированный layout для блоговых страниц
 * Server Component с сайдбаром и блоговой навигацией
 */

import Link from 'next/link';
import { cn } from '@/components/ui';
import { PageLayout } from '../PageLayout';
import type { BlogLayoutProps, SidebarContent } from './BlogLayout.types';
import type { Article, Category, Tag } from '@/types';
import { DEFAULT_SIDEBAR_CONFIG } from './BlogLayout.types';

/**
 * Секция категорий в сайдбаре
 */
const CategoriesSection = ({ categories = [] }: { readonly categories?: readonly Category[] }) => {
  if (!categories.length) return null;

  return (
    <div className="bg-base-200 rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-base-content">Категории</h3>
      <ul className="space-y-2">
        {categories.slice(0, 8).map((category) => (
          <li key={category.id}>
            <Link
              href={`/category/${category.slug}`}
              className="flex items-center justify-between text-sm text-base-content/70 hover:text-base-content transition-colors"
            >
              <span>{category.name}</span>
              <span className="badge badge-sm badge-ghost">
                {Math.floor(Math.random() * 50) + 1}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {categories.length > 8 && (
        <Link href="/categories" className="text-sm text-primary hover:underline">
          Все категории →
        </Link>
      )}
    </div>
  );
};

/**
 * Секция тегов в сайдбаре
 */
const TagsSection = ({ tags = [] }: { readonly tags?: readonly Tag[] }) => {
  if (!tags.length) return null;

  return (
    <div className="bg-base-200 rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-base-content">Популярные теги</h3>
      <div className="flex flex-wrap gap-2">
        {tags.slice(0, 12).map((tag) => (
          <Link
            key={tag.id}
            href={`/tag/${tag.slug}`}
            className="badge badge-outline badge-sm hover:badge-primary transition-all"
          >
            {tag.name}
          </Link>
        ))}
      </div>
      {tags.length > 12 && (
        <Link href="/tags" className="text-sm text-primary hover:underline">
          Все теги →
        </Link>
      )}
    </div>
  );
};

/**
 * Секция статей в сайдбаре
 */
const ArticlesSection = ({ 
  title, 
  articles = [], 
  viewAllHref 
}: { 
  readonly title: string;
  readonly articles?: readonly Article[];
  readonly viewAllHref?: string;
}) => {
  if (!articles.length) return null;

  return (
    <div className="bg-base-200 rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-base-content">{title}</h3>
      <ul className="space-y-3">
        {articles.slice(0, 5).map((article) => (
          <li key={article.id}>
            <Link
              href={`/article/${article.slug}`}
              className="block text-sm text-base-content/70 hover:text-base-content transition-colors line-clamp-2"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
      {viewAllHref && (
        <Link href={viewAllHref} className="text-sm text-primary hover:underline">
          Смотреть все →
        </Link>
      )}
    </div>
  );
};

/**
 * Сайдбар блога
 */
const BlogSidebar = ({ content }: { readonly content: SidebarContent }) => {
  return (
    <aside className="w-full lg:w-80 space-y-6">
      {content.showCategories && (
        <CategoriesSection categories={content.categories} />
      )}
      
      {content.showTags && (
        <TagsSection tags={content.tags} />
      )}
      
      {content.showPopularArticles && (
        <ArticlesSection
          title="Популярные статьи"
          articles={content.popularArticles}
          viewAllHref="/trending"
        />
      )}
      
      {content.showRecentArticles && (
        <ArticlesSection
          title="Недавние статьи"
          articles={content.recentArticles}
          viewAllHref="/recent"
        />
      )}
    </aside>
  );
};

/**
 * BlogLayout - специализированный layout для блоговых страниц
 * @param children - основной контент страницы
 * @param sidebar - позиция сайдбара
 * @param sidebarContent - контент для сайдбара
 * @param variant - тип блоговой страницы
 * @param остальные пропсы наследуются от PageLayout
 */
export const BlogLayout = ({
  children,
  sidebar = 'right',
  sidebarContent,
  variant = 'list',
  ...pageLayoutProps
}: BlogLayoutProps) => {
  // Объединяем дефолтную конфигурацию с переданной
  const finalSidebarContent: SidebarContent = {
    ...DEFAULT_SIDEBAR_CONFIG[variant],
    ...sidebarContent,
  };

  if (sidebar === 'none') {
    return (
      <PageLayout {...pageLayoutProps}>
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout {...pageLayoutProps}>
      <div className="container mx-auto px-4 py-6">
        <div className={cn(
          'flex flex-col lg:flex-row gap-8',
          {
            'lg:flex-row-reverse': sidebar === 'left',
          }
        )}>
          {/* Основной контент */}
          <div className="flex-1 min-w-0">
            {children}
          </div>

          {/* Сайдбар */}
          <BlogSidebar content={finalSidebarContent} />
        </div>
      </div>
    </PageLayout>
  );
}; 