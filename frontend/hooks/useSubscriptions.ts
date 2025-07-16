/**
 * React хук для работы с подписками
 * @description Микромодуль для управления подписками и монетизацией
 */
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionsApi } from '@/lib/api';
import { trackContentInteraction } from '@/lib/utils';
import type { Subscription } from '@/types';

export type Maybe<T> = T | undefined;

export interface CreateSubscriptionData {
  readonly authorId: string;
  readonly planType: 'monthly' | 'yearly' | 'lifetime';
  readonly paymentMethodId: string;
  readonly discountCode?: string;
}

export interface SubscriptionFilters {
  readonly status?: 'active' | 'cancelled' | 'expired' | 'pending' | 'trial';
  readonly planType?: 'monthly' | 'yearly' | 'lifetime';
  readonly dateFrom?: Date;
  readonly dateTo?: Date;
}

export interface SubscriptionStats {
  readonly totalSubscribers: number;
  readonly activeSubscriptions: number;
  readonly monthlyRevenue: number;
  readonly churnRate: number;
  readonly averageLifetime: number;
}

/**
 * Хук для получения подписок пользователя
 * @param userId - ID пользователя
 * @param filters - фильтры подписок
 * @returns подписки пользователя
 * @example
 * const { data: subscriptions } = useUserSubscriptions('user-123')
 */
export const useUserSubscriptions = (userId: string, filters: SubscriptionFilters = {}) => {
  return useQuery({
    queryKey: ['subscriptions', 'user', userId, filters],
    queryFn: () => subscriptionsApi.findByUser(userId, filters),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут в кэше
  });
};

/**
 * Хук для получения подписчиков автора
 * @param authorId - ID автора
 * @param filters - фильтры подписчиков
 * @returns список подписчиков
 * @example
 * const { data: subscribers } = useAuthorSubscribers('author-123')
 */
export const useAuthorSubscribers = (authorId: string, filters: SubscriptionFilters = {}) => {
  return useQuery({
    queryKey: ['subscriptions', 'author', authorId, filters],
    queryFn: () => subscriptionsApi.findByAuthor(authorId, filters),
    enabled: !!authorId,
    staleTime: 2 * 60 * 1000, // 2 минуты для актуальности
  });
};

/**
 * Хук для получения одной подписки по ID
 * @param subscriptionId - ID подписки
 * @returns данные подписки
 * @example
 * const { data: subscription } = useSubscription('sub-123')
 */
export const useSubscription = (subscriptionId: string) => {
  return useQuery({
    queryKey: ['subscription', subscriptionId],
    queryFn: () => subscriptionsApi.findById(subscriptionId),
    enabled: !!subscriptionId,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

/**
 * Хук для проверки активной подписки на автора
 * @param authorId - ID автора
 * @param userId - ID пользователя
 * @returns статус подписки
 * @example
 * const { data: hasSubscription } = useSubscriptionStatus('author-123', 'user-456')
 */
export const useSubscriptionStatus = (authorId: string, userId?: string) => {
  return useQuery({
    queryKey: ['subscription', 'status', authorId, userId],
    queryFn: () => subscriptionsApi.checkStatus(authorId, userId),
    enabled: !!authorId && !!userId,
    staleTime: 1 * 60 * 1000, // 1 минута для актуальности доступа
  });
};

/**
 * Хук для получения статистики подписок автора
 * @param authorId - ID автора
 * @param period - период статистики
 * @returns статистика подписок
 * @example
 * const { data: stats } = useSubscriptionStats('author-123', 'month')
 */
export const useSubscriptionStats = (
  authorId: string, 
  period: 'week' | 'month' | 'year' = 'month'
) => {
  return useQuery({
    queryKey: ['subscriptions', 'stats', authorId, period],
    queryFn: () => subscriptionsApi.getStats(authorId, period),
    enabled: !!authorId,
    staleTime: 10 * 60 * 1000, // 10 минут для статистики
  });
};

/**
 * Хук для создания новой подписки
 * @returns функция мутации для создания подписки
 * @example
 * const { mutate: subscribe, isPending } = useCreateSubscription()
 */
export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubscriptionData) => subscriptionsApi.create(data),
    onSuccess: (newSubscription, variables) => {
      // Инвалидируем подписки пользователя
      queryClient.invalidateQueries({ 
        queryKey: ['subscriptions', 'user'] 
      });

      // Инвалидируем подписчиков автора
      queryClient.invalidateQueries({ 
        queryKey: ['subscriptions', 'author', variables.authorId] 
      });

      // Инвалидируем статус подписки
      queryClient.invalidateQueries({ 
        queryKey: ['subscription', 'status', variables.authorId] 
      });

      // Инвалидируем статистику автора
      queryClient.invalidateQueries({ 
        queryKey: ['subscriptions', 'stats', variables.authorId] 
      });

      // Трекинг создания подписки
      trackContentInteraction('subscribe', variables.authorId, {
        subscriptionId: newSubscription.documentId,
        planType: variables.planType,
        price: newSubscription.price,
        discountCode: variables.discountCode
      });
    },
    onError: (error) => {
      console.error('Ошибка при создании подписки:', error);
    },
  });
};

