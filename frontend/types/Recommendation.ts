/**
 * Типы для рекомендательной системы и персонализации
 * Поддерживает коллаборативную фильтрацию и content-based алгоритмы
 */

import type { Article } from './Article'
import type { Author } from './Author'
import type { Category } from './Category'
import type { Tag } from './Tag'

/**
 * Рекомендованная статья с метаданными
 */
export interface RecommendedArticle {
  /** Рекомендуемая статья */
  readonly article: Article
  /** Оценка релевантности (0-1) */
  readonly score: number
  /** Причина рекомендации */
  readonly reason: RecommendationReason
  /** Алгоритм, который создал рекомендацию */
  readonly algorithm: RecommendationAlgorithm
  /** Дополнительные объяснения */
  readonly explanation?: string
}

/**
 * Причина рекомендации для пользователя
 */
export interface RecommendationReason {
  /** Тип причины */
  readonly type: 'similar_content' | 'author_follow' | 'category_interest' | 'trending' | 'collaborative'
  /** Связанные элементы */
  readonly relatedItems?: {
    readonly articles?: readonly string[]
    readonly authors?: readonly string[]
    readonly categories?: readonly string[]
    readonly tags?: readonly string[]
  }
  /** Текстовое объяснение */
  readonly description: string
}

/**
 * Алгоритм рекомендаций
 */
export type RecommendationAlgorithm = 
  | 'content_based'      // На основе содержания
  | 'collaborative'      // Коллаборативная фильтрация
  | 'hybrid'             // Гибридный подход
  | 'trending'           // Популярные статьи
  | 'author_based'       // На основе авторов
  | 'category_based'     // На основе категорий

/**
 * Параметры для генерации рекомендаций
 */
export interface RecommendationParams {
  /** ID пользователя (для персонализированных рекомендаций) */
  readonly userId?: string
  /** Количество рекомендаций */
  readonly limit: number
  /** Исключить уже прочитанные статьи */
  readonly excludeRead?: boolean
  /** Фильтры */
  readonly filters?: {
    readonly categories?: readonly string[]
    readonly authors?: readonly string[]
    readonly accessLevel?: 'free' | 'premium' | 'subscription'
    readonly minReadingTime?: number
    readonly maxReadingTime?: number
  }
  /** Предпочитаемые алгоритмы */
  readonly algorithms?: readonly RecommendationAlgorithm[]
  /** Разнообразие рекомендаций (0-1) */
  readonly diversityWeight?: number
}

/**
 * Результат рекомендаций с аналитикой
 */
export interface RecommendationResult {
  /** Рекомендованные статьи */
  readonly recommendations: readonly RecommendedArticle[]
  /** Общая оценка качества рекомендаций */
  readonly qualityScore: number
  /** Метрики разнообразия */
  readonly diversity: {
    readonly categorySpread: number
    readonly authorSpread: number
    readonly topicSpread: number
  }
  /** Время генерации рекомендаций */
  readonly generationTime: number
  /** Версия алгоритма */
  readonly algorithmVersion: string
}

/**
 * Профиль интересов пользователя
 */
export interface UserInterestProfile {
  /** ID пользователя */
  readonly userId: string
  /** Предпочитаемые категории с весами */
  readonly categoryWeights: Record<string, number>
  /** Предпочитаемые теги с весами */
  readonly tagWeights: Record<string, number>
  /** Предпочитаемые авторы с весами */
  readonly authorWeights: Record<string, number>
  /** Предпочтения по времени чтения */
  readonly readingTimePreference: {
    readonly min: number
    readonly max: number
    readonly optimal: number
  }
  /** Уровень вовлеченности */
  readonly engagementLevel: 'low' | 'medium' | 'high'
  /** Последнее обновление профиля */
  readonly lastUpdated: Date
}

/**
 * Похожие статьи на основе контента
 */
export interface SimilarArticles {
  /** Статья, для которой ищем похожие */
  readonly sourceArticle: Article
  /** Похожие статьи с оценками */
  readonly similarArticles: readonly {
    readonly article: Article
    readonly similarity: number
    readonly commonTags: readonly string[]
    readonly commonCategories: readonly string[]
  }[]
  /** Алгоритм сходства */
  readonly similarityAlgorithm: 'cosine' | 'jaccard' | 'tfidf'
}

/**
 * Рекомендации авторов для подписки
 */
export interface AuthorRecommendation {
  /** Рекомендуемый автор */
  readonly author: Author
  /** Оценка релевантности */
  readonly score: number
  /** Причина рекомендации */
  readonly reason: string
  /** Общие интересы с пользователем */
  readonly commonInterests: readonly string[]
  /** Статистика автора */
  readonly stats: {
    readonly articleCount: number
    readonly avgQuality: number
    readonly updateFrequency: 'daily' | 'weekly' | 'monthly'
  }
}

/**
 * A/B тест рекомендаций
 */
export interface RecommendationExperiment {
  /** Название эксперимента */
  readonly experimentName: string
  /** Версия алгоритма */
  readonly algorithmVariant: string
  /** Группа пользователя */
  readonly userGroup: 'control' | 'treatment'
  /** Метрики эксперимента */
  readonly metrics: {
    readonly clickThroughRate: number
    readonly conversionRate: number
    readonly engagementTime: number
  }
}

/**
 * Настройки персонализации пользователя
 */
export interface PersonalizationSettings {
  /** Включена ли персонализация */
  readonly enabled: boolean
  /** Уровень персонализации */
  readonly level: 'basic' | 'medium' | 'advanced'
  /** Предпочтения по типам контента */
  readonly contentPreferences: {
    readonly showTrending: boolean
    readonly showSimilar: boolean
    readonly showFromFollowedAuthors: boolean
    readonly diversityPreference: number
  }
  /** Приватность данных */
  readonly privacy: {
    readonly trackReadingHistory: boolean
    readonly shareDataForRecommendations: boolean
    readonly allowPersonalizedAds: boolean
  }
} 