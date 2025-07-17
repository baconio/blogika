'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

/**
 * Типы подписок
 */
type SubscriptionPlan = 'monthly' | 'yearly' | 'lifetime';

/**
 * Пропсы компонента кнопки платной подписки
 */
interface SubscribeButtonProps {
  readonly authorId: string;
  readonly isSubscribed?: boolean;
  readonly subscriptionPlan?: SubscriptionPlan;
  readonly monthlyPrice?: number;
  readonly yearlyPrice?: number;
  readonly lifetimePrice?: number;
  readonly onSubscribe: (authorId: string, plan: SubscriptionPlan) => Promise<void>;
  readonly onManageSubscription?: (authorId: string) => void;
  readonly disabled?: boolean;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly showPrices?: boolean;
  readonly currency?: string;
  readonly fullWidth?: boolean;
}

/**
 * Компонент кнопки платной подписки на автора
 * Поддерживает различные планы подписки и цены
 * @param authorId - ID автора
 * @param isSubscribed - активна ли подписка
 * @param subscriptionPlan - текущий план подписки
 * @param monthlyPrice - цена месячной подписки
 * @param yearlyPrice - цена годовой подписки
 * @param lifetimePrice - цена пожизненной подписки
 * @param onSubscribe - обработчик оформления подписки
 * @param onManageSubscription - обработчик управления подпиской
 * @param disabled - отключена ли кнопка
 * @param size - размер кнопки
 * @param showPrices - показывать ли цены
 * @param currency - валюта
 * @param fullWidth - растянуть кнопку на всю ширину
 * @returns JSX элемент кнопки платной подписки
 */
export const SubscribeButton = ({
  authorId,
  isSubscribed = false,
  subscriptionPlan,
  monthlyPrice = 299,
  yearlyPrice = 2990,
  lifetimePrice = 9990,
  onSubscribe,
  onManageSubscription,
  disabled = false,
  size = 'md',
  showPrices = true,
  currency = '₽',
  fullWidth = false
}: SubscribeButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('monthly');
  const [showPlans, setShowPlans] = useState(false);

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (disabled || isLoading) return;

    setIsLoading(true);

    try {
      await onSubscribe(authorId, plan);
      setShowPlans(false);
    } catch (error) {
      console.error('Ошибка при оформлении подписки:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManage = () => {
    onManageSubscription?.(authorId);
  };

  // Форматирование цены
  const formatPrice = (price: number): string => {
    return `${price} ${currency}`;
  };

  // Получить цену для выбранного плана
  const getPriceForPlan = (plan: SubscriptionPlan): number => {
    switch (plan) {
      case 'monthly': return monthlyPrice;
      case 'yearly': return yearlyPrice;
      case 'lifetime': return lifetimePrice;
      default: return monthlyPrice;
    }
  };

  // Получить описание плана
  const getPlanDescription = (plan: SubscriptionPlan): string => {
    switch (plan) {
      case 'monthly': return 'в месяц';
      case 'yearly': return 'в год';
      case 'lifetime': return 'навсегда';
      default: return '';
    }
  };

  // Получить скидку для годового плана
  const getYearlyDiscount = (): number => {
    const monthlyYearly = monthlyPrice * 12;
    const discount = ((monthlyYearly - yearlyPrice) / monthlyYearly) * 100;
    return Math.round(discount);
  };

  if (isSubscribed) {
    return (
      <div className={`${fullWidth ? 'w-full' : 'inline-block'}`}>
        <Button
          onClick={handleManage}
          disabled={disabled}
          size={size}
          variant="outline"
          className={`${fullWidth ? 'w-full justify-center' : ''} border-green-300 text-green-700 bg-green-50`}
        >
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>Подписка активна</span>
            {subscriptionPlan && (
              <span className="text-xs opacity-75">
                ({subscriptionPlan === 'monthly' ? 'месячная' : 
                  subscriptionPlan === 'yearly' ? 'годовая' : 'пожизненная'})
              </span>
            )}
          </div>
        </Button>
      </div>
    );
  }

  return (
    <div className={`${fullWidth ? 'w-full' : 'inline-block'} relative`}>
      {/* Основная кнопка */}
      <Button
        onClick={() => setShowPlans(!showPlans)}
        disabled={disabled || isLoading}
        size={size}
        variant="primary"
        className={`${fullWidth ? 'w-full justify-center' : ''} bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700`}
      >
        <div className="flex items-center gap-2">
          <span>👑</span>
          <span>Подписаться</span>
          {showPrices && (
            <span className="text-xs opacity-90">
              от {formatPrice(monthlyPrice)}/мес
            </span>
          )}
        </div>
      </Button>

      {/* Выпадающее меню с планами */}
      {showPlans && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4 space-y-3">
          {/* Заголовок */}
          <div className="text-center">
            <h4 className="font-semibold text-gray-900">Выберите план</h4>
            <p className="text-xs text-gray-600">Получите доступ к эксклюзивному контенту</p>
          </div>

          {/* Варианты планов */}
          <div className="space-y-2">
            {/* Месячный план */}
            <button
              onClick={() => handleSubscribe('monthly')}
              disabled={isLoading}
              className="w-full p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">Месячная подписка</div>
                  <div className="text-xs text-gray-600">Отменить в любой момент</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-blue-600">{formatPrice(monthlyPrice)}</div>
                  <div className="text-xs text-gray-500">в месяц</div>
                </div>
              </div>
            </button>

            {/* Годовой план */}
            <button
              onClick={() => handleSubscribe('yearly')}
              disabled={isLoading}
              className="w-full p-3 border-2 border-blue-300 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left relative"
            >
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Скидка {getYearlyDiscount()}%
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">Годовая подписка</div>
                  <div className="text-xs text-gray-600">Экономия {formatPrice(monthlyPrice * 12 - yearlyPrice)}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-blue-600">{formatPrice(yearlyPrice)}</div>
                  <div className="text-xs text-gray-500">в год</div>
                </div>
              </div>
            </button>

            {/* Пожизненный план */}
            <button
              onClick={() => handleSubscribe('lifetime')}
              disabled={isLoading}
              className="w-full p-3 border border-purple-300 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">Пожизненная подписка</div>
                  <div className="text-xs text-gray-600">Один платеж, доступ навсегда</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-purple-600">{formatPrice(lifetimePrice)}</div>
                  <div className="text-xs text-gray-500">навсегда</div>
                </div>
              </div>
            </button>
          </div>

          {/* Кнопка закрытия */}
          <button
            onClick={() => setShowPlans(false)}
            className="w-full text-center text-xs text-gray-500 hover:text-gray-700 py-2"
          >
            Закрыть
          </button>
        </div>
      )}

      {/* Затемнение при открытом меню */}
      {showPlans && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowPlans(false)}
        />
      )}
    </div>
  );
}; 