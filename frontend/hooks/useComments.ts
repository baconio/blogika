/**
 * React хук для работы с комментариями
 * @description Микромодуль для управления комментариями с React Query
 */
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '@/lib/api';
import { trackContentInteraction } from '@/lib/utils';
import type { Comment } from '@/types';

export type Maybe<T> = T | undefined;

export interface UseCommentsOptions {
  readonly articleId: string;
  readonly limit?: number;
  readonly sortBy?: 'createdAt' | 'likes' | 'replies';
  readonly sortOrder?: 'asc' | 'desc';
  readonly parentId?: string;
}

export interface CreateCommentData {
  readonly content: string;
  readonly articleId: string;
  readonly parentId?: string;
}

export interface CommentFilters {
  readonly status?: 'pending' | 'approved' | 'rejected';
  readonly authorId?: string;
  readonly dateFrom?: Date;
  readonly dateTo?: Date;
}

/**
 * Хук для получения комментариев к статье
 * @param options - опции загрузки комментариев
 * @returns объект с комментариями и состоянием загрузки
 * @example
 * const { data: comments, isLoading } = useComments({ articleId: '123' })
 */
export const useComments = (options: UseCommentsOptions) => {
  return useQuery({
    queryKey: ['comments', 'article', options.articleId, options],
    queryFn: () => commentsApi.findByArticle(options),
    enabled: !!options.articleId,
    staleTime: 2 * 60 * 1000, // 2 минуты
    gcTime: 5 * 60 * 1000, // 5 минут в кэше
  });
};

/**
 * Хук для получения одного комментария по ID
 * @param commentId - ID комментария
 * @returns данные комментария
 * @example
 * const { data: comment } = useComment('comment-123')
 */
export const useComment = (commentId: string) => {
  return useQuery({
    queryKey: ['comment', commentId],
    queryFn: () => commentsApi.findById(commentId),
    enabled: !!commentId,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

/**
 * Хук для получения ответов на комментарий
 * @param parentId - ID родительского комментария
 * @param limit - количество ответов
 * @returns список ответов
 * @example
 * const { data: replies } = useCommentReplies('parent-123', 10)
 */
export const useCommentReplies = (parentId: string, limit: number = 10) => {
  return useQuery({
    queryKey: ['comments', 'replies', parentId, limit],
    queryFn: () => commentsApi.findReplies(parentId, limit),
    enabled: !!parentId,
    staleTime: 3 * 60 * 1000, // 3 минуты
  });
};

/**
 * Хук для получения комментариев пользователя
 * @param userId - ID пользователя
 * @param filters - фильтры комментариев
 * @returns комментарии пользователя
 * @example
 * const { data: userComments } = useUserComments('user-123')
 */
export const useUserComments = (userId: string, filters: CommentFilters = {}) => {
  return useQuery({
    queryKey: ['comments', 'user', userId, filters],
    queryFn: () => commentsApi.findByUser(userId, filters),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

/**
 * Хук для создания нового комментария
 * @returns функция мутации для создания комментария
 * @example
 * const { mutate: createComment, isPending } = useCreateComment()
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentData) => commentsApi.create(data),
    onSuccess: (newComment, variables) => {
      // Инвалидируем комментарии статьи
      queryClient.invalidateQueries({ 
        queryKey: ['comments', 'article', variables.articleId] 
      });

      // Если это ответ, инвалидируем ответы родительского комментария
      if (variables.parentId) {
        queryClient.invalidateQueries({ 
          queryKey: ['comments', 'replies', variables.parentId] 
        });
      }

      // Трекинг создания комментария
      trackContentInteraction('comment', variables.articleId, {
        commentId: newComment.documentId,
        isReply: !!variables.parentId,
        parentId: variables.parentId
      });

      // Инвалидируем статистику статьи (обновляем счетчик комментариев)
      queryClient.invalidateQueries({ 
        queryKey: ['article', variables.articleId] 
      });
    },
    onError: (error) => {
      console.error('Ошибка при создании комментария:', error);
    },
  });
};

/**
 * Хук для обновления комментария
 * @returns функция мутации для обновления
 * @example
 * const { mutate: updateComment } = useUpdateComment()
 */
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Comment> }) =>
      commentsApi.update(id, data),
    onSuccess: (updatedComment) => {
      // Обновляем комментарий в кэше
      queryClient.setQueryData(['comment', updatedComment.documentId], updatedComment);

      // Инвалидируем комментарии статьи
      queryClient.invalidateQueries({ 
        queryKey: ['comments', 'article', updatedComment.article.documentId] 
      });

      // Если есть родительский комментарий, инвалидируем его ответы
      if (updatedComment.parent) {
        queryClient.invalidateQueries({ 
          queryKey: ['comments', 'replies', updatedComment.parent.documentId] 
        });
      }
    },
  });
};

/**
 * Хук для удаления комментария
 * @returns функция мутации для удаления
 * @example
 * const { mutate: deleteComment } = useDeleteComment()
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentsApi.delete,
    onSuccess: (_, deletedId) => {
      // Удаляем комментарий из кэша
      queryClient.removeQueries({ queryKey: ['comment', deletedId] });

      // Инвалидируем все связанные запросы
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};

/**
 * Хук для лайка/дизлайка комментария
 * @returns функция мутации для лайка
 * @example
 * const { mutate: toggleLike } = useToggleCommentLike()
 */
export const useToggleCommentLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, isLiked }: { commentId: string; isLiked: boolean }) =>
      commentsApi.toggleLike(commentId, isLiked),
    onSuccess: (updatedComment, { commentId, isLiked }) => {
      // Обновляем комментарий в кэше
      queryClient.setQueryData(['comment', commentId], updatedComment);

      // Трекинг лайка комментария
      trackContentInteraction('like', updatedComment.article.documentId, {
        commentId,
        isLiked,
        likesCount: updatedComment.likes_count,
        type: 'comment'
      });

      // Инвалидируем комментарии статьи для обновления счетчиков
      queryClient.invalidateQueries({ 
        queryKey: ['comments', 'article', updatedComment.article.documentId] 
      });
    },
    onError: (error) => {
      console.error('Ошибка при лайке комментария:', error);
    },
  });
};

