/**
 * Утилиты для аналитики и трекинга
 * @description Микромодуль для отслеживания событий пользователей и метрик
 */

export type Maybe<T> = T | undefined;

export interface AnalyticsEvent {
  readonly name: string;
  readonly properties: Record<string, unknown>;
  readonly timestamp: Date;
  readonly userId?: string;
  readonly sessionId: string;
}

export interface ReadingSession {
  readonly articleId: string;
  readonly startTime: Date;
  readonly endTime?: Date;
  readonly scrollDepth: number;
  readonly timeSpent: number;
  readonly completed: boolean;
}

export interface ConversionMetrics {
  readonly visitors: number;
  readonly readers: number;
  readonly subscribers: number;
  readonly readerConversionRate: number;
  readonly subscriberConversionRate: number;
}

/**
 * Трекинг события для аналитики
 * @param eventName - название события
 * @param properties - свойства события
 * @param userId - ID пользователя (опционально)
 * @example
 * trackEvent('article_viewed', { articleId: '123', category: 'tech' })
 */
export const trackEvent = (
  eventName: string,
  properties: Record<string, unknown> = {},
  userId?: string
): void => {
  const event: AnalyticsEvent = {
    name: eventName,
    properties,
    timestamp: new Date(),
    userId,
    sessionId: getSessionId()
  };

  // Отправка в аналитические сервисы
  sendToAnalytics(event);
};

/**
 * Трекинг чтения статьи
 * @param articleId - ID статьи
 * @param title - заголовок статьи
 * @param category - категория статьи
 * @example
 * trackArticleView('123', 'Заголовок статьи', 'Технологии')
 */
export const trackArticleView = (
  articleId: string,
  title: string,
  category?: string
): void => {
  trackEvent('article_viewed', {
    articleId,
    title,
    category,
    url: window.location.href,
    referrer: document.referrer
  });
};

/**
 * Трекинг прогресса чтения статьи
 * @param articleId - ID статьи
 * @param scrollPercent - процент прокрутки (0-100)
 * @param timeSpent - время чтения в секундах
 * @example
 * trackReadingProgress('123', 50, 120)
 */
export const trackReadingProgress = (
  articleId: string,
  scrollPercent: number,
  timeSpent: number
): void => {
  const milestones = [25, 50, 75, 100];
  const currentMilestone = milestones.find(milestone => 
    scrollPercent >= milestone && !isProgressMilestoneTracked(articleId, milestone)
  );

  if (currentMilestone) {
    trackEvent('reading_progress', {
      articleId,
      milestone: currentMilestone,
      scrollPercent,
      timeSpent
    });
    
    markProgressMilestone(articleId, currentMilestone);
  }
};

/**
 * Трекинг завершения чтения статьи
 * @param articleId - ID статьи
 * @param totalTimeSpent - общее время чтения в секундах
 * @param wordCount - количество слов в статье
 * @example
 * trackArticleCompletion('123', 300, 1500)
 */
export const trackArticleCompletion = (
  articleId: string,
  totalTimeSpent: number,
  wordCount: number
): void => {
  const readingSpeed = wordCount > 0 ? Math.round(wordCount / (totalTimeSpent / 60)) : 0;
  
  trackEvent('article_completed', {
    articleId,
    totalTimeSpent,
    wordCount,
    readingSpeed,
    engagementScore: calculateEngagementScore(totalTimeSpent, wordCount)
  });
};

/**
 * Трекинг взаимодействий с контентом
 * @param action - тип действия (like, share, comment, bookmark)
 * @param articleId - ID статьи
 * @param additionalData - дополнительные данные
 * @example
 * trackContentInteraction('like', '123', { previouslyLiked: false })
 */
export const trackContentInteraction = (
  action: 'like' | 'share' | 'comment' | 'bookmark' | 'subscribe',
  articleId: string,
  additionalData: Record<string, unknown> = {}
): void => {
  trackEvent('content_interaction', {
    action,
    articleId,
    ...additionalData
  });
};

/**
 * Рассчитывает оценку вовлеченности читателя
 * @param timeSpent - время чтения в секундах
 * @param wordCount - количество слов в статье
 * @returns оценка от 0 до 100
 * @example
 * const score = calculateEngagementScore(180, 800) // ~75
 */
export const calculateEngagementScore = (
  timeSpent: number,
  wordCount: number
): number => {
  if (wordCount === 0 || timeSpent === 0) return 0;

  const averageReadingSpeed = 200; // слов в минуту
  const expectedTime = (wordCount / averageReadingSpeed) * 60; // в секундах
  const timeRatio = Math.min(timeSpent / expectedTime, 2); // максимум 2x от ожидаемого
  
  return Math.round(timeRatio * 50); // 0-100 баллов
};

/**
 * Рассчитывает метрики конверсии
 * @param pageViews - просмотры страницы
 * @param articleReads - прочтения статей
 * @param subscriptions - подписки
 * @returns метрики конверсии
 * @example
 * const metrics = calculateConversionMetrics(1000, 300, 45)
 */
export const calculateConversionMetrics = (
  pageViews: number,
  articleReads: number,
  subscriptions: number
): ConversionMetrics => {
  const readerConversionRate = pageViews > 0 
    ? Math.round((articleReads / pageViews) * 100 * 100) / 100
    : 0;

  const subscriberConversionRate = articleReads > 0
    ? Math.round((subscriptions / articleReads) * 100 * 100) / 100
    : 0;

  return {
    visitors: pageViews,
    readers: articleReads,
    subscribers: subscriptions,
    readerConversionRate,
    subscriberConversionRate
  };
};

/**
 * Получает или создает ID сессии
 * @returns ID текущей сессии
 */
const getSessionId = (): string => {
  const storageKey = 'analytics_session_id';
  let sessionId = sessionStorage.getItem(storageKey);
  
  if (!sessionId) {
    sessionId = generateId();
    sessionStorage.setItem(storageKey, sessionId);
  }
  
  return sessionId;
};

/**
 * Генерирует уникальный ID
 * @returns уникальную строку
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Отправляет событие в аналитические сервисы
 * @param event - событие для отправки
 */
const sendToAnalytics = (event: AnalyticsEvent): void => {
  // В реальном приложении здесь будет отправка в:
  // - Google Analytics
  // - Yandex Metrica  
  // - Mixpanel
  // - собственная аналитика
  
  if (typeof window !== 'undefined') {
    console.log('Analytics Event:', event);
    
    // Пример интеграции с gtag
    if (window.gtag) {
      window.gtag('event', event.name, event.properties);
    }
  }
};

/**
 * Проверяет, отслеживался ли уже прогресс для статьи
 * @param articleId - ID статьи
 * @param milestone - процент прогресса
 * @returns true если уже отслеживался
 */
const isProgressMilestoneTracked = (articleId: string, milestone: number): boolean => {
  const key = `progress_${articleId}_${milestone}`;
  return sessionStorage.getItem(key) === 'true';
};

/**
 * Отмечает прогресс как отслеженный
 * @param articleId - ID статьи
 * @param milestone - процент прогресса
 */
const markProgressMilestone = (articleId: string, milestone: number): void => {
  const key = `progress_${articleId}_${milestone}`;
  sessionStorage.setItem(key, 'true');
};

// Расширение типов для gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
} 