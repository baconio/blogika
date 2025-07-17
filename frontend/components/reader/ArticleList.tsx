import Link from 'next/link';
import { Article } from '@/types/Article';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * Пропсы компонента списка статей
 */
interface ArticleListProps {
  readonly articles: Article[];
  readonly totalPages?: number;
  readonly currentPage?: number;
  readonly isLoading?: boolean;
  readonly variant?: 'grid' | 'list';
  readonly showPagination?: boolean;
  readonly onPageChange?: (page: number) => void;
  readonly emptyMessage?: string;
}

/**
 * Генерирует массив номеров страниц для пагинации
 * @param currentPage - текущая страница
 * @param totalPages - общее количество страниц
 * @returns массив номеров страниц для отображения
 */
const generatePageNumbers = (currentPage: number, totalPages: number): (number | string)[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];
  
  // Всегда показываем первую страницу
  pages.push(1);
  
  if (currentPage > 3) {
    pages.push('...');
  }
  
  // Показываем страницы вокруг текущей
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  if (currentPage < totalPages - 2) {
    pages.push('...');
  }
  
  // Всегда показываем последнюю страницу
  if (totalPages > 1) {
    pages.push(totalPages);
  }
  
  return pages;
};

/**
 * Компонент карточки статьи для списка
 */
const ArticleListItem = ({ article, variant }: { article: Article; variant: 'grid' | 'list' }) => {
  if (variant === 'list') {
    return (
      <article className="border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
        <div className="flex gap-4">
          {/* Изображение */}
          {article.coverImage && (
            <Link href={`/article/${article.slug}`} className="flex-shrink-0">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                loading="lazy"
              />
            </Link>
          )}
          
          {/* Контент */}
          <div className="flex-grow min-w-0">
            {/* Категория */}
            {article.category && (
              <span
                className="inline-block px-2 py-1 text-xs font-medium rounded-full mb-2"
                style={{
                  backgroundColor: `${article.category.color}20`,
                  color: article.category.color || '#6b7280'
                }}
              >
                {article.category.name}
              </span>
            )}
            
            {/* Заголовок */}
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
              <Link href={`/article/${article.slug}`} className="hover:text-blue-600 transition-colors">
                {article.title}
              </Link>
            </h2>
            
            {/* Описание */}
            {article.excerpt && (
              <p className="text-gray-600 mb-3 line-clamp-2 text-sm sm:text-base">
                {article.excerpt}
              </p>
            )}
            
            {/* Мета информация */}
            <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500">
              {article.author && (
                <span>{article.author.displayName}</span>
              )}
              <span>•</span>
              <time>{new Date(article.publishedAt).toLocaleDateString('ru-RU')}</time>
              {article.readingTime && (
                <>
                  <span>•</span>
                  <span>{article.readingTime} мин</span>
                </>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Grid variant
  return (
    <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/article/${article.slug}`}>
        {/* Изображение */}
        {article.coverImage && (
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
            <span
              className="inline-block px-2 py-1 text-xs font-medium rounded-full mb-2"
              style={{
                backgroundColor: `${article.category.color}20`,
                color: article.category.color || '#6b7280'
              }}
            >
              {article.category.name}
            </span>
          )}
          
          {/* Заголовок */}
          <h2 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {article.title}
          </h2>
          
          {/* Описание */}
          {article.excerpt && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {article.excerpt}
            </p>
          )}
          
          {/* Мета информация */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              {article.author && (
                <span>{article.author.displayName}</span>
              )}
              <time>{new Date(article.publishedAt).toLocaleDateString('ru-RU')}</time>
            </div>
            {article.readingTime && (
              <span>{article.readingTime} мин</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

/**
 * Компонент для отображения списка статей с пагинацией
 * @param articles - массив статей для отображения
 * @param totalPages - общее количество страниц
 * @param currentPage - текущая страница
 * @param isLoading - состояние загрузки
 * @param variant - вариант отображения (grid/list)
 * @param showPagination - показывать ли пагинацию
 * @param onPageChange - обработчик смены страницы
 * @param emptyMessage - сообщение при отсутствии статей
 * @returns JSX элемент со списком статей
 */
export const ArticleList = ({
  articles,
  totalPages = 1,
  currentPage = 1,
  isLoading = false,
  variant = 'grid',
  showPagination = true,
  onPageChange,
  emptyMessage = 'Статьи не найдены'
}: ArticleListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  const gridClass = variant === 'grid' 
    ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' 
    : 'space-y-0';

  return (
    <div>
      {/* Список статей */}
      <div className={gridClass}>
        {articles.map((article) => (
          <ArticleListItem
            key={article.id}
            article={article}
            variant={variant}
          />
        ))}
      </div>

      {/* Пагинация */}
      {showPagination && totalPages > 1 && onPageChange && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-2">
            {/* Предыдущая страница */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ←
            </Button>

            {/* Номера страниц */}
            {generatePageNumbers(currentPage, totalPages).map((page, index) => (
              <div key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-gray-500">...</span>
                ) : (
                  <Button
                    variant={page === currentPage ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(page as number)}
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}

            {/* Следующая страница */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              →
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
}; 