/**
 * Типы для PublishSettings компонента
 * Микромодуль для типизации настроек публикации статей
 */

/**
 * Статус публикации статьи
 */
export type PublicationStatus = 'draft' | 'published' | 'scheduled' | 'archived';

/**
 * Уровень доступа к статье
 */
export type AccessLevel = 'free' | 'premium' | 'subscription_only';

/**
 * Настройки публикации статьи
 */
export interface PublishSettingsData {
  readonly status: PublicationStatus;
  readonly accessLevel: AccessLevel;
  readonly price?: number;
  readonly isFeatured: boolean;
  readonly publishedAt?: Date;
  readonly scheduledAt?: Date;
  readonly expiresAt?: Date;
  readonly allowComments: boolean;
  readonly allowSharing: boolean;
  readonly showInFeed: boolean;
  readonly notifySubscribers: boolean;
}

/**
 * Пропсы для PublishSettings
 */
export interface PublishSettingsProps {
  readonly data: PublishSettingsData;
  readonly onChange: (data: PublishSettingsData) => void;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly mode?: 'create' | 'edit';
}

/**
 * Пропсы для StatusSelector
 */
export interface StatusSelectorProps {
  readonly status: PublicationStatus;
  readonly onStatusChange: (status: PublicationStatus) => void;
  readonly disabled?: boolean;
  readonly scheduledAt?: Date;
  readonly onScheduledAtChange?: (date: Date | undefined) => void;
}

/**
 * Пропсы для AccessLevelSelector
 */
export interface AccessLevelSelectorProps {
  readonly accessLevel: AccessLevel;
  readonly onAccessLevelChange: (level: AccessLevel) => void;
  readonly price?: number;
  readonly onPriceChange?: (price: number | undefined) => void;
  readonly disabled?: boolean;
}

/**
 * Пропсы для AdvancedSettings
 */
export interface AdvancedSettingsProps {
  readonly allowComments: boolean;
  readonly allowSharing: boolean;
  readonly showInFeed: boolean;
  readonly notifySubscribers: boolean;
  readonly isFeatured: boolean;
  readonly expiresAt?: Date;
  readonly onChange: (settings: Partial<PublishSettingsData>) => void;
  readonly disabled?: boolean;
}

/**
 * Информация о статусе публикации
 */
export interface StatusInfo {
  readonly label: string;
  readonly description: string;
  readonly icon: string;
  readonly color: string;
}

/**
 * Информация об уровне доступа
 */
export interface AccessLevelInfo {
  readonly label: string;
  readonly description: string;
  readonly icon: string;
  readonly requiresPrice: boolean;
}

/**
 * Валидация настроек публикации
 */
export interface PublishSettingsValidation {
  readonly isValid: boolean;
  readonly errors: {
    readonly price?: string;
    readonly scheduledAt?: string;
    readonly expiresAt?: string;
  };
  readonly warnings: readonly string[];
} 