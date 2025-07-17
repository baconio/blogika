/**
 * Сервис для расчета времени чтения статей
 * Микромодуль отвечает только за вычисление времени чтения на основе контента
 * 
 * @module ReadingTimeService
 * @responsibility Расчет времени чтения статей с учетом различных факторов
 */

/**
 * Интерфейс для результата расчета времени чтения
 */
interface ReadingTimeResult {
  readonly minutes: number;
  readonly seconds: number;
  readonly totalSeconds: number;
  readonly wordCount: number;
  readonly readingSpeed: number;
  readonly formattedTime: string;
}

/**
 * Интерфейс для настроек расчета времени чтения
 */
interface ReadingTimeOptions {
  readonly wordsPerMinute: number;
  readonly includeImages: boolean;
  readonly imageReadingTime: number; // секунды на изображение
  readonly includeCodeBlocks: boolean;
  readonly codeBlockMultiplier: number; // множитель для кода
}

/**
 * Настройки по умолчанию для расчета времени чтения
 */
const DEFAULT_OPTIONS: ReadingTimeOptions = {
  wordsPerMinute: 200, // Среднестатистическая скорость чтения на русском
  includeImages: true,
  imageReadingTime: 12, // 12 секунд на просмотр изображения
  includeCodeBlocks: true,
  codeBlockMultiplier: 1.5 // Код читается на 50% медленнее
} as const;

/**
 * Удаляет HTML теги из текста для подсчета слов
 * 
 * @param html - HTML строка
 * @returns чистый текст
 */
const stripHtml = (html: string): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  return html
    .replace(/<[^>]*>/g, '') // Удаляем HTML теги
    .replace(/\s+/g, ' ') // Нормализуем пробелы
    .trim();
};

/**
 * Подсчитывает количество слов в тексте
 * 
 * @param text - текст для подсчета
 * @returns количество слов
 */
const countWords = (text: string): number => {
  if (!text || typeof text !== 'string') {
    return 0;
  }

  const cleanText = stripHtml(text);
  const words = cleanText.trim().split(/\s+/).filter(Boolean);
  
  return words.length;
};

/**
 * Подсчитывает количество изображений в контенте
 * 
 * @param content - HTML контент
 * @returns количество изображений
 */
const countImages = (content: string): number => {
  if (!content || typeof content !== 'string') {
    return 0;
  }

  // Ищем теги img и markdown изображения
  const imgTags = (content.match(/<img[^>]*>/gi) || []).length;
  const markdownImages = (content.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length;
  
  return imgTags + markdownImages;
};

/**
 * Подсчитывает количество блоков кода в контенте
 * 
 * @param content - HTML контент
 * @returns количество символов в блоках кода
 */
const countCodeContent = (content: string): number => {
  if (!content || typeof content !== 'string') {
    return 0;
  }

  let codeContent = 0;

  // HTML блоки кода
  const preBlocks = content.match(/<pre[^>]*>[\s\S]*?<\/pre>/gi) || [];
  const codeBlocks = content.match(/<code[^>]*>[\s\S]*?<\/code>/gi) || [];
  
  // Markdown блоки кода
  const markdownCodeBlocks = content.match(/```[\s\S]*?```/g) || [];
  const inlineCode = content.match(/`[^`]+`/g) || [];

  // Суммируем контент всех блоков кода
  [...preBlocks, ...codeBlocks, ...markdownCodeBlocks, ...inlineCode].forEach(block => {
    const cleanBlock = stripHtml(block.replace(/```|`/g, ''));
    codeContent += countWords(cleanBlock);
  });

  return codeContent;
};

/**
 * Форматирует время в читаемый вид
 * 
 * @param totalSeconds - общее время в секундах
 * @returns отформатированная строка времени
 */
const formatReadingTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);

  if (minutes === 0) {
    return `${seconds} сек`;
  }

  if (seconds === 0) {
    return `${minutes} мин`;
  }

  return `${minutes} мин ${seconds} сек`;
};

/**
 * Рассчитывает время чтения для контента
 * 
 * @param content - HTML контент статьи
 * @param options - настройки расчета
 * @returns объект с данными о времени чтения
 */
const calculateReadingTime = (
  content: string,
  options: Partial<ReadingTimeOptions> = {}
): ReadingTimeResult => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (!content || typeof content !== 'string') {
    return {
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      wordCount: 0,
      readingSpeed: opts.wordsPerMinute,
      formattedTime: '0 сек'
    };
  }

  // Подсчитываем обычные слова
  const regularWordCount = countWords(content);
  
  // Подсчитываем слова в коде (с учетом множителя)
  const codeWordCount = opts.includeCodeBlocks 
    ? countCodeContent(content) 
    : 0;
  
  // Общее количество слов с учетом сложности кода
  const totalWordCount = regularWordCount + (codeWordCount * opts.codeBlockMultiplier);
  
  // Время на чтение текста
  const readingTimeSeconds = (totalWordCount / opts.wordsPerMinute) * 60;
  
  // Время на просмотр изображений
  const imageCount = opts.includeImages ? countImages(content) : 0;
  const imageTimeSeconds = imageCount * opts.imageReadingTime;
  
  // Общее время
  const totalSeconds = readingTimeSeconds + imageTimeSeconds;
  
  // Минимальное время чтения - 30 секунд
  const adjustedTotalSeconds = Math.max(totalSeconds, 30);
  
  const minutes = Math.floor(adjustedTotalSeconds / 60);
  const seconds = Math.round(adjustedTotalSeconds % 60);

  return {
    minutes,
    seconds,
    totalSeconds: adjustedTotalSeconds,
    wordCount: regularWordCount,
    readingSpeed: opts.wordsPerMinute,
    formattedTime: formatReadingTime(adjustedTotalSeconds)
  };
};

/**
 * Получает примерную скорость чтения на основе языка
 * 
 * @param language - код языка (ru, en, etc.)
 * @returns скорость чтения в словах в минуту
 */
const getReadingSpeedByLanguage = (language: string = 'ru'): number => {
  const speedMap: Record<string, number> = {
    'ru': 200, // Русский
    'en': 250, // Английский
    'es': 220, // Испанский
    'fr': 215, // Французский
    'de': 200, // Немецкий
    'it': 230, // Итальянский
    'pt': 225, // Португальский
    'zh': 150, // Китайский
    'ja': 160, // Японский
    'ko': 170  // Корейский
  };

  return speedMap[language] || speedMap['ru'];
};

/**
 * Создает экспорт для сервиса расчета времени чтения
 * 
 * @returns объект с методами сервиса
 */
export const createReadingTimeService = () => ({
  /**
   * Рассчитывает время чтения для контента
   */
  calculateReadingTime,

  /**
   * Подсчитывает количество слов
   */
  countWords,

  /**
   * Подсчитывает количество изображений
   */
  countImages,

  /**
   * Получает скорость чтения по языку
   */
  getReadingSpeedByLanguage,

  /**
   * Форматирует время в читаемый вид
   */
  formatReadingTime,

  /**
   * Рассчитывает время чтения с автоопределением языка
   * 
   * @param content - контент статьи
   * @param language - язык контента
   * @param customOptions - дополнительные настройки
   * @returns результат расчета времени чтения
   */
  calculateReadingTimeAdvanced: (
    content: string,
    language: string = 'ru',
    customOptions: Partial<ReadingTimeOptions> = {}
  ): ReadingTimeResult => {
    const wordsPerMinute = getReadingSpeedByLanguage(language);
    const options = {
      wordsPerMinute,
      ...customOptions
    };

    return calculateReadingTime(content, options);
  }
});

export default createReadingTimeService; 