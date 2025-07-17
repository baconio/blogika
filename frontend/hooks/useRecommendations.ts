/**
 * React хук для рекомендательной системы
 * @description Микромодуль для персонализированных рекомендаций статей и авторов
 */
'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recommendationsApi } from '@/lib/api';
import type {
  RecommendationParams,
  RecommendationResult,
  UserInterestProfile,
  SimilarArticles,
  AuthorRecommendation,
  PersonalizationSettings
} from '@/types';

export type Maybe<T> = T | undefined;

/**
 * Параметры хука useRecommendations
 */
export interface UseRecommendationsParams {
  /** ID пользователя */
  readonly userId?: string;
  /** Автоматически загружать рекомендации */
  readonly autoLoad?: boolean;
  /** Параметры рекомендаций по умолчанию */
  readonly defaultParams?: Partial<RecommendationParams>;
}

/**
 * Результат хука useRecommendations
 */
export interface UseRecommendationsResult {
  /** Получить персонализированные рекомендации */
  readonly getRecommendations: (params?: Partial<RecommendationParams>) => Promise<Maybe<RecommendationResult>>;
  /** Получить похожие статьи */
  readonly getSimilarArticles: (articleId: string, limit?: number) => Promise<Maybe<SimilarArticles>>;
  /** Получить рекомендации авторов */
  readonly getAuthorRecommendations: (limit?: number) => Promise<Maybe<AuthorRecommendation[]>>;
  /** Получить профиль интересов */
  readonly getUserProfile: () => Promise<Maybe<UserInterestProfile>>;
  /** Обновить профиль интересов */
  readonly updateUserProfile: (updates: Partial<UserInterestProfile>) => Promise<Maybe<UserInterestProfile>>;
  /** Получить настройки персонализации */
  readonly getPersonalizationSettings: () => Promise<Maybe<PersonalizationSettings>>;
  /** Обновить настройки персонализации */
  readonly updatePersonalizationSettings: (settings: Partial<PersonalizationSettings>) => Promise<Maybe<PersonalizationSettings>>;
  /** Отправить обратную связь */
  readonly sendFeedback: (articleId: string, feedback: 'like' | 'dislike' | 'not_interested') => Promise<void>;
  /** Загружаются ли рекомендации */
  readonly isLoading: boolean;
  /** Ошибка загрузки */
  readonly error: Maybe<Error>;
  /** Кэшированные рекомендации */
  readonly cachedRecommendations: Maybe<RecommendationResult>;
}

/**
 * Хук для работы с рекомендательной системой
 * @param params - параметры хука
 * @returns функции и состояние рекомендаций
 */
