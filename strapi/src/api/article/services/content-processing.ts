/**
 * Сервис для обработки контента статей
 * Микромодуль отвечает только за обработку текста (excerpt, очистка, форматирование)
 * 
 * @module ContentProcessingService
 * @responsibility Обработка и форматирование текстового контента статей
 */

/**
 * Интерфейс для результата извлечения excerpt
 */
interface ExcerptResult {
  readonly text: string;
  readonly wordCount: number;
  readonly isTruncated: boolean;
}

/**
 * Интерфейс для результата очистки HTML
 */
interface CleanHtmlResult {
  readonly cleanText: string;
  readonly originalLength: number;
  readonly cleanLength: number;
  readonly removedTags: readonly string[];
}

/**
 * Интерфейс для настроек обработки контента
 */
interface ContentProcessingOptions {
  readonly excerptLength: number;
  readonly allowedTags: readonly string[];
  readonly preserveFormatting: boolean;
}

/**
 * Настройки по умолчанию для обработки контента
 */
const DEFAULT_OPTIONS: ContentProcessingOptions = {
  excerptLength: 200,
  allowedTags: ['p', 'br', 'strong', 'em', 'a'],
  preserveFormatting: false
} as const;

/**
 * Удаляет HTML теги из текста
 * 
 * @param html - HTML строка для очистки
 * @param allowedTags - разрешенные теги (опционально)
 * @returns очищенный текст
 */
const stripHtmlTags = (
  html: string, 
  allowedTags: readonly string[] = []
): CleanHtmlResult => {
  if (!html || typeof html !== 'string') {
    return {
      cleanText: '',
      originalLength: 0,
      cleanLength: 0,
      removedTags: []
    };
  }

  const originalLength = html.length;
  let cleanText = html;
  const removedTags: string[] = [];

  // Если нет разрешенных тегов, удаляем все
  if (allowedTags.length === 0) {
    // Извлекаем все теги для статистики
    const tagMatches = html.match(/<[^>]+>/g) || [];
    removedTags.push(...tagMatches);
    
    // Удаляем все HTML теги
    cleanText = html.replace(/<[^>]*>/g, '');
  } else {
    // Удаляем только неразрешенные теги
    const allowedPattern = allowedTags.map(tag => `</?${tag}[^>]*>`).join('|');
    const allTagsPattern = /<[^>]+>/g;
    
    const allTags = html.match(allTagsPattern) || [];
    allTags.forEach(tag => {
      if (!new RegExp(allowedPattern, 'i').test(tag)) {
        removedTags.push(tag);
        cleanText = cleanText.replace(tag, '');
      }
    });
  }

  // Нормализуем пробелы
  cleanText = cleanText
    .replace(/\s+/g, ' ')
    .trim();

  return {
    cleanText,
    originalLength,
    cleanLength: cleanText.length,
    removedTags: [...new Set(removedTags)] // Убираем дубликаты
  };
};

/**
 * Извлекает excerpt из контента
 * 
 * @param content - полный контент статьи
 * @param maxLength - максимальная длина excerpt
 * @returns объект с excerpt и метаданными
 */
const extractExcerpt = (content: string, maxLength: number = 200): ExcerptResult => {
  if (!content || typeof content !== 'string') {
    return {
      text: '',
      wordCount: 0,
      isTruncated: false
    };
  }

  // Очищаем HTML теги
  const { cleanText } = stripHtmlTags(content);
  
  // Если текст короче лимита, возвращаем как есть
  if (cleanText.length <= maxLength) {
    const words = cleanText.trim().split(/\s+/).filter(Boolean);
    return {
      text: cleanText,
      wordCount: words.length,
      isTruncated: false
    };
  }

  // Обрезаем по длине, но стараемся не разрывать слова
  let excerpt = cleanText.substring(0, maxLength);
  const lastSpaceIndex = excerpt.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxLength * 0.8) {
    excerpt = excerpt.substring(0, lastSpaceIndex);
  }

  const words = excerpt.trim().split(/\s+/).filter(Boolean);

  return {
    text: excerpt.trim() + '...',
    wordCount: words.length,
    isTruncated: true
  };
};

/**
 * Нормализует контент статьи
 * 
 * @param content - исходный контент
 * @param options - настройки обработки
 * @returns нормализованный контент
 */
const normalizeContent = (
  content: string,
  options: Partial<ContentProcessingOptions> = {}
): string => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  if (!content || typeof content !== 'string') {
    return '';
  }

  let normalized = content;

  // Нормализуем переносы строк
  normalized = normalized.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Убираем лишние пробелы между тегами
  normalized = normalized.replace(/>\s+</g, '><');
  
  // Нормализуем множественные пробелы
  normalized = normalized.replace(/[ \t]+/g, ' ');
  
  // Убираем лишние переносы строк
  normalized = normalized.replace(/\n{3,}/g, '\n\n');

  return normalized.trim();
};

/**
 * Подсчитывает слова в тексте
 * 
 * @param text - текст для подсчета
 * @returns количество слов
 */
const countWords = (text: string): number => {
  if (!text || typeof text !== 'string') {
    return 0;
  }

  const { cleanText } = stripHtmlTags(text);
  const words = cleanText.trim().split(/\s+/).filter(Boolean);
  
  return words.length;
};

/**
 * Создает экспорт для сервиса обработки контента
 * 
 * @returns объект с методами сервиса
 */
export const createContentProcessingService = () => ({
  /**
   * Извлекает excerpt из контента статьи
   */
  extractExcerpt,

  /**
   * Очищает HTML теги из текста
   */
  stripHtmlTags,

  /**
   * Нормализует контент статьи
   */
  normalizeContent,

  /**
   * Подсчитывает количество слов
   */
  countWords,

  /**
   * Обрабатывает полный контент статьи
   * 
   * @param content - исходный контент
   * @param options - настройки обработки
   * @returns обработанный контент с метаданными
   */
  processArticleContent: (
    content: string,
    options: Partial<ContentProcessingOptions> = {}
  ) => {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    
    const normalizedContent = normalizeContent(content, opts);
    const excerpt = extractExcerpt(normalizedContent, opts.excerptLength);
    const wordCount = countWords(normalizedContent);
    const cleanResult = stripHtmlTags(normalizedContent, opts.allowedTags);

    return {
      content: normalizedContent,
      excerpt: excerpt.text,
      wordCount,
      metadata: {
        excerptWordCount: excerpt.wordCount,
        isTruncated: excerpt.isTruncated,
        originalLength: cleanResult.originalLength,
        cleanLength: cleanResult.cleanLength,
        removedTagsCount: cleanResult.removedTags.length
      }
    };
  }
});

export default createContentProcessingService; 