/**
 * tag controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::tag.tag', ({ strapi }) => ({
  /**
   * Получение тегов с статистикой использования
   * @param ctx - контекст запроса
   * @returns теги с актуальным usage_count
   */
  async findWithUsage(ctx) {
    const { data, meta } = await super.find(ctx);
    
    // Обновляем usage_count для каждого тега
    const tagsWithUsage = await Promise.all(
      data.map(async (tag) => {
        const usageCount = await strapi.entityService.count('api::article.article', {
          filters: { tags: tag.id }
        });
        
        // Обновляем usage_count если изменился
        if (tag.usage_count !== usageCount) {
          await strapi.entityService.update('api::tag.tag', tag.id, {
            data: { usage_count: usageCount }
          });
        }
        
        return {
          ...tag,
          usage_count: usageCount
        };
      })
    );
    
    return { data: tagsWithUsage, meta };
  }
})); 