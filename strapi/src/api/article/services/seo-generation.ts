/**
 * Сервис для автоматической генерации SEO метатегов
 * Микромодуль отвечает только за создание SEO данных на основе контента статьи
 * 
 * @module SeoGenerationService
 * @responsibility Автоматическая генерация SEO метатегов и структурированных данных
 */

/**
 * Интерфейс для SEO метаданных
 */
interface SeoMetadata {
  readonly title: string;
  readonly description: string;
  readonly keywords: readonly string[];
  readonly canonical_url?: string;
  readonly og_title: string;
  readonly og_description: string;
  readonly og_type: string;
  readonly og_image?: string;
  readonly schema_type: string;
  readonly readability_score: number;
}

/**
 * Интерфейс для статьи с контентом
 */
interface ArticleContent {
  readonly title: string;
  readonly content: string;
  readonly excerpt?: string;
  readonly category?: {
    readonly name: string;
    readonly slug: string;
  };
  readonly tags?: readonly {
    readonly name: string;
  }[];
  readonly author?: {
    readonly display_name: string;
  };
  readonly cover_image?: {
    readonly url: string;
    readonly alternativeText?: string;
  };
}

/**
 * Интерфейс для настроек SEO генерации
 */
interface SeoGenerationOptions {
  readonly titleMaxLength: number;
  readonly descriptionMaxLength: number;
  readonly keywordsMaxCount: number;
  readonly baseUrl: string;
  readonly siteName: string;
}

/**
 * Настройки по умолчанию для SEO генерации
 */
const DEFAULT_SEO_OPTIONS: SeoGenerationOptions = {
  titleMaxLength: 60,
  descriptionMaxLength: 160,
  keywordsMaxCount: 10,
  baseUrl: 'https://blogika.ru',
  siteName: 'Новое поколение - Блоговая платформа'
} as const;

/**
 * Удаляет HTML теги из текста
 * 
 * @param html - HTML строка
 * @returns чистый текст
 */
const stripHtml = (html: string): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Генерирует SEO заголовок на основе заголовка статьи
 * 
 * @param title - исходный заголовок
 * @param maxLength - максимальная длина
 * @param siteName - название сайта
 * @returns оптимизированный SEO заголовок
 */
const generateSeoTitle = (
  title: string, 
  maxLength: number,
  siteName: string
): string => {
  if (!title) return siteName;

  const cleanTitle = stripHtml(title);
  const suffix = ` | ${siteName}`;
  const maxTitleLength = maxLength - suffix.length;

  if (cleanTitle.length <= maxTitleLength) {
    return `${cleanTitle}${suffix}`;
  }

  // Обрезаем заголовок, стараясь не разрывать слова
  let truncated = cleanTitle.substring(0, maxTitleLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxTitleLength * 0.7) {
    truncated = truncated.substring(0, lastSpaceIndex);
  }

  return `${truncated}...${suffix}`;
};

/**
 * Генерирует SEO описание на основе контента
 * 
 * @param content - контент статьи
 * @param excerpt - готовый excerpt (если есть)
 * @param maxLength - максимальная длина
 * @returns SEO описание
 */
const generateSeoDescription = (
  content: string,
  excerpt: string | undefined,
  maxLength: number
): string => {
  // Используем excerpt если есть
  if (excerpt) {
    const cleanExcerpt = stripHtml(excerpt);
    if (cleanExcerpt.length <= maxLength) {
      return cleanExcerpt;
    }
  }

  // Иначе генерируем из контента
  const cleanContent = stripHtml(content);
  if (!cleanContent) return '';

  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  // Обрезаем по длине, сохраняя целостность предложений
  let description = cleanContent.substring(0, maxLength);
  const lastSentenceEnd = Math.max(
    description.lastIndexOf('.'),
    description.lastIndexOf('!'),
    description.lastIndexOf('?')
  );

  if (lastSentenceEnd > maxLength * 0.6) {
    description = description.substring(0, lastSentenceEnd + 1);
  } else {
    const lastSpaceIndex = description.lastIndexOf(' ');
    if (lastSpaceIndex > maxLength * 0.8) {
      description = description.substring(0, lastSpaceIndex) + '...';
    }
  }

  return description;
};

/**
 * Извлекает ключевые слова из контента
 * 
 * @param content - контент статьи
 * @param title - заголовок статьи
 * @param tags - теги статьи
 * @param maxCount - максимальное количество ключевых слов
 * @returns массив ключевых слов
 */
