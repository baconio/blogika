'use client';

import { forwardRef, useCallback, useMemo, useId, useRef, useEffect } from 'react';
import { 
  InputProps, 
  TextInputProps, 
  TextareaProps, 
  SelectProps,
  InputClasses, 
  InputSize,
  SelectOption 
} from './Input.types';

/**
 * Конфигурация DaisyUI классов для Input компонента
 * Следует принципам микромодульности - изолированная конфигурация
 */
const INPUT_CLASSES: InputClasses = {
  base: 'input w-full transition-all duration-200 ease-in-out focus:outline-none',
  variants: {
    bordered: 'input-bordered border-blog-secondary-300 focus:border-blog-primary-500',
    ghost: 'input-ghost bg-transparent',
    primary: 'input-primary',
    secondary: 'input-secondary',
    accent: 'input-accent',
    success: 'input-success border-blog-success-500',
    warning: 'input-warning border-blog-warning-500',
    error: 'input-error border-blog-accent-500',
  },
  sizes: {
    xs: 'input-xs text-xs',
    sm: 'input-sm text-sm',
    md: 'input-md text-base',
    lg: 'input-lg text-lg',
    xl: 'input-xl text-xl',
  },
  states: {
    disabled: 'input-disabled opacity-60 cursor-not-allowed',
    readOnly: 'input-ghost cursor-default',
    loading: 'loading',
    focused: 'ring-2 ring-blog-primary-200 ring-offset-2',
    valid: 'border-blog-success-500',
    invalid: 'border-blog-accent-500',
    validating: 'border-blog-warning-500',
  },
  wrapper: 'form-control w-full',
  label: 'label text-blog-secondary-700 font-medium',
  helperText: 'label-text-alt text-blog-secondary-500 text-sm mt-1',
  errorText: 'label-text-alt text-blog-accent-600 text-sm mt-1',
  successText: 'label-text-alt text-blog-success-600 text-sm mt-1',
  warningText: 'label-text-alt text-blog-warning-600 text-sm mt-1',
};

/**
 * Функция для построения CSS классов поля
 * Микромодуль - единственная ответственность построения классов
 */
const buildInputClasses = (props: InputProps): string => {
  const {
    variant = 'bordered',
    size = 'md',
    isDisabled,
    isReadOnly,
    isLoading,
    isFocused,
    isValid,
    isInvalid,
    isValidating,
    className = '',
  } = props;

  const classes = [
    INPUT_CLASSES.base,
    INPUT_CLASSES.variants[variant],
    INPUT_CLASSES.sizes[size],
  ];

  // Состояния поля
  if (isDisabled) classes.push(INPUT_CLASSES.states.disabled);
  if (isReadOnly) classes.push(INPUT_CLASSES.states.readOnly);
  if (isLoading) classes.push(INPUT_CLASSES.states.loading);
  if (isFocused) classes.push(INPUT_CLASSES.states.focused);
  if (isValid) classes.push(INPUT_CLASSES.states.valid);
  if (isInvalid) classes.push(INPUT_CLASSES.states.invalid);
  if (isValidating) classes.push(INPUT_CLASSES.states.validating);

  // Кастомные классы
  if (className) classes.push(className);

  return classes.join(' ');
};

/**
 * Иконка внутри поля ввода
 * Микромодуль - изолированная ответственность
 */
const InputIcon = ({ 
  icon, 
  position, 
  size = 'md', 
  isClickable = false, 
  onClick 
}: {
  icon: React.ReactNode;
  position: 'left' | 'right';
  size?: InputSize;
  isClickable?: boolean;
  onClick?: () => void;
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-4 h-4', 
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  const positionClasses = {
    left: 'absolute left-3 top-1/2 transform -translate-y-1/2',
    right: 'absolute right-3 top-1/2 transform -translate-y-1/2',
  };

  return (
    <span 
      className={`
        ${positionClasses[position]} 
        ${sizeClasses[size]} 
        text-blog-secondary-500 
        ${isClickable ? 'cursor-pointer hover:text-blog-primary-600' : ''}
      `}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      aria-hidden={!isClickable}
    >
      {icon}
    </span>
  );
};

/**
 * Автоматическое изменение высоты textarea
 * Микромодуль - изолированная функция
 */
const useAutoResize = (textareaRef: React.RefObject<HTMLTextAreaElement>, value?: string) => {
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Сброс высоты для правильного пересчета
    textarea.style.height = 'auto';
    // Установка высоты по содержимому
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value, textareaRef]);
};

