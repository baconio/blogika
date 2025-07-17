import { Metadata } from 'next';
import { Article } from '@/types/Article';
import { Author } from '@/types/Author';

/**
 * Конфигурация сайта для SEO
 */
export const SITE_CONFIG = {
  name: 'Новое поколение',
  description: 'Современная блоговая платформа для авторов и читателей',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://blogika.com',
  ogImage: '/images/og-default.jpg',
  twitter: '@blogika_com',
  keywords: ['блог', 'статьи', 'авторы', 'контент', 'чтение']
} as const;

/**
 * Генерирует базовые метатеги для страницы
 * @param title - заголовок страницы
 * @param description - описание страницы
 * @param keywords - ключевые слова
 * @param ogImage - изображение для социальных сетей
 * @returns объект метаданных Next.js
 */
export const generateBaseMetadata = ({
  title,
  description,
  keywords = [],
  ogImage = SITE_CONFIG.ogImage
}: {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
}): Metadata => {
  const fullTitle = title === SITE_CONFIG.name ? title : `${title} | ${SITE_CONFIG.name}`;
  const allKeywords = [...SITE_CONFIG.keywords, ...keywords];

  return {
    title: fullTitle,
    description,
    keywords: allKeywords.join(', '),
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    
    openGraph: {
      type: 'website',
      siteName: SITE_CONFIG.name,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    
    twitter: {
      card: 'summary_large_image',
      site: SITE_CONFIG.twitter,
      creator: SITE_CONFIG.twitter,
      title: fullTitle,
      description,
      images: [ogImage]
    },
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  };
};

/**
 * Генерирует метатеги для статьи
 * @param article - данные статьи
 * @returns объект метаданных Next.js
 */
export const generateArticleMetadata = (article: Article): Metadata => {
  const title = article.title;
  const description = article.excerpt || generateExcerpt(article.content);
  const keywords = article.tags?.map(tag => tag.name) || [];
  const ogImage = article.coverImage || SITE_CONFIG.ogImage;
  const publishedTime = article.publishedAtCustom || article.publishedAt;
  const modifiedTime = article.updatedAt;
  const canonicalUrl = `${SITE_CONFIG.url}/article/${article.slug}`;
  
  const baseMetadata = generateBaseMetadata({
    title,
    description,
    keywords,
    ogImage
  });

  return {
    ...baseMetadata,
    
    alternates: {
      canonical: canonicalUrl
    },
    
    openGraph: {
      ...baseMetadata.openGraph,
      type: 'article',
      url: canonicalUrl,
      publishedTime,
      modifiedTime,
      authors: article.author ? [article.author.displayName] : [],
      section: article.category?.name,
      tags: keywords
    },
    
    twitter: {
      ...baseMetadata.twitter,
      creator: article.author?.user?.username ? `@${article.author.user.username}` : SITE_CONFIG.twitter
    }
  };
};

/**
 * Генерирует метатеги для профиля автора
 * @param author - данные автора
 * @returns объект метаданных Next.js
 */
export const generateAuthorMetadata = (author: Author): Metadata => {
  const title = `${author.displayName} - Автор`;
  const description = author.bio || `Читайте статьи автора ${author.displayName} на ${SITE_CONFIG.name}`;
  const ogImage = author.avatar || SITE_CONFIG.ogImage;
  const canonicalUrl = `${SITE_CONFIG.url}/author/${author.user?.username}`;

  const baseMetadata = generateBaseMetadata({
    title,
    description,
    ogImage
  });

  return {
    ...baseMetadata,
    
    alternates: {
      canonical: canonicalUrl
    },
    
    openGraph: {
      ...baseMetadata.openGraph,
      type: 'profile',
      url: canonicalUrl,
      username: author.user?.username
    }
  };
};

/**
 * Генерирует структурированные данные JSON-LD для статьи
 * @param article - данные статьи
 * @returns объект структурированных данных
 */
export const generateArticleStructuredData = (article: Article) => {
  const canonicalUrl = `${SITE_CONFIG.url}/article/${article.slug}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || generateExcerpt(article.content),
    image: article.coverImage ? [article.coverImage] : [],
    datePublished: article.publishedAtCustom || article.publishedAt,
    dateModified: article.updatedAt,
    author: article.author ? {
      '@type': 'Person',
      name: article.author.displayName,
      url: article.author.user?.username 
        ? `${SITE_CONFIG.url}/author/${article.author.user.username}`
        : undefined
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl
    },
    articleSection: article.category?.name,
    keywords: article.tags?.map(tag => tag.name).join(', '),
    wordCount: article.content ? countWords(article.content) : undefined,
    timeRequired: article.readingTime ? `PT${article.readingTime}M` : undefined
  };
};

/**
 * Генерирует структурированные данные для хлебных крошек
 * @param items - элементы хлебных крошек
 * @returns объект структурированных данных
 */
export const generateBreadcrumbStructuredData = (items: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};

/**
 * Создает краткое описание из HTML контента
 * @param content - HTML контент
 * @param maxLength - максимальная длина описания
 * @returns краткое описание
 */
const generateExcerpt = (content: string, maxLength: number = 160): string => {
  // Удаляем HTML теги
  const textContent = content.replace(/<[^>]*>/g, '');
  
  // Обрезаем до нужной длины
  if (textContent.length <= maxLength) {
    return textContent;
  }
  
  return textContent.substring(0, maxLength).trim() + '...';
};

/**
 * Подсчитывает количество слов в тексте
 * @param text - текст для подсчета
 * @returns количество слов
 */
const countWords = (text: string): number => {
  const cleanText = text.replace(/<[^>]*>/g, '');
  return cleanText.split(/\s+/).filter(word => word.length > 0).length;
}; 