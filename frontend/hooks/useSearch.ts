/**
 * React хук для поиска с debounce
 * @description Микромодуль для поиска контента с оптимизацией производительности
 */
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { articlesApi, categoriesApi, tagsApi } from '@/lib/api';
import { trackEvent } from '@/lib/utils';

export type Maybe<T> = T | undefined;

export interface SearchFilters {
  readonly category?: string;
  readonly tags?: readonly string[];
  readonly dateFrom?: Date;
  readonly dateTo?: Date;
  readonly sortBy?: 'relevance' | 'date' | 'views' | 'likes';
  readonly contentType?: 'all' | 'articles' | 'authors' | 'tags';
}

export interface SearchResult {
  readonly articles: readonly any[];
  readonly authors: readonly any[];
  readonly tags: readonly any[];
  readonly categories: readonly any[];
  readonly totalResults: number;
  readonly searchTime: number;
}

export interface SearchSuggestion {
  readonly text: string;
  readonly type: 'article' | 'author' | 'tag' | 'category';
  readonly count?: number;
}

export interface UseSearchOptions {
  readonly debounceMs?: number;
  readonly minQueryLength?: number;
  readonly maxSuggestions?: number;
  readonly enableHistory?: boolean;
  readonly enableAutoComplete?: boolean;
}

/**
 * Хук для поиска с debounce и автодополнением
 * @param defaultFilters - фильтры по умолчанию
 * @param options - опции поиска
 * @returns объект с функциями поиска и состоянием
 * @example
 * const { query, setQuery, results, suggestions } = useSearch()
 */
export const useSearch = (
  defaultFilters: SearchFilters = {},
  options: UseSearchOptions = {}
) => {
  const {
    debounceMs = 300,
    minQueryLength = 2,
    maxSuggestions = 5,
    enableHistory = true,
    enableAutoComplete = true
  } = options;

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [isTyping, setIsTyping] = useState(false);

  // Debounce поискового запроса
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsTyping(false);
      
      // Трекинг поиска
      if (query.length >= minQueryLength) {
        trackEvent('search_performed', {
          query,
          filters,
          queryLength: query.length
        });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, minQueryLength, filters]);

  // Основной поиск
  const searchQuery = useQuery({
    queryKey: ['search', 'content', debouncedQuery, filters],
    queryFn: async (): Promise<SearchResult> => {
      const startTime = performance.now();
      
      const [articles, authors, tags, categories] = await Promise.all([
        articlesApi.search(debouncedQuery, filters),
        // authorsApi.search(debouncedQuery),
        // tagsApi.search(debouncedQuery),
        // categoriesApi.search(debouncedQuery)
        Promise.resolve([]), // Заглушки пока API не готовы
        Promise.resolve([]),
        Promise.resolve([])
      ]);

      const endTime = performance.now();
      const searchTime = Math.round(endTime - startTime);

      return {
        articles,
        authors,
        tags,
        categories,
        totalResults: articles.length + authors.length + tags.length + categories.length,
        searchTime
      };
    },
    enabled: debouncedQuery.length >= minQueryLength,
    staleTime: 2 * 60 * 1000, // 2 минуты
    gcTime: 5 * 60 * 1000, // 5 минут в кэше
  });

  // Автодополнение/подсказки
  const suggestionsQuery = useQuery({
    queryKey: ['search', 'suggestions', debouncedQuery],
    queryFn: async (): Promise<SearchSuggestion[]> => {
      if (!enableAutoComplete) return [];
      
      // Получаем подсказки из разных источников
      const suggestions: SearchSuggestion[] = [];
      
      // Подсказки статей
      const articleSuggestions = await articlesApi.getSuggestions(debouncedQuery, 3);
      suggestions.push(...articleSuggestions.map(article => ({
        text: article.title,
        type: 'article' as const,
        count: article.views_count
      })));

      // Можно добавить подсказки тегов, авторов и т.д.
      
      return suggestions.slice(0, maxSuggestions);
    },
    enabled: enableAutoComplete && debouncedQuery.length >= 1 && debouncedQuery.length < minQueryLength,
    staleTime: 5 * 60 * 1000, // 5 минут для подсказок
  });

  // История поиска
  const searchHistory = useMemo(() => {
    if (!enableHistory) return [];
    
    try {
      const stored = localStorage.getItem('search_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, [enableHistory]);

  // Сохранение в историю
  const saveToHistory = useCallback((searchQuery: string) => {
    if (!enableHistory || searchQuery.length < minQueryLength) return;

    try {
      const history = searchHistory.filter(item => item !== searchQuery);
      const newHistory = [searchQuery, ...history].slice(0, 10); // Максимум 10 записей
      localStorage.setItem('search_history', JSON.stringify(newHistory));
    } catch {
      // Игнорируем ошибки localStorage
    }
  }, [enableHistory, minQueryLength, searchHistory]);

  // Очистка истории
  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem('search_history');
    } catch {
      // Игнорируем ошибки localStorage
    }
  }, []);

  // Обработка отправки формы поиска
  const handleSubmit = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    setDebouncedQuery(searchQuery);
    saveToHistory(searchQuery);
    
    // Трекинг отправки поиска
    trackEvent('search_submitted', {
      query: searchQuery,
      filters,
      source: 'form_submit'
    });
  }, [filters, saveToHistory]);

  // Быстрый поиск по категории
  const searchByCategory = useCallback((categorySlug: string) => {
    setFilters(prev => ({ ...prev, category: categorySlug }));
    
    trackEvent('search_filter_applied', {
      filterType: 'category',
      filterValue: categorySlug
    });
  }, []);

  // Быстрый поиск по тегу
  const searchByTag = useCallback((tagSlug: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags ? [...prev.tags, tagSlug] : [tagSlug]
    }));
    
    trackEvent('search_filter_applied', {
      filterType: 'tag',
      filterValue: tagSlug
    });
  }, []);

  // Сброс фильтров
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    
    trackEvent('search_filters_reset');
  }, [defaultFilters]);

  // Сброс всего поиска
  const resetSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setFilters(defaultFilters);
    
    trackEvent('search_reset');
  }, [defaultFilters]);

  return {
    // Состояние поиска
    query,
    debouncedQuery,
    filters,
    isTyping,
    isSearching: searchQuery.isFetching,
    
    // Результаты
    results: searchQuery.data,
    suggestions: suggestionsQuery.data || [],
    searchHistory,
    
    // Статус загрузки и ошибки
    isLoading: searchQuery.isLoading,
    isError: searchQuery.isError,
    error: searchQuery.error,
    
    // Функции управления
    setQuery,
    setFilters,
    handleSubmit,
    searchByCategory,
    searchByTag,
    resetFilters,
    resetSearch,
    clearHistory,
    
    // Вспомогательные данные
    hasResults: (searchQuery.data?.totalResults || 0) > 0,
    isEmpty: debouncedQuery.length >= minQueryLength && (searchQuery.data?.totalResults || 0) === 0,
    canSearch: query.length >= minQueryLength
  };
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