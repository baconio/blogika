/**
 * Articles API - работа со статьями блога
 * Интеграция с Strapi Content Type Article
 */

import { apiClient } from './client';
import type { 
  Article, 
  ArticleInput, 
  ArticleUpdate, 
  ArticleSearchParams 
} from '@/types';

/**
 * API для работы со статьями
 */
export const articlesApi = {
  /**
   * Получение всех статей с фильтрами
   * @param params - параметры поиска
   * @returns список статей
   */
  async getAll(params?: ArticleSearchParams) {
    const requestParams = {
      populate: ['author', 'category', 'tags', 'cover_image', 'seo_meta.og_image'],
      filters: {},
      sort: ['createdAt:desc'],
      pagination: {
        page: params?.page || 1,
        pageSize: params?.limit || 10
      }
    };

    // Добавляем фильтры
    if (params?.category) requestParams.filters.category = params.category;
    if (params?.author) requestParams.filters.author = params.author;
    if (params?.status) requestParams.filters.status = params.status;
    if (params?.featured !== undefined) requestParams.filters.is_featured = params.featured;
    if (params?.accessLevel) requestParams.filters.access_level = params.accessLevel;

    // Настраиваем сортировку
    if (params?.sort) {
      const order = params.order || 'desc';
      requestParams.sort = [`${params.sort}:${order}`];
    }

    const response = await apiClient.get<Article[]>('/articles', requestParams);
    return response;
  },

  /**
   * Получение статьи по slug
   * @param slug - уникальный идентификатор статьи
   * @returns статья
   */
  async getBySlug(slug: string) {
    const response = await apiClient.get<Article[]>('/articles', {
      populate: ['author', 'category', 'tags', 'cover_image', 'seo_meta.og_image'],
      filters: { slug }
    });

    if (!response.data.length) {
      throw new Error(`Article with slug "${slug}" not found`);
    }

    return response.data[0];
  },

  /**
   * Получение статьи по ID
   * @param id - ID статьи
   * @returns статья
   */
  async getById(id: number) {
    const response = await apiClient.get<Article>(`/articles/${id}`, {
      populate: ['author', 'category', 'tags', 'cover_image', 'seo_meta.og_image']
    });

    return response.data;
  },

  /**
   * Получение популярных статей
   * @param limit - количество статей
   * @returns популярные статьи
   */
  async getTrending(limit: number = 10) {
    const response = await apiClient.get<Article[]>('/articles/trending', {
      pagination: { pageSize: limit }
    });

    return response.data;
  },

  /**
   * Получение статей с фильтрами
   * @param filters - параметры фильтрации
   * @returns отфильтрованные статьи
   */
  async getWithFilters(filters: {
    category?: string;
    author?: number;
    status?: string;
    featured?: boolean;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<Article[]>(
      `/articles/with-filters?${queryParams.toString()}`
    );

    return response.data;
  },

  /**
   * Создание новой статьи
   * @param data - данные статьи
   * @returns созданная статья
   */
  async create(data: ArticleInput) {
    const response = await apiClient.post<Article>('/articles', data);
    return response.data;
  },

  /**
   * Обновление статьи
   * @param id - ID статьи
   * @param data - данные для обновления
   * @returns обновленная статья
   */
  async update(id: number, data: Partial<ArticleUpdate>) {
    const response = await apiClient.put<Article>(`/articles/${id}`, data);
    return response.data;
  },

  /**
   * Удаление статьи
   * @param id - ID статьи
   * @returns результат удаления
   */
  async delete(id: number) {
    const response = await apiClient.delete(`/articles/${id}`);
    return response;
  },

  /**
   * Увеличение счетчика просмотров
   * @param id - ID статьи
   * @returns обновленная статья
   */
  async incrementViews(id: number) {
    const response = await apiClient.put<Article>(`/articles/${id}/views`, {});
    return response.data;
  },

  /**
   * Лайк/дизлайк статьи
   * @param id - ID статьи
   * @param action - действие (like/unlike)
   * @returns обновленная статья
   */
  async toggleLike(id: number, action: 'like' | 'unlike') {
    const response = await apiClient.put<Article>(`/articles/${id}/like`, { action });
    return response.data;
  },

  /**
   * Поиск статей
   * @param query - поисковый запрос
   * @param filters - дополнительные фильтры
   * @returns результаты поиска
   */
  async search(query: string, filters?: Partial<ArticleSearchParams>) {
    const requestParams = {
      populate: ['author', 'category', 'tags', 'cover_image'],
      filters: {
        $or: [
          { title: { $containsi: query } },
          { content: { $containsi: query } },
          { excerpt: { $containsi: query } }
        ],
        ...filters
      },
      sort: ['createdAt:desc'],
      pagination: {
        page: filters?.page || 1,
        pageSize: filters?.limit || 10
      }
    };

    const response = await apiClient.get<Article[]>('/articles', requestParams);
    return response;
  },

  /**
   * Получение рекомендованных статей
   * @param articleId - ID текущей статьи
   * @param limit - количество рекомендаций
   * @returns рекомендованные статьи
   */
  async getRecommendations(articleId: number, limit: number = 5) {
    const response = await apiClient.get<Article[]>(`/articles/${articleId}/recommendations`, {
      pagination: { pageSize: limit }
    });

    return response.data;
  }
}; 