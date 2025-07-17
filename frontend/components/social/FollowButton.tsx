'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

/**
 * Пропсы компонента кнопки подписки
 */
interface FollowButtonProps {
  readonly authorId: string;
  readonly isFollowing?: boolean;
  readonly followersCount?: number;
  readonly onToggleFollow: (authorId: string) => Promise<void>;
  readonly disabled?: boolean;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly variant?: 'default' | 'outline' | 'minimal';
  readonly showCount?: boolean;
  readonly fullWidth?: boolean;
}

/**
 * Компонент кнопки подписки на автора
 * Поддерживает различные состояния и варианты отображения
 * @param authorId - ID автора
 * @param isFollowing - подписан ли пользователь на автора
 * @param followersCount - количество подписчиков
 * @param onToggleFollow - обработчик переключения подписки
 * @param disabled - отключена ли кнопка
 * @param size - размер кнопки
 * @param variant - вариант отображения
 * @param showCount - показывать ли количество подписчиков
 * @param fullWidth - растянуть кнопку на всю ширину
 * @returns JSX элемент кнопки подписки
 */
export const FollowButton = ({
  authorId,
  isFollowing = false,
  followersCount = 0,
  onToggleFollow,
  disabled = false,
  size = 'md',
  variant = 'default',
  showCount = false,
  fullWidth = false
}: FollowButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);

    try {
      await onToggleFollow(authorId);
    } catch (error) {
      console.error('Ошибка при переключении подписки:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Определяем текст и вариант кнопки в зависимости от состояния
  const getButtonProps = () => {
    if (isLoading) {
      return {
        text: 'Загрузка...',
        variant: isFollowing ? 'outline' : 'primary',
        icon: null
      };
    }

    if (isFollowing) {
      return {
        text: isHovered ? 'Отписаться' : 'Подписан',
        variant: isHovered ? 'outline' : 'primary',
        icon: isHovered ? '−' : '✓'
      };
    }

    return {
      text: 'Подписаться',
      variant: variant === 'minimal' ? 'outline' : 'primary',
      icon: '+'
    };
  };

  const { text, variant: buttonVariant, icon } = getButtonProps();

  // Дополнительные стили для hover состояния при отписке
  const hoverClasses = isFollowing && isHovered 
    ? 'border-red-300 text-red-600 hover:bg-red-50' 
    : '';

  return (
    <div className={`${fullWidth ? 'w-full' : 'inline-block'}`}>
      <Button
        onClick={handleClick}
        disabled={disabled || isLoading}
        size={size}
        variant={buttonVariant as any}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          ${fullWidth ? 'w-full justify-center' : ''}
          ${hoverClasses}
          transition-all duration-200
        `}
      >
        <div className="flex items-center gap-2">
          {/* Иконка */}
          {icon && (
            <span className="text-sm font-bold">
              {icon}
            </span>
          )}

          {/* Текст кнопки */}
          <span>
            {text}
          </span>

          {/* Счетчик подписчиков */}
          {showCount && (
            <span className="text-xs opacity-75">
              ({followersCount})
            </span>
          )}
        </div>
      </Button>

      {/* Дополнительная информация под кнопкой */}
      {showCount && !fullWidth && (
        <div className="text-center mt-1">
          <span className="text-xs text-gray-500">
            {followersCount} подписчиков
          </span>
        </div>
      )}
    </div>
  );
}; 