/**
 * Текстовое поле (input)
 * Микромодуль - отдельная ответственность
 */
const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  const {
    type,
    value,
    defaultValue,
    onChange,
    leftIcon,
    rightIcon,
    analytics,
    ...restProps
  } = props;

  const inputClasses = useMemo(() => {
    const classes = buildInputClasses(props);
    const paddingClasses = [];
    
    if (leftIcon) paddingClasses.push('pl-10');
    if (rightIcon) paddingClasses.push('pr-10');
    
    return [classes, ...paddingClasses].join(' ');
  }, [props, leftIcon, rightIcon]);

  // Обработчик изменения с аналитикой
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    
    // Синхронное обновление (Context7 практика)
    onChange?.(newValue, event);

    // Трекинг аналитики
    if (analytics && typeof window !== 'undefined') {
      console.log('Input Analytics:', {
        ...analytics,
        fieldType: type,
        inputSize: props.size || 'md',
        variant: props.variant || 'bordered',
        interactionType: 'change',
        value: newValue,
        timestamp: Date.now(),
      });
    }
  }, [onChange, analytics, type, props.size, props.variant]);

  return (
    <div className="relative">
      {leftIcon && (
        <InputIcon 
          icon={leftIcon} 
          position="left" 
          size={props.size} 
        />
      )}
      <input
        ref={ref}
        type={type}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        className={inputClasses}
        disabled={props.isDisabled}
        readOnly={props.isReadOnly}
        required={props.isRequired}
        {...restProps}
      />
      {rightIcon && (
        <InputIcon 
          icon={rightIcon} 
          position="right" 
          size={props.size} 
        />
      )}
    </div>
  );
});

