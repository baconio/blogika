/**
 * Categories API - работа с категориями статей
 * Интеграция с Strapi Content Type Category
 */

import { apiClient } from './client';
import type { 
  Category, 
  CategoryWithStats,
  CategoryInput, 
  CategoryUpdate, 
  CategorySearchParams 
} from '@/types';

/**
 * API для работы с категориями
 */
export const categoriesApi = {
  /**
   * Получение всех категорий
   * @param params - параметры поиска
   * @returns список категорий
   */
  async getAll(params?: CategorySearchParams) {
    const requestParams = {
      populate: ['icon'],
      filters: {},
      sort: [params?.sort || 'name:asc'],
      pagination: {
        pageSize: params?.limit || 50
      }
    };

    // Добавляем фильтры
    if (params?.active !== undefined) {
      requestParams.filters.is_active = params.active;
    }

    const response = await apiClient.get<Category[]>('/categories', requestParams);
    return response;
  },

  /**
   * Получение категорий с статистикой
   * @param params - параметры поиска
   * @returns категории со статистикой использования
   */
  async getAllWithStats(params?: CategorySearchParams): Promise<CategoryWithStats[]> {
    const response = await apiClient.get<CategoryWithStats[]>('/categories/with-stats', {
      populate: ['icon'],
      filters: params?.active !== undefined ? { is_active: params.active } : {},
      sort: [params?.sort || 'articlesCount:desc']
    });

    return response.data;
  },

  /**
   * Получение категории по ID
   * @param id - ID категории
   * @returns категория
   */
  async getById(id: number) {
    const response = await apiClient.get<Category>(`/categories/${id}`, {
      populate: ['icon']
    });

    return response.data;
  },

  /**
   * Получение категории по slug
   * @param slug - уникальный идентификатор категории
   * @returns категория
   */
  async getBySlug(slug: string) {
    const response = await apiClient.get<Category[]>('/categories', {
      populate: ['icon'],
      filters: { slug }
    });

    if (!response.data.length) {
      throw new Error(`Category with slug "${slug}" not found`);
    }

    return response.data[0];
  },

  /**
   * Создание новой категории
   * @param data - данные категории
   * @returns созданная категория
   */
  async create(data: CategoryInput) {
    const response = await apiClient.post<Category>('/categories', data);
    return response.data;
  },

  /**
   * Обновление категории
   * @param id - ID категории
   * @param data - данные для обновления
   * @returns обновленная категория
   */
  async update(id: number, data: Partial<CategoryUpdate>) {
    const response = await apiClient.put<Category>(`/categories/${id}`, data);
    return response.data;
  },

  /**
   * Удаление категории
   * @param id - ID категории
   * @returns результат удаления
   */
  async delete(id: number) {
    const response = await apiClient.delete(`/categories/${id}`);
    return response;
  },

  /**
   * Получение активных категорий для фильтрации
   * @returns активные категории
   */
  async getActive() {
    const response = await apiClient.get<Category[]>('/categories', {
      populate: ['icon'],
      filters: { is_active: true },
      sort: ['name:asc']
    });

    return response.data;
  },

  /**
   * Получение популярных категорий
   * @param limit - количество категорий
   * @returns популярные категории по количеству статей
   */
  async getPopular(limit: number = 10) {
    const categories = await this.getAllWithStats({ limit });
    
    return categories
      .filter(cat => cat.articlesCount > 0)
      .sort((a, b) => b.articlesCount - a.articlesCount)
      .slice(0, limit);
  },

  /**
   * Поиск категорий по названию
   * @param query - поисковый запрос
   * @returns найденные категории
   */
  async search(query: string) {
    const response = await apiClient.get<Category[]>('/categories', {
      populate: ['icon'],
      filters: {
        $or: [
          { name: { $containsi: query } },
          { description: { $containsi: query } }
        ],
        is_active: true
      },
      sort: ['name:asc']
    });

    return response.data;
  },

  /**
   * Переключение активности категории
   * @param id - ID категории
   * @param active - новое состояние активности
   * @returns обновленная категория
   */
  async toggleActive(id: number, active: boolean) {
    const response = await apiClient.put<Category>(`/categories/${id}`, {
      is_active: active
    });

    return response.data;
  }
}; 