const extractKeywords = (
  content: string,
  title: string,
  tags: readonly { readonly name: string }[] = [],
  maxCount: number
): readonly string[] => {
  const keywords = new Set<string>();

  // Добавляем теги как ключевые слова
  tags.forEach(tag => {
    if (tag.name && tag.name.trim()) {
      keywords.add(tag.name.toLowerCase().trim());
    }
  });

  // Извлекаем ключевые слова из заголовка
  const titleWords = stripHtml(title)
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3 && !/^(и|в|на|с|по|для|из|к|о|от|до|при)$/.test(word));

  titleWords.forEach(word => keywords.add(word));

  // Извлекаем частые слова из контента (базовый алгоритм)
  const cleanContent = stripHtml(content).toLowerCase();
  const contentWords = cleanContent
    .split(/\s+/)
    .filter(word => 
      word.length > 4 && 
      !/^(это|что|как|где|когда|почему|зачем|который|которая|которые)$/.test(word)
    );

  // Подсчитываем частоту слов
  const wordFreq = new Map<string, number>();
  contentWords.forEach(word => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  });

  // Добавляем самые частые слова
  Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, Math.max(0, maxCount - keywords.size))
    .forEach(([word]) => keywords.add(word));

  return Array.from(keywords).slice(0, maxCount);
};

/**
 * Генерирует каноническую ссылку
 * 
 * @param slug - slug статьи
 * @param baseUrl - базовый URL сайта
 * @returns каноническая ссылка
 */
const generateCanonicalUrl = (slug: string, baseUrl: string): string => {
  if (!slug || !baseUrl) return baseUrl;
  
  const cleanSlug = slug.replace(/^\/+|\/+$/g, '');
  return `${baseUrl}/article/${cleanSlug}`;
};

/**
 * Рассчитывает базовый показатель читаемости
 * 
 * @param content - контент для анализа
 * @returns оценка читаемости (0-100)
 */
const calculateReadabilityScore = (content: string): number => {
  const cleanContent = stripHtml(content);
  if (!cleanContent) return 0;

  const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = cleanContent.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((count, word) => {
    // Простой подсчет слогов для русского языка
    const vowels = (word.match(/[аеёиоуыэюя]/gi) || []).length;
    return count + Math.max(1, vowels);
  }, 0);

  if (sentences.length === 0 || words.length === 0) return 0;

  // Упрощенная формула читаемости
  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  const score = 100 - (avgWordsPerSentence * 1.5) - (avgSyllablesPerWord * 10);
  
  return Math.max(0, Math.min(100, Math.round(score)));
};

/**
 * Создает экспорт для сервиса генерации SEO
 * 
 * @returns объект с методами сервиса
 */
export const createSeoGenerationService = () => ({
  /**
   * Генерирует полные SEO метаданные для статьи
   * 
   * @param article - данные статьи
   * @param options - настройки генерации
   * @returns объект с SEO метаданными
   */
  generateSeoMetadata: (
    article: ArticleContent,
    options: Partial<SeoGenerationOptions> = {}
  ): SeoMetadata => {
    const opts = { ...DEFAULT_SEO_OPTIONS, ...options };

    if (!article || !article.title || !article.content) {
      return {
        title: opts.siteName,
        description: '',
        keywords: [],
        og_title: opts.siteName,
        og_description: '',
        og_type: 'website',
        schema_type: 'Article',
        readability_score: 0
      };
    }

    const title = generateSeoTitle(article.title, opts.titleMaxLength, opts.siteName);
    const description = generateSeoDescription(
      article.content, 
      article.excerpt, 
      opts.descriptionMaxLength
    );
    const keywords = extractKeywords(
      article.content,
      article.title,
      article.tags,
      opts.keywordsMaxCount
    );

    return {
      title,
      description,
      keywords,
      canonical_url: generateCanonicalUrl(article.title, opts.baseUrl),
      og_title: stripHtml(article.title),
      og_description: description,
      og_type: 'article',
      og_image: article.cover_image?.url,
      schema_type: 'Article',
      readability_score: calculateReadabilityScore(article.content)
    };
  },

  /**
   * Генерирует только SEO заголовок
   */
  generateSeoTitle,

  /**
   * Генерирует только SEO описание
   */
  generateSeoDescription,

  /**
   * Извлекает ключевые слова
   */
  extractKeywords,

  /**
   * Рассчитывает читаемость контента
   */
  calculateReadabilityScore,

  /**
   * Генерирует структурированные данные JSON-LD
   * 
   * @param article - данные статьи
   * @param baseUrl - базовый URL сайта
   * @returns объект структурированных данных
   */
  generateStructuredData: (article: ArticleContent, baseUrl: string) => {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": stripHtml(article.title),
      "description": article.excerpt || generateSeoDescription(article.content, undefined, 160),
      "author": {
        "@type": "Person",
        "name": article.author?.display_name || "Анонимный автор"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Новое поколение"
      },
      "image": article.cover_image?.url,
      "articleSection": article.category?.name,
      "keywords": extractKeywords(article.content, article.title, article.tags, 10).join(", "),
      "url": generateCanonicalUrl(article.title, baseUrl)
    };
  }
});

export default createSeoGenerationService; 