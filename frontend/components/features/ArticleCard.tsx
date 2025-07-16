import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

/**
 * Типы для карточки статьи
 */
interface ArticleCardProps {
  readonly article: {
    readonly id: string;
    readonly title: string;
    readonly excerpt?: string;
    readonly slug: string;
    readonly publishedAt: string;
    readonly readingTime?: number;
    readonly coverImage?: string;
    readonly author: {
      readonly name: string;
      readonly avatar?: string;
    };
    readonly category?: {
      readonly name: string;
      readonly slug: string;
      readonly color?: string;
    };
    readonly tags?: readonly string[];
    readonly viewsCount?: number;
    readonly likesCount?: number;
  };
  readonly variant?: 'default' | 'compact' | 'featured';
  readonly showCategory?: boolean;
  readonly showAuthor?: boolean;
  readonly showStats?: boolean;
}

/**
 * Форматирует дату публикации
 * @param dateString - строка с датой
 * @returns отформатированная дата
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

/**
 * Компонент карточки статьи для списков
 * @param article - данные статьи
 * @param variant - вариант отображения карточки
 * @param showCategory - показывать ли категорию
 * @param showAuthor - показывать ли автора
 * @param showStats - показывать ли статистику
 * @returns JSX элемент карточки статьи
 */
export const ArticleCard = ({
  article,
  variant = 'default',
  showCategory = true,
  showAuthor = true,
  showStats = false
}: ArticleCardProps) => {
  if (variant === 'compact') {
    return (
      <article className="flex gap-4 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
        {/* Обложка */}
        {article.coverImage && (
          <div className="flex-shrink-0">
            <Link href={`/article/${article.slug}`}>
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
            </Link>
          </div>
        )}
        
        {/* Контент */}
        <div className="flex-grow min-w-0">
          <div className="space-y-2">
            {/* Категория */}
            {showCategory && article.category && (
              <Link
                href={`/category/${article.category.slug}`}
                className="inline-block"
              >
                <Badge
                  variant="outline"
                  style={{ 
                    borderColor: article.category.color,
                    color: article.category.color 
                  }}
                  className="text-xs"
                >
                  {article.category.name}
                </Badge>
              </Link>
            )}
            
            {/* Заголовок */}
            <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
              <Link href={`/article/${article.slug}`}>
                {article.title}
              </Link>
            </h3>
            
            {/* Мета информация */}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
              {article.readingTime && (
                <span>{article.readingTime} мин</span>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }
  
  if (variant === 'featured') {
    return (
      <article className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        {/* Обложка */}
        {article.coverImage && (
          <div className="aspect-video overflow-hidden">
            <Link href={`/article/${article.slug}`}>
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>
        )}
        
        {/* Контент */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Категория */}
            {showCategory && article.category && (
              <Link
                href={`/category/${article.category.slug}`}
                className="inline-block"
              >
                <Badge
                  variant="default"
                  style={{ backgroundColor: article.category.color }}
                  className="text-white"
                >
                  {article.category.name}
                </Badge>
              </Link>
            )}
            
            {/* Заголовок */}
            <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
              <Link href={`/article/${article.slug}`}>
                {article.title}
              </Link>
            </h2>
            
            {/* Описание */}
            {article.excerpt && (
              <p className="text-gray-600 line-clamp-3">
                {article.excerpt}
              </p>
            )}
            
            {/* Автор и мета */}
            <div className="flex items-center justify-between pt-4 border-t">
              {showAuthor && (
                <div className="flex items-center gap-3">
                  <Avatar
                    src={article.author.avatar}
                    alt={article.author.name}
                    size="sm"
                    fallback={article.author.name.charAt(0)}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {article.author.name}
                    </p>
                    <time className="text-xs text-gray-500" dateTime={article.publishedAt}>
                      {formatDate(article.publishedAt)}
                    </time>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3 text-sm text-gray-500">
                {article.readingTime && (
                  <span>{article.readingTime} мин</span>
                )}
                {showStats && article.viewsCount && (
                  <span>{article.viewsCount} просмотров</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }
  
  // Default variant
  return (
    <article className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Обложка */}
      {article.coverImage && (
        <div className="aspect-[4/3] overflow-hidden">
          <Link href={`/article/${article.slug}`}>
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>
      )}
      
      {/* Контент */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Категория */}
          {showCategory && article.category && (
            <Link
              href={`/category/${article.category.slug}`}
              className="inline-block"
            >
              <Badge
                variant="outline"
                style={{ 
                  borderColor: article.category.color,
                  color: article.category.color 
                }}
                className="text-xs"
              >
                {article.category.name}
              </Badge>
            </Link>
          )}
          
          {/* Заголовок */}
          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
            <Link href={`/article/${article.slug}`}>
              {article.title}
            </Link>
          </h3>
          
          {/* Описание */}
          {article.excerpt && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {article.excerpt}
            </p>
          )}
          
          {/* Автор и мета */}
          {showAuthor && (
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <Avatar
                  src={article.author.avatar}
                  alt={article.author.name}
                  size="xs"
                  fallback={article.author.name.charAt(0)}
                />
                <span className="text-xs text-gray-600">
                  {article.author.name}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <time dateTime={article.publishedAt}>
                  {formatDate(article.publishedAt)}
                </time>
                {article.readingTime && (
                  <span>• {article.readingTime} мин</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}; 