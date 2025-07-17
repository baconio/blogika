/**
 * Платежная система - типы для обработки платежей
 * @fileoverview Типы для YuKassa, Stripe и общих платежных операций
 */

/**
 * Статус платежа
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing', 
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

/**
 * Платежная система
 */
export enum PaymentProvider {
  YUKASSA = 'yukassa',
  STRIPE = 'stripe',
  CLOUDPAYMENTS = 'cloudpayments',
  PAYPAL = 'paypal',
  SBP = 'sbp'
}

/**
 * Способ оплаты
 */
export enum PaymentMethod {
  CARD = 'card',
  WALLET = 'wallet',
  BANK_TRANSFER = 'bank_transfer',
  SBP = 'sbp',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay'
}

/**
 * Валюта платежа
 */
export enum Currency {
  RUB = 'RUB',
  USD = 'USD',
  EUR = 'EUR'
}

/**
 * Основная информация о платеже
 */
export interface Payment {
  readonly id: string;
  readonly externalId: string;
  readonly provider: PaymentProvider;
  readonly status: PaymentStatus;
  readonly amount: number;
  readonly currency: Currency;
  readonly method: PaymentMethod;
  readonly description: string;
  readonly metadata?: Record<string, any>;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly failureReason?: string;
  readonly receiptUrl?: string;
}

/**
 * Данные для создания платежа
 */
export interface CreatePaymentRequest {
  readonly amount: number;
  readonly currency: Currency;
  readonly description: string;
  readonly returnUrl: string;
  readonly subscriptionId?: string;
  readonly articleId?: string;
  readonly metadata?: Record<string, any>;
}

/**
 * Ответ при создании платежа
 */
export interface CreatePaymentResponse {
  readonly paymentId: string;
  readonly paymentUrl: string;
  readonly status: PaymentStatus;
}

/**
 * Webhook данные от платежной системы
 */
export interface PaymentWebhook {
  readonly paymentId: string;
  readonly status: PaymentStatus;
  readonly amount: number;
  readonly currency: Currency;
  readonly provider: PaymentProvider;
  readonly metadata?: Record<string, any>;
  readonly timestamp: Date;
}

/**
 * Настройки платежной системы
 */
export interface PaymentConfig {
  readonly yukassa: {
    readonly shopId: string;
    readonly secretKey: string;
    readonly webhookUrl: string;
  };
  readonly stripe: {
    readonly publicKey: string;
    readonly secretKey: string;
    readonly webhookSecret: string;
  };
}

/**
 * Возврат платежа
 */
export interface Refund {
  readonly id: string;
  readonly paymentId: string;
  readonly amount: number;
  readonly reason: string;
  readonly status: PaymentStatus;
  readonly createdAt: Date;
}

/**
 * Статистика платежей
 */
export interface PaymentStats {
  readonly totalAmount: number;
  readonly successfulPayments: number;
  readonly failedPayments: number;
  readonly refundedAmount: number;
  readonly averageAmount: number;
  readonly currency: Currency;
} 