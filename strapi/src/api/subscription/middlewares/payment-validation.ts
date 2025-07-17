/**
 * Middleware для валидации платежных данных при создании подписок
 * Микромодуль отвечает только за проверку корректности платежных данных
 * 
 * @module PaymentValidationMiddleware
 * @responsibility Валидация платежных данных перед созданием подписки
 */

import type { Core } from '@strapi/strapi';

/**
 * Интерфейс для данных платежа
 */
interface PaymentData {
  readonly payment_system: string;
  readonly amount: number;
  readonly currency: string;
  readonly payment_token?: string;
  readonly payment_method?: string;
}

/**
 * Интерфейс для данных подписки
 */
interface SubscriptionData {
  readonly plan_type: string;
  readonly price: number;
  readonly payment_info?: PaymentData;
}

/**
 * Поддерживаемые платежные системы
 */
const SUPPORTED_PAYMENT_SYSTEMS = [
  'yukassa',
  'cloudpayments', 
  'stripe',
  'paypal',
  'sbp'
] as const;

/**
 * Поддерживаемые валюты
 */
const SUPPORTED_CURRENCIES = [
  'RUB', 'USD', 'EUR'
] as const;

/**
 * Типы планов подписки
 */
const SUBSCRIPTION_PLANS = [
  'monthly', 'yearly', 'lifetime'
] as const;

/**
 * Результат валидации платежных данных
 */
interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly string[];
}

/**
 * Валидирует платежную систему
 * 
 * @param paymentSystem - название платежной системы
 * @returns результат валидации
 */
const validatePaymentSystem = (paymentSystem: string): ValidationResult => {
  const isValid = SUPPORTED_PAYMENT_SYSTEMS.includes(paymentSystem as any);
  
  return {
    isValid,
    errors: isValid ? [] : [`Unsupported payment system: ${paymentSystem}`]
  };
};

/**
 * Валидирует сумму платежа
 * 
 * @param amount - сумма платежа
 * @param price - ожидаемая цена
 * @returns результат валидации
 */
const validateAmount = (amount: number, price: number): ValidationResult => {
  const errors: string[] = [];
  
  if (typeof amount !== 'number' || amount <= 0) {
    errors.push('Amount must be a positive number');
  }
  
  if (Math.abs(amount - price) > 0.01) {
    errors.push(`Amount mismatch: expected ${price}, got ${amount}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Валидирует валюту
 * 
 * @param currency - код валюты
 * @returns результат валидации
 */
const validateCurrency = (currency: string): ValidationResult => {
  const isValid = SUPPORTED_CURRENCIES.includes(currency as any);
  
  return {
    isValid,
    errors: isValid ? [] : [`Unsupported currency: ${currency}`]
  };
};

/**
 * Валидирует тип плана подписки
 * 
 * @param planType - тип плана
 * @returns результат валидации
 */
const validatePlanType = (planType: string): ValidationResult => {
  const isValid = SUBSCRIPTION_PLANS.includes(planType as any);
  
  return {
    isValid,
    errors: isValid ? [] : [`Invalid plan type: ${planType}`]
  };
};

/**
 * Комплексная валидация данных подписки
 * 
 * @param data - данные подписки
 * @returns результат валидации
 */
const validateSubscriptionData = (data: SubscriptionData): ValidationResult => {
  const validations = [
    validatePlanType(data.plan_type),
    validateAmount(data.payment_info?.amount || 0, data.price)
  ];
  
  if (data.payment_info) {
    validations.push(
      validatePaymentSystem(data.payment_info.payment_system),
      validateCurrency(data.payment_info.currency)
    );
  }
  
  const allErrors = validations.flatMap(validation => validation.errors);
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};

/**
 * Middleware для валидации платежных данных при создании подписок
 * 
 * @param config - конфигурация middleware
 * @param helpers - helpers от Strapi
 * @returns middleware функция
 * 
 * @example
 * // В routes:
 * middlewares: ['api::subscription.payment-validation']
 */
export default (config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    // Применяем валидацию только для создания подписок
    if (ctx.request.method === 'POST') {
      const subscriptionData = ctx.request.body?.data as SubscriptionData;
      
      if (subscriptionData) {
        const validationResult = validateSubscriptionData(subscriptionData);
        
        if (!validationResult.isValid) {
          return ctx.badRequest('Payment validation failed', {
            errors: validationResult.errors
          });
        }
        
        // Логируем успешную валидацию платежа
        strapi.log.info('Payment validation successful', {
          planType: subscriptionData.plan_type,
          amount: subscriptionData.price,
          paymentSystem: subscriptionData.payment_info?.payment_system
        });
      }
    }

    await next();
  };
}; 