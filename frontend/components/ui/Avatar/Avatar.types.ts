/**
 * Типы для Avatar компонента
 * Специально для авторов блога
 */

import { ReactNode } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';

export interface AvatarProps {
  /** URL изображения аватара */
  readonly src?: string;
  
  /** Альтернативный текст */
  readonly alt: string;
  
  /** Размер аватара */
  readonly size?: AvatarSize;
  
  /** Форма аватара */
  readonly shape?: 'circle' | 'square' | 'rounded';
  
  /** Статус пользователя */
  readonly status?: AvatarStatus;
  
  /** Показывать ли индикатор статуса */
  readonly showStatus?: boolean;
  
  /** Кликабельный ли аватар */
  readonly clickable?: boolean;
  
  /** Функция клика */
  readonly onClick?: () => void;
  
  /** Дополнительные CSS классы */
  readonly className?: string;
  
  /** Загружается ли изображение */
  readonly loading?: boolean;
  
  /** Аналитика - название события */
  readonly analyticsEvent?: string;
  
  /** Аналитика - дополнительные данные */
  readonly analyticsData?: Record<string, unknown>;
}

export interface AvatarGroupProps {
  /** Массив аватаров */
  readonly avatars: Array<Omit<AvatarProps, 'size' | 'shape'>>;
  
  /** Размер всех аватаров в группе */
  readonly size?: AvatarSize;
  
  /** Форма всех аватаров в группе */
  readonly shape?: 'circle' | 'square' | 'rounded';
  
  /** Максимальное количество видимых аватаров */
  readonly max?: number;
  
  /** Дополнительные CSS классы */
  readonly className?: string;
}

export interface AvatarFallbackProps {
  /** Имя пользователя для инициалов */
  readonly name: string;
  
  /** Размер аватара */
  readonly size: AvatarSize;
  
  /** Форма аватара */
  readonly shape: 'circle' | 'square' | 'rounded';
  
  /** Дополнительные CSS классы */
  readonly className?: string;
} 