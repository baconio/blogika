import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogLayout } from '@/components/layout/BlogLayout';
import { ArticleCard } from '@/components/features/ArticleCard';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Suspense } from 'react';

interface AuthorPageProps {
  readonly params: {
    readonly username: string;
  };
  readonly searchParams?: {
    readonly page?: string;
  };
}

/**
 * Получает данные автора с сервера
 * @param username - имя пользователя автора
 * @returns данные автора или undefined
 */
async function getAuthor(username: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/authors?filters[user][username][$eq]=${username}&populate=*`, {
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      return undefined;
    }
    
    const data = await response.json();
    return data.data?.[0];
  } catch (error) {
    console.error('Ошибка загрузки автора:', error);
    return undefined;
  }
}

/**
 * Получает статьи автора
 * @param authorId - ID автора
 * @param page - номер страницы
 * @returns список статей
 */
async function getAuthorArticles(authorId: string, page = 1) {
  try {
    const pageSize = 9;
    const start = (page - 1) * pageSize;
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/articles?filters[author][id][$eq]=${authorId}&populate=*&pagination[start]=${start}&pagination[limit]=${pageSize}&sort=published_at_custom:desc`,
      { next: { revalidate: 300 } }
    );
    
    if (!response.ok) {
      return { articles: [], pagination: null };
    }
    
    const data = await response.json();
    return {
      articles: data.data || [],
      pagination: data.meta?.pagination
    };
  } catch (error) {
    console.error('Ошибка загрузки статей автора:', error);
    return { articles: [], pagination: null };
  }
}

/**
 * Генерирует метаданные для страницы автора
 * @param params - параметры маршрута
 * @returns объект метаданных
 */
export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const author = await getAuthor(params.username);
  
  if (!author) {
    return {
      title: 'Автор не найден | Новое поколение',
      description: 'Запрашиваемый автор не найден.'
    };
  }
  
  return {
    title: `${author.attributes.display_name} | Новое поколение`,
    description: author.attributes.bio || `Статьи автора ${author.attributes.display_name}`,
    openGraph: {
      title: author.attributes.display_name,
      description: author.attributes.bio,
      type: 'profile',
      images: author.attributes.avatar?.data?.attributes?.url ? [author.attributes.avatar.data.attributes.url] : []
    }
  };
}

/**
 * Компонент статей автора с Suspense
 */
async function AuthorArticles({ authorId, page }: { authorId: string; page: number }) {
  const { articles, pagination } = await getAuthorArticles(authorId, page);
  
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">
          У этого автора пока нет опубликованных статей
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article: any) => (
        <ArticleCard
          key={article.id}
          article={{
            id: article.id,
            title: article.attributes.title,
            excerpt: article.attributes.excerpt,
            slug: article.attributes.slug,
            publishedAt: article.attributes.published_at_custom,
            readingTime: article.attributes.reading_time,
            coverImage: article.attributes.cover_image?.data?.attributes?.url,
            author: {
              name: article.attributes.author?.data?.attributes?.display_name || 'Автор',
              avatar: article.attributes.author?.data?.attributes?.avatar?.data?.attributes?.url
            },
            category: {
              name: article.attributes.category?.data?.attributes?.name,
              slug: article.attributes.category?.data?.attributes?.slug,
              color: article.attributes.category?.data?.attributes?.color
            }
          }}
        />
      ))}
    </div>
  );
}

/**
 * Страница профиля автора с его статьями
 * @param params - параметры маршрута
 * @param searchParams - параметры поиска
 * @returns JSX элемент страницы автора
 */
export default async function AuthorPage({ params, searchParams }: AuthorPageProps) {
  const author = await getAuthor(params.username);
  const page = parseInt(searchParams?.page || '1', 10);
  
  if (!author) {
    notFound();
  }
  
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Авторы', href: '/authors' },
    { label: author.attributes.display_name, href: `/author/${params.username}` }
  ];
  
  return (
    <BlogLayout 
      sidebar="right"
      sidebarContent={{
        showCategories: true,
        showTags: true,
        showPopularArticles: true
      }}
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-8">
        {/* Профиль автора */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Аватар */}
            <div className="flex-shrink-0">
              <Avatar
                src={author.attributes.avatar?.data?.attributes?.url}
                alt={author.attributes.display_name}
                size="xl"
              />
            </div>
            
            {/* Информация */}
            <div className="flex-grow space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {author.attributes.display_name}
                </h1>
                {author.attributes.is_verified && (
                  <Badge variant="default" className="bg-blue-100 text-blue-800">
                    ✓ Верифицирован
                  </Badge>
                )}
              </div>
              
              {/* Статистика */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {author.attributes.subscriber_count > 0 && (
                  <span>{author.attributes.subscriber_count} подписчиков</span>
                )}
                {author.attributes.content_access_level && (
                  <span>Тип контента: {author.attributes.content_access_level}</span>
                )}
                {author.attributes.subscription_price > 0 && (
                  <span>Подписка: {author.attributes.subscription_price}₽/мес</span>
                )}
              </div>
              
              {/* Биография */}
              {author.attributes.bio && (
                <div 
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: author.attributes.bio }}
                />
              )}
              
              {/* Социальные сети */}
              {author.attributes.social_links && author.attributes.social_links.length > 0 && (
                <div className="flex gap-3">
                  {author.attributes.social_links.map((link: any, index: number) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {link.platform}: @{link.handle}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Статьи автора */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Статьи автора
          </h2>
          
          <Suspense 
            key={`${params.username}-${page}`}
            fallback={
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            }
          >
            <AuthorArticles authorId={author.id} page={page} />
          </Suspense>
        </div>
      </div>
    </BlogLayout>
  );
} 