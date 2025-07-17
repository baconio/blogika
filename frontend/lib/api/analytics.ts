/**
 * API модуль для аналитики и метрик
 * Поддерживает собственную аналитику, Mixpanel и Yandex Metrica
 */

import { apiClient } from './client'
import type {
  ArticleMetrics,
  ReadingAnalytics,
  AuthorAnalytics,
  AuthorDashboardData,
  TimePeriod,
  AnalyticsEvent,
  InteractionEvent
} from '@/types'

/**
 * Получает метрики статьи по ID
 * @param articleId - ID статьи
 * @returns метрики статьи
 */
export const getArticleMetrics = async (
  articleId: string
): Promise<ArticleMetrics> => {
  const response = await apiClient.get<ArticleMetrics>(
    `/analytics/articles/${articleId}/metrics`
  )

  return response
}

/**
 * Отправляет событие чтения статьи
 * @param articleId - ID статьи
 * @param analytics - данные аналитики чтения
 * @returns подтверждение отправки
 */
export const trackReading = async (
  articleId: string,
  analytics: Omit<ReadingAnalytics, 'interactions'>
): Promise<{ success: boolean }> => {
  const response = await apiClient.post<{ success: boolean }>(
    `/analytics/articles/${articleId}/reading`,
    analytics
  )

  return response
}

/**
 * Отправляет событие взаимодействия с контентом
 * @param articleId - ID статьи
 * @param event - событие взаимодействия
 * @returns подтверждение отправки
 */
export const trackInteraction = async (
  articleId: string,
  event: InteractionEvent
): Promise<{ success: boolean }> => {
  const response = await apiClient.post<{ success: boolean }>(
    `/analytics/articles/${articleId}/interactions`,
    event
  )

  return response
}

/**
 * Получает аналитику автора за период
 * @param authorId - ID автора
 * @param period - период анализа
 * @returns данные дашборда автора
 */
export const getAuthorAnalytics = async (
  authorId: string,
  period: TimePeriod
): Promise<AuthorDashboardData> => {
  const params = new URLSearchParams({
    from: period.from.toISOString(),
    to: period.to.toISOString(),
    type: period.type
  })

  const response = await apiClient.get<AuthorDashboardData>(
    `/analytics/authors/${authorId}/dashboard?${params.toString()}`
  )

  return response
}

/**
 * Получает базовую статистику автора
 * @param authorId - ID автора
 * @returns основные метрики автора
 */
export const getAuthorStats = async (
  authorId: string
): Promise<AuthorAnalytics> => {
  const response = await apiClient.get<AuthorAnalytics>(
    `/analytics/authors/${authorId}/stats`
  )

  return response
}

/**
 * Отправляет событие в систему аналитики
 * @param event - событие для отправки
 * @returns подтверждение отправки
 */
export const trackEvent = async (
  event: AnalyticsEvent
): Promise<{ success: boolean }> => {
  const response = await apiClient.post<{ success: boolean }>(
    '/analytics/events',
    event
  )

  return response
}

/**
 * Получает топ статей по просмотрам
 * @param limit - количество статей (по умолчанию 10)
 * @param period - период анализа (опционально)
 * @returns топ статей с метриками
 */
export const getTopArticles = async (
  limit: number = 10,
  period?: TimePeriod
): Promise<ArticleMetrics[]> => {
  const params = new URLSearchParams({ limit: String(limit) })
  
  if (period) {
    params.append('from', period.from.toISOString())
    params.append('to', period.to.toISOString())
  }

  const response = await apiClient.get<ArticleMetrics[]>(
    `/analytics/articles/top?${params.toString()}`
  )

  return response
} 