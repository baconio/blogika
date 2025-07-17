/**
 * Типы для системы аналитики и метрик
 * Поддерживает Mixpanel, Yandex Metrica и собственную аналитику
 */

import type { Article } from './Article'
import type { Author } from './Author'
import type { User } from './User'

/**
 * Базовые метрики статьи
 */
export interface ArticleMetrics {
  /** ID статьи */
  readonly articleId: string
  /** Количество просмотров */
  readonly views: number
  /** Уникальные посетители */
  readonly uniqueViews: number
  /** Лайки */
  readonly likes: number
  /** Комментарии */
  readonly comments: number
  /** Шеры в соцсетях */
  readonly shares: number
  /** Время чтения (среднее) */
  readonly avgReadingTime: number
  /** Процент дочитывания */
  readonly completionRate: number
  /** Показатель вовлечения (0-1) */
  readonly engagementScore: number
}

/**
 * Аналитика чтения для отдельного пользователя
 */
export interface ReadingAnalytics {
  /** Время начала чтения */
  readonly startTime: Date
  /** Общее время чтения (секунды) */
  readonly totalTime: number
  /** Процент прочитанного */
  readonly progressPercent: number
  /** Была ли статья дочитана до конца */
  readonly completed: boolean
  /** Источник перехода */
  readonly referrer?: string
  /** Устройство пользователя */
  readonly device: DeviceInfo
  /** События взаимодействия */
  readonly interactions: readonly InteractionEvent[]
}

/**
 * Информация об устройстве пользователя
 */
export interface DeviceInfo {
  /** Тип устройства */
  readonly type: 'desktop' | 'tablet' | 'mobile'
  /** Операционная система */
  readonly os: string
  /** Браузер */
  readonly browser: string
  /** Размер экрана */
  readonly screenSize: {
    readonly width: number
    readonly height: number
  }
}

/**
 * События взаимодействия с контентом
 */
export interface InteractionEvent {
  /** Тип события */
  readonly type: 'scroll' | 'click' | 'like' | 'share' | 'comment' | 'bookmark'
  /** Время события */
  readonly timestamp: Date
  /** Позиция в статье (для scroll) */
  readonly position?: number
  /** Дополнительные данные */
  readonly metadata?: Record<string, unknown>
}

/**
 * Аналитика автора (расширенная статистика)
 */
export interface AuthorAnalytics {
  /** ID автора */
  readonly authorId: string
  /** Общие метрики */
  readonly totalViews: number
  readonly totalLikes: number
  readonly totalComments: number
  readonly totalShares: number
  /** Подписки */
  readonly subscriberCount: number
  readonly newSubscribers: number
  /** Доходы */
  readonly totalEarnings: number
  readonly monthlyEarnings: number
  /** Средние показатели */
  readonly avgViewsPerArticle: number
  readonly avgEngagementRate: number
  /** Топ статьи */
  readonly topArticles: readonly ArticleMetrics[]
}

/**
 * Данные для дашборда автора по периодам
 */
export interface AuthorDashboardData {
  /** Период анализа */
  readonly period: TimePeriod
  /** Основные метрики */
  readonly metrics: AuthorAnalytics
  /** Тренды по дням */
  readonly dailyTrends: readonly DailyMetrics[]
  /** Источники трафика */
  readonly trafficSources: readonly TrafficSource[]
  /** Популярные темы */
  readonly topTopics: readonly TopicMetrics[]
}

/**
 * Период для аналитики
 */
export interface TimePeriod {
  /** Начальная дата */
  readonly from: Date
  /** Конечная дата */
  readonly to: Date
  /** Тип периода */
  readonly type: 'day' | 'week' | 'month' | 'year'
}

/**
 * Метрики по дням
 */
export interface DailyMetrics {
  /** Дата */
  readonly date: Date
  /** Просмотры */
  readonly views: number
  /** Лайки */
  readonly likes: number
  /** Новые подписчики */
  readonly newSubscribers: number
  /** Доходы */
  readonly earnings: number
}

/**
 * Источники трафика
 */
export interface TrafficSource {
  /** Название источника */
  readonly source: string
  /** Количество визитов */
  readonly visits: number
  /** Процент от общего трафика */
  readonly percentage: number
  /** Тип источника */
  readonly type: 'search' | 'social' | 'direct' | 'referral' | 'email'
}

/**
 * Метрики по темам/тегам
 */
export interface TopicMetrics {
  /** Название темы */
  readonly topic: string
  /** Количество статей */
  readonly articleCount: number
  /** Общие просмотры */
  readonly totalViews: number
  /** Средняя вовлеченность */
  readonly avgEngagement: number
}

/**
 * События для отправки в внешние системы аналитики
 */
export interface AnalyticsEvent {
  /** Название события */
  readonly name: string
  /** Категория события */
  readonly category: 'article' | 'user' | 'subscription' | 'monetization'
  /** Свойства события */
  readonly properties: Record<string, unknown>
  /** Пользователь (если авторизован) */
  readonly userId?: string
  /** Время события */
  readonly timestamp: Date
} 