/**
 * Хук для модерации комментария (для администраторов)
 * @returns функция мутации для модерации
 * @example
 * const { mutate: moderateComment } = useModerateComment()
 */
export const useModerateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      commentId, 
      status 
    }: { 
      commentId: string; 
      status: 'approved' | 'rejected' 
    }) =>
      commentsApi.moderate(commentId, status),
    onSuccess: (moderatedComment) => {
      // Обновляем комментарий в кэше
      queryClient.setQueryData(['comment', moderatedComment.documentId], moderatedComment);

      // Инвалидируем комментарии статьи
      queryClient.invalidateQueries({ 
        queryKey: ['comments', 'article', moderatedComment.article.documentId] 
      });

      // Инвалидируем список комментариев на модерацию
      queryClient.invalidateQueries({ 
        queryKey: ['comments', 'moderation'] 
      });
    },
  });
};

/**
 * Хук для получения комментариев на модерацию
 * @param filters - фильтры для модерации
 * @returns комментарии ожидающие модерации
 * @example
 * const { data: pendingComments } = useModerationComments({ status: 'pending' })
 */
export const useModerationComments = (filters: CommentFilters = {}) => {
  return useQuery({
    queryKey: ['comments', 'moderation', filters],
    queryFn: () => commentsApi.findForModeration(filters),
    staleTime: 1 * 60 * 1000, // 1 минута для модерации
  });
};

/**
 * Хук для закрепления комментария (для авторов статей)
 * @returns функция мутации для закрепления
 * @example
 * const { mutate: pinComment } = usePinComment()
 */
export const usePinComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, isPinned }: { commentId: string; isPinned: boolean }) =>
      commentsApi.pin(commentId, isPinned),
    onSuccess: (pinnedComment) => {
      // Обновляем комментарий в кэше
      queryClient.setQueryData(['comment', pinnedComment.documentId], pinnedComment);

      // Инвалидируем комментарии статьи
      queryClient.invalidateQueries({ 
        queryKey: ['comments', 'article', pinnedComment.article.documentId] 
      });
    },
  });
}; 