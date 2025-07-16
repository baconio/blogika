/**
 * Tag типы для блоговой платформы
 * Соответствует Strapi Content Type Tag
 */

/**
 * Базовый тег статей
 */
export interface Tag {
  readonly id: number;
  readonly documentId: string;
  readonly name: string;
  readonly slug: string;
  readonly description?: string;
  readonly color: string;
  readonly usage_count: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Тег с обновленной статистикой использования
 */
export interface TagWithUsage extends Tag {
  readonly actualUsageCount: number;
}

/**
 * Данные для создания тега
 */
export interface TagInput {
  readonly name: string;
  readonly description?: string;
  readonly color?: string;
}

/**
 * Данные для обновления тега
 */
export interface TagUpdate extends Partial<TagInput> {
  readonly id: number;
}

/**
 * Параметры поиска тегов
 */
export interface TagSearchParams {
  readonly popular?: boolean; // только популярные теги
  readonly minUsage?: number; // минимальное количество использований
  readonly sort?: 'name' | 'usage_count' | 'createdAt';
  readonly order?: 'asc' | 'desc';
  readonly limit?: number;
  readonly search?: string; // поиск по имени
}

/**
 * Опции цветов для тегов
 */
export const TAG_COLORS = {
  GRAY: '#64748b',
  BLUE: '#3b82f6',
  GREEN: '#10b981',
  YELLOW: '#f59e0b',
  RED: '#ef4444',
  PURPLE: '#8b5cf6',
  PINK: '#ec4899',
  INDIGO: '#6366f1'
} as const;

export type TagColor = typeof TAG_COLORS[keyof typeof TAG_COLORS];

/**
 * Облако тегов для UI
 */
export interface TagCloud {
  readonly tag: Tag;
  readonly weight: number; // вес для размера в облаке (0-1)
}

/**
 * Статистика использования тегов
 */
export interface TagStats {
  readonly totalTags: number;
  readonly activeTags: number; // теги с usage_count > 0
  readonly mostPopular: Tag[];
  readonly recentlyUsed: Tag[];
} 