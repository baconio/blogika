import { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

/**
 * Типы полей ввода для блоговой платформы
 */
export type InputType = 
  | 'text'        // Обычный текст (заголовки, имена)
  | 'email'       // Email адреса (подписки, регистрация)
  | 'password'    // Пароли (аутентификация)
  | 'url'         // URL ссылки (социальные сети, сайты авторов)
  | 'search'      // Поиск по блогу
  | 'tel'         // Телефоны контактов
  | 'number'      // Числовые поля (цены, количество)
  | 'textarea'    // Многострочный текст (описания, комментарии)
  | 'select';     // Выпадающий список (категории, теги)

/**
 * Размеры полей ввода (DaisyUI размеры)
 */
export type InputSize = 
  | 'xs'          // input-xs - очень маленькие (фильтры, инлайн поля)
  | 'sm'          // input-sm - маленькие (боковые панели)
  | 'md'          // input-md - средние (основные формы)
  | 'lg'          // input-lg - большие (поиск, важные поля)
  | 'xl';         // input-xl - очень большие (главные CTA)

/**
 * Варианты оформления полей ввода
 */
export type InputVariant =
  | 'bordered'    // input-bordered - с границами (по умолчанию)
  | 'ghost'       // input-ghost - без видимых границ
  | 'primary'     // input-primary - акцентное поле
  | 'secondary'   // input-secondary - вторичное поле  
  | 'accent'      // input-accent - выделенное поле
  | 'success'     // input-success - успешная валидация
  | 'warning'     // input-warning - предупреждение
  | 'error';      // input-error - ошибка валидации

/**
 * Состояния валидации для блоговых форм
 */
export interface ValidationState {
  readonly isValid?: boolean;
  readonly isInvalid?: boolean;
  readonly isValidating?: boolean;
  readonly errorMessage?: string;
  readonly successMessage?: string;
  readonly warningMessage?: string;
}

/**
 * Состояния поля ввода
 */
export interface InputState extends ValidationState {
  readonly isDisabled?: boolean;
  readonly isReadOnly?: boolean;
  readonly isRequired?: boolean;
  readonly isFocused?: boolean;
  readonly isLoading?: boolean;
}

/**
 * Базовые пропсы для всех типов полей
 */
export interface BaseInputProps extends InputState {
  /**
   * Размер поля ввода
   * @default 'md'
   */
  readonly size?: InputSize;

  /**
   * Вариант оформления
   * @default 'bordered'
   */
  readonly variant?: InputVariant;

  /**
   * Подпись к полю (label)
   */
  readonly label?: ReactNode;

  /**
   * Текст-подсказка
   */
  readonly placeholder?: string;

  /**
   * Вспомогательный текст под полем
   */
  readonly helperText?: ReactNode;

  /**
   * Иконка слева от поля
   */
  readonly leftIcon?: ReactNode;

  /**
   * Иконка справа от поля
   */
  readonly rightIcon?: ReactNode;

  /**
   * Кастомные CSS классы
   */
  readonly className?: string;

  /**
   * Обертка для поля (для DaisyUI form-control)
   */
  readonly wrapperClassName?: string;

  /**
   * ID для связи с label
   */
  readonly id?: string;

  /**
   * Имя поля для форм
   */
  readonly name?: string;

  /**
   * Аналитика для трекинга
   */
  readonly analytics?: {
    readonly event?: string;
    readonly category?: string;
    readonly fieldType?: string;
  };
}

/**
 * Пропсы для обычных input полей
 */
export interface TextInputProps extends BaseInputProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  readonly type: Exclude<InputType, 'textarea' | 'select'>;
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  
  // Специальные пропсы для разных типов
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: string;
  readonly autoComplete?: string;
  readonly autoFocus?: boolean;
}

/**
 * Пропсы для textarea
 */
export interface TextareaProps extends BaseInputProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  readonly type: 'textarea';
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onChange?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  
  // Специальные пропсы для textarea
  readonly rows?: number;
  readonly cols?: number;
  readonly resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  readonly autoResize?: boolean; // Автоматическое изменение высоты
}

/**
 * Опции для select
 */
export interface SelectOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
  readonly group?: string;
}

/**
 * Пропсы для select
 */
export interface SelectProps extends BaseInputProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  readonly type: 'select';
  readonly value?: string | string[];
  readonly defaultValue?: string | string[];
  readonly onChange?: (value: string | string[], event: React.ChangeEvent<HTMLSelectElement>) => void;
  
  // Специальные пропсы для select
  readonly options: readonly SelectOption[];
  readonly multiple?: boolean;
  readonly searchable?: boolean; // Для будущей интеграции с react-select
  readonly clearable?: boolean;
  readonly loading?: boolean;
  readonly noOptionsMessage?: string;
}

/**
 * Общий тип пропсов для Input компонента
 */
export type InputProps = TextInputProps | TextareaProps | SelectProps;

/**
 * Конфигурация DaisyUI классов для полей ввода
 */
export interface InputClasses {
  readonly base: string;
  readonly variants: Record<InputVariant, string>;
  readonly sizes: Record<InputSize, string>;
  readonly states: {
    readonly disabled: string;
    readonly readOnly: string;
    readonly loading: string;
    readonly focused: string;
    readonly valid: string;
    readonly invalid: string;
    readonly validating: string;
  };
  readonly wrapper: string;
  readonly label: string;
  readonly helperText: string;
  readonly errorText: string;
  readonly successText: string;
  readonly warningText: string;
}

/**
 * Пропсы для иконок внутри поля
 */
export interface InputIconProps {
  readonly icon: ReactNode;
  readonly position: 'left' | 'right';
  readonly size: InputSize;
  readonly isClickable?: boolean;
  readonly onClick?: () => void;
}

/**
 * Типы событий аналитики для полей блога
 */
export interface InputAnalyticsEvent {
  readonly fieldType: InputType;
  readonly fieldName?: string;
  readonly inputSize: InputSize;
  readonly variant: InputVariant;
  readonly interactionType: 'focus' | 'blur' | 'change' | 'submit';
  readonly value?: string;
  readonly isValid?: boolean;
  readonly timestamp: number;
} 