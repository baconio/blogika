/**
 * Утилиты для генерации SEO метатегов
 * @description Микромодуль для создания SEO-оптимизированных метатегов
 */

export type Maybe<T> = T | undefined;

export interface SeoMeta {
  readonly title: string;
  readonly description: string;
  readonly keywords?: string;
  readonly ogImage?: string;
  readonly canonicalUrl?: string;
}

export interface ArticleSeoData {
  readonly title: string;
  readonly content: string;
  readonly excerpt?: string;
  readonly author: string;
  readonly publishedAt: Date;
  readonly coverImage?: string;
  readonly tags?: readonly string[];
}

export interface SeoConfig {
  readonly siteName: string;
  readonly siteUrl: string;
  readonly defaultTitle: string;
  readonly defaultDescription: string;
  readonly defaultImage: string;
  readonly twitterHandle?: string;
}

/**
 * Генерирует SEO метатеги для статьи
 * @param article - данные статьи
 * @param config - конфигурация сайта
 * @returns объект с SEO метатегами
 * @example
 * const seo = generateArticleSeo(article, siteConfig)
 * console.log(seo.title) // "Заголовок статьи | Название сайта"
 */
export const generateArticleSeo = (
  article: ArticleSeoData,
  config: SeoConfig
): SeoMeta => {
  const title = `${article.title} | ${config.siteName}`;
  const description = article.excerpt || generateDescription(article.content);
  const keywords = article.tags?.join(', ');
  const canonicalUrl = `${config.siteUrl}/articles/${generateSlug(article.title)}`;

  return {
    title: truncateTitle(title),
    description: truncateDescription(description),
    keywords,
    ogImage: article.coverImage || config.defaultImage,
    canonicalUrl
  };
};

/**
 * Генерирует структурированные данные для статьи
 * @param article - данные статьи
 * @param config - конфигурация сайта
 * @returns JSON-LD структурированные данные
 * @example
 * const structuredData = generateArticleStructuredData(article, config)
 */
export const generateArticleStructuredData = (
  article: ArticleSeoData,
  config: SeoConfig
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || generateDescription(article.content),
    image: article.coverImage || config.defaultImage,
    author: {
      '@type': 'Person',
      name: article.author
    },
    publisher: {
      '@type': 'Organization',
      name: config.siteName,
      url: config.siteUrl
    },
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.publishedAt.toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${config.siteUrl}/articles/${generateSlug(article.title)}`
    }
  };
};

/**
 * Генерирует мета-описание из контента
 * @param content - HTML контент статьи
 * @param maxLength - максимальная длина описания
 * @returns сгенерированное описание
 * @example
 * const description = generateDescription('<p>Длинный контент статьи...</p>')
 */
export const generateDescription = (
  content: string,
  maxLength: number = 160
): string => {
  const cleanText = content
    .replace(/<[^>]*>/g, '') // Удаляем HTML теги
    .replace(/\s+/g, ' ') // Нормализуем пробелы
    .trim();

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  const truncated = cleanText.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
};

/**
 * Генерирует SEO-дружественный slug из заголовка
 * @param title - заголовок для преобразования
 * @returns URL-безопасный slug
 * @example
 * generateSlug('Как создать блог на Next.js?') // "kak-sozdat-blog-na-nextjs"
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[а-яё]/g, (char) => transliterate(char))
    .replace(/[^a-z0-9\s-]/g, '') // Удаляем специальные символы
    .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
    .replace(/-+/g, '-') // Удаляем дублирующиеся дефисы
    .trim();
};

/**
 * Транслитерация русских символов
 * @param char - русский символ
 * @returns латинский эквивалент
 */
const transliterate = (char: string): string => {
  const map: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  
  return map[char] || char;
};

/**
 * Обрезает заголовок до рекомендуемой длины для SEO
 * @param title - исходный заголовок
 * @param maxLength - максимальная длина (по умолчанию 60)
 * @returns обрезанный заголовок
 */
export const truncateTitle = (title: string, maxLength: number = 60): string => {
  if (title.length <= maxLength) {
    return title;
  }
  
  return title.substring(0, maxLength - 3) + '...';
};

/**
 * Обрезает описание до рекомендуемой длины для SEO
 * @param description - исходное описание
 * @param maxLength - максимальная длина (по умолчанию 160)
 * @returns обрезанное описание
 */
export const truncateDescription = (
  description: string, 
  maxLength: number = 160
): string => {
  if (description.length <= maxLength) {
    return description;
  }
  
  const truncated = description.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
}; 