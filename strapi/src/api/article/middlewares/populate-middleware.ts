/**
 * Middleware для автоматического populate связей статьи
 * Микромодуль отвечает только за автозаполнение связанных сущностей
 * 
 * @module PopulateMiddleware
 * @responsibility Автоматическое заполнение связей (author, category, tags, cover_image)
 */

import type { Core } from '@strapi/strapi';

/**
 * Конфигурация полей для автозаполнения
 * Immutable объект с четко определенными связями
 */
const POPULATE_FIELDS = {
  author: {
    populate: ['avatar', 'social_links']
  },
  category: {
    populate: ['icon']
  },
  tags: true,
  cover_image: true,
  seo_meta: {
    populate: ['og_image']
  }
} as const;

/**
 * Middleware для автоматического populate связей статьи
 * 
 * @param config - конфигурация middleware (не используется)
 * @param helpers - helpers от Strapi
 * @returns middleware функция
 * 
 * @example
 * // В routes:
 * middlewares: ['api::article.populate-middleware']
 */
export default (config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    // Применяем populate только для операций чтения
    if (ctx.request.method === 'GET') {
      // Мерджим существующие populate с нашими
      const existingPopulate = ctx.query?.populate || {};
      
      ctx.query = {
        ...ctx.query,
        populate: {
          ...existingPopulate,
          ...POPULATE_FIELDS
        }
      };
    }

    await next();
  };
}; 