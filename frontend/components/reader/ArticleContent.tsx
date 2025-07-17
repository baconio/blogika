import { sanitizeContent } from '@/lib/utils/content';

/**
 * Пропсы компонента контента статьи
 */
interface ArticleContentProps {
  readonly content: string;
  readonly allowUnsafeHtml?: boolean;
  readonly className?: string;
}

/**
 * Базовые стили типографики для контента статей
 */
const contentStyles = `
  prose prose-lg prose-gray max-w-none
  prose-headings:font-semibold prose-headings:tracking-tight
  prose-h1:text-3xl prose-h1:mb-4
  prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-8
  prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-6
  prose-p:mb-4 prose-p:leading-relaxed
  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
  prose-strong:font-semibold prose-strong:text-gray-900
  prose-ul:mb-4 prose-ol:mb-4
  prose-li:mb-1
  prose-blockquote:border-l-4 prose-blockquote:border-blue-200 
  prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700
  prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
  prose-pre:bg-gray-900 prose-pre:text-gray-100
  prose-img:rounded-lg prose-img:shadow-md
`;

/**
 * Обрабатывает специальные элементы в контенте
 * @param content - HTML контент
 * @returns обработанный контент
 */
const processContent = (content: string): string => {
  // Добавляем lazy loading к изображениям
  return content.replace(
    /<img([^>]*?)>/g, 
    '<img$1 loading="lazy" decoding="async">'
  );
};

/**
 * Компонент для отображения основного контента статьи
 * Применяет правильную типографику и обрабатывает HTML контент
 * @param content - HTML контент статьи
 * @param allowUnsafeHtml - разрешить небезопасный HTML (по умолчанию false)
 * @param className - дополнительные CSS классы
 * @returns JSX элемент с контентом статьи
 */
export const ArticleContent = ({
  content,
  allowUnsafeHtml = false,
  className = ''
}: ArticleContentProps) => {
  // Санитизация контента для безопасности
  const safeContent = allowUnsafeHtml ? content : sanitizeContent(content);
  
  // Обработка специальных элементов
  const processedContent = processContent(safeContent);

  return (
    <div 
      className={`${contentStyles} ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}; 