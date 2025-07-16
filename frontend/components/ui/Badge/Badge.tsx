/**
 * Badge компонент для тегов и категорий блога
 * Поддерживает различные варианты и интерактивность
 */

'use client';

import React, { useCallback } from 'react';
import { cn } from '../index';
import type { BadgeProps, TagBadgeProps, CategoryBadgeProps, BadgeVariant, BadgeSize } from './Badge.types';

/**
 * Получить CSS классы для варианта бейджа
 */
const getBadgeVariantClass = (variant: BadgeVariant): string => {
  const variantClasses: Record<BadgeVariant, string> = {
    default: 'badge-neutral',
    primary: 'badge-primary',
    secondary: 'badge-secondary', 
    accent: 'badge-accent',
    ghost: 'badge-ghost',
    outline: 'badge-outline',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info'
  };
  return variantClasses[variant];
};

/**
 * Получить CSS классы для размера бейджа
 */
const getBadgeSizeClass = (size: BadgeSize): string => {
  const sizeClasses: Record<BadgeSize, string> = {
    xs: 'badge-xs',
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg'
  };
  return sizeClasses[size];
};

/**
 * Основной компонент Badge
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  clickable = false,
  onClick,
  removable = false,
  onRemove,
  className,
  analyticsEvent,
  analyticsData,
  ariaLabel
}) => {
  /**
   * Обработка клика с аналитикой
   */
  const handleClick = useCallback(() => {
    if (analyticsEvent && typeof window !== 'undefined') {
      console.log('Badge clicked:', analyticsEvent, analyticsData);
    }
    onClick?.();
  }, [onClick, analyticsEvent, analyticsData]);

  /**
   * Обработка удаления с аналитикой
   */
  const handleRemove = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    if (analyticsEvent && typeof window !== 'undefined') {
      console.log('Badge removed:', analyticsEvent, analyticsData);
    }
    onRemove?.();
  }, [onRemove, analyticsEvent, analyticsData]);

  const badgeClasses = cn(
    'badge',
    getBadgeVariantClass(variant),
    getBadgeSizeClass(size),
    {
      'cursor-pointer hover:opacity-80 transition-opacity': clickable,
      'gap-2': removable
    },
    className
  );

  const TagElement = clickable ? 'button' : 'span';

  return (
    <TagElement
      className={badgeClasses}
      onClick={clickable ? handleClick : undefined}
      aria-label={ariaLabel}
      type={clickable ? 'button' : undefined}
    >
      {children}
      {removable && (
        <button
          className="btn btn-ghost btn-circle btn-xs ml-1"
          onClick={handleRemove}
          aria-label="Удалить бейдж"
        >
          ✕
        </button>
      )}
    </TagElement>
  );
};

/**
 * Специализированный бейдж для тегов
 */
export const TagBadge: React.FC<TagBadgeProps> = ({
  tag,
  count,
  variant = 'outline',
  ...props
}) => (
  <Badge variant={variant} {...props}>
    {tag}
    {count !== undefined && (
      <span className="ml-1 text-xs opacity-75">
        {count}
      </span>
    )}
  </Badge>
);

/**
 * Специализированный бейдж для категорий
 */
export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  color,
  variant = 'primary',
  ...props
}) => {
  const badgeStyle = color ? { 
    backgroundColor: color,
    borderColor: color,
    color: 'white'
  } : {};

  return (
    <Badge 
      variant={variant} 
      className="font-medium"
      style={badgeStyle}
      {...props}
    >
      {category}
    </Badge>
  );
}; 