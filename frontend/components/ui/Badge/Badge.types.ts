/**
 * Типы для Badge компонента
 * Идеально для тегов и категорий блога
 */

import { ReactNode } from 'react';

export type BadgeVariant = 
  | 'default' 
  | 'primary' 
  | 'secondary' 
  | 'accent' 
  | 'ghost' 
  | 'outline'
  | 'success'
  | 'warning' 
  | 'error'
  | 'info';

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

export interface BadgeProps {
  /** Содержимое бейджа */
  readonly children: ReactNode;
  
  /** Вариант стиля */
  readonly variant?: BadgeVariant;
  
  /** Размер бейджа */
  readonly size?: BadgeSize;
  
  /** Кликабельный ли бейдж */
  readonly clickable?: boolean;
  
  /** Функция клика */
  readonly onClick?: () => void;
  
  /** Можно ли удалить бейдж */
  readonly removable?: boolean;
  
  /** Функция удаления */
  readonly onRemove?: () => void;
  
  /** Дополнительные CSS классы */
  readonly className?: string;
  
  /** Аналитика - название события */
  readonly analyticsEvent?: string;
  
  /** Аналитика - дополнительные данные */
  readonly analyticsData?: Record<string, unknown>;
  
  /** ARIA метки для доступности */
  readonly ariaLabel?: string;
}

export interface TagBadgeProps extends Omit<BadgeProps, 'children'> {
  /** Название тега */
  readonly tag: string;
  
  /** Количество использований */
  readonly count?: number;
}

export interface CategoryBadgeProps extends Omit<BadgeProps, 'children'> {
  /** Название категории */
  readonly category: string;
  
  /** Цвет категории */
  readonly color?: string;
} 