/**
 * Middleware для подсчета просмотров статей
 * Микромодуль отвечает только за инкремент счетчика views_count
 * 
 * @module ViewsCounterMiddleware  
 * @responsibility Увеличение счетчика просмотров при чтении статьи
 */

import type { Core } from '@strapi/strapi';

/**
 * Интерфейс для IP адреса клиента
 */
interface ClientIP {
  readonly value: string;
}

/**
 * Интерфейс для статьи с счетчиком просмотров
 */
interface ArticleWithViews {
  readonly id: number;
  readonly views_count: number;
}

/**
 * Извлекает IP адрес клиента из запроса
 * 
 * @param ctx - контекст Koa
 * @returns IP адрес клиента
 */
const getClientIP = (ctx: any): ClientIP => {
  const ip = ctx.request.ip || 
             ctx.request.headers['x-forwarded-for'] || 
             ctx.request.headers['x-real-ip'] || 
             'unknown';
  
  return { value: String(ip).split(',')[0]?.trim() || 'unknown' };
};

/**
 * Проверяет валидность IP адреса (исключает локальные и тестовые)
 * 
 * @param ip - IP адрес для проверки
 * @returns true если IP валидный для подсчета
 */
const isValidIP = (ip: ClientIP): boolean => {
  const invalidPatterns = [
    '127.0.0.1',
    'localhost', 
    '::1',
    'unknown'
  ];
  
  return !invalidPatterns.includes(ip.value);
};

/**
 * Middleware для подсчета просмотров статьи
 * 
 * @param config - конфигурация middleware
 * @param helpers - helpers от Strapi
 * @returns middleware функция
 * 
 * @example
 * // В routes:
 * middlewares: ['api::article.views-counter'] 
 */
export default (config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    await next();

    // Увеличиваем счетчик только для успешных GET запросов к одиночной статье
    const isGetRequest = ctx.request.method === 'GET';
    const isSuccessful = ctx.response.status === 200;
    const hasArticleId = ctx.params?.id;
    
    if (isGetRequest && isSuccessful && hasArticleId) {
      const clientIP = getClientIP(ctx);
      
      // Пропускаем невалидные IP
      if (!isValidIP(clientIP)) {
        return;
      }

      try {
        // Получаем текущую статью
        const article = await strapi.entityService.findOne(
          'api::article.article', 
          ctx.params.id
        ) as ArticleWithViews | null;

        if (article) {
          // Инкрементируем счетчик просмотров
          await strapi.entityService.update('api::article.article', article.id, {
            data: {
              views_count: (article.views_count || 0) + 1
            }
          });
        }
      } catch (error) {
        // Логируем ошибку, но не блокируем ответ
        strapi.log.warn('Views counter middleware error:', error);
      }
    }
  };
}; 