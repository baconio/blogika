'use client';

import { Button } from '@/components/ui/Button';

/**
 * Пропсы компонента кнопок шаринга
 */
interface ShareButtonsProps {
  readonly url: string;
  readonly title: string;
  readonly description?: string;
  readonly platforms?: readonly SharePlatform[];
  readonly variant?: 'default' | 'compact';
}

/**
 * Поддерживаемые платформы для шаринга
 */
type SharePlatform = 'twitter' | 'facebook' | 'linkedin' | 'telegram' | 'vkontakte' | 'copy';

/**
 * Конфигурация платформ шаринга
 */
const SHARE_PLATFORMS = {
  twitter: {
    name: 'Twitter',
    icon: '𝕏',
    color: '#000000',
    getUrl: (url: string, title: string) => 
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
  },
  facebook: {
    name: 'Facebook',
    icon: '📘',
    color: '#1877f2',
    getUrl: (url: string) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  },
  linkedin: {
    name: 'LinkedIn',
    icon: '💼',
    color: '#0077b5',
    getUrl: (url: string, title: string) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
  },
  telegram: {
    name: 'Telegram',
    icon: '✈️',
    color: '#229ed9',
    getUrl: (url: string, title: string) => 
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
  },
  vkontakte: {
    name: 'VKontakte',
    icon: '🔵',
    color: '#4c75a3',
    getUrl: (url: string, title: string) => 
      `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
  }
};

/**
 * Копирует ссылку в буфер обмена
 * @param url - URL для копирования
 * @returns Promise<boolean> - успешность операции
 */
const copyToClipboard = async (url: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    // Fallback для старых браузеров
    const textArea = document.createElement('textarea');
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
};

/**
 * Компонент кнопок для шаринга статьи в социальных сетях
 * @param url - URL статьи для шаринга
 * @param title - заголовок статьи
 * @param description - описание статьи
 * @param platforms - список платформ для отображения
 * @param variant - вариант отображения кнопок
 * @returns JSX элемент с кнопками шаринга
 */
export const ShareButtons = ({
  url,
  title,
  description,
  platforms = ['twitter', 'facebook', 'telegram', 'vkontakte', 'copy'],
  variant = 'default'
}: ShareButtonsProps) => {
  const fullUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${url}` 
    : url;

  const handleShare = (platform: SharePlatform) => {
    if (platform === 'copy') {
      copyToClipboard(fullUrl).then(() => {
        // Можно добавить уведомление об успешном копировании
        console.log('URL скопирован в буфер обмена');
      });
      return;
    }

    const config = SHARE_PLATFORMS[platform];
    if (config) {
      const shareUrl = config.getUrl(fullUrl, title);
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const buttonSize = variant === 'compact' ? 'sm' : 'md';
  const containerClass = variant === 'compact' 
    ? 'flex gap-2' 
    : 'flex flex-wrap gap-3 justify-center';

  return (
    <div className="text-center">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Поделиться статьей
      </h3>
      
      <div className={containerClass}>
        {platforms.map((platform) => {
          if (platform === 'copy') {
            return (
              <Button
                key={platform}
                onClick={() => handleShare(platform)}
                variant="outline"
                size={buttonSize}
                className="flex items-center gap-2"
              >
                📋 Копировать
              </Button>
            );
          }

          const config = SHARE_PLATFORMS[platform];
          return (
            <Button
              key={platform}
              onClick={() => handleShare(platform)}
              variant="outline"
              size={buttonSize}
              className="flex items-center gap-2"
              style={{ borderColor: config.color }}
            >
              <span>{config.icon}</span>
              {variant === 'default' && <span>{config.name}</span>}
            </Button>
          );
        })}
      </div>
    </div>
  );
}; 