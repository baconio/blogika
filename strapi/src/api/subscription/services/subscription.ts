/**
 * subscription service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::subscription.subscription', ({ strapi }) => ({
  /**
   * Создание подписки с обработкой платежа
   * @param data - данные подписки
   * @returns созданная подписка
   */
  async createWithPayment(data: any) {
    const { plan_type, price, payment_token } = data;
    
    // Расчет даты окончания подписки
    const startDate = new Date();
    const expirationDate = this.calculateExpirationDate(startDate, plan_type);
    const nextBillingDate = plan_type !== 'lifetime' ? expirationDate : null;

    // Создаем подписку
    const subscription = await strapi.entityService.create('api::subscription.subscription', {
      data: {
        ...data,
        started_at: startDate,
        expires_at: expirationDate,
        next_billing_date: nextBillingDate,
        status: 'pending'
      }
    });

    // Обрабатываем платеж (здесь будет интеграция с платежными системами)
    const paymentResult = await this.processPayment({
      amount: price,
      token: payment_token,
      subscription_id: subscription.id
    });

    // Обновляем подписку в зависимости от результата платежа
    const updatedSubscription = await strapi.entityService.update('api::subscription.subscription', subscription.id, {
      data: {
        status: paymentResult.success ? 'active' : 'cancelled',
        payment_info: {
          payment_system: 'yukassa', // default
          external_id: paymentResult.payment_id,
          amount: price,
          status: paymentResult.success ? 'succeeded' : 'failed'
        }
      }
    });

    // Обновляем счетчик подписчиков автора
    if (paymentResult.success) {
      await this.updateAuthorSubscriberCount(data.author, 1);
    }

    return updatedSubscription;
  },

  /**
   * Отмена подписки
   * @param subscriptionId - ID подписки
   * @param reason - причина отмены
   * @returns обновленная подписка
   */
  async cancelSubscription(subscriptionId: number, reason?: string) {
    const subscription = await strapi.entityService.findOne('api::subscription.subscription', subscriptionId);

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const updatedSubscription = await strapi.entityService.update('api::subscription.subscription', subscriptionId, {
      data: {
        status: 'cancelled',
        cancelled_at: new Date(),
        cancellation_reason: reason,
        auto_renewal: false
      }
    });

    // Обновляем счетчик подписчиков автора
    await this.updateAuthorSubscriberCount(subscription.author.id, -1);

    return updatedSubscription;
  },

  /**
   * Возобновление подписки
   * @param subscriptionId - ID подписки
   * @returns обновленная подписка
   */
  async renewSubscription(subscriptionId: number) {
    const subscription = await strapi.entityService.findOne('api::subscription.subscription', subscriptionId);

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const startDate = new Date();
    const expirationDate = this.calculateExpirationDate(startDate, subscription.plan_type);

    const updatedSubscription = await strapi.entityService.update('api::subscription.subscription', subscriptionId, {
      data: {
        status: 'active',
        started_at: startDate,
        expires_at: expirationDate,
        cancelled_at: null,
        cancellation_reason: null,
        auto_renewal: true
      }
    });

    // Обновляем счетчик подписчиков автора
    await this.updateAuthorSubscriberCount(subscription.author.id, 1);

    return updatedSubscription;
  },

  /**
   * Расчет даты окончания подписки
   * @param startDate - дата начала
   * @param planType - тип плана
   * @returns дата окончания
   */
  calculateExpirationDate(startDate: Date, planType: string): Date {
    const expirationDate = new Date(startDate);

    switch (planType) {
      case 'monthly':
        expirationDate.setMonth(expirationDate.getMonth() + 1);
        break;
      case 'yearly':
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        break;
      case 'lifetime':
        expirationDate.setFullYear(expirationDate.getFullYear() + 100); // "Навсегда"
        break;
      default:
        throw new Error(`Unknown plan type: ${planType}`);
    }

    return expirationDate;
  },

  /**
   * Обработка платежа (заглушка для интеграции)
   * @param paymentData - данные платежа
   * @returns результат обработки
   */
  async processPayment(paymentData: any) {
    // Здесь будет реальная интеграция с платежными системами
    // Пока возвращаем успешный результат для тестирования
    return {
      success: true,
      payment_id: `payment_${Date.now()}`,
      message: 'Payment processed successfully'
    };
  },

  /**
   * Обновление счетчика подписчиков автора
   * @param authorId - ID автора
   * @param increment - изменение счетчика
   */
  async updateAuthorSubscriberCount(authorId: number, increment: number) {
    const author = await strapi.entityService.findOne('api::author.author', authorId);
    if (author) {
      const newCount = Math.max(0, author.subscriber_count + increment);
      await strapi.entityService.update('api::author.author', authorId, {
        data: { subscriber_count: newCount }
      });
    }
  },

  /**
   * Получение статистики подписок автора
   * @param authorId - ID автора
   * @returns статистика
   */
  async getAuthorStats(authorId: number) {
    const totalSubscriptions = await strapi.entityService.count('api::subscription.subscription', {
      filters: { author: authorId }
    });

    const activeSubscriptions = await strapi.entityService.count('api::subscription.subscription', {
      filters: { 
        author: authorId,
        status: 'active'
      }
    });

    const monthlyRevenue = await this.calculateMonthlyRevenue(authorId);
    const totalRevenue = await this.calculateTotalRevenue(authorId);

    return {
      totalSubscriptions,
      activeSubscriptions,
      monthlyRevenue,
      totalRevenue
    };
  },

  /**
   * Расчет месячного дохода автора
   * @param authorId - ID автора
   * @returns месячный доход
   */
  async calculateMonthlyRevenue(authorId: number): Promise<number> {
    const activeSubscriptions = await strapi.entityService.findMany('api::subscription.subscription', {
      filters: {
        author: authorId,
        status: 'active'
      }
    });

    return activeSubscriptions.reduce((total, sub) => {
      const monthlyPrice = sub.plan_type === 'yearly' ? sub.price / 12 : sub.price;
      return total + (sub.plan_type !== 'lifetime' ? monthlyPrice : 0);
    }, 0);
  },

  /**
   * Расчет общего дохода автора
   * @param authorId - ID автора
   * @returns общий доход
   */
  async calculateTotalRevenue(authorId: number): Promise<number> {
    const allSubscriptions = await strapi.entityService.findMany('api::subscription.subscription', {
      filters: { author: authorId }
    });

    return allSubscriptions.reduce((total, sub) => total + (sub.total_paid || 0), 0);
  }
})); 