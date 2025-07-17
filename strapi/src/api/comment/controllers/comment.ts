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

    const comment = await strapi.entityService.findOne('api::comment.comment', id, {
      populate: { article: true }
    });
    
    if (!comment) {
      return ctx.notFound('Comment not found');
    }

    // Сохраняем ID статьи для обновления счетчика
    const articleId = (comment as any).article?.id;

    const updatedComment = await strapi.entityService.update('api::comment.comment', id, {
      data: {
        moderation_status: status,
        is_moderated: true
      }
    });

    // Обновляем счетчик комментариев статьи
    if (articleId) {
      if (status === 'approved') {
        await strapi.service('api::comment.comment').updateArticleCommentsCount(articleId, 1);
      } else if (status === 'rejected' && comment.moderation_status === 'approved') {
        await strapi.service('api::comment.comment').updateArticleCommentsCount(articleId, -1);
      }
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

  // updateArticleCommentsCount moved to service
})); 