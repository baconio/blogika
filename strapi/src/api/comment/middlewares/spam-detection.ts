/**
 * Middleware для детекции спама в комментариях  
 * Микромодуль отвечает только за автоматическое обнаружение спама
 * 
 * @module SpamDetectionMiddleware
 * @responsibility Автоматическая детекция спама и установка статуса модерации
 */

import type { Core } from '@strapi/strapi';

/**
 * Интерфейс для данных комментария
 */
interface CommentData {
  readonly content: string;
  readonly ip_address?: string;
  readonly user_agent?: string;
}

/**
 * Результат проверки на спам
 */
interface SpamCheckResult {
  readonly isSpam: boolean;
  readonly confidence: number;
  readonly reasons: readonly string[];
}

/**
 * Список спам-слов для проверки
 */
const SPAM_KEYWORDS = [
  'casino', 'viagra', 'bitcoin', 'crypto', 'earn money',
  'free money', 'click here', 'limited offer', 'buy now'
] as const;

/**
 * Проверка контента на спам-слова
 * 
 * @param content - текст комментария
 * @returns результат проверки
 */
const checkSpamKeywords = (content: string): SpamCheckResult => {
  const lowercaseContent = content.toLowerCase();
  const foundKeywords = SPAM_KEYWORDS.filter(keyword => 
    lowercaseContent.includes(keyword)
  );
  
  return {
    isSpam: foundKeywords.length > 0,
    confidence: foundKeywords.length * 0.3,
    reasons: foundKeywords.length > 0 ? [`Found spam keywords: ${foundKeywords.join(', ')}`] : []
  };
};

/**
 * Проверка на избыточное количество ссылок
 * 
 * @param content - текст комментария  
 * @returns результат проверки
 */
const checkExcessiveLinks = (content: string): SpamCheckResult => {
  const linkRegex = /https?:\/\/[^\s]+/gi;
  const links = content.match(linkRegex) || [];
  const isSpam = links.length > 2;
  
  return {
    isSpam,
    confidence: isSpam ? 0.5 : 0,
    reasons: isSpam ? [`Too many links: ${links.length}`] : []
  };
};

/**
 * Проверка на избыточные заглавные буквы
 * 
 * @param content - текст комментария
 * @returns результат проверки  
 */
const checkExcessiveCaps = (content: string): SpamCheckResult => {
  const uppercaseCount = (content.match(/[A-Z]/g) || []).length;
  const isSpam = content.length > 10 && uppercaseCount > content.length * 0.6;
  
  return {
    isSpam,
    confidence: isSpam ? 0.4 : 0,
    reasons: isSpam ? ['Excessive uppercase letters'] : []
  };
};

/**
 * Комплексная проверка комментария на спам
 * 
 * @param data - данные комментария
 * @returns результат проверки на спам
 */
const detectSpam = (data: CommentData): SpamCheckResult => {
  const checks = [
    checkSpamKeywords(data.content),
    checkExcessiveLinks(data.content), 
    checkExcessiveCaps(data.content)
  ];
  
  const totalConfidence = checks.reduce((sum, check) => sum + check.confidence, 0);
  const allReasons = checks.flatMap(check => check.reasons);
  
  return {
    isSpam: totalConfidence > 0.7,
    confidence: Math.min(totalConfidence, 1),
    reasons: allReasons
  };
};

/**
 * Middleware для детекции спама в комментариях
 * 
 * @param config - конфигурация middleware
 * @param helpers - helpers от Strapi
 * @returns middleware функция
 * 
 * @example
 * // В routes:
 * middlewares: ['api::comment.spam-detection']
 */
export default (config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    // Применяем детекцию только для создания комментариев
    if (ctx.request.method === 'POST') {
      const commentData = ctx.request.body?.data as CommentData;
      
      if (commentData?.content) {
        const spamResult = detectSpam(commentData);
        
        // Если обнаружен спам, устанавливаем соответствующий статус
        if (spamResult.isSpam) {
          ctx.request.body.data = {
            ...ctx.request.body.data,
            moderation_status: 'rejected',
            is_moderated: true
          };
          
          // Логируем информацию о спаме
          strapi.log.warn('Spam detected in comment:', {
            confidence: spamResult.confidence,
            reasons: spamResult.reasons,
            ip: commentData.ip_address
          });
        } else {
          // Автоматически одобряем нормальные комментарии
          ctx.request.body.data = {
            ...ctx.request.body.data,
            moderation_status: 'approved',
            is_moderated: true
          };
        }
      }
    }

    await next();
  };
}; 