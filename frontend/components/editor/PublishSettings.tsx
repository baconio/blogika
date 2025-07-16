'use client';

/**
 * PublishSettings - настройки публикации статей
 * Микромодуль для управления статусом, доступом и расписанием публикации
 */

import { useState, useCallback } from 'react';
import type { 
  PublishSettingsProps,
  StatusSelectorProps,
  AccessLevelSelectorProps,
  AdvancedSettingsProps,
  PublishSettingsData,
  PublicationStatus,
  AccessLevel,
  StatusInfo,
  AccessLevelInfo
} from './PublishSettings.types';

/**
 * Информация о статусах публикации
 */
const STATUS_INFO: Record<PublicationStatus, StatusInfo> = {
  draft: {
    label: 'Черновик',
    description: 'Статья не видна читателям',
    icon: '📝',
    color: 'text-gray-600 bg-gray-100'
  },
  published: {
    label: 'Опубликовано',
    description: 'Статья доступна для чтения',
    icon: '🌐',
    color: 'text-green-600 bg-green-100'
  },
  scheduled: {
    label: 'Запланировано',
    description: 'Статья будет опубликована автоматически',
    icon: '⏰',
    color: 'text-blue-600 bg-blue-100'
  },
  archived: {
    label: 'В архиве',
    description: 'Статья скрыта от читателей',
    icon: '📦',
    color: 'text-orange-600 bg-orange-100'
  }
};

/**
 * Информация об уровнях доступа
 */
const ACCESS_LEVEL_INFO: Record<AccessLevel, AccessLevelInfo> = {
  free: {
    label: 'Бесплатно',
    description: 'Доступно всем читателям',
    icon: '🆓',
    requiresPrice: false
  },
  premium: {
    label: 'Платно',
    description: 'Требует разовый платеж',
    icon: '💰',
    requiresPrice: true
  },
  subscription_only: {
    label: 'Только подписчики',
    description: 'Доступно подписчикам автора',
    icon: '👥',
    requiresPrice: false
  }
};

/**
 * Селектор статуса публикации
 */
