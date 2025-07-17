'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

/**
 * Пропсы компонента формы комментария
 */
interface CommentFormProps {
  readonly currentUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
  readonly parentId?: string;
  readonly placeholder?: string;
  readonly submitText?: string;
  readonly onSubmit: (content: string, parentId?: string) => Promise<void>;
  readonly onCancel?: () => void;
  readonly isLoading?: boolean;
  readonly maxLength?: number;
}

/**
 * Компонент формы для добавления комментариев
 * Поддерживает ответы на комментарии и валидацию
 * @param currentUser - данные текущего пользователя
 * @param parentId - ID родительского комментария для ответов
 * @param placeholder - плейсхолдер для текстового поля
 * @param submitText - текст кнопки отправки
 * @param onSubmit - обработчик отправки комментария
 * @param onCancel - обработчик отмены (для ответов)
 * @param isLoading - состояние загрузки
 * @param maxLength - максимальная длина комментария
 * @returns JSX элемент формы комментария
 */
export const CommentForm = ({
  currentUser,
  parentId,
  placeholder = 'Написать комментарий...',
  submitText = 'Опубликовать',
  onSubmit,
  onCancel,
  isLoading = false,
  maxLength = 1000
}: CommentFormProps) => {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');

  const isReply = Boolean(parentId);
  const remainingChars = maxLength - content.length;
  const isValid = content.trim().length > 0 && content.length <= maxLength;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) {
      setError('Комментарий не может быть пустым');
      return;
    }

    if (!currentUser) {
      setError('Необходимо войти в систему для комментирования');
      return;
    }

    try {
      setError('');
      await onSubmit(content.trim(), parentId);
      setContent('');
      setIsFocused(false);
      onCancel?.(); // Закрываем форму ответа после отправки
    } catch (err) {
      setError('Ошибка при отправке комментария. Попробуйте еще раз.');
    }
  };

  const handleCancel = () => {
    setContent('');
    setIsFocused(false);
    setError('');
    onCancel?.();
  };

  // Если пользователь не авторизован
  if (!currentUser) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600 mb-3">
          Войдите в систему, чтобы оставить комментарий
        </p>
        <Button variant="primary">
          Войти
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {isReply && (
        <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
          💬 Ответ на комментарий
        </div>
      )}

      <div className="flex gap-3">
        {/* Аватар пользователя */}
        <div className="flex-shrink-0">
          <Avatar
            src={currentUser.avatar}
            alt={currentUser.name}
            size="sm"
          />
        </div>

        {/* Текстовое поле */}
        <div className="flex-grow">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={isFocused ? 4 : 2}
            className={`w-full px-3 py-2 border rounded-lg resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />

          {/* Счетчик символов */}
          {isFocused && (
            <div className="flex justify-between items-center mt-2 text-xs">
              <span className={remainingChars < 0 ? 'text-red-500' : 'text-gray-500'}>
                {remainingChars} символов осталось
              </span>
              
              {error && (
                <span className="text-red-500">{error}</span>
              )}
            </div>
          )}

          {/* Кнопки действий */}
          {isFocused && (
            <div className="flex justify-end gap-2 mt-3">
              {(isReply || content.trim()) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Отмена
                </Button>
              )}
              
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!isValid || isLoading}
                className="min-w-[100px]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Отправка...</span>
                  </div>
                ) : (
                  submitText
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}; 