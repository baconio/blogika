/**
 * Типы для ArticleForm компонента
 * Микромодуль для типизации формы создания статей
 */

import type { Article } from '@/types';

/**
 * Данные формы создания статьи
 */
export interface ArticleFormData {
  readonly title: string;
  readonly content: string;
  readonly excerpt: string;
  readonly slug: string;
  readonly categoryId: string;
  readonly tagIds: readonly string[];
  readonly coverImageId?: string;
  readonly status: 'draft' | 'published' | 'scheduled';
  readonly accessLevel: 'free' | 'premium' | 'subscription_only';
  readonly price?: number;
  readonly isFeatured: boolean;
  readonly publishedAt?: Date;
  readonly scheduledAt?: Date;
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly seoKeywords?: string;
}

/**
 * Настройки публикации
 */
export interface ArticlePublishSettings {
  readonly status: ArticleFormData['status'];
  readonly accessLevel: ArticleFormData['accessLevel'];
  readonly price?: number;
  readonly isFeatured: boolean;
  readonly publishedAt?: Date;
  readonly scheduledAt?: Date;
}

/**
 * SEO настройки статьи
 */
export interface SeoSettings {
  readonly title?: string;
  readonly description?: string;
  readonly keywords?: string;
  readonly canonicalUrl?: string;
}

/**
 * Ошибки валидации формы
 */
export interface ArticleFormErrors {
  readonly title?: string;
  readonly content?: string;
  readonly excerpt?: string;
  readonly slug?: string;
  readonly categoryId?: string;
  readonly tagIds?: string;
  readonly coverImageId?: string;
  readonly price?: string;
  readonly seoTitle?: string;
  readonly seoDescription?: string;
}

/**
 * Состояние формы статьи
 */
export interface ArticleFormState {
  readonly data: ArticleFormData;
  readonly errors: ArticleFormErrors;
  readonly isLoading: boolean;
  readonly isDirty: boolean;
  readonly isValid: boolean;
}

/**
 * Обработчики формы
 */
export interface ArticleFormHandlers {
  readonly onSubmit: (data: ArticleFormData) => Promise<void>;
  readonly onSaveDraft: (data: ArticleFormData) => Promise<void>;
  readonly onPreview: (data: ArticleFormData) => void;
  readonly onFieldChange: (field: keyof ArticleFormData, value: any) => void;
  readonly onValidationError: (errors: ArticleFormErrors) => void;
}

/**
 * Пропсы для ArticleForm
 */
export interface ArticleFormProps {
  readonly initialData?: Partial<ArticleFormData>;
  readonly mode: 'create' | 'edit';
  readonly className?: string;
  readonly onSubmit: (data: ArticleFormData) => Promise<void>;
  readonly onSaveDraft?: (data: ArticleFormData) => Promise<void>;
  readonly onCancel?: () => void;
  readonly autoSave?: boolean;
  readonly autoSaveInterval?: number;
}

/**
 * Режимы отображения формы
 */
export type FormDisplayMode = 'editor' | 'preview' | 'split';

/**
 * Табы формы редактирования
 */
export type FormTab = 'content' | 'settings' | 'seo' | 'preview'; 