/**
 * React хук для отслеживания прогресса чтения
 * @description Микромодуль для мониторинга взаимодействия читателя со статьей
 */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { trackReadingProgress, trackArticleCompletion } from '@/lib/utils';

export type Maybe<T> = T | undefined;

export interface ReadingProgressData {
  readonly scrollPercent: number;
  readonly timeSpent: number;
  readonly wordsRead: number;
  readonly isVisible: boolean;
  readonly hasStartedReading: boolean;
  readonly hasFinishedReading: boolean;
}

export interface UseReadingProgressOptions {
  readonly articleId: string;
  readonly contentSelector?: string;
  readonly wordCount?: number;
  readonly trackingEnabled?: boolean;
  readonly visibilityThreshold?: number;
  readonly completionThreshold?: number;
  readonly updateInterval?: number;
}

export interface ReadingMilestone {
  readonly percent: number;
  readonly timestamp: Date;
  readonly timeSpent: number;
}

/**
 * Хук для отслеживания прогресса чтения статьи
 * @param options - настройки отслеживания
 * @returns данные о прогрессе чтения
 * @example
 * const { progress, milestones } = useReadingProgress({ 
 *   articleId: '123',
 *   wordCount: 800 
 * })
 */
export const useReadingProgress = (options: UseReadingProgressOptions) => {
  const {
    articleId,
    contentSelector = 'article, .article-content, main',
    wordCount = 0,
    trackingEnabled = true,
    visibilityThreshold = 0.1, // 10% видимости для начала чтения
    completionThreshold = 90, // 90% для завершения
    updateInterval = 1000 // Обновление каждую секунду
  } = options;

  const [progress, setProgress] = useState<ReadingProgressData>({
    scrollPercent: 0,
    timeSpent: 0,
    wordsRead: 0,
    isVisible: false,
    hasStartedReading: false,
    hasFinishedReading: false
  });

  const [milestones, setMilestones] = useState<ReadingMilestone[]>([]);
  
  const startTimeRef = useRef<Maybe<Date>>();
  const lastUpdateRef = useRef<Date>(new Date());
  const intervalRef = useRef<Maybe<NodeJS.Timeout>>();
  const observerRef = useRef<Maybe<IntersectionObserver>>();
  const contentElementRef = useRef<Maybe<Element>>();

  // Расчет прогресса скролла
  const calculateScrollProgress = useCallback((): number => {
    const contentElement = contentElementRef.current;
    if (!contentElement) return 0;

    const rect = contentElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const contentHeight = rect.height;
    const contentTop = rect.top;

    // Если контент полностью выше экрана
    if (contentTop + contentHeight < 0) return 100;
    
    // Если контент полностью ниже экрана
    if (contentTop > windowHeight) return 0;

    // Рассчитываем процент прочитанного
    const viewportTop = Math.max(0, -contentTop);
    const viewportBottom = Math.min(contentHeight, windowHeight - contentTop);
    const visibleHeight = Math.max(0, viewportBottom - viewportTop);
    
    const scrolled = viewportTop / contentHeight;
    return Math.min(Math.max(scrolled * 100, 0), 100);
  }, []);

  // Расчет количества прочитанных слов
  const calculateWordsRead = useCallback((scrollPercent: number): number => {
    if (!wordCount) return 0;
    return Math.round((wordCount * scrollPercent) / 100);
  }, [wordCount]);

  // Обновление прогресса
  const updateProgress = useCallback(() => {
    if (!trackingEnabled || !articleId) return;

    const now = new Date();
    const scrollPercent = calculateScrollProgress();
    const wordsRead = calculateWordsRead(scrollPercent);
    
    // Время с последнего обновления
    const timeDelta = now.getTime() - lastUpdateRef.current.getTime();
    lastUpdateRef.current = now;

    setProgress(prev => {
      const timeSpent = startTimeRef.current 
        ? Math.floor((now.getTime() - startTimeRef.current.getTime()) / 1000)
        : prev.timeSpent + Math.floor(timeDelta / 1000);

      const hasStartedReading = prev.hasStartedReading || scrollPercent >= visibilityThreshold;
      const hasFinishedReading = prev.hasFinishedReading || scrollPercent >= completionThreshold;

      // Трекинг прогресса (25%, 50%, 75%, 100%)
      if (trackingEnabled && hasStartedReading) {
        trackReadingProgress(articleId, scrollPercent, timeSpent);
      }

      // Трекинг завершения чтения
      if (trackingEnabled && hasFinishedReading && !prev.hasFinishedReading) {
        trackArticleCompletion(articleId, timeSpent, wordCount);
      }

      return {
        scrollPercent,
        timeSpent,
        wordsRead,
        isVisible: prev.isVisible,
        hasStartedReading,
        hasFinishedReading
      };
    });

    // Добавляем milestone при достижении четвертей
    const quarterMilestones = [25, 50, 75, 100];
    quarterMilestones.forEach(percent => {
      if (scrollPercent >= percent && !milestones.some(m => m.percent === percent)) {
        const milestone: ReadingMilestone = {
          percent,
          timestamp: now,
          timeSpent: startTimeRef.current 
            ? Math.floor((now.getTime() - startTimeRef.current.getTime()) / 1000)
            : 0
        };
        
        setMilestones(prev => [...prev, milestone]);
      }
    });
  }, [
    trackingEnabled,
    articleId,
    calculateScrollProgress,
    calculateWordsRead,
    visibilityThreshold,
    completionThreshold,
    wordCount,
    milestones
  ]);

  // Обработчик скролла
  const handleScroll = useCallback(() => {
    updateProgress();
  }, [updateProgress]);

  // Intersection Observer для определения видимости
  useEffect(() => {
    const contentElement = document.querySelector(contentSelector);
    if (!contentElement) return;

    contentElementRef.current = contentElement;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isVisible = entry.isIntersecting;

        setProgress(prev => ({ ...prev, isVisible }));

        if (isVisible && !startTimeRef.current) {
          startTimeRef.current = new Date();
        }
      },
      {
        threshold: visibilityThreshold,
        rootMargin: '0px'
      }
    );

    observer.observe(contentElement);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [contentSelector, visibilityThreshold]);

  // Слушатели событий
  useEffect(() => {
    if (!trackingEnabled) return;

    // Обновление прогресса по интервалу
    intervalRef.current = setInterval(updateProgress, updateInterval);

    // Слушатель скролла
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Слушатель изменения размера окна
    const handleResize = () => updateProgress();
    window.addEventListener('resize', handleResize);

    // Слушатель ухода со страницы
    const handleBeforeUnload = () => {
      if (startTimeRef.current && trackingEnabled) {
        const finalTimeSpent = Math.floor(
          (new Date().getTime() - startTimeRef.current.getTime()) / 1000
        );
        const finalScrollPercent = calculateScrollProgress();
        
        // Последний трекинг перед уходом
        trackReadingProgress(articleId, finalScrollPercent, finalTimeSpent);
        
        if (finalScrollPercent >= completionThreshold) {
          trackArticleCompletion(articleId, finalTimeSpent, wordCount);
        }
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [
    trackingEnabled,
    updateInterval,
    handleScroll,
    updateProgress,
    articleId,
    calculateScrollProgress,
    completionThreshold,
    wordCount
  ]);

  // Функции для внешнего управления
  const resetProgress = useCallback(() => {
    setProgress({
      scrollPercent: 0,
      timeSpent: 0,
      wordsRead: 0,
      isVisible: false,
      hasStartedReading: false,
      hasFinishedReading: false
    });
    setMilestones([]);
    startTimeRef.current = undefined;
    lastUpdateRef.current = new Date();
  }, []);

  const pauseTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  const resumeTracking = useCallback(() => {
    if (!intervalRef.current && trackingEnabled) {
      intervalRef.current = setInterval(updateProgress, updateInterval);
    }
  }, [trackingEnabled, updateProgress, updateInterval]);

  return {
    progress,
    milestones,
    
    // Вычисляемые значения
    estimatedReadingSpeed: progress.timeSpent > 0 && progress.wordsRead > 0 
      ? Math.round((progress.wordsRead / progress.timeSpent) * 60) // слов в минуту
      : 0,
    
    estimatedTimeRemaining: progress.scrollPercent > 0 && progress.timeSpent > 0
      ? Math.round((progress.timeSpent / progress.scrollPercent) * (100 - progress.scrollPercent))
      : 0,
      
    progressPercentage: Math.round(progress.scrollPercent),
    
    // Функции управления
    resetProgress,
    pauseTracking,
    resumeTracking,
    updateProgress
  };
}; 