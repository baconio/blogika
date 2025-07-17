import Link from 'next/link';
import { Article } from '@/types/Article';
import { formatDate } from '@/lib/utils/formatting';

/**
 * Пропсы компонента связанных статей
 */
interface RelatedArticlesProps {
  readonly articles: Article[];
  readonly title?: string;
  readonly maxItems?: number;
  readonly showImages?: boolean;
}

/**
 * Форматирует время чтения для компактного отображения
 * @param minutes - минуты чтения
 * @returns отформатированная строка
 */
const formatReadingTimeShort = (minutes: number): string => {
  return `${minutes} мин`;
};

/**
 * Компонент для отображения связанных/похожих статей
 * Показывает список статей с превью и основной информацией
 * @param articles - массив связанных статей
 * @param title - заголовок секции
 * @param maxItems - максимальное количество статей для отображения
 * @param showImages - показывать ли изображения статей
 * @returns JSX элемент со списком связанных статей
 */
export const RelatedArticles = ({
  articles,
  title = 'Похожие статьи',
  maxItems = 3,
  showImages = true
}: RelatedArticlesProps) => {
  const displayedArticles = articles.slice(0, maxItems);

  if (displayedArticles.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {title}
      </h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {displayedArticles.map((article) => (
          <article
            key={article.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <Link href={`/article/${article.slug}`} className="block">
              {/* Изображение */}
              {showImages && article.coverImage && (
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}
              
              {/* Контент */}
              <div className="p-4">
                {/* Категория */}
                {article.category && (
                  <div className="mb-2">
                    <span
                      className="inline-block px-2 py-1 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor: `${article.category.color}20`,
                        color: article.category.color || '#6b7280'
                      }}
                    >
                      {article.category.name}
                    </span>
                  </div>
                )}
                
                {/* Заголовок */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                
                {/* Краткое описание */}
                {article.excerpt && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
                
                {/* Мета информация */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    {/* Автор */}
                    {article.author && (
                      <span>{article.author.displayName}</span>
                    )}
                    
                    {/* Дата */}
                    <time dateTime={article.publishedAt}>
                      {formatDate(article.publishedAt)}
                    </time>
                  </div>
                  
                  {/* Время чтения */}
                  {article.readingTime && (
                    <span>{formatReadingTimeShort(article.readingTime)}</span>
                  )}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
      
      {/* Ссылка на больше статей */}
      {articles.length > maxItems && (
        <div className="text-center mt-6">
          <Link
            href="/articles"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Смотреть все статьи
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      )}
    </section>
  );
}; 