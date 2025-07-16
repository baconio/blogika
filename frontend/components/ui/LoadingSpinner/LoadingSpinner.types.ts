/**
 * Типы для LoadingSpinner компонента
 * Поддерживает различные состояния загрузки
 */

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type SpinnerVariant = 
  | 'default' 
  | 'primary' 
  | 'secondary' 
  | 'accent' 
  | 'success' 
  | 'warning' 
  | 'error'
  | 'info';

export type SpinnerType = 'spinner' | 'dots' | 'ring' | 'ball' | 'bars';

export interface LoadingSpinnerProps {
  /** Размер спиннера */
  readonly size?: SpinnerSize;
  
  /** Вариант цвета */
  readonly variant?: SpinnerVariant;
  
  /** Тип анимации */
  readonly type?: SpinnerType;
  
  /** Текст загрузки */
  readonly text?: string;
  
  /** Показывать ли текст */
  readonly showText?: boolean;
  
  /** Расположение текста */
  readonly textPosition?: 'bottom' | 'right' | 'top' | 'left';
  
  /** Полноэкранный режим */
  readonly fullScreen?: boolean;
  
  /** Накладывать ли оверлей */
  readonly overlay?: boolean;
  
  /** Дополнительные CSS классы */
  readonly className?: string;
  
  /** ARIA метка для доступности */
  readonly ariaLabel?: string;
}

export interface SkeletonProps {
  /** Ширина скелетона */
  readonly width?: string | number;
  
  /** Высота скелетона */
  readonly height?: string | number;
  
  /** Форма скелетона */
  readonly shape?: 'rectangle' | 'circle' | 'text';
  
  /** Количество строк (для типа text) */
  readonly lines?: number;
  
  /** Анимировать ли скелетон */
  readonly animate?: boolean;
  
  /** Дополнительные CSS классы */
  readonly className?: string;
}

export interface ProgressBarProps {
  /** Значение прогресса (0-100) */
  readonly value: number;
  
  /** Максимальное значение */
  readonly max?: number;
  
  /** Размер прогресс-бара */
  readonly size?: SpinnerSize;
  
  /** Вариант цвета */
  readonly variant?: SpinnerVariant;
  
  /** Показывать ли процент */
  readonly showPercent?: boolean;
  
  /** Текст прогресса */
  readonly text?: string;
  
  /** Дополнительные CSS классы */
  readonly className?: string;
  
  /** ARIA метка для доступности */
  readonly ariaLabel?: string;
} 