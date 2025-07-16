/**
 * React хук для работы со статьями
 * @description Микромодуль для управления статьями с React Query
 */
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articlesApi } from '@/lib/api';
import { trackArticleView, trackContentInteraction } from '@/lib/utils';
import type { Article } from '@/types';

export type Maybe<T> = T | undefined;

export interface UseArticlesOptions {
  readonly category?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly featured?: boolean;
  readonly authorId?: string;
}

export interface UseArticleOptions {
  readonly trackView?: boolean;
  readonly preload?: boolean;
}

export interface ArticleFilters {
  readonly search?: string;
  readonly category?: string;
  readonly tag?: string;
  readonly status?: 'draft' | 'published' | 'scheduled';
  readonly sortBy?: 'createdAt' | 'views' | 'likes' | 'title';
  readonly sortOrder?: 'asc' | 'desc';
}

/**
 * Хук для получения списка статей с фильтрацией
 * @param options - опции фильтрации статей
 * @returns объект с данными, состоянием загрузки и ошибками
 * @example
 * const { data: articles, isLoading } = useArticles({ category: 'tech', limit: 10 })
 */
export const useArticles = (options: UseArticlesOptions = {}) => {
  return useQuery({
    queryKey: ['articles', options],
    queryFn: () => articlesApi.findAll(options),
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
  });
};

/**
 * Хук для получения одной статьи по ID или slug
 * @param idOrSlug - ID или slug статьи
 * @param options - опции загрузки
 * @returns объект с данными статьи
 * @example
 * const { data: article, isLoading } = useArticle('my-article-slug', { trackView: true })
 */
export const useArticle = (idOrSlug: string, options: UseArticleOptions = {}) => {
  const query = useQuery({
    queryKey: ['article', idOrSlug],
    queryFn: async () => {
      const article = await articlesApi.findBySlug(idOrSlug);
      
      // Автоматический трекинг просмотра
      if (options.trackView && article) {
        trackArticleView(
          article.documentId,
          article.title,
          article.category?.name
        );
      }
      
      return article;
    },
    staleTime: 10 * 60 * 1000, // 10 минут для статей
    gcTime: 30 * 60 * 1000, // 30 минут в кэше
    enabled: !!idOrSlug,
  });

  return query;
};

/**
 * Хук для поиска статей
 * @param query - поисковый запрос
 * @param filters - дополнительные фильтры
 * @returns результаты поиска
 * @example
 * const { data: results, isLoading } = useArticleSearch('Next.js', { category: 'tech' })
 */
export const useArticleSearch = (query: string, filters: ArticleFilters = {}) => {
  return useQuery({
    queryKey: ['articles', 'search', query, filters],
    queryFn: () => articlesApi.search(query, filters),
    enabled: query.length >= 2, // Поиск только от 2 символов
    staleTime: 2 * 60 * 1000, // 2 минуты для поиска
  });
};

/**
 * Хук для получения похожих статей
 * @param articleId - ID текущей статьи
 * @param limit - количество статей
 * @returns список похожих статей
 * @example
 * const { data: related } = useRelatedArticles('123', 5)
 */
export const useRelatedArticles = (articleId: string, limit: number = 5) => {
  return useQuery({
    queryKey: ['articles', 'related', articleId, limit],
    queryFn: () => articlesApi.findRelated(articleId, limit),
    enabled: !!articleId,
    staleTime: 15 * 60 * 1000, // 15 минут
  });
};

/**
 * Хук для получения популярных статей
 * @param timeframe - временной период ('week' | 'month' | 'year')
 * @param limit - количество статей
 * @returns популярные статьи
 * @example
 * const { data: trending } = useTrendingArticles('week', 10)
 */
export const useTrendingArticles = (
  timeframe: 'week' | 'month' | 'year' = 'week',
  limit: number = 10
) => {
  return useQuery({
    queryKey: ['articles', 'trending', timeframe, limit],
    queryFn: () => articlesApi.findTrending(timeframe, limit),
    staleTime: 30 * 60 * 1000, // 30 минут для трендов
  });
};

/**
 * Хук для создания новой статьи
 * @returns функция мутации для создания статьи
 * @example
 * const { mutate: createArticle, isPending } = useCreateArticle()
 */
export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: articlesApi.create,
    onSuccess: (newArticle) => {
      // Инвалидируем кэш статей
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      
      // Добавляем новую статью в кэш
      queryClient.setQueryData(['article', newArticle.documentId], newArticle);
      
      // Трекинг создания статьи
      trackContentInteraction('create', newArticle.documentId, {
        title: newArticle.title,
        category: newArticle.category?.name
      });
    },
  });
};

/**
 * Хук для обновления статьи
 * @returns функция мутации для обновления
 * @example
 * const { mutate: updateArticle } = useUpdateArticle()
 */
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Article> }) =>
      articlesApi.update(id, data),
    onSuccess: (updatedArticle) => {
      // Обновляем кэш статьи
      queryClient.setQueryData(['article', updatedArticle.documentId], updatedArticle);
      queryClient.setQueryData(['article', updatedArticle.slug], updatedArticle);
      
      // Инвалидируем списки статей
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};

/**
 * Хук для удаления статьи
 * @returns функция мутации для удаления
 * @example
 * const { mutate: deleteArticle } = useDeleteArticle()
 */
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: articlesApi.delete,
    onSuccess: (_, deletedId) => {
      // Удаляем из кэша
      queryClient.removeQueries({ queryKey: ['article', deletedId] });
      
      // Инвалидируем списки
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};

/**
 * Хук для лайка статьи
 * @returns функция мутации для лайка/дизлайка
 * @example
 * const { mutate: toggleLike } = useToggleArticleLike()
 */
export const useToggleArticleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, isLiked }: { articleId: string; isLiked: boolean }) =>
      articlesApi.toggleLike(articleId, isLiked),
    onSuccess: (updatedArticle, { articleId, isLiked }) => {
      // Обновляем статью в кэше
      queryClient.setQueryData(['article', articleId], updatedArticle);
      
      // Трекинг лайка
      trackContentInteraction('like', articleId, { 
        isLiked,
        likesCount: updatedArticle.likes_count 
      });
      
      // Инвалидируем списки статей (для обновления счетчиков)
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
    onError: (error) => {
      console.error('Ошибка при лайке статьи:', error);
    },
  });
};

/**
 * Хук для добавления статьи в закладки
 * @returns функция мутации для закладок
 * @example
 * const { mutate: toggleBookmark } = useToggleArticleBookmark()
 */
export const useToggleArticleBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, isBookmarked }: { articleId: string; isBookmarked: boolean }) =>
      articlesApi.toggleBookmark(articleId, isBookmarked),
    onSuccess: (_, { articleId, isBookmarked }) => {
      // Трекинг закладки
      trackContentInteraction('bookmark', articleId, { isBookmarked });
      
      // Инвалидируем закладки пользователя
      queryClient.invalidateQueries({ queryKey: ['user', 'bookmarks'] });
    },
  });
}; 