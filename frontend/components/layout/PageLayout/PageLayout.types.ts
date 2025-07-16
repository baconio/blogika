/**
 * Типы для PageLayout компонента
 */

import type { ReactNode } from 'react';
import type { HeaderProps } from '../Header';
import type { FooterProps } from '../Footer';
import type { User } from '@/types';

/**
 * Пропсы компонента PageLayout
 */
export interface PageLayoutProps {
  readonly children: ReactNode;
  readonly currentUser?: User;
  readonly className?: string;
  readonly headerProps?: Partial<HeaderProps>;
  readonly footerProps?: Partial<FooterProps>;
  readonly showBreadcrumbs?: boolean;
  readonly breadcrumbs?: readonly BreadcrumbItem[];
}

/**
 * Элемент хлебных крошек
 */
export interface BreadcrumbItem {
  readonly label: string;
  readonly href?: string;
  readonly isActive?: boolean;
}

/**
 * Варианты layout для разных типов страниц
 */
export type PageLayoutVariant = 'default' | 'centered' | 'wide' | 'sidebar';

/**
 * Опции для отображения хлебных крошек
 */
export interface BreadcrumbsProps {
  readonly items: readonly BreadcrumbItem[];
  readonly className?: string;
} 