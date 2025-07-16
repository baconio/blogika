/**
 * article service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::article.article', ({ strapi }) => ({
  /**
   * Расчет времени чтения статьи
   * @param content - контент статьи
   * @param wordsPerMinute - слов в минуту (по умолчанию 200)
   * @returns время чтения в минутах
   */
  calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
    const plainText = content.replace(/<[^>]*>/g, ''); // Удаляем HTML теги
    const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  },

  /**
   * Генерация excerpt из контента
   * @param content - контент статьи
   * @param maxLength - максимальная длина (по умолчанию 300)
   * @returns excerpt
   */
  generateExcerpt(content: string, maxLength: number = 300): string {
    const plainText = content.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) {
      return plainText;
    }
    
    const trimmed = plainText.substring(0, maxLength);
    const lastSpaceIndex = trimmed.lastIndexOf(' ');
    
    return lastSpaceIndex > 0 
      ? trimmed.substring(0, lastSpaceIndex) + '...'
      : trimmed + '...';
  },

  /**
   * Обновление статьи с автоматическим расчетом полей
   * @param id - ID статьи
   * @param data - данные для обновления
   * @returns обновленная статья
   */
  async updateWithCalculations(id: number, data: any) {
    // Автоматический расчет reading_time если контент изменился
    if (data.content) {
      data.reading_time = this.calculateReadingTime(data.content);
      
      // Генерация excerpt если не предоставлен
      if (!data.excerpt) {
        data.excerpt = this.generateExcerpt(data.content);
      }
    }

    return await strapi.entityService.update('api::article.article', id, {
      data
    });
  },

  /**
   * Создание статьи с автоматическим расчетом полей
   * @param data - данные статьи
   * @returns созданная статья
   */
  async createWithCalculations(data: any) {
    // Автоматический расчет reading_time
    if (data.content) {
      data.reading_time = this.calculateReadingTime(data.content);
      
      // Генерация excerpt если не предоставлен
      if (!data.excerpt) {
        data.excerpt = this.generateExcerpt(data.content);
      }
    }

    return await strapi.entityService.create('api::article.article', {
      data
    });
  }
})); 