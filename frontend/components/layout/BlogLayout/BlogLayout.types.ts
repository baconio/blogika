/**
 * Типы для BlogLayout компонента
 */

import type { ReactNode } from 'react';
import type { PageLayoutProps } from '../PageLayout';
import type { Article, Category, Tag } from '@/types';

/**
 * Пропсы компонента BlogLayout
 */
export interface BlogLayoutProps extends Omit<PageLayoutProps, 'children'> {
  readonly children: ReactNode;
  readonly sidebar?: 'left' | 'right' | 'none';
  readonly sidebarContent?: SidebarContent;
  readonly variant?: BlogLayoutVariant;
}

/**
 * Варианты BlogLayout
 */
export type BlogLayoutVariant = 'article' | 'list' | 'category' | 'author';

/**
 * Контент для сайдбара
 */
export interface SidebarContent {
  readonly showCategories?: boolean;
  readonly showTags?: boolean;
  readonly showPopularArticles?: boolean;
  readonly showRecentArticles?: boolean;
  readonly categories?: readonly Category[];
  readonly tags?: readonly Tag[];
  readonly popularArticles?: readonly Article[];
  readonly recentArticles?: readonly Article[];
}

/**
 * Конфигурация сайдбара по умолчанию для разных вариантов
 */
export const DEFAULT_SIDEBAR_CONFIG: Record<BlogLayoutVariant, SidebarContent> = {
  article: {
    showCategories: true,
    showTags: true,
    showPopularArticles: true,
    showRecentArticles: false,
  },
  list: {
    showCategories: true,
    showTags: true,
    showPopularArticles: false,
    showRecentArticles: true,
  },
  category: {
    showCategories: false,
    showTags: true,
    showPopularArticles: true,
    showRecentArticles: false,
  },
  author: {
    showCategories: true,
    showTags: false,
    showPopularArticles: true,
    showRecentArticles: true,
  },
} as const; 