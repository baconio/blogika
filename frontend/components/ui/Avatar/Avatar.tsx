/**
 * Avatar компонент для авторов блога
 * Поддерживает статусы, группировки и fallback с инициалами
 */

'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '../index';
import type { AvatarProps, AvatarGroupProps, AvatarFallbackProps, AvatarSize, AvatarStatus } from './Avatar.types';

/**
 * Получить CSS классы для размера аватара
 */
const getAvatarSizeClass = (size: AvatarSize): string => {
  const sizeClasses: Record<AvatarSize, string> = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24'
  };
  return sizeClasses[size];
};

/**
 * Получить CSS классы для формы аватара
 */
const getAvatarShapeClass = (shape: 'circle' | 'square' | 'rounded'): string => {
  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg'
  };
  return shapeClasses[shape];
};

/**
 * Получить цвет индикатора статуса
 */
const getStatusColor = (status: AvatarStatus): string => {
  const statusColors: Record<AvatarStatus, string> = {
    online: 'bg-success',
    offline: 'bg-base-300',
    away: 'bg-warning',
    busy: 'bg-error'
  };
  return statusColors[status];
};

/**
 * Получить инициалы из имени
 */
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};

/**
 * Fallback компонент с инициалами
 */
const AvatarFallback: React.FC<AvatarFallbackProps> = ({ 
  name, 
  size, 
  shape, 
  className 
}) => {
  const initials = getInitials(name);
  const fontSize = size === 'xs' || size === 'sm' ? 'text-xs' : 
                   size === 'md' ? 'text-sm' :
                   size === 'lg' ? 'text-base' : 'text-lg';

  return (
    <div 
      className={cn(
        'avatar placeholder',
        getAvatarSizeClass(size),
        getAvatarShapeClass(shape),
        'bg-neutral text-neutral-content flex items-center justify-center',
        fontSize,
        className
      )}
    >
      <span>{initials}</span>
    </div>
  );
};

/**
 * Основной компонент Avatar
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  shape = 'circle',
  status,
  showStatus = false,
  clickable = false,
  onClick,
  className,
  loading = false,
  analyticsEvent,
  analyticsData
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(!!src);

  /**
   * Обработка ошибки загрузки изображения
   */
  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoading(false);
  }, []);

  /**
   * Обработка успешной загрузки изображения
   */
  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  /**
   * Обработка клика с аналитикой
   */
  const handleClick = useCallback(() => {
    if (analyticsEvent && typeof window !== 'undefined') {
      console.log('Avatar clicked:', analyticsEvent, analyticsData);
    }
    onClick?.();
  }, [onClick, analyticsEvent, analyticsData]);

  const avatarClasses = cn(
    'avatar',
    {
      'cursor-pointer hover:opacity-80 transition-opacity': clickable,
      'opacity-50': loading
    },
    className
  );

  // Показываем fallback если нет src, есть ошибка загрузки или загружается
  if (!src || imageError) {
    return (
      <div className={avatarClasses} onClick={clickable ? handleClick : undefined}>
        <AvatarFallback name={alt} size={size} shape={shape} />
        {showStatus && status && (
          <span 
            className={cn(
              'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-100',
              getStatusColor(status)
            )}
          />
        )}
      </div>
    );
  }

  return (
    <div className={avatarClasses} onClick={clickable ? handleClick : undefined}>
      <div className={cn(getAvatarSizeClass(size), getAvatarShapeClass(shape), 'relative')}>
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover',
            getAvatarShapeClass(shape),
            { 'opacity-0': imageLoading }
          )}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
        
        {imageLoading && (
          <div className={cn(
            'absolute inset-0 flex items-center justify-center bg-base-200',
            getAvatarShapeClass(shape)
          )}>
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        )}
        
        {showStatus && status && (
          <span 
            className={cn(
              'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-100',
              getStatusColor(status)
            )}
          />
        )}
      </div>
    </div>
  );
};

/**
 * Группа аватаров
 */
export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  size = 'md',
  shape = 'circle',
  max = 5,
  className
}) => {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={cn('avatar-group -space-x-6', className)}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          size={size}
          shape={shape}
          {...avatar}
        />
      ))}
      
      {remainingCount > 0 && (
        <div className={cn('avatar placeholder', getAvatarSizeClass(size))}>
          <div className={cn(
            'bg-neutral text-neutral-content flex items-center justify-center',
            getAvatarShapeClass(shape)
          )}>
            <span className="text-xs">+{remainingCount}</span>
          </div>
        </div>
      )}
    </div>
  );
}; 