/**
 * category controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::category.category', ({ strapi }) => ({
  // Кастомные методы контроллера можно добавить здесь
  // Например, получение категорий с количеством статей
  async findWithStats(ctx) {
    const { data, meta } = await super.find(ctx);
    
    // Добавляем статистику для каждой категории
    const categoriesWithStats = await Promise.all(
      data.map(async (category) => {
        const articlesCount = await strapi.entityService.count('api::article.article', {
          filters: { category: category.id }
        });
        
        return {
          ...category,
          articlesCount
        };
      })
    );
    
    return { data: categoriesWithStats, meta };
  }
})); 