/**
 * Хук для отмены подписки
 * @returns функция мутации для отмены
 * @example
 * const { mutate: cancelSubscription } = useCancelSubscription()
 */
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      subscriptionId, 
      reason 
    }: { 
      subscriptionId: string; 
      reason?: string 
    }) =>
      subscriptionsApi.cancel(subscriptionId, reason),
    onSuccess: (cancelledSubscription) => {
      // Обновляем подписку в кэше
      queryClient.setQueryData(
        ['subscription', cancelledSubscription.documentId], 
        cancelledSubscription
      );

      // Инвалидируем все связанные данные
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });

      // Трекинг отмены подписки
      trackContentInteraction('unsubscribe', cancelledSubscription.author.documentId, {
        subscriptionId: cancelledSubscription.documentId,
        reason: cancelledSubscription.cancellation_reason,
        refundAmount: cancelledSubscription.refund_amount
      });
    },
  });
};

/**
 * Хук для продления подписки
 * @returns функция мутации для продления
 * @example
 * const { mutate: renewSubscription } = useRenewSubscription()
 */
export const useRenewSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      subscriptionId, 
      paymentMethodId 
    }: { 
      subscriptionId: string; 
      paymentMethodId?: string 
    }) =>
      subscriptionsApi.renew(subscriptionId, paymentMethodId),
    onSuccess: (renewedSubscription) => {
      // Обновляем подписку в кэше
      queryClient.setQueryData(
        ['subscription', renewedSubscription.documentId], 
        renewedSubscription
      );

      // Инвалидируем подписки пользователя
      queryClient.invalidateQueries({ 
        queryKey: ['subscriptions', 'user'] 
      });

      // Инвалидируем статистику автора
      queryClient.invalidateQueries({ 
        queryKey: ['subscriptions', 'stats', renewedSubscription.author.documentId] 
      });
    },
  });
};

/**
 * Хук для обновления настроек подписки
 * @returns функция мутации для обновления
 * @example
 * const { mutate: updateSubscription } = useUpdateSubscription()
 */
export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      id, 
      data 
    }: { 
      id: string; 
      data: Partial<Subscription> 
    }) =>
      subscriptionsApi.update(id, data),
    onSuccess: (updatedSubscription) => {
      // Обновляем подписку в кэше
      queryClient.setQueryData(
        ['subscription', updatedSubscription.documentId], 
        updatedSubscription
      );

      // Инвалидируем связанные данные
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
};

/**
 * Хук для переключения автопродления
 * @returns функция мутации для автопродления
 * @example
 * const { mutate: toggleAutoRenewal } = useToggleAutoRenewal()
 */
export const useToggleAutoRenewal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      subscriptionId, 
      autoRenewal 
    }: { 
      subscriptionId: string; 
      autoRenewal: boolean 
    }) =>
      subscriptionsApi.toggleAutoRenewal(subscriptionId, autoRenewal),
    onSuccess: (updatedSubscription) => {
      // Обновляем подписку в кэше
      queryClient.setQueryData(
        ['subscription', updatedSubscription.documentId], 
        updatedSubscription
      );

      // Инвалидируем подписки пользователя
      queryClient.invalidateQueries({ 
        queryKey: ['subscriptions', 'user'] 
      });
    },
  });
};

/**
 * Хук для получения истории платежей по подписке
 * @param subscriptionId - ID подписки
 * @returns история платежей
 * @example
 * const { data: payments } = useSubscriptionPayments('sub-123')
 */
export const useSubscriptionPayments = (subscriptionId: string) => {
  return useQuery({
    queryKey: ['subscription', 'payments', subscriptionId],
    queryFn: () => subscriptionsApi.getPayments(subscriptionId),
    enabled: !!subscriptionId,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

/**
 * Хук для применения промокода к подписке
 * @returns функция мутации для промокода
 * @example
 * const { mutate: applyPromoCode } = useApplyPromoCode()
 */
export const useApplyPromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      subscriptionId, 
      promoCode 
    }: { 
      subscriptionId: string; 
      promoCode: string 
    }) =>
      subscriptionsApi.applyPromoCode(subscriptionId, promoCode),
    onSuccess: (updatedSubscription) => {
      // Обновляем подписку в кэше
      queryClient.setQueryData(
        ['subscription', updatedSubscription.documentId], 
        updatedSubscription
      );

      // Инвалидируем подписки пользователя
      queryClient.invalidateQueries({ 
        queryKey: ['subscriptions', 'user'] 
      });
    },
    onError: (error) => {
      console.error('Ошибка при применении промокода:', error);
    },
  });
}; 