const StatusSelector: React.FC<StatusSelectorProps> = ({
  status,
  onStatusChange,
  disabled = false,
  scheduledAt,
  onScheduledAtChange
}) => {
  const handleStatusChange = useCallback((newStatus: PublicationStatus) => {
    onStatusChange(newStatus);
    
    // Сброс scheduled date если статус не "scheduled"
    if (newStatus !== 'scheduled' && onScheduledAtChange) {
      onScheduledAtChange(undefined);
    }
  }, [onStatusChange, onScheduledAtChange]);

  const formatDateTime = (date: Date): string => {
    return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
  };

  const parseDateTime = (value: string): Date => {
    return new Date(value);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Статус публикации
        </label>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(STATUS_INFO).map(([key, info]) => {
            const isActive = status === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleStatusChange(key as PublicationStatus)}
                disabled={disabled}
                className={`
                  p-3 border rounded-lg text-left transition-all duration-200
                  ${isActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg">{info.icon}</span>
                  <span className="font-medium">{info.label}</span>
                </div>
                <p className="text-xs text-gray-600">{info.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {status === 'scheduled' && onScheduledAtChange && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Дата и время публикации
          </label>
          <input
            type="datetime-local"
            value={scheduledAt ? formatDateTime(scheduledAt) : ''}
            onChange={(e) => onScheduledAtChange(e.target.value ? parseDateTime(e.target.value) : undefined)}
            min={formatDateTime(new Date())}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
};

/**
 * Селектор уровня доступа
 */
const AccessLevelSelector: React.FC<AccessLevelSelectorProps> = ({
  accessLevel,
  onAccessLevelChange,
  price,
  onPriceChange,
  disabled = false
}) => {
  const handleAccessLevelChange = useCallback((newLevel: AccessLevel) => {
    onAccessLevelChange(newLevel);
    
    // Сброс цены если уровень не требует ее
    if (!ACCESS_LEVEL_INFO[newLevel].requiresPrice && onPriceChange) {
      onPriceChange(undefined);
    }
  }, [onAccessLevelChange, onPriceChange]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Уровень доступа
        </label>
        <div className="space-y-2">
          {Object.entries(ACCESS_LEVEL_INFO).map(([key, info]) => {
            const isActive = accessLevel === key;
            return (
              <label
                key={key}
                className={`
                  flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200
                  ${isActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <input
                  type="radio"
                  name="accessLevel"
                  value={key}
                  checked={isActive}
                  onChange={() => handleAccessLevelChange(key as AccessLevel)}
                  disabled={disabled}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-lg">{info.icon}</span>
                  <div>
                    <div className="font-medium">{info.label}</div>
                    <div className="text-xs text-gray-600">{info.description}</div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {ACCESS_LEVEL_INFO[accessLevel].requiresPrice && onPriceChange && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Цена (₽)
          </label>
          <input
            type="number"
            min="1"
            max="10000"
            step="1"
            value={price || ''}
            onChange={(e) => onPriceChange(e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Укажите цену в рублях"
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
};

/**
 * Дополнительные настройки
 */
const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  allowComments,
  allowSharing,
  showInFeed,
  notifySubscribers,
  isFeatured,
  expiresAt,
  onChange,
  disabled = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = useCallback((field: keyof AdvancedSettingsProps, value: boolean) => {
    onChange({ [field]: value });
  }, [onChange]);

  const handleExpiresAtChange = useCallback((value: string) => {
    onChange({ expiresAt: value ? new Date(value) : undefined });
  }, [onChange]);

  const formatDateTime = (date: Date): string => {
    return date.toISOString().slice(0, 16);
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700"
      >
        <span>Дополнительные настройки</span>
        <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className="space-y-4 pt-2 border-t border-gray-100">
          <div className="grid grid-cols-1 gap-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => handleToggle('isFeatured', e.target.checked)}
                disabled={disabled}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">⭐ Рекомендуемая статья</span>
                <p className="text-xs text-gray-500">Показывать в разделе рекомендаций</p>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={allowComments}
                onChange={(e) => handleToggle('allowComments', e.target.checked)}
                disabled={disabled}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">💬 Разрешить комментарии</span>
                <p className="text-xs text-gray-500">Читатели смогут оставлять комментарии</p>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={allowSharing}
                onChange={(e) => handleToggle('allowSharing', e.target.checked)}
                disabled={disabled}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">📤 Разрешить шаринг</span>
                <p className="text-xs text-gray-500">Показывать кнопки соцсетей</p>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={showInFeed}
                onChange={(e) => handleToggle('showInFeed', e.target.checked)}
                disabled={disabled}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">📰 Показывать в ленте</span>
                <p className="text-xs text-gray-500">Отображать в общей ленте статей</p>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={notifySubscribers}
                onChange={(e) => handleToggle('notifySubscribers', e.target.checked)}
                disabled={disabled}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">🔔 Уведомить подписчиков</span>
                <p className="text-xs text-gray-500">Отправить уведомление о новой статье</p>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дата истечения (необязательно)
            </label>
            <input
              type="datetime-local"
              value={expiresAt ? formatDateTime(expiresAt) : ''}
              onChange={(e) => handleExpiresAtChange(e.target.value)}
              min={formatDateTime(new Date())}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              После этой даты статья будет скрыта
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Основной компонент настроек публикации
 */
export const PublishSettings: React.FC<PublishSettingsProps> = ({
  data,
  onChange,
  className = '',
  disabled = false,
  mode = 'create'
}) => {
  const handleChange = useCallback((updates: Partial<PublishSettingsData>) => {
    onChange({ ...data, ...updates });
  }, [data, onChange]);

  return (
    <div className={`publish-settings space-y-6 ${className}`}>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Настройки публикации
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Управляйте статусом, доступом и видимостью вашей статьи
        </p>
      </div>

      <StatusSelector
        status={data.status}
        onStatusChange={(status) => handleChange({ status })}
        scheduledAt={data.scheduledAt}
        onScheduledAtChange={(scheduledAt) => handleChange({ scheduledAt })}
        disabled={disabled}
      />

      <AccessLevelSelector
        accessLevel={data.accessLevel}
        onAccessLevelChange={(accessLevel) => handleChange({ accessLevel })}
        price={data.price}
        onPriceChange={(price) => handleChange({ price })}
        disabled={disabled}
      />

      <AdvancedSettings
        allowComments={data.allowComments}
        allowSharing={data.allowSharing}
        showInFeed={data.showInFeed}
        notifySubscribers={data.notifySubscribers}
        isFeatured={data.isFeatured}
        expiresAt={data.expiresAt}
        onChange={handleChange}
        disabled={disabled}
      />

      {/* Предупреждения и подсказки */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <span className="text-blue-500 text-lg">💡</span>
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Подсказки:</p>
            <ul className="space-y-1 text-xs">
              <li>• Черновики доступны только вам</li>
              <li>• Запланированные статьи публикуются автоматически</li>
              <li>• Платные статьи требуют настройки платежной системы</li>
              <li>• Рекомендуемые статьи показываются на главной странице</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 