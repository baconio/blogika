/**
 * Subscriptions API - работа с подписками
 * Интеграция с Strapi Content Type Subscription
 */

import { apiClient } from './client';
import type { 
  Subscription, 
  SubscriptionInput, 
  SubscriptionUpdate, 
  SubscriptionSearchParams,
  SubscriptionCancellationData,
  AuthorSubscriptionStats,
  PricingPlan,
  PaymentResult
} from '@/types';

/**
 * API для работы с подписками
 */
export const subscriptionsApi = {
  /**
   * Создание новой подписки
   * @param data - данные подписки
   * @returns созданная подписка
   */
  async create(data: SubscriptionInput): Promise<PaymentResult> {
    const response = await apiClient.post<PaymentResult>('/subscriptions/create', data);
    return response.data;
  },

  /**
   * Получение подписок пользователя
   * @param params - параметры поиска
   * @returns подписки пользователя
   */
  async getUserSubscriptions(params?: SubscriptionSearchParams) {
    const requestParams = {
      populate: ['author.user', 'author.avatar', 'payment_info'],
      filters: {},
      sort: ['createdAt:desc'],
      pagination: {
        page: 1,
        pageSize: params?.limit || 10
      }
    };

    // Добавляем фильтры
    if (params?.status) requestParams.filters.status = params.status;
    if (params?.planType) requestParams.filters.plan_type = params.planType;

    const response = await apiClient.get<Subscription[]>('/subscriptions/user-subscriptions', requestParams);
    return response;
  },

  /**
   * Получение подписчиков автора
   * @param authorId - ID автора
   * @param params - параметры поиска
   * @returns подписчики автора
   */
  async getAuthorSubscribers(authorId: number, params?: SubscriptionSearchParams) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);

    const response = await apiClient.get<Subscription[]>(
      `/subscriptions/author/${authorId}/subscribers?${queryParams.toString()}`
    );

    return response.data;
  },

  /**
   * Получение статистики подписок автора
   * @param authorId - ID автора
   * @returns статистика подписок
   */
  async getAuthorStats(authorId: number): Promise<AuthorSubscriptionStats> {
    const response = await apiClient.get<AuthorSubscriptionStats>(
      `/subscriptions/author/${authorId}/stats`
    );

    return response.data;
  },

  /**
   * Получение подписки по ID
   * @param id - ID подписки
   * @returns подписка
   */
  async getById(id: number) {
    const response = await apiClient.get<Subscription>(`/subscriptions/${id}`, {
      populate: ['subscriber', 'author', 'payment_info']
    });

    return response.data;
  },

  /**
   * Обновление подписки
   * @param id - ID подписки
   * @param data - данные для обновления
   * @returns обновленная подписка
   */
  async update(id: number, data: SubscriptionUpdate) {
    const response = await apiClient.put<Subscription>(`/subscriptions/${id}`, data);
    return response.data;
  },

  /**
   * Отмена подписки
   * @param data - данные отмены
   * @returns результат отмены
   */
  async cancel(data: SubscriptionCancellationData) {
    const response = await apiClient.put<Subscription>(
      `/subscriptions/${data.subscriptionId}/cancel`,
      {
        reason: data.reason,
        immediately: data.immediately
      }
    );

    return response.data;
  },

  /**
   * Возобновление подписки
   * @param id - ID подписки
   * @returns обновленная подписка
   */
  async renew(id: number) {
    const response = await apiClient.put<Subscription>(`/subscriptions/${id}/renew`, {});
    return response.data;
  },

  /**
   * Проверка активной подписки на автора
   * @param authorId - ID автора
   * @returns статус подписки
   */
  async checkActiveSubscription(authorId: number): Promise<{
    hasSubscription: boolean;
    subscription?: Subscription;
    daysRemaining?: number;
  }> {
    try {
      const subscriptions = await this.getUserSubscriptions({
        status: 'active'
      });

      const activeSubscription = subscriptions.data.find(
        sub => sub.author.id === authorId
      );

      if (!activeSubscription) {
        return { hasSubscription: false };
      }

      const daysRemaining = activeSubscription.expires_at 
        ? Math.ceil((new Date(activeSubscription.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : undefined;

      return {
        hasSubscription: true,
        subscription: activeSubscription,
        daysRemaining
      };
    } catch {
      return { hasSubscription: false };
    }
  },

  /**
   * Получение тарифных планов автора
   * @param authorId - ID автора
   * @returns тарифные планы
   */
  async getPricingPlans(authorId: number): Promise<PricingPlan[]> {
    const response = await apiClient.get<{ plans: PricingPlan[] }>(
      `/subscriptions/author/${authorId}/pricing`
    );

    return response.data.plans;
  },

  /**
   * Проверка скидочного кода
   * @param code - скидочный код
   * @param authorId - ID автора
   * @returns информация о скидке
   */
  async validateDiscountCode(code: string, authorId: number) {
    const response = await apiClient.post<{
      valid: boolean;
      discount: number;
      description?: string;
    }>('/subscriptions/validate-discount', {
      code,
      authorId
    });

    return response.data;
  },

  /**
   * Получение истории платежей
   * @param subscriptionId - ID подписки
   * @returns история платежей
   */
  async getPaymentHistory(subscriptionId: number) {
    const response = await apiClient.get<{
      payments: Array<{
        id: string;
        amount: number;
        status: string;
        date: string;
        method: string;
      }>;
    }>(`/subscriptions/${subscriptionId}/payments`);

    return response.data.payments;
  },

  /**
   * Изменение способа оплаты
   * @param subscriptionId - ID подписки
   * @param paymentToken - новый токен платежа
   * @returns результат обновления
   */
  async updatePaymentMethod(subscriptionId: number, paymentToken: string) {
    const response = await apiClient.put<Subscription>(
      `/subscriptions/${subscriptionId}/payment-method`,
      { paymentToken }
    );

    return response.data;
  },

  /**
   * Получение уведомлений о подписке
   * @param subscriptionId - ID подписки
   * @returns настройки уведомлений
   */
  async getNotificationSettings(subscriptionId: number) {
    const response = await apiClient.get<{
      emailOnExpiry: boolean;
      emailOnPayment: boolean;
      reminderDaysBefore: number;
    }>(`/subscriptions/${subscriptionId}/notifications`);

    return response.data;
  },

  /**
   * Обновление настроек уведомлений
   * @param subscriptionId - ID подписки
   * @param settings - новые настройки
   * @returns обновленные настройки
   */
  async updateNotificationSettings(subscriptionId: number, settings: {
    emailOnExpiry?: boolean;
    emailOnPayment?: boolean;
    reminderDaysBefore?: number;
  }) {
    const response = await apiClient.put<any>(
      `/subscriptions/${subscriptionId}/notifications`,
      settings
    );

    return response.data;
  },

  /**
   * Получение рекомендуемых авторов для подписки
   * @param limit - количество рекомендаций
   * @returns рекомендуемые авторы
   */
  async getRecommendedAuthors(limit: number = 5) {
    const response = await apiClient.get<Array<{
      author: any;
      reasonCode: string;
      reasonText: string;
    }>>('/subscriptions/recommended-authors', {
      pagination: { pageSize: limit }
    });

    return response.data;
  }
}; 