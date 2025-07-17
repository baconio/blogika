'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Comment } from '@/types/Comment';

/**
 * Пропсы компонента инструментов модерации
 */
interface CommentModerationToolsProps {
  readonly comments: Comment[];
  readonly selectedComments: string[];
  readonly onSelectComment: (commentId: string) => void;
  readonly onSelectAll: () => void;
  readonly onDeselectAll: () => void;
  readonly onBulkModerate: (commentIds: string[], action: 'approve' | 'reject' | 'delete') => Promise<void>;
  readonly onPinComment?: (commentId: string) => Promise<void>;
  readonly onUnpinComment?: (commentId: string) => Promise<void>;
  readonly isLoading?: boolean;
}

/**
 * Компонент инструментов модерации комментариев
 * Позволяет модераторам управлять комментариями массово
 * @param comments - список комментариев
 * @param selectedComments - ID выбранных комментариев
 * @param onSelectComment - обработчик выбора комментария
 * @param onSelectAll - обработчик выбора всех комментариев
 * @param onDeselectAll - обработчик снятия выбора
 * @param onBulkModerate - обработчик массовой модерации
 * @param onPinComment - обработчик закрепления комментария
 * @param onUnpinComment - обработчик открепления комментария
 * @param isLoading - состояние загрузки
 * @returns JSX элемент инструментов модерации
 */
export const CommentModerationTools = ({
  comments,
  selectedComments,
  onSelectComment,
  onSelectAll,
  onDeselectAll,
  onBulkModerate,
  onPinComment,
  onUnpinComment,
  isLoading = false
}: CommentModerationToolsProps) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    action: 'approve' | 'reject' | 'delete';
    commentIds: string[];
  } | null>(null);

  const selectedCount = selectedComments.length;
  const allSelected = selectedCount === comments.length && comments.length > 0;
  
  const pendingComments = comments.filter(c => c.moderationStatus === 'pending');
  const approvedComments = comments.filter(c => c.moderationStatus === 'approved');
  const rejectedComments = comments.filter(c => c.moderationStatus === 'rejected');

  const handleBulkAction = (action: 'approve' | 'reject' | 'delete') => {
    if (selectedCount === 0) return;
    
    setPendingAction({ action, commentIds: selectedComments });
    setShowConfirmModal(true);
  };

  const confirmBulkAction = async () => {
    if (!pendingAction) return;
    
    try {
      await onBulkModerate(pendingAction.commentIds, pendingAction.action);
      onDeselectAll();
    } catch (error) {
      console.error('Ошибка при модерации:', error);
    } finally {
      setShowConfirmModal(false);
      setPendingAction(null);
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'approve': return 'одобрить';
      case 'reject': return 'отклонить';
      case 'delete': return 'удалить';
      default: return 'обработать';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'approve': return 'text-green-600 border-green-600 hover:bg-green-50';
      case 'reject': return 'text-yellow-600 border-yellow-600 hover:bg-yellow-50';
      case 'delete': return 'text-red-600 border-red-600 hover:bg-red-50';
      default: return 'text-gray-600 border-gray-600 hover:bg-gray-50';
    }
  };

  return (
    <>
      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Модерация комментариев
          </h3>
          
          {/* Статистика */}
          <div className="flex items-center gap-4 text-sm">
            <span className="text-yellow-600">
              На модерации: {pendingComments.length}
            </span>
            <span className="text-green-600">
              Одобрено: {approvedComments.length}
            </span>
            <span className="text-red-600">
              Отклонено: {rejectedComments.length}
            </span>
          </div>
        </div>

        {/* Управление выбором */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={allSelected ? onDeselectAll : onSelectAll}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              {selectedCount > 0 
                ? `Выбрано: ${selectedCount}` 
                : 'Выбрать все'
              }
            </span>
          </div>

          {selectedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDeselectAll}
            >
              Сбросить выбор
            </Button>
          )}
        </div>

        {/* Массовые действия */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600 mr-2">
              Действия с выбранными:
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('approve')}
              disabled={isLoading}
              className={getActionColor('approve')}
            >
              ✓ Одобрить ({selectedCount})
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('reject')}
              disabled={isLoading}
              className={getActionColor('reject')}
            >
              ⚠ Отклонить ({selectedCount})
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('delete')}
              disabled={isLoading}
              className={getActionColor('delete')}
            >
              🗑 Удалить ({selectedCount})
            </Button>
          </div>
        )}

        {/* Быстрые фильтры */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Быстрые действия:</span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const pendingIds = pendingComments.map(c => c.id);
                onBulkModerate(pendingIds, 'approve');
              }}
              disabled={pendingComments.length === 0 || isLoading}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              Одобрить все ожидающие ({pendingComments.length})
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const rejectedIds = rejectedComments.map(c => c.id);
                onBulkModerate(rejectedIds, 'delete');
              }}
              disabled={rejectedComments.length === 0 || isLoading}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Удалить отклоненные ({rejectedComments.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Модал подтверждения */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Подтверждение действия"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Вы уверены, что хотите{' '}
            <strong>
              {pendingAction && getActionText(pendingAction.action)}
            </strong>{' '}
            {pendingAction?.commentIds.length} комментариев?
          </p>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
            >
              Отмена
            </Button>
            <Button
              variant="primary"
              onClick={confirmBulkAction}
              disabled={isLoading}
              className={pendingAction?.action === 'delete' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {isLoading ? 'Обработка...' : 'Подтвердить'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}; 