/**
 * Многострочное текстовое поле (textarea)
 * Микромодуль - отдельная ответственность
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  const {
    value,
    defaultValue,
    onChange,
    rows = 3,
    resize = 'vertical',
    autoResize = false,
    analytics,
    ...restProps
  } = props;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const finalRef = (ref || textareaRef) as React.RefObject<HTMLTextAreaElement>;

  // Автоматическое изменение размера
  useAutoResize(finalRef, value);

  const textareaClasses = useMemo(() => {
    const classes = buildInputClasses(props).replace('input', 'textarea');
    const resizeClass = resize === 'none' ? 'resize-none' : 
                       resize === 'horizontal' ? 'resize-x' :
                       resize === 'vertical' ? 'resize-y' : 'resize';
    return `${classes} ${resizeClass}`;
  }, [props, resize]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    
    onChange?.(newValue, event);

    if (analytics && typeof window !== 'undefined') {
      console.log('Textarea Analytics:', {
        ...analytics,
        fieldType: 'textarea',
        inputSize: props.size || 'md',
        variant: props.variant || 'bordered',
        interactionType: 'change',
        timestamp: Date.now(),
      });
    }
  }, [onChange, analytics, props.size, props.variant]);

  return (
    <textarea
      ref={finalRef}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      rows={autoResize ? undefined : rows}
      className={textareaClasses}
      disabled={props.isDisabled}
      readOnly={props.isReadOnly}
      required={props.isRequired}
      {...restProps}
    />
  );
});

/**
 * Выпадающий список (select)
 * Микромодуль - отдельная ответственность
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  const {
    value,
    defaultValue,
    onChange,
    options,
    multiple = false,
    loading = false,
    noOptionsMessage = 'Нет доступных опций',
    analytics,
    ...restProps
  } = props;

  const selectClasses = useMemo(() => {
    return buildInputClasses(props).replace('input', 'select');
  }, [props]);

  // Группировка опций
  const groupedOptions = useMemo(() => {
    const groups: Record<string, SelectOption[]> = {};
    const ungrouped: SelectOption[] = [];

    options.forEach(option => {
      if (option.group) {
        if (!groups[option.group]) groups[option.group] = [];
        groups[option.group].push(option);
      } else {
        ungrouped.push(option);
      }
    });

    return { groups, ungrouped };
  }, [options]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = multiple 
      ? Array.from(event.target.selectedOptions, option => option.value)
      : event.target.value;
    
    onChange?.(newValue, event);

    if (analytics && typeof window !== 'undefined') {
      console.log('Select Analytics:', {
        ...analytics,
        fieldType: 'select',
        inputSize: props.size || 'md',
        variant: props.variant || 'bordered',
        interactionType: 'change',
        timestamp: Date.now(),
      });
    }
  }, [onChange, multiple, analytics, props.size, props.variant]);

  return (
    <select
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      multiple={multiple}
      className={selectClasses}
      disabled={props.isDisabled || loading}
      required={props.isRequired}
      {...restProps}
    >
      {/* Placeholder опция */}
      {!multiple && !value && !defaultValue && (
        <option value="" disabled>
          {loading ? 'Загрузка...' : props.placeholder || 'Выберите опцию'}
        </option>
      )}
      
      {/* Ungrouped опции */}
      {groupedOptions.ungrouped.map(option => (
        <option 
          key={option.value} 
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
      
      {/* Grouped опции */}
      {Object.entries(groupedOptions.groups).map(([groupName, groupOptions]) => (
        <optgroup key={groupName} label={groupName}>
          {groupOptions.map(option => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </optgroup>
      ))}
      
      {/* Нет опций */}
      {options.length === 0 && !loading && (
        <option value="" disabled>
          {noOptionsMessage}
        </option>
      )}
    </select>
  );
});

/**
 * Универсальный Input компонент для блоговой платформы
 * Следует принципам Context7 и микромодульной архитектуры
 * 
 * @example
 * // Текстовое поле с валидацией
 * <Input 
 *   type="text" 
 *   label="Заголовок статьи"
 *   placeholder="Введите заголовок"
 *   isRequired
 *   maxLength={200}
 * />
 * 
 * @example
 * // Поле поиска с иконкой
 * <Input 
 *   type="search"
 *   placeholder="Поиск по блогу..."
 *   leftIcon={<SearchIcon />}
 *   size="lg"
 * />
 * 
 * @example
 * // Textarea для контента
 * <Input
 *   type="textarea"
 *   label="Содержание статьи"
 *   autoResize
 *   rows={5}
 * />
 * 
 * @example
 * // Select с группированными опциями
 * <Input
 *   type="select"
 *   label="Категория"
 *   options={categoryOptions}
 *   analytics={{ event: 'select_category', category: 'article_form' }}
 * />
 */
export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, 
  InputProps
>((props, ref) => {
  const {
    type,
    label,
    helperText,
    errorMessage,
    successMessage,
    warningMessage,
    isValid,
    isInvalid,
    isValidating,
    wrapperClassName = '',
    id: providedId,
    ...restProps
  } = props;

  // Генерация уникального ID для accessibility
  const generatedId = useId();
  const id = providedId || generatedId;

  // Определение состояния валидации для отображения сообщений
  const validationMessage = useMemo(() => {
    if (errorMessage && isInvalid) {
      return { type: 'error', message: errorMessage };
    }
    if (successMessage && isValid) {
      return { type: 'success', message: successMessage };
    }
    if (warningMessage && isValidating) {
      return { type: 'warning', message: warningMessage };
    }
    return null;
  }, [errorMessage, successMessage, warningMessage, isValid, isInvalid, isValidating]);

  // Выбор правильного компонента
  const renderInput = () => {
    if (type === 'textarea') {
      return <Textarea ref={ref as React.Ref<HTMLTextAreaElement>} {...props as TextareaProps} id={id} />;
    }
    if (type === 'select') {
      return <Select ref={ref as React.Ref<HTMLSelectElement>} {...props as SelectProps} id={id} />;
    }
    return <TextInput ref={ref as React.Ref<HTMLInputElement>} {...props as TextInputProps} id={id} />;
  };

  return (
    <div className={`${INPUT_CLASSES.wrapper} ${wrapperClassName}`}>
      {/* Label */}
      {label && (
        <label htmlFor={id} className={INPUT_CLASSES.label}>
          <span className="label-text">
            {label}
            {restProps.isRequired && <span className="text-blog-accent-500 ml-1">*</span>}
          </span>
        </label>
      )}
      
      {/* Input Field */}
      {renderInput()}
      
      {/* Helper/Validation Text */}
      {(helperText || validationMessage) && (
        <div className="label">
          {validationMessage ? (
            <span className={
              validationMessage.type === 'error' ? INPUT_CLASSES.errorText :
              validationMessage.type === 'success' ? INPUT_CLASSES.successText :
              INPUT_CLASSES.warningText
            }>
              {validationMessage.message}
            </span>
          ) : helperText ? (
            <span className={INPUT_CLASSES.helperText}>
              {helperText}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Присвоение displayName для подкомпонентов
TextInput.displayName = 'TextInput';
Textarea.displayName = 'Textarea';  
Select.displayName = 'Select';

export type { InputProps, InputType, InputSize, InputVariant, SelectOption } from './Input.types'; 