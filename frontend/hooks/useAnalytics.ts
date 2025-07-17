/**
 * React хук для аналитики и метрик
 * @description Микромодуль для работы с аналитикой, трекингом событий и метриками
 */
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';
import type {
  ArticleMetrics,
  ReadingAnalytics,
  AuthorAnalytics,
  AuthorDashboardData,
  TimePeriod,
  AnalyticsEvent,
  InteractionEvent,
  DeviceInfo
} from '@/types';

export type Maybe<T> = T | undefined;

/**
 * Параметры хука useAnalytics
 */
export interface UseAnalyticsParams {
  /** ID пользователя для персонализации */
  readonly userId?: string;
  /** Автоматически отправлять события */
  readonly autoTrack?: boolean;
  /** Интервал обновления метрик (мс) */
  readonly refreshInterval?: number;
}

/**
 * Результат хука useAnalytics
 */
export interface UseAnalyticsResult {
  /** Отправить событие аналитики */
  readonly trackEvent: (event: Omit<AnalyticsEvent, 'timestamp'>) => Promise<void>;
  /** Отправить событие чтения */
  readonly trackReading: (articleId: string, analytics: Omit<ReadingAnalytics, 'interactions'>) => Promise<void>;
  /** Отправить событие взаимодействия */
  readonly trackInteraction: (articleId: string, event: InteractionEvent) => Promise<void>;
  /** Получить метрики статьи */
  readonly getArticleMetrics: (articleId: string) => Promise<Maybe<ArticleMetrics>>;
  /** Получить аналитику автора */
  readonly getAuthorAnalytics: (authorId: string, period: TimePeriod) => Promise<Maybe<AuthorDashboardData>>;
  /** Информация об устройстве */
  readonly deviceInfo: DeviceInfo;
  /** Отправляется ли событие */
  readonly isTracking: boolean;
  /** Ошибка отправки */
  readonly trackingError: Maybe<Error>;
}

/**
 * Получает информацию об устройстве пользователя
 */
const getDeviceInfo = (): DeviceInfo => {
  const userAgent = navigator.userAgent.toLowerCase();
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  
  // Определение типа устройства
  let deviceType: DeviceInfo['type'] = 'desktop';
  if (screenWidth <= 768) {
    deviceType = 'mobile';
  } else if (screenWidth <= 1024) {
    deviceType = 'tablet';
  }

  // Определение ОС
  let os = 'Unknown';
  if (userAgent.includes('windows')) os = 'Windows';
  else if (userAgent.includes('mac')) os = 'macOS';
  else if (userAgent.includes('linux')) os = 'Linux';
  else if (userAgent.includes('android')) os = 'Android';
  else if (userAgent.includes('ios') || userAgent.includes('iphone') || userAgent.includes('ipad')) os = 'iOS';

  // Определение браузера
  let browser = 'Unknown';
  if (userAgent.includes('chrome')) browser = 'Chrome';
  else if (userAgent.includes('firefox')) browser = 'Firefox';
  else if (userAgent.includes('safari')) browser = 'Safari';
  else if (userAgent.includes('edge')) browser = 'Edge';

  return {
    type: deviceType,
    os,
    browser,
    screenSize: {
      width: screenWidth,
      height: screenHeight
    }
  };
};

/**
 * Хук для работы с аналитикой
 * @param params - параметры хука
 * @returns функции и состояние аналитики
 */
export const useAnalytics = (params: UseAnalyticsParams = {}): UseAnalyticsResult => {
  const {
    userId,
    autoTrack = true,
    refreshInterval = 30000 // 30 секунд
  } = params;

  // Информация об устройстве
  const deviceInfo = useMemo(() => getDeviceInfo(), []);

  // Мутация для отправки событий
  const {
    mutateAsync: sendEvent,
    isPending: isTracking,
    error: trackingError
  } = useMutation({
    mutationFn: (event: AnalyticsEvent) => analyticsApi.trackEvent(event),
    onError: (error) => {
      console.error('Analytics tracking error:', error);
    }
  });

  // Функция отправки события
  const trackEvent = useCallback(async (
    event: Omit<AnalyticsEvent, 'timestamp'>
  ): Promise<void> => {
    if (!autoTrack) return;

    const fullEvent: AnalyticsEvent = {
      ...event,
      userId,
      timestamp: new Date()
    };

    await sendEvent(fullEvent);
  }, [autoTrack, userId, sendEvent]);

  // Отправка события чтения
  const trackReading = useCallback(async (
    articleId: string,
    analytics: Omit<ReadingAnalytics, 'interactions'>
  ): Promise<void> => {
    await analyticsApi.trackReading(articleId, analytics);
    
    // Дополнительно отправляем общее событие
    await trackEvent({
      name: 'article_read',
      category: 'article',
      properties: {
        articleId,
        readingTime: analytics.totalTime,
        completed: analytics.completed,
        progressPercent: analytics.progressPercent,
        device: analytics.device
      }
    });
  }, [trackEvent]);

  // Отправка события взаимодействия
  const trackInteraction = useCallback(async (
    articleId: string,
    event: InteractionEvent
  ): Promise<void> => {
    await analyticsApi.trackInteraction(articleId, event);
    
    // Дополнительно отправляем общее событие
    await trackEvent({
      name: `article_${event.type}`,
      category: 'article',
      properties: {
        articleId,
        interactionType: event.type,
        position: event.position,
        metadata: event.metadata
      }
    });
  }, [trackEvent]);

  // Получение метрик статьи
  const getArticleMetrics = useCallback(async (
    articleId: string
  ): Promise<Maybe<ArticleMetrics>> => {
    try {
      return await analyticsApi.getArticleMetrics(articleId);
    } catch (error) {
      console.error('Failed to get article metrics:', error);
      return undefined;
    }
  }, []);

  // Получение аналитики автора
  const getAuthorAnalytics = useCallback(async (
    authorId: string,
    period: TimePeriod
  ): Promise<Maybe<AuthorDashboardData>> => {
    try {
      return await analyticsApi.getAuthorAnalytics(authorId, period);
    } catch (error) {
      console.error('Failed to get author analytics:', error);
      return undefined;
    }
  }, []);

  // Автоматическое отслеживание просмотра страницы
  useEffect(() => {
    if (!autoTrack) return;

    const handlePageView = () => {
      trackEvent({
        name: 'page_view',
        category: 'user',
        properties: {
          url: window.location.href,
          referrer: document.referrer,
          device: deviceInfo
        }
      }).catch(console.error);
    };

    // Отслеживаем первоначальную загрузку
    handlePageView();

    // Отслеживаем изменения в SPA
    const handlePopState = () => handlePageView();
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [autoTrack, trackEvent, deviceInfo]);

  return useMemo(() => ({
    trackEvent,
    trackReading,
    trackInteraction,
    getArticleMetrics,
    getAuthorAnalytics,
    deviceInfo,
    isTracking,
    trackingError
  }), [
    trackEvent,
    trackReading,
    trackInteraction,
    getArticleMetrics,
    getAuthorAnalytics,
    deviceInfo,
    isTracking,
    trackingError
  ]);
}; 