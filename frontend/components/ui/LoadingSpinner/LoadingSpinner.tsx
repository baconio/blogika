/**
 * LoadingSpinner компонент с различными типами анимации
 * Включает спиннеры, скелетоны и прогресс-бары
 */

'use client';

import React from 'react';
import { cn } from '../index';
import type { 
  LoadingSpinnerProps, 
  SkeletonProps, 
  ProgressBarProps,
  SpinnerSize,
  SpinnerVariant,
  SpinnerType
} from './LoadingSpinner.types';

/**
 * Получить CSS классы для размера спиннера
 */
const getSpinnerSizeClass = (size: SpinnerSize): string => {
  const sizeClasses: Record<SpinnerSize, string> = {
    xs: 'loading-xs',
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg',
    xl: 'w-16 h-16'
  };
  return sizeClasses[size];
};

/**
 * Получить CSS классы для варианта спиннера
 */
const getSpinnerVariantClass = (variant: SpinnerVariant): string => {
  const variantClasses: Record<SpinnerVariant, string> = {
    default: 'text-base-content',
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-info'
  };
  return variantClasses[variant];
};

/**
 * Получить CSS классы для типа спиннера
 */
const getSpinnerTypeClass = (type: SpinnerType): string => {
  const typeClasses: Record<SpinnerType, string> = {
    spinner: 'loading-spinner',
    dots: 'loading-dots',
    ring: 'loading-ring',
    ball: 'loading-ball',
    bars: 'loading-bars'
  };
  return typeClasses[type];
};

/**
 * Основной компонент LoadingSpinner
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  type = 'spinner',
  text,
  showText = false,
  textPosition = 'bottom',
  fullScreen = false,
  overlay = false,
  className,
  ariaLabel = 'Загрузка...'
}) => {
  const spinnerClasses = cn(
    'loading',
    getSpinnerSizeClass(size),
    getSpinnerVariantClass(variant),
    getSpinnerTypeClass(type),
    className
  );

  const textClasses = cn(
    'text-sm',
    getSpinnerVariantClass(variant),
    {
      'mt-2': textPosition === 'bottom',
      'mb-2': textPosition === 'top',
      'ml-2': textPosition === 'right',
      'mr-2': textPosition === 'left'
    }
  );

  const containerClasses = cn(
    'flex items-center justify-center',
    {
      'flex-col': textPosition === 'bottom' || textPosition === 'top',
      'flex-row': textPosition === 'left' || textPosition === 'right',
      'flex-row-reverse': textPosition === 'left',
      'flex-col-reverse': textPosition === 'top',
      'fixed inset-0 z-50': fullScreen,
      'bg-base-100/80 backdrop-blur-sm': overlay || fullScreen
    }
  );

  const content = (
    <div className={containerClasses}>
      <span className={spinnerClasses} aria-label={ariaLabel} />
      {(showText || text) && (
        <span className={textClasses}>
          {text || 'Загрузка...'}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return content;
  }

  return content;
};

/**
 * Компонент Skeleton для имитации загружающегося контента
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  shape = 'rectangle',
  lines = 1,
  animate = true,
  className
}) => {
  const baseClasses = cn(
    'bg-base-300',
    {
      'animate-pulse': animate,
      'rounded-full': shape === 'circle',
      'rounded': shape === 'rectangle',
      'rounded-sm': shape === 'text'
    },
    className
  );

  if (shape === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(baseClasses, 'h-4')}
            style={{ 
              width: index === lines - 1 ? '75%' : width 
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={baseClasses}
      style={{ width, height }}
    />
  );
};

/**
 * Компонент ProgressBar для отображения прогресса
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showPercent = false,
  text,
  className,
  ariaLabel = 'Прогресс выполнения'
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const progressClasses = cn(
    'progress',
    getSpinnerVariantClass(variant),
    {
      'progress-xs': size === 'xs',
      'progress-sm': size === 'sm',
      'progress-md': size === 'md',
      'progress-lg': size === 'lg',
      'progress-xl': size === 'xl'
    },
    className
  );

  return (
    <div className="w-full">
      {(text || showPercent) && (
        <div className="flex justify-between items-center mb-1">
          {text && <span className="text-sm font-medium">{text}</span>}
          {showPercent && (
            <span className="text-sm text-base-content/70">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <progress
        className={progressClasses}
        value={value}
        max={max}
        aria-label={ariaLabel}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
    </div>
  );
}; 