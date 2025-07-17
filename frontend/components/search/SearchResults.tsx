/**
 * Компонент отображения результатов поиска
 * @description Микромодуль для рендеринга результатов поиска с фильтрацией
 */
'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { SearchResponse, SearchResult } from '@/types';

/**
 * Пропсы компонента SearchResults
 */
export interface SearchResultsProps {
  /** Результаты поиска */
  readonly searchResponse?: SearchResponse;
  /** Загружается ли поиск */
  readonly isLoading?: boolean;
  /** Ошибка поиска */
  readonly error?: Error;
  /** Поисковый запрос */
  readonly query: string;
  /** Обработчик клика по результату */
  readonly onResultClick?: (result: SearchResult) => void;
  /** Показать фасеты фильтрации */
  readonly showFacets?: boolean;
  /** Компактный режим отображения */
  readonly compact?: boolean;
}

/**
 * Компонент отдельного результата поиска
 */
const SearchResultItem: React.FC<{
  readonly result: SearchResult;
  readonly query: string;
  readonly onClick?: (result: SearchResult) => void;
  readonly compact?: boolean;
}> = ({ result, query, onClick, compact = false }) => {
  const { article, relevanceScore, highlights, matchType } = result;

  const handleClick = () => {
    onClick?.(result);
  };

  return (
    <article 
      className={`
        border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0
        ${compact ? 'py-2' : 'py-4'}
        hover:bg-gray-50 transition-colors duration-200 cursor-pointer
      `}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-2">
        <Link 
          href={`/article/${article.slug}`}
          className="text-lg font-semibold text-blue-600 hover:text-blue-800 line-clamp-2"
        >
          {article.title}
        </Link>
        
        <div className="flex items-center space-x-2 ml-4">
          <Badge 
            variant={matchType === 'title' ? 'primary' : 'secondary'}
            size="sm"
          >
            {matchType === 'title' ? 'Заголовок' : 
             matchType === 'content' ? 'Контент' :
             matchType === 'tag' ? 'Тег' : 'Автор'}
          </Badge>
          
          <span className="text-xs text-gray-500">
            {Math.round(relevanceScore * 100)}%
          </span>
        </div>
      </div>

      {/* Highlights */}
      {highlights.length > 0 && (
        <div className="mb-2">
          {highlights.slice(0, compact ? 1 : 3).map((highlight, index) => (
            <p 
              key={index}
              className="text-sm text-gray-600 mb-1"
              dangerouslySetInnerHTML={{ 
                __html: highlight.fragment.replace(
                  new RegExp(`(${query})`, 'gi'),
                  '<mark class="bg-yellow-200 px-1">$1</mark>'
                )
              }}
            />
          ))}
        </div>
      )}

      {/* Метаданные статьи */}
      <div className="flex items-center text-xs text-gray-500 space-x-4">
        <span>Автор: {article.author?.display_name}</span>
        <span>Категория: {article.category?.name}</span>
        <span>{article.reading_time} мин чтения</span>
        <span>{article.views_count} просмотров</span>
      </div>

      {/* Теги */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {article.tags.slice(0, compact ? 3 : 5).map((tag) => (
            <Badge 
              key={tag.id} 
              variant="outline" 
              size="xs"
            >
              {tag.name}
            </Badge>
          ))}
          {article.tags.length > (compact ? 3 : 5) && (
            <span className="text-xs text-gray-500">
              +{article.tags.length - (compact ? 3 : 5)} ещё
            </span>
          )}
        </div>
      )}
    </article>
  );
};

/**
 * Компонент SearchResults
 */
export const SearchResults: React.FC<SearchResultsProps> = ({
  searchResponse,
  isLoading = false,
  error,
  query,
  onResultClick,
  showFacets = false,
  compact = false
}) => {
  // Состояние загрузки
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-gray-600">Поиск...</span>
      </div>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">
          <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Ошибка поиска
        </h3>
        <p className="text-gray-600 mb-4">
          {error.message || 'Произошла ошибка при выполнении поиска'}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  // Нет результатов поиска
  if (!searchResponse || searchResponse.results.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Ничего не найдено
        </h3>
        <p className="text-gray-600">
          По запросу <strong>"{query}"</strong> ничего не найдено.
          <br />
          Попробуйте изменить запрос или использовать другие ключевые слова.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Заголовок результатов */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Результаты поиска
          </h2>
          <p className="text-sm text-gray-600">
            Найдено {searchResponse.totalCount} результатов за {searchResponse.searchTime}мс
          </p>
        </div>

        {searchResponse.suggestions && searchResponse.suggestions.length > 0 && (
          <div className="text-sm">
            <span className="text-gray-600">Возможно, вы имели в виду: </span>
            {searchResponse.suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="text-blue-600 hover:text-blue-800 underline ml-1"
                onClick={() => {
                  // Здесь можно обновить поисковый запрос
                  console.log('Suggestion clicked:', suggestion);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Список результатов */}
      <div className="space-y-4">
        {searchResponse.results.map((result, index) => (
          <SearchResultItem
            key={`${result.article.id}-${index}`}
            result={result}
            query={query}
            onClick={onResultClick}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}; 