/**
 * Утилиты для обработки контента статей
 * @description Микромодуль для работы с контентом: время чтения, excerpt, обработка HTML
 */

export type Maybe<T> = T | undefined;

export interface ReadingTimeResult {
  readonly minutes: number;
  readonly words: number;
  readonly text: string;
}

export interface ExcerptOptions {
  readonly maxLength: number;
  readonly suffix: string;
}

/**
 * Рассчитывает время чтения статьи
 * @param content - HTML или текстовый контент статьи
 * @param wordsPerMinute - слов в минуту (по умолчанию 200 для русского языка)
 * @returns объект с временем чтения
 * @example
 * const result = calculateReadingTime('Длинный текст статьи...')
 * console.log(result.text) // "5 мин чтения"
 */
export const calculateReadingTime = (
  content: string,
  wordsPerMinute: number = 200
): ReadingTimeResult => {
  const cleanText = stripHtmlTags(content);
  const words = cleanText.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return {
    minutes,
    words: wordCount,
    text: `${minutes} мин чтения`
  };
};

/**
 * Генерирует краткое описание статьи (excerpt)
 * @param content - полный контент статьи
 * @param options - опции генерации excerpt
 * @returns сокращенный текст с суффиксом
 * @example
 * const excerpt = generateExcerpt('Очень длинная статья...', { maxLength: 150, suffix: '...' })
 */
export const generateExcerpt = (
  content: string,
  options: ExcerptOptions = { maxLength: 160, suffix: '...' }
): string => {
  const cleanText = stripHtmlTags(content).trim();
  
  if (cleanText.length <= options.maxLength) {
    return cleanText;
  }

  const truncated = cleanText.substring(0, options.maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + options.suffix;
  }
  
  return truncated + options.suffix;
};

/**
 * Удаляет HTML теги из контента
 * @param html - HTML строка
 * @returns чистый текст без тегов
 * @example
 * const text = stripHtmlTags('<p>Привет <strong>мир</strong>!</p>') // "Привет мир!"
 */
export const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
};

/**
 * Проверяет валидность HTML контента
 * @param content - HTML контент для проверки
 * @returns true если контент валидный
 * @example
 * const isValid = isValidHtmlContent('<p>Валидный контент</p>')
 */
export const isValidHtmlContent = (content: string): boolean => {
  if (!content || content.trim().length === 0) {
    return false;
  }

  // Базовая проверка на незакрытые теги
  const openTags = content.match(/<[^/][^>]*>/g) || [];
  const closeTags = content.match(/<\/[^>]*>/g) || [];
  
  return Math.abs(openTags.length - closeTags.length) <= 2; // Допускаем небольшие расхождения
};

/**
 * Извлекает первое изображение из HTML контента
 * @param htmlContent - HTML контент статьи
 * @returns URL первого изображения или undefined
 * @example
 * const imageUrl = extractFirstImage('<p>Текст</p><img src="/image.jpg" alt="test">')
 */
export const extractFirstImage = (htmlContent: string): Maybe<string> => {
  const imgMatch = htmlContent.match(/<img[^>]+src="([^"]+)"/);
  return imgMatch?.[1];
}; 