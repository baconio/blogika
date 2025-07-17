'use client';

import { useState } from 'react';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { CommentReplies } from './CommentReplies';
import { Comment } from '@/types/Comment';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * Варианты сортировки комментариев
 */
type SortOption = 'newest' | 'oldest' | 'popular';

/**
 * Пропсы компонента секции комментариев
 */
interface CommentsSectionProps {
  readonly articleId: string;
  readonly comments: Comment[];
  readonly totalComments?: number;
  readonly currentUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
  readonly canModerate?: boolean;
  readonly isLoading?: boolean;
  readonly onSubmitComment: (content: string, parentId?: string) => Promise<void>;
  readonly onLoadMore?: () => Promise<void>;
  readonly onLike?: (commentId: string) => void;
  readonly onEdit?: (commentId: string) => void;
  readonly onDelete?: (commentId: string) => void;
  readonly onModerate?: (commentId: string, action: 'approve' | 'reject') => void;
  readonly onSortChange?: (sort: SortOption) => void;
}

/**
 * Основной компонент секции комментариев
 * Объединяет все функции комментирования в единый интерфейс
 * @param articleId - ID статьи
 * @param comments - массив комментариев
 * @param totalComments - общее количество комментариев
 * @param currentUser - данные текущего пользователя
 * @param canModerate - может ли пользователь модерировать
 * @param isLoading - состояние загрузки
 * @param onSubmitComment - обработчик отправки комментария
 * @param onLoadMore - обработчик загрузки дополнительных комментариев
 * @param onLike - обработчик лайка
 * @param onEdit - обработчик редактирования
 * @param onDelete - обработчик удаления
 * @param onModerate - обработчик модерации
 * @param onSortChange - обработчик изменения сортировки
 * @returns JSX элемент секции комментариев
 */
export const CommentsSection = ({
  articleId,
  comments,
  totalComments = 0,
  currentUser,
  canModerate = false,
  isLoading = false,
  onSubmitComment,
  onLoadMore,
  onLike,
  onEdit,
  onDelete,
  onModerate,
  onSortChange
}: CommentsSectionProps) => {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const hasMoreComments = totalComments > comments.length;

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    onSortChange?.(newSort);
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  const toggleReplies = (commentId: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedReplies(newExpanded);
  };

  // Фильтруем комментарии верхнего уровня (без родителя)
  const topLevelComments = comments.filter(comment => !comment.parent);

  return (
    <section className="mt-12">
      {/* Заголовок секции */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Комментарии {totalComments > 0 && `(${totalComments})`}
        </h2>

        {/* Сортировка */}
        {comments.length > 1 && (
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-gray-600">Сортировать по:</span>
            <div className="flex gap-2">
              {[
                { key: 'newest' as const, label: 'Новые' },
                { key: 'oldest' as const, label: 'Старые' },
                { key: 'popular' as const, label: 'Популярные' }
              ].map(option => (
                <button
                  key={option.key}
                  onClick={() => handleSortChange(option.key)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    sortBy === option.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Форма добавления комментария */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <CommentForm
            currentUser={currentUser}
            onSubmit={onSubmitComment}
            placeholder="Поделитесь своими мыслями о статье..."
          />
        </div>
      </div>

      {/* Список комментариев */}
      <div className="space-y-6">
        {isLoading && topLevelComments.length === 0 ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : topLevelComments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              Пока нет комментариев. Будьте первым!
            </p>
          </div>
        ) : (
          topLevelComments.map((comment) => {
            const replies = comments.filter(c => c.parent?.id === comment.id);
            const isExpanded = expandedReplies.has(comment.id);
            const showReplyForm = replyingTo === comment.id;

            return (
              <div key={comment.id} className="space-y-4">
                {/* Основной комментарий */}
                <CommentItem
                  comment={comment}
                  currentUserId={currentUser?.id}
                  canModerate={canModerate}
                  onReply={handleReply}
                  onLike={onLike}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onModerate={onModerate}
                />

                {/* Показать/скрыть ответы */}
                {replies.length > 0 && (
                  <button
                    onClick={() => toggleReplies(comment.id)}
                    className="ml-16 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {isExpanded ? '↑ Скрыть' : '↓ Показать'} {replies.length} ответов
                  </button>
                )}

                {/* Ответы на комментарий */}
                {isExpanded && replies.length > 0 && (
                  <CommentReplies
                    parentId={comment.id}
                    replies={replies}
                    currentUserId={currentUser?.id}
                    currentUser={currentUser}
                    canModerate={canModerate}
                    showReplyForm={showReplyForm}
                    onSubmitReply={onSubmitComment}
                    onToggleReplyForm={() => setReplyingTo(null)}
                    onLike={onLike}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onModerate={onModerate}
                  />
                )}

                {/* Форма ответа (если не развернуты ответы) */}
                {showReplyForm && !isExpanded && (
                  <div className="ml-16 bg-gray-50 rounded-lg p-4">
                    <CommentForm
                      currentUser={currentUser}
                      parentId={comment.id}
                      placeholder="Ответить на комментарий..."
                      submitText="Ответить"
                      onSubmit={onSubmitComment}
                      onCancel={() => setReplyingTo(null)}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Кнопка "Загрузить еще" */}
        {hasMoreComments && (
          <div className="text-center pt-8">
            <Button
              variant="outline"
              onClick={onLoadMore}
              disabled={isLoading}
              className="min-w-[200px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>Загрузка...</span>
                </div>
              ) : (
                `Загрузить еще комментарии (${totalComments - comments.length})`
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}; 