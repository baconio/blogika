/**
 * comment service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::comment.comment', ({ strapi }) => ({
  /**
   * Проверка на спам в комментарии
   * @param content - текст комментария
   * @param authorIp - IP адрес автора
   * @returns true если комментарий подозрительный
   */
  isSpamComment(content: string, authorIp?: string): boolean {
    // Простые правила антиспама
    const spamWords = ['spam', 'casino', 'viagra', 'bitcoin', 'crypto'];
    const lowercaseContent = content.toLowerCase();
    
    // Проверка на спам-слова
    const hasSpamWords = spamWords.some(word => lowercaseContent.includes(word));
    
    // Проверка на слишком много ссылок
    const linkCount = (content.match(/https?:\/\//g) || []).length;
    const hasTooManyLinks = linkCount > 2;
    
    // Проверка на слишком много заглавных букв
    const uppercaseCount = (content.match(/[A-Z]/g) || []).length;
    const isScreaming = uppercaseCount > content.length * 0.7;
    
    return hasSpamWords || hasTooManyLinks || isScreaming;
  },

  /**
   * Автоматическая модерация комментария
   * @param commentData - данные комментария
   * @returns статус модерации
   */
  autoModerate(commentData: any): string {
    const { content, ip_address } = commentData;
    
    // Проверяем на спам
    if (this.isSpamComment(content, ip_address)) {
      return 'rejected';
    }
    
    // Проверяем длину комментария
    if (content.length < 10) {
      return 'pending';
    }
    
    // Автоматическое одобрение для нормальных комментариев
    return 'approved';
  },

  /**
   * Создание комментария с автоматической модерацией
   * @param data - данные комментария
   * @returns созданный комментарий
   */
  async createWithModeration(data: any) {
    // Автоматическая модерация
    const moderationStatus = this.autoModerate(data);
    
    const commentData = {
      ...data,
      moderation_status: moderationStatus,
      is_moderated: moderationStatus !== 'pending'
    };

    const comment = await strapi.entityService.create('api::comment.comment', {
      data: commentData
    });

    // Обновляем счетчик комментариев статьи только для одобренных
    if (moderationStatus === 'approved') {
      await this.updateArticleCommentsCount(data.article, 1);
    }

    return comment;
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
  },

  /**
   * Получение статистики комментариев
   * @param articleId - ID статьи
   * @returns статистика комментариев
   */
  async getCommentStats(articleId: number) {
    const total = await strapi.entityService.count('api::comment.comment', {
      filters: { article: articleId }
    });
    
    const approved = await strapi.entityService.count('api::comment.comment', {
      filters: { 
        article: articleId,
        moderation_status: 'approved'
      }
    });
    
    const pending = await strapi.entityService.count('api::comment.comment', {
      filters: { 
        article: articleId,
        moderation_status: 'pending'
      }
    });

    return {
      total,
      approved,
      pending,
      rejected: total - approved - pending
    };
  }
})); 