/**
 * Components типы для блоговой платформы
 * Соответствует Strapi Components
 */

/**
 * Платформы социальных сетей
 */
export type SocialPlatform = 'twitter' | 'telegram' | 'youtube' | 'instagram' | 'linkedin' | 'github';

/**
 * Социальная ссылка автора
 */
export interface SocialLink {
  readonly platform: SocialPlatform;
  readonly url: string;
  readonly handle?: string;
}

/**
 * SEO метаданные для статей и страниц
 */
export interface SEOMeta {
  readonly title?: string;
  readonly description?: string;
  readonly keywords?: string;
  readonly og_image?: {
    readonly id: number;
    readonly url: string;
    readonly alternativeText?: string;
    readonly width?: number;
    readonly height?: number;
  };
  readonly canonical_url?: string;
}

/**
 * Информация о платеже (из компонента PaymentInfo)
 */
export interface PaymentInfo {
  readonly payment_system: 'yukassa' | 'cloudpayments' | 'stripe' | 'paypal' | 'sbp';
  readonly external_id: string;
  readonly amount: number;
  readonly currency: string;
  readonly status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
  readonly payment_method?: string;
  readonly is_active: boolean;
  readonly metadata?: Record<string, any>;
}

/**
 * Расширенные SEO метаданные для генерации
 */
export interface ExtendedSEOMeta extends SEOMeta {
  readonly ogType?: 'article' | 'website' | 'profile';
  readonly ogSiteName?: string;
  readonly twitterCard?: 'summary' | 'summary_large_image';
  readonly twitterSite?: string;
  readonly twitterCreator?: string;
  readonly structuredData?: Record<string, any>; // JSON-LD
}

/**
 * Данные для генерации Open Graph тегов
 */
export interface OpenGraphData {
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly url: string;
  readonly type: 'article' | 'website' | 'profile';
  readonly siteName: string;
  readonly locale?: string;
}

/**
 * Карточки социальных сетей для отображения
 */
export interface SocialCard {
  readonly platform: SocialPlatform;
  readonly url: string;
  readonly handle?: string;
  readonly icon: string;
  readonly displayName: string;
  readonly color: string;
}

/**
 * Конфигурация социальных платформ
 */
export const SOCIAL_PLATFORMS_CONFIG: Record<SocialPlatform, {
  readonly displayName: string;
  readonly icon: string;
  readonly color: string;
  readonly baseUrl: string;
}> = {
  twitter: {
    displayName: 'Twitter',
    icon: 'twitter',
    color: '#1da1f2',
    baseUrl: 'https://twitter.com/'
  },
  telegram: {
    displayName: 'Telegram',
    icon: 'telegram',
    color: '#0088cc',
    baseUrl: 'https://t.me/'
  },
  youtube: {
    displayName: 'YouTube',
    icon: 'youtube',
    color: '#ff0000',
    baseUrl: 'https://youtube.com/'
  },
  instagram: {
    displayName: 'Instagram',
    icon: 'instagram',
    color: '#e4405f',
    baseUrl: 'https://instagram.com/'
  },
  linkedin: {
    displayName: 'LinkedIn',
    icon: 'linkedin',
    color: '#0077b5',
    baseUrl: 'https://linkedin.com/in/'
  },
  github: {
    displayName: 'GitHub',
    icon: 'github',
    color: '#333333',
    baseUrl: 'https://github.com/'
  }
} as const;

/**
 * Утилиты для работы с SEO
 */
export interface SEOUtils {
  readonly generateTitle: (title: string, siteName?: string) => string;
  readonly generateDescription: (content: string, maxLength?: number) => string;
  readonly generateKeywords: (tags: string[], content?: string) => string;
  readonly generateCanonicalUrl: (slug: string, baseUrl: string) => string;
} 