/**
 * Типы для SearchBar компонента
 */

import type { Article, Category, Tag } from '@/types';

/**
 * Результат поиска
 */
export interface SearchResult {
  readonly type: 'article' | 'category' | 'tag' | 'author';
  readonly id: string;
  readonly title: string;
  readonly href: string;
  readonly meta?: string;
}

/**
 * Группированные результаты поиска
 */
export interface SearchResultsGroup {
  readonly articles: readonly SearchResult[];
  readonly categories: readonly SearchResult[];
  readonly tags: readonly SearchResult[];
  readonly authors: readonly SearchResult[];
}

/**
 * Пропсы SearchBar компонента
 */
export interface SearchBarProps {
  readonly placeholder?: string;
  readonly className?: string;
  readonly variant?: 'default' | 'minimal' | 'full';
  readonly showCategories?: boolean;
  readonly maxResults?: number;
  readonly onSearchSubmit?: (query: string) => void;
  readonly onResultSelect?: (result: SearchResult) => void;
}

/**
 * Состояние поиска
 */
export interface SearchState {
  readonly query: string;
  readonly isLoading: boolean;
  readonly isOpen: boolean;
  readonly results: SearchResultsGroup;
  readonly selectedIndex: number;
}

/**
 * Конфигурация поиска
 */
export interface SearchConfig {
  readonly debounceMs: number;
  readonly minQueryLength: number;
  readonly maxResults: number;
  readonly showEmptyState: boolean;
}

/**
 * Дефолтная конфигурация поиска
 */
export const DEFAULT_SEARCH_CONFIG: SearchConfig = {
  debounceMs: 300,
  minQueryLength: 2,
  maxResults: 8,
  showEmptyState: true,
} as const; 