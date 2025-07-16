/**
 * UI компоненты для блоговой платформы
 * Централизованный экспорт всех базовых UI компонентов
 * Следует принципам микромодульной архитектуры
 * 
 * @module UI
 * @version 1.0.0
 */

// ==========================================
// БАЗОВЫЕ КОМПОНЕНТЫ ВВОДА
// ==========================================

// Button - универсальная кнопка с DaisyUI интеграцией
export { Button } from './Button';
export type { 
  ButtonProps, 
  ButtonVariant, 
  ButtonSize,
  ButtonState,
  ButtonClasses,
  ButtonLoadingProps,
  ButtonAnalyticsEvent 
} from './Button';

// Input - универсальное поле ввода (text, textarea, select)
export { Input } from './Input';
export type { 
  InputProps,
  TextInputProps,
  TextareaProps,
  SelectProps,
  InputType,
  InputSize,
  InputVariant,
  ValidationState,
  InputState,
  BaseInputProps,
  SelectOption,
  InputClasses,
  InputIconProps,
  InputAnalyticsEvent
} from './Input';

// ==========================================
// КОМПОНЕНТЫ ОБРАТНОЙ СВЯЗИ
// ==========================================

// Modal - модальные окна и диалоги
export { Modal, ModalFooter } from './Modal';
export type { 
  ModalProps, 
  ModalHeaderProps, 
  ModalFooterProps, 
  ModalSize 
} from './Modal';
// export type { ModalProps } from './Modal';

// Badge - бейджи для тегов и категорий
export { Badge, TagBadge, CategoryBadge } from './Badge';
export type { 
  BadgeProps, 
  TagBadgeProps, 
  CategoryBadgeProps,
  BadgeVariant,
  BadgeSize 
} from './Badge';

// Avatar - аватары авторов блога
export { Avatar, AvatarGroup } from './Avatar';
export type { 
  AvatarProps, 
  AvatarGroupProps, 
  AvatarFallbackProps,
  AvatarSize,
  AvatarStatus 
} from './Avatar';

// LoadingSpinner - спиннеры загрузки
export { LoadingSpinner, Skeleton, ProgressBar } from './LoadingSpinner';
export type { 
  LoadingSpinnerProps, 
  SkeletonProps, 
  ProgressBarProps,
  SpinnerSize,
  SpinnerVariant,
  SpinnerType 
} from './LoadingSpinner';

// ==========================================
// ВСПОМОГАТЕЛЬНЫЕ ТИПЫ И УТИЛИТЫ
// ==========================================

/**
 * Базовые размеры компонентов блоговой платформы
 */
export type UISize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Варианты цветовых схем компонентов
 */
export type UIVariant = 
  | 'primary' 
  | 'secondary' 
  | 'accent' 
  | 'success' 
  | 'warning' 
  | 'error'
  | 'ghost'
  | 'outline';

/**
 * Общие состояния UI компонентов
 */
export interface UIState {
  readonly isLoading?: boolean;
  readonly isDisabled?: boolean;
  readonly isActive?: boolean;
  readonly isVisible?: boolean;
}

/**
 * Базовые пропсы для всех UI компонентов
 */
export interface BaseUIProps {
  readonly className?: string;
  readonly id?: string;
  readonly 'data-testid'?: string;
}

/**
 * Настройки аналитики для UI компонентов
 */
export interface UIAnalytics {
  readonly event?: string;
  readonly category?: string;
  readonly label?: string;
  readonly value?: string | number;
}

// ==========================================
// УТИЛИТЫ ДЛЯ КОМПОНЕНТОВ
// ==========================================

/**
 * Объединяет CSS классы с правильной обработкой undefined
 * Микромодульная утилита для построения className
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Получает размер в пикселях для иконок по размеру компонента
 * Стандартизированные размеры для консистентности
 */
export const getIconSize = (size: UISize): number => {
  const sizeMap: Record<UISize, number> = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
  };
  return sizeMap[size];
};

/**
 * Конвертирует размер в CSS классы Tailwind
 * Для консистентности размеров иконок
 */
export const getIconClasses = (size: UISize): string => {
  const classMap: Record<UISize, string> = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };
  return classMap[size];
};

// ==========================================
// КОНСТАНТЫ ДИЗАЙН-СИСТЕМЫ
// ==========================================

/**
 * Стандартные отступы дизайн-системы
 */
export const UI_SPACING = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
} as const;

/**
 * Стандартные радиусы скругления
 */
export const UI_RADIUS = {
  none: '0',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
} as const;

/**
 * Длительности анимаций
 */
export const UI_DURATION = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
} as const; 