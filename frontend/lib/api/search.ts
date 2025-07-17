/**
 * API модуль для поиска и Elasticsearch интеграции
 * Поддерживает полнотекстовый поиск, фильтрацию и автодополнение
 */

import { apiClient } from './client'
import type {
  SearchParams,
  SearchResponse,
  AutocompleteResult
} from '@/types'

/**
 * Выполняет поиск статей с фильтрацией
 * @param params - параметры поиска
 * @returns результаты поиска с метаданными
 */
export const searchArticles = async (
  params: SearchParams
): Promise<SearchResponse> => {
  const searchParams = new URLSearchParams()
  
  searchParams.append('q', params.query)
  
  if (params.categories?.length) {
    searchParams.append('categories', params.categories.join(','))
  }
  
  if (params.tags?.length) {
    searchParams.append('tags', params.tags.join(','))
  }
  
  if (params.authors?.length) {
    searchParams.append('authors', params.authors.join(','))
  }
  
  if (params.accessLevel) {
    searchParams.append('access_level', params.accessLevel)
  }
  
  if (params.dateRange) {
    searchParams.append('date_from', params.dateRange.from.toISOString())
    searchParams.append('date_to', params.dateRange.to.toISOString())
  }
  
  searchParams.append('page', String(params.page ?? 1))
  searchParams.append('limit', String(params.limit ?? 20))
  searchParams.append('sort_by', params.sortBy ?? 'relevance')
  searchParams.append('sort_order', params.sortOrder ?? 'desc')

  const response = await apiClient.get<SearchResponse>(
    `/search/articles?${searchParams.toString()}`
  )

  return response
}

/**
 * Получает предложения автодополнения
 * @param query - поисковый запрос (минимум 2 символа)
 * @param limit - количество предложений (по умолчанию 5)
 * @returns предложения автодополнения
 */
export const getAutocomplete = async (
  query: string,
  limit: number = 5
): Promise<AutocompleteResult[]> => {
  if (query.length < 2) {
    return []
  }

  const response = await apiClient.get<AutocompleteResult[]>(
    `/search/autocomplete?q=${encodeURIComponent(query)}&limit=${limit}`
  )

  return response
}

/**
 * Выполняет поиск только по заголовкам статей
 * @param query - поисковый запрос
 * @param limit - количество результатов
 * @returns упрощенные результаты поиска
 */
export const searchTitles = async (
  query: string,
  limit: number = 10
): Promise<Pick<SearchResponse, 'results' | 'totalCount'>> => {
  const response = await apiClient.get<SearchResponse>(
    `/search/titles?q=${encodeURIComponent(query)}&limit=${limit}`
  )

  return {
    results: response.results,
    totalCount: response.totalCount
  }
}

/**
 * Индексирует статью в Elasticsearch (для админов/авторов)
 * @param articleId - ID статьи для индексации
 * @returns статус индексации
 */
export const indexArticle = async (
  articleId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post<{ success: boolean; message: string }>(
    '/search/index',
    { articleId }
  )

  return response
}

/**
 * Удаляет статью из поискового индекса
 * @param articleId - ID статьи для удаления
 * @returns статус удаления
 */
export const removeFromIndex = async (
  articleId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete<{ success: boolean; message: string }>(
    `/search/index/${articleId}`
  )

  return response
} 