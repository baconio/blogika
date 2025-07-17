import { Article } from '@/types/Article';

/**
 * Пропсы компонента отображения статьи
 */
export interface ArticleViewProps {
  readonly article: Article;
  readonly relatedArticles?: Article[];
  readonly showRelated?: boolean;
  readonly showProgress?: boolean;
  readonly showShare?: boolean;
}

/**
 * Конфигурация отображения статьи
 */
export interface ArticleDisplayConfig {
  readonly showAuthor: boolean;
  readonly showDate: boolean;
  readonly showReadingTime: boolean;
  readonly showTags: boolean;
  readonly showCategory: boolean;
  readonly showStats: boolean;
} 