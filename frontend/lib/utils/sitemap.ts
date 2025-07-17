import { Article } from '@/types/Article';
import { Author } from '@/types/Author';
import { Category } from '@/types/Category';
import { SITE_CONFIG } from './metadata';

/**
 * Элемент sitemap
 */
export interface SitemapEntry {
  readonly url: string;
  readonly lastModified?: string;
  readonly changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  readonly priority?: number;
}

/**
 * Генерирует статические URL сайта для sitemap
 * @returns массив статических страниц
 */
export const generateStaticSitemapEntries = (): SitemapEntry[] => {
  const baseUrl = SITE_CONFIG.url;
  const now = new Date().toISOString();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/authors`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6
    }
  ];
};

/**
 * Генерирует sitemap entries для статей
 * @param articles - массив статей
 * @returns массив URL статей
 */
export const generateArticlesSitemapEntries = (articles: Article[]): SitemapEntry[] => {
  const baseUrl = SITE_CONFIG.url;

  return articles
    .filter(article => article.status === 'published')
    .map(article => ({
      url: `${baseUrl}/article/${article.slug}`,
      lastModified: article.updatedAt || article.publishedAt,
      changeFrequency: 'weekly' as const,
      priority: article.isFeatured ? 0.9 : 0.8
    }));
};

/**
 * Генерирует sitemap entries для авторов
 * @param authors - массив авторов
 * @returns массив URL авторов
 */
export const generateAuthorsSitemapEntries = (authors: Author[]): SitemapEntry[] => {
  const baseUrl = SITE_CONFIG.url;

  return authors
    .filter(author => author.user?.username)
    .map(author => ({
      url: `${baseUrl}/author/${author.user!.username}`,
      lastModified: author.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7
    }));
};

/**
 * Генерирует sitemap entries для категорий
 * @param categories - массив категорий
 * @returns массив URL категорий
 */
export const generateCategoriesSitemapEntries = (categories: Category[]): SitemapEntry[] => {
  const baseUrl = SITE_CONFIG.url;

  return categories
    .filter(category => category.isActive)
    .map(category => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }));
};

/**
 * Генерирует полный sitemap
 * @param data - данные для генерации sitemap
 * @returns массив всех URL сайта
 */
export const generateFullSitemap = ({
  articles = [],
  authors = [],
  categories = []
}: {
  articles?: Article[];
  authors?: Author[];
  categories?: Category[];
}): SitemapEntry[] => {
  return [
    ...generateStaticSitemapEntries(),
    ...generateArticlesSitemapEntries(articles),
    ...generateAuthorsSitemapEntries(authors),
    ...generateCategoriesSitemapEntries(categories)
  ];
};

/**
 * Конвертирует sitemap entries в XML формат
 * @param entries - массив элементов sitemap
 * @returns XML строка sitemap
 */
export const generateSitemapXML = (entries: SitemapEntry[]): string => {
  const urlElements = entries.map(entry => {
    let urlXML = `  <url>\n    <loc>${entry.url}</loc>\n`;
    
    if (entry.lastModified) {
      urlXML += `    <lastmod>${entry.lastModified}</lastmod>\n`;
    }
    
    if (entry.changeFrequency) {
      urlXML += `    <changefreq>${entry.changeFrequency}</changefreq>\n`;
    }
    
    if (entry.priority !== undefined) {
      urlXML += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
    }
    
    urlXML += `  </url>`;
    return urlXML;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
};

/**
 * Генерирует robots.txt содержимое
 * @returns содержимое robots.txt
 */
export const generateRobotsTxt = (): string => {
  const baseUrl = SITE_CONFIG.url;
  
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay
Crawl-delay: 1

# Disallow admin and private pages
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /write/
Disallow: /settings/

# Allow specific pages
Allow: /api/articles
Allow: /api/authors
Allow: /api/categories
`;
}; 