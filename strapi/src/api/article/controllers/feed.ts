/**
 * Контроллер для персонализированной ленты статей
 * Микромодуль отвечает только за генерацию ленты на основе подписок и предпочтений
 * 
 * @module FeedController
 * @responsibility Создание персонализированной ленты статей для пользователей
 */

import type { Core } from '@strapi/strapi';

/**
 * Интерфейс для параметров ленты
 */
interface FeedParams {
  readonly userId: number;
  readonly limit: number;
  readonly offset: number;
  readonly includeFollowing: boolean;
  readonly includeRecommended: boolean;
}

/**
 * Интерфейс для пользователя с подписками
 */
interface UserWithSubscriptions {
  readonly id: number;
  readonly subscriptions: readonly {
    readonly author: {
      readonly id: number;
    };
  }[];
}

/**
 * Получение ID авторов на которых подписан пользователь
 * 
 * @param strapi - экземпляр Strapi
 * @param userId - ID пользователя
 * @returns массив ID авторов
 */
const getUserFollowedAuthors = async (
  strapi: Core.Strapi, 
  userId: number
): Promise<readonly number[]> => {
  try {
    const subscriptions = await strapi.entityService.findMany(
      'api::subscription.subscription',
      {
        filters: {
          subscriber: { id: userId },
          status: 'active'
        },
        populate: ['author']
      }
    );

    return subscriptions.map((sub: any) => sub.author?.id).filter(Boolean);
  } catch (error) {
    strapi.log.error('Error fetching followed authors:', error);
    return [];
  }
};

/**
 * Получение статей от подписанных авторов
 * 
 * @param strapi - экземпляр Strapi
 * @param authorIds - массив ID авторов
 * @param limit - количество статей
 * @returns статьи от подписанных авторов
 */
const getFollowingFeed = async (
  strapi: Core.Strapi,
  authorIds: readonly number[],
  limit: number
): Promise<readonly any[]> => {
  if (authorIds.length === 0) return [];

  try {
    return await strapi.entityService.findMany('api::article.article', {
      filters: {
        $or: authorIds.map(id => ({ author: { id } })),
        status: 'published'
      },
      populate: ['author', 'category', 'cover_image'],
      sort: { publishedAt: 'desc' },
      limit
    });
  } catch (error) {
    strapi.log.error('Error fetching following feed:', error);
    return [];
  }
};

/**
 * Получение рекомендованных статей
 * 
 * @param strapi - экземпляр Strapi  
 * @param excludeAuthorIds - ID авторов для исключения
 * @param limit - количество статей
 * @returns рекомендованные статьи
 */
const getRecommendedFeed = async (
  strapi: Core.Strapi,
  excludeAuthorIds: readonly number[],
  limit: number
): Promise<readonly any[]> => {
  try {
    const filters: any = {
      status: 'published',
      is_featured: true
    };

    // Исключаем авторов на которых уже подписан пользователь
    if (excludeAuthorIds.length > 0) {
      filters.author = { $notIn: excludeAuthorIds };
    }

    return await strapi.entityService.findMany('api::article.article', {
      filters,
      populate: ['author', 'category', 'cover_image'],
      sort: { views_count: 'desc', published_at: 'desc' },
      limit
    });
  } catch (error) {
    strapi.log.error('Error fetching recommended feed:', error);
    return [];
  }
};

/**
 * Объединение и сортировка статей из разных источников
 * 
 * @param followingArticles - статьи от подписанных авторов
 * @param recommendedArticles - рекомендованные статьи
 * @param limit - финальный лимит статей
 * @returns объединенный и отсортированный массив статей
 */
const mergeFeedSources = (
  followingArticles: readonly any[],
  recommendedArticles: readonly any[],
  limit: number
): readonly any[] => {
  // Объединяем массивы и убираем дубликаты по ID
  const allArticles = [...followingArticles, ...recommendedArticles];
  const uniqueArticles = allArticles.filter(
    (article, index, arr) => 
      arr.findIndex(a => a.id === article.id) === index
  );

  // Сортируем по дате публикации (новые первые)
  return uniqueArticles
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, limit);
};

/**
 * Создает экспорт для контроллера персонализированной ленты
 * 
 * @param strapi - экземпляр Strapi
 * @returns объект с методами контроллера
 */
export const createFeedController = (strapi: Core.Strapi) => ({
  /**
   * Получение персонализированной ленты статей
   * 
   * @param ctx - контекст запроса
   * @returns персонализированная лента статей
   */
  async getPersonalizedFeed(ctx: any) {
    const user = ctx.state?.user;
    
    if (!user) {
      return ctx.unauthorized('Authentication required for personalized feed');
    }

    const {
      limit = 20,
      offset = 0,
      include_following = true,
      include_recommended = true
    } = ctx.query;

    const params: FeedParams = {
      userId: user.id,
      limit: Math.min(parseInt(String(limit)), 100), // Макс 100 статей
      offset: parseInt(String(offset)),
      includeFollowing: include_following === 'true',
      includeRecommended: include_recommended === 'true'
    };

    try {
      const followedAuthors = await getUserFollowedAuthors(strapi, params.userId);
      
      let followingArticles: readonly any[] = [];
      let recommendedArticles: readonly any[] = [];

      // Получаем статьи от подписанных авторов
      if (params.includeFollowing && followedAuthors.length > 0) {
        followingArticles = await getFollowingFeed(
          strapi, 
          followedAuthors, 
          Math.ceil(params.limit * 0.7) // 70% от лимита
        );
      }

      // Получаем рекомендованные статьи
      if (params.includeRecommended) {
        recommendedArticles = await getRecommendedFeed(
          strapi,
          followedAuthors,
          Math.ceil(params.limit * 0.3) // 30% от лимита
        );
      }

      // Объединяем и сортируем результаты
      const feedArticles = mergeFeedSources(
        followingArticles,
        recommendedArticles,
        params.limit
      );

      return {
        data: feedArticles.slice(params.offset, params.offset + params.limit),
        meta: {
          total: feedArticles.length,
          offset: params.offset,
          limit: params.limit,
          followed_authors_count: followedAuthors.length,
          sources: {
            following: followingArticles.length,
            recommended: recommendedArticles.length
          }
        }
      };

    } catch (error) {
      strapi.log.error('Personalized feed controller error:', error);
      return ctx.internalServerError('Failed to generate personalized feed');
    }
  }
});

export default createFeedController; 