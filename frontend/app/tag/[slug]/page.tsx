import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogLayout } from '@/components/layout/BlogLayout';
import { ArticleCard } from '@/components/features/ArticleCard';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Suspense } from 'react';

interface TagPageProps {
  readonly params: {
    readonly slug: string;
  };
  readonly searchParams?: {
    readonly page?: string;
  };
}

/**
 * Получает данные тега с сервера
 * @param slug - слаг тега
 * @returns данные тега или undefined
 */
async function getTag(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tags?filters[slug][$eq]=${slug}&populate=*`, {
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      return undefined;
    }
    
    const data = await response.json();
    return data.data?.[0];
  } catch (error) {
    console.error('Ошибка загрузки тега:', error);
    return undefined;
  }
}

/**
 * Получает статьи с указанным тегом
 * @param tagId - ID тега
 * @param page - номер страницы
 * @returns список статей
 */
async function getTagArticles(tagId: string, page = 1) {
  try {
    const pageSize = 12;
    const start = (page - 1) * pageSize;
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/articles?filters[tags][id][$eq]=${tagId}&populate=*&pagination[start]=${start}&pagination[limit]=${pageSize}&sort=published_at_custom:desc`,
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
    console.error('Ошибка загрузки статей тега:', error);
    return { articles: [], pagination: null };
  }
}

/**
 * Генерирует метаданные для страницы тега
 * @param params - параметры маршрута
 * @returns объект метаданных
 */
export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = await getTag(params.slug);
  
  if (!tag) {
    return {
      title: 'Тег не найден | Новое поколение',
      description: 'Запрашиваемый тег не найден.'
    };
  }
  
  return {
    title: `#${tag.attributes.name} | Новое поколение`,
    description: tag.attributes.description || `Статьи с тегом ${tag.attributes.name}`,
    openGraph: {
      title: `#${tag.attributes.name}`,
      description: tag.attributes.description,
      type: 'website'
    }
  };
}

/**
 * Компонент статей тега с Suspense
 */
async function TagArticles({ tagId, page }: { tagId: string; page: number }) {
  const { articles, pagination } = await getTagArticles(tagId, page);
  
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">
          Статей с этим тегом пока нет
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
 * Страница тега с отображением списка статей
 * @param params - параметры маршрута
 * @param searchParams - параметры поиска
 * @returns JSX элемент страницы тега
 */
export default async function TagPage({ params, searchParams }: TagPageProps) {
  const tag = await getTag(params.slug);
  const page = parseInt(searchParams?.page || '1', 10);
  
  if (!tag) {
    notFound();
  }
  
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Теги', href: '/tags' },
    { label: tag.attributes.name, href: `/tag/${params.slug}` }
  ];
  
  return (
    <BlogLayout 
      showSidebar={true}
      sidebarContent={{
        categories: { show: true },
        tags: { show: true },
        popularArticles: { show: true, limit: 5 }
      }}
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-8">
        {/* Заголовок тега */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              #{tag.attributes.name}
            </h1>
            {tag.attributes.color && (
              <Badge 
                variant="outline" 
                style={{ borderColor: tag.attributes.color, color: tag.attributes.color }}
              >
                {tag.attributes.usage_count || 0} статей
              </Badge>
            )}
          </div>
          
          {tag.attributes.description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {tag.attributes.description}
            </p>
          )}
        </div>
        
        {/* Список статей */}
        <Suspense 
          key={`${params.slug}-${page}`}
          fallback={
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          <TagArticles tagId={tag.id} page={page} />
        </Suspense>
      </div>
    </BlogLayout>
  );
} 