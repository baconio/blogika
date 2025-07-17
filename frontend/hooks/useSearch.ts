/**
 * React хук для поиска с Elasticsearch и debounce
 * @description Микромодуль для поиска контента с оптимизацией производительности
 */
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@/lib/api';
import { analyticsApi } from '@/lib/api';
import type { 
  SearchParams, 
  SearchResponse, 
  AutocompleteResult 
} from '@/types';

export type Maybe<T> = T | undefined;

/**
 * Параметры хука useSearch
 */
export interface UseSearchParams {
  /** Начальный поисковый запрос */
  readonly initialQuery?: string;
  /** Задержка debounce в миллисекундах */
  readonly debounceMs?: number;
  /** Включено ли автодополнение */
  readonly enableAutocomplete?: boolean;
  /** Автоматический поиск при изменении query */
  readonly autoSearch?: boolean;
}

/**
 * Результат хука useSearch
 */
export interface UseSearchResult {
  /** Текущий поисковый запрос */
  readonly query: string;
  /** Установить поисковый запрос */
  readonly setQuery: (query: string) => void;
  /** Параметры поиска */
  readonly searchParams: SearchParams;
  /** Обновить параметры поиска */
  readonly updateSearchParams: (params: Partial<SearchParams>) => void;
  /** Выполнить поиск вручную */
  readonly executeSearch: () => void;
  /** Результаты поиска */
  readonly searchResults: Maybe<SearchResponse>;
  /** Загружается ли поиск */
  readonly isSearching: boolean;
  /** Ошибка поиска */
  readonly searchError: Maybe<Error>;
  /** Предложения автодополнения */
  readonly autocompleteResults: readonly AutocompleteResult[];
  /** Загружается ли автодополнение */
  readonly isAutocompletingLoading: boolean;
  /** Очистить результаты поиска */
  readonly clearSearch: () => void;
}

/**
 * Хук для поиска с Elasticsearch интеграцией
 * @param params - параметры хука
 * @returns функции и состояние поиска
 */
export const useSearch = (params: UseSearchParams = {}): UseSearchResult => {
  const {
    initialQuery = '',
    debounceMs = 300,
    enableAutocomplete = true,
    autoSearch = true
  } = params;

  // Состояние поиска
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: initialQuery,
    page: 1,
    limit: 20,
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  // Debounce для поискового запроса
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Обновляем параметры поиска при изменении query
  useEffect(() => {
    if (debouncedQuery !== searchParams.query) {
      setSearchParams(prev => ({
        ...prev,
        query: debouncedQuery,
        page: 1 // Сбрасываем страницу при новом поиске
      }));
    }
  }, [debouncedQuery, searchParams.query]);

  // Основной поиск
  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
    refetch: executeSearch
  } = useQuery({
    queryKey: ['search', searchParams],
    queryFn: () => searchApi.searchArticles(searchParams),
    enabled: autoSearch && searchParams.query.length >= 2,
    staleTime: 30000, // 30 секунд
    retry: 2
  });

  // Автодополнение
  const {
    data: autocompleteResults = [],
    isLoading: isAutocompletingLoading
  } = useQuery({
    queryKey: ['autocomplete', debouncedQuery],
    queryFn: () => searchApi.getAutocomplete(debouncedQuery, 5),
    enabled: enableAutocomplete && debouncedQuery.length >= 2 && debouncedQuery.length <= 50,
    staleTime: 60000, // 1 минута
    retry: 1
  });

  // Отправка аналитики поиска
  useEffect(() => {
    if (searchResults && searchParams.query.length >= 2) {
      analyticsApi.trackEvent({
        name: 'search_performed',
        category: 'article',
        properties: {
          query: searchParams.query,
          resultsCount: searchResults.totalCount,
          searchTime: searchResults.searchTime,
          filters: {
            categories: searchParams.categories,
            tags: searchParams.tags,
            accessLevel: searchParams.accessLevel
          }
        },
        timestamp: new Date()
      }).catch(console.error);
    }
  }, [searchResults, searchParams]);

  // Функции управления
  const updateSearchParams = useCallback((params: Partial<SearchParams>) => {
    setSearchParams(prev => ({
      ...prev,
      ...params,
      query: prev.query // Сохраняем текущий query
    }));
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setSearchParams({
      query: '',
      page: 1,
      limit: 20,
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
  }, []);

  return useMemo(() => ({
    query,
    setQuery,
    searchParams,
    updateSearchParams,
    executeSearch,
    searchResults,
    isSearching,
    searchError,
    autocompleteResults,
    isAutocompletingLoading,
    clearSearch
  }), [
    query,
    searchParams,
    updateSearchParams,
    executeSearch,
    searchResults,
    isSearching,
    searchError,
    autocompleteResults,
    isAutocompletingLoading,
    clearSearch
  ]);
};

/**
 * Простой хук для быстрого поиска статей
 * @param query - поисковый запрос
 * @param filters - фильтры поиска
 * @returns результаты поиска статей
 * @example
 * const { data: articles, isLoading } = useArticleSearch('Next.js')
 */
export const useArticleSearch = (query: string, filters: SearchFilters = {}) => {
  return useQuery({
    queryKey: ['search', 'articles', query, filters],
    queryFn: () => articlesApi.search(query, filters),
    enabled: query.length >= 2,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Хук для получения популярных поисковых запросов
 * @param limit - количество запросов
 * @returns популярные запросы
 * @example
 * const { data: trending } = useTrendingSearches(10)
 */
export const useTrendingSearches = (limit: number = 10) => {
  return useQuery({
    queryKey: ['search', 'trending', limit],
    queryFn: () => articlesApi.getTrendingSearches(limit),
    staleTime: 30 * 60 * 1000, // 30 минут для трендов
  });
}; 