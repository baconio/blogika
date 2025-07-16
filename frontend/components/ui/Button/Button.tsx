'use client';

import { forwardRef, useCallback, useMemo } from 'react';
import { ButtonProps, ButtonClasses, ButtonSize } from './Button.types';

/**
 * Конфигурация DaisyUI классов для Button компонента
 * Следует принципам микромодульности - изолированная конфигурация
 */
const BUTTON_CLASSES: ButtonClasses = {
  base: 'btn transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2',
  variants: {
    primary: 'btn-primary',
    secondary: 'btn-secondary', 
    accent: 'btn-accent',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    link: 'btn-link',
    success: 'btn-success',
    warning: 'btn-warning',
    error: 'btn-error',
  },
  sizes: {
    xs: 'btn-xs',
    sm: 'btn-sm', 
    md: 'btn-md',
    lg: 'btn-lg',
    xl: 'btn-xl',
  },
  states: {
    loading: 'loading',
    disabled: 'btn-disabled',
    active: 'btn-active',
    wide: 'btn-wide',
    block: 'btn-block',
    circle: 'btn-circle',
    square: 'btn-square',
  },
};

/**
 * Загрузочный спиннер для кнопки
 * Микромодуль - изолированная ответственность
 */
const ButtonSpinner = ({ size = 'md' }: { size?: ButtonSize }) => {
  const spinnerSize = useMemo(() => {
    const sizeMap = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5', 
      lg: 'w-6 h-6',
      xl: 'w-7 h-7',
    };
    return sizeMap[size];
  }, [size]);

  return (
    <span 
      className={`loading loading-spinner ${spinnerSize}`}
      aria-hidden="true"
    />
  );
};

/**
 * Функция для построения className
 * Микромодуль - единственная ответственность построения классов
 */
const buildButtonClasses = (props: ButtonProps): string => {
  const {
    variant = 'primary',
    size = 'md', 
    isLoading,
    isDisabled,
    isActive,
    isWide,
    isBlock,
    isCircle,
    isSquare,
    className = '',
  } = props;

  const classes = [
    BUTTON_CLASSES.base,
    BUTTON_CLASSES.variants[variant],
    BUTTON_CLASSES.sizes[size],
  ];

  // Состояния кнопки
  if (isLoading) classes.push(BUTTON_CLASSES.states.loading);
  if (isDisabled) classes.push(BUTTON_CLASSES.states.disabled);
  if (isActive) classes.push(BUTTON_CLASSES.states.active);
  if (isWide) classes.push(BUTTON_CLASSES.states.wide);
  if (isBlock) classes.push(BUTTON_CLASSES.states.block);
  if (isCircle) classes.push(BUTTON_CLASSES.states.circle);
  if (isSquare) classes.push(BUTTON_CLASSES.states.square);

  // Кастомные классы
  if (className) classes.push(className);

  return classes.join(' ');
};

/**
 * Button компонент для блоговой платформы
 * Следует принципам Context7 и микромодульной архитектуры
 * 
 * @example
 * // Основная кнопка
 * <Button variant="primary" size="md">
 *   Опубликовать статью
 * </Button>
 * 
 * @example
 * // Кнопка с загрузкой
 * <Button variant="primary" isLoading loadingText="Сохранение...">
 *   Сохранить
 * </Button>
 * 
 * @example  
 * // Кнопка с иконками
 * <Button 
 *   variant="ghost" 
 *   leftIcon={<HeartIcon />}
 *   analytics={{ event: 'like_article', category: 'engagement' }}
 * >
 *   Лайк
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      children,
      leftIcon,
      rightIcon,
      isLoading = false,
      isDisabled = false,
      loadingText = 'Загрузка...',
      loadingPosition = 'start',
      analytics,
      onClick,
      size = 'md',
      ...restProps
    } = props;

    // Построение CSS классов (мемоизировано для производительности)
    const buttonClasses = useMemo(() => buildButtonClasses(props), [props]);

    // Обработчик клика с аналитикой
    const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      // Блокируем клик если кнопка загружается или заблокирована  
      if (isLoading || isDisabled) {
        event.preventDefault();
        return;
      }

      // Трекинг аналитики (если настроен)
      if (analytics && typeof window !== 'undefined') {
        // Здесь можно интегрировать с Google Analytics, Mixpanel и т.д.
        console.log('Button Analytics:', {
          ...analytics,
          variant: props.variant || 'primary',
          size,
          timestamp: Date.now(),
        });
      }

      // Вызываем пользовательский обработчик
      onClick?.(event);
    }, [isLoading, isDisabled, analytics, onClick, props.variant, size]);

    // Контент кнопки с учетом состояния загрузки
    const buttonContent = useMemo(() => {
      if (isLoading) {
        // Режим замены контента на спиннер
        if (loadingPosition === 'replace') {
          return (
            <>
              <ButtonSpinner size={size} />
              <span className="sr-only">{loadingText}</span>
            </>
          );
        }

        // Режим добавления спиннера в начало или конец
        return (
          <>
            {(loadingPosition === 'start') && <ButtonSpinner size={size} />}
            {leftIcon && !isLoading && (
              <span className="inline-flex shrink-0" aria-hidden="true">
                {leftIcon}
              </span>
            )}
            <span>
              {isLoading ? loadingText : children}
            </span>
            {rightIcon && !isLoading && (
              <span className="inline-flex shrink-0" aria-hidden="true">
                {rightIcon}
              </span>
            )}
            {(loadingPosition === 'end') && <ButtonSpinner size={size} />}
          </>
        );
      }

      // Обычное состояние без загрузки
      return (
        <>
          {leftIcon && (
            <span className="inline-flex shrink-0" aria-hidden="true">
              {leftIcon}
            </span>
          )}
          <span>{children}</span>
          {rightIcon && (
            <span className="inline-flex shrink-0" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </>
      );
    }, [isLoading, loadingPosition, loadingText, leftIcon, rightIcon, children, size]);

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={isDisabled || isLoading}
        onClick={handleClick}
        aria-disabled={isDisabled || isLoading}
        aria-busy={isLoading}
        {...restProps}
      >
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = 'Button';

export type { ButtonProps, ButtonVariant, ButtonSize } from './Button.types'; 