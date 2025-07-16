/**
 * Comments API - работа с комментариями
 * Интеграция с Strapi Content Type Comment
 */

import { apiClient } from './client';
import type { 
  Comment, 
  CommentInput, 
  CommentUpdate, 
  CommentSearchParams,
  CommentStats,
  CommentModerationData 
} from '@/types';

/**
 * API для работы с комментариями
 */
export const commentsApi = {
  /**
   * Получение комментариев статьи
   * @param articleId - ID статьи
   * @param params - параметры запроса
   * @returns комментарии с древовидной структурой
   */
  async getByArticle(articleId: number, params?: Partial<CommentSearchParams>) {
    const response = await apiClient.get<Comment[]>(`/comments/by-article/${articleId}`, {
      populate: ['author', 'replies.author'],
      sort: [params?.sort || 'createdAt:desc'],
      pagination: {
        pageSize: params?.limit || 20
      }
    });

    return response.data;
  },

  /**
   * Получение всех комментариев с фильтрами
   * @param params - параметры поиска
   * @returns список комментариев
   */
  async getAll(params?: CommentSearchParams) {
    const requestParams = {
      populate: ['author', 'article'],
      filters: {},
      sort: [params?.sort || 'createdAt:desc'],
      pagination: {
        page: 1,
        pageSize: params?.limit || 20
      }
    };

    // Добавляем фильтры
    if (params?.articleId) requestParams.filters.article = params.articleId;
    if (params?.authorId) requestParams.filters.author = params.authorId;
    if (params?.status) requestParams.filters.moderation_status = params.status;
    if (params?.onlyTopLevel) requestParams.filters.parent = null;

    const response = await apiClient.get<Comment[]>('/comments', requestParams);
    return response;
  },

  /**
   * Получение комментария по ID
   * @param id - ID комментария
   * @returns комментарий
   */
  async getById(id: number) {
    const response = await apiClient.get<Comment>(`/comments/${id}`, {
      populate: ['author', 'article', 'parent', 'replies.author']
    });

    return response.data;
  },

  /**
   * Создание нового комментария
   * @param data - данные комментария
   * @returns созданный комментарий
   */
  async create(data: CommentInput) {
    const response = await apiClient.post<Comment>('/comments', {
      ...data,
      ip_address: await this.getClientIP(),
      user_agent: navigator.userAgent
    });

    return response.data;
  },

  /**
   * Обновление комментария
   * @param id - ID комментария
   * @param data - данные для обновления
   * @returns обновленный комментарий
   */
  async update(id: number, data: Partial<CommentUpdate>) {
    const response = await apiClient.put<Comment>(`/comments/${id}`, data);
    return response.data;
  },

  /**
   * Удаление комментария
   * @param id - ID комментария
   * @returns результат удаления
   */
  async delete(id: number) {
    const response = await apiClient.delete(`/comments/${id}`);
    return response;
  },

  /**
   * Лайк/дизлайк комментария
   * @param id - ID комментария
   * @param action - действие (like/unlike)
   * @returns обновленный комментарий
   */
  async toggleLike(id: number, action: 'like' | 'unlike') {
    const response = await apiClient.put<Comment>(`/comments/${id}/like`, { action });
    return response.data;
  },

  /**
   * Модерация комментария
   * @param data - данные модерации
   * @returns обновленный комментарий
   */
  async moderate(data: CommentModerationData) {
    const response = await apiClient.put<Comment>(
      `/comments/${data.commentId}/moderate`, 
      {
        status: data.status,
        reason: data.reason
      }
    );

    return response.data;
  },

  /**
   * Получение статистики комментариев статьи
   * @param articleId - ID статьи
   * @returns статистика комментариев
   */
  async getStats(articleId: number): Promise<CommentStats> {
    const response = await apiClient.get<CommentStats>(`/comments/stats/${articleId}`);
    return response.data;
  },

  /**
   * Получение комментариев для модерации
   * @param status - статус модерации
   * @param limit - количество комментариев
   * @returns комментарии для модерации
   */
  async getForModeration(status: 'pending' | 'all' = 'pending', limit: number = 20) {
    const filters = status === 'pending' ? { moderation_status: 'pending' } : {};

    const response = await apiClient.get<Comment[]>('/comments', {
      populate: ['author', 'article'],
      filters,
      sort: ['createdAt:desc'],
      pagination: { pageSize: limit }
    });

    return response.data;
  },

  /**
   * Массовая модерация комментариев
   * @param commentIds - массив ID комментариев
   * @param status - новый статус
   * @returns результат операции
   */
  async bulkModerate(commentIds: number[], status: 'approved' | 'rejected') {
    const promises = commentIds.map(id => 
      this.moderate({ commentId: id, status })
    );

    return Promise.all(promises);
  },

  /**
   * Закрепление/открепление комментария
   * @param id - ID комментария
   * @param pinned - закрепить или открепить
   * @returns обновленный комментарий
   */
  async togglePin(id: number, pinned: boolean) {
    const response = await apiClient.put<Comment>(`/comments/${id}`, {
      is_pinned: pinned
    });

    return response.data;
  },

  /**
   * Получение ответов на комментарий
   * @param parentId - ID родительского комментария
   * @returns ответы на комментарий
   */
  async getReplies(parentId: number) {
    const response = await apiClient.get<Comment[]>('/comments', {
      populate: ['author'],
      filters: { parent: parentId },
      sort: ['createdAt:asc']
    });

    return response.data;
  },

  /**
   * Получение IP адреса клиента (для антиспама)
   * @returns IP адрес
   */
  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('/api/client-ip');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  }
}; 