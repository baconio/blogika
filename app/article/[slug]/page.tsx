/**
 * Страница статьи блоговой платформы "Новое поколение"
 * Dynamic Server Component с SEO и структурированными данными
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogLayout } from '@/components/layout/BlogLayout';
import { formatDate } from '@/lib/utils';

/**
 * Параметры страницы
 */
interface ArticlePageProps {
  params: { slug: string };
}

/**
 * Получение данных статьи (заглушка)
 * В будущем будет заменено на реальный API вызов
 */
async function getArticle(slug: string) {
  // Заглушка для демонстрации
  if (slug === 'test-article') {
    return {
      id: '1',
      title: 'Как создать современную блоговую платформу с Next.js и Strapi',
      slug: 'test-article',
      content: '<p>Это тестовая статья для демонстрации функциональности...</p>',
      excerpt: 'Пошаговое руководство по созданию блоговой платформы с использованием современных технологий.',
      cover_image: null,
      author: {
        id: '1',
        display_name: 'Алексей Разработчик',
        avatar: null,
        bio: 'Fullstack разработчик с опытом в React и Node.js'
      },
      category: {
        id: '1',
        name: 'Разработка',
        slug: 'development',
        color: '#3b82f6'
      },
      tags: [
        { id: '1', name: 'Next.js', slug: 'nextjs' },
        { id: '2', name: 'React', slug: 'react' },
        { id: '3', name: 'TypeScript', slug: 'typescript' }
      ],
      reading_time: 8,
      views_count: 1250,
      likes_count: 45,
      comments_count: 12,
      published_at: new Date('2024-01-15'),
      status: 'published',
      access_level: 'free'
    };
  }
  return null;
}

/**
 * Генерация метаданных статьи
 */
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticle(params.slug);
  
  if (!article) {
    return {
      title: 'Статья не найдена',
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags.map(tag => tag.name),
    authors: [{ name: article.author.display_name }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.published_at.toISOString(),
      authors: [article.author.display_name],
      tags: article.tags.map(tag => tag.name),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    },
  };
}

/**
 * Хедер статьи с метаинформацией
 */
const ArticleHeader = ({ article }: { article: any }) => (
  <header className="mb-8">
    {/* Категория */}
    <div className="mb-4">
      <span 
        className="badge badge-lg"
        style={{ backgroundColor: article.category.color + '20', color: article.category.color }}
      >
        {article.category.name}
      </span>
    </div>

    {/* Заголовок */}
    <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
      {article.title}
    </h1>

    {/* Метаинформация */}
    <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/70">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-primary-content text-xs font-bold">
            {article.author.display_name.charAt(0)}
          </span>
        </div>
        <span>{article.author.display_name}</span>
      </div>
      <span>•</span>
      <time dateTime={article.published_at.toISOString()}>
        {formatDate(article.published_at)}
      </time>
      <span>•</span>
      <span>{article.reading_time} мин чтения</span>
      <span>•</span>
      <span>{article.views_count.toLocaleString()} просмотров</span>
    </div>

    {/* Теги */}
    <div className="flex flex-wrap gap-2 mt-4">
      {article.tags.map((tag: any) => (
        <span key={tag.id} className="badge badge-ghost badge-sm">
          #{tag.name}
        </span>
      ))}
    </div>
  </header>
);

/**
 * Контент статьи
 */
const ArticleContent = ({ article }: { article: any }) => (
  <article className="prose prose-lg max-w-none">
    {/* В будущем здесь будет рендеринг rich text контента */}
    <div 
      dangerouslySetInnerHTML={{ __html: article.content }}
      className="text-base-content"
    />
    
    {/* Заглушка для демонстрации */}
    <div className="mt-8 p-6 bg-base-200 rounded-lg">
      <h3>Содержимое статьи</h3>
      <p>
        Здесь будет отображаться полный контент статьи, отрендеренный из rich text формата Strapi.
        В текущей версии это заглушка для демонстрации структуры страницы.
      </p>
      <p>
        Статья будет содержать форматированный текст, изображения, блоки кода, 
        встроенные видео и другие медиа-элементы.
      </p>
    </div>
  </article>
);

/**
 * Действия со статьей (лайки, закладки, поделиться)
 */
const ArticleActions = ({ article }: { article: any }) => (
  <div className="flex justify-between items-center py-6 border-t border-base-300">
    <div className="flex items-center space-x-4">
      <button className="btn btn-ghost btn-sm">
        ❤️ {article.likes_count}
      </button>
      <button className="btn btn-ghost btn-sm">
        🔖 Сохранить
      </button>
      <button className="btn btn-ghost btn-sm">
        💬 {article.comments_count}
      </button>
    </div>
    <button className="btn btn-ghost btn-sm">
      📤 Поделиться
    </button>
  </div>
);

/**
 * Страница статьи
 */
export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  // Хлебные крошки
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Статьи', href: '/articles' },
    { label: article.category.name, href: `/category/${article.category.slug}` },
    { label: article.title, isActive: true },
  ];

  return (
    <BlogLayout
      variant="article"
      showBreadcrumbs={true}
      breadcrumbs={breadcrumbs}
      sidebarContent={{
        showCategories: true,
        showTags: true,
        showPopularArticles: true,
        showRecentArticles: false,
      }}
    >
      <div className="max-w-4xl">
        <ArticleHeader article={article} />
        <ArticleContent article={article} />
        <ArticleActions article={article} />
        
        {/* Секция комментариев - будет добавлена позже */}
        <div className="mt-8 p-6 bg-base-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Комментарии ({article.comments_count})
          </h3>
          <p className="text-base-content/70">
            Система комментариев будет добавлена в следующих этапах разработки.
          </p>
        </div>
      </div>
    </BlogLayout>
  );
} 