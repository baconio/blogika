'use client';

import { useState } from 'react';

/**
 * Пропсы компонента кнопки лайка
 */
interface LikeButtonProps {
  readonly itemId: string;
  readonly itemType: 'article' | 'comment';
  readonly isLiked?: boolean;
  readonly likesCount?: number;
  readonly onToggleLike: (itemId: string, itemType: 'article' | 'comment') => Promise<void>;
  readonly disabled?: boolean;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly variant?: 'default' | 'minimal';
  readonly showCount?: boolean;
}

/**
 * Компонент кнопки лайка с анимацией
 * Поддерживает лайки для статей и комментариев
 * @param itemId - ID элемента (статьи или комментария)
 * @param itemType - тип элемента
 * @param isLiked - состояние лайка
 * @param likesCount - количество лайков
 * @param onToggleLike - обработчик переключения лайка
 * @param disabled - отключена ли кнопка
 * @param size - размер кнопки
 * @param variant - вариант отображения
 * @param showCount - показывать ли счетчик
 * @returns JSX элемент кнопки лайка
 */
export const LikeButton = ({
  itemId,
  itemType,
  isLiked = false,
  likesCount = 0,
  onToggleLike,
  disabled = false,
  size = 'md',
  variant = 'default',
  showCount = true
}: LikeButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    setIsAnimating(true);

    try {
      await onToggleLike(itemId, itemType);
    } catch (error) {
      console.error('Ошибка при переключении лайка:', error);
    } finally {
      setIsLoading(false);
      // Анимация завершается через 300ms
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  // Размеры в зависимости от size
  const sizeClasses = {
    sm: {
      button: 'p-1',
      icon: 'w-4 h-4',
      text: 'text-xs'
    },
    md: {
      button: 'p-2',
      icon: 'w-5 h-5',
      text: 'text-sm'
    },
    lg: {
      button: 'p-3',
      icon: 'w-6 h-6',
      text: 'text-base'
    }
  };

  const currentSize = sizeClasses[size];

  // Стили в зависимости от варианта
  const variantClasses = variant === 'minimal'
    ? 'hover:bg-red-50'
    : 'border border-gray-200 hover:border-red-300 hover:bg-red-50 rounded-lg';

  const iconColor = isLiked 
    ? 'text-red-500' 
    : disabled 
      ? 'text-gray-300' 
      : 'text-gray-400 hover:text-red-500';

  const textColor = isLiked 
    ? 'text-red-600' 
    : disabled 
      ? 'text-gray-300' 
      : 'text-gray-600';

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center gap-2 transition-all duration-200
        ${variantClasses}
        ${currentSize.button}
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${isAnimating ? 'scale-110' : 'scale-100'}
      `}
      title={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
    >
      {/* Иконка сердца */}
      <div className={`relative ${currentSize.icon}`}>
        {isLiked ? (
          // Заполненное сердце
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`${currentSize.icon} ${iconColor} transition-all duration-200 ${
              isAnimating ? 'animate-pulse' : ''
            }`}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ) : (
          // Контурное сердце
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className={`${currentSize.icon} ${iconColor} transition-all duration-200`}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        )}

        {/* Анимация при клике */}
        {isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${currentSize.icon} bg-red-500 rounded-full animate-ping opacity-75`} />
          </div>
        )}
      </div>

      {/* Счетчик лайков */}
      {showCount && (
        <span className={`font-medium ${currentSize.text} ${textColor} transition-colors duration-200`}>
          {likesCount}
        </span>
      )}

      {/* Индикатор загрузки */}
      {isLoading && (
        <div className={`${currentSize.icon}`}>
          <div className="w-full h-full border-2 border-red-200 border-t-red-500 rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
}; 