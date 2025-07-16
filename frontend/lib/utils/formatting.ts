/**
 * Утилиты для форматирования дат, чисел и текста
 * @description Микромодуль для локализованного форматирования данных
 */

export type Maybe<T> = T | undefined;

export interface FormatDateOptions {
  readonly includeTime?: boolean;
  readonly relative?: boolean;
  readonly format?: 'short' | 'medium' | 'long';
}

export interface FormatNumberOptions {
  readonly currency?: string;
  readonly minimumFractionDigits?: number;
  readonly maximumFractionDigits?: number;
}

/**
 * Форматирует дату для русской локали
 * @param date - дата для форматирования
 * @param options - опции форматирования
 * @returns отформатированную строку даты
 * @example
 * formatDate(new Date(), { format: 'medium' }) // "15 янв 2024"
 * formatDate(new Date(), { relative: true }) // "2 часа назад"
 */
export const formatDate = (
  date: Date | string,
  options: FormatDateOptions = {}
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Неверная дата';
  }

  if (options.relative) {
    return getRelativeTime(dateObj);
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: options.format === 'short' ? 'short' : 'long',
    day: 'numeric'
  };

  if (options.includeTime) {
    formatOptions.hour = '2-digit';
    formatOptions.minute = '2-digit';
  }

  return new Intl.DateTimeFormat('ru-RU', formatOptions).format(dateObj);
};

/**
 * Возвращает относительное время (например, "2 часа назад")
 * @param date - дата для сравнения с текущей
 * @returns строку относительного времени
 * @example
 * getRelativeTime(new Date(Date.now() - 3600000)) // "1 час назад"
 */
export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'только что';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${pluralize(diffInMinutes, 'минуту', 'минуты', 'минут')} назад`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${pluralize(diffInHours, 'час', 'часа', 'часов')} назад`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${pluralize(diffInDays, 'день', 'дня', 'дней')} назад`;
  }

  return formatDate(date, { format: 'medium' });
};

/**
 * Форматирует число для русской локали
 * @param value - число для форматирования
 * @param options - опции форматирования
 * @returns отформатированную строку числа
 * @example
 * formatNumber(1234.56, { currency: 'RUB' }) // "1 234,56 ₽"
 * formatNumber(1000) // "1 000"
 */
export const formatNumber = (
  value: number,
  options: FormatNumberOptions = {}
): string => {
  const formatOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: options.minimumFractionDigits || 0,
    maximumFractionDigits: options.maximumFractionDigits || 2
  };

  if (options.currency) {
    formatOptions.style = 'currency';
    formatOptions.currency = options.currency;
  }

  return new Intl.NumberFormat('ru-RU', formatOptions).format(value);
};

/**
 * Правильное склонение русских слов
 * @param count - количество
 * @param one - форма для 1 (например: "статья")
 * @param few - форма для 2-4 (например: "статьи") 
 * @param many - форма для 5+ (например: "статей")
 * @returns правильную форму слова
 * @example
 * pluralize(1, 'статья', 'статьи', 'статей') // "статья"
 * pluralize(5, 'статья', 'статьи', 'статей') // "статей"
 */
export const pluralize = (
  count: number,
  one: string,
  few: string,
  many: string
): string => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 14) {
    return many;
  }

  if (mod10 === 1) {
    return one;
  }

  if (mod10 >= 2 && mod10 <= 4) {
    return few;
  }

  return many;
};

/**
 * Сокращает длинный текст с многоточием
 * @param text - исходный текст
 * @param maxLength - максимальная длина
 * @returns сокращенный текст
 * @example
 * truncateText('Очень длинный текст', 10) // "Очень длин..."
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Капитализирует первую букву строки
 * @param text - текст для капитализации
 * @returns текст с заглавной первой буквой
 * @example
 * capitalize('привет мир') // "Привет мир"
 */
export const capitalize = (text: string): string => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}; 