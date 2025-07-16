/**
 * @fileoverview PremiumSettings component for configuring paid content
 * Features: access levels, pricing models, preview settings, revenue projection
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { 
  LockClosedIcon, 
  CurrencyDollarIcon, 
  EyeIcon,
  ChartBarIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';
import type { 
  PremiumSettingsProps,
  ContentAccessLevel,
  PricingModel,
  RevenueProjection,
  DEFAULT_PREMIUM_CONFIG,
  DEFAULT_PREVIEW_CONFIG,
  SUPPORTED_CURRENCIES 
} from './PremiumSettings.types';

/**
 * PremiumSettings component for configuring monetization options
 * Supports access levels, pricing models, and preview configuration
 */
export const PremiumSettings: React.FC<PremiumSettingsProps> = ({
  premiumConfig,
  onConfigChange,
  availableTiers,
  paymentConfig,
  previewConfig = DEFAULT_PREVIEW_CONFIG,
  analyticsConfig,
  disabled = false,
  error,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'access' | 'pricing' | 'preview' | 'analytics'>('access');

  /**
   * Handles access level change
   */
  const handleAccessLevelChange = useCallback((level: ContentAccessLevel) => {
    const updatedConfig = {
      ...premiumConfig,
      accessLevel: level,
      price: level === 'free' ? 0 : premiumConfig.price
    };
    onConfigChange(updatedConfig);
  }, [premiumConfig, onConfigChange]);

  /**
   * Handles pricing model change
   */
  const handlePricingChange = useCallback((
    model: PricingModel, 
    price: number, 
    currency: string
  ) => {
    const updatedConfig = {
      ...premiumConfig,
      pricingModel: model,
      price,
      currency
    };
    onConfigChange(updatedConfig);
  }, [premiumConfig, onConfigChange]);

  /**
   * Handles preview settings change
   */
  const handlePreviewSettingsChange = useCallback((field: string, value: any) => {
    const updatedConfig = {
      ...premiumConfig,
      [field]: value
    };
    onConfigChange(updatedConfig);
  }, [premiumConfig, onConfigChange]);

  /**
   * Calculates revenue projection based on current settings
   */
  const revenueProjection = useMemo((): RevenueProjection => {
    if (premiumConfig.accessLevel === 'free' || premiumConfig.price === 0) {
      return {
        estimatedViews: 0,
        conversionRate: 0,
        estimatedRevenue: 0,
        period: 'monthly'
      };
    }

    // Simple projection based on typical conversion rates
    const baseViews = 1000; // Estimated monthly views
    const conversionRate = premiumConfig.accessLevel === 'premium' ? 0.02 : 0.005; // 2% vs 0.5%
    const estimatedPurchases = baseViews * conversionRate;
    const estimatedRevenue = estimatedPurchases * premiumConfig.price;

    return {
      estimatedViews: baseViews,
      conversionRate: conversionRate * 100,
      estimatedRevenue,
      period: 'monthly'
    };
  }, [premiumConfig]);

  return (
    <div className={`premium-settings bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6 pt-4">
          {[
            { id: 'access', label: 'Доступ', icon: LockClosedIcon },
            { id: 'pricing', label: 'Цена', icon: CurrencyDollarIcon },
            { id: 'preview', label: 'Превью', icon: EyeIcon },
            { id: 'analytics', label: 'Аналитика', icon: ChartBarIcon }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id as any)}
              disabled={disabled}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } disabled:opacity-50`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {/* Access Level Tab */}
        {activeTab === 'access' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Уровень доступа</h3>
              
              <div className="grid gap-4">
                {[
                  {
                    level: 'free' as ContentAccessLevel,
                    title: 'Бесплатно',
                    description: 'Доступно всем читателям',
                    icon: '🌍'
                  },
                  {
                    level: 'premium' as ContentAccessLevel,
                    title: 'Премиум',
                    description: 'Разовая покупка статьи',
                    icon: '💎'
                  },
                  {
                    level: 'subscription_only' as ContentAccessLevel,
                    title: 'Только подписчики',
                    description: 'Доступно подписчикам автора',
                    icon: '⭐'
                  }
                ].map(({ level, title, description, icon }) => (
                  <label
                    key={level}
                    className={`relative flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      premiumConfig.accessLevel === level
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="radio"
                      name="accessLevel"
                      value={level}
                      checked={premiumConfig.accessLevel === level}
                      onChange={() => handleAccessLevelChange(level)}
                      disabled={disabled}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{title}</div>
                        <div className="text-sm text-gray-500">{description}</div>
                      </div>
                    </div>
                    {premiumConfig.accessLevel === level && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Additional settings */}
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={premiumConfig.enableComments}
                  onChange={(e) => handlePreviewSettingsChange('enableComments', e.target.checked)}
                  disabled={disabled}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Разрешить комментарии</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={premiumConfig.enableSharing}
                  onChange={(e) => handlePreviewSettingsChange('enableSharing', e.target.checked)}
                  disabled={disabled}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Разрешить поделиться</span>
              </label>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && premiumConfig.accessLevel !== 'free' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Настройки цены</h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Price input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Цена
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={premiumConfig.price}
                      onChange={(e) => handlePricingChange(
                        premiumConfig.pricingModel,
                        parseFloat(e.target.value) || 0,
                        premiumConfig.currency
                      )}
                      disabled={disabled}
                      className="block w-full pl-3 pr-12 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500 text-sm">
                        {SUPPORTED_CURRENCIES.find(c => c.code === premiumConfig.currency)?.symbol}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Currency selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Валюта
                  </label>
                  <select
                    value={premiumConfig.currency}
                    onChange={(e) => handlePricingChange(
                      premiumConfig.pricingModel,
                      premiumConfig.price,
                      e.target.value
                    )}
                    disabled={disabled}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  >
                    {SUPPORTED_CURRENCIES.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Revenue projection */}
              {revenueProjection.estimatedRevenue > 0 && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ChartBarIcon className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Прогноз доходов</span>
                  </div>
                  <div className="text-sm text-green-700">
                    <div>Ожидаемых просмотров: {revenueProjection.estimatedViews.toLocaleString()}/месяц</div>
                    <div>Конверсия: {revenueProjection.conversionRate.toFixed(1)}%</div>
                    <div className="font-medium">
                      Доход: {revenueProjection.estimatedRevenue.toLocaleString()} {premiumConfig.currency}/месяц
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && premiumConfig.accessLevel !== 'free' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Настройки превью</h3>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={premiumConfig.allowPreviews}
                    onChange={(e) => handlePreviewSettingsChange('allowPreviews', e.target.checked)}
                    disabled={disabled}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Показывать превью бесплатно</span>
                </label>

                {premiumConfig.allowPreviews && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Длина превью (слов)
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="500"
                      value={premiumConfig.previewLength}
                      onChange={(e) => handlePreviewSettingsChange('previewLength', parseInt(e.target.value) || 150)}
                      disabled={disabled}
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Рекомендуется 100-200 слов для лучшей конверсии
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analyticsConfig && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Отслеживание</h3>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={analyticsConfig.trackViews}
                    disabled={disabled}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Отслеживать просмотры</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={analyticsConfig.trackPurchases}
                    disabled={disabled}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Отслеживать покупки</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={analyticsConfig.trackRevenue}
                    disabled={disabled}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Отслеживать доходы</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {premiumConfig.accessLevel === 'free' && activeTab !== 'access' && (
          <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <InformationCircleIcon className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-700">
              Настройки доступны только для платного контента
            </span>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="px-6 pb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}; 