/**
 * API модуль для рекомендательной системы
 * Поддерживает персонализированные рекомендации и профили интересов
 */

import { apiClient } from './client'
import type {
  RecommendationParams,
  RecommendationResult,
  UserInterestProfile,
  SimilarArticles,
  AuthorRecommendation,
  PersonalizationSettings
} from '@/types'

/**
 * Получает персонализированные рекомендации статей
 * @param params - параметры рекомендаций
 * @returns рекомендованные статьи с метаданными
 */
export const getPersonalizedRecommendations = async (
  params: RecommendationParams
): Promise<RecommendationResult> => {
  const response = await apiClient.post<RecommendationResult>(
    '/recommendations/personalized',
    params
  )

  return response
}

/**
 * Получает похожие статьи на основе контента
 * @param articleId - ID статьи для поиска похожих
 * @param limit - количество похожих статей (по умолчанию 5)
 * @returns похожие статьи с оценками сходства
 */
export const getSimilarArticles = async (
  articleId: string,
  limit: number = 5
): Promise<SimilarArticles> => {
  const response = await apiClient.get<SimilarArticles>(
    `/recommendations/similar/${articleId}?limit=${limit}`
  )

  return response
}

/**
 * Получает рекомендации авторов для подписки
 * @param userId - ID пользователя (опционально для персонализации)
 * @param limit - количество рекомендаций (по умолчанию 10)
 * @returns рекомендованные авторы
 */
export const getAuthorRecommendations = async (
  userId?: string,
  limit: number = 10
): Promise<AuthorRecommendation[]> => {
  const params = new URLSearchParams({ limit: String(limit) })
  
  if (userId) {
    params.append('user_id', userId)
  }

  const response = await apiClient.get<AuthorRecommendation[]>(
    `/recommendations/authors?${params.toString()}`
  )

  return response
}

/**
 * Получает профиль интересов пользователя
 * @param userId - ID пользователя
 * @returns профиль интересов
 */
export const getUserInterestProfile = async (
  userId: string
): Promise<UserInterestProfile> => {
  const response = await apiClient.get<UserInterestProfile>(
    `/recommendations/profile/${userId}`
  )

  return response
}

/**
 * Обновляет профиль интересов пользователя
 * @param userId - ID пользователя
 * @param updates - обновления профиля
 * @returns обновленный профиль
 */
export const updateUserInterestProfile = async (
  userId: string,
  updates: Partial<Omit<UserInterestProfile, 'userId' | 'lastUpdated'>>
): Promise<UserInterestProfile> => {
  const response = await apiClient.put<UserInterestProfile>(
    `/recommendations/profile/${userId}`,
    updates
  )

  return response
}

/**
 * Получает настройки персонализации пользователя
 * @param userId - ID пользователя
 * @returns настройки персонализации
 */
export const getPersonalizationSettings = async (
  userId: string
): Promise<PersonalizationSettings> => {
  const response = await apiClient.get<PersonalizationSettings>(
    `/recommendations/settings/${userId}`
  )

  return response
}

/**
 * Обновляет настройки персонализации
 * @param userId - ID пользователя
 * @param settings - новые настройки
 * @returns обновленные настройки
 */
export const updatePersonalizationSettings = async (
  userId: string,
  settings: Partial<PersonalizationSettings>
): Promise<PersonalizationSettings> => {
  const response = await apiClient.put<PersonalizationSettings>(
    `/recommendations/settings/${userId}`,
    settings
  )

  return response
}

/**
 * Отправляет обратную связь по рекомендации
 * @param articleId - ID рекомендованной статьи
 * @param feedback - тип обратной связи
 * @param userId - ID пользователя (опционально)
 * @returns подтверждение отправки
 */
export const sendRecommendationFeedback = async (
  articleId: string,
  feedback: 'like' | 'dislike' | 'not_interested',
  userId?: string
): Promise<{ success: boolean }> => {
  const response = await apiClient.post<{ success: boolean }>(
    '/recommendations/feedback',
    { articleId, feedback, userId }
  )

  return response
} 