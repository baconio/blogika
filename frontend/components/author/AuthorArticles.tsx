'use client';

import { useState } from 'react';
import { ArticleCard } from '@/components/features/ArticleCard';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Article } from '@/types/Article';

/**
 * Типы фильтрации статей
 */
type ArticleFilter = 'all' | 'published' | 'premium' | 'draft';

/**
 * Пропсы компонента статей автора
 */
interface AuthorArticlesProps {
  readonly authorId: string;
  readonly articles: Article[];
  readonly totalArticles?: number;
  readonly isOwner?: boolean;
  readonly isLoading?: boolean;
  readonly onLoadMore?: () => Promise<void>;
  readonly onFilterChange?: (filter: ArticleFilter) => void;
}

/**
 * Компонент статей автора
 * Отображает список статей с фильтрацией и пагинацией
 * @param authorId - ID автора
 * @param articles - массив статей
 * @param totalArticles - общее количество статей
 * @param isOwner - является ли текущий пользователь владельцем
 * @param isLoading - состояние загрузки
 * @param onLoadMore - обработчик загрузки дополнительных статей
 * @param onFilterChange - обработчик изменения фильтра
 * @returns JSX элемент списка статей автора
 */
export const AuthorArticles = ({
  authorId,
  articles,
  totalArticles = 0,
  isOwner = false,
  isLoading = false,
  onLoadMore,
  onFilterChange
}: AuthorArticlesProps) => {
  const [activeFilter, setActiveFilter] = useState<ArticleFilter>('all');

  const handleFilterChange = (filter: ArticleFilter) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  // Фильтры статей
  const filters = [
    { key: 'all' as const, label: 'Все статьи', count: totalArticles },
    { key: 'published' as const, label: 'Опубликованные', count: articles.filter(a => a.status === 'published').length },
    { key: 'premium' as const, label: 'Премиум', count: articles.filter(a => a.accessLevel === 'premium').length },
    ...(isOwner ? [
      { key: 'draft' as const, label: 'Черновики', count: articles.filter(a => a.status === 'draft').length }
    ] : [])
  ];

  const hasMoreArticles = totalArticles > articles.length;

  return (
    <div className="space-y-6">
      {/* Заголовок и фильтры */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Статьи автора {totalArticles > 0 && `(${totalArticles})`}
        </h2>

        {/* Фильтры */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => handleFilterChange(filter.key)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter.key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              {filter.label}
              {filter.count > 0 && (
                <span className={`ml-1 ${
                  activeFilter === filter.key ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  ({filter.count})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Список статей */}
      <div className="space-y-6">
        {isLoading && articles.length === 0 ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeFilter === 'all' ? 'Пока нет статей' : 
               activeFilter === 'draft' ? 'Нет черновиков' :
               activeFilter === 'premium' ? 'Нет премиум статей' :
               'Нет опубликованных статей'}
            </h3>
            <p className="text-gray-500">
              {isOwner ? 'Начните писать свою первую статью!' : 'Возможно, автор скоро что-то опубликует.'}
            </p>
          </div>
        ) : (
          <>
            {/* Грид статей */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="default"
                  showAuthor={false} // Не показываем автора, так как мы на его странице
                  showActions={isOwner}
                />
              ))}
            </div>

            {/* Кнопка "Загрузить еще" */}
            {hasMoreArticles && (
              <div className="text-center pt-8">
                <Button
                  onClick={onLoadMore}
                  variant="outline"
                  disabled={isLoading}
                  className="min-w-[200px]"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      <span>Загрузка...</span>
                    </div>
                  ) : (
                    `Загрузить еще статьи (${totalArticles - articles.length})`
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Дополнительная информация для владельца */}
      {isOwner && articles.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            📊 Статистика публикаций
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-blue-700 font-medium">Всего статей</div>
              <div className="text-blue-900">{totalArticles}</div>
            </div>
            <div>
              <div className="text-blue-700 font-medium">Опубликовано</div>
              <div className="text-blue-900">
                {articles.filter(a => a.status === 'published').length}
              </div>
            </div>
            <div>
              <div className="text-blue-700 font-medium">Черновики</div>
              <div className="text-blue-900">
                {articles.filter(a => a.status === 'draft').length}
              </div>
            </div>
            <div>
              <div className="text-blue-700 font-medium">Премиум</div>
              <div className="text-blue-900">
                {articles.filter(a => a.accessLevel === 'premium').length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 