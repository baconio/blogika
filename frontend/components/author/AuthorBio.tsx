'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

/**
 * Пропсы компонента биографии автора
 */
interface AuthorBioProps {
  readonly authorId: string;
  readonly bio: string;
  readonly isOwner?: boolean;
  readonly onUpdateBio?: (bio: string) => Promise<void>;
}

/**
 * Компонент биографии автора
 * Отображает биографию с возможностью редактирования для владельца
 * @param authorId - ID автора
 * @param bio - текст биографии
 * @param isOwner - является ли текущий пользователь владельцем
 * @param onUpdateBio - обработчик обновления биографии
 * @returns JSX элемент биографии автора
 */
export const AuthorBio = ({
  authorId,
  bio,
  isOwner = false,
  onUpdateBio
}: AuthorBioProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedBio, setEditedBio] = useState(bio);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Обрезаем биографию для краткого отображения
  const bioText = bio.replace(/<[^>]*>/g, ''); // Убираем HTML теги для подсчета
  const isLong = bioText.length > 300;
  const displayBio = isLong && !isExpanded 
    ? bioText.substring(0, 300) + '...' 
    : bioText;

  const handleSaveBio = async () => {
    if (!onUpdateBio || editedBio.trim() === bio.trim()) {
      setShowEditModal(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdateBio(editedBio.trim());
      setShowEditModal(false);
    } catch (error) {
      console.error('Ошибка при обновлении биографии:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedBio(bio);
    setShowEditModal(false);
  };

  if (!bio && !isOwner) {
    return null;
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            📝 О себе
          </h3>
          
          {isOwner && (
            <Button
              onClick={() => setShowEditModal(true)}
              variant="outline"
              size="sm"
            >
              {bio ? 'Редактировать' : 'Добавить биографию'}
            </Button>
          )}
        </div>

        {bio ? (
          <div className="space-y-4">
            {/* Биография */}
            <div className="prose prose-sm max-w-none text-gray-700">
              <p className="whitespace-pre-wrap">
                {displayBio}
              </p>
            </div>

            {/* Кнопка "Показать еще" */}
            {isLong && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                {isExpanded ? 'Скрыть' : 'Показать полностью'}
              </button>
            )}
          </div>
        ) : isOwner ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-3">✍️</div>
            <p className="text-gray-500 mb-4">
              Расскажите читателям о себе
            </p>
            <Button
              onClick={() => setShowEditModal(true)}
              variant="primary"
              size="sm"
            >
              Добавить биографию
            </Button>
          </div>
        ) : null}
      </div>

      {/* Модал редактирования биографии */}
      <Modal
        isOpen={showEditModal}
        onClose={handleCancelEdit}
        title="Редактирование биографии"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Расскажите о себе
            </label>
            <textarea
              value={editedBio}
              onChange={(e) => setEditedBio(e.target.value)}
              placeholder="Опишите свой опыт, интересы, достижения..."
              rows={8}
              maxLength={2000}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>Используйте обычный текст, HTML не поддерживается</span>
              <span>{editedBio.length}/2000</span>
            </div>
          </div>

          {/* Предварительный просмотр */}
          {editedBio.trim() && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Предварительный просмотр:
              </h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {editedBio.trim()}
                </p>
              </div>
            </div>
          )}

          {/* Кнопки действий */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={handleCancelEdit}
              variant="outline"
              disabled={isUpdating}
            >
              Отмена
            </Button>
            <Button
              onClick={handleSaveBio}
              variant="primary"
              disabled={isUpdating || editedBio.trim().length === 0}
            >
              {isUpdating ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}; 