/**
 * Центральный экспорт всех API модулей блоговой платформы
 * Следует принципу именованных экспортов для микромодульной архитектуры
 */

// Базовый API клиент
export { apiClient } from './client';
export type { StrapiResponse, ApiError, RequestParams } from './client';

// Articles API
export { articlesApi } from './articles';

// Comments API
export { commentsApi } from './comments';

// Subscriptions API
export { subscriptionsApi } from './subscriptions';

// Categories API
export { categoriesApi } from './categories';

// Tags API
export { tagsApi } from './tags';

// Search API
export * as searchApi from './search';

// Analytics API
export * as analyticsApi from './analytics';

// Recommendations API
export * as recommendationsApi from './recommendations';

// Authentication API
export * as authApi from './auth';

/**
 * Объединенный API для удобного использования
 */
export const api = {
  articles: articlesApi,
  comments: commentsApi,
  subscriptions: subscriptionsApi,
  categories: categoriesApi,
  tags: tagsApi,
  search: searchApi,
  analytics: analyticsApi,
  recommendations: recommendationsApi,
  auth: authApi
} as const;

/**
 * Настройка аутентификации для всех API
 * @param token - JWT токен пользователя
 */
export const setAuthToken = (token: string | null): void => {
  apiClient.setAuthToken(token);
};

/**
 * Проверка доступности API
 * @returns статус API
 */
export const checkApiHealth = async (): Promise<{
  status: 'healthy' | 'error';
  message: string;
  timestamp: string;
}> => {
  try {
    await apiClient.get('/health-check');
    return {
      status: 'healthy',
      message: 'API is working correctly',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
}; 