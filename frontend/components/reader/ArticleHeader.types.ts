import { Article } from '@/types/Article';

/**
 * Пропсы компонента заголовка статьи
 */
export interface ArticleHeaderProps {
  readonly article: Article;
  readonly showAuthor?: boolean;
  readonly showMeta?: boolean;
}

/**
 * Конфигурация мета-информации статьи
 */
export interface ArticleMetaConfig {
  readonly showPublishDate: boolean;
  readonly showReadingTime: boolean;
  readonly showViewsCount: boolean;
  readonly showEditDate?: boolean;
}

/**
 * Данные автора для отображения в заголовке
 */
export interface ArticleAuthorDisplay {
  readonly id: string;
  readonly displayName: string;
  readonly avatar?: string;
  readonly username?: string;
  readonly isVerified?: boolean;
} 