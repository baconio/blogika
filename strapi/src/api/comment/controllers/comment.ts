/**
 * comment controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::comment.comment', ({ strapi }) => ({
  /**
   * Получение комментариев статьи с вложенными ответами
   * @param ctx - контекст запроса  
   * @returns комментарии с древовидной структурой
   */
  async findByArticle(ctx) {
    const { articleId } = ctx.params;
    const { sort = 'createdAt:desc' } = ctx.query;

    // Получаем только топ-уровневые комментарии (без parent)
    const topLevelComments = await strapi.entityService.findMany('api::comment.comment', {
      filters: { 
        article: articleId,
        parent: null,
        moderation_status: 'approved'
      },
      populate: ['author', 'replies.author'],
      sort: [sort]
    });

    return topLevelComments;
  },

  /**
   * Модерация комментария
   * @param ctx - контекст запроса
   * @returns обновленный комментарий
   */
  async moderate(ctx) {
    const { id } = ctx.params;
    const { status, reason } = ctx.request.body;

    const comment = await strapi.entityService.findOne('api::comment.comment', id);
    
    if (!comment) {
      return ctx.notFound('Comment not found');
    }

    const updatedComment = await strapi.entityService.update('api::comment.comment', id, {
      data: {
        moderation_status: status,
        is_moderated: true
      }
    });

    // Обновляем счетчик комментариев статьи
    if (status === 'approved') {
      await this.updateArticleCommentsCount(comment.article.id, 1);
    } else if (status === 'rejected' && comment.moderation_status === 'approved') {
      await this.updateArticleCommentsCount(comment.article.id, -1);
    }

    return updatedComment;
  },

  /**
   * Лайк комментария
   * @param ctx - контекст запроса
   * @returns обновленный комментарий
   */
  async toggleLike(ctx) {
    const { id } = ctx.params;
    const { action } = ctx.request.body;

    const comment = await strapi.entityService.findOne('api::comment.comment', id);
    
    if (!comment) {
      return ctx.notFound('Comment not found');
    }

    const increment = action === 'like' ? 1 : -1;
    const newCount = Math.max(0, comment.likes_count + increment);

    const updatedComment = await strapi.entityService.update('api::comment.comment', id, {
      data: {
        likes_count: newCount
      }
    });

    return updatedComment;
  },

  /**
   * Обновление счетчика комментариев статьи
   * @param articleId - ID статьи
   * @param increment - изменение счетчика
   */
  async updateArticleCommentsCount(articleId: number, increment: number) {
    const article = await strapi.entityService.findOne('api::article.article', articleId);
    if (article) {
      const newCount = Math.max(0, article.comments_count + increment);
      await strapi.entityService.update('api::article.article', articleId, {
        data: { comments_count: newCount }
      });
    }
  }
})); 