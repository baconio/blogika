'use client';

import { useState } from 'react';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { Comment } from '@/types/Comment';
import { Button } from '@/components/ui/Button';

/**
 * Пропсы компонента ответов на комментарии
 */
interface CommentRepliesProps {
  readonly parentId: string;
  readonly replies: Comment[];
  readonly currentUserId?: string;
  readonly currentUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
  readonly canModerate?: boolean;
  readonly showReplyForm?: boolean;
  readonly totalReplies?: number;
  readonly onLoadMore?: (parentId: string) => Promise<void>;
  readonly onSubmitReply: (content: string, parentId: string) => Promise<void>;
  readonly onToggleReplyForm?: () => void;
  readonly onLike?: (commentId: string) => void;
  readonly onEdit?: (commentId: string) => void;
  readonly onDelete?: (commentId: string) => void;
  readonly onModerate?: (commentId: string, action: 'approve' | 'reject') => void;
}

/**
 * Компонент для отображения ответов на комментарии
 * Поддерживает вложенность, пагинацию и все действия с комментариями
 * @param parentId - ID родительского комментария
 * @param replies - массив ответов
 * @param currentUserId - ID текущего пользователя
 * @param currentUser - данные текущего пользователя
 * @param canModerate - может ли пользователь модерировать
 * @param showReplyForm - показывать ли форму ответа
 * @param totalReplies - общее количество ответов
 * @param onLoadMore - обработчик загрузки дополнительных ответов
 * @param onSubmitReply - обработчик отправки ответа
 * @param onToggleReplyForm - переключение формы ответа
 * @param onLike - обработчик лайка
 * @param onEdit - обработчик редактирования
 * @param onDelete - обработчик удаления
 * @param onModerate - обработчик модерации
 * @returns JSX элемент с ответами на комментарий
 */
export const CommentReplies = ({
  parentId,
  replies,
  currentUserId,
  currentUser,
  canModerate = false,
  showReplyForm = false,
  totalReplies = 0,
  onLoadMore,
  onSubmitReply,
  onToggleReplyForm,
  onLike,
  onEdit,
  onDelete,
  onModerate
}: CommentRepliesProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const hasMoreReplies = totalReplies > replies.length;

  const handleLoadMore = async () => {
    if (!onLoadMore || isLoading) return;
    
    setIsLoading(true);
    try {
      await onLoadMore(parentId);
    } catch (error) {
      console.error('Ошибка загрузки ответов:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplySubmit = async (content: string) => {
    await onSubmitReply(content, parentId);
    onToggleReplyForm?.(); // Скрываем форму после отправки
  };

  if (replies.length === 0 && !showReplyForm) {
    return null;
  }

  return (
    <div className="ml-8 mt-4 space-y-4">
      {/* Индикатор вложенности */}
      <div className="relative">
        <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
        
        <div className="space-y-4">
          {/* Список ответов */}
          {replies.map((reply) => (
            <div key={reply.id} className="relative">
              <CommentItem
                comment={reply}
                currentUserId={currentUserId}
                canModerate={canModerate}
                onLike={onLike}
                onEdit={onEdit}
                onDelete={onDelete}
                onModerate={onModerate}
                // Для ответов отключаем возможность отвечать (избегаем глубокой вложенности)
              />
            </div>
          ))}

          {/* Кнопка "Загрузить еще" */}
          {hasMoreReplies && (
            <div className="text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadMore}
                disabled={isLoading}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span>Загрузка...</span>
                  </div>
                ) : (
                  `Показать еще ${totalReplies - replies.length} ответов`
                )}
              </Button>
            </div>
          )}

          {/* Форма для ответа */}
          {showReplyForm && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <CommentForm
                currentUser={currentUser}
                parentId={parentId}
                placeholder="Ответить на комментарий..."
                submitText="Ответить"
                onSubmit={handleReplySubmit}
                onCancel={onToggleReplyForm}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 