/**
 * Subscription типы для блоговой платформы
 * Соответствует Strapi Content Type Subscription
 */

import type { User } from './User';
import type { Author } from './Author';

/**
 * Типы планов подписки
 */
export type PlanType = 'monthly' | 'yearly' | 'lifetime';

/**
 * Статусы подписки
 */
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending' | 'trial';

/**
 * Платежные системы
 */
export type PaymentSystem = 'yukassa' | 'cloudpayments' | 'stripe' | 'paypal' | 'sbp';

/**
 * Статусы платежей
 */
export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled';

/**
 * Информация о платеже
 */
export interface PaymentInfo {
  readonly payment_system: PaymentSystem;
  readonly external_id: string;
  readonly amount: number;
  readonly currency: string;
  readonly status: PaymentStatus;
  readonly payment_method?: string;
  readonly is_active: boolean;
  readonly metadata?: Record<string, any>;
}

/**
 * Базовая подписка
 */
export interface Subscription {
  readonly id: number;
  readonly documentId: string;
  readonly subscriber: User;
  readonly author: Author;
  readonly plan_type: PlanType;
  readonly price: number;
  readonly status: SubscriptionStatus;
  readonly payment_info?: PaymentInfo;
  readonly started_at: string;
  readonly expires_at?: string;
  readonly trial_expires_at?: string;
  readonly auto_renewal: boolean;
  readonly cancelled_at?: string;
  readonly cancellation_reason?: string;
  readonly next_billing_date?: string;
  readonly total_paid: number;
  readonly discount_percent?: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Данные для создания подписки
 */
export interface SubscriptionInput {
  readonly authorId: number;
  readonly planType: PlanType;
  readonly paymentToken: string;
  readonly discountCode?: string;
}

/**
 * Данные для обновления подписки
 */
export interface SubscriptionUpdate {
  readonly id: number;
  readonly auto_renewal?: boolean;
  readonly plan_type?: PlanType;
}

/**
 * Параметры поиска подписок
 */
export interface SubscriptionSearchParams {
  readonly userId?: number;
  readonly authorId?: number;
  readonly status?: SubscriptionStatus;
  readonly planType?: PlanType;
  readonly sort?: 'createdAt' | 'expires_at' | 'total_paid';
  readonly order?: 'asc' | 'desc';
  readonly limit?: number;
}

/**
 * Данные отмены подписки
 */
export interface SubscriptionCancellationData {
  readonly subscriptionId: number;
  readonly reason?: string;
  readonly immediately?: boolean; // отменить сразу или в конце периода
}

/**
 * Статистика подписок автора
 */
export interface AuthorSubscriptionStats {
  readonly totalSubscriptions: number;
  readonly activeSubscriptions: number;
  readonly monthlyRevenue: number;
  readonly totalRevenue: number;
  readonly conversionRate: number;
  readonly averageSubscriptionLength: number; // в месяцах
}

/**
 * Данные тарифного плана
 */
export interface PricingPlan {
  readonly type: PlanType;
  readonly name: string;
  readonly price: number;
  readonly originalPrice?: number; // для скидок
  readonly features: string[];
  readonly popular?: boolean;
  readonly description?: string;
  readonly billingCycle: string; // "в месяц", "в год", "навсегда"
}

/**
 * Карточка подписки для UI
 */
export interface SubscriptionCard {
  readonly subscription: Subscription;
  readonly daysRemaining?: number;
  readonly isExpiringSoon: boolean;
  readonly nextPaymentAmount?: number;
}

/**
 * Данные платежного токена
 */
export interface PaymentToken {
  readonly token: string;
  readonly system: PaymentSystem;
  readonly last4?: string; // последние 4 цифры карты
  readonly expiryMonth?: number;
  readonly expiryYear?: number;
}

/**
 * Результат обработки платежа
 */
export interface PaymentResult {
  readonly success: boolean;
  readonly paymentId?: string;
  readonly subscriptionId?: number;
  readonly error?: string;
  readonly redirectUrl?: string; // для 3DS
}

/**
 * Настройки уведомлений о подписке
 */
export interface SubscriptionNotificationSettings {
  readonly emailOnExpiry: boolean;
  readonly emailOnPayment: boolean;
  readonly emailOnCancellation: boolean;
  readonly reminderDaysBefore: number;
} 