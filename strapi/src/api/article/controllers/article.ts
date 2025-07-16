/**
 * article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  /**
   * Поиск статей с фильтрами и сортировкой
   * @param ctx - контекст запроса
   * @returns отфильтрованные статьи
   */
  async findWithFilters(ctx) {
    const { category, author, status, featured, limit = 10 } = ctx.query;

    const filters = {};
    if (category) filters.category = category;
    if (author) filters.author = author;
    if (status) filters.status = status;
    if (featured !== undefined) filters.is_featured = featured === 'true';

    const articles = await strapi.entityService.findMany('api::article.article', {
      filters,
      populate: ['author', 'category', 'tags', 'cover_image'],
      limit: parseInt(limit),
      sort: { createdAt: 'desc' }
    });

    return articles;
  },

  /**
   * Получение популярных статей
   * @param ctx - контекст запроса
   * @returns статьи отсортированные по популярности
   */
  async findTrending(ctx) {
    const { limit = 10 } = ctx.query;

    const articles = await strapi.entityService.findMany('api::article.article', {
      filters: { status: 'published' },
      populate: ['author', 'category', 'cover_image'],
      limit: parseInt(limit),
      sort: { views_count: 'desc', likes_count: 'desc' }
    });

    return articles;
  },

  /**
   * Увеличение счетчика просмотров
   * @param ctx - контекст запроса
   * @returns обновленная статья
   */
  async incrementViews(ctx) {
    const { id } = ctx.params;

    const article = await strapi.entityService.findOne('api::article.article', id);
    
    if (!article) {
      return ctx.notFound('Article not found');
    }

    const updatedArticle = await strapi.entityService.update('api::article.article', id, {
      data: {
        views_count: article.views_count + 1
      }
    });

    return updatedArticle;
  },

  /**
   * Лайк/дизлайк статьи
   * @param ctx - контекст запроса
   * @returns обновленная статья
   */
  async toggleLike(ctx) {
    const { id } = ctx.params;
    const { action } = ctx.request.body; // 'like' or 'unlike'

    const article = await strapi.entityService.findOne('api::article.article', id);
    
    if (!article) {
      return ctx.notFound('Article not found');
    }

    const increment = action === 'like' ? 1 : -1;
    const newCount = Math.max(0, article.likes_count + increment);

    const updatedArticle = await strapi.entityService.update('api::article.article', id, {
      data: {
        likes_count: newCount
      }
    });

    return updatedArticle;
  }
})); 