export const useRecommendations = (
  params: UseRecommendationsParams = {}
): UseRecommendationsResult => {
  const {
    userId,
    autoLoad = true,
    defaultParams = {}
  } = params;

  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Maybe<Error>>(undefined);

  // Базовые параметры рекомендаций
  const baseParams: RecommendationParams = useMemo(() => ({
    userId,
    limit: 10,
    excludeRead: true,
    diversityWeight: 0.3,
    ...defaultParams
  }), [userId, defaultParams]);

  // Кэшированные рекомендации
  const { data: cachedRecommendations } = useQuery({
    queryKey: ['recommendations', 'personalized', baseParams],
    queryFn: () => recommendationsApi.getPersonalizedRecommendations(baseParams),
    enabled: autoLoad && !!userId,
    staleTime: 10 * 60 * 1000, // 10 минут
    retry: 2
  });

  // Мутация для обратной связи
  const feedbackMutation = useMutation({
    mutationFn: ({ articleId, feedback }: { 
      articleId: string; 
      feedback: 'like' | 'dislike' | 'not_interested' 
    }) => recommendationsApi.sendRecommendationFeedback(articleId, feedback, userId),
    onSuccess: () => {
      // Инвалидируем рекомендации после обратной связи
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    }
  });

  // Мутация для обновления профиля
  const updateProfileMutation = useMutation({
    mutationFn: (updates: Partial<Omit<UserInterestProfile, 'userId' | 'lastUpdated'>>) =>
      userId ? recommendationsApi.updateUserInterestProfile(userId, updates) : Promise.reject('No user ID'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    }
  });

  // Мутация для обновления настроек
  const updateSettingsMutation = useMutation({
    mutationFn: (settings: Partial<PersonalizationSettings>) =>
      userId ? recommendationsApi.updatePersonalizationSettings(userId, settings) : Promise.reject('No user ID'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalization-settings', userId] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    }
  });

  // Получение персонализированных рекомендаций
  const getRecommendations = useCallback(async (
    customParams: Partial<RecommendationParams> = {}
  ): Promise<Maybe<RecommendationResult>> => {
    try {
      setIsLoading(true);
      setError(undefined);

      const params: RecommendationParams = {
        ...baseParams,
        ...customParams
      };

      const result = await recommendationsApi.getPersonalizedRecommendations(params);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get recommendations');
      setError(error);
      console.error('Recommendations error:', error);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [baseParams]);

  // Получение похожих статей
  const getSimilarArticles = useCallback(async (
    articleId: string,
    limit: number = 5
  ): Promise<Maybe<SimilarArticles>> => {
    try {
      return await recommendationsApi.getSimilarArticles(articleId, limit);
    } catch (error) {
      console.error('Similar articles error:', error);
      return undefined;
    }
  }, []);

  // Получение рекомендаций авторов
  const getAuthorRecommendations = useCallback(async (
    limit: number = 10
  ): Promise<Maybe<AuthorRecommendation[]>> => {
    try {
      return await recommendationsApi.getAuthorRecommendations(userId, limit);
    } catch (error) {
      console.error('Author recommendations error:', error);
      return undefined;
    }
  }, [userId]);

  // Получение профиля пользователя
  const getUserProfile = useCallback(async (): Promise<Maybe<UserInterestProfile>> => {
    if (!userId) return undefined;

    try {
      return await recommendationsApi.getUserInterestProfile(userId);
    } catch (error) {
      console.error('User profile error:', error);
      return undefined;
    }
  }, [userId]);

  // Обновление профиля пользователя
  const updateUserProfile = useCallback(async (
    updates: Partial<Omit<UserInterestProfile, 'userId' | 'lastUpdated'>>
  ): Promise<Maybe<UserInterestProfile>> => {
    try {
      return await updateProfileMutation.mutateAsync(updates);
    } catch (error) {
      console.error('Update profile error:', error);
      return undefined;
    }
  }, [updateProfileMutation]);

  // Получение настроек персонализации
  const getPersonalizationSettings = useCallback(async (): Promise<Maybe<PersonalizationSettings>> => {
    if (!userId) return undefined;

    try {
      return await recommendationsApi.getPersonalizationSettings(userId);
    } catch (error) {
      console.error('Personalization settings error:', error);
      return undefined;
    }
  }, [userId]);

  // Обновление настроек персонализации
  const updatePersonalizationSettings = useCallback(async (
    settings: Partial<PersonalizationSettings>
  ): Promise<Maybe<PersonalizationSettings>> => {
    try {
      return await updateSettingsMutation.mutateAsync(settings);
    } catch (error) {
      console.error('Update settings error:', error);
      return undefined;
    }
  }, [updateSettingsMutation]);

  // Отправка обратной связи
  const sendFeedback = useCallback(async (
    articleId: string,
    feedback: 'like' | 'dislike' | 'not_interested'
  ): Promise<void> => {
    try {
      await feedbackMutation.mutateAsync({ articleId, feedback });
    } catch (error) {
      console.error('Feedback error:', error);
    }
  }, [feedbackMutation]);

  return useMemo(() => ({
    getRecommendations,
    getSimilarArticles,
    getAuthorRecommendations,
    getUserProfile,
    updateUserProfile,
    getPersonalizationSettings,
    updatePersonalizationSettings,
    sendFeedback,
    isLoading: isLoading || feedbackMutation.isPending || updateProfileMutation.isPending || updateSettingsMutation.isPending,
    error: error || feedbackMutation.error || updateProfileMutation.error || updateSettingsMutation.error,
    cachedRecommendations
  }), [
    getRecommendations,
    getSimilarArticles,
    getAuthorRecommendations,
    getUserProfile,
    updateUserProfile,
    getPersonalizationSettings,
    updatePersonalizationSettings,
    sendFeedback,
    isLoading,
    feedbackMutation.isPending,
    feedbackMutation.error,
    updateProfileMutation.isPending,
    updateProfileMutation.error,
    updateSettingsMutation.isPending,
    updateSettingsMutation.error,
    error,
    cachedRecommendations
  ]);
}; 