'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

/**
 * Платформы для шаринга
 */
interface SharePlatform {
  readonly name: string;
  readonly icon: string;
  readonly color: string;
  readonly getUrl: (url: string, title: string, text?: string) => string;
}

/**
 * Пропсы компонента модала шаринга
 */
interface ShareModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly url: string;
  readonly title: string;
  readonly excerpt?: string;
  readonly author?: string;
  readonly imageUrl?: string;
}

/**
 * Модал для расширенного шаринга статей
 * Поддерживает множество платформ и копирование ссылки
 * @param isOpen - открыт ли модал
 * @param onClose - обработчик закрытия
 * @param url - URL для шаринга
 * @param title - заголовок статьи
 * @param excerpt - краткое описание
 * @param author - автор статьи
 * @param imageUrl - изображение для шаринга
 * @returns JSX элемент модала шаринга
 */
export const ShareModal = ({
  isOpen,
  onClose,
  url,
  title,
  excerpt = '',
  author = '',
  imageUrl = ''
}: ShareModalProps) => {
  const [copied, setCopied] = useState(false);

  // Конфигурация платформ для шаринга
  const platforms: SharePlatform[] = [
    {
      name: 'Twitter',
      icon: '🐦',
      color: 'hover:bg-blue-50 hover:text-blue-600',
      getUrl: (url, title, text) => 
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`${title}${author ? ` от ${author}` : ''}`)}`
    },
    {
      name: 'Facebook',
      icon: '📘',
      color: 'hover:bg-blue-50 hover:text-blue-700',
      getUrl: (url, title) => 
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      color: 'hover:bg-blue-50 hover:text-blue-800',
      getUrl: (url, title, text) => 
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text || excerpt)}`
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: 'hover:bg-blue-50 hover:text-blue-500',
      getUrl: (url, title) => 
        `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    },
    {
      name: 'VKontakte',
      icon: '🇷🇺',
      color: 'hover:bg-blue-50 hover:text-blue-600',
      getUrl: (url, title) => 
        `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(excerpt)}`
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      color: 'hover:bg-green-50 hover:text-green-600',
      getUrl: (url, title) => 
        `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`
    },
    {
      name: 'Reddit',
      icon: '🔴',
      color: 'hover:bg-orange-50 hover:text-orange-600',
      getUrl: (url, title) => 
        `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
    },
    {
      name: 'Email',
      icon: '📧',
      color: 'hover:bg-gray-50 hover:text-gray-600',
      getUrl: (url, title, text) => 
        `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text || excerpt}\n\nЧитать полностью: ${url}`)}`
    }
  ];

  const handleShare = (platform: SharePlatform) => {
    const shareUrl = platform.getUrl(url, title, excerpt);
    
    if (platform.name === 'Email') {
      window.location.href = shareUrl;
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Ошибка копирования:', error);
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Поделиться статьей"
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Информация о статье */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
            {title}
          </h3>
          {excerpt && (
            <p className="text-sm text-gray-600 line-clamp-3 mb-2">
              {excerpt}
            </p>
          )}
          {author && (
            <p className="text-xs text-gray-500">
              Автор: {author}
            </p>
          )}
        </div>

        {/* Копирование ссылки */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Ссылка на статью
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
            />
            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="sm"
              className={copied ? 'bg-green-50 border-green-300 text-green-700' : ''}
            >
              {copied ? '✓ Скопировано' : 'Копировать'}
            </Button>
          </div>
        </div>

        {/* Платформы для шаринга */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            Поделиться в социальных сетях
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            {platforms.map((platform) => (
              <button
                key={platform.name}
                onClick={() => handleShare(platform)}
                className={`
                  flex items-center gap-3 p-3 border border-gray-200 rounded-lg
                  transition-colors duration-200 text-left
                  ${platform.color}
                `}
              >
                <span className="text-lg">{platform.icon}</span>
                <span className="text-sm font-medium">{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Дополнительные опции */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Поделиться через</span>
            <button
              onClick={() => {
                if (navigator.share && navigator.canShare({ url, title })) {
                  navigator.share({ url, title, text: excerpt });
                }
              }}
              className="text-blue-600 hover:text-blue-800"
              style={{
                display: navigator.share ? 'block' : 'none'
              }}
            >
              Системный диалог
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}; 