import Link from 'next/link';
import { Article } from '@/types/Article';
import { formatDate } from '@/lib/utils/formatting';

/**
 * Пропсы компонента рекомендуемых статей
 */
interface FeaturedArticlesProps {
  readonly articles: Article[];
  readonly title?: string;
  readonly variant?: 'hero' | 'sidebar' | 'carousel';
  readonly maxItems?: number;
  readonly showCategory?: boolean;
}

/**
 * Компонент для отображения рекомендуемых/популярных статей
 * Поддерживает различные варианты макета
 * @param articles - массив рекомендуемых статей
 * @param title - заголовок секции
 * @param variant - вариант отображения
 * @param maxItems - максимальное количество статей
 * @param showCategory - показывать ли категории
 * @returns JSX элемент с рекомендуемыми статьями
 */
export const FeaturedArticles = ({
  articles,
  title = 'Рекомендуемые статьи',
  variant = 'hero',
  maxItems = 4,
  showCategory = true
}: FeaturedArticlesProps) => {
  const displayedArticles = articles.slice(0, maxItems);

  if (displayedArticles.length === 0) {
    return null;
  }

  // Hero layout - главная статья + маленькие карточки
  if (variant === 'hero') {
    const [mainArticle, ...otherArticles] = displayedArticles;

    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Главная статья */}
          <article className="group">
            <Link href={`/article/${mainArticle.slug}`}>
              {/* Изображение */}
              {mainArticle.coverImage && (
                <div className="aspect-video w-full overflow-hidden rounded-lg mb-4">
                  <img
                    src={mainArticle.coverImage}
                    alt={mainArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}
              
              {/* Контент */}
              <div>
                {/* Категория */}
                {showCategory && mainArticle.category && (
                  <span
                    className="inline-block px-3 py-1 text-sm font-medium rounded-full mb-3"
                    style={{
                      backgroundColor: `${mainArticle.category.color}20`,
                      color: mainArticle.category.color || '#6b7280'
                    }}
                  >
                    {mainArticle.category.name}
                  </span>
                )}
                
                {/* Заголовок */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {mainArticle.title}
                </h3>
                
                {/* Описание */}
                {mainArticle.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {mainArticle.excerpt}
                  </p>
                )}
                
                {/* Мета информация */}
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  {mainArticle.author && (
                    <span>{mainArticle.author.displayName}</span>
                  )}
                  <span>•</span>
                  <time>{formatDate(mainArticle.publishedAt)}</time>
                  {mainArticle.readingTime && (
                    <>
                      <span>•</span>
                      <span>{mainArticle.readingTime} мин</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          </article>

          {/* Дополнительные статьи */}
          <div className="space-y-4">
            {otherArticles.map((article) => (
              <article key={article.id} className="flex gap-4 group">
                <Link href={`/article/${article.slug}`} className="flex gap-4 w-full">
                  {/* Изображение */}
                  {article.coverImage && (
                    <div className="flex-shrink-0">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-20 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  {/* Контент */}
                  <div className="flex-grow min-w-0">
                    {/* Категория */}
                    {showCategory && article.category && (
                      <span
                        className="inline-block px-2 py-1 text-xs font-medium rounded-full mb-2"
                        style={{
                          backgroundColor: `${article.category.color}15`,
                          color: article.category.color || '#6b7280'
                        }}
                      >
                        {article.category.name}
                      </span>
                    )}
                    
                    {/* Заголовок */}
                    <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h4>
                    
                    {/* Мета информация */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <time>{formatDate(article.publishedAt)}</time>
                      {article.readingTime && (
                        <>
                          <span>•</span>
                          <span>{article.readingTime} мин</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Sidebar layout - компактные карточки
  if (variant === 'sidebar') {
    return (
      <aside className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        
        <div className="space-y-4">
          {displayedArticles.map((article, index) => (
            <article key={article.id} className="flex gap-3 group">
              <Link href={`/article/${article.slug}`} className="flex gap-3 w-full">
                {/* Номер */}
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                
                {/* Контент */}
                <div className="flex-grow min-w-0">
                  <h4 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h4>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <time>{formatDate(article.publishedAt)}</time>
                    {article.readingTime && (
                      <>
                        <span>•</span>
                        <span>{article.readingTime} мин</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </aside>
    );
  }

  // Carousel layout - горизонтальные карточки
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayedArticles.map((article) => (
          <article key={article.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow group">
            <Link href={`/article/${article.slug}`}>
              {/* Изображение */}
              {article.coverImage && (
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}
              
              {/* Контент */}
              <div className="p-4">
                {/* Категория */}
                {showCategory && article.category && (
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
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                
                {/* Мета информация */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <time>{formatDate(article.publishedAt)}</time>
                  {article.readingTime && (
                    <span>{article.readingTime} мин</span>
                  )}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}; 