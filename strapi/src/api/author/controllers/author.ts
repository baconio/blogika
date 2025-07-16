/**
 * author controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::author.author', ({ strapi }) => ({
  /**
   * Получение профиля автора с полной статистикой
   * @param ctx - контекст запроса
   * @returns профиль автора с аналитикой
   */
  async findWithStats(ctx) {
    const { id } = ctx.params;
    
    const author = await strapi.entityService.findOne('api::author.author', id, {
      populate: ['avatar', 'cover_image', 'social_links', 'user']
    });
    
    if (!author) {
      return ctx.notFound('Author not found');
    }
    
    // Подсчет статистики
    const articlesCount = await strapi.entityService.count('api::article.article', {
      filters: { author: id }
    });
    
    const publishedArticlesCount = await strapi.entityService.count('api::article.article', {
      filters: { 
        author: id,
        status: 'published'
      }
    });
    
    return {
      ...author,
      statistics: {
        articlesCount,
        publishedArticlesCount,
        subscriberCount: author.subscriber_count,
        totalEarnings: author.total_earnings
      }
    };
  },

  /**
   * Обновление доходов автора  
   * @param ctx - контекст запроса
   * @returns обновленный профиль автора
   */
  async updateEarnings(ctx) {
    const { id } = ctx.params;
    const { amount } = ctx.request.body;
    
    const author = await strapi.entityService.findOne('api::author.author', id);
    
    if (!author) {
      return ctx.notFound('Author not found');
    }
    
    const updatedAuthor = await strapi.entityService.update('api::author.author', id, {
      data: {
        total_earnings: author.total_earnings + amount
      }
    });
    
    return updatedAuthor;
  }
})); 