/**
 * Middleware для фильтрации комментариев по статусу модерации
 * Микромодуль отвечает только за фильтрацию одобренных комментариев
 * 
 * @module ModerationFilterMiddleware
 * @responsibility Автоматическая фильтрация комментариев по статусу модерации
 */

import type { Core } from '@strapi/strapi';

/**
 * Enum статусов модерации комментариев
 */
const MODERATION_STATUS = {
  APPROVED: 'approved',
  PENDING: 'pending', 
  REJECTED: 'rejected'
} as const;

/**
 * Интерфейс для пользователя с ролями
 */
interface UserWithRoles {
  readonly id: number;
  readonly role?: {
    readonly type: string;
  };
}

/**
 * Проверяет является ли пользователь модератором или админом
 * 
 * @param user - пользователь для проверки
 * @returns true если пользователь может видеть немодерированные комментарии
 */
const canViewUnmoderatedComments = (user?: UserWithRoles): boolean => {
  if (!user?.role) return false;
  
  const moderatorRoles = ['admin', 'moderator', 'author'];
  return moderatorRoles.includes(user.role.type);
};

/**
 * Добавляет фильтр модерации к запросу
 * 
 * @param ctx - контекст запроса
 * @param user - текущий пользователь
 */
const addModerationFilter = (ctx: any, user?: UserWithRoles): void => {
  // Для модераторов показываем все комментарии
  if (canViewUnmoderatedComments(user)) {
    return;
  }

  // Для обычных пользователей только одобренные
  const existingFilters = ctx.query?.filters || {};
  
  ctx.query = {
    ...ctx.query,
    filters: {
      ...existingFilters,
      moderation_status: MODERATION_STATUS.APPROVED
    }
  };
};

/**
 * Middleware для фильтрации комментариев по статусу модерации
 * 
 * @param config - конфигурация middleware
 * @param helpers - helpers от Strapi  
 * @returns middleware функция
 * 
 * @example
 * // В routes:
 * middlewares: ['api::comment.moderation-filter']
 */
export default (config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    // Применяем фильтр только для операций чтения
    if (ctx.request.method === 'GET') {
      const user = ctx.state?.user as UserWithRoles | undefined;
      addModerationFilter(ctx, user);
    }

    await next();
  };
}; 