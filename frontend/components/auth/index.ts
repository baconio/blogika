/**
 * Экспорт компонентов аутентификации
 * @description Микромодули для входа, регистрации и защиты маршрутов
 */

// Компонент формы входа
export { LoginForm } from './LoginForm';
export type { LoginFormProps } from './LoginForm';

// Компонент формы регистрации
export { RegisterForm } from './RegisterForm';
export type { RegisterFormProps } from './RegisterForm';

// Компонент защиты маршрутов
export { AuthGuard, withAuthGuard, useAccessControl } from './AuthGuard';
export type { AuthGuardProps } from './AuthGuard'; 