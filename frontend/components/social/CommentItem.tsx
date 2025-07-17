'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Comment } from '@/types/Comment';
import { formatDate } from '@/lib/utils/formatting';

/**
 * Пропсы компонента комментария
 */
interface CommentItemProps {
  readonly comment: Comment;
  readonly currentUserId?: string;
  readonly canModerate?: boolean;
  readonly onReply?: (commentId: string) => void;
  readonly onLike?: (commentId: string) => void;
  readonly onEdit?: (commentId: string) => void;
  readonly onDelete?: (commentId: string) => void;
  readonly onModerate?: (commentId: string, action: 'approve' | 'reject') => void;
}

/**
 * Получает статус модерации в читаемом виде
 * @param status - статус модерации
 * @returns описание статуса
 */
const getModerationStatusLabel = (status: string): string => {
  switch (status) {
    case 'pending': return 'На модерации';
    case 'approved': return 'Одобрен';
    case 'rejected': return 'Отклонен';
    default: return 'Неизвестно';
  }
};

/**
 * Компонент отдельного комментария
 * Поддерживает лайки, ответы, редактирование и модерацию
 * @param comment - данные комментария
 * @param currentUserId - ID текущего пользователя
 * @param canModerate - может ли пользователь модерировать
 * @param onReply - обработчик ответа на комментарий
 * @param onLike - обработчик лайка комментария
 * @param onEdit - обработчик редактирования
 * @param onDelete - обработчик удаления
 * @param onModerate - обработчик модерации
 * @returns JSX элемент комментария
 */
export const CommentItem = ({
  comment,
  currentUserId,
  canModerate = false,
  onReply,
  onLike,
  onEdit,
  onDelete,
  onModerate
}: CommentItemProps) => {
  const [showActions, setShowActions] = useState(false);
  const isAuthor = currentUserId === comment.author?.id;
  const isPending = comment.moderationStatus === 'pending';
  const isRejected = comment.moderationStatus === 'rejected';

  return (
    <div 
      className={`p-4 border rounded-lg ${
        isPending ? 'bg-yellow-50 border-yellow-200' : 
        isRejected ? 'bg-red-50 border-red-200' : 
        'bg-white border-gray-200'
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex gap-3">
        {/* Аватар автора */}
        <div className="flex-shrink-0">
          <Avatar
            src={comment.author?.avatar}
            alt={comment.author?.name || 'Пользователь'}
            size="sm"
          />
        </div>

        {/* Контент комментария */}
        <div className="flex-grow min-w-0">
          {/* Заголовок */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-gray-900">
              {comment.author?.name || 'Анонимный пользователь'}
            </span>
            
            <time className="text-xs text-gray-500">
              {formatDate(comment.createdAt)}
            </time>

            {/* Статус модерации */}
            {canModerate && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                isPending ? 'bg-yellow-100 text-yellow-800' :
                isRejected ? 'bg-red-100 text-red-800' :
                'bg-green-100 text-green-800'
              }`}>
                {getModerationStatusLabel(comment.moderationStatus || 'approved')}
              </span>
            )}

            {/* Закрепленный комментарий */}
            {comment.isPinned && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                📌 Закреплен
              </span>
            )}
          </div>

          {/* Текст комментария */}
          <div className="text-gray-800 mb-3 leading-relaxed">
            {comment.content}
          </div>

          {/* Действия */}
          <div className={`flex items-center gap-4 transition-opacity duration-200 ${
            showActions ? 'opacity-100' : 'opacity-60'
          }`}>
            {/* Лайк */}
            <button
              onClick={() => onLike?.(comment.id)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              <span className={comment.isLiked ? '❤️' : '🤍'}>
                {comment.isLiked ? '❤️' : '🤍'}
              </span>
              {comment.likesCount || 0}
            </button>

            {/* Ответить */}
            <button
              onClick={() => onReply?.(comment.id)}
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              Ответить
            </button>

            {/* Действия автора */}
            {isAuthor && (
              <>
                <button
                  onClick={() => onEdit?.(comment.id)}
                  className="text-sm text-gray-500 hover:text-green-600 transition-colors"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => onDelete?.(comment.id)}
                  className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  Удалить
                </button>
              </>
            )}

            {/* Действия модератора */}
            {canModerate && isPending && (
              <div className="flex gap-2 ml-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onModerate?.(comment.id, 'approve')}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  Одобрить
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onModerate?.(comment.id, 'reject')}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Отклонить
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 