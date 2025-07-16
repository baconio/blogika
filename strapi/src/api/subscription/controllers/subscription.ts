/**
 * subscription controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::subscription.subscription', ({ strapi }) => ({
  /**
   * Создание новой подписки
   * @param ctx - контекст запроса
   * @returns созданная подписка
   */
  async createSubscription(ctx) {
    const { authorId, planType, paymentToken } = ctx.request.body;
    const subscriberId = ctx.state.user.id;

    // Проверяем существующую активную подписку
    const existingSubscription = await strapi.entityService.findMany('api::subscription.subscription', {
      filters: {
        subscriber: subscriberId,
        author: authorId,
        status: 'active'
      }
    });

    if (existingSubscription.length > 0) {
      return ctx.badRequest('Active subscription already exists');
    }

    // Получаем данные автора
    const author = await strapi.entityService.findOne('api::author.author', authorId);
    if (!author) {
      return ctx.notFound('Author not found');
    }

    // Создаем подписку
    const subscription = await strapi.service('api::subscription.subscription').createWithPayment({
      subscriber: subscriberId,
      author: authorId,
      plan_type: planType,
      price: author.subscription_price,
      payment_token: paymentToken
    });

    return subscription;
  },

  /**
   * Отмена подписки
   * @param ctx - контекст запроса
   * @returns обновленная подписка
   */
  async cancelSubscription(ctx) {
    const { id } = ctx.params;
    const { reason } = ctx.request.body;

    const subscription = await strapi.entityService.findOne('api::subscription.subscription', id, {
      populate: ['subscriber', 'author']
    });

    if (!subscription) {
      return ctx.notFound('Subscription not found');
    }

    // Проверяем права доступа
    if (subscription.subscriber.id !== ctx.state.user.id) {
      return ctx.forbidden('Access denied');
    }

    const cancelledSubscription = await strapi.service('api::subscription.subscription').cancelSubscription(id, reason);

    return cancelledSubscription;
  },

  /**
   * Возобновление подписки
   * @param ctx - контекст запроса
   * @returns обновленная подписка
   */
  async renewSubscription(ctx) {
    const { id } = ctx.params;

    const subscription = await strapi.entityService.findOne('api::subscription.subscription', id);

    if (!subscription) {
      return ctx.notFound('Subscription not found');
    }

    if (subscription.status !== 'cancelled') {
      return ctx.badRequest('Only cancelled subscriptions can be renewed');
    }

    const renewedSubscription = await strapi.service('api::subscription.subscription').renewSubscription(id);

    return renewedSubscription;
  },

  /**
   * Получение подписок пользователя
   * @param ctx - контекст запроса
   * @returns подписки пользователя
   */
  async findUserSubscriptions(ctx) {
    const userId = ctx.state.user.id;
    const { status } = ctx.query;

    const filters = {
      subscriber: userId
    };

    if (status) {
      filters.status = status;
    }

    const subscriptions = await strapi.entityService.findMany('api::subscription.subscription', {
      filters,
      populate: ['author.user', 'author.avatar', 'payment_info'],
      sort: { createdAt: 'desc' }
    });

    return subscriptions;
  },

  /**
   * Получение подписчиков автора
   * @param ctx - контекст запроса
   * @returns подписчики автора
   */
  async findAuthorSubscribers(ctx) {
    const { authorId } = ctx.params;
    const { status = 'active' } = ctx.query;

    const subscriptions = await strapi.entityService.findMany('api::subscription.subscription', {
      filters: {
        author: authorId,
        status
      },
      populate: ['subscriber'],
      sort: { createdAt: 'desc' }
    });

    // Возвращаем только данные подписчиков
    const subscribers = subscriptions.map(sub => ({
      id: sub.id,
      subscriber: sub.subscriber,
      plan_type: sub.plan_type,
      started_at: sub.started_at,
      total_paid: sub.total_paid
    }));

    return subscribers;
  },

  /**
   * Статистика подписок для автора
   * @param ctx - контекст запроса
   * @returns статистика подписок
   */
  async getSubscriptionStats(ctx) {
    const { authorId } = ctx.params;

    const stats = await strapi.service('api::subscription.subscription').getAuthorStats(authorId);

    return stats;
  }
})); 