/**
 * Middleware для контроля доступа к подпискам
 * Микромодуль отвечает только за проверку прав доступа к операциям с подписками
 * 
 * @module AccessControlMiddleware
 * @responsibility Контроль доступа к операциям с подписками на основе ролей
 */

import type { Core } from '@strapi/strapi';

/**
 * Интерфейс для пользователя с ролями
 */
interface AuthenticatedUser {
  readonly id: number;
  readonly role?: {
    readonly type: string;
  };
}

/**
 * Интерфейс для подписки с данными владельца
 */
interface SubscriptionWithOwner {
  readonly id: number;
  readonly subscriber?: {
    readonly id: number;
  };
  readonly author?: {
    readonly id: number;
  };
}

/**
 * Проверяет является ли пользователь администратором
 * 
 * @param user - пользователь для проверки
 * @returns true если пользователь админ
 */
const isAdmin = (user?: AuthenticatedUser): boolean => {
  return user?.role?.type === 'admin';
};

/**
 * Проверяет права пользователя на операцию с подпиской
 * 
 * @param user - текущий пользователь
 * @param subscription - подписка для проверки
 * @param operation - тип операции
 * @returns true если доступ разрешен
 */
const hasAccessToSubscription = (
  user: AuthenticatedUser, 
  subscription: SubscriptionWithOwner,
  operation: 'read' | 'update' | 'delete'
): boolean => {
  // Администраторы могут все
  if (isAdmin(user)) {
    return true;
  }

  // Подписчики могут работать со своими подписками
  if (subscription.subscriber?.id === user.id) {
    return true;
  }

  // Авторы могут читать свои подписки, но не изменять
  if (subscription.author?.id === user.id && operation === 'read') {
    return true;
  }

  return false;
};

/**
 * Добавляет фильтр для доступа к подпискам
 * 
 * @param ctx - контекст запроса
 * @param user - текущий пользователь
 */
const addAccessFilter = (ctx: any, user: AuthenticatedUser): void => {
  // Администраторы видят все
  if (isAdmin(user)) {
    return;
  }

  // Обычные пользователи видят только свои подписки
  const existingFilters = ctx.query?.filters || {};
  
  ctx.query = {
    ...ctx.query,
    filters: {
      ...existingFilters,
      $or: [
        { subscriber: user.id },
        { 'author.user': user.id }
      ]
    }
  };
};

/**
 * Middleware для контроля доступа к подпискам
 * 
 * @param config - конфигурация middleware
 * @param helpers - helpers от Strapi
 * @returns middleware функция
 * 
 * @example
 * // В routes:
 * middlewares: ['api::subscription.access-control']
 */
export default (config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    const user = ctx.state?.user as AuthenticatedUser;
    
    // Требуем аутентификации для всех операций
    if (!user) {
      return ctx.unauthorized('Authentication required');
    }

    const method = ctx.request.method;
    const subscriptionId = ctx.params?.id;

    // Для операций со списком подписок - добавляем фильтр
    if (method === 'GET' && !subscriptionId) {
      addAccessFilter(ctx, user);
    }

    // Для операций с конкретной подпиской - проверяем права
    if (subscriptionId && ['GET', 'PUT', 'DELETE'].includes(method)) {
      try {
        const subscription = await strapi.entityService.findOne(
          'api::subscription.subscription', 
          subscriptionId,
          {
            populate: ['subscriber', 'author']
          }
        ) as SubscriptionWithOwner | null;

        if (!subscription) {
          return ctx.notFound('Subscription not found');
        }

        const operation = method === 'GET' ? 'read' : 
                         method === 'PUT' ? 'update' : 'delete';

        if (!hasAccessToSubscription(user, subscription, operation)) {
          return ctx.forbidden('Access denied');
        }
      } catch (error) {
        strapi.log.error('Access control middleware error:', error);
        return ctx.internalServerError('Access validation failed');
      }
    }

    await next();
  };
}; 