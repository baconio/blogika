/**
 * Типы для Header компонента блоговой платформы
 */

import type { User } from '@/types';

/**
 * Элемент навигации в Header
 */
export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly icon?: string;
  readonly isExternal?: boolean;
}

/**
 * Пропсы компонента Header
 */
export interface HeaderProps {
  readonly currentUser?: User;
  readonly className?: string;
  readonly hideSearch?: boolean;
  readonly variant?: 'default' | 'minimal' | 'transparent';
}

/**
 * Элементы главной навигации блога
 */
export const MAIN_NAV_ITEMS: readonly NavItem[] = [
  { label: 'Главная', href: '/' },
  { label: 'Статьи', href: '/articles' },
  { label: 'Авторы', href: '/authors' },
  { label: 'Категории', href: '/categories' },
] as const;

/**
 * Состояния Header для разных страниц
 */
export type HeaderVariant = 'default' | 'minimal' | 'transparent'; 