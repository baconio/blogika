/**
 * Category типы для блоговой платформы
 * Соответствует Strapi Content Type Category
 */

/**
 * Базовая категория статей
 */
export interface Category {
  readonly id: number;
  readonly documentId: string;
  readonly name: string;
  readonly slug: string;
  readonly description?: string;
  readonly color: string;
  readonly icon?: {
    readonly id: number;
    readonly url: string;
    readonly alternativeText?: string;
  };
  readonly is_active: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Категория с дополнительной статистикой
 */
export interface CategoryWithStats extends Category {
  readonly articlesCount: number;
}

/**
 * Данные для создания категории
 */
export interface CategoryInput {
  readonly name: string;
  readonly description?: string;
  readonly color?: string;
  readonly icon?: number; // ID медиафайла
  readonly is_active?: boolean;
}

/**
 * Данные для обновления категории
 */
export interface CategoryUpdate extends Partial<CategoryInput> {
  readonly id: number;
}

/**
 * Параметры поиска категорий
 */
export interface CategorySearchParams {
  readonly active?: boolean;
  readonly withStats?: boolean;
  readonly sort?: 'name' | 'createdAt' | 'articlesCount';
  readonly order?: 'asc' | 'desc';
  readonly limit?: number;
}

/**
 * Опции цветов для категорий
 */
export const CATEGORY_COLORS = {
  PRIMARY: '#6366f1',
  SECONDARY: '#8b5cf6', 
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#3b82f6',
  DARK: '#374151',
  LIGHT: '#9ca3af'
} as const;

export type CategoryColor = typeof CATEGORY_COLORS[keyof typeof CATEGORY_COLORS]; 