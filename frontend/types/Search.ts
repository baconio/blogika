/**
 * Типы для системы поиска и Elasticsearch интеграции
 * Поддерживает полнотекстовый поиск, фильтрацию и автодополнение
 */

import type { Article } from './Article'
import type { Category } from './Category'
import type { Tag } from './Tag'
import type { Author } from './Author'

/**
 * Параметры поиска с фильтрацией
 */
export interface SearchParams {
  /** Поисковый запрос */
  readonly query: string
  /** Фильтр по категориям */
  readonly categories?: readonly string[]
  /** Фильтр по тегам */
  readonly tags?: readonly string[]
  /** Фильтр по авторам */
  readonly authors?: readonly string[]
  /** Уровень доступа контента */
  readonly accessLevel?: 'free' | 'premium' | 'subscription'
  /** Диапазон дат публикации */
  readonly dateRange?: {
    readonly from: Date
    readonly to: Date
  }
  /** Пагинация */
  readonly page?: number
  readonly limit?: number
  /** Сортировка результатов */
  readonly sortBy?: 'relevance' | 'date' | 'views' | 'likes'
  readonly sortOrder?: 'asc' | 'desc'
}

/**
 * Результат поиска с метаданными
 */
export interface SearchResult {
  /** Найденная статья */
  readonly article: Article
  /** Релевантность (0-1) */
  readonly relevanceScore: number
  /** Подсвеченные фрагменты текста */
  readonly highlights: readonly SearchHighlight[]
  /** Тип совпадения */
  readonly matchType: 'title' | 'content' | 'tag' | 'author'
}

/**
 * Подсвеченный фрагмент в результатах поиска
 */
export interface SearchHighlight {
  /** Поле, в котором найдено совпадение */
  readonly field: 'title' | 'content' | 'excerpt'
  /** Фрагмент текста с подсветкой */
  readonly fragment: string
  /** Позиция совпадения в тексте */
  readonly position: number
}

/**
 * Ответ API поиска с метаданными
 */
export interface SearchResponse {
  /** Результаты поиска */
  readonly results: readonly SearchResult[]
  /** Общее количество найденных статей */
  readonly totalCount: number
  /** Время выполнения запроса (мс) */
  readonly searchTime: number
  /** Фасеты для фильтрации */
  readonly facets: SearchFacets
  /** Предложения по исправлению запроса */
  readonly suggestions?: readonly string[]
}

/**
 * Фасеты для построения фильтров
 */
export interface SearchFacets {
  /** Категории с количеством результатов */
  readonly categories: readonly FacetItem[]
  /** Теги с количеством результатов */
  readonly tags: readonly FacetItem[]
  /** Авторы с количеством результатов */
  readonly authors: readonly FacetItem[]
}

/**
 * Элемент фасета с количеством
 */
export interface FacetItem {
  /** Уникальный идентификатор */
  readonly id: string
  /** Отображаемое название */
  readonly name: string
  /** Количество результатов */
  readonly count: number
}

/**
 * Предложения автодополнения
 */
export interface AutocompleteResult {
  /** Предложенный текст */
  readonly suggestion: string
  /** Тип предложения */
  readonly type: 'article' | 'category' | 'tag' | 'author'
  /** Количество результатов для предложения */
  readonly resultsCount: number
  /** Дополнительные данные */
  readonly metadata?: {
    readonly category?: Category
    readonly tag?: Tag
    readonly author?: Author
  }
} 