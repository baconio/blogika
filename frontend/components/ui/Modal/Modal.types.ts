/**
 * Типы для Modal компонента
 * Поддерживает DaisyUI классы и композицию
 */

import { ReactNode } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  /** Открыт ли модал */
  readonly isOpen: boolean;
  
  /** Функция закрытия модала */
  readonly onClose: () => void;
  
  /** Заголовок модала */
  readonly title?: string;
  
  /** Содержимое модала */
  readonly children: ReactNode;
  
  /** Размер модала */
  readonly size?: ModalSize;
  
  /** Можно ли закрыть модал кликом по backdrop */
  readonly closeOnBackdrop?: boolean;
  
  /** Можно ли закрыть модал нажатием Escape */
  readonly closeOnEscape?: boolean;
  
  /** Показывать ли кнопку закрытия */
  readonly showCloseButton?: boolean;
  
  /** Дополнительные CSS классы */
  readonly className?: string;
  
  /** Аналитика - название события */
  readonly analyticsEvent?: string;
  
  /** Аналитика - дополнительные данные */
  readonly analyticsData?: Record<string, unknown>;
}

export interface ModalHeaderProps {
  /** Заголовок */
  readonly title: string;
  
  /** Функция закрытия */
  readonly onClose: () => void;
  
  /** Показывать ли кнопку закрытия */
  readonly showCloseButton: boolean;
}

export interface ModalFooterProps {
  /** Содержимое футера */
  readonly children: ReactNode;
  
  /** Дополнительные CSS классы */
  readonly className?: string;
} 