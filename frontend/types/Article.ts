/**
 * Тип статьи в блоговой платформе
 * Основная сущность для создания и отображения контента
 */
export interface Article {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly content: string;
  readonly excerpt: string;
  readonly coverImage?: string;
  readonly publishedAt: Date;
  readonly updatedAt: Date;
  readonly readingTime: number;
  readonly viewsCount: number;
  readonly likesCount: number;
  readonly commentsCount: number;
}

/**
 * Статус публикации статьи
 */
export type ArticleStatus = 'draft' | 'published' | 'scheduled' | 'premium';

/**
 * Уровень доступа к статье
 */
export type ArticleAccessLevel = 'free' | 'premium' | 'subscription_only';

/**
 * Входные данные для создания статьи
 */
export interface ArticleInput {
  readonly title: string;
  readonly content: string;
  readonly excerpt?: string;
  readonly coverImage?: string;
  readonly status: ArticleStatus;
  readonly accessLevel: ArticleAccessLevel;
  readonly price?: number;
  readonly scheduledAt?: Date;
}

/**
 * Данные для обновления статьи
 */
export interface ArticleUpdate {
  readonly title?: string;
  readonly content?: string;
  readonly excerpt?: string;
  readonly coverImage?: string;
  readonly status?: ArticleStatus;
  readonly accessLevel?: ArticleAccessLevel;
  readonly price?: number;
}

/**
 * Параметры поиска статей
 */
export interface ArticleSearchParams {
  readonly query?: string;
  readonly categorySlug?: string;
  readonly authorId?: string;
  readonly tags?: readonly string[];
  readonly status?: ArticleStatus;
  readonly accessLevel?: ArticleAccessLevel;
  readonly limit?: number;
  readonly offset?: number;
} 