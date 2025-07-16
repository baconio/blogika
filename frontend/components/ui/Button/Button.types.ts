import { ReactNode, ButtonHTMLAttributes } from 'react';

/**
 * Доступные варианты кнопки для блоговой платформы
 * Интегрированы с DaisyUI классами
 */
export type ButtonVariant = 
  | 'primary'     // Основная кнопка (публикация, подписка) - DaisyUI btn-primary
  | 'secondary'   // Вторичная кнопка (отмена, настройки) - DaisyUI btn-secondary  
  | 'accent'      // Акцентная кнопка (лайки, избранное) - DaisyUI btn-accent
  | 'outline'     // Кнопка с обводкой (теги, фильтры) - DaisyUI btn-outline
  | 'ghost'       // Прозрачная кнопка (навигация) - DaisyUI btn-ghost
  | 'link'        // Кнопка-ссылка - DaisyUI btn-link
  | 'success'     // Успешные действия - DaisyUI btn-success
  | 'warning'     // Предупреждения - DaisyUI btn-warning
  | 'error';      // Опасные действия - DaisyUI btn-error

/**
 * Доступные размеры кнопки (DaisyUI размеры)
 */
export type ButtonSize = 
  | 'xs'          // btn-xs - очень маленькая (теги, бейджи)
  | 'sm'          // btn-sm - маленькая (действия в карточках)
  | 'md'          // btn-md - средняя (основные действия)
  | 'lg'          // btn-lg - большая (CTA кнопки)
  | 'xl';         // btn-xl - очень большая (главные действия)

/**
 * Состояния кнопки для блоговой платформы
 */
export interface ButtonState {
  readonly isLoading?: boolean;
  readonly isDisabled?: boolean;
  readonly isActive?: boolean;
  readonly isWide?: boolean;      // DaisyUI btn-wide
  readonly isBlock?: boolean;     // DaisyUI btn-block (полная ширина)
  readonly isCircle?: boolean;    // DaisyUI btn-circle
  readonly isSquare?: boolean;    // DaisyUI btn-square
}

/**
 * Пропсы для Button компонента
 * Extends HTML button attributes для полной совместимости
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonState {
  /**
   * Вариант оформления кнопки
   * @default 'primary'
   */
  readonly variant?: ButtonVariant;

  /**
   * Размер кнопки
   * @default 'md'
   */
  readonly size?: ButtonSize;

  /**
   * Контент кнопки (текст, иконки, компоненты)
   */
  readonly children: ReactNode;

  /**
   * Иконка слева от текста
   */
  readonly leftIcon?: ReactNode;

  /**
   * Иконка справа от текста
   */
  readonly rightIcon?: ReactNode;

  /**
   * Кастомные CSS классы (дополняют DaisyUI классы)
   */
  readonly className?: string;

  /**
   * Текст для loading состояния
   * @default 'Загрузка...'
   */
  readonly loadingText?: string;

  /**
   * Позиция loading спиннера
   * @default 'start'
   */
  readonly loadingPosition?: 'start' | 'end' | 'replace';

  /**
   * Аналитические данные для трекинга
   */
  readonly analytics?: {
    readonly event?: string;
    readonly category?: string;
    readonly label?: string;
  };
}

/**
 * Конфигурация DaisyUI классов для кнопки
 */
export interface ButtonClasses {
  readonly base: string;
  readonly variants: Record<ButtonVariant, string>;
  readonly sizes: Record<ButtonSize, string>;
  readonly states: {
    readonly loading: string;
    readonly disabled: string;
    readonly active: string;
    readonly wide: string;
    readonly block: string;
    readonly circle: string;
    readonly square: string;
  };
}

/**
 * Пропсы для Loading Spinner внутри кнопки
 */
export interface ButtonLoadingProps {
  readonly size?: ButtonSize;
  readonly className?: string;
}

/**
 * Типы для аналитики кнопок блога
 */
export interface ButtonAnalyticsEvent {
  readonly buttonVariant: ButtonVariant;
  readonly buttonSize: ButtonSize;
  readonly isLoading: boolean;
  readonly customEvent?: string;
  readonly timestamp: number;
} 