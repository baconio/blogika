'use client';

import { useState } from 'react';

/**
 * Пропсы компонента кнопки закладки
 */
interface BookmarkButtonProps {
  readonly articleId: string;
  readonly isBookmarked?: boolean;
  readonly onToggleBookmark: (articleId: string) => Promise<void>;
  readonly disabled?: boolean;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly variant?: 'default' | 'minimal';
  readonly showLabel?: boolean;
}

/**
 * Компонент кнопки добавления в закладки
 * Позволяет сохранять статьи для последующего чтения
 * @param articleId - ID статьи
 * @param isBookmarked - добавлена ли статья в закладки
 * @param onToggleBookmark - обработчик переключения закладки
 * @param disabled - отключена ли кнопка
 * @param size - размер кнопки
 * @param variant - вариант отображения
 * @param showLabel - показывать ли текстовую метку
 * @returns JSX элемент кнопки закладки
 */
export const BookmarkButton = ({
  articleId,
  isBookmarked = false,
  onToggleBookmark,
  disabled = false,
  size = 'md',
  variant = 'default',
  showLabel = false
}: BookmarkButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    setIsAnimating(true);

    try {
      await onToggleBookmark(articleId);
    } catch (error) {
      console.error('Ошибка при переключении закладки:', error);
    } finally {
      setIsLoading(false);
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
    ? 'hover:bg-blue-50'
    : 'border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-lg';

  const iconColor = isBookmarked 
    ? 'text-blue-500' 
    : disabled 
      ? 'text-gray-300' 
      : 'text-gray-400 hover:text-blue-500';

  const textColor = isBookmarked 
    ? 'text-blue-600' 
    : disabled 
      ? 'text-gray-300' 
      : 'text-gray-600';

  const label = isBookmarked ? 'Убрать из закладок' : 'В закладки';

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
      title={label}
    >
      {/* Иконка закладки */}
      <div className={`relative ${currentSize.icon}`}>
        {isBookmarked ? (
          // Заполненная закладка
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`${currentSize.icon} ${iconColor} transition-all duration-200 ${
              isAnimating ? 'animate-bounce' : ''
            }`}
          >
            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
          </svg>
        ) : (
          // Контурная закладка
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className={`${currentSize.icon} ${iconColor} transition-all duration-200`}
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        )}

        {/* Анимация при клике */}
        {isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${currentSize.icon} bg-blue-500 rounded-full animate-ping opacity-75`} />
          </div>
        )}
      </div>

      {/* Текстовая метка */}
      {showLabel && (
        <span className={`font-medium ${currentSize.text} ${textColor} transition-colors duration-200`}>
          {label}
        </span>
      )}

      {/* Индикатор загрузки */}
      {isLoading && (
        <div className={`${currentSize.icon}`}>
          <div className="w-full h-full border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
}; 