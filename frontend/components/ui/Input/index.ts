/**
 * Input компонент для блоговой платформы
 * Микромодуль с поддержкой всех типов полей ввода
 * 
 * @module Input
 */

// Основной экспорт компонента
export { Input } from './Input';

// Экспорт всех типов для внешнего использования
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
} from './Input.types';

// Экспорт по умолчанию для удобства импорта
export { Input as default } from './Input'; 