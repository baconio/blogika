import type { User } from './User';

/**
 * Автор блога - расширение пользователя с дополнительными полями
 * Содержит информацию о публикациях и монетизации
 */
export interface Author extends User {
  readonly displayName: string;
  readonly bio?: string;
  readonly coverImage?: string;
  readonly socialLinks: SocialLinks;
  readonly isVerified: boolean;
  readonly subscriberCount: number;
  readonly totalEarnings: number;
  readonly subscriptionPrice: number;
  readonly contentAccessLevel: ContentAccessLevel;
}

/**
 * Социальные ссылки автора
 */
export interface SocialLinks {
  readonly twitter?: string;
  readonly telegram?: string;
  readonly youtube?: string;
  readonly instagram?: string;
  readonly github?: string;
  readonly website?: string;
}

/**
 * Уровни доступа к контенту автора
 */
export type ContentAccessLevel = 'free' | 'premium' | 'subscription';

/**
 * Данные для создания профиля автора
 */
export interface AuthorProfileData {
  readonly displayName: string;
  readonly bio?: string;
  readonly coverImage?: string;
  readonly socialLinks: Partial<SocialLinks>;
  readonly subscriptionPrice: number;
  readonly contentAccessLevel: ContentAccessLevel;
}

/**
 * Статистика автора
 */
export interface AuthorStats {
  readonly articlesCount: number;
  readonly publishedCount: number;
  readonly draftCount: number;
  readonly totalViews: number;
  readonly totalLikes: number;
  readonly subscriberCount: number;
  readonly monthlyEarnings: number;
  readonly totalEarnings: number;
}

/**
 * Настройки аналитики автора
 */
export interface AuthorAnalyticsSettings {
  readonly emailReports: boolean;
  readonly weeklyDigest: boolean;
  readonly realtimeNotifications: boolean;
  readonly publicStats: boolean;
} 