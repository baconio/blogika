/**
 * Контроллер для популярных/трендовых статей
 * Микромодуль отвечает только за получение популярных статей по различным метрикам
 * 
 * @module TrendingController
 * @responsibility Получение популярных статей (просмотры, лайки, комментарии)
 */

import type { Core } from '@strapi/strapi';

/**
 * Интерфейс для параметров трендинга
 */
interface TrendingParams {
  readonly timeframe: 'day' | 'week' | 'month' | 'all';
  readonly metric: 'views' | 'likes' | 'comments' | 'mixed';
  readonly limit: number;
  readonly categoryId?: number;
}

/**
 * Интерфейс для статьи с метриками
 */
interface ArticleWithMetrics {
  readonly id: number;
  readonly title: string;
  readonly views_count: number;
  readonly likes_count: number;
  readonly comments_count: number;
  readonly published_at: string;
}

/**
 * Получение даты начала для временного фрейма
 * 
 * @param timeframe - временной период
 * @returns дата начала периода
 */
const getTimeframeStart = (timeframe: TrendingParams['timeframe']): Date => {
  const now = new Date();
  
  switch (timeframe) {
    case 'day':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case 'week': 
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case 'month':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case 'all':
    default:
      return new Date(0); // Начало эпохи
  }
};

/**
 * Получение поля сортировки по метрике
 * 
 * @param metric - метрика для сортировки
 * @returns поле для сортировки
 */
const getSortField = (metric: TrendingParams['metric']): string => {
  switch (metric) {
    case 'views':
      return 'views_count';
    case 'likes': 
      return 'likes_count';
    case 'comments':
      return 'comments_count';
    case 'mixed':
    default:
      // Для смешанной метрики используем views_count как основу
      return 'views_count';
  }
};

/**
 * Создает экспорт для контроллера популярных статей
 * 
 * @param strapi - экземпляр Strapi
 * @returns объект с методами контроллера
 */
export const createTrendingController = (strapi: Core.Strapi) => ({
  /**
   * Получение популярных статей
   * 
   * @param ctx - контекст запроса
   * @returns список популярных статей
   */
  async findTrending(ctx: any) {
    const {
      timeframe = 'week',
      metric = 'mixed', 
      limit = 10,
      category
    } = ctx.query;

    const params: TrendingParams = {
      timeframe: timeframe as TrendingParams['timeframe'],
      metric: metric as TrendingParams['metric'],
      limit: Math.min(parseInt(String(limit)), 50), // Макс 50 статей
      categoryId: category ? parseInt(String(category)) : undefined
    };

    try {
      const startDate = getTimeframeStart(params.timeframe);
      const sortField = getSortField(params.metric);

      // Формируем фильтры
      const filters: any = {
        status: 'published',
        published_at: {
          $gte: startDate.toISOString()
        }
      };

      if (params.categoryId) {
        filters.category = params.categoryId;
      }

      const trendingArticles = await strapi.entityService.findMany(
        'api::article.article',
        {
          filters,
          populate: ['author', 'category', 'cover_image'],
          sort: { [sortField]: 'desc' },
          limit: params.limit
        }
      ) as ArticleWithMetrics[];

      return {
        data: trendingArticles,
        meta: {
          timeframe: params.timeframe,
          metric: params.metric,
          count: trendingArticles.length,
          period_start: startDate.toISOString()
        }
      };

    } catch (error) {
      strapi.log.error('Trending articles controller error:', error);
      return ctx.internalServerError('Failed to fetch trending articles');
    }
  }
});

export default createTrendingController; 