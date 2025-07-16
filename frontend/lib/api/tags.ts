/**
 * Tags API - работа с тегами статей
 * Интеграция с Strapi Content Type Tag
 */

import { apiClient } from './client';
import type { 
  Tag, 
  TagWithUsage,
  TagInput, 
  TagUpdate, 
  TagSearchParams,
  TagCloud,
  TagStats
} from '@/types';

/**
 * API для работы с тегами
 */
export const tagsApi = {
  /**
   * Получение всех тегов
   * @param params - параметры поиска
   * @returns список тегов
   */
  async getAll(params?: TagSearchParams) {
    const requestParams = {
      filters: {},
      sort: [params?.sort || 'usage_count:desc'],
      pagination: {
        pageSize: params?.limit || 100
      }
    };

    // Добавляем фильтры
    if (params?.popular) {
      requestParams.filters.usage_count = { $gt: 0 };
    }
    if (params?.minUsage) {
      requestParams.filters.usage_count = { $gte: params.minUsage };
    }
    if (params?.search) {
      requestParams.filters.name = { $containsi: params.search };
    }

    const response = await apiClient.get<Tag[]>('/tags', requestParams);
    return response;
  },

  /**
   * Получение тегов с обновленной статистикой использования
   * @param params - параметры поиска
   * @returns теги с актуальным usage_count
   */
  async getAllWithUsage(params?: TagSearchParams): Promise<TagWithUsage[]> {
    const response = await apiClient.get<TagWithUsage[]>('/tags/with-usage', {
      filters: params?.popular ? { usage_count: { $gt: 0 } } : {},
      sort: [params?.sort || 'actualUsageCount:desc'],
      pagination: {
        pageSize: params?.limit || 100
      }
    });

    return response.data;
  },

  /**
   * Получение тега по ID
   * @param id - ID тега
   * @returns тег
   */
  async getById(id: number) {
    const response = await apiClient.get<Tag>(`/tags/${id}`);
    return response.data;
  },

  /**
   * Получение тега по slug
   * @param slug - уникальный идентификатор тега
   * @returns тег
   */
  async getBySlug(slug: string) {
    const response = await apiClient.get<Tag[]>('/tags', {
      filters: { slug }
    });

    if (!response.data.length) {
      throw new Error(`Tag with slug "${slug}" not found`);
    }

    return response.data[0];
  },

  /**
   * Создание нового тега
   * @param data - данные тега
   * @returns созданный тег
   */
  async create(data: TagInput) {
    const response = await apiClient.post<Tag>('/tags', data);
    return response.data;
  },

  /**
   * Обновление тега
   * @param id - ID тега
   * @param data - данные для обновления
   * @returns обновленный тег
   */
  async update(id: number, data: Partial<TagUpdate>) {
    const response = await apiClient.put<Tag>(`/tags/${id}`, data);
    return response.data;
  },

  /**
   * Удаление тега
   * @param id - ID тега
   * @returns результат удаления
   */
  async delete(id: number) {
    const response = await apiClient.delete(`/tags/${id}`);
    return response;
  },

  /**
   * Получение популярных тегов
   * @param limit - количество тегов
   * @returns популярные теги по количеству использований
   */
  async getPopular(limit: number = 20) {
    const response = await apiClient.get<Tag[]>('/tags', {
      filters: { usage_count: { $gt: 0 } },
      sort: ['usage_count:desc'],
      pagination: { pageSize: limit }
    });

    return response.data;
  },

  /**
   * Получение облака тегов для UI
   * @param limit - максимальное количество тегов
   * @returns облако тегов с весами
   */
  async getTagCloud(limit: number = 50): Promise<TagCloud[]> {
    const tags = await this.getPopular(limit);
    
    if (!tags.length) return [];

    const maxUsage = Math.max(...tags.map(tag => tag.usage_count));
    const minUsage = Math.min(...tags.map(tag => tag.usage_count));
    const usageRange = maxUsage - minUsage || 1;

    return tags.map(tag => ({
      tag,
      weight: (tag.usage_count - minUsage) / usageRange
    }));
  },

  /**
   * Поиск тегов по названию
   * @param query - поисковый запрос
   * @param limit - максимальное количество результатов
   * @returns найденные теги
   */
  async search(query: string, limit: number = 20) {
    const response = await apiClient.get<Tag[]>('/tags', {
      filters: {
        $or: [
          { name: { $containsi: query } },
          { description: { $containsi: query } }
        ]
      },
      sort: ['usage_count:desc'],
      pagination: { pageSize: limit }
    });

    return response.data;
  },

  /**
   * Получение статистики тегов
   * @returns общая статистика использования тегов
   */
  async getStats(): Promise<TagStats> {
    const allTags = await this.getAll({ limit: 1000 });
    const totalTags = allTags.data.length;
    const activeTags = allTags.data.filter(tag => tag.usage_count > 0).length;

    const mostPopular = allTags.data
      .filter(tag => tag.usage_count > 0)
      .sort((a, b) => b.usage_count - a.usage_count)
      .slice(0, 10);

    const recentlyUsed = allTags.data
      .filter(tag => tag.usage_count > 0)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10);

    return {
      totalTags,
      activeTags,
      mostPopular,
      recentlyUsed
    };
  },

  /**
   * Получение рекомендуемых тегов на основе контента
   * @param content - текст статьи
   * @param existingTags - уже выбранные теги
   * @param limit - максимальное количество рекомендаций
   * @returns рекомендуемые теги
   */
  async getRecommendations(content: string, existingTags: string[] = [], limit: number = 10) {
    // Простая реализация рекомендаций на основе поиска по контенту
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);

    const recommendations = new Set<Tag>();

    for (const word of words) {
      if (recommendations.size >= limit) break;
      
      try {
        const matchingTags = await this.search(word, 3);
        matchingTags
          .filter(tag => !existingTags.includes(tag.name))
          .forEach(tag => recommendations.add(tag));
      } catch {
        // Игнорируем ошибки поиска
      }
    }

    return Array.from(recommendations).slice(0, limit);
  },

  /**
   * Получение связанных тегов
   * @param tagId - ID текущего тега
   * @param limit - количество связанных тегов
   * @returns связанные теги (часто используемые вместе)
   */
  async getRelated(tagId: number, limit: number = 10) {
    // Получаем статьи с этим тегом и находим другие теги из этих статей
    const response = await apiClient.get<{
      relatedTags: Tag[];
    }>(`/tags/${tagId}/related`, {
      pagination: { pageSize: limit }
    });

    return response.data.relatedTags;
  },

  /**
   * Массовое создание тегов
   * @param tagNames - массив названий тегов
   * @returns созданные теги
   */
  async createBulk(tagNames: string[]) {
    const createPromises = tagNames.map(name => 
      this.create({ name }).catch(() => null) // Игнорируем дубликаты
    );

    const results = await Promise.all(createPromises);
    return results.filter((tag): tag is Tag => tag !== null);
  }
}; 