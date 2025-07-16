/**
 * @fileoverview TypeScript types for PremiumSettings component
 * Handles premium content configuration, pricing, and access control
 */

/** Access levels for content */
export type ContentAccessLevel = 'free' | 'premium' | 'subscription_only';

/** Pricing models for premium content */
export type PricingModel = 'one_time' | 'subscription' | 'pay_per_view' | 'donation';

/** Premium content configuration */
export interface PremiumConfig {
  readonly accessLevel: ContentAccessLevel;
  readonly pricingModel: PricingModel;
  readonly price: number;
  readonly currency: string;
  readonly previewLength: number;
  readonly allowPreviews: boolean;
  readonly enableComments: boolean;
  readonly enableSharing: boolean;
  readonly expiresAt?: Date;
}

/** Subscription tier configuration */
export interface SubscriptionTier {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly currency: string;
  readonly duration: 'monthly' | 'yearly' | 'lifetime';
  readonly features: readonly string[];
  readonly isActive: boolean;
}

/** Payment configuration */
export interface PaymentConfig {
  readonly enabledMethods: readonly PaymentMethod[];
  readonly merchantSettings: MerchantSettings;
  readonly taxSettings: TaxSettings;
}

/** Supported payment methods */
export type PaymentMethod = 'card' | 'yookassa' | 'paypal' | 'crypto' | 'bank_transfer';

/** Merchant configuration */
export interface MerchantSettings {
  readonly merchantId: string;
  readonly secretKey: string;
  readonly environment: 'sandbox' | 'production';
  readonly webhookUrl: string;
}

/** Tax configuration */
export interface TaxSettings {
  readonly enableTax: boolean;
  readonly taxRate: number;
  readonly taxIncluded: boolean;
  readonly vatNumber?: string;
}

/** Preview configuration */
export interface PreviewConfig {
  readonly showWordCount: boolean;
  readonly maxWords: number;
  readonly showCallToAction: boolean;
  readonly callToActionText: string;
  readonly previewType: 'words' | 'paragraphs' | 'percentage';
}

/** Analytics tracking for premium content */
export interface PremiumAnalytics {
  readonly trackViews: boolean;
  readonly trackPurchases: boolean;
  readonly trackRevenue: boolean;
  readonly enableHeatmaps: boolean;
}

/** Props for the main PremiumSettings component */
export interface PremiumSettingsProps {
  readonly premiumConfig: PremiumConfig;
  readonly onConfigChange: (config: PremiumConfig) => void;
  readonly availableTiers: readonly SubscriptionTier[];
  readonly paymentConfig?: PaymentConfig;
  readonly previewConfig?: PreviewConfig;
  readonly analyticsConfig?: PremiumAnalytics;
  readonly disabled?: boolean;
  readonly error?: string;
  readonly className?: string;
}

/** Props for access level selector */
export interface AccessLevelSelectorProps {
  readonly selectedLevel: ContentAccessLevel;
  readonly onLevelChange: (level: ContentAccessLevel) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

/** Props for pricing configuration */
export interface PricingConfigProps {
  readonly pricingModel: PricingModel;
  readonly price: number;
  readonly currency: string;
  readonly onPricingChange: (model: PricingModel, price: number, currency: string) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

/** Props for preview settings */
export interface PreviewSettingsProps {
  readonly config: PreviewConfig;
  readonly onConfigChange: (config: PreviewConfig) => void;
  readonly contentLength: number;
  readonly disabled?: boolean;
  readonly className?: string;
}

/** Props for subscription tier selector */
export interface TierSelectorProps {
  readonly availableTiers: readonly SubscriptionTier[];
  readonly selectedTierId?: string;
  readonly onTierSelect: (tierId: string) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

/** Revenue projection data */
export interface RevenueProjection {
  readonly estimatedViews: number;
  readonly conversionRate: number;
  readonly estimatedRevenue: number;
  readonly period: 'daily' | 'weekly' | 'monthly';
}

/** Default premium configuration */
export const DEFAULT_PREMIUM_CONFIG: PremiumConfig = {
  accessLevel: 'free',
  pricingModel: 'one_time',
  price: 0,
  currency: 'RUB',
  previewLength: 150,
  allowPreviews: true,
  enableComments: true,
  enableSharing: true
} as const;

/** Default preview configuration */
export const DEFAULT_PREVIEW_CONFIG: PreviewConfig = {
  showWordCount: true,
  maxWords: 150,
  showCallToAction: true,
  callToActionText: 'Читать полностью',
  previewType: 'words'
} as const;

/** Supported currencies */
export const SUPPORTED_CURRENCIES = [
  { code: 'RUB', symbol: '₽', name: 'Российский рубль' },
  { code: 'USD', symbol: '$', name: 'Доллар США' },
  { code: 'EUR', symbol: '€', name: 'Евро' }
] as const; 