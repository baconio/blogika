import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Article } from '@/types/Article';
import { formatDate } from '@/lib/utils/formatting';

/**
 * Пропсы компонента заголовка статьи
 */
interface ArticleHeaderProps {
  readonly article: Article;
  readonly showAuthor?: boolean;
  readonly showMeta?: boolean;
}

/**
 * Форматирует время чтения
 * @param minutes - минуты чтения
 * @returns отформатированная строка времени чтения
 */
const formatReadingTime = (minutes: number): string => {
  if (minutes === 1) return '1 минута';
  if (minutes < 5) return `${minutes} минуты`;
  return `${minutes} минут`;
};

/**
 * Компонент заголовка статьи с мета-информацией
 * Отображает заголовок, автора, дату, время чтения и категорию
 * @param article - данные статьи
 * @param showAuthor - показывать ли информацию об авторе
 * @param showMeta - показывать ли мета-информацию
 * @returns JSX элемент заголовка статьи
 */
export const ArticleHeader = ({
  article,
  showAuthor = true,
  showMeta = true
}: ArticleHeaderProps) => {
  return (
    <header className="mb-8 text-center">
      {/* Категория */}
      {article.category && (
        <div className="mb-4">
          <Link href={`/category/${article.category.slug}`}>
            <Badge
              variant="outline"
              style={{ 
                borderColor: article.category.color || '#6b7280',
                color: article.category.color || '#6b7280'
              }}
              className="text-sm"
            >
              {article.category.name}
            </Badge>
          </Link>
        </div>
      )}

      {/* Заголовок */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
        {article.title}
      </h1>

      {/* Краткое описание */}
      {article.excerpt && (
        <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
          {article.excerpt}
        </p>
      )}

      {/* Мета-информация */}
      {showMeta && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
          {/* Автор */}
          {showAuthor && article.author && (
            <div className="flex items-center gap-2">
              <Avatar
                src={article.author.avatar}
                alt={article.author.displayName}
                size="sm"
              />
              <Link 
                href={`/author/${article.author.user?.username}`}
                className="font-medium hover:text-gray-700"
              >
                {article.author.displayName}
              </Link>
            </div>
          )}

          {/* Дата публикации */}
          <time dateTime={article.publishedAtCustom || article.publishedAt}>
            {formatDate(article.publishedAtCustom || article.publishedAt)}
          </time>

          {/* Время чтения */}
          {article.readingTime && (
            <span>{formatReadingTime(article.readingTime)}</span>
          )}

          {/* Статистика просмотров */}
          {article.viewsCount !== undefined && (
            <span>{article.viewsCount} просмотров</span>
          )}
        </div>
      )}
    </header>
  );
}; 