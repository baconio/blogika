/**
 * Утилиты для текстового редактора
 * @description Микромодуль для работы с редактором: форматирование, экспорт, валидация
 */

export type Maybe<T> = T | undefined;

export interface EditorContent {
  readonly html: string;
  readonly text: string;
  readonly wordCount: number;
  readonly characterCount: number;
}

export interface ExportOptions {
  readonly format: 'markdown' | 'html' | 'text' | 'json';
  readonly includeImages: boolean;
  readonly includeMetadata: boolean;
}

export interface ImageUploadResult {
  readonly url: string;
  readonly alt: string;
  readonly width?: number;
  readonly height?: number;
  readonly size: number;
}

/**
 * Очищает HTML контент от опасных элементов
 * @param html - HTML контент для очистки
 * @returns безопасный HTML
 * @example
 * const safeHtml = sanitizeHtml('<p>Текст</p><script>alert("hack")</script>')
 */
export const sanitizeHtml = (html: string): string => {
  // Список разрешенных тегов для блога
  const allowedTags = [
    'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'code', 'pre',
    'table', 'thead', 'tbody', 'tr', 'th', 'td'
  ];

  const allowedAttributes = ['href', 'src', 'alt', 'title', 'target'];

  // Базовая очистка (в продакшне использовать DOMPurify)
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '') // Удаляем события
    .replace(/javascript:/gi, ''); // Удаляем javascript: ссылки
};

/**
 * Конвертирует HTML в Markdown
 * @param html - HTML контент
 * @returns Markdown строку
 * @example
 * const markdown = htmlToMarkdown('<h1>Заголовок</h1><p>Текст</p>')
 */
export const htmlToMarkdown = (html: string): string => {
  let markdown = html;

  // Заголовки
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');

  // Форматирование
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

  // Ссылки
  markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // Изображения
  markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)');

  // Списки
  markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gis, '$1\n');
  markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');

  // Абзацы
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  markdown = markdown.replace(/<br[^>]*>/gi, '\n');

  // Очистка от оставшихся тегов
  markdown = markdown.replace(/<[^>]*>/g, '');
  
  // Нормализация переносов строк
  markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();

  return markdown;
};

/**
 * Конвертирует Markdown в HTML
 * @param markdown - Markdown контент
 * @returns HTML строку
 * @example
 * const html = markdownToHtml('# Заголовок\n\n**Жирный текст**')
 */
export const markdownToHtml = (markdown: string): string => {
  let html = markdown;

  // Заголовки
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');

  // Форматирование
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');

  // Ссылки
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Изображения
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

  // Абзацы
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';

  // Очистка пустых абзацев
  html = html.replace(/<p><\/p>/g, '');

  return html;
};

/**
 * Анализирует контент редактора
 * @param html - HTML контент
 * @returns анализ контента
 * @example
 * const analysis = analyzeContent('<p>Привет мир!</p>')
 */
export const analyzeContent = (html: string): EditorContent => {
  const text = stripHtmlTags(html);
  const words = text.split(/\s+/).filter(word => word.length > 0);
  
  return {
    html,
    text,
    wordCount: words.length,
    characterCount: text.length
  };
};

/**
 * Экспортирует контент в выбранном формате
 * @param content - контент для экспорта
 * @param options - опции экспорта
 * @returns экспортированный контент
 * @example
 * const exported = exportContent(content, { format: 'markdown', includeImages: true })
 */
export const exportContent = (
  content: EditorContent,
  options: ExportOptions
): string => {
  switch (options.format) {
    case 'markdown':
      return htmlToMarkdown(content.html);
    
    case 'html':
      return options.includeMetadata 
        ? addMetadataToHtml(content.html, content)
        : content.html;
    
    case 'text':
      return content.text;
    
    case 'json':
      return JSON.stringify(content, null, 2);
    
    default:
      return content.text;
  }
};

/**
 * Валидирует контент редактора
 * @param html - HTML контент для валидации
 * @returns массив ошибок валидации
 * @example
 * const errors = validateContent('<p>Короткий текст</p>')
 */
export const validateContent = (html: string): string[] => {
  const errors: string[] = [];
  const content = analyzeContent(html);

  // Минимальная длина контента
  if (content.wordCount < 50) {
    errors.push('Контент слишком короткий. Минимум 50 слов.');
  }

  // Максимальная длина контента
  if (content.wordCount > 10000) {
    errors.push('Контент слишком длинный. Максимум 10,000 слов.');
  }

  // Проверка на HTML инъекции
  if (html.includes('<script') || html.includes('javascript:')) {
    errors.push('Обнаружен потенциально опасный код.');
  }

  // Проверка изображений
  const imageCount = (html.match(/<img/g) || []).length;
  if (imageCount > 20) {
    errors.push('Слишком много изображений. Максимум 20.');
  }

  return errors;
};

/**
 * Оптимизирует изображения в контенте
 * @param html - HTML с изображениями
 * @returns оптимизированный HTML
 * @example
 * const optimized = optimizeImages(htmlWithImages)
 */
export const optimizeImages = (html: string): string => {
  // Добавляем lazy loading для изображений
  let optimized = html.replace(
    /<img([^>]*src="[^"]*"[^>]*)>/g,
    '<img$1 loading="lazy">'
  );

  // Добавляем responsive атрибуты если их нет
  optimized = optimized.replace(
    /<img([^>]*?)>/g,
    (match, attrs) => {
      if (!attrs.includes('style=') && !attrs.includes('width=')) {
        return `<img${attrs} style="max-width: 100%; height: auto;">`;
      }
      return match;
    }
  );

  return optimized;
};

/**
 * Добавляет метаданные к HTML
 * @param html - исходный HTML
 * @param content - анализ контента
 * @returns HTML с метаданными
 */
const addMetadataToHtml = (html: string, content: EditorContent): string => {
  const metadata = `
    <!-- Metadata -->
    <!-- Words: ${content.wordCount} -->
    <!-- Characters: ${content.characterCount} -->
    <!-- Generated: ${new Date().toISOString()} -->
  `;
  
  return metadata + '\n' + html;
};

/**
 * Удаляет HTML теги из текста
 * @param html - HTML строка
 * @returns чистый текст
 */
const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}; 