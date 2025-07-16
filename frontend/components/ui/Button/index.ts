/**
 * Button компонент для блоговой платформы
 * Микромодуль с полной изоляцией функциональности
 * 
 * @module Button
 */

// Основной экспорт компонента
export { Button } from './Button';

// Экспорт типов для внешнего использования
export type { 
  ButtonProps, 
  ButtonVariant, 
  ButtonSize,
  ButtonState,
  ButtonClasses,
  ButtonLoadingProps,
  ButtonAnalyticsEvent 
} from './Button.types';

// Экспорт по умолчанию для удобства импорта
export { Button as default } from './Button'; 