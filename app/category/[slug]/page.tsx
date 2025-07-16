import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogLayout } from '@/components/layout/BlogLayout';
import { ArticleCard } from '@/components/features/ArticleCard';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Suspense } from 'react';

interface CategoryPageProps {
  readonly params: {
    readonly slug: string;
  };
  readonly searchParams?: {
    readonly page?: string;
  };
}

/**
 * Получает данные категории с сервера
 * @param slug - слаг категории
 * @returns данные категории или undefined
 */
async function getCategory(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories?filters[slug][$eq]=${slug}&populate=*`, {
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      return undefined;
    }
    
    const data = await response.json();
    return data.data?.[0];
  } catch (error) {
    console.error('Ошибка загрузки категории:', error);
    return undefined;
  }
}

/**
 * Получает статьи категории с сервера
 * @param categoryId - ID категории
 * @param page - номер страницы
 * @returns список статей
 */
async function getCategoryArticles(categoryId: string, page = 1) {
  try {
    const pageSize = 12;
    const start = (page - 1) * pageSize;
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/articles?filters[category][id][$eq]=${categoryId}&populate=*&pagination[start]=${start}&pagination[limit]=${pageSize}&sort=published_at_custom:desc`,
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
    console.error('Ошибка загрузки статей категории:', error);
    return { articles: [], pagination: null };
  }
}

/**
 * Генерирует метаданные для страницы категории
 * @param params - параметры маршрута
 * @returns объект метаданных
 */
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory(params.slug);
  
  if (!category) {
    return {
      title: 'Категория не найдена | Новое поколение',
      description: 'Запрашиваемая категория статей не найдена.'
    };
  }
  
  return {
    title: `${category.attributes.name} | Новое поколение`,
    description: category.attributes.description || `Статьи в категории ${category.attributes.name}`,
    openGraph: {
      title: category.attributes.name,
      description: category.attributes.description,
      type: 'website'
    }
  };
}

/**
 * Компонент статей категории с Suspense
 */
async function CategoryArticles({ categoryId, page }: { categoryId: string; page: number }) {
  const { articles, pagination } = await getCategoryArticles(categoryId, page);
  
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">
          В этой категории пока нет статей
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
 * Страница категории с отображением списка статей
 * @param params - параметры маршрута
 * @param searchParams - параметры поиска
 * @returns JSX элемент страницы категории
 */
export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await getCategory(params.slug);
  const page = parseInt(searchParams?.page || '1', 10);
  
  if (!category) {
    notFound();
  }
  
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Категории', href: '/categories' },
    { label: category.attributes.name, href: `/category/${params.slug}` }
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
        {/* Заголовок категории */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {category.attributes.name}
            </h1>
            {category.attributes.color && (
              <Badge 
                variant="default" 
                style={{ backgroundColor: category.attributes.color }}
                className="text-white"
              >
                Категория
              </Badge>
            )}
          </div>
          
          {category.attributes.description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {category.attributes.description}
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
          <CategoryArticles categoryId={category.id} page={page} />
        </Suspense>
      </div>
    </BlogLayout>
  );
} 